const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Send order confirmation email
exports.sendOrderConfirmationEmail = async (order, user) => {
  try {
    if (!process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
      console.log('SMTP credentials not configured, skipping email');
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: user.email,
      subject: `Order Confirmation - CraveCache #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ff6b00; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">CraveCache</h1>
          </div>
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin-top: 0;">Order Confirmed!</h2>
            <p style="color: #6b7280;">Hi ${user.name},</p>
            <p style="color: #6b7280;">Your order has been successfully placed and is being prepared.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin-top: 0;">Order Details</h3>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Order ID:</strong> ${order._id}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.totalPrice.toLocaleString('en-IN')}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Status:</strong> ${order.orderStatus}</p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin-top: 0;">Order Items</h3>
              ${order.orderItems.map(item => `
                <p style="color: #6b7280; margin: 5px 0;">
                  ${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              `).join('')}
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin-top: 0;">Delivery Address</h3>
              <p style="color: #6b7280; margin: 5px 0;">
                ${order.deliveryInfo.address}, ${order.deliveryInfo.city}<br/>
                ${order.deliveryInfo.state} - ${order.deliveryInfo.postalCode}
              </p>
            </div>

            <p style="color: #6b7280; margin: 20px 0;">
              Estimated delivery time: <strong>30-45 minutes</strong>
            </p>

            <p style="color: #6b7280;">Thank you for ordering with CraveCache!</p>
            <p style="color: #6b7280; margin-bottom: 0;">For any queries, contact our support team.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// Send order status update email
exports.sendOrderStatusUpdateEmail = async (order, user, newStatus) => {
  try {
    if (!process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
      console.log('SMTP credentials not configured, skipping email');
      return;
    }

    const transporter = createTransporter();

    const statusMessages = {
      'Confirmed': 'Your order has been confirmed and is being prepared.',
      'Preparing': 'Your order is being prepared by the restaurant.',
      'Ready': 'Your order is ready and waiting for delivery partner.',
      'OutForDelivery': 'Your order is out for delivery and will reach you soon.',
      'Delivered': 'Your order has been delivered successfully!',
      'Cancelled': 'Your order has been cancelled.'
    };

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: user.email,
      subject: `Order Status Update - CraveCache #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ff6b00; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">CraveCache</h1>
          </div>
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin-top: 0;">Order Status Updated</h2>
            <p style="color: #6b7280;">Hi ${user.name},</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin-top: 0;">Order #${order._id}</h3>
              <p style="color: #6b7280; margin: 5px 0;"><strong>New Status:</strong> <span style="color: #ff6b00; font-weight: bold;">${newStatus}</span></p>
              <p style="color: #6b7280; margin: 5px 0;">${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
            </div>

            <p style="color: #6b7280;">Thank you for ordering with CraveCache!</p>
            <p style="color: #6b7280; margin-bottom: 0;">For any queries, contact our support team.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order status update email sent successfully');
  } catch (error) {
    console.error('Error sending order status update email:', error);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetToken) => {
  try {
    if (!process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
      console.log('SMTP credentials not configured, skipping email');
      return;
    }

    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: user.email,
      subject: 'Password Reset Request - CraveCache',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ff6b00; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">CraveCache</h1>
          </div>
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #6b7280;">Hi ${user.name},</p>
            <p style="color: #6b7280;">We received a request to reset your password. Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ff6b00; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            </div>

            <p style="color: #6b7280;">This link will expire in 15 minutes.</p>
            <p style="color: #6b7280;">If you didn't request this, please ignore this email.</p>
            
            <p style="color: #6b7280; margin-bottom: 0;">For any queries, contact our support team.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};
