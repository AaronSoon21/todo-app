const taskInput = document.querySelector("#taskInput")
const addBtn = document.querySelector("#addBtn")
const taskList = document.querySelector("#taskList")
const taskCount = document.querySelector("#taskCount")
const filterButtons = document.querySelectorAll(".filters button")
const clearCompletedBtn = document.querySelector("#clearCompleted")
const clearAllBtn = document.querySelector("#clearAll")

let tasks = JSON.parse(localStorage.getItem("savedTasks")) || []
if (localStorage.getItem("theme") === "true") {
    document.body.classList.add("dark")
}


// Clear completed button functionality
clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.done)
    renderTasks()
})

// Clear all button functionality
clearAllBtn.addEventListener("click", () => {
    if (confirm("Clear all tasks?")){
        tasks = []
        renderTasks()
    }
})

// Filter
let currentFilter = "all"

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"))
        button.classList.add("active")

        currentFilter = button.dataset.setFilter
        renderTasks()

    })
})

renderTasks()


// Add task button
taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addBtn.click()
  }
})

addBtn.addEventListener("click", () => {

    const taskText = taskInput.value.trim()

    if(taskText !== ""){
        tasks.push({id: Date.now() + Math.random(), text: taskText, done: false})
        taskInput.value = ""
        taskInput.focus()
        renderTasks()
    }

})

addBtn.disabled = true

taskInput.addEventListener("input", () => {
    addBtn.disabled = taskInput.value.trim() === ""
})



function renderTasks() {

    taskList.innerHTML = ""

    let completed = tasks.filter(task => task.done).length

    let filteredTasks = tasks

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.done)
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.done)
    }


    filteredTasks.forEach(task => {
        
        // Creates <li> with task inside
        const li = document.createElement("li")
            // Creating span element for texts within li
        const taskTextSpan = document.createElement("span")
        taskTextSpan.textContent = task.text

        const div = document.createElement("div")
        div.classList.add("listButtons")
        // Creates delete button
        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "🗑"

        // Creates edit button
        const editBtn = document.createElement("button")
        editBtn.textContent = "✏️"

        // Click task to strikethrough
        taskTextSpan.addEventListener("click", () => {
            if (isEditing) return
            toggleTask(task.id)
        })

        // Delete button functionality
        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id)
        })

        // Strikethrough for completed tasks
        if(task.done){
            taskTextSpan.classList.add("completed")
        }

        // Edit button functionality
        editBtn.addEventListener("click", () => {
            if (isEditing) return
            const newInput = document.createElement("input")
            newInput.type = "text"
            newInput.value = task.text
            
            li.classList.add("editing")
            li.replaceChild(newInput, taskTextSpan)
            newInput.focus()
            newInput.select()
            isEditing = true

            function saveEdit() {
                const newText = newInput.value.trim()

                if (newText === "") {
                    isEditing = false
                    renderTasks()
                    return
                }
                const t = tasks.find(t => t.id === task.id)
                if (!t) return
                t.text = newText

                isEditing = false
                li.classList.remove("editing")
                renderTasks()
            }

            newInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    saveEdit()
                }

                if (event.key === "Escape") {
                    isEditing = false
                    renderTasks()
                }
            })
            
            newInput.addEventListener("blur", saveEdit)
        })

        
        // Adds new task and delete button to taskList
        li.appendChild(taskTextSpan)
        li.appendChild(div)
        div.appendChild(editBtn)
        div.appendChild(deleteBtn)
        taskList.appendChild(li)
    })

    taskCount.textContent = `${completed} of ${tasks.length} tasks completed`

    clearCompletedBtn.disabled = completed === 0
    clearAllBtn.disabled = tasks.length === 0
    
    localStorage.setItem("savedTasks", JSON.stringify(tasks))
    localStorage.setItem("theme", document.body.classList.contains("dark"))
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    task.done = !task.done
    renderTasks()
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id)
    renderTasks()
}
let isEditing = false

// Dark mode toggle
const themeToggle = document.querySelector("#themeToggle")

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark")
})
