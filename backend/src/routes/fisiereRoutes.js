//ruta de descarcare fisier

const express = require("express");
const router = express.Router();
const { cerereDisertatieController } = require("../controllers");
const checkAuth = require("../middlewares/auth");

router.get("/:cerereId/:tip", checkAuth, cerereDisertatieController.downloadFisier);

module.exports = router;