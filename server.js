const express = require('express');
const { doubleCsrf } = require("csrf-csrf");
const sendmail = require('./sendmail');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer  = require('multer');
const upload = multer();

const app = express();
const PORT = 1024;



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));



const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.SECRET, 
  cookieName: "x-csrf-token", // Prefer "__Host-" prefixed names if possible
  cookieOptions: { sameSite: false, secure: false }, // not ideal for production, development only
  getTokenFromRequest: (req) => req.headers["x-csrf-token"], // A function that returns the token from the request
});



app.use(cookieParser(process.env.COOKIE_SECRET));

const csrfErrorHandler = (error, req, res, next) => {
  if (error == invalidCsrfTokenError) {
    res.status(403).json({
      error: "csrf validation error",
      token: getTokenFromRequest(req),
    });
  } else {
    next();
  }
};


mongoose.connect('mongodb://localhost:27017/liebess');

const ReservationSchema = new mongoose.Schema({
  date: Date,
  name: String,
  people: Number,
  contact: String,
  table: String
});

const ReservationModel = mongoose.model('reservations', ReservationSchema);



app.use(upload.array()); 

app.get('/' ,(req, res) => {
  res.sendFile(path.join(__dirname, 'paths', 'index.html'));
  console.log('HOME LOADED');
  
});

app.get("/csrf-token" ,(req, res) => {
  return res.json({
    token: generateToken(req, res),
  });
});



app.post('/submit', doubleCsrfProtection, csrfErrorHandler, (req, res) => {

  const reservation = new ReservationModel({
    date: req.body.date,
    name : req.body.name,
    people: req.body.people,
    contact: req.body.contact,
    table: req.body.table
  });

  
  reservation.save()
  // console.log(req.body.date, req.body.name, req.body.people, req.body.contact, req.body.table);
  // .then((promise) => { sendmail(promise.date,promise.name ,promise.people, promise.contact, promise.table);
  // res.send('your reservation has been made');})
  // .catch(err => console.log(err));
  //   });

  res.send('your reservation has been made'); 
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

});
