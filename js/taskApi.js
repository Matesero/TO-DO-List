import { setToDoList, sort } from "./main.js"

export function createNewTask() {
    fetch('http://localhost:8080/api/createTask', {
        method: 'POST',
    })
      .then(uploadFromDatabase)
}

export function sendToDatabase(list) {
    fetch('http://localhost:8080/api/addAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(list)
    })
      .then(uploadFromDatabase)
}

export async function uploadFromDatabase() {
    try {
        let response;
        switch (sort) {
            case "all":
                response = await fetch('http://localhost:8080/api/getAll', {
                    method: 'GET'
                })
                break;
            case "onlyCompleted":
                response = await fetch('http://localhost:8080/api/getOnlyCompleted', {
                    method: 'GET'
                })
                break
            case "onlyNotCompleted":
                response = await fetch('http://localhost:8080/api/getOnlyNotCompleted', {
                    method: 'GET'
                })
                break
        }
        if (response) {
            setToDoList(await response.json());
        } else {
            console.error('Error with upload');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error)
    }
}

export async function getTaskFromDatabase(id) {
    const response = await fetch(`http://localhost:8080/api/getOne/${id}`, {
        method: 'GET'
    });
    return await response.json();
}

export function deleteOneTask(id){
    fetch(`http://localhost:8080/api/deleteOne/${id}`,{
        method: 'DELETE'
    })
      .then(uploadFromDatabase)
}

export function deleteAllTasks(){
    fetch(`http://localhost:8080/api/deleteAll`,{
        method: 'DELETE'
    })
      .then(uploadFromDatabase)
}

export function switchCompleted(id){
    fetch(`http://localhost:8080/api/switchCompleted/${id}`,{
        method:'PATCH'
    })
      .then(uploadFromDatabase)
}

export function changeDate(id, date) {
    fetch(`http://localhost:8080/api/changeDate/${id}`,{
        method:'PATCH',
        headers: {
            'Content-Type': 'application/string'
        },
        body: date
    })
      .then(uploadFromDatabase)
      .catch(error => console.error('Error fetching tasks:', error))
}

export function changeDescription(id, description) {
    fetch(`http://localhost:8080/api/changeDescription/${id}`,{
        method:'PATCH',
        headers: {
            'Content-Type': 'application/string'
        },
        body: description
    })
      .then(uploadFromDatabase)
      .catch(error => console.error('Error fetching tasks:', error))
}
