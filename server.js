const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
const PORT = 6123

app.use(cors())
app.use(bodyParser.raw())

app.use('/stream', express.static(__dirname + '/stream'))

app.get('/stream', (req, res) => {
	const path = __dirname + '/stream/livestream.ogg'
	const stat = fs.statSync(path)

	res.writeHead(200, {
		'Content-Type': 'audio/ogg',
		'Content-Length': stat.size
	})

	const stream = fs.createReadStream(path)
	stream.pipe(res)
})

app.post('/', (req, res, next) => {
  fs.appendFile('stream/livestream.ogg', req.body, err => {
		if (err) res.sendStatus(400)
		else res.sendStatus(200)
  })
})

app.get('/quit', (req, res) => {
	fs.unlinkSync('stream/livestream.ogg', err => {
		if (err) {console.log(err); res.sendStatus(400);}
		else res.sendStatus(200)
	})
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`)
})
