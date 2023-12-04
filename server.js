const express = require("express");
const app = express();
const tempUsers = require("./modules/TempUsers")

const fs = require("fs");
const http = require("http");
const https = require("https");
const helmet = require('helmet');

const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 4433;

// read in the contents of the HTTPS certificate and key
const https_options = {
  key: fs.readFileSync(__dirname + "/server.key"),
  cert: fs.readFileSync(__dirname + "/server.crt")
};

// Register ejs as the rendering engine for views
app.set('view engine', 'ejs');

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// secure HTTP / HTTPS headers
app.use(helmet());

// Setup a route on the 'root' of the url to redirect to /login
app.get("/", (req, res) => {
  res.redirect("/register");
});

// Display the login html page
app.get("/login", (req, res) => {
  res.render("login", {errorMsg: ""});
});

// Process the login form
app.post("/login", (req, res) => {
  tempUsers.checkUser(req.body).then(()=>{
    res.render("message", {message: "login successful!"})
  }).catch(err=>{
    res.render("login", {errorMsg: err})
  })
});

// Display the register html page
app.get("/register", (req, res) => {
  res.render("register", {errorMsg: ""});
});

// Process the registration form
app.post("/register", (req, res) => {
  tempUsers.addUser(req.body).then(()=>{
    res.render("message", {message: "registration successful!"})
  }).catch(err=>{
    res.render("register", {errorMsg: err})
  })
});

// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).render("404");
});

// listen on ports HTTP_PORT and HTTPS_PORT. The default port for http is 80, https is 443. We use 8080 and 4433 here
// because sometimes port 80 is in use by other applications on the machine and using port 443 requires admin access on osx
http.createServer(app).listen(HTTP_PORT, ()=>{
  console.log(`HTTP Server listening on port: ${HTTP_PORT} `)
});
https.createServer(https_options, app).listen(HTTPS_PORT, ()=>{
  console.log(`HTTPS Server listening on port: ${HTTPS_PORT}`)
});