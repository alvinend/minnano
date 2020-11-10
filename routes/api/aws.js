const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
AWS.config.update({region: 'ap-northeast-1'})
const enterpriseName = process.env.ENTERPRISE_NAME
const s3 = new AWS.S3()
var fs = require('fs');

// @route   GET api/aws/test
// @desc    Tests post route
// @access  Admin Only
router.get('/test', (req, res) => res.json({ msg: 'AWS Works' }));

// @route   POST api/aws/image
// @desc    Tests post route
// @access  Admin Only
router.post('/image', async (req, res) => {
  try {
    const myFile = req.file
    const ext = myFile.originalname.split('.')[1]
    const s3Key = `${enterpriseName}/images/${uuidv4()}.${ext}`

    s3.putObject({ Bucket: 'minnanoonline', Body: myFile.buffer ,Key: s3Key }, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({
          url: `https://minnanoonline.s3-ap-northeast-1.amazonaws.com/${s3Key}`
        })
      }
    })
  } catch (error) {
    res.status(400).json({ error })
  }
})

module.exports = router;
