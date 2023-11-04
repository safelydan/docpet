import express from 'express'
import { getUser, updateUser, deleteUser } from '../controllers/users.js';
import { checkToken } from '../middleware/tokenVallidation.js'

const router = express.Router();

router.get('/get-user', getUser);
router.put('/update-user', checkToken, updateUser, deleteUser); // so faz o update user quando o token for valido

export default router

