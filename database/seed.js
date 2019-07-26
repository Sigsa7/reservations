/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
const fs = require('fs');
const faker = require('faker');
const os = require('os');
const moment = require('moment');

const intervalOptions = [15, 30, 60];
const minuteOptions = {
  15: [15, 30, 45, 0],
  30: [30, 0],
  60: [0],
};
const openOptions = [7, 8, 9, 10];
const closeOptions = [20, 21, 22, 23];
const tableOptions = [2, 4, 6, 8, 10, 20];
const tableNumberOptions = [3, 5, 7, 9, 11];

const generateRandom = function (options) {
  return Math.floor(Math.random() * options.length);
};

const generateMinute = function (interval) {
  const options = minuteOptions[interval];
  return options[generateRandom(options)];
};

const createRestaurant = function () {
  const restaurantName = `${faker.lorem.word()} ${faker.lorem.word()}`;
  const openTime = openOptions[generateRandom(openOptions)];
  const closeTime = closeOptions[generateRandom(closeOptions)];
  const intervalTime = intervalOptions[generateRandom(intervalOptions)];

  const row = `${restaurantName},${openTime}:00,${closeTime}:00,${intervalTime}\n`;
  const output = [];
  output.push(row);
  return [output.join(os.EOL), openTime, closeTime, intervalTime];
};

const createSeating = function (restaurant) {
  const output = [];
  // some restaurants are very small and have limited seating options
  let largestTable;
  let smallestTable;
  if (restaurant % 100 === 0) {
    for (let i = 0; i < 3; i++) {
      const assign = faker.random.number({ min: 0, max: 3 });
      largestTable = largestTable > tableOptions[i] ? largestTable : tableOptions[i];
      smallestTable = smallestTable > tableOptions[i] ? smallestTable : tableOptions[i];
      const row = `${restaurant},${tableOptions[i]},${tableNumberOptions[assign]}`;
      output.push(row);
    }
  } else {
    for (let j = 0; j < tableOptions.length; j++) {
      const assign = generateRandom(tableNumberOptions);
      largestTable = largestTable > tableOptions[j] ? largestTable : tableOptions[j];
      smallestTable = smallestTable < tableOptions[j] ? smallestTable : tableOptions[j];
      const row = `${restaurant},${tableOptions[j]},${tableNumberOptions[assign]}`;
      output.push(row);
    }
  }
  return [output.join('\n') + '\n', largestTable, smallestTable];
};

const createReservation = function (restaurantID, openTime, closeTime, intervalTime, largestTable, smallestTable) {
  let output = [];
  const start = moment('2019-08-01');
  const stop = start.clone().add(3, 'months');

  if (restaurantID < 2100000) {
    // these restaurants have only a few bookings each month
    for (let j = moment(start); j.isBefore(stop); j.add(15, 'days')) {
      const partySize = faker.random.number({ min: 1, max: largestTable });
      const tableSize = partySize > 10 ? 20 : ((partySize % 2 === 0) ? partySize : partySize + 1);
      const date = j.format('YYYY-MM-DD');
      const hour = faker.random.number({ min: openTime, max: closeTime });
      const minute = generateMinute(intervalTime);
      const timeStamp = `${date} ${hour}:${minute}`;
      const row = `${restaurantID},${timeStamp},${partySize},${tableSize}`;
      output.push(row);
    }
  } else {
    // only 30% of restaurants have many bookings a month
    for (let i = moment(start); i.isBefore(stop); i.add(2, 'days')) {
      let partySize = faker.random.number({ min: 1, max: largestTable });
      let tableSize = partySize > 10 ? 20 : ((partySize % 2 === 0) ? partySize : partySize + 1);
      const date = i.format('YYYY-MM-DD');
      let hour = faker.random.number({ min: openTime, max: closeTime });
      let minute = generateMinute(intervalTime);
      let timeStamp = `${date} ${hour}:${minute}`;
      let row = `${restaurantID},${timeStamp},${partySize},${tableSize}`;
      output.push(row);

      hour = faker.random.number({ min: openTime, max: closeTime });
      minute = generateMinute(intervalTime);
      timeStamp = `${date} ${hour}:${minute}`;
      partySize = faker.random.number({ min: 1, max: largestTable });
      tableSize = partySize > 10 ? 20 : ((partySize % 2 === 0) ? partySize : partySize + 1);
      row = `${restaurantID},${timeStamp},${partySize},${tableSize}`;
      output.push(row);

      hour = faker.random.number({ min: openTime, max: closeTime });
      minute = generateMinute(intervalTime);
      timeStamp = `${date} ${hour}:${minute}`;
      partySize = faker.random.number({ min: 1, max: largestTable });
      tableSize = partySize > 10 ? 20 : ((partySize % 2 === 0) ? partySize : partySize + 1);
      row = `${restaurantID},${timeStamp},${partySize},${tableSize}`;
      output.push(row);
    }
  }
  return output.join('\n') + '\n';
};

const generateData = () => {
  const restaurantsWriter = fs.createWriteStream('rawdata/restaurants.csv');
  const reservationsWriter = fs.createWriteStream('rawdata/reservations.csv');
  const seatingWriter = fs.createWriteStream('rawdata/seating.csv');

  console.log('generate restaurants/reservations: time before seed', moment().format('LTS'));

  let i = 3000000;

  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        const restaurantData = createRestaurant();
        restaurantsWriter.write(restaurantData[0], 'utf8');

        const seatingData = createSeating(i + 1);
        seatingWriter.write(seatingData[0], 'utf8');
        
        const reservationsData = createReservation(i + 1, restaurantData[1], restaurantData[2], restaurantData[3], seatingData[1], seatingData[2]);
        reservationsWriter.write(reservationsData, 'utf8');

        console.log('generate restaurants/reservations: time after seed', moment().format('LTS'));
      } else if (i % 100 === 0) {
        // these restaurants have no bookings
        const restaurantData = createRestaurant();
        restaurantsWriter.write(restaurantData[0], 'utf8');

        const seatingData = createSeating(i + 1);
        seatingWriter.write(seatingData[0], 'utf8');
      } else {
        const restaurantData = createRestaurant();
        restaurantsWriter.write(restaurantData[0], 'utf8');

        const seatingData = createSeating(i + 1);
        seatingWriter.write(seatingData[0], 'utf8');

        const reservationsData = createReservation(i + 1, restaurantData[1], restaurantData[2], restaurantData[3], seatingData[1], seatingData[2]);
        ok = reservationsWriter.write(reservationsData, 'utf8');
      }
    } while (i > 0 && ok);
    if (i > 0) {
      reservationsWriter.once('drain', write);
    }
  }
  write();
};

generateData();
