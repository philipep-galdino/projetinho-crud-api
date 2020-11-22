import mongoose from 'mongoose'

const connection = () => {
    mongoose.connect('mongodb://localhost/my_db', {useUnifiedTopology: true, useNewUrlParser: true})
    mongoose.set('useCreateIndex', true)

    const db = mongoose.connection

    db.once('open', () => {
        console.log("Database conectada!")
    })

    db.on('error', (error) => {
        console.log(`Database desconectada, um erro ocorreu: ${error}`)
    })

    process.on('SIGINT', () => {
        db.close(() => {
            console.log('Aplicação fechando, desconectando database.')
            process.exit(0)
        })
    })
}

export default connection