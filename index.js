const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const userRoute = require("./routes/user") 
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts");

//to config env

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true, useUnifiedTopology: true},()=>{
    console.log("mongo");
});

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


app.listen(8001, ()=>{
    console.log("server is running");
})