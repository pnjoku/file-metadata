'use strict'

let express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    log = require('npmlog'),
    fs = require('fs'),
    multer = require('multer'),
    bodyParser = require('body-parser')


let fileSchema = new Schema({
  name: String,
  size: Number,
  date: String
})

let app = express()

let File = mongoose.model('File', fileSchema)
let mongouri = process.env.FILE_UPLOAD_MONGOLAB_URI || "mongodb://localhost:27017/metadata"
mongoose.Promise = global.Promise
mongoose.connect(mongouri)

app.use(express.static(path.join(__dirname, 'templates')))
app.use(bodyParser.json())
app.use(multer({
  dest: path.join(__dirname, '/uploads/')
}).any())

let storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/') },
  filename: (req, file, cb) => {
    let getFileExt = (fileName) => {
      let fileExt = fileName.split(".")
      if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
        return ""
      }
      return fileExt.pop()
    }
    cb(null, Date.now() + '.' + getFileExt(file.originalname))
  }
})

let multerUpload = multer({
  storage: storage
});
let uploadFile = multerUpload.single('userFile')

app.post('/upload', (req, res) => {
  debugger;
    uploadFile(req, res, (err) => {
    if (err){
     log.error(err)
    }
      let fileDetails = {
        name: req.files[0].originalname,
        size: req.files[0].size,
        date: new Date().toLocaleString()
      }

      let file = new File(fileDetails)
      file.save((err, file) => {
        if (err) {
          log.error(err)
          throw err
        }
        log.info('Saved', file)
      })
      let filePath = "./uploads/" + req.files[0].filename
      fs.unlinkSync(filePath)
      res.send(fileDetails)
    })
  })


app.get('/',(req, res) => res.sendFile('./templates/index.html'))


app.listen(process.env.FILE_UPLOAD_SERVER_PORT || 8080, process.env.FILE_UPLOAD_SERVER_IP || "0.0.0.0", () => console.log("fileMetadata started"))
