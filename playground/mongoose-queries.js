const{ObjectID}=require('mongodb');
const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {User}=require('./../server/models/user');

var id='5a714b061e4e50902d99ec07';
var idUser='5a6e29845f177c542ddb911b';
if(!ObjectID.isValid(id)){
    console.log('Id not valid');
}

// Todo.find({
//     _id:id
// }).then((todos)=>{
//     console.log('Todos',todos);
// });

// Todo.findOne({
//     _id:id
// }).then((todo)=>{
//     console.log('Todo',todo);
// });

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return(console.log('id not found'));
//     }
//     console.log('Todo by Id',todo);
// }).catch((e)=>console.log(e));

User.findById(idUser).then((user)=>{
    if(!user){
        return(console.log('id not found'));
    }
    console.log('User',user);
}).catch((e)=>console.log(e));