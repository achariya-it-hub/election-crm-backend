import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all campaigns
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [campaigns] = await db.execute('SELECT * FROM campaigns ORDER BY event_date DESC');
        res.json({ data: campaigns });
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// Get single campaign
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [campaigns] = await db.execute('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
        if (campaigns.length === 0) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        res.json({ data: campaigns[0] });
    } catch (error) {
        console.error('Get campaign error:', error);
        res.status(500).json({ error: 'Failed to fetch campaign' });
    }
});

// Create campaign
router.post('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { title, description, event_date, location, booth_id, status } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [result] = await db.execute(
            'INSERT INTO campaigns (title, description, event_date, location, booth_id, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description || null, event_date || null, location || null, booth_id || null, status || 'Planning', req.user.id]
        );

        res.status(201).json({
            message: 'Campaign created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

// Update campaign
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { title, description, event_date, location, booth_id, status } = req.body;

        await db.execute(
            'UPDATE campaigns SET title = ?, description = ?, event_date = ?, location = ?, booth_id = ?, status = ? WHERE id = ?',
            [title, description, event_date, location, booth_id, status, req.params.id]
        );

        res.json({ message: 'Campaign updated successfully' });
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({ error: 'Failed to update campaign' });
    }
});

// Delete campaign
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        await db.execute('DELETE FROM campaigns WHERE id = ?', [req.params.id]);
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
});

export default router;
