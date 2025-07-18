const express = require("express");
const router = express.Router({mergeParams: true});
const controller = require("../controller/listings.js")
const wrapAsync = require("../utils/wrapAsync.js");
const { isBanned,validateListing,isLoggedIn,isOwner, isLister,limitImages,uploadMiddleware,limitNewImages, isAvailable } = require("../middleware.js");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
    fileFilter: (req,file,cb)=>{
        const allowedTypes = [,'image/jpeg','image/jpg','image/png'];
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }
        else{
            cb(new Error('Only JPG,JPEG,& PNG images are allowed'));
        }
    }
});


router.route("/")
    .get(wrapAsync(controller.index))
    .post(isLoggedIn,isBanned,isLister,upload.any(),uploadMiddleware,validateListing,wrapAsync(controller.new));

router.route("/new")
    .get(isLoggedIn,isBanned,isLister,controller.renderNewForm);

router.route("/myListing")
    .get(isLoggedIn,isBanned,isLister,wrapAsync(controller.myListing));

router.route("/savedListings")
    .get(isLoggedIn,isBanned,wrapAsync(controller.savedListing));

router.route("/:id/edit")
    .get(isLoggedIn,isBanned,isOwner, wrapAsync(controller.renderEditForm))

router.route("/:id/interested")
    .post(isLoggedIn,isBanned,isAvailable, wrapAsync(controller.interested));

router.route("/:id/availability")
    .post(isLoggedIn, isBanned,isOwner, wrapAsync(controller.checkAvailability));

router.route("/:id")
    .get( validateListing,wrapAsync(controller.show))
    .put(isLoggedIn, isBanned,isOwner,upload.any(),uploadMiddleware,validateListing,wrapAsync(controller.update))
    .delete(isLoggedIn,isBanned,isOwner, wrapAsync(controller.destroy));

module.exports = router;