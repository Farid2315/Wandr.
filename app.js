const express= require("express");
const app=express();
const mongoose= require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const Listing= require("./models/listing.js");
const path= require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
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


app.get("/listings",async(req,res)=>{

    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings});

});
app.get("/listings/new",(req,res)=>
{
     res.render("listings/new.ejs");
});


app.get("/listings/:id", async (req,res)=>
{
   let {id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/show.ejs",{listing});

});

app.post("/listings",async(req,res,next)=>{
    try{
     let newlisting= new Listing(req.body.listing);
    await newlisting.save();
    console.log(newlisting);
    res.redirect("/listings");
    } catch(err){
        next(err);  
    }
   
});

app.get("/listings/:id/edit", async(req,res)=>{
   let {id}=req.params;
   const listing= await Listing.findById(id);
   //console.log(listing);
   res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id",async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings`);
});

app.delete("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});



// app.get("/testlisting",async(req,res)=>{
//     let sample= new Listing({
//         title: "new home",
//         description: "this is a beautful home",
//         image:"",
//         price:1200,
//         location:"karnataka",
//         country:"india"
//         });
//      await sample.save();
//      console.log("sample was saved");
//      res.send("test successful");


// });

app.use((err,req,res,next)=>{
    res.send("something went wrong")
});
app.listen(8080,()=>{
    console.log("app is listening at port 80808");

});
