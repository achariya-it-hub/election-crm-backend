import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all volunteers
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [volunteers] = await db.execute('SELECT * FROM volunteers ORDER BY created_at DESC');
        res.json({ data: volunteers });
    } catch (error) {
        console.error('Get volunteers error:', error);
        res.status(500).json({ error: 'Failed to fetch volunteers' });
    }
});

// Get single volunteer
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [volunteers] = await db.execute('SELECT * FROM volunteers WHERE id = ?', [req.params.id]);
        if (volunteers.length === 0) {
            return res.status(404).json({ error: 'Volunteer not found' });
        }
        res.json({ data: volunteers[0] });
    } catch (error) {
        console.error('Get volunteer error:', error);
        res.status(500).json({ error: 'Failed to fetch volunteer' });
    }
});

// Create volunteer
router.post('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { booth_id, name, phone, role_type, assigned_area, status } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const [result] = await db.execute(
            'INSERT INTO volunteers (booth_id, name, phone, role_type, assigned_area, status) VALUES (?, ?, ?, ?, ?, ?)',
            [booth_id || null, name, phone || null, role_type || null, assigned_area || null, status || 'Active']
        );

        res.status(201).json({
            message: 'Volunteer created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Create volunteer error:', error);
        res.status(500).json({ error: 'Failed to create volunteer' });
    }
});

// Update volunteer
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { booth_id, name, phone, role_type, assigned_area, status } = req.body;

        await db.execute(
            'UPDATE volunteers SET booth_id = ?, name = ?, phone = ?, role_type = ?, assigned_area = ?, status = ? WHERE id = ?',
            [booth_id, name, phone, role_type, assigned_area, status, req.params.id]
        );

        res.json({ message: 'Volunteer updated successfully' });
    } catch (error) {
        console.error('Update volunteer error:', error);
        res.status(500).json({ error: 'Failed to update volunteer' });
    }
});

// Delete volunteer
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        await db.execute('DELETE FROM volunteers WHERE id = ?', [req.params.id]);
        res.json({ message: 'Volunteer deleted successfully' });
    } catch (error) {
        console.error('Delete volunteer error:', error);
        res.status(500).json({ error: 'Failed to delete volunteer' });
    }
});

export default router;
