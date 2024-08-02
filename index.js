
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

// use
app.use(express.json());

// database connect with mongoose
mongoose.connect("mongodb://localhost/todos")
    .then(() => console.log('Connected MongoDB'))
    .catch(err => console.log(err))

// application routes
app.use('/todo', todoHandler);
app.use('/user', userHandler);


// handle error
const errorHandler = (error, req, res, next)=> {
    if (res.headerSend) {
        return next(error);
    }
    res.status(500).send(error);;
}

app.use(errorHandler);

// listening
app.listen(3000, () => {
    console.log('Listening on port 3000');
})