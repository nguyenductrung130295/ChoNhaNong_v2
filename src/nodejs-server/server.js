
//import * as firebase from 'firebase';
var firebase = require("firebase");
  // Initialize Firebase
var config = {
  apiKey: "AIzaSyAoiVwi3leFHmgH6UGValzp4R-iGsAo_R4",
  authDomain: "nodejsdemo-d89c7.firebaseapp.com",
  databaseURL: "https://nodejsdemo-d89c7.firebaseio.com",
  storageBucket: "nodejsdemo-d89c7.appspot.com",
  messagingSenderId: "623300142025"
};
firebase.initializeApp(config);

console.log('The server is runing ...');
var now = new Date();
var millisTill10 =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 05, 0, 0) - now;
if (millisTill10 < 0) {
 millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}
console.log(millisTill10);
setTimeout(function(){
  console.log('set time out');
  database=firebase.database();
    table_u=database.ref('db_marketsfarmers/table_users');
    table_u.limitToLast(1).on('value',(snap)=>{
      snap.forEach((data)=>{
          console.log(data.val().hovaten);
        });
    });
 }, millisTill10);
console.log('runing ...');
