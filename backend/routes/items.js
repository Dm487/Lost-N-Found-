const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getItems,
    getUserItems,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/itemController');

router.get('/', getItems);
router.get('/my-items', auth, getUserItems);
router.post('/', auth, upload.single('photo'), createItem);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);

module.exports = router;
