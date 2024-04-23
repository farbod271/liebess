require('dotenv').config()
const sgMail = require('@sendgrid/mail')


function sendmail(date,name, people, contact, table) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: process.env.RECIEVER,
    from: process.env.SENDER, 
    subject: 'NEW RESERVATION MADE!',
    text: `Name: ${name}\nBooking date: ${date}\nNumber of People: ${people}\nContact information: ${contact}\nTable number: ${table}`
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = sendmail;

