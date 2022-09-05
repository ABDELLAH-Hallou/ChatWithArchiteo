
function record() {
    document.getElementById('audioRec').style.display = 'block';
    document.getElementById('sendBtn').style.display = 'none';
    document.getElementById('sendBtnAudio').style.display = 'block';
    document.getElementById('chat-content').style.opacity = 0;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var audioContext = new AudioContext;
            var input = audioContext.createMediaStreamSource(stream);
            var rec = new Recorder(input, {
                numChannels: 1
            });
            rec.record();
            console.log("Recording started");
            // const mediaRecorder = new MediaRecorder(stream);
            // console.log('start');
            // mediaRecorder.start();
            // console.log('startd');
            // const audioChunks = [];
            // mediaRecorder.addEventListener("dataavailable", event => {
            //     audioChunks.push(event.data);
            // });

            // mediaRecorder.addEventListener("stop", () => {
            //     document.getElementById('audioRec').style.display = 'none';
            //     document.getElementById('sendBtn').style.display = 'block';
            //     document.getElementById('sendBtnAudio').style.display = 'none';
            //     document.getElementById('chat-content').style.opacity = 1;
            //     const audioBlob = new Blob(audioChunks);
            //     const audioUrl = URL.createObjectURL(audioBlob);
            //     console.log(audioUrl);
            //     const audio = new Audio(audioUrl);
            //     sendAudio(audioBlob);
            //     console.log(audio);
            //     audio.play();
            // });
            document.getElementById('sendBtnAudio').onclick = function () {
                // console.log('stop');
                // mediaRecorder.stop();
                // console.log('stoped');
                document.getElementById('audioRec').style.display = 'none';
                if (document.getElementById("sendBtnC").style.display == 'none' && document.getElementById("sendBtnA").style.display == 'none')
                    document.getElementById('sendBtn').style.display = 'block';
                else if (document.getElementById("sendBtnA").style.display == 'none')
                    document.getElementById('sendBtnC').style.display = 'block';
                else
                    document.getElementById('sendBtnA').style.display = 'block';
                document.getElementById('sendBtnAudio').style.display = 'none';
                document.getElementById('chat-content').style.opacity = 1;
                console.log("pauseButton clicked rec.recording=", rec.recording);

                rec.stop();
                stream.getAudioTracks()[0].stop();
                //create the wav blob and pass it on to createDownloadLink 
                rec.exportWAV(sendAudio);
            }
        });
}
// function createDownloadLink(blob) {
//     URL = window.URL || window.webkitURL;
//     var url = URL.createObjectURL(blob);
//     var au = document.createElement('audio');
//     var link = document.createElement('a');
//     //add controls to the <audio> element 
//     au.controls = true;
//     au.src = url;
//     //link the a element to the blob 
//     link.href = url;
//     link.download = new Date().toISOString() + '.wav';
//     link.innerHTML = link.download;
// }

function sendAudio(audio) {
    var filename = new Date().toISOString();

    var fd = new FormData();
    fd.append("vcl", audio, filename);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/vocal', false);
    xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
            console.log(xhr.responseText);
        } else if (xhr = 400) {
            console.log('There was an error 4.status =00');
        } else {
            console.log('something else other than 200 was returned');
        }
        if (xhr.readyState == 4) {
            var res = xhr.responseText;
            res = res.substring(1, res.length - 2);
            getResponse(res);
        }
    };
    xhr.send(fd);
}