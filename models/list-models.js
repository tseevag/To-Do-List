const mongoose = require("mongoose");

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

exports.Item = mongoose.model("Item", itemSchema);

exports.List = mongoose.model("List", listSchema);
