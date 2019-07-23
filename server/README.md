# Booking server

## API Server Routes

#### `GET /booking/availability/:restaurantID?year=YEAR&month=MONTH&day=DAY&party=SIZE&time=TIME`
**Parameters**: Restaurant ID
**Query String**:
    1) Date requested (YYYY-MM-DD)
    2) Party size
    3) Time


Given a specific restaurant ID, a specific date, and a specific party size, this request will send back times that are available for booking. If a time is provided, the response will include times within a 2.5 hour block before and after the time provided. If no time is provided or if there are no available times within that block, the response will be all other available times given the date selected.