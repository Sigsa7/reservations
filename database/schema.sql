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
  time_interval SMALLINT
);

CREATE TABLE reservations (
  id serial PRIMARY KEY,
  restaurant_id INTEGER,
  date_time TIMESTAMPTZ,
  party_size SMALLINT,
  table_size SMALLINT
);

CREATE TABLE seating (
  id serial PRIMARY KEY,
  restaurant_id INTEGER,
  table_size SMALLINT,
  number_of_tables SMALLINT
);

/* foreign keys are adeded to reservations and seating tables after data is loaded into postgres */