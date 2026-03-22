import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all booths
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [booths] = await db.execute('SELECT * FROM booths ORDER BY number ASC');
        res.json({ data: booths });
    } catch (error) {
        console.error('Get booths error:', error);
        res.status(500).json({ error: 'Failed to fetch booths' });
    }
});

// Get single booth
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const [booths] = await db.execute('SELECT * FROM booths WHERE id = ?', [req.params.id]);
        if (booths.length === 0) {
            return res.status(404).json({ error: 'Booth not found' });
        }
        res.json({ data: booths[0] });
    } catch (error) {
        console.error('Get booth error:', error);
        res.status(500).json({ error: 'Failed to fetch booth' });
    }
});

// Create booth
router.post('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { name, number, address, officerInCharge, contactNumber, location, totalVoters } = req.body;

        if (!name || !number) {
            return res.status(400).json({ error: 'Name and number are required' });
        }

        const [result] = await db.execute(
            'INSERT INTO booths (name, number, address, officer_in_charge, contact_number, location_lat, location_lng, total_voters) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                name,
                number,
                address || null,
                officerInCharge || null,
                contactNumber || null,
                location?.lat || 10.0104,
                location?.lng || 77.4768,
                totalVoters || 0
            ]
        );

        res.status(201).json({
            message: 'Booth created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Create booth error:', error);
        res.status(500).json({ error: 'Failed to create booth' });
    }
});

// Update booth
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const { name, number, address, officerInCharge, contactNumber, location, totalVoters } = req.body;

        await db.execute(
            'UPDATE booths SET name = ?, number = ?, address = ?, officer_in_charge = ?, contact_number = ?, location_lat = ?, location_lng = ?, total_voters = ? WHERE id = ?',
            [
                name,
                number,
                address,
                officerInCharge,
                contactNumber,
                location?.lat || 10.0104,
                location?.lng || 77.4768,
                totalVoters,
                req.params.id
            ]
        );

        res.json({ message: 'Booth updated successfully' });
    } catch (error) {
        console.error('Update booth error:', error);
        res.status(500).json({ error: 'Failed to update booth' });
    }
});

// Delete booth
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        await db.execute('DELETE FROM booths WHERE id = ?', [req.params.id]);
        res.json({ message: 'Booth deleted successfully' });
    } catch (error) {
        console.error('Delete booth error:', error);
        res.status(500).json({ error: 'Failed to delete booth' });
    }
});

export default router;
