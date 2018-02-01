const{ObjectID}=require('mongodb');

const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {User}=require('./../server/models/user');

//Todo.remove allows to delete multiple records
// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

// /Todo.findOneAndRemove will return doc
// /Todo.findByIdAndRemove will return doc
Todo.findByIdAndRemove('5a736dc6a736b576f8600540').then((todo)=>{
    console.log(todo);
   // console.log(process.env);
});
//console.log(process.env);