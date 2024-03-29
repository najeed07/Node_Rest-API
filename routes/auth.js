const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");


router.get("/register", async (req,res)=>{
    
   try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password:hashedPassword
    })

    const user = await newUser.save();
    res.status(200).json(user);
   }catch(err){
    console.log(err);
   }
})

router.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).send("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).send("password does not match")
    
        res.status(200).json(user);

}catch(err){
    console.log(err);
}
})



module.exports = router;