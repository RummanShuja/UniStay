const User = require("../models/user.js");
const passport = require("passport");

module.exports.signup = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.loginGoogle = passport.authenticate('google', {
    scope: ['profile', 'email']
})

module.exports.auth = (req, res) => {
    req.flash("success", "welcome to UniStay");
    let link = res.locals.redirectUrl || "/listings";
    if (req.user.flag) {
        return res.redirect('/profile');
    }
    else {
        return res.redirect(link);
    }
}

module.exports.renderProfileForm = (req, res) => {
    res.render("user/profile.ejs");
};

module.exports.updateProfile = async (req, res) => {
    const userId = req.user._id;
    const regrex = /^[0-9]{10}$/;
    const {phoneNumber} = req.body.user;
    if(regrex.test(phoneNumber)){
        await User.findByIdAndUpdate(userId, req.body.user);
        res.redirect("/listings");
    }
    else{
        req.flash("error", "Invalid phone number! Must be 10 digits.")
        res.redirect("/profile");
    }
}

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success", "Logged out")
        res.redirect('/listings');
    });
}

module.exports.bookmark = async(req,res)=>{
    let {id} = req.params;
    let currUser = req.user;
    let user = await User.findById(currUser._id);
    let update = user.savedListing.includes(id) ? {$pull: {savedListing: id}} :  {$addToSet: { savedListing: id }};
    await User.findByIdAndUpdate(currUser._id, update);
    res.status(200).send('ok');
}

