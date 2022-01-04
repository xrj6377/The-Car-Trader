const mongoose = require('mongoose');
const validator = require('validator');

const imageSchema = new mongoose.Schema({
    image_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    created_at: String
});

const TBAauctionSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    make: {
        type: String,
        require: true
    },
    year: {
        type: Number,
        require: true
    }, 
    model: {
        type: String,
        require: true
    },
    bodyColor: {
        type: String,
        require: true
    },
    milage: {
        type: Number,
        require: true
    },
    bidStartPrice: {
        type: Number,
        require: true,
        minlength: 1,
		trim: true
    },
    pictures: [imageSchema],
    description: {
        type: String,
        require: true
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
        require: true
    }
})

const TBAauctionListing = mongoose.model('TBAauctionListing', TBAauctionSchema);

module.exports = { TBAauctionListing };