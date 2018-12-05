function updatePlayer(seekTime, player, srcURL) {
  player.innerHTML = `<source src="${srcURL}" type="audio/ogg">`
  player.load()
  player.play()
  .then(player.fastSeek(seekTime))
}

function startAudioStream(player, srcURL) {
  function streamPlayback(){
    const seekTime = player.currentTime
    if (seekTime >= player.duration - 3 || player.children.length < 1){
      updatePlayer(seekTime, player, srcURL)
    }
  }
  interval = setInterval(streamPlayback, 3000)
}

function uploadRecording(audioChunk, srcURL) {
	const blob = new Blob(['', audioChunk], {'type' : 'audio/ogg; codec: vorbis;'})
	fetch(srcURL, {
		method: 'POST',
		body: blob,
		headers:{
			'Content-Type': 'application/octet-stream'
		}
	})
}

function quitRecording(quitURL) {
	fetch(quitURL, {method: 'GET'})
	.then(() => {window.open(self.location, '_self')})
}

function startAudioCapture(srcURL) {
  const constraints = {audio: true}
	navigator.mediaDevices.getUserMedia(constraints)
	.then(stream => {
		const mediaRecorder = new MediaRecorder(stream)
		mediaRecorder.start(2000)
		mediaRecorder.ondataavailable = event => {
			uploadRecording(event.data, srcURL)
		}
	})
}
