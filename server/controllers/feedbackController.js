import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  const { originalText, predictedSentiment, userCorrection, comments } = req.body;

  if (!originalText || !predictedSentiment || !userCorrection) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const feedback = new Feedback({
      apiKey: req.apiKey._id,
      originalText,
      predictedSentiment,
      userCorrection,
      comments
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', id: feedback._id });
  } catch (error) {
    console.error('Feedback Submission Error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
