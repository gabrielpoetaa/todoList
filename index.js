import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

const todoList = ['']
const todoListWork = ['']


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('index.ejs',{newTodo:todoList})
})

app.get('/work', (req, res) => {
  res.render('work.ejs',{newTodo:todoListWork})
})


app.post('/', (req,res)=>{
const newTodo = req.body['todo']
if(!newTodo){
  res.redirect('/')
}else{
todoList.push(newTodo)
console.log(todoList);
res.redirect('/');
}
})

// app.get("/work", (req,res) => {
//   res.render("work.ejs");
// });

app.post('/work', (req,res)=>{
  const newTodo = req.body['todo']
  if(!newTodo){
    res.redirect('/work')
  }else{
  todoListWork.push(newTodo)
  console.log(todoListWork);
  res.redirect('/work');
  }
  })

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});