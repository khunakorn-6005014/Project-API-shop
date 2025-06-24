import express from 'express';
import {userProfile,updateUser,deleteUser,getAllUsers,upgradeToAdmin} from '../controllers/userController.js';


const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', userProfile);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
// Admin confirmation required
router.post('/:id/upgrade', upgradeToAdmin);

export default router;