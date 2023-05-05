const router = require("express").Router();
const Post = require("../model/Posts");
const User = require("../model/User");



router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json("deleted successfully");
        }else{
        res.status(403).json("You only delete your post")
    }
       }catch(err){
res.status(500).json(err)
        }

    });

    router.put("/:id", async(req,res)=>{
        try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body})
                res.status(200).json("updated successfully");
            }else{
                res.status(403).json("you can only update ypur post")
            }
        }catch(err){
            res.status(500).json(err);
        }
    });

    router.put("/:id/like", async(req,res)=>{
        try{
            
            const post = await Post.findById(req.params.id);
            if(!post.likes.includes(req.body.userId)){
                await post.updateOne({$push:{likes: req.body.userId}})
                res.status(200).json("liked successfully")
                
            }else{
                await post.updateOne({$pull: { likes: req.body.userId}});
                res.status(200).json("disliked successfully")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    });

    router.get("/timeline/all", async(req,res)=>{
        try{
            const currentuser = await User.findById(req.body.userId);
            const userPosts = await Post.find({userId:currentuser._id});
            const friendsPost = await Promise.all(
                currentuser.followings.map((friendId)=>{
                    return Post.find({userId: friendId})
                })
            );
                res.json(userPosts.concat(...friendsPost));

        }catch(err){
            res.status(500).json(err)
        }
    })

module.exports = router;
