const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    modelFile: {
        type: String,
        required: true
    },
    material: {
        type: String,
        enum: ['PLA', 'ABS', 'Resin', 'Nylon', 'Custom'],
        required: true
    },
    colorOptions: [{
        type: String,
        required: true
    }],
    dimensions: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        depth: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            enum: ['mm', 'cm', 'in'],
            default: 'mm'
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    estimatedPrintTime: {
        type: String,
        required: true
    },
    estimatedShippingTime: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
