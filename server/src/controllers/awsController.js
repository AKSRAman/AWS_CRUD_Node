const aws = require("aws-sdk");
const dotnev = require("dotenv");
const fs = require("fs");

dotnev.config({ path: "../.env" });
const myDbString = process.env.DATABASE;
console.log(myDbString,89)

aws.config.update({
  accessKeyId: process.env.ACCESSIDKEY,
  secretAccessKey: process.env.SECRETACESSKEY,
  region: process.env.REGION
});

let s3Service = new aws.S3({ apiVersion: "2006-03-01" });

let uploadFile = async (req, res) => {
  try {
    let files = req.files[0];
    if (!files && !files.length) {
      res.status(400).send({ status: false, msg: "No file to write" });
    }
    return new Promise(function (resolve, reject) {
      const uploadParams = {
        Bucket: "aksraman",
        Key: new Date().getTime() + "_" + files.originalname,
        Body: files.buffer,
      };
      s3Service.upload(uploadParams, function (err, data) {
        if (err) {
          return reject({ error: err });
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        return resolve(data.Location);
      });
    }).then((data) => {
      res.status(201).send({ status: true, data: data });
    });
  } catch (err) {
    console.log("error is: ", e);
    res.status(500).send({ status: false, msg: err.msg });
  }
};

const readFile = async (req, res) => {
  try {
    let keyname = req.params.key;
    const params = {
      Bucket: "aksraman",
      Key: keyname,
    };
    let s3file = await s3Service.getObject(params).promise();
    console.log(s3file, "s3file");
    res.send(s3file.Body);
  } catch (e) {
    console.log("error is: ", e);
    res
      .status(500)
      .send({ status: false, msg: "Error in getting file from s3" });
  }
};

const updateFile = async (req, res) => {
  try {
    let files = req.files[0];
    if (!files && !files.length) {
      res.status(400).send({ status: false, msg: "No file to write" });
    }
    let keyname = req.params.key;
    return new Promise(function (resolve, reject) {
      const uploadParams = {
        Bucket: "aksraman",
        Key: keyname,
        Body: files.buffer,
      };
      s3Service.putObject(uploadParams, function (err, data) {
        if (err) {
          return reject({ error: err });
        }
        console.log(`File updated successfully. ${data.Location}`);
        return resolve(data.Location);
      });
    }).then((data) => {
      res.status(201).send({ status: true, data: data });
    });
  } catch (err) {
    console.log("error is: ", e);
    res.status(500).send({ status: false, msg: err.msg });
  }
};

const deleteFile = async (req, res) => {
  try {
    let keyname = req.params.key;
    const params = {
      Bucket: "aksraman",
      Key: keyname,
    };
    let s3file = await s3Service.deleteObject(params).promise();
    res.status(200).send(s3file.Body);
  } catch (e) {
    console.log("error is: ", e);
    res
      .status(500)
      .send({ status: false, msg: "Error in getting file from s3" });
  }
};

module.exports = { uploadFile, readFile, updateFile, deleteFile };
