import { Router } from 'express'
import AWS from 'aws-sdk'
import * as uuid from 'uuid'

// AWS Setting
AWS.config.update({ region: 'ap-northeast-1' })
const enterpriseName = process.env.ENTERPRISE_NAME
const s3 = new AWS.S3()
const router = Router()

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
    const s3Key = `${enterpriseName}/images/${uuid.v4()}.${ext}`
    const bucketName = process.env.BUCKET_NAME!

    s3.putObject(
      { Bucket: bucketName, Body: myFile.buffer, Key: s3Key },
      (err, data) => {
        if (err) {
          console.log("Error", err);
        } else {
          res.status(200).json({
            url: `https://${bucketName}.s3-ap-northeast-1.amazonaws.com/${s3Key}`
          })
        }
      }
    )
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

export const awsRouter = router
