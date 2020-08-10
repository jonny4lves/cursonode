const express = require('express')
const app = express()
const clientes = require('./routes/api/clientes')
const port = 3000

app.use('/api/clientes',clientes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})