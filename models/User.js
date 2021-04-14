import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import uniqueValidator from 'mongoose-unique-validator'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: 'Você não pode registrar sem um nome.',
        unique: true,
    },

    email: {
        type: String,
        required: 'O campo de e-mail deve ser preenchido.',
        unique: true
    },

    password: {
        type: String,
        required: 'Campo de senha não pode estar vazio.',
        minlength: [8, 'A senha deve conter ao menos 8 caracteres']
    },

    characters: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Character'
    }],

    createdDate: {
        type: Date,
        default: Date.now
    },

    hash:String,
    passToken: String
}, {timestamps: true})

userSchema.path('email').validate((val) => {
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,13}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return mailRegex.test(val)
}, 'Por favor, utilize um e-mail válido.')

userSchema.plugin(uniqueValidator, {message: 'já está em uso.'})

userSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.passToken, 1000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

userSchema.methods.setPassword = function(password) {

    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

userSchema.methods.genJWT = function() {
    const day = new Date()
    const exp = new Date(day)
    exp.setDate(day.getDate() + 30)

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, 'secretinho')
}

userSchema.methods.authJSON = function() {
    return {
        username: this.username,
        email: this.email,
        token: this.genJWT(),
    }
}

userSchema.methods.profileJSONfy = function(user) {
    return {
        username: this.username,
        email: this.email
    }
}

userSchema.methods.newCharacter = function(id) {
    if(this.characters.indexOf(id) === -1) {
        this.characters.push(id)
    }

    return this.save()
}

const User = mongoose.model('User', userSchema)

export default User