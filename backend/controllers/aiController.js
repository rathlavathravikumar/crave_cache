const Groq = require('groq-sdk');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const fallbackDescription = (itemName) => `A crave-worthy ${itemName} crafted with fresh ingredients, bold spices, and a comforting finish.`;
const fallbackReviewAnalysis = (review) => {
    const text = String(review || '').toLowerCase();
    if (text.includes('love') || text.includes('great') || text.includes('excellent')) {
        return {
            overall_sentiment: 'Positive',
            positive_tags: ['taste', 'service'],
            negative_tags: []
        };
    }
    if (text.includes('bad') || text.includes('awful') || text.includes('hate')) {
        return {
            overall_sentiment: 'Negative',
            positive_tags: [],
            negative_tags: ['taste', 'service']
        };
    }
    return {
        overall_sentiment: 'Mixed',
        positive_tags: ['value'],
        negative_tags: ['delivery']
    };
};

const extractJson = (content) => {
    if (!content) {
        return null;
    }

    const trimmed = content.trim();

    try {
        return JSON.parse(trimmed);
    } catch (error) {
        const match = trimmed.match(/\{[\s\S]*\}/);
        if (!match) {
            return null;
        }

        try {
            return JSON.parse(match[0]);
        } catch (parseError) {
            return null;
        }
    }
};

exports.generateDescription = catchAsyncErrors(async (req, res, next) => {
    const { itemName } = req.body;
    if (!groq) {
        return res.status(200).json({ success: true, description: fallbackDescription(itemName) });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: 'llama-3.1-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You generate only concise food descriptions. Return plain text only, no markdown, no intro, no quotes.'
                },
                { role: 'user', content: `Generate a mouth-watering description for a food item named: ${itemName}` }
            ]
        });
        res.status(200).json({ success: true, description: chatCompletion.choices[0].message.content?.trim() || fallbackDescription(itemName) });
    } catch (error) {
        res.status(200).json({ success: true, description: fallbackDescription(itemName) });
    }
});

exports.analyzeReview = catchAsyncErrors(async (req, res, next) => {
    const { review } = req.body;
    if (!groq) {
        return res.status(200).json({ success: true, analysis: fallbackReviewAnalysis(review) });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: 'llama-3.1-70b-versatile',
            temperature: 0,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: 'Return only valid JSON with this exact shape: {"overall_sentiment":"Positive|Negative|Mixed","positive_tags":[],"negative_tags":[]}. Do not add markdown, code fences, explanations, or extra keys.'
                },
                { role: 'user', content: `Analyze this food review: ${review}` }
            ]
        });
        const parsed = extractJson(chatCompletion.choices[0].message.content) || fallbackReviewAnalysis(review);
        res.status(200).json({ success: true, analysis: parsed });
    } catch (error) {
        res.status(200).json({ success: true, analysis: fallbackReviewAnalysis(review) });
    }
});

exports.recommendFood = catchAsyncErrors(async (req, res, next) => {
    const { mood, diet, budget } = req.body;
    const suggestions = [
        { name: 'Spicy Paneer Bowl', price: 220 },
        { name: 'Garden Veggie Wrap', price: 180 },
        { name: 'Crispy Chicken Burger', price: 260 }
    ];
    res.status(200).json({ success: true, suggestions: suggestions.filter((item) => item.price <= (budget || 300)) });
});

exports.searchFood = catchAsyncErrors(async (req, res, next) => {
    const { query } = req.body;
    const allItems = [
        'Paneer tikka wrap',
        'Spicy ramen bowl',
        'Crispy chicken burger',
        'Garden salad',
        'Loaded fries'
    ];
    const results = allItems.filter((item) => item.toLowerCase().includes((query || '').toLowerCase()));
    res.status(200).json({ success: true, results });
});
