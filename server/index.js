const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// midleware to use API Endpoints
app.use(express.json());
app.use(cors());


// Serving client react app build 
const path = require('path');
const _dirname = path.dirname("");
const buildPath = path.join(_dirname , "../client/build");

app.use(express.static(buildPath));

app.get('/*', (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    (err) => {
      if(err)
      {
        res.status(500).send(err);
      }
    }
  )
})


//Available Routes
app.use('/api/auth', require('./Routes/authRoute'));
// app.use('/api/notes', require('./Routes/notes'))


app.listen(port, () => {
  console.log(`iNotebook listening at http://localhost:${port}`)
})