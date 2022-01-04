// User routes
const log = console.log

// express
const express = require('express');
const router = express.Router(); // Express Router

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// import the listing mongoose model
const { TBAauctionListing } = require('../models/TBAauctionListing');
const { ApprovedAuctionListing } = require('../models/approvedAuctionListing')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");

const cloudinary = require('cloudinary');
const { ObjectID, ObjectId } = require('bson');
cloudinary.config({
    cloud_name: 'xrj6377',
    api_key: '813116494813639',
    api_secret: 'Kk_BNooqSviBe0HbEh3Am4ZDLnE'
});

// API used to create TBA (to be approved) auction listing for admin to review. Pictures are uploaded to cloudinary and links to images are saved in our db.
// req.files contains all the image data while the body of the request contains all other relavent information of the car.
router.post('/api/TBAauctionListings', mongoChecker, multipartMiddleware, async (req, res) => {
    const formImages = req.files.images
    const images = []
    
    var images_length = Object.keys(formImages).length
    if (formImages.size === 0) {
		images.push({
			image_id: "0x000",
			image_url: "https://t3.ftcdn.net/jpg/04/10/60/44/360_F_410604442_8jdxvaETqepuXnCyXl0mhIhThPJMLeKJ.jpg",
			created_at: new Date()
		})
	}
	else if (!Array.isArray(formImages)) {
		await cloudinary.uploader.upload(
			formImages.path, // req.files contains uploaded files
			function (result) {

				const img = {image_id: result.public_id, image_url: result.url, created_at: new Date()}
				images.push(img)
			});
	}
	else {
        for (let i = 0; i < images_length; i++) {
            await cloudinary.uploader.upload(
                formImages[i].path, // req.files contains uploaded files
                function (result) {
        
                    // Create a new image using the Image mongoose model
                    const image = {
                        image_id: result.public_id,
                        image_url: result.url,
                        created_at: new Date()
                    }
                    images.push(image)
                });
        }
    }

    const listing = new TBAauctionListing({
        creator: req.body.userID,
        make: req.body.make.toUpperCase(),
        year: req.body.year,
        model: req.body.model.toUpperCase(),
        bodyColor: req.body.bodyColor.toUpperCase(),
        milage: req.body.milage,
        bidStartPrice: req.body.bidstartingPrice,
        pictures: images,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
    })
    try {
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


// API for app to get TBA auction listings for admins to see in admin home.
router.get('/api/TBAauctionListings', mongoChecker, async (req, res) => {
    try {
		const listings = await TBAauctionListing.find()
		res.send(listings)
	}
	catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Get one TBA auction by id, this is used to render a particular carInfo page when admin choses to view one of the TBA auction listings.
router.get('/api/TBAauctionListing/:id', mongoChecker, async (req, res) => {
    const carId = req.params.id

    if (!ObjectID.isValid(carId)) {
        res.status(404).send('Invalid Id');
        return;
    }

    try {
		const listing = await TBAauctionListing.findOne({ _id: carId })
		res.send(listing)
	}
	catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// API used for admin to approve a post.
// We first lookup the TBA post by its id, then an approved auction post will be created using the retirved TBA post informaiton
// The approved auction post is then added to the correct db.
router.post('/api/adminAuction/approvePost/:id', mongoChecker, (req, res) => {

	// get the posting id
	const id = req.params.id;

	// If id valid, find the post by id
	TBAauctionListing.findById(id).then((post) => {

		if (!post) {
			res.status(404).send("Unable to find post.");
		} else {
			// create a new approved post and assign it with the selected post
			const approvedAuction = new ApprovedAuctionListing({
				creator: post.creator,
				make: post.make,
				year: post.year,
				model: post.model,
				bodyColor: post.bodyColor,
				milage: post.milage,
                bidStartPrice: post.bidStartPrice,
                highestBid: post.bidStartPrice,
				pictures: post.pictures,
				description: post.description,
                startDate: post.startDate,
                endDate: post.endDate
			});

			// delete the post from unapproved list
			TBAauctionListing.findById(id).deleteOne().exec();

			// save the new added approved post and then send it
			approvedAuction.save().then((result) => {
				res.send(result);
			}).catch((error) => {
				res.status(400).send(error); // 400 for bad request gets sent to client.
			})
		}
	}).catch((error) => {
		res.status(400).send(error);
	})
})


// API for admin to decline a TBA post.
// Post is retrived based on its id and deleted from the TBA auction db.
router.post('/api/adminAuction/declinePost/:id', mongoChecker, (req, res) => {

	// get the posting id
	const id = req.params.id;

	// If id valid, find the post by id
	TBAauctionListing.findById(id).then((post) => {
		if (!post) {
			res.status(404).send();
		} else {
			// delete the unapproved post
			TBAauctionListing.findById(id).deleteOne().exec().then((result) => {
				res.send(result);
			}).catch((error) => {
				res.status(400).send(error); // 400 for bad request gets sent to client.
			});
		}
	}).catch((error) => {
		res.status(400).send(error);
	})
})


// API for getting all approved auction listings to be displayed in the auction listing page.
router.get('/api/approvedAuctionListings', mongoChecker, async (req, res) => {
    try {
		const listings = await ApprovedAuctionListing.find()
		res.send(listings)
	}
	catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// API for getting a particular approved auction listing.
// This is used to render the carInfo page of a particular auction car that a user wants to view.
// The auction listing is look up with its unique id.
router.get('/api/approvedAuctionListing/:id', mongoChecker, async (req, res) => {
    const carId = req.params.id;
    if (!ObjectID.isValid(carId)) {
        res.status(404).send('Invalid Id');
        return;
    }

    try {
		const carListing = await ApprovedAuctionListing.findOne({ _id: carId })
		res.send(carListing)
	}
	catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})


// API for user to place a bid on a particular car in auction.
// The request contains the id of the bidder as well as the users new Bid
// The auction car that the user is bidding on will first be retrived from the db.
// Then the new user bid is checked against the current highestBid for that car to see if it's higher.
// Success/Failure will be determined by it.
// Highest bid will be updated and the updated auction listing will be sent to the front end so the new highestBid is correctly displayed.
router.post('/api/placeBid/:id', mongoChecker, async (req, res) => {
    const carId = req.params.id;
    const bidderId = req.body.bidder;
    const newBid = Number(req.body.bid);

    if (!ObjectID.isValid(carId) || !ObjectID.isValid(bidderId)) {
        res.status(404).send('Invalid Id');
        return;
    }

    try {
        const auctionCar = await ApprovedAuctionListing.findOne({ _id: carId })
        if (!auctionCar) {
            res.status(404).send("Car not found");
        }
        else {
            if (auctionCar.highestBid >= newBid) {
                res.status(400).send(auctionCar);
            }
            else if (String(auctionCar.creator) === bidderId) {
                res.status(400).send(auctionCar);
            }
            else {
                auctionCar.highestBid = Number(newBid);
                auctionCar.highestBidder = ObjectId(bidderId);
                const participants = auctionCar.participants;
                if (!participants.includes(bidderId)) {
                    participants.push(bidderId);
                }
                const updatedAuctionCar = await auctionCar.save()
                res.status(200).send(updatedAuctionCar);
            }
        }
    } catch (error) {
        log(error)
        res.status(500).send('Internal server error.');
    }
})

// API used for getting all the active auctions to be displayed in the auction page.
// User should only be able to view and bid on active auctions.
router.get('/api/activeAuctions', mongoChecker, async (req, res) => {
    const curDate = new Date()
    const filter = {
        'startDate':{"$lte": curDate},
        'endDate':{"$gte": curDate}
    }
    try {
        const activeAuctions = await ApprovedAuctionListing.find(filter)
        if (!activeAuctions) {
            res.status(500).send('Internal server error.')
        }
        else {
            res.status(200).send(activeAuctions)
        }
    } catch (error) {
        res.status(500).send('Internal server error.')
    }
})

// API used for getting expired auctions.
// Admin will examine the db for expired auctions so it can inform the auction creator and participants of the result.
router.get('/api/expiredAuctions', mongoChecker, async (req, res) => {
    const curDate = new Date()

    try {
        const expiredAuctions = await ApprovedAuctionListing.find({ endDate:{"$lt": curDate} })
        if (!expiredAuctions) {
            res.status(500).send('Internal server error.')
        }
        else {
            res.status(200).send(expiredAuctions)
        }
    } catch (error) {
        res.status(500).send('Internal server error.')
    }
})

// API used for getting auction listings created by a particular user.
// parameter myId is used to identify the user and type is used to indicate whether we should look in the TBA auction listings or the approved auction listings.
// Listings of interest are find based on the creator id.
router.get('/api/myAuctions/:myId/:type', mongoChecker, async (req, res) => {
	const myId = req.params.myId
	const type = req.params.type

	if (!ObjectID.isValid(myId)) {
		res.status(404).send('Invalid Id');
        return;
	}

	try {
		let listings;
		if (type === 'approved') {
			listings = await ApprovedAuctionListing.find({ creator: myId })
			
		}
		else if (type === 'TBA') {
			listings = await TBAauctionListing.find({ creator: myId })
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

// API to delete a particular auction post from user's My Posting page.
// Listings are looked up using the parameter carId and type indicates whether the user wants to delete an approved auction or a TBA auction.
// So we can look for the listing in the correct db.
router.delete('/api/deleteAuction/:carId/:type', mongoChecker, (req, res) => {

	// get the posting id
	const carId = req.params.carId;
	const type = req.params.type;

	if (!ObjectID.isValid(carId)) {
		res.status(404).send('Invalid Id');
        return;
	}

	// If id valid, find the post by id
	if (!type.startsWith('TBA')) {
		ApprovedAuctionListing.findById(carId).then((post) => {
			if (!post) {
				res.status(404).send();
			} else {
				// delete the unapproved post
				ApprovedAuctionListing.findById(carId).deleteOne().exec().then((result) => {
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
		TBAauctionListing.findById(carId).then((post) => {
			if (!post) {
				res.status(404).send();
			} else {
				// delete the unapproved post
				TBAauctionListing.findById(carId).deleteOne().exec().then((result) => {
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

// export the router
module.exports = router
