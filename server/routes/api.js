import express from 'express';
import { analyzeSentiment, generateKey } from '../controllers/sentimentController.js';
import { authenticateApiKey } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint to generate keys (in a real app this might be protected by admin auth)
router.post('/auth/generate-key', generateKey);

// Protected endpoints
router.post('/sentiment', authenticateApiKey, analyzeSentiment);
router.post('/feedback', authenticateApiKey, (req, res) => {
    // Placeholder for feedback endpoint
    res.json({ message: 'Feedback received' });
});

export default router;
