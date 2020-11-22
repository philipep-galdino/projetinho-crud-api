import express from 'express'

import auth from './authenticate.js'
import UserController from '../controllers/UserController.js'

const router = express.Router()
const userController = new UserController()

router.get('/', auth.required, userController.index)
router.post('/create-user', userController.create)
router.post('/login', userController.authenticate)
router.get('/:id', auth.required, userController.show)


export default router