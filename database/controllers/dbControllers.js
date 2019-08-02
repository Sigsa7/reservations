const { Pool } = require('pg');
const moment = require('moment');
const redis = require('redis');

const client = redis.createClient();

client.on('connect', function() {
  console.log('connected');
});

const pool = new Pool({
  database: 'sigsa_reservations2',
});


const cacheReservedDates = (req, res, next) => {
  const { restaurantID } = req.params;
  const { dateTime, partySize } = req.body;
  const tableSize = partySize > 10 ? 20 : (partySize % 2 === 0 ? partySize : partySize + 1);
  const reservationKey = `${restaurantID}-${dateTime}-${tableSize}`;
  client.get(reservationKey, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

const cacheTables = (req, res, next) => {
  const { restaurantID } = req.params;
  let { dateTime } = req.body;
  const { partySize } = req.body;
  const tableSize = partySize > 10 ? 20 : (partySize % 2 === 0 ? partySize : partySize + 1);
  const tableKey = `${restaurantID}-${tableSize}`;
  const reservationKey = `${restaurantID}-${dateTime}-${tableSize}`;
  dateTime = moment.utc(dateTime).format('YYYY-MM-DD HH:mm');
  const start = moment.utc(dateTime).clone().subtract(2, 'hours').format('YYYY-MM-DD HH:mm');
  const end = moment.utc(dateTime).clone().add(2, 'hours').format('YYYY-MM-DD HH:mm');

  client.get(tableKey, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      // means you have access to the number of tables, so get the reserved dates, set it, and send the response
      const number = Number(data);

      pool.query('SELECT date_time, count(*) FROM reservations WHERE restaurant_id = $1 AND date_time >= $2 AND date_time <= $3 AND table_size = $4 GROUP BY date_time',
        [restaurantID, start, end, tableSize], (err, rezData) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            const filtered = rezData.rows.filter(element => number - element.count < 1);
            const reserved = filtered.map(element => element.date_time);
            client.set(reservationKey, JSON.stringify(reserved));
            res.send(reserved);
          }
        });
    } else {
      // if you don't have the number of tables, need to getTables and perform the entire query
      next();
    }
  });
};

const getReservedDates = (req, res) => {
  const { restaurantID } = req.params;
  let { dateTime } = req.body;
  const { partySize } = req.body;
  const tableSize = partySize > 10 ? 20 : (partySize % 2 === 0 ? partySize : partySize + 1);
  const tableKey = `${restaurantID}-${tableSize}`;
  const reservationKey = `${restaurantID}-${dateTime}-${tableSize}`;
  dateTime = moment.utc(dateTime).format('YYYY-MM-DD HH:mm');
  const start = moment.utc(dateTime).clone().subtract(2, 'hours').format('YYYY-MM-DD HH:mm');
  const end = moment.utc(dateTime).clone().add(2, 'hours').format('YYYY-MM-DD HH:mm');
  let number;

  pool.query('SELECT number_of_tables FROM seating WHERE restaurant_id = $1 AND table_size = $2',
    [restaurantID, tableSize], (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        number = data.rows.length === 0 ? 0 : data.rows[0].number_of_tables;
        client.set(tableKey, number);

        pool.query('SELECT date_time, count(*) FROM reservations WHERE restaurant_id = $1 AND date_time >= $2 AND date_time <= $3 AND table_size = $4 GROUP BY date_time',
          [restaurantID, start, end, tableSize], (err, rezData) => {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            } else {
              const filtered = rezData.rows.filter(element => number - element.count < 1);
              const reserved = filtered.map(element => element.date_time);
              client.set(reservationKey, JSON.stringify(reserved));
              res.send(reserved);
            }
          });
      }
    });
};

const getBookingCount = (req, res) => {
  const { restaurantID } = req.params;
  const { date } = req.body;

  pool.query('SELECT COUNT(*) FROM reservations WHERE restaurant_id = $1 AND create_at = $2', [restaurantID, date], (err, data) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(data.rows[0]);
  });
};

const createReservation = (req, res) => {
  const { restaurantID } = req.params;
  const { dateTime, partySize } = req.body;
  const tableSize = partySize > 10 ? 20 : (partySize % 2 === 0 ? partySize : partySize + 1);
  const createAt = moment.utc().format('YYYY-MM-DD');

  pool.query('INSERT INTO reservations (restaurant_id, date_time, party_size, table_size, create_at) VALUES($1, $2, $3, $4, $5)',
    [restaurantID, dateTime, partySize, tableSize, createAt], (err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
};

const updateReservation = (req, res) => {
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
};

const deleteReservation = (req, res) => {
  const { reservationID } = req.params;

  pool.query('DELETE FROM reservations where id = $1', [reservationID], (err, data) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
};

module.exports = {
  getReservedDates,
  getBookingCount,
  createReservation,
  updateReservation,
  deleteReservation,
  cacheReservedDates,
  cacheTables,
};
