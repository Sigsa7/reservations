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


// const options = {
//   key: fs.readFileSync('./certificates/server.key'),
//   cert: fs.readFileSync('./certificates/server.crt'),
//   requestCert: false,
//   rejectUnauthorized: false,
// };

// const server = http2.createSecureServer(options);

// server.on('stream', (server, headers) => {
//   stream.respond({
//     'content-type': 'text/html',
//     ':status': 200, 
//   });
//   stream.end('Hello World');
// });

if (cluster.isMaster) {
  const cpuCount = require('os').cpus().length;
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  const app = express();
  // app.use(morgan('dev'));  
  app.use(bodyParser.json());

  app.use(express.static(path.join(__dirname, '/../public/')));

  app.use('/:restaurant_id', express.static(path.join(__dirname, '/../public/')));

  app.get('/booking/reserved/:restaurantID', db.cacheReservedDates, db.cacheTables, db.getReservedDates);

  app.get('/booking/count/:restaurantID', db.getBookingCount);

  app.post('/booking/create/:restaurantID', db.createReservation);

  app.put('/booking/update/:reservationID', db.updateReservation);

  app.delete('/booking/cancel/:reservationID', db.deleteReservation);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));

  // server.listen(port, 'localhost', () => {
  //   console.log(`Server running at https://localhost:${port}/ !!!`);
  // });
}
