import express from 'express'
import bodyParser from 'body-parser'

import usersRoutes from './routes/users.js'
import characterRoutes from './routes/characters.js'
import db from './database.js'


const app = express()
db()

app.use(bodyParser.json())

app.use('/users', usersRoutes)
app.use('/characters', characterRoutes)

app.get('/', (request, response) => response.send("Hey there, it's working!"))

app.listen(3333, () => console.log(`Servidor rodando pela porta: 3333`))  // http://localhost:3333

