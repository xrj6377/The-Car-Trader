const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	messageBody: {
		type: String,
		required: true
	},
	date: {
        type: Date,
        require: true
    },
    read: {
        type: Boolean,
        require: true
    }
});

const inboxSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    messages: [messageSchema]
})

const Inbox = mongoose.model('Inbox', inboxSchema);

module.exports = { Inbox }