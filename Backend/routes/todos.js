const router = require("express").Router();
const jwt = require("jsonwebtoken");
const verifyjwt = require("./verifyjwt");
const Todo = require("../models/Todo");

router.get("/", verifyjwt, async (req, res) => {
  if (!req.user._id) return res.status(400).send({ message: "Unauthorized" });
  try {
    const fetchedTasks = await Todo.find({ userID: req.user._id });

    res.status(200).json(fetchedTasks);
  } catch (error) {
    console.log(error);
  }
});

router.post("/create", verifyjwt, async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    userID: req.user._id,
  });

  try {
    res.send(await newTodo.save());
  } catch (err) {
    res.json({ message: err });
  }
});  
  
router.patch('/:_id', async(req, res) => { 

  try {
    const todo = await Todo.findById(req.params._id)
    if(todo.checked) {
      const updatedTodo = await Todo.findByIdAndUpdate({_id: req.params._id}, {$set: {checked: false}})
      res.json(updatedTodo)
    } else {
      const updatedTodo = await Todo.findByIdAndUpdate({_id: req.params._id}, {$set: {checked: true}})
      Todo.up
      res.json(updatedTodo)
    }
  } catch(err) {
    res.json(err)
  }
})

router.delete('/:_id', async (req, res) => {
  try {
    
    const deletedTodo = await Todo.deleteOne({_id: req.params._id})
    res.json(deletedTodo)
  } catch(err) {
    res.json(err)
  }
})

module.exports = router;
