import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
// const port = 3000;


// const todoList = ['']
// const todoListWork = ['']

mongoose.connect("mongodb+srv://admin-gabriel:test123@cluster0.byxftyz.mongodb.net/todoListDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const taksOne = new Item({
  name: "This is task one",
});

const taksTwo = new Item({
  name: "This is taks two",
});

const taksThree = new Item({
  name: "This is task three",
});

const defaulItems = [taksOne, taksTwo, taksThree];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Item.deleteOne({_id:'64fa84e1f3c165e81b7406a2'}).then((Fruit)=> {
//   console.log("Successfully deleted")
// });

// Get Route
app.get("/", (req, res) => {
  let tasks = [""];
  Item.find({}).then((foundItems) => {
    // we'll use the results from the find.method to render it on our website
    console.log(foundItems.length);

      res.render("index.ejs", { listTitle: "home", newTodo: foundItems });
    
  });
});

// Create custom list
app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }).then((foundList) => {
    if (!foundList) {
      //Create a new list
      const list = new List({
        name: customListName,
        items: defaulItems,
      });

      list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("index.ejs", {
        listTitle: foundList.name,
        newTodo: foundList.items,
      });
    }
  });
});

// Save items
app.post("/", (req, res) => {
  const itemName = req.body["todo"];
  const listName = req.body.list;

  console.log(listName); // list name

  const item = new Item({
    name: itemName,
  });

  if (listName === "home") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

// Delete item
app.post("/delete", (req, res) => {
  const listName = req.body.listName
  const checkedItemId = req.body["delete"];

  if(listName === "home"){
    Item.findByIdAndRemove(checkedItemId).then(() => {
      console.log(`Successfully deleted checked item from ${listName} list`);
      res.redirect("/");
    });
  }
  else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then((foundList) => {
      if(foundList){
        res.redirect("/" + listName);
      }
    })
  }

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
