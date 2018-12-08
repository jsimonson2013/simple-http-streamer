# Simple HTTP Streamer

Streaming live media over the web can be very complex, but I want to offer an alternative. This library aims to provide simple getting-started functions to help you create livestreaming applications quickly without having to setup STUN/TURN servers and dedicated streaming resources.

The [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API) and [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) make this library possible. My hope is to provide some abstraction from those APIs and expose functions that can be used intuitively for common streaming needs.

You can download the library and include it via relative path or use my hosted file at https://jacobsimonson.me/code/simple-http-streamer.js.

### Demo
![Simple HTTP Streamer](https://i.makeagif.com/media/12-08-2018/cxcu1F.gif)

### Example
broadcaster:
```html
<html>
<head>
<meta charset="UTF-8">
<script text="text/javascript" src="https://jacobsimonson.me/code/simple-http-streamer.js"></script>
</head>
<body>
	<button id="record" onclick="startAudioCapture('http://localhost:6123/')">Record</button>
	<button id="quit" onclick="stopAudioCapture('http://localhost:6123/quit')">Quit</button>
</body>
</html>
```

listener:
```html
<html>
<head>
<meta charset="UTF-8">
<script text="text/javascript" src="https://jacobsimonson.me/code/simple-http-streamer.js"></script>
</head>
<body>
  <audio id="player" controls></audio><br>
  <button onclick="playAudioStream(document.getElementById('player'), 'http://localhost:6123/stream/')">Listen!</button>
</body>
</html>
```

sample node api:
```javascript
app.use('/stream', express.static(__dirname + '/stream'))

app.get('/stream', (req, res) => {
	const path = __dirname + '/stream/livestream.ogg'
	const stat = fs.statSync(path)

	res.writeHead(200, {
		'Content-Type': 'audio/ogg',
		'Content-Length': stat.size,
		'Cache-Control': 'public, max-age=1',
		'Expires': new Date(Date.now() + 1).toUTCString()
	})

	const stream = fs.createReadStream(path)
	stream.pipe(res)
})

app.post('/', (req, res, next) => {
	fs.appendFileSync('stream/livestream.ogg', req.body)
	res.sendStatus(200)
})

app.get('/quit', (req, res) => {
	fs.unlinkSync('stream/livestream.ogg')
	res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`)
})
```
