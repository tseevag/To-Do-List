//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Database

const defaultItems = [{name: "shiva"}, {name: "prasad"}, {name: "gaihre"}];

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true})

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const Item = mongoose.model("Item", itemSchema);

const List = mongoose.model("List", listSchema);

// server
 
app.get("/", function(req, res) {
  List.find({},'name', {sort: {name : 1}}, (err, lists)=>{
    
    if(err) console.log(err);
    else res.render("index", {day: date.getDate(), lists});
  });
  
});


app.post("/new-list", (req, res)=>{ 
  res.redirect("/lists/" + req.body.newList);
});

app.get("/lists/:list", (req, res)=>{

  let listName = _.capitalize(req.params.list);
  
  if(listName){
    List.findOne({name: listName}, (err, listItems)=> {
      if(err) console.log(err);

      else{
        if(listItems){
          // found list -> display items
          res.render("list", {listName, newListItems: listItems.items});

        }
        
        else{
          // not found data -> create one
          let list = new List({
            name: listName,
          });
        
          list.save();
          res.redirect("/lists/" + listName);
        }
      }
    })
  }
});
  

app.post("/addItem", function (req, res) {

  const itemName = _.capitalize(req.body.newItem);
  const list = req.body.list;


  List.findOne({name: list}, (err, result)=>{
    if (!err) {

      let item = new Item({
        name: itemName
      })

      result.items.push(item);
      result.save();
    }
  });

  res.redirect("/lists/" + list);

});

app.post("/deleteItem", (req, res) => {
  let itemId = req.body.itemId;
  let listName = req.body.listName;

  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, (err, list)=>res.redirect("/lists/" + listName));
});

app.get("/delete/:list", (req, res)=>{
  var list = req.params.list;

  List.deleteOne({name: list}, (err)=>{
    if(err) console.error(err);

    else res.redirect("/");
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, () => console.log("Server started on port 3000"));
