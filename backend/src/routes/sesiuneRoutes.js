//Rute pentru sesiunea utilizatorului

const express = require("express");
const router = express.Router();
const { sesiuneInscriereController } = require("../controllers");
const checkAuth = require("../middlewares/auth");

router.post("/", checkAuth, sesiuneInscriereController.createSesiune);
router.get("/", checkAuth, sesiuneInscriereController.getAllActive);
router.get("/personale", checkAuth, sesiuneInscriereController.getPersonale);
router.put("/:id", checkAuth, sesiuneInscriereController.updateSesiune);
router.delete("/:id", checkAuth, sesiuneInscriereController.deleteSesiune);

module.exports = router;