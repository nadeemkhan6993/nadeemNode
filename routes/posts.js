const router = require('express').Router();
const verify = require('./verifyToken');
const Post = require('../model/Posts');


router.post('/new', verify, async(req, res) => {

    //create a new post
    const posts = new Post({
        userId: req.user,
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedPost = await posts.save();
        res.send(savedPost);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/all', verify, async(req, res) =>{
    const posts = await Post.find({userId: req.user});
    res.json(posts);
});

router.delete('/:id', verify, async(req, res) => {
    const post = await Post.findOne({userId: req.user, _id: req.params.id});
    if(!post)
        return res.status(400).send({msg: "No post belongs to this User"});
    try{
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        res.json(deletedPost);
  } catch (error) {
    res.status(400).json(error);
  }
})


module.exports = router;