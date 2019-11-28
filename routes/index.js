var router = require('express').Router();
var _ = require('lodash');
const date = require(__dirname + "/../date.js");

const model = require('../models/list-models');

const List = model.List;
const Item = model.Item;

router.get("/", function(req, res) {
  List.find({},'name', {sort: {name : 1}}, (err, lists)=>{
    
    if(err) console.log(err);
    else res.render("index", {day: date.getDate(), lists});
  });
  
});


router.post("/new-list", (req, res)=>{ 
  res.redirect("/lists/" + req.body.newList);
});

router.get("/lists/:list", (req, res)=>{

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
  

router.post("/addItem", function (req, res) {

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

router.post("/deleteItem", (req, res) => {
  let itemId = req.body.itemId;
  let listName = req.body.listName;

  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, (err, list)=>res.redirect("/lists/" + listName));
});

router.get("/delete/:list", (req, res)=>{
  var list = req.params.list;

  List.deleteOne({name: list}, (err)=>{
    if(err) console.error(err);

    else res.redirect("/");
  });
});

router.get("/about", function (req, res) {
  res.render("about");
});

module.exports = router;