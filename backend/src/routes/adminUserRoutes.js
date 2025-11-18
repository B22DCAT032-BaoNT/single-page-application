import express from 'express';
import {
    getAllUsers,
    createUserByAdmin,
    updateuserByAdmin,
    deleteUserByAdmin,
} from '../controllers/adminUserController.js';

import { verifyAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.use(verifyAdmin);

router.get('/', getAllUsers);
router.post('/', createUserByAdmin);
router.put('/:id', updateuserByAdmin);
router.delete('/:id', deleteUserByAdmin);

export default router;