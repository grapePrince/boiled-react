var express = require('express');
var path = require('path');
var app = express();

app.set('views', __dirname + '/dist');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use("/css", express.static(path.join(__dirname, 'dist/css')));
app.use("/js", express.static(path.join(__dirname, 'dist/js')));

app.get('/',function(req,res){
    res.render('index.html')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});