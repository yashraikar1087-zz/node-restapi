const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');

const todos=[{
    _id:new ObjectID(),
    text:"first test todo"
},{
    _id:new ObjectID(),      
    text:"second test todo",
    completed:true,
    completedAt:333
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
       //done();
       return Todo.insertMany(todos);
    }).then(()=>done());
});


describe('POST /todos',()=>{
    //done should be passed otherwise test wont work
    it('should create a new todo',(done)=>{
        var text='Test todo text';
        request(app).post('/todos').send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
            return  done(err);
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        });
    });


    it('should not create todo With invalid data',(done)=>{
        request(app).post('/todos').send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
            return  done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        });
    });
});

describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
        .get('/todos').expect(200).expect((res)=>{
           expect(res.body.todos.length).toBe(2);
           //console.log(res.body);
        })
        .end(done);
    });
});


describe('GET /todos/:id',()=>{
    it('should return todo doc',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
           expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should reutrn 404 if todo not found',(done)=>{
        var objectId=new ObjectID()
        request(app)
        .get(`/todos/${objectId.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should reutrn 404 for non-object ids',(done)=>{
        var objectId=new ObjectID()
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id',()=>{

    it('should remove a todo',(done)=>{
        var hexId=todos[1]._id.toHexString();
        request(app).
        delete(`/todos/${hexId}`).
        expect(200).
        expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        }).
        end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo)=>{
              expect(todo).toNotExist();
              done();
            }).catch((e)=>done(e));
        });
    });

    it('should return 404 if todo not found',(done)=>{
        var objectId=new ObjectID()
        request(app)
        .delete(`/todos/${objectId.toHexString()}`)
        .expect(404)
        .end(done);
    });

     it('should return 404 if object not valid',(done)=>{
        var objectId=new ObjectID()
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
    it('should update the todo',(done)=>{
        //grab id of first item
        var hexId=todos[0]._id.toHexString();
        var text="this should be the new text";
        request(app).
        patch(`/todos/${hexId}`).
        send({
            completed:true,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
        //update text,set completed true
        //200
        //text is changed,completed is true,completedeAt is a number
    });

    it('should clear completedAt when the todo is not completed',(done)=>{
        //grab id of second todo item
        //update text,set completed to false
        //200
        //text is changed,completed false, completedAt is null .toNotExist
        var hexId=todos[1]._id.toHexString();
        var text="this should be the new text!!2";
        request(app).
        patch(`/todos/${hexId}`).
        send({
            completed:false,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
});