import Character from '../models/Character.js'
import User from '../models/User.js'


export default class CharacterController {
    async index (request, response) {
        try {
            console.log(request.body)
            const characters = await Character.find()
            response.json(characters)
        } catch (error) {
            response.status(500).json({ message: error.message })
        }
    }

    async show (request, response) {
        Promise.all([
            request.payload ? User.findById(request.payload.id) : null,
            request.character.populate('owner').execPopulate()
        ]).then(function(results) {
            const user = results[0]
            
            return response.json({ character: request.character.JSONfy(user)})
        })
    }

    async create (request, response, next) {
        User.findById(request.payload.id).then(function(user) {
            if (!user) return response.sendStatus(401)

            const {
                charname,
                race,
                charfunction,
                charclass,
                background,
                appearence,
            } = request.body
    
            const character = new Character({
                charname: charname,
                race: race,
                charfunction: charfunction,
                charclass: charclass,
                background: background,
                appearence: appearence,
                level: 1,
                xp: 0,
                owner: user
            })

            
            return character.save().then(function() {

                user.newCharacter(character)

                return response.json({ character: character.JSONfy(user) })
            })

            

        }).catch(next)

        
    }
}