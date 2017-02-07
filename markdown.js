const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')
const pg = require('pg');
const randomString = require('randomstring');
const token = randomString.generate(8);


const app = express();

function auth(req, res, next) {
    if (req.query.token === token) {
        next()
    } else {
        res.status(401);
        res.json({error: 'You are not logged in lol'});
    }
}



app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Hello World!');

});

app.post('/api/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username === 'marvin' && password === 'rocket') {
        res.json({username: username, token: token});
        console.log(token);
    } else {
        res.status(401);
        res.json({error: 'Wrong login'});
    }
});

app.put('/documents/:file', auth, function (req, res){
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

app.get('/documents/:file', auth, function (req, res){
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

app.get('/documents/:file/display', auth, function (req, res){
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

app.get('/documents', auth, function (req, res){
    fs.readdir('./data/', function(err, files){
        if (err){
            res.status(500).json({message: 'What even is this?', error: err.message});
        }
        res.send(files);
    });
});

app.delete('/documents/:file', auth, function (req, res){
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
