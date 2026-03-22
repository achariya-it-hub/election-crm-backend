import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, requireRole('Admin'), async (req, res) => {
    try {
        const db = req.app.get('db');
        const [users] = await db.execute(
            'SELECT id, username, name, email, role, booth_id, last_active, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ data: users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get single user
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [users] = await db.execute(
            'SELECT id, username, name, email, role, booth_id, last_active, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ data: users[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create user (Admin only)
router.post('/', authenticateToken, requireRole('Admin'), async (req, res) => {
    try {
        const db = req.app.get('db');
        const { username, password, name, email, role, booth_id } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({ error: 'Username, password, and name are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO users (username, password, name, email, role, booth_id) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, name, email || null, role || 'Booth Captain', booth_id || null]
        );

        res.status(201).json({
            message: 'User created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Create user error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
    try {
        const db = req.app.get('db');
        const { name, email, role, booth_id } = req.body;

        await db.execute(
            'UPDATE users SET name = ?, email = ?, role = ?, booth_id = ? WHERE id = ?',
            [name, email, role, booth_id, req.params.id]
        );

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
    try {
        const db = req.app.get('db');

        // Prevent deleting self
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
