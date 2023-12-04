const bcrypt = require("bcryptjs")

let users = [];

function addUser(userData){
  return new Promise((resolve,reject)=>{

    // check if the user exists in the array
    let foundUser = users.find(user => userData.username == user.username);

    if(foundUser){
      reject("User already Exists")
    }else{
      if(userData.password == userData.password2){

        bcrypt.hash(userData.password, 10).then(password=>{
          let {username, email} = userData; 
          users.push({username, email, password});
          console.log(users);
          resolve();
        }).catch(err=>{
          reject("error hashing password")
        });
      }else{
        reject("Passwords don't match")
      }
    }
  });
}

function checkUser(userData){
  return new Promise((resolve,reject)=>{

     // check if the user exists in the array
     let foundUser = users.find(user => userData.username == user.username);

     if(foundUser){
        bcrypt.compare(userData.password, foundUser.password).then(match=>{
          if(match){
            resolve()
          }else{
            reject("Incorrect Password")
          }
        }).catch(err=>{
          reject("unable to validate password")
        })
     }else{
      reject("User not found")
     }
  });
}

module.exports = {addUser, checkUser};