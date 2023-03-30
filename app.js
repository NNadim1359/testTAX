const path = require('path');
const express = require('express');
const router = require('./route/defaultRoute');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'view')));
app.use('/', router);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server started on port ${port}`));
