let list = document.getElementById('list');
const editor = document.getElementById('editor');
const addBtn = document.getElementById('add');
const saveBtn = document.getElementById('save');
const closeBtn = document.getElementById('close');
const downloadBtn = document.getElementById('download');
const uploadBtn = document.getElementById('upload');
const hiddenUploadBtn = document.getElementById('hidden-button-upload');
const resetBtn = document.getElementById('reset');

let count = 0;
addBtn.addEventListener('click', () => {
    addToDo({date:'date', description:'description', switchOn: false});
    sort();
});
saveBtn.addEventListener('click', () => {});
closeBtn.addEventListener('click', () => closeEditor());
downloadBtn.addEventListener('click', () => download());
uploadBtn.addEventListener('click', () => clickHiddenBtn(hiddenUploadBtn));
hiddenUploadBtn.addEventListener('change', () => upload())
resetBtn.addEventListener('click', () => reset());

function addToDo(data){
    count++;
    let toDo = document.createElement('div');
    toDo.classList.add('to-do');
    toDo.classList.add('column');
    toDo.id = 'to-do-' + count;

    let topBar = document.createElement('div');
    topBar.classList.add('to-do__top-bar');
    topBar.classList.add('row');

    let date = document.createElement('p');
    date.classList.add('date');
    date.id = 'date-' + count;
    date.textContent = data.date;

    let topBarBtns = document.createElement('div');
    topBarBtns.classList.add('top-bar__buttons');
    topBarBtns.classList.add('row');

    let switchBtn = document.createElement('button');
    switchBtn.classList.add('switch');
    if (data.switchOn){
        switchBtn.classList.add('switch-on');
    }
    switchBtn.addEventListener('click', () => switchComplete(toDo));

    let editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    editBtn.classList.add('button-img');
    editBtn.addEventListener('click', () => edit(toDo));

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.classList.add('button-img');
    deleteBtn.addEventListener('click', () => deleteToDo(toDo));

    topBarBtns.appendChild(switchBtn);
    topBarBtns.appendChild(editBtn);
    topBarBtns.appendChild(deleteBtn);

    topBar.appendChild(date);
    topBar.appendChild(topBarBtns);

    let description = document.createElement('p');
    description.classList.add('description');
    description.id = 'description-' + count;
    description.textContent = data.description;

    toDo.appendChild(topBar);
    toDo.appendChild(description);

    list.appendChild(toDo);
}

function switchComplete(toDo){
    toDo.querySelector('.switch').classList.toggle('switch-on')
    toDo.classList.toggle('complete');
}

function edit(toDo) {
    editor.classList.toggle('hidden');
}

function deleteToDo(toDo){
    toDo.remove();
}

function closeEditor(){
    editor.classList.add('hidden');
}

function getToDoList(){
    return Array.from(document.getElementsByClassName('to-do'));
}

function convertElement(toDo){
    const date = toDo.querySelector('.date').textContent;
    const description = toDo.querySelector('.description').textContent;
    const switchOn = toDo.querySelector('.switch').classList.contains('switch-on');
    return {date: date, description:description, switchOn:switchOn};
}

function getConvertedToDOList(){
    const toDoListDoc = getToDoList();
    let toDoList = [];
    for (let i = 0; i < toDoListDoc.length; i++){
        const toDo = convertElement(toDoListDoc[i]);
        toDoList.push(toDo);
    }
    return toDoList;
}

function download(){
    const toDoList = getConvertedToDOList();
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
        const toDoList = JSON.parse(event.target.result);
        reset();
        toDoList.forEach(toDo => addToDo(toDo));
        sort();
    };
    reader.readAsText(file);
}

function clickHiddenBtn(btn) {
    btn.click();
}

function reset(){
    count = 0;
    if (!editor.classList.contains('hidden')){
        editor.classList.add('hidden');
    }
    const toDoList = getToDoList();
    toDoList.forEach(toDo => toDo.remove());
}

function sort(){
    let toDoList = getToDoList();
    const n = toDoList.length;
    for (let i = 0; i < n - 1; i++){
        for (let j = i + 1; j < n; j++){
            const firstDate = toDoList[i].querySelector('.date').textContent;
            const secondDate = toDoList[j].querySelector('.date').textContent;
            if ((secondDate === 'date' && firstDate !== 'date') ||secondDate < firstDate){
                list.insertBefore(toDoList[j], toDoList[i]);
                toDoList = getToDoList();
            }
        }
    }
}