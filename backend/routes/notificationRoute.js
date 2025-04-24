const express = require("express");
const { getAllNotifications } = require("../controllers/notificationController");
const router = express.Router();


router.get("/get-all-notification", getAllNotifications);
router.get("/delete-notification/:id", getAllNotifications);


module.exports = router;
