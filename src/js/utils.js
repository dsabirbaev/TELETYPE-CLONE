
///////////////// For  selecting single element

function $(selector){
    return document.querySelector(selector);
}

///////////////// For  selecting all elements

function $$(selector){
    return document.querySelectorAll(selector);
}


///////////////// For creating element

function createElement(element, classList, content){
    const newElement = document.createElement(element);

    if(classList){
        newElement.setAttribute('class', classList);
    }   
    if(content){
        newElement.innerHTML = content;
    }
    
    return newElement;
}


/// ------- T JSON ---------------------------

function TO_JSON(obj){
    return JSON.stringify(obj)
}

function TO_OBJECT(json){
   return JSON.parse(json)
}

/// -------- SAVE LOCALSTORAGE -----------------

function saveStorage(key,value){
    if(value){
        localStorage.setItem(key,value)
    }

}


function getStorage(key){
 
     return  localStorage.getItem(key)
    
}


export {$, $$, createElement}