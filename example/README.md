# Broadcaster and Listener Example

This example demonstrates a two-member application where one member is
broadcasting audio and another is listening to this audio live. The broadcaster
starts a recording and audio is captured using `getUserMedia`. This is uploaded
to a server encoded as vorbis ogg and appended to a file. The listener starts
playback and the application periodically requests the file to get the most
up-to-date version.

### How to use

Requires node and npm. Also, you should be using headphones to avoid feedback.

From `simple-http-streamer/example/server` run:
* `node server`

In web browser:
* navigate to `file:///{path-to-project}/simple-http-streamer/example/static/broadcaster.html`
* press *Record* button

In another tab/window/browser:
* navigate to `file:///{path-to-project}/simple-http-streamer/example/static/listener.html`
* press *Listen!* button

At this point, you should be hearing your own audio.

Make sure to stop the listener (refresh/close page or pause), then press *Quit*
button on the broadcaster when finished. If not, you will need to manually delete the
{project-root}/example/server/stream/livestream.ogg file.
