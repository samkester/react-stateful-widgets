import React, {useState} from 'react';

export default function Todo() {
    const [todoItems, setTodoItems] = useState([]);
    const [nextID, setNextID] = useState(0);

    function addItem(description){
        // creates a new array (using the spread operator) consisting of everything in todoItems, plus the new item
        setTodoItems([...todoItems, {description: description, id: registerNextID()}]);
        console.log(todoItems);
    }

    function removeItem(description){
        // This is React-safe because .filter() returns a new array; todoItems is unaffected
        setTodoItems(todoItems.filter(item => item.description !== description));
    }

    function addItemFromInput(){
        const input = document.querySelector("#todo-input");
        if(input.value === "") return;
        console.log(input.value);
        addItem(input.value);
        input.value = "";
    }

    function registerNextID(){
        const id = nextID;
        setNextID(id + 1);
        return id;
    }

    return (
        <div className='widget-squares container'>
            <h2>Todo List</h2>
            <input type='text' id="todo-input"/> {/* STEP 6 */}
            <button onClick = {addItemFromInput}>Add</button>
            {
                todoItems.map(item =>
                    <div key={item.id}>
                        {item.description}
                        <button>Remove</button>
                    </div>
                    )
            }
        </div>  
    )
}