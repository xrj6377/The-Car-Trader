// express
const express = require('express');
const router = express.Router(); // Express Router

// import the listing mongoose model
const { Inbox } = require("./../models/inbox")

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");

const { ObjectID, ObjectId } = require('bson');


// API for creating inbox upon user registration
// The id in the parameter is used to indicate who the owner is
// The id will be recorded in the owner field of the Inbox schema.
router.post('/api/inbox/:id', mongoChecker, async (req, res) => {
    const userId = req.params.id

    if (!ObjectID.isValid(userId)) {
        res.status(404).send("Invalid userId.");
        return;
    }

    const inbox = new Inbox({
        owner: userId,
        messages: []
    })

    try {
        const result = await inbox.save()
        res.status(200).send(result)
    } catch (error) {
        if (isMongoError(error)) {
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request')
		}
    }
})


// API for sending message between users.
// Parameter form indicates the sender of the message.
// Parameter to indicates the receiver of the message.
// Destination Inbox is first looked up with the 'to' parameter
// New message is then created with the message in the request body and the 'from' parameter.
// Date is set to be the current date and read is false by default.
router.post('/api/inbox/:from/:to', mongoChecker, async (req, res) => {
    const fromId = req.params.from
    const toId = req.params.to
    const message = req.body.message

    if (!ObjectID.isValid(fromId) || !ObjectID.isValid(toId)) {
        res.status(404).send("Invalid userId.");
        return;
    }

    try {
        const toInbox = await Inbox.findOne({ owner: toId })
        if (!toInbox) {
            res.status(404).send("Cannot find destination inbox.")
        }
        else {
            const msg = {
                from: fromId,
                messageBody: message,
                date: new Date(),
                read: false
            }
            toInbox.messages.push(msg)
            const result = await toInbox.save()
            res.status(200).send(result)
        }
    } catch (error) {
        if (isMongoError(error)) {
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request')
		}
    }
})

// API used for message filtering.
// Parameter id indicates the owner of the Inbox of interest.
// Inbox is looked up based on the value of owner.
// Parameter type indicates what type of message we want to return
// type === 'all' returns all messages within an inbox
// type ==='unread' returns all unread messages within an inbox
// type === 'read' returns all read messages within an inbox
router.get('/api/inbox/:id/:type', mongoChecker, async (req, res) => {
    const userId = req.params.id
    const type = req.params.type

    if (!ObjectID.isValid(userId)) {
        res.status(404).send("Invalid userId.");
        return;
    }

    try {
        let msgs
        if (type === "unread") {
            msgs = await Inbox.aggregate([
                { $match : { owner: ObjectId(userId) }},
                { $unwind : "$messages" },
                { $match : { "messages.read": false }}
            ])
        }
        else if (type === "read") {
            msgs = await Inbox.aggregate([
                { $match : { owner: ObjectId(userId) }},
                { $unwind : "$messages" },
                { $match : { "messages.read": true }}
            ])
        }
        else if (type === "all") {
            msgs = await Inbox.aggregate([
                { $match : { owner: ObjectId(userId) }},
                { $unwind : "$messages" }
            ])
        }

        if (!msgs) {
            res.status(404).send("Cannot find user message.")
        }
        else {
            res.status(200).send(msgs)
        }
    } catch (error) {
        if (isMongoError(error)) {
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request')
		}
    }
})

// API for marking a particular message as read.
// Parameter ownerId is used to indentify the correct inbox.
// Parameter msgId is used to indentify the correct message.
router.post('/api/markAsRead/:ownerId/:msgId', mongoChecker, async (req, res) => {
    const ownerId = req.params.ownerId
    const msgId = req.params.msgId

    if (!ObjectID.isValid(ownerId) || !ObjectID.isValid(msgId)) {
        res.status(404).send("Invalid Id");
        return;
    }

    try {
        const inbox = await Inbox.findOne({ owner: ownerId })
        if (!inbox) {
            res.status(404).send("Cannot find user inbox.")
        }
        else {
            const msg = inbox.messages.id(msgId)
            msg.read = true
            const updatedInbox = await inbox.save()
            if (!updatedInbox) {
                res.status(500).send("Internal Server Error.")
            }
            else {
                res.status(200).send(updatedInbox)
            }
        }
    } catch (error) {
        if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			res.status(400).send("Bad Request")
		}
    }
})

// API used to delete a particular message.
// Parameter ownerId is used to identify the correct inbox.
// Parameter msgId is used to identify the correct message to be deleted.
router.delete('/api/deleteMessage/:ownerId/:msgId', mongoChecker, async (req, res) => {
    const ownerId = req.params.ownerId
    const msgId = req.params.msgId

    if (!ObjectID.isValid(ownerId) || !ObjectID.isValid(msgId)) {
        res.status(404).send("Invalid Id");
        return;
    }

    try {
        const inbox = await Inbox.findOne({ owner: ownerId })
        if (!inbox) {
            res.status(404).send("Cannot find user inbox.")
        }
        else {
            const msg = inbox.messages.id(msgId)
            inbox.messages.remove(msg)
            const updatedInbox = await inbox.save()
            if (!updatedInbox) {
                res.status(500).send("Internal Server Error.")
            }
            else {
                res.status(200).send(updatedInbox)
            }
        }
    } catch (error) {
        if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			res.status(400).send("Bad Request")
		}
    }
})

// export the router
module.exports = router