// User routes
const log = console.log

// express
const express = require('express');
const router = express.Router(); // Express Router

// import the user mongoose model
const { User } = require('../models/user');

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");


// Routes for create new users in signup page 
// Request body expects:
/*
{
	userName = <user's name>,
	passWord = <user's password>,
	email = <user's email>,
	postCode = <user's contact postal code>,
	profilePhoto = <user's profile photo>,
	userType = <user type (admin or user)>

}
*/
// This routes will create a user with detailed user info in the system
// returned JSON should include all the fields in User model
// Will be calling this API in Sign Up page

router.post('/api/users', mongoChecker, async (req, res) => {
	// Create a new user
	const user = new User({
		userName: req.body.userName,
		passWord: req.body.passWord,
		email: req.body.email,
		postCode : req.body.postCode,
		profilePhoto: req.body.profilePhoto,
		userType: req.body.userType
	})

	try {
		// Save the user
		const newUser = await user.save()
		res.send(newUser)
	} catch (error) {
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

// Routes for get existing user info in profile page
// Request Params Required
/*
{
	user_id = <corresponding _id field in Mongoose User Model>
}
*/
// This routes will get the chosen existing user info 
// returned JSON should include all the fields in corresponding user's User model
// Will be calling this API in profile page

router.get('/api/users/:user_id', mongoChecker, async (req, res) => {
	const user_id = req.params.user_id
	try {
		User.findById(user_id).then((user) => {//find the user by API param user_id
			res.send({ user }) 
		})
	} catch (error) {
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

// Routes for responding the login request from user
// Request Body Required
/*
{
	userName = <username>,
	passWord = <password>

}
*/
// This routes will autenticate the login credentials from user's request 
// returned JSON should include all the fields in corresponding user's User model
// Will be calling this API in login page


router.post('/api/users/login', mongoChecker, async (req, res) => {
	const userName = req.body.userName
    const passWord = req.body.passWord

    try {
		const users = await User.findByUsernamePassword(userName, passWord) //authenticate user's login info
        .then(function(user){
            req.session.user = user._id
            req.session.userName = user.userName
            res.send(user) //sends back user info when login is authenticated and approved
        })
        .catch(() => {
            res.status(404).send("user/password not found")
        })
    } catch (error) {
    	if (isMongoError(error)) { 
			res.status(500).redirect('/');
		} else {
			log(error)
			res.status(400).redirect('/');
		}
    }

})

// Routes for update user's info
// Request Body Required
/*
{
	userID = <user's ID in mongoose user model>
	userName = <user's name>,
	passWord = <user's password>,
	email = <user's email>,
	profilePhoto = <user's profile photo>,
	postCode = <user's contact postal code>,
	

}
*/
// This routes will update the user's info in all fields except userType
// Will be calling this API in profile page after clicking on the update button

router.put('/api/users/:user_id', mongoChecker, async (req, res) => {
	const userID = req.params.user_id
	const userName = req.body.userName
    const passWord = req.body.passWord
	const email = req.body.email
	const profilePhoto = req.body.profilePhoto
	const postcode = req.body.postCode

    try {
		const users = User.findById(userID) //find the user by userID
		.then((user) => { //update the selected fields
			user.userName = userName
			user.passWord = passWord
			user.email = email
			user.profilePhoto = profilePhoto
			user.postCode = postcode
			user.save()
			res.send("updated successfully")
		})
        .catch(() => {
            res.status(404).send("user/password not found")
        })
    } catch (error) {
    	if (isMongoError(error)) { 
			res.status(500).redirect('/');
		} else {
			log(error)
			res.status(400).redirect('/');
		}
    }

})

// export the router
module.exports = router