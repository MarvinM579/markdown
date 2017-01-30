const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')
const pg = require('pg');

const app = express();
var client = new pg.Client({
    user:'postgres',
    database:'markdown',
    passwd:'rocket',
    host:'localhost'
});




app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Hello World!');

});

app.put('/documents/:file', function (req, res){
    let file = req.params.file;
    let filepath = './data/' + file;
    let contents = req.body.contents;
    fs.writeFile(filepath, contents, function(err) {
        if (err) {
            res.status(500);
            res.json({message: 'Nope.', error: err.message});
        } else {
            res.json({message: 'File saved: ' + file});
        }
    });
});

app.get('/documents/:file', function (req, res){
    let file = req.params.file;
    let filepath = './data/' + file;
    fs.readFile(filepath, function(err, buffer){
        if (err) {
            res.status(500).json({message: 'smh', error: err.message});
        } else {
            res.json({file: file, contents: buffer.toString()});
        }
    });
});

app.get('/documents/:file/display', function (req, res){
    let file = req.params.file;
    let filepath = './data/' + file;
    fs.readFile(filepath, function(err, buffer){
        if (err) {
            res.status(500).json({message: 'Bruh', error: err.message});
        } else {
            res.render('display.hbs', {
              file: file,
              contents: buffer.toString()
            });
        }
    });
});

app.get('/documents', function (req, res){
    fs.readdir('./data/', function(err, files){
        if (err){
            res.status(500).json({message: 'What even is this?', error: err.message});
        }
        res.send(files);
    });
});

app.delete('/documents/:file', function (req, res){
    let file = req.params.file;
    let filepath = './data/' + file;
    fs.unlink(filepath, function(err, files){
        if (err) {
            res.status(500).json({message: 'huh?', error: err.message});
        } else {
            res.json({message: 'NUKED!: ' + file});
        }
    });
});

app.listen(3000, function(){
    console.log('running the app');
});
