const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: true,
		minlength: 4
	},
	passWord: {
		type: String,
		required: true,
		minlength: 4
	},
	email: {
		type: String,
		minlength: 4,
		validate: {
			validator: validator.isEmail,   // custom validator
			message: 'Not valid email'
		}
	},
	postCode: {
		type: String,
	},
	profilePhoto: {
		type: String,
	},
	userType: {
		type: String,
		enum: ["admin","user"],
		required: true
	}

})

UserSchema.pre('save', function(next) {
	const user = this; // binds this to User document instance

	// checks to ensure we don't hash password more than once
	if (user.isModified('passWord')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.passWord, salt, (err, hash) => {
				user.passWord = hash
				next()
			})
		})
	} else {
		next()
	}
})

UserSchema.statics.findByUsernamePassword = function(userName, passWord) {
	const User = this // binds this to the User model

	// First find the user by their email
	return User.findOne({ userName: userName }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(passWord, user.passWord, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}
const User = mongoose.model('User', UserSchema);
module.exports = { User };