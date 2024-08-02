
const mongoose = require('mongoose');
// create todoSChema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    }, 
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }

});

// custom instance methods
todoSchema.methods = {
    findActive : function(){
        return mongoose.model('Todo').find({status:'active'});
    }
}
// custom statics methods
todoSchema.statics = {
    findByJS : function(){
        return this.find({ title: /js/i });
    }
}
// custom query helpers (find().select().limit)
todoSchema.query = {
    byLang : function(lang){
        return this.find({ title: new RegExp(lang ,'i' )});
    }
}

module.exports = todoSchema;