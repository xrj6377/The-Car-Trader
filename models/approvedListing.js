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

const ApprovedListingSchema = new mongoose.Schema({
	creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
	make: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	year: {
		type: Number,
		required: true,
		minlength: 1,
		trim: true
	},
	model: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	bodyColor: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	milage: {
		type: Number,
		required: true,
		minlength: 1,
		trim: true
	},
	listingPrice: {
		type: Number,
		required: true,
		minlength: 1,
		trim: true
	},
	pictures: [imageSchema],
	description: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
})

const ApprovedListing = mongoose.model('ApprovedListing', ApprovedListingSchema);

module.exports = { ApprovedListing };