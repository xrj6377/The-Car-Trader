const log = console.log

const { ObjectID } = require('bson');
// express
const express = require('express');
const router = express.Router(); // Express Router

// import the listing mongoose model

const { ApprovedListing } = require('../models/approvedListing')
const { FilteredListing } = require('../models/filteredListing')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");


// Routes for filtering the posting with some certain preferences
// Request body expects:
/*
{
	make = <car make>,
	model = <car model>,
	bodyColor = <car color>,
	startYear = <year range lower bound>,
	endYear = <yeaer range upper bound>,
	startPrice = <price range lower bound>,
	endPrice = <price range upper bound>,
	maxMil = <max mileage>
}
*/
// This routes will create a dynamically generated filter (according to uses inputs) to filter the postings
// Returned JSON should store a filtered car listing database
// Home page listings will be updated to only the filtered car listing
// Calling this API will remove the previous results if the database is not empty
router.post('/api/filter', mongoChecker, (req, res) => {

	const make = req.body.make;
	const model = req.body.model;
	const bodyColor = req.body.bodyColor;
	const startYear = req.body.startYear;
	const endYear = req.body.endYear;
	const startPrice = req.body.startPrice;
	const endPrice = req.body.endPrice;
	const maxMil = req.body.maxMil;

	// clear the filteredListing collection if not empty
    FilteredListing.countDocuments({}, function(err, count){
        if (count != 0) {
            FilteredListing.collection.drop()
        }
    });

	// dynamically generate the filter
	let filter = {}

	if (make != '') {
		filter = Object.assign({'make' : make}, filter);
	}
	if (model != '') {
		filter = Object.assign({'model' : model}, filter);
	}
	if (bodyColor != '') {
		filter = Object.assign({'bodyColor' : bodyColor}, filter);
	}
	if (startYear != '' && endYear == '') {
		filter = Object.assign({'year' : { $gte: startYear}}, filter);
	}
	if (endYear != '' && startYear == '') {
		filter = Object.assign({'year' : { $lte: endYear}}, filter);
	}
	if (startYear != '' && endYear != '') {
		filter = Object.assign({'year' : { $gte: startYear, $lte: endYear}}, filter);
	}
	if (startPrice != '' && endPrice == '') {
		filter = Object.assign({'listingPrice' : { $gte: startPrice}}, filter);
	}
	if (endPrice != '' && startPrice == '') {
		filter = Object.assign({'listingPrice' : { $lte: endPrice}}, filter);
	}
	if (startPrice != '' && endPrice != '') {
		filter = Object.assign({'listingPrice' : { $gte: startPrice, $lte: endPrice}}, filter);
	}
	if (maxMil != '') {
		filter = Object.assign({'milage' : { $lte: maxMil}}, filter);
	}

	// get the filtered listing using the filter generated above
	ApprovedListing.find(filter).then( (result) => {
		for(let i = 0; i < result.length; i++) {
			const filteredPost = new FilteredListing({
				creator: result[i].creator,
				make: result[i].make,
				year: result[i].year,
				model: result[i].model,
				bodyColor: result[i].bodyColor,
				milage: result[i].milage,
				listingPrice: result[i].listingPrice,
				pictures: result[i].pictures,
				description: result[i].description
			});
			filteredPost.save()
		}
		res.send(result)
	})
})

// export the router
module.exports = router