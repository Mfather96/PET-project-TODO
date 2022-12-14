
// =====TASKS LIST ===============================================

// ПОЛУЧАЕМ ДОМ ЭЛЕМЕНТЫ С HTML
let inputNewTask = document.querySelector('.new-task-input');
let buttonAddNewTask = document.querySelector('.add-new-task-btn');
let ulTodoList = document.querySelector('.list-tasks');
let emptyBox = document.querySelector('.empty-box');
let wrapper = document.querySelector('.wrapper');
let deleteAllBtn = document.querySelector('.delete-all')

// СОЗДАЕМ МАССИВ ДЛЯ ЗАДАЧ
let tasks = [];
// ПРОВЕРЯЕМ ЛОКАЛЬНОЕ ХРАНИЛИЩЕ
if(localStorage.getItem('tasks')){
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}


// ПРОВЕРЯЕМ ЕСТЬ ЛИ ДАННЫЕ В LOCAL STORAGE 
checkEmptyList()



buttonAddNewTask.addEventListener('click', addTask);
ulTodoList.addEventListener('click', deleteTask);	
ulTodoList.addEventListener('click', impTask);
ulTodoList.addEventListener('click', doneTask);
deleteAllBtn.addEventListener('click', surePopUpDeleteAllTasks)

// ФУНКЦИИ 

	function addTask(){
		const taskText = inputNewTask.value;
		if(!taskText) return;
		const newTask = {
			id: Date.now(),
			text: taskText,
			imp: false,
			done: false
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
		surePopUpOpen(event);
	// 	if(event.target.dataset.action === 'delete'){
			
	// }
}

	function deleteAllTasks(){

		tasks.splice(0, tasks.length);
		ulTodoList.innerHTML = '';
		
		saveToLocalStorage();
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

	function doneTask(event){
					// Проверяем кликнули ли мы по кнопке "выполнено"
					if(event.target.dataset.action !== 'done') return;

					const parentNode = event.target.closest('.item-todo');
					// Определяем ID задачи
					const id = Number(parentNode.id);
					// Находим отмеченную задачу
					const task = tasks.find((task)=> task.id === id);
					// Конвертируем ключ IMP
					task.done = !task.done;
		
					saveToLocalStorage();
		
					parentNode.classList.toggle('done');
					
		
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
		// Проверяем кнопки на TRUE для вывода соответствующего класса
			let cssClass = '';
			if(task.done && task.imp){
				cssClass = 'item-todo done';
			} else if(task.done){
				cssClass = 'item-todo done';
			} else if(task.imp){
				cssClass = 'item-todo important';
			} else {
				cssClass = 'item-todo';
			}
		
		const taskHTML = `
			<li id="${task.id}" class="${cssClass}">
				<button data-action="delete" class="item-delete"></button>
				<button data-action="important" class="item-important"></button>
				<button data-action="done" class="item-done"></button>
				<label>${task.text}</label>	
			</li>
			`;
		ulTodoList.insertAdjacentHTML('beforeend', taskHTML);
	}
	
	function surePopUpOpen(event){
		const questionPopUp = `
				<div class="sure-wrapper">
					<div data-action="sure-container" class="sure-container">
						<p class="sure-text">Вы уверены что хотите удалить?</p>
						<div class="buttons-sure">
							<button data-sure="yes" class="button yes">Да</button>
							<button data-sure="no" class="button no">Нет</button>
						</div>
					</div>
				</div>
			`;
		const parentNode = event.target.closest('.item-todo');
		parentNode.insertAdjacentHTML('beforeend', questionPopUp);
		parentNode.addEventListener('click', surePopUpClose)
	}

	function surePopUpDeleteAllTasks(){
		const questionPopUp = `
				<div class="sure-wrapper">
					<div data-action="sure-container" class="sure-container">
						<p class="sure-text">Вы уверены что хотите удалить все задачи?</p>
						<div class="buttons-sure">
							<button data-sure="yes-all" class="button yes">Да</button>
							<button data-sure="no-all" class="button no">Нет</button>
						</div>
					</div>
				</div>
			`;
			ulTodoList.insertAdjacentHTML('beforeend', questionPopUp);
			ulTodoList.addEventListener('click', surePopUpDeleteAllTasksCLose);
	}
	function surePopUpDeleteAllTasksCLose(event){
		if(event.target.dataset.sure === 'no-all') {
			return event.target.closest('.sure-wrapper').remove();
		} else if(event.target.dataset.sure === 'yes-all'){
			deleteAllTasks();
		}
	}

	function surePopUpClose(event){
		if(event.target.dataset.sure === 'no') {
		return event.target.closest('.sure-wrapper').remove();
		} else if(event.target.dataset.sure === 'yes'){
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
		}

		// ========== SETTINGS ==============================================

		const blockSettings = document.querySelectorAll('.block-settings');

		blockSettings.forEach((elem)=>{
			elem.addEventListener('click', plusCount)
		})

		function plusCount(event){

			const parentNode = event.target.closest('.block-settings');

			let spanFz = parentNode.querySelector('.font-size-span');

		
			if(event.target.classList.contains('plus')){
				spanFz.textContent = Number(spanFz.textContent) + 1;
				ulTodoList.querySelectorAll('.item-todo').forEach((item)=>{
					item.style.fontSize = spanFz.textContent + 'px';
				})
			}
			if(event.target.classList.contains('minus')){
				spanFz.textContent = Number(spanFz.textContent) - 1;
				ulTodoList.querySelectorAll('.item-todo').forEach((item)=>{
					item.style.fontSize = spanFz.textContent + 'px';
				})
			}

		}
