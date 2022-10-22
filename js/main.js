
// =====TASKS LIST ===============================================

// ПОЛУЧАЕМ ДОМ ЭЛЕМЕНТЫ С HTML
let inputNewTask = document.querySelector('.new-task-input');
let buttonAddNewTask = document.querySelector('.add-new-task-btn');
let ulTodoList = document.querySelector('.list-tasks');
let emptyBox = document.querySelector('.empty-box')

let tasks = [];

if(localStorage.getItem('tasks')){
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}



checkEmptyList()

// ПРОВЕРЯЕМ ЕСТЬ ЛИ ДАННЫЕ В LOCAL STORAGE 

buttonAddNewTask.addEventListener('click', addTask);
ulTodoList.addEventListener('click', deleteTask);	
ulTodoList.addEventListener('click', impTask);


// ФУНКЦИИ 

	function addTask(){
		const taskText = inputNewTask.value;
		const newTask = {
			id: Date.now(),
			text: taskText,
			imp: false
		}

		tasks.push(newTask);

		saveToLocalStorage();

		renderTask(newTask);

		inputNewTask.value = '';
		inputNewTask.focus();

		checkEmptyList()
	}
		
	function deleteTask(event){

		if(event.target.dataset.action !== 'delete') return;

			const parentNode = event.target.closest('.item-todo');
			// Определяем ID задачи
			const id = Number(parentNode.id);

			// Удаляем задачу из массива через фильтрацию
			tasks = tasks.filter((task) => task.id !== id);

			saveToLocalStorage()

			// Удаляем задачу из разметки
			parentNode.remove();

			checkEmptyList()
	}

	function impTask(event){
			// Проверяем кликнули ли мы по кнопке "важное"
			if(event.target.dataset.action !== 'important') return;

			const parentNode = event.target.closest('.item-todo');
			// Определяем ID задачи
			const id = Number(parentNode.id);
			// Находим отмеченную задачу
			const task = tasks.find((task)=> task.id === id);
			// Конвертируем ключ IMP
			task.imp = !task.imp;

			saveToLocalStorage()

			parentNode.classList.toggle('important')

	}

	function checkEmptyList(){
		if(tasks.length === 0){
			const emptyBox = `<li class="empty-box">
										<img src="./img/empty.png" alt="">
									</li>`;
			ulTodoList.insertAdjacentHTML('afterbegin', emptyBox);								
		}
		if(tasks.length > 0){
			const emptyElem = document.querySelector('.empty-box');
			emptyElem ? emptyElem.remove() : null;
		}
	}

	function saveToLocalStorage(){
		localStorage.setItem('tasks', JSON.stringify(tasks))
	}

	function renderTask(task){
		const cssClass = task.imp ? 'item-todo important': 'item-todo';

		const taskHTML = `
			<li id="${task.id}" class="${cssClass}">
				<button data-action="delete" class="item-delete"></button>
				<button data-action="important" class="item-important"></button>
				<label>${task.text}</label>	
			</li>
			`;
		ulTodoList.insertAdjacentHTML('beforeend', taskHTML);
	}