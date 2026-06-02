const pool = require('../db');

// Create a claim request
const createClaim = async (req, res) => {
    try {
        const { item_id, proof_message } = req.body;
        const claimant_id = req.user.id;

        // Get item details
        const item = await pool.query('SELECT * FROM items WHERE id = $1', [item_id]);
        
        if (item.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (item.rows[0].user_id === claimant_id) {
            return res.status(400).json({ error: 'You cannot claim your own item' });
        }

        if (item.rows[0].status !== 'open') {
            return res.status(400).json({ error: 'This item is already claimed or returned' });
        }

        // Check if claim already exists
        const existingClaim = await pool.query(
            'SELECT * FROM claims WHERE item_id = $1 AND claimant_id = $2',
            [item_id, claimant_id]
        );

        if (existingClaim.rows.length > 0) {
            return res.status(400).json({ error: 'You already requested this item' });
        }

        // Create claim
        const result = await pool.query(
            `INSERT INTO claims (item_id, claimant_id, owner_id, proof_message)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [item_id, claimant_id, item.rows[0].user_id, proof_message]
        );

        // Create notification for item owner
        await pool.query(
            `INSERT INTO notifications (user_id, message, type)
             VALUES ($1, $2, $3)`,
            [item.rows[0].user_id, `Someone requested to claim your item: ${item.rows[0].title}`, 'claim_request']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get claims I have made
const getMyClaimsAsClaimant = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.*, i.title, i.type, i.location, i.photo_url,
                    u.full_name as owner_name
             FROM claims c
             JOIN items i ON c.item_id = i.id
             JOIN users u ON c.owner_id = u.id
             WHERE c.claimant_id = $1
             ORDER BY c.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get claims for my items (as owner)
const getClaimsForMyItems = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.*, i.title, i.type, i.location, i.photo_url,
                    u.full_name as claimant_name, u.email as claimant_email
             FROM claims c
             JOIN items i ON c.item_id = i.id
             JOIN users u ON c.claimant_id = u.id
             WHERE c.owner_id = $1
             ORDER BY c.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Update claim status (approve/deny)
const updateClaimStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_message } = req.body;

        // Get claim details
        const claim = await pool.query('SELECT * FROM claims WHERE id = $1', [id]);
        
        if (claim.rows.length === 0) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        if (claim.rows[0].owner_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only update claims for your items' });
        }

        // Update claim
        const result = await pool.query(
            `UPDATE claims 
             SET status = $1, admin_message = $2, responded_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [status, admin_message, id]
        );

        // If approved, update item status
        if (status === 'approved') {
            await pool.query(
                'UPDATE items SET status = $1, updated_at = NOW() WHERE id = $2',
                ['claimed', claim.rows[0].item_id]
            );
            
            // Notify claimant
            await pool.query(
                `INSERT INTO notifications (user_id, message, type)
                 VALUES ($1, $2, $3)`,
                [claim.rows[0].claimant_id, `Your claim for an item was approved!`, 'claim_approved']
            );
        } else if (status === 'denied') {
            // Notify claimant
            await pool.query(
                `INSERT INTO notifications (user_id, message, type)
                 VALUES ($1, $2, $3)`,
                [claim.rows[0].claimant_id, `Your claim was denied: ${admin_message || 'No reason provided'}`, 'claim_denied']
            );
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createClaim,
    getMyClaimsAsClaimant,
    getClaimsForMyItems,
    updateClaimStatus
};
