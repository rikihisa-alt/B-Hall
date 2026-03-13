import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'B-Hall API' })
})

app.listen(PORT, () => {
  console.log(`B-Hall server running on port ${PORT}`)
})
