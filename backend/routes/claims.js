const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createClaim,
    getMyClaimsAsClaimant,
    getClaimsForMyItems,
    updateClaimStatus
} = require('../controllers/claimController');

router.post('/', auth, createClaim);
router.get('/my-requests', auth, getMyClaimsAsClaimant);
router.get('/received', auth, getClaimsForMyItems);
router.put('/:id', auth, updateClaimStatus);

module.exports = router;
