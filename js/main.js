import {
    createNewTask,
    switchCompleted,
    deleteOneTask,
    sendToDatabase,
    getTaskFromDatabase,
    changeDate,
    changeDescription,
    deleteAllTasks,
    uploadFromDatabase
} from './taskApi.js';

class Task {
    constructor(id, date, description, isCompleted) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.isCompleted = isCompleted;
    }
}

let list = document.getElementById('list');
const toDoListDoc = document.getElementById('to-do-list');
const toDOListContent = document.getElementById('to-do-list__content');
scale();
const editor = document.getElementById('editor');
const editorDate = editor.querySelector('#input-date');
const editorDescription = editor.querySelector('#input-description');
const editorBackground = document.getElementById('editor__background');
const switchSortBtn = document.getElementById('switch-sort');
const addBtn = document.getElementById('add');
const saveBtn = document.getElementById('save');
const closeBtn = document.getElementById('close');
const downloadBtn = document.getElementById('download');
const uploadBtn = document.getElementById('upload');
const hiddenUploadBtn = document.getElementById('hidden-button-upload');
const resetBtn = document.getElementById('reset');

let toDoList = [];
let chosenTask = 0;
let editing = false;
export let sort = "all";

window.addEventListener('resize', scale);
document.addEventListener('DOMContentLoaded', function () {
    uploadFromDatabase();
});
switchSortBtn.addEventListener('click', () => switchSort());
addBtn.addEventListener('click', () => createNewTask());
editorBackground.addEventListener('click', () => closeEditor());
saveBtn.addEventListener('click', () => save());
closeBtn.addEventListener('click', () => closeEditor());
downloadBtn.addEventListener('click', () => download());
uploadBtn.addEventListener('click', () => clickHiddenBtn(hiddenUploadBtn));
hiddenUploadBtn.addEventListener('change', () => uploadFromFile())
resetBtn.addEventListener('click', () => reset());

function switchSort (){
    switch (sort) {
        case "all":
            sort = "onlyNotCompleted";
            switchSortBtn.textContent = "only not completed";
            break;
        case "onlyNotCompleted":
            sort = "onlyCompleted";
            switchSortBtn.textContent = "only completed";
            break;
        case "onlyCompleted":
            sort = "all";
            switchSortBtn.textContent = "all"
            break;
    }
    uploadFromDatabase();
}

export function setToDoList(list) {
    toDoList = list;
    display();
}

function createHtmlToDo(data){
    let htmlToDo = document.createElement('div');
    htmlToDo.classList.add('to-do');
    htmlToDo.classList.add('column');
    htmlToDo.id = data.id.toString();

    let topBar = document.createElement('div');
    topBar.classList.add('to-do__top-bar');
    topBar.classList.add('row');

    let date = document.createElement('p');
    date.classList.add('date');
    date.textContent = data.date;

    let topBarBtns = document.createElement('div');
    topBarBtns.classList.add('top-bar__buttons');
    topBarBtns.classList.add('row');

    let switchBtn = document.createElement('button');
    switchBtn.classList.add('switch');
    if (data.isCompleted){
        switchBtn.classList.add('switch-on');
        htmlToDo.classList.add('completed');
    }
    switchBtn.addEventListener('click', () => switchCompleted(data.id));

    let editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    editBtn.classList.add('button-img');
    editBtn.addEventListener('click', () => edit(data.id));

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.classList.add('button-img');
    deleteBtn.addEventListener('click', () => deleteOneTask(data.id));

    topBarBtns.appendChild(switchBtn);
    topBarBtns.appendChild(editBtn);
    topBarBtns.appendChild(deleteBtn);

    topBar.appendChild(date);
    topBar.appendChild(topBarBtns);

    let description = document.createElement('p');
    description.classList.add('description');
    description.textContent = data.description;

    htmlToDo.appendChild(topBar);
    htmlToDo.appendChild(description);

    list.appendChild(htmlToDo);
}

async function edit(id) {
    openEditor();
    chosenTask = id;
    const task = await getTaskFromDatabase(id);
    editorDate.value = task.date;
    editorDescription.value = task.description;
}

function save(){
    closeEditor();

    const date = editorDate.value.toString();
    if (date !== '') {
        changeDate(chosenTask, date);
    }

    const description = editorDescription.value;
    changeDescription(chosenTask, description)
}

function openEditor(){
    editing = true;
    toDoListDoc.classList.remove('no-blur');
    toDoListDoc.classList.add('blur');
    editorDescription.style.height = '20px';
    document.body.style.overflow = 'hidden';
    editor.classList.remove('hidden');
}

function closeEditor(){
    editor.classList.add('hidden');
    document.body.style.overflow = '';
    toDoListDoc.classList.add('no-blur');
    toDoListDoc.classList.remove('blur');
}

function download(){
    const json = JSON.stringify(toDoList);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const btn = document.createElement('a');
    btn.setAttribute('download', "toDoList.json");
    btn.href = url;
    document.body.appendChild(btn);
    btn.click();
    document.body.removeChild(btn);
}

export function uploadFromFile(){
    const file = hiddenUploadBtn.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const list = JSON.parse(event.target.result);
        sendToDatabase(list);
    };
    reader.readAsText(file);
}

function clickHiddenBtn(btn) {
    btn.click();
}

function reset(){
    deleteAllTasks();
}

function removeChildNodes(id){
    const node = document.getElementById(id);
    while (node.childNodes.length > 0){
        node.removeChild(node.firstChild);
    }
}

export function display(){
    removeChildNodes('list');
    toDoList.forEach(td => createHtmlToDo(td));
}

function scale(){
    const height = window.innerHeight;
    const newMaxHeight = (height - 150);
    if (toDOListContent.height > newMaxHeight) {
        toDOListContent.style.height = (newMaxHeight + 150) + 'px';
    }
    toDOListContent.style.maxHeight = (height - newMaxHeight / height * 100) + 'px';
    list.style.maxHeight = (height - (1 + newMaxHeight / height) * 100) + 'px';
}