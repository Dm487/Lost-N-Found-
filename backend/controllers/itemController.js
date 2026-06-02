const pool = require('../db');

// Get all items (public)
const getItems = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT i.*, u.full_name, u.email 
             FROM items i 
             JOIN users u ON i.user_id = u.id 
             ORDER BY i.created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get logged-in user's items
const getUserItems = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Create new item (with photo)
const createItem = async (req, res) => {
    try {
        const { type, title, description, location, date_reported } = req.body;
        const user_id = req.user.id;
        const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            `INSERT INTO items (user_id, type, title, description, location, date_reported, photo_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [user_id, type, title, description, location, date_reported, photo_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Update item
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, status } = req.body;

        // Check if item exists and belongs to user
        const item = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
        
        if (item.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (item.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own items' });
        }

        const result = await pool.query(
            `UPDATE items 
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 location = COALESCE($3, location),
                 status = COALESCE($4, status),
                 updated_at = NOW()
             WHERE id = $5
             RETURNING *`,
            [title, description, location, status, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if item exists and belongs to user
        const item = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
        
        if (item.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (item.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own items' });
        }

        await pool.query('DELETE FROM items WHERE id = $1', [id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getItems,
    getUserItems,
    createItem,
    updateItem,
    deleteItem
};
