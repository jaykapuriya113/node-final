const mongoose=require("mongoose");

const DB=async()=>{
    try {
     await mongoose.connect("mongodb+srv://jk:jk@cluster0.ltwnkwr.mongodb.net/API?retryWrites=true&w=majority")
        console.log("connection done")
} catch (error) {
    throw new Error(error);
 }
}
module.exports=DB;