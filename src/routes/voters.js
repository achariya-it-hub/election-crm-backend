import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all voters
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [voters] = await db.execute('SELECT * FROM voters ORDER BY created_at DESC');
        res.json({ data: voters });
    } catch (error) {
        console.error('Get voters error:', error);
        res.status(500).json({ error: 'Failed to fetch voters' });
    }
});

// Get single voter
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [voters] = await db.execute('SELECT * FROM voters WHERE id = ?', [req.params.id]);
        if (voters.length === 0) {
            return res.status(404).json({ error: 'Voter not found' });
        }
        res.json({ data: voters[0] });
    } catch (error) {
        console.error('Get voter error:', error);
        res.status(500).json({ error: 'Failed to fetch voter' });
    }
});

// Create voter
router.post('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { booth_id, name, father_name, age, gender, address, phone, voter_id, support_level, familyBenefits, notes, photo_url } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const [result] = await db.execute(
            'INSERT INTO voters (booth_id, name, father_name, age, gender, address, phone, voter_id, support_level, family_benefits, notes, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                booth_id || null,
                name,
                father_name || null,
                age || null,
                gender || 'Male',
                address || null,
                phone || null,
                voter_id || null,
                support_level || 'Neutral',
                JSON.stringify(familyBenefits || []),
                notes || null,
                photo_url || null
            ]
        );

        res.status(201).json({
            message: 'Voter created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Create voter error:', error);
        res.status(500).json({ error: 'Failed to create voter' });
    }
});

// Update voter
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { booth_id, name, father_name, age, gender, address, phone, voter_id, support_level, familyBenefits, notes, photo_url } = req.body;

        await db.execute(
            'UPDATE voters SET booth_id = ?, name = ?, father_name = ?, age = ?, gender = ?, address = ?, phone = ?, voter_id = ?, support_level = ?, family_benefits = ?, notes = ?, photo_url = ? WHERE id = ?',
            [
                booth_id,
                name,
                father_name,
                age,
                gender,
                address,
                phone,
                voter_id,
                support_level,
                JSON.stringify(familyBenefits || []),
                notes,
                photo_url,
                req.params.id
            ]
        );

        res.json({ message: 'Voter updated successfully' });
    } catch (error) {
        console.error('Update voter error:', error);
        res.status(500).json({ error: 'Failed to update voter' });
    }
});

// Bulk update voters
router.put('/bulk/update', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { ids, data } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'IDs array is required' });
        }

        const placeholders = ids.map(() => '?').join(',');
        const updateFields = [];
        const values = [];

        if (data.support_level) {
            updateFields.push('support_level = ?');
            values.push(data.support_level);
        }
        if (data.booth_id !== undefined) {
            updateFields.push('booth_id = ?');
            values.push(data.booth_id);
        }
        if (data.notes) {
            updateFields.push('notes = ?');
            values.push(data.notes);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(...ids);
        await db.execute(`UPDATE voters SET ${updateFields.join(', ')} WHERE id IN (${placeholders})`, values);

        res.json({ message: `${ids.length} voters updated successfully` });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({ error: 'Failed to update voters' });
    }
});

// Delete voter
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        await db.execute('DELETE FROM voters WHERE id = ?', [req.params.id]);
        res.json({ message: 'Voter deleted successfully' });
    } catch (error) {
        console.error('Delete voter error:', error);
        res.status(500).json({ error: 'Failed to delete voter' });
    }
});

export default router;
