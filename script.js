//Add items to list via form
//Remove items from list by clicking the "X" button
// clear all the items with "clear" button
// filter the items by typing in the filter field 
// add localStorage to persist items
// click on items to put into "edit mode" and add to form
// update item
// deploy to netlify


const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.forEach((item) => addItemToDOM(item));

    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();


    const newItem = itemInput.value;


    //validate input
    if(newItem === '') {
        alert('please add an item');
        return;
    }


    //check for edit mode

    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();

        isEditMode = false;
    }

    else {
        if(checkIfItemExists(newItem)) {
            alert('That item already Exists !');
            return;
        }
    }

   //create item DOM element
    addItemToDOM(newItem);

    //add item to storage
    addItemToStorage(newItem);

    checkUI();
    itemInput.value = '';
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToDOM(item) {
    //create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);


    //Add li to the DOM
    itemList.appendChild(li);
}

function addItemToStorage(item) {

    itemsFromStorage = getItemFromStorage();

    //add new item to array
    itemsFromStorage.push(item);


    //convert to json sting and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    }
    else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemFromStorage = getItemFromStorage();
    
    return itemFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));


    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"> </i> Update Item' ;
    formBtn.style.backgroundColor = '#228822';
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if(confirm('Are you sure ?')) {
        //remove Item from DOM
        item.remove();

         //remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
    }  
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    //filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);


    //reset to localstoarge
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function clearItems() {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    //clear from local storage
    localStorage.removeItem('items');

    checkUI();
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    

    items.forEach((item) => {
       const itemName = item.firstChild.textContent.toLowerCase();
       

       if( itemName.indexOf(text) != -1) {
        item.style.display = 'flex';
       }
       else {
        item.style.display = 'none';
       }
    }); 
}
//function to remove Clear button and filter button is the list is empty

function checkUI() {

    itemInput.va;lue = '';


    const items = itemList.querySelectorAll('li');
    if(items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }


    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

//initialization app 
function init() {
//Event Listeners

itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded' , displayItems);

checkUI();
}


init();