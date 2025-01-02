const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication")
const check = require("../middlewares/auth");

router.get("/test-publication", PublicationController.testPublication);
router.post("/save", check.auth, PublicationController.save);

module.exports = router;


