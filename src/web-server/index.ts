import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('TES : hello world!')
})

let port: number = 3000 
app.listen(port, () => {
    console.log(`app listening on ${port}`)
})