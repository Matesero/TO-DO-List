const editor = document.getElementById('editor');
const downloadBtn = document.getElementById('download');
const uploadBtn = document.getElementById('upload');
const resetBtn = document.getElementById('reset');

const switchs = document.getElementsByClassName('switch');
Array.from(switchs).forEach(sw => {
    sw.addEventListener('click', () => {
       sw.classList.toggle('switch-on');
       sw.parentNode.parentNode.parentNode.classList.toggle('complete');
    });
})