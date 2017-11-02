// Seed the data store

var todos = [
    {'id':'1','content':'This is my first todo.'},
    {'id':'2','content':'This is my second todo.'},
    {'id':'3','content':'This is my third todo.'},
    {'id':'4','content':'This is my fourth todo.'},
    {'id':'5','content':'This is my fifth todo.'}
];

// Init some globals

var w, d, b;
var startX, startY, endX, endY, deltaX, deltaY;
var maxDeltaY = 20;
var minDeltaX = 40;
var todoWasCreated = false;
var userIsTyping = false;
var inputWithFocus = false;

//Define event Handlers

function handleFocus(e){
    userIsTyping = true;
    inputWithFocus = e.target;
}

function handleBlur(e){
    userIsTyping = false;
}

function handleChange(e){
    var id = e.target.getAttribute('data-id');
    for(var i = 0; i < todos.length; i++) {
        if (todos[i].id === id){
            todos[i].content = e.target.value;
            break;
        }
    }
}


function handleTouchStart(e){
    if(e.touches.length === 1){
        var touch = e.touches[0];
        startX = touch.pageX;
        startY = touch.pageY;
        deltaX = 0;
        deltaY = 0;
    }
}

function handleTouchMove(e){
    if(e.touches.length === 1){
            var touch = e.touches[0];
            endX = touch.pageX;
            endY = touch.pageY;
            deltaX = endX -startX;
            deltaY = endY - startY;
        }

}

function handleTouchEnd(e) {
    if(e.touches.length === 0){//User just took last finger off screen
        if(Math.abs(deltaY) < maxDeltaY) {//User didn't move finger much up or down
            if(deltaX > minDeltaX){//User  moved finger significantly right
                if(!userIsTyping) {
                    deleteTodo(e.target);
                }
                } else if (deltaX < 0-minDeltaX) {//User moved finger significantly left
                if(!userIsTyping) {
                    undeletedTodo(e.target);
                }
                }else {
                //user tapped
                if(e.target.tagName === 'TEXTAREA') {
                    //Default click behavior will take place(cursor focus in textarea)
                } else if(e.target.tagName === 'BODY') {
                    createTodo();//calling createTodo with no params will default to append to the end of the list

                }

            }

        }

    }

}

function handleGestureStart(e){
    e.preventDefault();
}

function handleGestureChange(e){
    if(e.scale > 1){// User pinched open(spread or zoom)
        if(!todoWasCreated){
            todoWasCreated = true;
            createTodo(0);// Create todo at the top of the list
        }

    } else if(e.scale < 1){// User pinched closed
        inputWithFocus.blur();

    }
}

function handleGestureEnd(e){
    todoWasCreated = false;
}


// Data and DOM manipulation functions

function createTodo(index) {
    var todo = {'id': new Date().getTime(), 'content': ''};
    if(index === undefined){//No index was passed into this function
        todos.push(todo); //Append new todo to the end of the data store
        index = todos.length;
    } else {
        todos.splice(index, 0, todo);//insert new todo at position defined by index
    }
    element = renderTodo(todo, index);//Insert new todo into the Dom at position defined by index
    element.focus();//Put the cursor in the new textarea
}

function deleteTodo(element){
    if(element.tagName === 'TEXTAREA'){//Make sure event took place on textarea
        var id = element.getAttribute('data-id');//Grab the id so we can remove from the array
        for(var i = 0; i < todos.length; i++) { //find todo in the array
            if(todos[i].id === id){
            var deletedTodo = todos.splice(i,1)[0];// Remove from the data store
                element.className = 'deleted';// Apply the appropriate css class to the element
                setTimeout(function(element){ // Pause
                    element.parentNode.removeChild(element);// Remove the element from the DOM

                }, 300, element);
                break; // Stop looping
            }
        }

    }
}
function renderTodo(todo, index, classname){

    var t = d.createElement('textarea');

    t.value = todo.content;
    t.setAttribute('data-id', todo.id);
    t.className = classname || '';
    var elements = d.getElementsByTagName('textarea');

if(elements.length === 0){ // There are no textareas on the page
    b.appendChild(t);//just append to the body

}else {
    b.insertBefore(t, elements[index]);//Render before element identified by index
}
return t; //Return element to the calling function in case it needs to act on it
}


function renderTodos(){
    b.innerHTML = '';
    for (var i = 0; i < todos.length; i++){
        renderTodo(todos[i], i);
    }
}

function undeletedTodo(swipedElement){
    if(deleteTodo.length){ //Make sure there is at least one deleted todo
        var id = swipedElement.getAttribute('data-id');// Get the id of the swiped DOM element
        var index = todos.length;//undeleted to the end of the list by default
        for(var i = 0; i < todos.length; i++){// Try to find index of swiped element
            if(todos[i].id === id){
                index = i;
                break;
            }

        }

        var undeletedTodo = deletedTodos.pop(); // Get and remove the most recently deleted todo from the stack
        todos.splice(index, 0, undeletedTodo);// Insert the undeleted todo into the data store at position determined by index
        var element = renderTodo(undeletedTodo, index, 'deleted');// Add to the DOM
        setTimeout(function(element){// Pause
            element.className = '';// Remove class name

        }, 10, element);

    }
}

// Let's rock
window.onload = function(){

    //Cache some common elements globally

    w = window;
    d = document;
    b = d.body;

    // Attach event handlers
    b.addEventListener('change', handleChange, false);
    b.addEventListener('touchstart', handleTouchStart, false);
    b.addEventListener('touchmove', handleTouchMove, false);
    b.addEventListener('touchend', handleTouchEnd, false);
    b.addEventListener('gesturestart', handleGestureStart, false);
    b.addEventListener('gesturechange', handleGestureChange, false);
    b.addEventListener('gestureend', handleGestureEnd, false);
    b.addEventListener('focus', handleFocus, true);
    b.addEventListener('blur', handleBlur, false);

    //Render any existing todos

    renderTodos();
};
// Not finished !!!!!!!!!!!!