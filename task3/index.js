const express = require("express");
const bodyParser = require('body-parser');
const { sequelize } = require("./config/dbconnect");
const contactModel = require('./models/contact');
const contactRoute = require('./routes/route');
const app = express();
const port = 5000;

sequelize;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
// Routes
//const Contact = contactModel(sequelize);
app.use('/api',contactRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
