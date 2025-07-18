require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const DB_URL = process.env.ATLASDB_URL;
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
app.use(express.static(path.join(__dirname, "/public")));
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET_CODE,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile'],
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ googleId: profile.id });
            let isNew = 0;
            if (!user) {
                isNew = 1;
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                });
            }
            user.flag = isNew;
            return done(null, user);
        }
        catch(err){
            return done(err, null);
        }
    }
))


passport.serializeUser((user, done) => {
    done(null, { id: user.id, flag: user.flag });
});
passport.deserializeUser(async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      user.flag = payload.flag;
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});



main()
    .then(() => console.log('Connected to db!'))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(DB_URL);
}

app.set('trust proxy', 1); // trust first proxy



app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/", (req, res) => {
    res.redirect("/listings");
})

app.use("/listings",listingRouter);
app.use("/",userRouter);




// handling any wrong route
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

//handling all the errors
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    req.flash("error", message);
    res.status(statusCode).redirect("/listings");
})

app.listen(port, () => {
    console.log(`listening to port: ${port}`);
})