let list = document.getElementById('list');
const editor = document.getElementById('editor');
const downloadBtn = document.getElementById('download');
const uploadBtn = document.getElementById('upload');
const resetBtn = document.getElementById('reset');
const addBtn = document.getElementById('add');

let count = 0;
addBtn.addEventListener('click', () => addToDo());

function addToDo(){
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
    date.textContent = 'date';

    let topBarBtns = document.createElement('div');
    topBarBtns.classList.add('top-bar__buttons');
    topBarBtns.classList.add('row');

    let switchBtn = document.createElement('button');
    switchBtn.classList.add('switch');
    switchBtn.addEventListener('click', () => switchComplete(toDo));

    let editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    editBtn.classList.add('button-img');
    editBtn.addEventListener('click', () => edit(toDo));

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.classList.add('button-img');

    topBarBtns.appendChild(switchBtn);
    topBarBtns.appendChild(editBtn);
    topBarBtns.appendChild(deleteBtn);

    topBar.appendChild(date);
    topBar.appendChild(topBarBtns);

    let description = document.createElement('p');
    description.classList.add('description');
    description.id = 'description-' + count;
    description.textContent = 'description';

    toDo.appendChild(topBar);
    toDo.appendChild(description);

    list.appendChild(toDo);
}

function switchComplete(toDo){
    toDo.querySelector('.switch').classList.toggle('switch-on')
    toDo.classList.toggle('complete');
}

function edit(toDo) {
    console.log('edit');
}