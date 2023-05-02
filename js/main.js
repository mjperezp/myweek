// Variables

const fecha = document.querySelector("#fecha");
const input = document.querySelector("#input");
const botonEnter = document.querySelector("#boton-enter");
const check = "bi-check-circle";
const uncheck = "bi-circle";
const lineThrough = "line-through";
const clearAll = document.querySelector("#clear-all-tasks");
const clearTasksDone = document.querySelector("#clear-tasks-done");
const iconTheme = document.querySelector("#theme-icon");
const containerButtonsDelete = document.querySelector(".button-clear--container");


let lista = document.querySelector("#lista");
let id
let LIST
let darkTheme = false;

const title = document.querySelector(".text--title");
const dot = document.querySelector(".dot");
const body = document.querySelector("body");

// Funciones

// Función cambiar tema

function cambiarTema() {
    const sun = document.querySelector("#sun");
    const moon = document.querySelector("#moon");
    const divAgregarTarea = document.querySelector("#div-agregar-tarea");
    const doneTasksIcon = document.querySelector(".done-tasks-icon");
    const inputTask = document.querySelector(".agregar-tarea-input");

    if (darkTheme)
    {
        iconTheme.classList.add("bi-brightness-high")
        iconTheme.classList.remove("bi-moon");
        title.classList.add("perfil--title-dark");
        dot.classList.add("dot-dark");
        body.classList.add("body-dark");
        fecha.classList.add("fecha-dark");
        clearAll.classList.add("clear--button-dark");
        lista.classList.add("ul--dark");
        divAgregarTarea.classList.add("agregar-tarea-dark");
        doneTasksIcon.classList.add("done-tasks-icon-dark");
        inputTask.classList.add("agregar-tarea-input-dark");
        botonEnter.classList.add("boton-enter-dark");
    }
    else {
        iconTheme.classList.add("bi-moon");
        iconTheme.classList.remove("bi-brightness-high")
        title.classList.remove("perfil--title-dark");
        dot.classList.remove("dot-dark");
        body.classList.remove("body-dark");
        fecha.classList.remove("fecha-dark");
        clearAll.classList.remove("clear--button-dark");
        lista.classList.remove("ul--dark");
        divAgregarTarea.classList.remove("agregar-tarea-dark");
        doneTasksIcon.classList.remove("done-tasks-icon-dark");
        inputTask.classList.remove("agregar-tarea-input-dark");
        botonEnter.classList.remove("boton-enter-dark");
    }

    darkTheme = !darkTheme;
};

//// Función fecha actual ////
const fechaActual = new Date();
fecha.innerHTML = fechaActual.toLocaleDateString("es-MX", {weekday: "long", month: "short", day: "numeric"});

//// Función agregar tarea ////

function agregarTarea (tarea, id, realizado, eliminado) {

    if(eliminado) {return}

    const REALIZADO = realizado ? check : uncheck;
    const LINE = realizado ? lineThrough : "";
    const elementoLi = `
                        <li id="elementoLi">
                            <i class="bi ${REALIZADO}" data="realizado" id="${id}"></i>
                            <p class="text ${LINE}">${tarea}</p>
                            <i class="bi bi-x-lg delete--task" data="eliminado" id="${id}"></i>
                        </li>
                        `;
    
    lista.insertAdjacentHTML("beforeend", elementoLi);
    cambiarBotonVaciarVisible(true);
};

//// Función de tarea realizada ////

function tareaRealizada(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector(".text").classList.toggle(lineThrough);
    LIST[element.id].realizado = LIST[element.id].realizado ? false : true;
};

//// Función de tarea eliminada ////
function tareaEliminada(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].eliminado = true
}

function cambiarBotonVaciarVisible(visible) {
    if (visible) {
        containerButtonsDelete.classList.remove("hidden");
    }
    else {
        containerButtonsDelete.classList.add("hidden");
    }
}

// Eventos

iconTheme.addEventListener("click", cambiarTema);

botonEnter.addEventListener("click",()=> {
    const tarea = input.value
    if(tarea) {
        agregarTarea(tarea, id, false, false);
        LIST.push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false
        })
    }
    localStorage.setItem("toDo", JSON.stringify(LIST));

    input.value = "";
    id++;
});

document.addEventListener("keyup", function(event) {
    if(event.key === "Enter"){
        const tarea = input.value
        if(tarea) {
            agregarTarea(tarea, id, false, false)
            LIST.push({
                nombre: tarea,
                id: id,
                realizado: false,
                eliminado: false
            })
        }
        localStorage.setItem("toDo", JSON.stringify(LIST));

        input.value = "";
        id++;
    }
});

lista.addEventListener("click", function(event){
    const element = event.target;
    const elementData = element.attributes.data.value;

    if(elementData === "realizado"){
        tareaRealizada(element);
    } else if (elementData === "eliminado") {
        tareaEliminada(element);
    }
    localStorage.setItem("toDo", JSON.stringify(LIST));
});

////////////////////// Vaciar todas las tareas

clearAll.addEventListener("click", borrarTareas); 

clearTasksDone.addEventListener("click", borrarTareasHechas);

function borrarTareas() {
    let tasksList = lista.getElementsByTagName("li");
    
    const totalElements = tasksList.length;

    for (var i = totalElements - 1; i >= 0; i--) {
        tareaEliminada(tasksList[i].querySelector("i"));
    }
    
    cambiarBotonVaciarVisible(false);
};

//// Vaciar tareas hechas

function borrarTareasHechas() {
    let tasksDoneList = lista.getElementsByTagName("p");

    const totalElements = tasksDoneList.length;

    for (var i = totalElements - 1; i >= 0; i--) {
        
        // Comprobar las que son tachadas
        if(tasksDoneList[i].classList.contains("line-through"))
        {
            tareaEliminada(tasksDoneList[i].parentNode.querySelector("i"));
        }
    }
}

// Local Storage

let data = localStorage.getItem("toDo");
if(data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    cargarLista(LIST);
} else {
    LIST = [];
    id = 0;
};

function cargarLista(DATA) {
    DATA.forEach(function(i){
        agregarTarea(i.nombre, i.id, i.realizado, i.eliminado);
    })
};