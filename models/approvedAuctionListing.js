const mongoose = require('mongoose');
const validator = require('validator');

const imageSchema = mongoose.Schema({
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

const approvedAuctionSchema = new mongoose.Schema({
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
    highestBid: {
        type: Number,
        require: true,
        minlength: 1,
		trim: true
    },
    highestBidder: {
        type: mongoose.Schema.Types.ObjectId,
    },
    participants: [mongoose.Schema.Types.ObjectId],
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

// need to add highest bidder information and all participant information

const ApprovedAuctionListing = mongoose.model('ApprovedAuctionListing', approvedAuctionSchema);

module.exports = { ApprovedAuctionListing };