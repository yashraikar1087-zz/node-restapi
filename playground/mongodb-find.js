//const MongoClient=require("mongodb").MongoClient;

const {MongoClient,ObjectID}=require("mongodb");

// var obj=new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Unable to connect to MongoDb Server');
    }
        console.log('Connected to MongoDb Server');
        db.collection('Todos').find({completed:true}).toArray().then((docs)=>{
            console.log('todos');
            console.log(JSON.stringify(docs,undefined,2))
        },(err)=>{
            console.log('unable to fetch todos',err);
        });
      //  db.close();
      //deleteMany
      //db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{

     // console.log(result)});



     
});
