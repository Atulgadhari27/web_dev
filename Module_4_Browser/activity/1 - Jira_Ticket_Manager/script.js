

var uid = new ShortUniqueId();
let input = document.querySelector(".task_input");
let colors = ['lightblue', "lime", "pink", "orange"];
let deleteEnabled = false;
let modalPriorityColor = "lightblue";

let ticketArr = [];


function createTask(id, value) {
    let div = document.createElement("div");
    let main = document.querySelector(".main");
    div.setAttribute("class", "task");
    div.innerHTML = `
    <div class="task_color ${modalPriorityColor}"></div>
    <div class="task_text">
        <h1 class="task_id">${id}</h1>
        <div class="text">${value}</div>
    </div>`
    main.appendChild(div);
    ticketArr.push({modalPriorityColor, value, id});
    localStorage.setItem("jira-manager",JSON.stringify(ticketArr));

    let task = div.querySelector(".task_color");
    task.addEventListener("click", (e) => {
        let color = task.classList[1];
        let idx = colors.indexOf(color);
        idx = (idx + 1) % 4;
        task.classList.remove(color);
        task.classList.add(colors[idx]);
    });

}


// filter colors

let filterColor = "";
let filterBtn = null;
let allColors = document.querySelectorAll(".color");

allColors.forEach((color) => {
    color.addEventListener("click", (e) => {
        let mycolor = color.querySelector("div").classList[0];
        filterCards(mycolor, color);
    })
});


function filterCards(color, button) {
    let allcards = document.querySelectorAll(".task");

    if (filterColor != color) {
        allcards.forEach((card) => {
            let card_color = card.querySelector(".task_color").classList[1];
            if (card_color != color) {
                card.style.display = "none";
            }
            else {
                card.style.display = "block";
            }
        })
        button.style.backgroundColor = "rgb(94, 91, 91)";
        if(filterBtn != null){
            filterBtn.style.removeProperty("background-color");
        }
        filterColor = color;
        filterBtn = button;
    }
    else {
        allcards.forEach((card) => {
            card.style.display = "block";
        })
        button.style.removeProperty("background-color");
        filterColor = "";
        filterBtn = null;
    }
}


let deletebtn = document.querySelector(".delete");
deletebtn.addEventListener("click", (e) => {
    if (deleteEnabled == false) {
        deletebtn.style.backgroundColor = "rgb(94, 91, 91)";
        deleteTask();
        deleteEnabled = true;
        alert("Delete Button is Activated");
    }
    else {
        deleteEnabled = false;
        deletebtn.style.removeProperty("background-color");
    }
});

function deleteTask(){
    let cards = document.querySelectorAll(".task");
    if (cards.length > 0) {
        for(let i = 0; i < cards.length; i++) {
            let card = cards[i];
            card.addEventListener("click", (e) => {
                if (deleteEnabled == true) {
                    card.remove();
                    console.log(cards.length);
                }
                
            })
        }
    }

}


// Modal Script

let modal = document.querySelector(".modal");
let addBtn = document.querySelector(".add");
let addFlag = false;

addBtn.addEventListener("click", (e) => {
    addFlag = !addFlag;
    if (addFlag) {
        modal.style.display = "flex";
    }
    else {
        modal.style.display = "none";
    }
})

let modalcolors = modal.querySelector(".modal-filter-color");
let allModalColors = modalcolors.querySelectorAll(".modal-color");

modalcolors.addEventListener("click", (e) =>{
    if(e.target != e.currentTarget) {
        modalPriorityColor = e.target.classList[1];
        allModalColors.forEach((color) =>{
            color.classList.remove("border");
        })
        e.target.classList.add("border");
    }
})

textArea = document.querySelector("textarea");
modal.addEventListener("keydown", (e) =>{
    if(e.key == "Enter" && e.shiftKey){
        let id = uid();
        createTask(id, textArea.value);
        setModalToDefault();
    }
})

function setModalToDefault(){
    addFlag = !addFlag;
    textArea.value = "";
    modal.style.display = "none";
    allModalColors.forEach((color) =>{
        color.classList.remove("border");
    })
    allModalColors[0].classList.add("border");
    modalPriorityColor = "lightblue";

}
// let closebtn = document.querySelector(".close");
// closebtn.addEventListener("click", (e) => {
//     modal.style.removeProperty("display");
// })