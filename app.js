if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const app = express();
const port = 8086;
const path = require("path");
const body = require("body-parser");
const dbUrl = process.env.ATLASDB_URL;
const methodOverride = require('method-override');
const listingsRouter = require("./Routes/listing.js");
const reviewsRouter = require("./Routes/reviews.js");
const userRouter =require('./Routes/user.js');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User =require('./models/user.js');
const Listing = require('./models/listing.js');
const cors = require('cors'); // Import CORS middleware
const { error } = require('console');

app.use(cors());

app.use(methodOverride('_method'));
async function main(){
    await mongoose.connect(dbUrl);
}

main().then(res =>{
    console.log("connected sucessfully!");
}).catch(err=>{
    console.log(err);
});

app.listen(port, (req, res)=>{
    console.log(`app is listening to the port ${port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(body.urlencoded({extended:true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public"))); 

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("error is in mongo session layer", err);
});

const sessionOptions = {
    store,
    secret :process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.CurrUser = req.user;
next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.get('/listings/category/:category', async (req, res, next) => {
    try {
      const category = req.params.category;
      const listings = await Listing.find({category: category});  // Query listings by category
      if(listings.length === 0){
         req.flash("error", "The listing you're looking does not exsit!");
        console.log("listing not found!");
        console.log(req.flash('error')); // Log to see if the message is set
        
      }
      res.send(listings);
     
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

  app.get(`/listings/location/:location`, async (req, res , next)=>{
    try{
        const location =req.params.location;
        console.log("location value:", location);
        const listings = await Listing.find({location:location});
        console.log("listing is  value:", listings);
        res.send(listings);
    }catch(error){
        res.status(500).send('server error');
    }
});

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "page not found"));
});



// //custom error handler
// app.use((err, req, res, next)=>{
//     res.send("something went wrong");
// });


//ExpressError
app.use((err, req, res, next)=>{
    let {statusCode= 500, message = "something went wrong!"} = err;
    // res.render("error.ejs");
    res.status(statusCode).send(message);
});



