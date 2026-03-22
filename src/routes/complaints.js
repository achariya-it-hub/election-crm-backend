import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all complaints
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [complaints] = await db.execute('SELECT * FROM complaints ORDER BY created_at DESC');
        res.json({ data: complaints });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
});

// Get single complaint
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [complaints] = await db.execute('SELECT * FROM complaints WHERE id = ?', [req.params.id]);
        if (complaints.length === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json({ data: complaints[0] });
    } catch (error) {
        console.error('Get complaint error:', error);
        res.status(500).json({ error: 'Failed to fetch complaint' });
    }
});

// Create complaint
router.post('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { booth_id, voter_id, title, description, priority, assigned_to } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [result] = await db.execute(
            'INSERT INTO complaints (booth_id, voter_id, title, description, priority, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [booth_id || null, voter_id || null, title, description || null, priority || 'Medium', req.user.id, assigned_to || null]
        );

        res.status(201).json({
            message: 'Complaint created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ error: 'Failed to create complaint' });
    }
});

// Update complaint
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { booth_id, voter_id, title, description, status, priority, assigned_to } = req.body;

        await db.execute(
            'UPDATE complaints SET booth_id = ?, voter_id = ?, title = ?, description = ?, status = ?, priority = ?, assigned_to = ? WHERE id = ?',
            [booth_id, voter_id, title, description, status, priority, assigned_to, req.params.id]
        );

        res.json({ message: 'Complaint updated successfully' });
    } catch (error) {
        console.error('Update complaint error:', error);
        res.status(500).json({ error: 'Failed to update complaint' });
    }
});

// Delete complaint
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        await db.execute('DELETE FROM complaints WHERE id = ?', [req.params.id]);
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('Delete complaint error:', error);
        res.status(500).json({ error: 'Failed to delete complaint' });
    }
});

export default router;
