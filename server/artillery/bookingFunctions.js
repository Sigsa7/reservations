'use strict';

module.exports = {
  createReservation,
  checkReserved
};

const faker = require('faker');
const moment = require('moment');
const minuteOptions = ['15', '30', '45', '00'];

function checkReserved(userContext, events, done) {

  const restaurantOptions = [
    faker.random.number({ min: 1, max: 200000 }),
    faker.random.number({ min: 1, max: 200000 }),
    faker.random.number({ min: 1, max: 200000 }),
    faker.random.number({ min: 1, max: 200000 }),
    faker.random.number({ min: 1, max: 200000 }),
    faker.random.number({ min: 1, max: 200000 }),
    faker.random.number({ min: 1, max: 200000 }),
    faker.random.number({ min: 1, max: 200000 }),
    faker.random.number({ min: 200001, max: 2000000 }),
    faker.random.number({ min: 200001, max: 2000000 }),
  ];

  const restaurantID = restaurantOptions[Math.floor(Math.random() * 10)];
  const partySize = faker.random.number({ min: 1, max: 20 });
  const date = moment.utc().add(faker.random.number({ min: 1, max: 90 }), 'days').format('YYYY-MM-DD');
  const time = `${Math.ceil(Math.random() * 23)}:${minuteOptions[Math.floor(Math.random() * 4)]}:00`;
  const dateTime = `${date} ${time}`;
  // add variables to virtual user's context:
  userContext.vars.partySize = partySize;
  userContext.vars.dateTime = dateTime;
  userContext.vars.restaurantID = restaurantID;
  // continue with executing the scenario:
  return done();
}

function createReservation(userContext, events, done) {
  // generate restaurant ID
  const restaurantID = faker.random.number({ min: 1, max: 2000000 });
  
  // generate date
  const date = moment.utc().add(faker.random.number({ min: 1, max: 90 }), 'days').format('YYYY-MM-DD');
  const time = `${Math.ceil(Math.random() * 23)}:${minuteOptions[Math.floor(Math.random() * 4)]}:00`;
  const dateTime = `${date} ${time}`;

  const partySize = faker.random.number({ min: 1, max: 20 });
  
  // add variables to virtual user's context:
  userContext.vars.dateTime = dateTime;
  userContext.vars.restaurantID = restaurantID;
  userContext.vars.partySize = partySize;
  // continue with executing the scenario:
  return done();
}
