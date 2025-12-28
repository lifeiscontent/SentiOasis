import { hashKey } from '../middleware/auth.js';
import ApiKey from '../models/ApiKey.js';
import { v4 as uuidv4 } from 'uuid';

const TRANSFORMERS_CONFIG = {
  API_BASE_URL: 'https://huggingface.co/api/models',
  MAX_TEXT_LENGTH: 5000 // Copied from frontend config/index.ts (assumed value)
};

export const generateKey = async (req, res) => {
  try {
    const { name } = req.body;
    const key = uuidv4();
    const hashed = hashKey(key);

    const newKey = new ApiKey({
      key: hashed,
      name: name || 'Generated Key'
    });

    await newKey.save();

    // Return the raw key ONLY ONCE
    res.status(201).json({ 
      apiKey: key,
      name: newKey.name,
      message: 'Store this key safely. It will not be shown again.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const analyzeSentiment = async (req, res) => {
  const { text, modelId } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (text.length > TRANSFORMERS_CONFIG.MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: 'Text too long' });
  }

  const hfModelId = modelId || 'cardiffnlp/twitter-roberta-base-sentiment-latest'; // Default
  const hfToken = process.env.HUGGINGFACE_API_KEY;

  if (!hfToken) {
    console.warn('HUGGINGFACE_API_KEY not set on server');
  }

  try {
    const response = await fetch(`${TRANSFORMERS_CONFIG.API_BASE_URL}/${hfModelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hfToken && { 'Authorization': `Bearer ${hfToken}` })
      },
      body: JSON.stringify({
        inputs: text,
        parameters: { return_all_scores: true }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.error || 'Upstream API error' 
      });
    }

    const result = await response.json();
    res.json(result);

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
};
