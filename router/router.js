const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");


// Upload setup
const upload = multer({
    dest: "uploads/"
});


router.post(
    "/upload-pdf",
    upload.single("resume"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded"
                });
            }

            // Read PDF
            const dataBuffer =
                fs.readFileSync(req.file.path);

            const pdfData =
                await pdfParse(dataBuffer);

            const text = pdfData.text;



            // ============================
            // Extract Name (First Line)
            // ============================

            let firstName = null;
            let lastName = null;

            const lines =
                text.split("\n")
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

            if (lines.length > 0) {

                const nameParts =
                    lines[0].split(" ");

                firstName =
                    nameParts[0] || null;

                lastName =
                    nameParts.length > 1
                        ? nameParts[nameParts.length - 1]
                        : null;

            }



            // ============================
            // Extract Email
            // ============================

            const emailMatch =
                text.match(
                    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
                );

            const email =
                emailMatch
                    ? emailMatch[0]
                    : null;



            // ============================
            // Extract Mobile
            // ============================

            const mobileMatch =
                text.match(
                    /(\+91[\-\s]?)?[6-9]\d{9}/
                );

            const mobile =
                mobileMatch
                    ? mobileMatch[0]
                    : null;



            // ============================
            // Extract Skills Section
            // ============================

            let skills = null;

            const skillsMatch =
                text.match(
                    /skills([\s\S]*?)(education|experience|projects|certifications|$)/i
                );

            if (skillsMatch) {

                skills =
                    skillsMatch[1]
                        .replace(/\n/g, " ")
                        .trim();

            }



            // ============================
            // Extract Experience Section
            // ============================

            let experience = null;

            const experienceMatch =
                text.match(
                    /experience([\s\S]*?)(education|skills|projects|$)/i
                );

            if (experienceMatch) {

                experience =
                    experienceMatch[1]
                        .replace(/\n/g, " ")
                        .trim();

            }



            // ============================
            // Final Response
            // ============================

            res.status(200).json({

                success: true,

                message:
                    "Resume processed successfully",

                data: {

                    firstName: firstName,

                    lastName: lastName,

                    email: email,

                    mobile: mobile,

                    skills: skills,

                    experience: experience

                }

            });

        }

        catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Error reading PDF",

                error: error.message

            });

        }

    }
);

module.exports = router;