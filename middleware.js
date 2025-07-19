const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema.js");
const { cloudinary } = require("./cloudConfig.js");
const sharp = require('sharp');
const streamifier = require('streamifier');
// const { storage } = require("./cloudConfig.js");
// const upload = multer({
//     storage,
//     limits: {
//         files: 20 // total number of files allowed
//     }
// });

module.exports.isBanned = (req, res, next) => {
    if (!req.user) {
        // Just in case the user isn't logged in, avoids crashing
        return next(new ExpressError(401, "You must be logged in"));
    }
    if (req.user.ban === "ban") {
        return next(new ExpressError(403, "You are banned"));
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    }
    else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    req.session.originalUrl = req.originalUrl
    if (req.isAuthenticated()) {
        next();
    }
    else {
        req.flash("error", "You are not logged in");
        res.redirect("/signup");
    }
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.originalUrl) {
        res.locals.redirectUrl = req.session.originalUrl;
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (req.user._id.equals(listing.owner._id)) {
        next();
    }
    else {
        req.flash("error", "(Unauthorized) Know your place fool");
        // req.flash("error", "You are not authorized");
        res.redirect(`/listings/${id}`);
    }
}
module.exports.isLister = (req, res, next) => {
    if (req.user.userType === "lister") {
        next();
    }
    else {
        req.flash("error", "You are not a lister, you can set it in profile");
        res.redirect("/listings");

    }
}


//i will call this middleware after calling upload.any()
module.exports.uploadMiddleware = async (req, res, next) => {
    try {
        let { id } = req.params;
        if (id) {
            // this part is when a listing is edited, so it would contain the listing id in params
            const deleteCount = req.body.deleteImages ? req.body.deleteImages.length : 0;
            const allImages = req.files;
            let updatedImages = [];
            let newImages = [];
            if (allImages) {
                allImages.forEach((img) => {
                    if (img.fieldname.includes("replace")) {
                        updatedImages.push(img);
                    }
                    else {
                        newImages.push(img);
                    }
                });
            }

            let replaceCount = updatedImages ? updatedImages.length : 0;
            let newImgCount = newImages ? newImages.length : 0;

            let listing = await Listing.findById(id);
            if(!listing){
                req.flash("error","Listing not found");
                return res.redirect("/listings");
            }
            let existingImgCount = listing.image ? listing.image.length : 0;
            let totalImg = existingImgCount + newImgCount - deleteCount - replaceCount;

            if (totalImg > 6) {
                req.flash("error", "You can upload at max 6 images per listing");
                return res.redirect(`/listings/${id}/edit`);
            }
            else if (totalImg === 0) {
                req.flash("error", "You must have at least one image for a listing");
                return res.redirect(`/listings/${id}/edit`);
            }

        }
        else {
            // this part is to handle if a new listing is created, since it is new so no listing id

            // handling max limit image
            if (req.files.length > 6) {
                req.flash("error", "You can upload atmax 6 images per listing");
                return res.redirect("/listings/new");
            }
            // handling min limit image
            else if (req.files.length < 1) {
                req.flash("error", "You must upload at least 1 image for a listing");
                return res.redirect("/listings/new");
            }
        }

        // If somehow no files got through, just move on
        if (!req.files || req.files.length === 0) return next();

        // handlingcompression and uploading and saving back to req.files
        const processedUpload = req.files.map(async (file) => {
            let filename = file.fieldname;
            let originalName = file.originalname;
            let processedBuffer = file.buffer;
            if(processedBuffer.length>1*1024*1024){
                processedBuffer = await sharp(processedBuffer)
                .resize({width: 1200, fit: 'inside', withoutEnlargement:true})
                .jpeg({quality:50})
                .toBuffer();
            }
            
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'UniStay' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                streamifier.createReadStream(processedBuffer).pipe(uploadStream);
            })
            return {
                originalName,
                filename,
                url: result.secure_url || result.url,
                public_id: result.public_id
            }
        });
        const uploadedResults = await Promise.all(processedUpload);
        req.files = uploadedResults;
        next();

    } catch (err) {
        // res.status(500).send('Upload failed');
        req.flash("error", err.message);
        res.redirect("/listings");
    }
};

module.exports.isAvailable = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (listing.availability === "unavailable") {
        next();
    }
    else {
        req.flash("error", "Lisitng is no more available");
        res.redirect("/listings");
    }
}