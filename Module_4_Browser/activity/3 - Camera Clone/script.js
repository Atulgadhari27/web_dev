
let recordbtn = document.querySelector(".recordbtn");
let capturebtn = document.querySelector(".capturebtn");
let bigRecordbtn = document.querySelector(".record-btn");
let bigCapturebtn = document.querySelector(".capture-btn");
let timer = document.querySelector(".timer");
let filterColor = "rgba(0,0,0,0)";
let filterLayer = document.querySelector(".filter-layer");
let discard = document.querySelector(".discard");
let displaymsg = document.querySelector(".displaymsg");
let photomsg = document.querySelector(".photomsg");
let videomsg = document.querySelector(".videomsg");
let recordSymbol = document.querySelector(".record-symbol");
let zoomin = document.querySelector(".zoom-in");
let zoomout = document.querySelector(".zoom-out");


recordbtn.addEventListener("click", () => {
    recordbtn.classList.remove("active");
    recordbtn.classList.add("deactive");

    timer.style.display = "block";

    capturebtn.classList.remove("deactive");
    capturebtn.classList.add("active");

    bigCapturebtn.classList.remove("active");
    bigCapturebtn.classList.add("deactive");

    bigRecordbtn.classList.remove("deactive");
    bigRecordbtn.classList.add("active");


})


capturebtn.addEventListener("click", () => {
    recordbtn.classList.remove("deactive");
    recordbtn.classList.add("active");

    timer.style.display = "none";

    capturebtn.classList.remove("active");
    capturebtn.classList.add("deactive");

    bigCapturebtn.classList.remove("deactive");
    bigCapturebtn.classList.add("active");

    bigRecordbtn.classList.remove("active");
    bigRecordbtn.classList.add("deactive");


})


filterLayer.style.backgroundColor = filterColor;

let r = 0;
let g = 0;
let b = 0;
let a = 0;

let inputArr = document.querySelectorAll(".filter input");

inputArr.forEach((input) => {
    input.value = 0;
    input.addEventListener("change", (e) => {
        console.log(input.value)
        let value = input.value;
        let char = input.getAttribute("id");
        if (char == "r") {
            r = value;
        }
        else if (char == "g") {
            g = value;
        }
        else if (char == "b") {
            b = value;
        }
        else if (char == "a") {
            a = value;
        }
        filterColor = `rgba(${r},${g},${b},${a})`;
        filterLayer.style.backgroundColor = filterColor;
    });

})

discard.addEventListener("click", (e) => {
    filterColor = `rgba(0,0,0,0)`;
    filterLayer.style.backgroundColor = filterColor;
    inputArr.forEach((input) => {
        input.value = 0;
    })
})


let video = document.querySelector("video");
let recorder;
let recordFlag = false;
let chunks = [];

let constraints = {
    video: true,
    audio: true
}

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {

        video.srcObject = stream;
        recorder = new MediaRecorder(stream);

        recorder.addEventListener("start", (e) => {
            chunks = [];
            startTimer();
            recordSymbol.style.display = "block";
        })

        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })

        recorder.addEventListener("stop", (e) => {
            stopTimer();
            let blob = new Blob(chunks, { type: "video/mp4" });
            displaymsg.style.display = "block";
            displaymsg.classList.add("animation");
            videomsg.style.display = "block";
            setTimeout(() => {
                displaymsg.style.display = "none";
                displaymsg.classList.remove("animation");
                videomsg.style.display = "none";
            }, 1000)
            recordSymbol.style.display = "none";
            if (db) {
                let videoID = shortid();
                let dbTransaction = db.transaction("video", "readwrite");
                let videoStore = dbTransaction.objectStore("video");
                let videoEntry = {
                    id: `vid-${videoID}`,
                    blobData: blob
                }
                videoStore.add(videoEntry);
            }

            // let url = URL.createObjectURL(blob);
            // let a = document.createElement('a');
            // // document.body.appendChild(a);
            // // a.style = 'display: none';
            // a.href = url;
            // a.download = 'test.mp4';
            // a.click();
            // // window.URL.revokeObjectURL(url);

        })

    })

bigRecordbtn.addEventListener('click', () => {
    if (!recorder) return;

    recordFlag = !recordFlag;
    if (recordFlag) {
        recorder.start();
        bigRecordbtn.style.color = "#d63031";
    }
    else {
        recorder.stop();
        bigRecordbtn.style.removeProperty("color");
    }
})

let timerId;
let counter = 0;
function startTimer() {

    function displayTimer() {
        counter++;
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerHTML = `${hours}:${minutes}:${seconds}`;

    }
    timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timer.innerHTML = `00:00:00`;
    counter = 0;
}



bigCapturebtn.addEventListener('click', (e) => {
    if (!recorder) return;

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Filtering 
    tool.fillStyle = filterColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    displaymsg.style.display = "block";
    displaymsg.classList.add("animation");
    photomsg.style.display = "block";
    setTimeout(() => {
        displaymsg.style.display = "none";
        displaymsg.classList.remove("animation");
        photomsg.style.display = "none";
    }, 1000)
    if (db) {
        let imageID = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageID}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }
})

let scale = 1;

// zoomin.onclick = () => {

// }