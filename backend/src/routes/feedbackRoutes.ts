import express from 'express';
import Feedback from '../models/Feedback';

const router = express.Router();

// 1. අලුත් Review එකක් දැමීම (CREATE)
router.post('/', async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();
        res.status(201).json({ message: "Thank you for your feedback!", feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: "Submission Failed", error });
    }
});

// 2. Reviews ඔක්කොම ගැනීම (READ) - අලුත් ඒවා උඩින් පෙනෙන්න (sort)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Fetching Failed", error });
    }
});

export default router;