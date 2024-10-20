const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const verify = require('./verifyToken');
const { registerValidation, loginValidation } = require('../validation');



router.post('/register', async(req, res) => {

    const {error} = registerValidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);


    //check the exsitance of the user
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).json('Email user already Exist'); 


    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await user.save();
      res.json({user: user._id});
    } catch (error) {
      res.status(400).send(error);
    }
});

router.post('/login', async(req, res) => {
try{
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  //check the exsitance of the user
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json('Email user does not Exist');
    
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).json('Invalid Password');


    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.json({token, user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
  } catch(error){
    res.status(500).json(error);
  }
});


router.delete('/delete', verify, async(req, res) =>{
  try{
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/tokenIsValid', async(req, res) =>{
  try{
    const token = req.header('auth-token');
    if(!token) return res.send(false);

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if(!verified) return res.send(false);

    const user  = await User.findById(verified._id);
    if(!user) return res.send(false);

    return res.send(true);

  } catch(error){
    res.status(400).send(error);
  }
});

router.get('/', verify, async (req, res) =>{
  const user = await User.findById(req.user);
  res.send({
    name: user.name,
    id: user._id,
    email: user.email,
  });
});


module.exports = router;