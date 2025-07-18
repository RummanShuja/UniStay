const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId:{
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    email: String,
    photo: String,
    userType: {
        type: String,
        enum: ["viewer","lister"],
        default: "viewer",
    },
    savedListing: [
        {
            type: String,
        }
    ],
    phoneNumber: {
        type: String,
        validate:{
            validator: function(v){
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    ban:{
        type: String,
        enum: ["ban", "unban"],
        default: "unban",
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;