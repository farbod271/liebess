const express = require('express');
const sendmail = require('./sendmail');


const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const { table } = require('console');

const app = express();
const PORT = 1024;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));

mongoose.connect('mongodb://localhost:27017/liebess');

const ReservationSchema = new mongoose.Schema({
  date: Date,
  name: String,
  people: Number,
  contact: String,
  table: Number
});

const ReservationModel = mongoose.model('reservations', ReservationSchema);




app.get('/' ,(req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});



app.post('/submit', (req, res) => {

  const reservation = new ReservationModel({
    date: req.body.date,
    name : req.body.name,
    people: req.body.people,
    contact: req.body.contact,
    table: req.body.table
  });

  
  reservation.save()
  .then((promise) => { sendmail(promise.date,promise.name ,promise.people, promise.contact, promise.table);
  res.send('your reservation has been made');})
  .catch(err => console.log(err));
    });




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
