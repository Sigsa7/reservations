DROP KEYSPACE IF EXISTS sigsa_reservations;
CREATE KEYSPACE sigsa_reservations
  WITH REPLICATION = {
    'class': 'SimpleStrategy', 'replication_factor': '1'
  };
USE sigsa_reservations;

/* this would support looking up open, close, and interval times of a specific restaurant */
CREATE TABLE restaurants(
  restaurant_id int,
  restaurant_name text,
  open_time time,
  close_time time,
  time_interval smallint,
  PRIMARY KEY(restaurant_id)
);

/* this table is used for updating a specific reservation or deleting a specific reservation */
CREATE TABLE reservations_by_id (
  reservation_id int,
  restaurant_id int,
  date_time timestamp,
  party_size smallint,
  table_size smallint,
  create_at date,
  PRIMARY KEY(reservation_id)
);

/* this table is used for getting the booking count- looking up all reservations for a given date and restaurant
and returning the number of records */
CREATE TABLE reservations_by_restaurant_and_creation (
  reservation_id int,
  restaurant_id int,
  date_time timestamp,
  party_size smallint,
  table_size smallint,
  create_at date,
  PRIMARY KEY((restaurant_id, create_at))
);

/* this table is used for looking up reservations that meet specific restaurant, date, and table size criteria */
CREATE TABLE reservations_by_restaurant_and_date_and_table (
  reservation_id int,
  restaurant_id int,
  date_time timestamp,
  party_size smallint,
  table_size smallint,
  create_at date,
  PRIMARY KEY((restaurant_id, date_time, table_size))
);
  /* figure out how to return a specific time range here which would cut query size down dramatically */

/*this table is used for looking up the number of tables a restaurant has for a specific table size*/
CREATE TABLE seating_by_restaurant_by_table_size (
  restaurant_id int,
  table_size smallint,
  number_of_tables smallint,
  PRIMARY KEY(restaurant_id, table_size)
);