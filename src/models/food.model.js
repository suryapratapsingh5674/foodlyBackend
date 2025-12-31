const mongoose = require('mongoose')

const foodSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required: true
    },
    description:{
        type:String,
        require: true
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodPartner"
    }
})

const foodModel = mongoose.model("foodmodel", foodSchema);

module.exports = foodModel;