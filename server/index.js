/* eslint-disable no-nested-ternary */
const newRelic = require('newrelic');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const moment = require('moment');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');

const app = express();

const pool = new Pool({
  database: 'sigsa_reservations2',
});

const port = 3005;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/../public/')));
app.use('/:restaurant_id', express.static(path.join(__dirname, '/../public/')));
app.use('/', expressStaticGzip('/../public/', {
  enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders: function (res, path) {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    }
  })
);

app.get('/booking/reserved/:restaurantID', (req, res) => {
  const { restaurantID } = req.params;
  let { dateTime } = req.body;
  const { partySize } = req.body;
  const tableSize = partySize > 10 ? 20 : (partySize % 2 === 0 ? partySize : partySize + 1);
  dateTime = moment(dateTime).format('YYYY-MM-DD HH:mm');
  const start = moment(dateTime).clone().subtract(2, 'hours').format('YYYY-MM-DD HH:mm');
  const end = moment(dateTime).clone().add(2, 'hours').format('YYYY-MM-DD HH:mm');
  let number;
  pool.query('SELECT number_of_tables FROM seating WHERE restaurant_id = $1 AND table_size = $2',
    [restaurantID, tableSize], (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        number = data.rows.length === 0 ? 0 : data.rows[0].number_of_tables;
  
        pool.query('SELECT date_time, count(*) FROM reservations WHERE restaurant_id = $1 AND date_time >= $2 AND date_time <= $3 AND table_size = $4 GROUP BY date_time',
          [restaurantID, start, end, tableSize], (err, rezData) => {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            } else {
              const filtered = rezData.rows.filter(element => number - element.count < 1);
              const reserved = filtered.map(element => element.date_time);
              res.send(reserved);
            }
          });
      }
    });
});

app.get('/booking/count/:restaurantID', (req, res) => {
  const { restaurantID } = req.params;
  const { date } = req.body;

  pool.query('SELECT COUNT(*) FROM reservations WHERE restaurant_id = $1 AND create_at = $2', [restaurantID, date], (err, data) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(data.rows[0]);
  });
});

app.post('/booking/:restaurantID', (req, res) => {
  const { restaurantID } = req.params;
  const { dateTime, partySize } = req.body;
  const tableSize = partySize > 10 ? 20 : (partySize % 2 === 0 ? partySize : partySize + 1);
  const createAt = moment().format('YYYY-MM-DD');

  pool.query('INSERT INTO reservations (restaurant_id, date_time, party_size, table_size, create_at) VALUES($1, $2, $3, $4, $5)',
    [restaurantID, dateTime, partySize, tableSize, createAt], (err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
});

app.put('/booking/:reservationID', (req, res) => {
  const { reservationID } = req.params;
  const { dateTime, partySize } = req.body;
  const tableSize = partySize > 10 ? 20 : (partySize % 2 === 0 ? partySize : partySize + 1);

  pool.query('UPDATE reservations SET date_time = $1, party_size = $2, table_size = $3 WHERE id = $4',
    [dateTime, partySize, tableSize, reservationID], (err, data) => {
      if (err) {
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
});

app.delete('/booking/:reservationID', (req, res) => {
  const { reservationID } = req.params;

  pool.query('DELETE FROM reservations where id = $1', [reservationID], (err, data) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))