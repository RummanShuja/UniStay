const { cloudinary } = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    let msg = "null";
    res.render("index.ejs", { listings, msg });
}

module.exports.new = async (req, res) => {
    const { listing } = req.body;
    listing.owner = req.user._id;
    listing.image = req.files;
    let savedListing = await Listing.insertOne(listing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.renderNewForm = (req, res) => {
    res.render("new.ejs");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    if (listing) {
        res.render("show.ejs", { listing });
    }
    else {
        req.flash("error", "No such listing exists");
        res.redirect("/listings");
    }
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let existingImages = listing.image;
    let newListing = req.body.listing;

    let allImages = req.files;

    let newImages = [];
    let updatedImages = [];
    if (allImages) {
        allImages.forEach((img) => {
            if (img.filename.includes("replace")) {
                updatedImages.push(img);
            }
            else {
                newImages.push(img);
            }
        });
    }

    let deleteImages = req.body.deleteImages;

    if (deleteImages) {
        if (!Array.isArray(deleteImages)) {
            deleteImages = [deleteImages];
        }

        for (const imgId of deleteImages) {
            const imgIndex = existingImages.findIndex(img => img._id.equals(imgId));
            if (imgIndex !== -1) {
                const img = existingImages[imgIndex];

                await cloudinary.uploader.destroy(img.public_id, { invalidate: true });

                await Listing.findByIdAndUpdate(id, { $pull: { image: { _id: imgId } } });

                existingImages.splice(imgIndex, 1);
            }
        }
    }


    if (updatedImages) {
        updatedImages.forEach((newI) => {
            const replaceId = newI.filename.slice(12, -1);

            existingImages.forEach(async(xImg) => {
                let xId = xImg._id;
                if (xId.equals(replaceId)) {
                    const oldPublicId = xImg.public_id;
                    xImg.url = newI.url,
                    xImg.originalName = newI.originalName,
                    xImg.filename = newI.filename,
                    xImg.public_id = newI.public_id
                    // destroying the existing images after updating them from cloudinary
                    await cloudinary.uploader.destroy(oldPublicId, { invalidate: true });
                }
            })
            
        });
    }
    

    //inserting new uploaded images
    if (newImages) {

        existingImages = [...existingImages, ...newImages];
    }

    newListing.image = existingImages;
    let updatedListing = await Listing.findByIdAndUpdate(id, newListing);
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    listing.image.forEach(async (img) => {
        await cloudinary.uploader.destroy(img.public_id, { invalidate: true });
    })
    await User.updateMany(
        { savedListing: id },
        { $pull: { savedListing: id } }
    )

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}

module.exports.myListing = async (req, res) => {
    const listings = await Listing.find({});
    let currUser = req.user;
    let myListing = [];
    listings.forEach((listing) => {
        if (listing.owner.equals(currUser._id)) {
            myListing.push(listing);
        }
    })
    let msg = "Your Listings";
    res.render("index.ejs", { listings: myListing, msg });
}

module.exports.savedListing = async (req, res) => {
    let user = await User.findById(req.user._id);
    const listings = await Listing.find({});
    let savedListingId = user.savedListing;
    let savedListing = [];
    listings.forEach((listing) => {
        savedListingId.forEach((savedId) => {
            if (listing._id.equals(savedId)) {
                savedListing.push(listing);
            }
        })
    })
    let msg = "Saved Listings";
    res.render("index.ejs", { listings: savedListing, msg });
}

module.exports.interested = async (req, res) => {
    let { id } = req.params;
    let viewerId = req.user._id;
    let viewerContact = req.user.phoneNumber;
    if (!viewerContact) {
        req.flash("error", "Set up your name and add a phone number in Profile");
    }
    else {

        let viewerName = req.user.name;
        await Listing.findByIdAndUpdate(id, {
            $addToSet: {
                interestedViewer: {
                    viewerId, viewerContact, viewerName
                }
            }
        });
        req.flash("success", "We've informed the lister. They'll reach out — or you can call them.")
    }
    res.redirect(`/listings/${id}`);
}

module.exports.checkAvailability = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (listing.availability === "available") {
        await Listing.findByIdAndUpdate(id, { $set: { availability: "unavailable" } });
        req.flash("success", "Your listing is marked as available, viewers can see desription");
    }
    else {
        await Listing.findByIdAndUpdate(id, { $set: { availability: "available" } });
        req.flash("success", "Your listing is marked as unavailable, viewers can no longer see description.");
    }
    res.redirect(`/listings/${id}`);
}