

let galleryCont = document.querySelector(".content");
let del = document.querySelector(".delete");
let download = document.querySelector(".download");

let collections = document.querySelector(".collections");
let photos = document.querySelector(".photos");
let videos = document.querySelector(".videos");


function getPhotos(){
    if (db) {
        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();  //Event driven
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "img");
                mediaElem.setAttribute("id", imageObj.id);

                let url = imageObj.url;
                mediaElem.innerHTML = `<div class="delete">
                <span class="material-icons">
                    delete
                </span>
            </div><div class="download">
            <span class="material-icons">
                file_download
            </span>
        </div><img src="${url}" />`;
                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }
    }
}

function getVideos(){
    if (db) {
        // photos.style.backgroundColor = 
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();  //Event driven
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "img");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `<div class="delete">
                                <span class="material-icons">
                                    delete
                                </span>
                            </div>
                            <div class="download">
                                    <span class="material-icons">
                                        file_download
                                    </span>
                                </div>
                    <video autoplay loop muted src="${url}"></video>`;

                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }
    }
}

setTimeout(() => {
    collections.style.backgroundColor = "#636e72";
    getPhotos();
    getVideos();

}, 100)

collections.addEventListener("click", (e) => {
    galleryCont.innerHTML = "";
    collections.style.backgroundColor = "#636e72";
    photos.style.removeProperty("background-color");
    videos.style.removeProperty("background-color");
    getCollections();
})

function getCollections() {
    getPhotos();
    getVideos();  
}


photos.addEventListener("click", (e) => {
    photos.style.backgroundColor = "#636e72";
    collections.style.removeProperty("background-color");
    videos.style.removeProperty("background-color");
    galleryCont.innerHTML = "";
    getPhotos();
    
});


videos.addEventListener("click", (e) => {
    videos.style.backgroundColor = "#636e72";
    photos.style.removeProperty("background-color");
    collections.style.removeProperty("background-color");
    galleryCont.innerHTML = "";
    getVideos();
})


// UI remove, DB remove
function deleteListener(e) {
    // DB removal
    let id = e.target.parentElement.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    }

    // UI removal
    e.target.parentElement.parentElement.remove();

}

function downloadListener(e) {
    let id = e.target.parentElement.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
        }
    }
}

