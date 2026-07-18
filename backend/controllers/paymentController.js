const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Order = require('../models/order');
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const { items, restaurantId, orderId, totalAmount } = req.body;

    if (!stripe) {
        return next(new ErrorHandler('Stripe is not configured on the server', 503));
    }

    const line_items = (items || []).map(item => ({
        price_data: {
            currency: 'inr',
            product_data: {
                name: item.foodItem.name,
                images: [item.foodItem.images[0]?.url || '']
            },
            unit_amount: Math.round(Number(item.foodItem.price) * 100),
        },
        quantity: Number(item.quantity) || 1,
    }));

    if (line_items.length === 0) {
        return next(new ErrorHandler('Cart is empty', 400));
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-failure?order_id=${orderId}&reason=cancelled`,
            metadata: {
                userId: req.user.id,
                restaurantId: restaurantId ? String(restaurantId) : '',
                orderId: orderId || '',
            },
            customer_email: req.user.email,
        });

        res.status(200).json({
            success: true,
            id: session.id,
            url: session.url,
            amountInPaise: line_items.reduce((total, item) => total + (item.price_data.unit_amount * item.quantity), 0)
        });
    } catch (error) {
        return next(new ErrorHandler(`Stripe error: ${error.message}`, 500));
    }
});

// Stripe webhook handler   =>   /api/v1/payment/webhook
exports.stripeWebhook = catchAsyncErrors(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.warn('Stripe webhook secret not configured - webhook signature verification skipped');
        return res.status(400).json({ error: 'Stripe webhook secret not configured' });
    }

    let event;

    try {
        // Use raw body for signature verification
        const body = req.rawBody || req.body;
        const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
        
        event = stripe.webhooks.constructEvent(
            bodyString,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
        case 'charge.succeeded':
            await handleChargeSucceeded(event.data.object);
            break;
        case 'charge.failed':
            await handleChargeFailed(event.data.object);
            break;
        case 'payment_intent.succeeded':
            await handlePaymentIntentSucceeded(event.data.object);
            break;
        case 'checkout.session.completed':
            await handleCheckoutSessionCompleted(event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Handle successful charge
async function handleChargeSucceeded(charge) {
    try {
        console.log(`Charge succeeded: ${charge.id}`);
        // Update order payment status if needed
    } catch (error) {
        console.error('Error handling charge.succeeded:', error);
    }
}

// Handle failed charge
async function handleChargeFailed(charge) {
    try {
        console.log(`Charge failed: ${charge.id}`);
        // Update order payment status if needed
    } catch (error) {
        console.error('Error handling charge.failed:', error);
    }
}

// Handle successful payment intent
async function handlePaymentIntentSucceeded(paymentIntent) {
    try {
        console.log(`Payment intent succeeded: ${paymentIntent.id}`);
        // Update order payment status
    } catch (error) {
        console.error('Error handling payment_intent.succeeded:', error);
    }
}

// Handle checkout session completed
async function handleCheckoutSessionCompleted(session) {
    try {
        const { metadata } = session;
        
        if (!metadata || !metadata.orderId) {
            console.log('No orderId in session metadata');
            return;
        }

        // Update order status to paid
        const order = await Order.findByIdAndUpdate(
            metadata.orderId,
            {
                'paymentInfo.status': 'completed',
                'paymentInfo.id': session.payment_intent,
                paidAt: new Date()
            },
            { new: true }
        );

        if (order) {
            console.log(`Order ${metadata.orderId} payment marked as completed`);
        }
    } catch (error) {
        console.error('Error handling checkout.session.completed:', error);
    }
}
