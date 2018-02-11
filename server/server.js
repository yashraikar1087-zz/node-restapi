require('./config/config');
const _=require('lodash');

const{ObjectID}=require('mongodb');
var express=require('express');
var bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
var {authenticate}=require('./middleware/authenticate');
//save new something

var app=express();
const port=process.env.PORT;

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

app.patch('/todos/:id',(req,res)=>{
    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed)&& body.completed){
        body.completedAt=new Date().getTime();
    }
    else{
        body.copmpleted=false;
        body.completedAt=null;
    }
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });

});
//POST /users
app.post('/users',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    var user=new User(body);
    user.save().then(()=>{
        //res.send(user);
       return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    })
    .catch((e)=>{
        res.status(400).send(e);
    });
});



app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

//POST /users/login {email,password}
app.post('/users/login',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    //res.send(body);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.listen(port,()=>{
    console.log(`started on port ${port}`);
});

module.exports={app};
