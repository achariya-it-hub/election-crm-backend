import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get settings
router.get('/global', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [settings] = await db.execute('SELECT * FROM settings WHERE id = 1');

        if (settings.length === 0) {
            return res.status(404).json({ error: 'Settings not found' });
        }

        const setting = settings[0];
        const response = {
            supportLevels: setting.support_levels ? JSON.parse(setting.support_levels) : {},
            benefits: setting.benefits ? JSON.parse(setting.benefits) : [],
            themeColor: setting.theme_color,
            logo: setting.logo
        };

        res.json({ data: response });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update settings
router.put('/global', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { supportLevels, benefits, themeColor, logo } = req.body;

        await db.execute(
            'UPDATE settings SET support_levels = ?, benefits = ?, theme_color = ?, logo = ? WHERE id = 1',
            [
                JSON.stringify(supportLevels || {}),
                JSON.stringify(benefits || []),
                themeColor || '#4f46e5',
                logo || null
            ]
        );

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
