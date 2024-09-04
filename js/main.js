class toDo {
    constructor(date, description, completed, index) {
        this.date = date;
        this.description = description;
        this.completed = completed;
        this.index = index;
    }
}

let list = document.getElementById('list');
const toDoListDoc = document.getElementById('to-do-list');
const toDOListContent = document.getElementById('to-do-list__content');
scale();
const editor = document.getElementById('editor');
const editorBackground = document.getElementById('editor__background');
const addBtn = document.getElementById('add');
const saveBtn = document.getElementById('save');
const closeBtn = document.getElementById('close');
const downloadBtn = document.getElementById('download');
const uploadBtn = document.getElementById('upload');
const hiddenUploadBtn = document.getElementById('hidden-button-upload');
const resetBtn = document.getElementById('reset');

let toDoList = [];
let chosenToDo = 0;
let count = 0;
let editing = false;

window.addEventListener('resize', scale);
addBtn.addEventListener('click', () => addNewToDo());
editorBackground.addEventListener('click', () => closeEditor());
saveBtn.addEventListener('click', () => save());
closeBtn.addEventListener('click', () => closeEditor());
downloadBtn.addEventListener('click', () => download());
uploadBtn.addEventListener('click', () => clickHiddenBtn(hiddenUploadBtn));
hiddenUploadBtn.addEventListener('change', () => upload())
resetBtn.addEventListener('click', () => reset());

function addNewToDo(){
    let newToDo = new toDo('date', 'description', false, count);
    toDoList.push(newToDo);
    sort();
    display();
    count++;
}

function createHtmlToDo(data){
    let htmlToDo = document.createElement('div');
    htmlToDo.classList.add('to-do');
    htmlToDo.classList.add('column');
    htmlToDo.id = 'to-do-' + data.index;

    let topBar = document.createElement('div');
    topBar.classList.add('to-do__top-bar');
    topBar.classList.add('row');

    let date = document.createElement('p');
    date.classList.add('date');
    date.id = 'date-' + data.index;
    date.textContent = data.date;

    let topBarBtns = document.createElement('div');
    topBarBtns.classList.add('top-bar__buttons');
    topBarBtns.classList.add('row');

    let switchBtn = document.createElement('button');
    switchBtn.classList.add('switch');
    if (data.completed){
        switchBtn.classList.add('switch-on');
        htmlToDo.classList.add('completed');
    }
    switchBtn.addEventListener('click', () => switchCompleted(htmlToDo, data.index));

    let editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    editBtn.classList.add('button-img');
    editBtn.addEventListener('click', () => edit(htmlToDo, data));

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.classList.add('button-img');
    deleteBtn.addEventListener('click', () => deleteToDo(data.index));

    topBarBtns.appendChild(switchBtn);
    topBarBtns.appendChild(editBtn);
    topBarBtns.appendChild(deleteBtn);

    topBar.appendChild(date);
    topBar.appendChild(topBarBtns);

    let description = document.createElement('p');
    description.classList.add('description');
    description.id = 'description-' + data.index;
    description.textContent = data.description;
    console.log(data.description);

    htmlToDo.appendChild(topBar);
    htmlToDo.appendChild(description);

    list.appendChild(htmlToDo);
}

function switchCompleted(td, index){
    toDoList[index].completed = !toDoList[index].completed;
    td.querySelector('.switch').classList.toggle('switch-on')
    td.classList.toggle('completed');
}

function edit(htmlToDo, data) {
    openEditor();
    chosenToDo = data.index;
    console.log(editor.querySelector('#input-date').value);
    editor.querySelector('#input-date').value = data.date;
    editor.querySelector('#input-description').value = data.description;
}

function save(){
    closeEditor();
    const date = editor.querySelector('#input-date').value;
    if (date !== '') {
        toDoList[chosenToDo].date = date;
    }
    toDoList[chosenToDo].description = editor.querySelector('#input-description').value;
    sort();
    display();
}

function openEditor(){
    editing = true;
    toDoListDoc.classList.remove('no-blur');
    toDoListDoc.classList.add('blur');
    editor.querySelector('#input-description').style.height = '20px';
    document.body.style.overflow = 'hidden';
    editor.classList.remove('hidden');
}

function closeEditor(){
    editor.classList.add('hidden');
    document.body.style.overflow = '';
    toDoListDoc.classList.add('no-blur');
    toDoListDoc.classList.remove('blur');
}

function deleteToDo(index){
    count--;
    toDoList.splice(index, 1);
    display();
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

function upload(){
    const file = hiddenUploadBtn.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        toDoList = JSON.parse(event.target.result);
        sort();
        display();
    };
    reader.readAsText(file);
}

function clickHiddenBtn(btn) {
    btn.click();
}

function reset(){
    count = 0;
    toDoList.splice(0, toDoList.length);
    if (!editor.classList.contains('hidden')){
        editor.classList.add('hidden');
    }
    removeChildNodes('list');
}

function removeChildNodes(id){
    const node = document.getElementById(id);
    while (node.childNodes.length > 0){
        node.removeChild(node.firstChild);
    }
}

function sort(){
    const n = toDoList.length;
    for (let i = 0; i < n - 1; i++){
        for (let j = i + 1; j < n; j++){
            const firstDate = toDoList[i].date;
            const secondDate = toDoList[j].date;
            if ((secondDate === 'date' || secondDate < firstDate) && (firstDate !== 'date')){
                toDoList[i].index = j;
                toDoList[j].index = i;
                const temp = toDoList[i];
                toDoList[i] = toDoList[j];
                toDoList[j] = temp;
            }
        }
    }
}

function display(){
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