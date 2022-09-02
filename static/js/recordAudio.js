// const recordAudio = () =>
//     new Promise(async resolve => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mediaRecorder = new MediaRecorder(stream);
//         const audioChunks = [];

//         mediaRecorder.addEventListener("dataavailable", event => {
//             audioChunks.push(event.data);
//         });

//         const start = () => mediaRecorder.start();

//         const stop = () =>
//             new Promise(resolve => {
//                 mediaRecorder.addEventListener("stop", () => {
//                     const audioBlob = new Blob(audioChunks);
//                     const audioUrl = URL.createObjectURL(audioBlob);
//                     const audio = new Audio(audioUrl);
//                     const play = () => audio.play();
//                     resolve({ audioBlob, audioUrl, play });
//                 });

//                 mediaRecorder.stop();
//             });

//         resolve({ start, stop });
//     });

// const sleep = time => new Promise(resolve => setTimeout(resolve, time));

// (async () => {
//     const recorder = await recordAudio();
//     recorder.start();
//     await sleep(3000);
//     const audio = await recorder.stop();
//     audio.play();
// })();


function record() {
    // const recorder = await recordAudio();
    // 
    // recorder.start();
    // 
    // // await sleep(3000);
    // document.getElementById('stopRecord').onclick = function(){
    //     console.log('stop');
    //     const audio = await recorder.stop();
    //     console.log('stoped');
    //     console.log('play');
    //     audio.play();
    // }
    document.getElementById('audioRec').style.display = 'block';
    document.getElementById('sendBtn').style.display = 'none';
    document.getElementById('sendBtnAudio').style.display = 'block';
    document.getElementById('chat-content').style.opacity = 0;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            console.log('start');
            mediaRecorder.start();
            console.log('startd');
            const audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                document.getElementById('audioRec').style.display = 'none';
                document.getElementById('sendBtn').style.display = 'block';
                document.getElementById('sendBtnAudio').style.display = 'none';
                document.getElementById('chat-content').style.opacity = 1;
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                console.log(audioUrl);
                const audio = new Audio(audioUrl);
                console.log(audio);
                audio.play();
            });
            document.getElementById('sendBtnAudio').onclick = function () {
                console.log('stop');
                mediaRecorder.stop();
                console.log('stoped');
            }
        });
}
