const express = require("express");
const router = express.Router();
const awsController = require("../controllers/awsController");

router.post("/aws/upload", awsController.uploadFile);
router.get("/aws/read/:key", awsController.readFile)
router.put("/aws/update/:key", awsController.updateFile)
router.delete("/aws/delete/:key", awsController.deleteFile);

module.exports = router;