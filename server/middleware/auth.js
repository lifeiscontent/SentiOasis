import crypto from 'crypto';
import ApiKey from '../models/ApiKey.js';

export const hashKey = (key) => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

export const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.header('x-api-key') || req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: API Key missing' });
  }

  try {
    const hashed = hashKey(apiKey);
    const keyRecord = await ApiKey.findOne({ key: hashed, isActive: true });

    if (!keyRecord) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

    // Update last used
    keyRecord.lastUsed = new Date();
    await keyRecord.save();

    req.apiKey = keyRecord;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
