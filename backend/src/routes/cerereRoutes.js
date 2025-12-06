//Rute pentru cereri
const express = require("express");
const router = express.Router();
const { cerereDisertatieController } = require("../controllers");
const checkAuth = require("../middlewares/auth");
const upload = require("../config/upload");

router.post("/", checkAuth, cerereDisertatieController.createCerere);
router.get("/student", checkAuth, cerereDisertatieController.getCereriStudent);
router.get("/profesor", checkAuth, cerereDisertatieController.getCereriProfesor);
router.put("/:id/actiune-preliminara", checkAuth, cerereDisertatieController.actiunePreliminara);
router.post("/:id/upload-student", checkAuth, upload.single('fisier'), cerereDisertatieController.uploadStudent);
router.post("/:id/raspuns-profesor", checkAuth, upload.single('fisier'), cerereDisertatieController.raspunsProfesor);

module.exports = router;