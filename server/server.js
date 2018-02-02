const{ObjectID}=require('mongodb');
var express=require('express');
var bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
//save new something

var app=express();
const port=process.env.PORT||3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo=new Todo({
        text:req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
    //console.log(req.body);
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({
            todos
        });
    },(error)=>{
        res.status(400).send(e);
    })
});

//GET /todos/123342
app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    //validate id
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
         }
         res.send({todo});
    }).catch((e)=>{res.status(400).send()});
    //res.send(req.params);
});

//Delete 
app.delete('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });

});

app.listen(port,()=>{
    console.log(`started on port ${port}`);
});

module.exports={app};
