//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const app = express();
const _=require("lodash")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://admin-Anoushka:Test123@cluster0-zfakb.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});
const itemsSchema={
    name:String
};
const Item= mongoose.model("item",itemsSchema);
const item1=new Item({
    name:"Welcome to to-do list"
});

const item2=new Item({
    name:"Hit the + button to add new item"
});

const item3=new Item({
    name:"<-- Hit the checkbox to delete an item"
});
const defaultItems=[item1,item2,item3];

const listSchema={
    name:String,
    items:[itemsSchema]
};
const List=mongoose.model("List",listSchema);

app.get("/", function(req, res){
    Item.find({},function(err,foundItem){
        if(foundItem.length===0)
        {
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("successfully added the data");
                }
            });   
            res.redirect("/");
        }else{

        
            res.render("list",{listTitle:"Today",listItem:foundItem});
        }
    })
  
    

});

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
        if(!err)
        {
            if(!foundList)
            {
                const customItem=new List({
                    name:customListName,
                    items:defaultItems
                });
                customItem.save();
                res.redirect("/"+customItem.name);
            } 
            else{
                res.render("List",{listTitle:foundList.name,listItem:foundList.items});
            }
        }
    });
    
});
app.post("/",function(req,res){

    const newItem=req.body.newItem;
    const listName=req.body.list;
    const item=new Item({
        name:newItem
    });
    if(listName==="Today")
    {
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
    
});

app.post("/delete",function(req,res){
    const itemID = req.body.checkbox;
    const listName=req.body.listName;
    if(listName==="Today"){
        Item.findByIdAndRemove(itemID,function(err){
            if(!err)
            {
                res.redirect("/");
                
            }
        });  
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemID}}},function(err,foundList){
            if(!err)
            {
                res.redirect("/"+listName);
            }
        });
    }
    
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
