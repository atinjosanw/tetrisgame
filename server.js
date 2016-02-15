'use strict';
let express = require('express');
let app = express();
let path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
let listener = app.listen(process.env.PORT || 8080, function() {
    console.log("Server is listening on port " + listener.address().port);
});
app.use(function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

