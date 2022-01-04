'use strict';
// DO NOT CHANGE THIS FILE
const mongoose = require('mongoose');

// DO NOT CHANGE THIS FILE
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://zhougaox:123456ZGx.@cluster0.rodmk.mongodb.net/car-trader', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

// DO NOT CHANGE THIS FILE
module.exports = { mongoose }