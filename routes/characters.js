import express from 'express'

import auth from './authenticate.js'
import Character from '../models/Character.js'
import CharacterController from '../controllers/CharacterController.js'

const router = express.Router()
const characterController = new CharacterController()

router.param('charname', function(request, response, next, charname) {
    Character.findOne({ charname: charname }).then(function(character) {
        if(!character) return response.status(404).json({ message: 'Não foi possível encontrar um personagem com este nome!'})

        request.character = character

        return next()
    }).catch(next)
})

router.get('/', auth.required, characterController.index)
router.get('/:charname', auth.optional, characterController.show)
router.post('/create-character', auth.required, characterController.create)
// router.post('/update-character', characterController.update)


export default router