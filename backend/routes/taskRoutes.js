const express = require("express");
const { getTasks, addTask, updateTask, deleteTask } = require("../controllers/taskController");
const authorization = require("../middleware/authorization");

const router = express.Router();

router.get("/tasks", authorization, getTasks);       
router.post("/tasks", authorization, addTask);      
router.put("/tasks/:id", authorization, updateTask); 
router.delete("/tasks/:id", authorization, deleteTask); 

module.exports = router;
