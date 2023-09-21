import express from 'express'
import {createPost, getPost} from '../controllers/post.js'

const router = express.Router()

router.post('/', createPost)
router.get('/', getPost)

export default router;