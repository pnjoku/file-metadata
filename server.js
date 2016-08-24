'use strict'

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var log = require('npmlog');
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');


var fileSchema = new Schema({
  name: String,
  size: Number,
  date: String
});

var app = express();

var File = mongoose.model('File', fileSchema);
var mongouri = process.env.MONGOLAB_URI || "mongodb://localhost:27017/img-sal";
mongoose.Promise = global.Promise;
mongoose.connect(mongouri);

app.use(express.static(path.join(__dirname, 'templates')));
app.use(bodyParser.json());
app.use(multer({
  dest: path.join(__dirname, '/uploads/')
}).any());

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    var getFileExt = function(fileName) {
      var fileExt = fileName.split(".");
      if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
        return "";
      }
      return fileExt.pop();
    };
    cb(null, Date.now() + '.' + getFileExt(file.originalname));
  }
});

var multerUpload = multer({
  storage: storage
});
var uploadFile = multerUpload.single('userFile');

app.post('/upload', function(req, res) {
    uploadFile(req, res, function(err) {
      if (err) {
        log.error(err);
      }
      var fileDetails = {
        name: req.files[0].originalname,
        size: req.size,
        date: new Date().toLocaleString()
      };

      var file = new File(fileDetails);
      file.save(function(err, file) {
        if (err) {
          log.error(err);
          throw err;
        }
        log.info('Saved', file);
      });
      var filePath = "./uploads/" + req.files[0].filename; 
      fs.unlinkSync(filePath);
      res.send(fileDetails);
    });
  });
  
  
app.get('/', function(req, res){ 
    res.sendFile('./templates/index.html');
    });


app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  console.log("fileMetadata started");
});
