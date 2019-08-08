/* eslint-disable no-nested-ternary */
const newRelic = require('newrelic');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const http2 = require('http2');
const fs = require('fs');
const expressStaticGzip = require('express-static-gzip');
const cluster = require('cluster');
const db = require('../database/controllers/dbControllers.js');

const port = 3005;

const app = express();
app.use(morgan('dev'));  
app.use(bodyParser.json());

app.get('/loaderio-7262d4d88a26f54c067d448224a265bd', (req, res) => {
  res.sendFile('/home/ec2-user/repo/loader/lloaderio-7262d4d88a26f54c067d448224a265bd.txt');
});

app.get('/booking/reserved/:restaurantID', db.cacheReservedDates, db.cacheTables, db.getReservedDates);

app.get('/booking/count/:restaurantID', db.getBookingCount);

app.post('/booking/create/:restaurantID', db.createReservation);

app.put('/booking/update/:reservationID', db.updateReservation);

app.delete('/booking/cancel/:reservationID', db.deleteReservation);

app.use('/booking/:restaurant_id', express.static(path.join(__dirname, '/../public/')));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


