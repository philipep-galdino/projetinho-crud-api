import User from '../models/User.js'
import passport from 'passport'
import LocalStrategy from 'passport-local'

export default class UserController {
    async index (request, response) {
        try{
            const users = await User.find()
            response.json(users)
        } catch (error) {
            response.status(500).json({ message: error.message })
        }
    }

    async show (request, response) {
        const { id } = request.params

        const user = await User.findById(id)

        return response.json(user)
    }

    async create (request, response) {
        const {
            username,
            email,
            password
        } = request.body

        const user = new User({
            username: username,
            email: email,
            password: password
        })
        
        try {
            await user.save().then(function() {
                return response.status(201).json({ user: user.authJSON() })
            })
        } catch (error) {
            response.status(400).json({ message: error.message })
        }
    }

    async authenticate (request, response, next) {
        if(!request.body.username) {
            return response.status(422).json({errors: {username:'Preencha o campo de usuário!'}})
        }

        if(!request.body.password) {
            return response.status(422).json({errors: {password:'Preencha sua senha!'}})
        }

        passport.use(new LocalStrategy(
            function(username, password, done) {
                User.findOne({ username: username}, function(error, user) {
                    if(error) return done(error)
                    if(!user) return done(null, false)
                    return done(null, user)
                })
            }
        ))

        passport.authenticate('local', { failureRedirect: '/login'}, function(error, user, info) {
            if(error) { return next(error) }

            if(user) {
                user.token = user.genJWT()
                return response.json({ user: user.authJSON() })
            } else {
                return response.status(422).json(info)
            }
        })(request, response, next)
    }
}