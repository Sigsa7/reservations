DROP DATABASE IF EXISTS sigsa_reservations;
CREATE DATABASE sigsa_reservations;
\connect sigsa_reservations;
SET timezone = 'America/Los_Angeles';
SHOW TIMEZONE;

CREATE TABLE restaurants (
  id serial PRIMARY KEY,
  restaurant_name VARCHAR,
  open_time TIME,
  close_time TIME,
  close_date SMALLINT,
  time_interval SMALLINT
);

CREATE TABLE reservations (
  id serial PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  date_time TIMESTAMPTZ,
  party_size SMALLINT,
  table_size SMALLINT
);

CREATE TABLE seating (
  id serial PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  table_size SMALLINT,
  number_of_tables SMALLINT
);