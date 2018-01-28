//const MongoClient=require("mongodb").MongoClient;

const {MongoClient,ObjectID}=require("mongodb");

// var obj=new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Unable to connect to MongoDb Server');
    }
        console.log('Connected to MongoDb Server');
        // db.collection('Todos').insertOne({
        //     text:'something to do',
        //     completed:false
        // },(err,result)=>{
        //     if(err){
        //         return console.log('unable to insert todo',err);
        //     }
        //     console.log(JSON.stringify(result.ops,undefined,2));
        // });
        // db.collection('Users').insertOne({
        //     name:"Yash Raikar",
        //     age:25,
        //     location:"Fort Collins"
        // },(error,result)=>{
        //     if(err){
        //         return console.log('unable to insert todo',err);
        //     }
        //     console.log(JSON.stringify(result.ops,undefined,2));
        // });

        db.close();
});
