const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, '../config/gcpkey.json')
const { Storage } = Cloud
const gc = new Storage({
  keyFilename: serviceKey,
  projectId: 'southern-ivy-283011',
})

const bucket = gc.bucket('minanno')

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

module.exports = (file) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const blob = bucket.file(originalname.replace(/ /g, "_"))
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    resolve(publicUrl)
  })
  .on('error', err => {
    reject(err)
  })
  .end(buffer)
})
