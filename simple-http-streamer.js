/*
 * Makes GET request for ogg audio file from source. Sets playerElement's source
 * to this file. Loads source, plays source, then seeks to seekTime.
 */
function loadAudioChunk(seekTime, playerElement, sourceURL) {
  playerElement.innerHTML = `<source src="${sourceURL}" type="audio/ogg">`
  playerElement.load()
  playerElement.play()
  .then(playerElement.fastSeek(seekTime))
}

/*
 * Creates interval to play audio stream using periodic calls to load dynamic
 * source. playerElement's source is updated and seekTime is advanced to
 * previous position to make audio playback continuous. Source is only updated
 * if no source or seekTime within UPDATE_PERIOD from playerElement's duration.
 */
function playAudioStream(playerElement, sourceURL) {
  const UPDATE_PERIOD = 3000 // milliseconds

  function updateAudioSource(){
    const seekTime = playerElement.currentTime
    if (seekTime >= playerElement.duration - UPDATE_PERIOD / 1000 || playerElement.children.length < 1){
      loadAudioChunk(seekTime, playerElement, sourceURL)
    }
  }

  const interval = setInterval(updateAudioSource, UPDATE_PERIOD)
}

/*
 * Creates new vorbis ogg Blob out of a rawAudio input and POSTs it to an
 * uploadURL as an octet-stream.
 */
function uploadAudioChunk(rawAudio, uploadURL) {
	const vorbisOggBlob = new Blob([rawAudio], {'type' : 'audio/ogg; codec: vorbis;'})
	fetch(uploadURL, {
		method: 'POST',
		body: vorbisOggBlob,
		headers:{
			'Content-Type': 'application/octet-stream'
		}
	})
}

/*
 * Calls stopCaptureURL endpoint to handle capture stop on server then reloads
 * the page.
 */
function stopAudioCapture(stopCaptureURL) {
	fetch(stopCaptureURL, {method: 'GET'})
	.then(() => {window.open(self.location, '_self')})
}

/*
 * Requests audio capture media device. If successful, starts media recorder
 * capturing audio every CAPTURE_PERIOD and uploads its data to uploadURL when
 * data is available.
 */
function startAudioCapture(uploadURL) {
  const CAPTURE_PERIOD = 2000 // milliseconds
  const constraints = {audio: true} // audio resources from user media

	navigator.mediaDevices.getUserMedia(constraints)
	.then(stream => {
		const mediaRecorder = new MediaRecorder(stream)
		mediaRecorder.start(CAPTURE_PERIOD)
		mediaRecorder.ondataavailable = event => {
			uploadAudioChunk(event.data, uploadURL)
		}
	})
}
