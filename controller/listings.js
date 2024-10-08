const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req, res)=>{
    const allListings = await Listing.find({});
     res.render("listings/index.ejs", {allListings});
}

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate:{
        path:"author",
    }})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you are trying to access is does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async(req, res, next)=>{
    let listingFilter =req.body.listing.category;
   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
    let url = req.file.path;
    let filname = req.file.filename;
    let Newlisting =new Listing(req.body.listing);
    console.log(Newlisting);
    Newlisting.owner = req.user._id;
    Newlisting.image = {url, filname};
    Newlisting.category = listingFilter;
    Newlisting.geometry = response.body.features[0].geometry;
    let savedListing =  await Newlisting.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
}

module.exports.editListing = async(req, res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
    if(!listing){
        req.flash("error", "Listing you are trying to edit is does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing, originalImgUrl});
}
 

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filname = req.file.filename;
   listing.image = {url, filname};
   await listing.save();

   }
   req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
}





