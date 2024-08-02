
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
// create todo model by todoSchema(ODM=Object Data Model/Mapping)
const Todo = mongoose.model('Todo', todoSchema);
const User = mongoose.model('User', userSchema);
const checkLogin = require('../middleware/checkLogin');

// get all todo
router.get('/',checkLogin, async (req, res) => {
    try {
        // get one data  without date and status
        // const result = await Todo.find().select({date:0,status:0}).limit(1);
        const result = await Todo.find().populate('user');
        res.status(200).send({ result });

    } catch (error) {
        res.status(500).json({ error: "There was a server side error when get data" });
    }
});
// get active todos my custom instance
router.get('/active-todos',  async(req, res) => {
    try {
       const todo = new Todo();
       const result = await todo.findActive();
       res.status(200).send({ result });
    } catch (error) {
        res.status(500).json({ error: "There was a server side error when active data" });
    }

});
// get title matched todos my custom statics
router.get('/js',  async(req, res) => {
    try {
       const result = await Todo.findByJS();
       res.status(200).send({ result });
    } catch (error) {
        res.status(500).json({ error: "There was a server side error when title matched data" });
    }

});
// get title matched todos by language with my custom query helpers
router.get('/lang',  async(req, res) => { 
    try {
       const result = await Todo.find().byLang('learn');
       res.status(200).send({ result });
    } catch (error) {
        res.status(500).json({ error: "There was a server side error when title matched data" });
    }

});

// get a todo by id
router.get('/:id', async (req, res) => {
    try {
        const result = await Todo.findOne({ _id: req.params.id });
        res.status(200).send({ result });

    } catch (error) {
        res.status(500).json({ error: "There was a server side error when get data" });
    }
});

// post multiple todo
router.post('/all', async (req, res) => {
    try {
        await Todo.insertMany(req.body);
        res.status(200).json({ success: "Todos were inserted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "There was a server side error" });
    }
});

// post single todo
router.post('/', checkLogin, async (req, res) => {
    try {
        const newTodo = new Todo({...req.body, user: req.userId});
        const todoObj = await newTodo.save();
        // insert todoObj id and update user Collection ( by user id)
        await User.updateOne({ _id: req.userId},{
            $push:{ todos: todoObj._id}
         })
        res.status(200).json({ success: "Todo was inserted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "There was a server side error" });
    }

});

// put todo by id
router.put('/:id', async (req, res) => {
    try {
        const id = { _id: req.params.id };
        // its only response acknowledge:true etc..
        //   const result = await Todo.updateOne(id, {
        //       $set: {
        //          status: 'active'
        //       }
        //    });
        // its  response update data and when add {new:true} then response updated new data
        const result = await Todo.findByIdAndUpdate(id, {
            $set: {
                status: 'active'
            }
        }, { new: true });
        res.status(200).json({ success: "Todo was updated successfully" });
        console.log(result);
    } catch (error) {
        res.status(500).json({ error: "There was an server side error" });
    }
});

// delete todo by id
router.delete('/:id', async (req, res) => {
    try {
        // if you want which element was deleted then..
        // const result = await Todo.findByIdAndDelete({_id:req.params.id});
        const result = await Todo.deleteOne({ _id: req.params.id });
        res.status(200).send({ result });

    } catch (error) {
        res.status(500).json({ error: "There was a server side error when get data" });
    }
});

module.exports = router;