const express= require("express");
const app=express();
const mongoose= require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const Listing= require("./models/listing.js");
const path= require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {ListingSchema} = require("./schema.js");

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended: true}));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

main()
.then(()=>{
    console.log("db connected");
}
)
.catch((err)=>{
    console.log(err);
}
);

async function main(){
    await mongoose.connect(mongo_url);
}

app.get("/",(req,res)=>
{
    res.send("app is listening");
});

const validateListing=(req,res,next)=>{
    
    let {error}= ListingSchema.validate(req.body);
    //console.log(result);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}

//all listings

app.get("/listings",wrapAsync(async(req,res)=>{

    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings});

}));

//show new lsiting form
app.get("/listings/new",(req,res)=>
{
     res.render("listings/new.ejs");
});

//show particular lisitng
app.get("/listings/:id", wrapAsync(async (req,res)=>
{
   let {id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/show.ejs",{listing});

}));

// add new lsiting
app.post("/listings",validateListing, wrapAsync(async(req,res)=>{
    
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }

     let newlisting= new Listing(req.body.listing);
    await newlisting.save();
    console.log(newlisting);
    res.redirect("/listings");
     
   
}));

//edit form

app.get("/listings/:id/edit",wrapAsync( async(req,res)=>{
   let {id}=req.params;
   const listing= await Listing.findById(id);
   //console.log(listing);
   res.render("listings/edit.ejs", {listing});
}));

//update lsiting
app.put("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
     
    // let result= ListingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings`);
}));

//delete listing
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//for all routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
// app.get("/testlisting",async(req,res)=>{
//     let sample= new Listing({
//         title: "new home",
//         description: "this is a beautful home",
//         image:"",
//         price:1200,+
//         location:"karnataka",
//         country:"india"
//         });
//      await sample.save();
//      console.log("sample was saved");
//      res.send("test successful");


// });

//error middleware
app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong"}=err;
    //res.status(statusCo)de).send(message);
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("app is listening at port 8080");

});
