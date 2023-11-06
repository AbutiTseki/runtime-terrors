// Global Variables

let list = document.getElementById('list');
let nodes = document.getElementsByClassName('node');
let pointers = document.getElementsByClassName('pointer');
let error = document.getElementById('error');

// Animations Timeouts

let nodeAnimationTimeout;
let pointerAnimationTimeout;
let deleteTimeout;

// 'Private' functions

let errorCircle = '<i class="fa fa-exclamation-circle"></i> ';

function handleEmptyListError() {
    if (nodes.length === 0) {
        error.innerHTML = errorCircle + " List is empty";
        error.firstChild.style.animation = "highlightNode .8s ease"; 
        return true;
    }
    error.innerHTML = null;
    return false;
}

function checkInputErrors(input, type, endsAtLastNode = false) {
    let inputError = false;
    let end = endsAtLastNode ? nodes.length - 1 : nodes.length;

    if (isNaN(input)) {
        error.innerHTML =  errorCircle + type + " must be a number";
        inputError = true;
    }
    else if (type === "Index" && (input > end || input < 0)) {
        error.innerHTML = errorCircle + "Index Out Of Bounds";
        inputError = true;
    }

    if (inputError) 
		error.firstChild.style.animation = "highlightNode .8s ease"; 
    else
        error.innerHTML = null;

    return inputError;
}

function deleteNode(i) {
    return new Promise(resolve => {
        nodes[i].style.animation =
			"deleteNode " + deleteTimeout / 1000 + "s ease";
		pointers[i].style.animation =
			"deletePointer " + deleteTimeout / 1000 + "s ease";
		setTimeout(() => {
			list.removeChild(nodes[i]);
            list.removeChild(pointers[i]);
            resolve();
		}, deleteTimeout);
    });
}

// Public functions

async function add(i, data) {

    if (checkInputErrors(i, "Index") || checkInputErrors(data, "Data"))
        return;

   	// Create DOM Elements

    let node = document.createElement('div');
    node.classList.add('node');
    

    let number = document.createElement('p');
    number.classList.add('number');


    let text = document.createTextNode(data);

    number.appendChild(text);
    node.appendChild(number);

    let pointer = document.createElement('div');
    pointer.classList.add('pointer');
    pointer.style.opacity = "0";

    let img = document.createElement('img');
    img.src = "pointer.png";

    pointer.appendChild(img);

    if (i === nodes.length) {
        list.appendChild(node);
        list.appendChild(pointer);
    }
    else {
        list.insertBefore(pointer, nodes[i]);
        list.insertBefore(node, pointer);
    }

    node.style.animation =
        "grow " +
        nodeAnimationTimeout / 1000 + "s " +
        "ease";

    setTimeout(() => {
        pointer.style.opacity = 1;
        pointer.style.animation =
            "slide " +
            pointerAnimationTimeout / 1000 + "s " +
            "ease";
    }, nodeAnimationTimeout);
}

async function set(i, data) {

    if (checkInputErrors(i, "Index", true) || checkInputErrors(data, "Data"))
        return;

    let numberAnimationTimeOut = 1000;

    nodes[i].firstChild.style.animation =
        "fadeNumberOut " +
        numberAnimationTimeOut / 1000 + "s " +
        "ease";

    setTimeout(() => {
        nodes[i].firstChild.innerHTML = data;
        nodes[i].firstChild.style.animation =
            "fadeNumberIn " +
            numberAnimationTimeOut / 1000 + "s " +
            "ease";
    }, numberAnimationTimeOut);

    setTimeout(() => {
        nodes[i].firstChild.style.animation = null;
    }, numberAnimationTimeOut * 2);
}

async function removeIndex(i) {
    if (handleEmptyListError() || checkInputErrors(i, "Index", true))
        return;

    deleteNode(i);
}

function removeData(data) {
    if (handleEmptyListError() || checkInputErrors(data, "Data"))
        return;

    removeRecursively(0, data);
}

async function removeRecursively(i, data) {
    if (i >= nodes.length) {
        return;
    }
    else if (nodes[i].firstChild.innerHTML == data) {
        await deleteNode(i);
        removeRecursively(i, data);
    }
    else {
		removeRecursively(i + 1, data);
    }
}
