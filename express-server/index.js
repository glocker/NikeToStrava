const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send({ message: 'Hello WWW!' });
});

app.listen(3333, () => {
    console.log('Application listening on port 3333!');
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

