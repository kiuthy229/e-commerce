const express = require("express");
const app = express();
const cors = require("cors");
const multer  = require('multer')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOrigin = 'http://localhost:3000';
app.use(cors({
  origin:[corsOrigin],
  methods:['GET','POST'],
  credentials: true 
}));

const imageUploadPath = 'C:/Users/ASUS/Desktop/e-commerce/public/upload-images';

// setup multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, imageUploadPath)
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const imageUpload = multer({ storage: storage } )

// route for file upload
app.post("/upload",imageUpload.array("myFile"), (req, res) => {
    console.log('POST request received to /image-upload.');
    console.log('Axios POST body: ', req.body);
    res.send('POST request recieved on server to /image-upload.');
});

app.listen(3001, () => console.log("Listening on port 3001"));