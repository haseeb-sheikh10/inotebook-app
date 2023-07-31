const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 8000;

// midleware to use API Endpoints
app.use(express.json());
app.use(cors());

//Available Routes
app.use('/api/auth', require('./Routes/authRoute'));
// app.use('/api/notes', require('./Routes/notes'))


app.listen(port, () => {
  console.log(`iNotebook listening at http://localhost:${port}`)
})