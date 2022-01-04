const log = console.log

const { ObjectID, ObjectId } = require('bson');
// express
const express = require('express');
const router = express.Router(); // Express Router

// import the listing mongoose model
const { TBAListing } = require('../models/TBAListing');
const { ApprovedListing } = require('../models/approvedListing')

// set up cloudinarty credentials for uploading the pictures user uploaded
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'xrj6377',
    api_key: '813116494813639',
    api_secret: 'Kk_BNooqSviBe0HbEh3Am4ZDLnE'
});

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");

// TBALisiting ((To Be Approved) Listing) API: POST
// The corresponding action for adding to the list would come to this api route.
// First would get the length of the images object, to know if user uploads
// one or more or no photos, which will be handled in a different way.
// The photos are then uploaded to the cloudinary server, and will get its id, url, and date 
// created for future reference.
// A new listing object would then created from the request body passed in, to build a database entry for
// database "tbalisting". The listing entry were then send as the response.
router.post('/api/TBAListings', multipartMiddleware, mongoChecker, async (req, res) => {
	var images = []
	var images_length = Object.keys(req.files.images).length

	if (req.files.images.size === 0) {
		images.push({
			image_id: "0x000",
			image_url: "https://t3.ftcdn.net/jpg/04/10/60/44/360_F_410604442_8jdxvaETqepuXnCyXl0mhIhThPJMLeKJ.jpg",
			created_at: new Date()
		})
	}
	else if (!Array.isArray(req.files.images)) {
		await cloudinary.uploader.upload(
			req.files.images.path, // req.files contains uploaded files
			function (result) {

				const img = {image_id: result.public_id, image_url: result.url, created_at: new Date()}
				images.push(img)
			});
	}
	else {
		for(var i = 0; i < images_length; i++){
			await cloudinary.uploader.upload(
				req.files.images[i].path, // req.files contains uploaded files
				function (result) {
	
					const img = {image_id: result.public_id, image_url: result.url, created_at: new Date()}
					images.push(img)
				});
		}
	}

	// Create a new listing
	const listing = new TBAListing({
		creator: req.body.userID,
        make: req.body.make.toUpperCase(),
        year: req.body.year,
        model: req.body.model.toUpperCase(),
        bodyColor: req.body.bodyColor.toUpperCase(),
        milage: req.body.milage,
        listingPrice: req.body.listingPrice,
		pictures: images,
		description: req.body.description
	})

	try {
		// Save the listing
		const newListing = await listing.save()
		res.status(200).send(newListing)
	} catch (error) {
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

// Get all TBAListings
router.get('/api/TBAListings', mongoChecker, async (req, res) => {
	try {
		const listings = await TBAListing.find()
		res.send(listings)
	}
	catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Get TBAListing by car id
router.get('/api/TBAListing/:id', mongoChecker, async (req, res) => {
	const carId = req.params.id

	if (!ObjectID.isValid(carId)) {
		res.status(404).send('Invalid Id');
        return;
	}

	try {
		const listings = await TBAListing.findOne({ _id: carId })
		res.send(listings)
	}
	catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})


// API for admin to approve a listing, whenever admin approves a posting, it will use this
// api to append the listing to approvedlisting in the database.
router.post('/api/adminListing/approvePost/:id', mongoChecker, (req, res) => {

	// get the posting id
	const id = req.params.id;

	// If id valid, find the post by id
	TBAListing.findById(id).then((post) => {

		if (!post) {
			res.status(404).send();
		} else {
			// create a new approved post and assign it with the selected post
			const approvedPost = new ApprovedListing({
				creator: post.creator,
				make: post.make,
				year: post.year,
				model: post.model,
				bodyColor: post.bodyColor,
				milage: post.milage,
				listingPrice: post.listingPrice,
				pictures: post.pictures,
				description: post.description
			});

			// delete the post from unapproved list
			TBAListing.findById(id).deleteOne().exec();

			// save the new added approved post and then send it
			approvedPost.save().then((result) => {
				res.send(result);
			}).catch((error) => {
				res.status(400).send(error); // 400 for bad request gets sent to client.
			})
		}
	}).catch((error) => {
		res.status(400).send(error);
	})
})


// API for admin to decline a listing, similar to the approve one above, but here after delete the post
// in the tbalisting database, it would not post it to the approved listing.
router.post('/api/adminListing/declinePost/:id', mongoChecker, (req, res) => {

	// get the posting id
	const id = req.params.id;

	// If id valid, find the post by id
	TBAListing.findById(id).then((post) => {
		if (!post) {
			res.status(404).send();
		} else {
			// delete the unapproved post
			TBAListing.findById(id).deleteOne().exec().then((result) => {
				res.send(result);
			}).catch((error) => {
				res.status(400).send(error); // 400 for bad request gets sent to client.
			});
		}
	}).catch((error) => {
		res.status(400).send(error);
	})
})

// API to delete a particular posting from user's My Posting page.
// Listings are looked up using the parameter carId and type indicates whether the user wants to delete an approved auction or a TBA auction.
// So we can look for the listing in the correct db.
router.delete('/api/deleteListing/:carId/:type', mongoChecker, (req, res) => {

	// get the posting id
	const carId = req.params.carId;
	const type = req.params.type;

	if (!ObjectID.isValid(carId)) {
		res.status(404).send('Invalid Id');
        return;
	}

	// If id valid, find the post by id
	if (!type.startsWith('TBA')) {
		ApprovedListing.findById(carId).then((post) => {
			if (!post) {
				res.status(404).send();
			} else {
				// delete the unapproved post
				ApprovedListing.findById(carId).deleteOne().exec().then((result) => {
					res.send(result);
				}).catch((error) => {
					res.status(400).send(error); // 400 for bad request gets sent to client.
				});
			}
		}).catch((error) => {
			res.status(400).send(error);
		})
	}
	else {
		TBAListing.findById(carId).then((post) => {
			if (!post) {
				res.status(404).send();
			} else {
				// delete the unapproved post
				TBAListing.findById(carId).deleteOne().exec().then((result) => {
					res.send(result);
				}).catch((error) => {
					res.status(400).send(error); // 400 for bad request gets sent to client.
				});
			}
		}).catch((error) => {
			res.status(400).send(error);
		})
	}
})

// Get All approved listings
router.get('/api/approvedListings', mongoChecker, async (req, res) => {
	try {
		const listings = await ApprovedListing.find()
		res.send(listings)
	}
	catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// get approvedListing by car id
router.get('/api/approvedListing/:id', mongoChecker, async (req, res) => {
	const carId = req.params.id

	if (!ObjectID.isValid(carId)) {
        res.status(404).send('Invalid Id');
        return;
    }

	try {
		const listing = await ApprovedListing.findOne({ _id: carId });
		res.send(listing);
	}
	catch (error) {
		log(error);
		res.status(500).send("Internal Server Error");
	}
})

// get listings by creator
router.get('/api/myListings/:myId/:type', mongoChecker, async (req, res) => {
	const myId = req.params.myId
	const type = req.params.type

	if (!ObjectID.isValid(myId)) {
		res.status(404).send('Invalid Id');
        return;
	}

	try {
		let listings;
		if (type === 'approved') {
			listings = await ApprovedListing.find({ creator: myId })
			
		}
		else if (type === 'TBA') {
			listings = await TBAListing.find({ creator: myId })
		}

		if (listings) {
			res.status(200).send(listings)
		}
		else {
			res.status(404).send("Not found.")
		}
	}
	catch (error) {
		log(error);
		res.status(500).send("Internal Server Error");
	}
})

// export the router
module.exports = router
