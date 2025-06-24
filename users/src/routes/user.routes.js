import express from 'express';
import {userProfile,updateUser,deleteUser,upgradeToAdmin,getAllusers} from '../controllers/userController.js';


const router = express.Router();

router.get('/', getAllusers);
router.get('/:id', userProfile);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
// Admin confirmation required
router.post('/:id/upgrade', upgradeToAdmin);

export default router;