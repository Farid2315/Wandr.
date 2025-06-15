const mongoose=require("mongoose");
const schema= mongoose.Schema;
const listing_schema=new schema({

    title:{
        type: String,
        required:true
    },
    description:String,
    image: {
        type:String,
        default : "https://media.istockphoto.com/id/1156192694/photo/suburban-house.jpg?s=612x612&w=0&k=20&c=z9Df2E9keV_47zYIY6Q0IDveIaydlXMVYcoZ5nGZwWU=",
        set : (v)=>v= v===""? "https://media.istockphoto.com/id/1156192694/photo/suburban-house.jpg?s=612x612&w=0&k=20&c=z9Df2E9keV_47zYIY6Q0IDveIaydlXMVYcoZ5nGZwWU=": v,
    },
    price:Number,
    location:String,
    country:String
});
const Listing=mongoose.model("Listing",listing_schema);
module.exports=Listing;
