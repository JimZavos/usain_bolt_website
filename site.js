const express = require("express");
const fs = require("fs");

const site = express();
site.use(express.json());
site.use(express.static("public"));

//Διαχείρηση σύνδεσης και αποσύνδεσης χρήστη
let login = false;

site.post("/api/login", function (req, res){
    const {username, password} = req.body;
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    const user = users.find(function (u){if(u.username === username && u.password === password){
        return true
        } 
        else {
            return false}
    });
    
    if(user){
        login = true;
        res.json({success: true});
    } 
    else {res.json({success: false});
    }
});

site.post("/api/logout", function (req, res){
    login = false;
    res.json({success: true});
});

//Πληροφορίες αθλητή
site.get("/api/athlete_data/:category", function (req, res){
    const data = JSON.parse(fs.readFileSync("./data/athlete_data.json"));
    const cat = req.params.category;
    res.json(data[cat] || []);
});

site.post("/api/athlete_data/:category", function (req, res){
    if(!login)
        return res.sendStatus(403);
    const data = JSON.parse(fs.readFileSync("./data/athlete_data.json"));
    const cat = req.params.category;
    data[cat] = req.body;
    fs.writeFileSync("./data/athlete_data.json", JSON.stringify(data, null, 2));
    res.json({success: true});
});

//Σύνδεσμοι
site.get("/api/links/:category", function (req, res){
    const data = JSON.parse(fs.readFileSync("./data/links.json"));
    const cat = req.params.category;
    res.json(data[cat] || []);
});

site.post("/api/links/:category", function (req, res){
    if(!login)
        return res.sendStatus(403);
    const data = JSON.parse(fs.readFileSync("./data/links.json"));
    const cat = req.params.category;
    data[cat] = req.body;
    fs.writeFileSync("./data/links.json", JSON.stringify(data, null, 2));
    res.json({success: true});
});

site.listen(3000, function (){
    console.log("Server is on")
});