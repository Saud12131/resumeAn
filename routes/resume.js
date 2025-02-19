import express from "express";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Forbidden" });
        req.user = user;
        next();
    });
}

// Resume Processing Route
router.post("/enrich", authenticateToken, async (req, res) => {
    const { raw_text } = req.body;
    if (!raw_text) return res.status(400).json({ error: "Missing raw_text" });

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        Extract structured resume data from the following text:
        """${raw_text}"""
        Return JSON with keys: name, email, education (degree, institution, year), experience (job_title, company), skills, summary.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const extractedData = JSON.parse(response.text());

        res.status(200).json(extractedData);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error processing resume" });
    }
});

export default router;
