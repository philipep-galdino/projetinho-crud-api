import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'


const characterSchema = new mongoose.Schema({
    charname: {
        type: String,
        required: 'Você não pode registrar um personagem sem um nome.',
        unique: true,
    },

    level: {
        type: Number,
    },

    xp: {
        type: Number,
    }, 

    race: {
        type: String,
        required: 'Você não pode registrar um personagem sem raça.'
    },

    charfunction: {
        type: String,
        required: 'Você não pode registrar um personagem sem função alguma.'
    },

    charclass: {
        type: String,
        required: 'Você não pode registrar um personagem sem classe alguma.'
    },

    background: {
        type: String,
        required: 'Você não pode registrar um personagem sem uma história.',
        unique: true,
    },

    appearence: {
        type: String,
        required: 'Você não pode registrar um personagem sem uma aparência.'
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

    createdDate: {
        type: Date,
        default: Date.now
    },

    inventory: [{ type: String }]
})

characterSchema.plugin(uniqueValidator, {message: 'já está em uso.'})

characterSchema.methods.JSONfy = function(user) {
    return {
        charname: this.charname,
        level: this.level,
        xp: this.xp,
        race: this.race,
        charclass: this.charclass,
        charfunction: this.charfunction,
        background: this.background,
        appearence: this.appearence,
        owner: this.owner.profileJSONfy(user)
    }
}


const Character = mongoose.model('Character', characterSchema)

export default Character