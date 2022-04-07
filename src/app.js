const express = require('express');
const path = require('path');
const app = express();
const hbs = require("hbs");

require("./db/conn");
const Register = require("./models/register");
const async = require('hbs/lib/async');

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/",(req, res) => {
    res.render("about")
});

app.get("/about",(req, res) => {
  res.render("about")
});

app.get("/register",(req, res) => {
    res.render("register")
});
app.get("/login",(req, res) => {
    res.render("login");
});
app.post("/register",async(req, res) => {
    //res.render("register")
    try{
      //  console.log(req.body.Name);
       // res.send(req.body.Name);
       const password = req.body.password;
       const cpass = req.body.confirmpassword;

       if(password == cpass){

        const registerEmployee = new Register({
            name: req.body.name,
            email:req.body.email,
            password:password,
            confirmpassword:cpass
        })

        const registered = await registerEmployee.save();
        res.status(201).render("index");


       }else {
           res.send("Password not match")
       }

    } catch (error){
        res.status(400).send(error)
    }

});

//login check
app.post("/login", async(req, res) => {
    try {
        const email =  req.body.email;
        const password =  req.body.password;

       // console.log(`${email} and password is ${password}`)
        const useremail = await  Register.findOne({email:email});
      //  res.send(useremail.password);
      //  console.log(useremail);
      if(useremail.password === password){
          res.status(201).render("index");
      }else{
          res.send("invalid login detail")
      }


    } catch (error) {
        res.status(400).send("invalid login details")
    }
});


app.listen(port,() =>{
    console.log(`server is running at port no ${port}`);
})