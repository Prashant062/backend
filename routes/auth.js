const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "PrashantRawat@62";

//Route 1 :Create a user using: POST "api/auth/createuser". No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 Character').isLength({ min: 6 })
], async (req, res) => {

  // If there are errors, return Bad request and the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  //Check Whether the user with this email exist already
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
   const salt =await bcrypt.genSaltSync(10);
   const secPass = await bcrypt.hash(req.body.password, salt);
//Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data ={
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    
    res.json({authtoken});
    // res.json(user);
 
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error")
  }

})



//Route 2 :Authenticate a user using: POST "api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  // If there are errors, return Bad request and the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    const JWT_SECRET = 'your-secret-key'; // Replace with your actual secret key
    const authtoken = jwt.sign(payload, JWT_SECRET);
    res.json({ authtoken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});   
module.exports = router;