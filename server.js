const express = require('express');
const helmet = require("helmet");
const { doubleCsrf } = require("csrf-csrf");
const sendmail = require('./sendmail');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer  = require('multer');
const upload = multer();
const axios = require('axios');


const app = express();
const PORT = 1024;




app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "deggenhub.de"],
        "default-src": ["'self'"],
        "script-src-elem": ["'self'", "https://www.google.com/recaptcha/", "https://www.gstatic.com/recaptcha/"],
        "frame-src": ["'self'", "https://www.google.com/recaptcha/"],
        "style-src-elem": ["'self'", "https://fonts.googleapis.com/"],
        "style-src": null,
      },
    },
  }),
);
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
  cookieName: "x-csrf-token", 
  cookieOptions: { sameSite: false, secure: false }, 
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
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



app.post('/submit', doubleCsrfProtection, csrfErrorHandler, async (req, res) => {

  const captchaResponse = req.body['g-recaptcha-response'];
  if (captchaResponse) {
    const captchaverified = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
    secret: process.env.CAPTCHA_SECRET,
    response: captchaResponse
  }
})

if (captchaverified.data.success === true) {

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
    }


  }




});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

});
