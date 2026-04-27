const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });


const extractDetails = (text) => {

    const emailRegex =
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

    const phoneRegex =
        /\b\d{10}\b/g;

    const lines = text.split("\n");

    let name = lines[0] || "Not Found";

    let email =
        text.match(emailRegex)?.[0] || "Not Found";

    let phone =
        text.match(phoneRegex)?.[0] || "Not Found";

    const qualificationKeywords = [
        "B.Tech",
        "M.Tech",
        "B.Sc",
        "M.Sc",
        "MBA",
        "BCA",
        "MCA"
    ];

    let qualification = "Not Found";

    qualificationKeywords.forEach(q => {
        if (text.includes(q)) {
            qualification = q;
        }
    });

    return {
        name,
        email,
        phone,
        qualification
    };
}


router.post("/upload-pdf", upload.single("pdf"), async (req, res) => {

    try {

        console.log("File received:", req.file);

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const filePath = req.file.path;

        console.log("File path:", filePath);

        const dataBuffer =
            fs.readFileSync(filePath);

        const pdfData =
            await pdfParse(dataBuffer);

        console.log("PDF text length:",
            pdfData.text.length
        );

        res.json({
            message: "PDF processed successfully"
        });

    } catch (error) {

        console.error("ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;