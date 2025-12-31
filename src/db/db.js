const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.CONNECTION_DB)
    .then(()=>{
        console.log('mongodb connected.')
    }).catch((err)=>{
        console.log("mongo db connection error: ", err)
    })
}

module.exports = connectDB;