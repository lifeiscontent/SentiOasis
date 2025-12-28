import express from 'express';
import { analyzeSentiment, generateKey } from '../controllers/sentimentController.js';
import { submitFeedback } from '../controllers/feedbackController.js';
import { authenticateApiKey } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint to generate keys
// In a production environment, this should be protected (e.g., behind user login or admin auth)
router.post('/auth/generate-key', generateKey);

// Protected endpoints
router.post('/sentiment', authenticateApiKey, analyzeSentiment);
router.post('/feedback', authenticateApiKey, submitFeedback);

export default router;
