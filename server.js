'use strict'

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var log = require('npmlog');
var fs = require('fs');
var multer = require('multer');


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
//app.use(multer({dest:'./uploads/'}).single('singleInputFileName'));

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
  console.log(req.file);
    uploadFile(req, res, function(err) {
      if (err) {
        // An error occurred when uploading 
        log.error(err);
      }
      // Everything went fine 
      var fileDetails = {
        //name: req.file.originalname,
        size: req.headers['content-length'],
        date: new Date().toLocaleString(),
        //file: req.data.name
      };
      // save file to db
      var file = new File(fileDetails);
      file.save(function(err, file) {
        if (err) {
          log.error(err);
          throw err;
        }
        log.info('Saved', file);
      });
      //var filePath = "./uploads/" + req.file.filename; 
      //fs.unlinkSync(filePath);
      res.send(fileDetails);
    });
  });
  
  
app.get('/', function(req, res){ 
    res.sendFile('./templates/index.html')
    });


app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  console.log("fileMetadata started");
});
