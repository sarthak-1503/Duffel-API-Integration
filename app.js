require('dotenv').config();
const express = require('express');
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = 5000;
app.use(cors({origin: true}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set("view engine","ejs")

app.use('/',require('./routes/home'))
app.use('/api/flights-queries',require('./routes/flightsSearchQuery'))
app.use('/api/orders',require('./routes/manageOrders'))
app.use('/api/payments',require('./routes/managePayments'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
