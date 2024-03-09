const express = require("express")

const app = express()

const PORT = 10000 // Любой порт

const morgan = require('morgan') // Логер

const cors = require('cors') // Cors заголовки

const Routs = require("./Routs/routs")

app.set('view engine', 'ejs') // EJS

app.listen(PORT, () => console.log (`Server has been started on ${PORT} !!!`))

app.use(cors());

app.use(express.json()) // JSON

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(Routs)
