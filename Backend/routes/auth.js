const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { RegisterValidation, LoginValidation } = require("../validation");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  //Validate User
  const { error } = RegisterValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user exists

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).send("Email is already being used by another user");

  //Hash User Password
  const salt = await bcrypt.genSalt(10);
  const HashedPassword = await bcrypt.hash(req.body.password, salt);
  
  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: HashedPassword,
  });
  try {
    await user.save();
  } catch (err) { 
    res.json({ message: err });
  }
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
  res.json({token: token});
});
router.post("/login", async (req, res) => {
  const { error } = LoginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
  res.json({token: token});
});

module.exports = router;
