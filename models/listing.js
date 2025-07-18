const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:[{
        url: String,
        originalName: String,
        filename: String,
        public_id: String,
    }],
    price:{
        type: Number,
        required: true
    },
    brokerage:{
        type: Number,
        required: true
    },
    security:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    interestedViewer:[
        {
            viewerId: {
                type: String,
                required: true
            },
            viewerContact: {
                type: String,
                required: true,
            },
            viewerName: {
                type: String,
                required: true
            }
        }
    ],
    availability: {
        type: String,
        enum: ["available","unavailable"],
        default: "unavailable",
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;