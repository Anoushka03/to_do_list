//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items=[];
var workItems=[];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.get("/", function(req, res){
    var date=new Date();
    var options={
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    }
    var day=date.toLocaleDateString("en-US",options);
    res.render("list",{listTitle:day,listItem:items});

});
app.post("/",function(req,res){

    var item=req.body.newItem;
    if(req.body.list==="Work")
    {
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
    
})
app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",listItem:workItems});
});
// app.post("/work",function(req,res){
//     var workItem=req.body.newItem;
//     workItems.push(workItem);
//     res.redirect("/work");
// });
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
