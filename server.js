var express = require('express');
var app = express();
var port = 3000;

app.use ('/styles', express.static(__dirname + '/styles'));
app.use ('/scripts', express.static(__dirname + '/scripts'));

app.get('/', (request, response) => {
    response.sendFile('\index.html', {root: __dirname});
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log('server is listening on ${port}');
})