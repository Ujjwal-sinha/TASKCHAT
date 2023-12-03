import React, { useEffect, useState } from 'react';
import Add from '../../../../../node_modules/@material-ui/icons/Add';
import { form_backend } from '../../../../declarations/form_backend';
import {useNavigate} from 'react-router-dom';
import './Todo.css';

function Todo() {
    const [value, setValue] = useState();
    const [isClicked, setIsClicked] = useState(false);
    const [getPendingList, setPendingList] = useState([]);
    const [getCompletedList, setCompletedList] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const handleChange = async (e) => {
        setValue(e.target.value);
    }
    const handleClick = async (e) => {
        if (e.target.value != "") {
            form_backend.addinPendingList(value);
            setValue("");
            const getPendingList1 = await form_backend.getPendingtodo();
            setPendingList(getPendingList1);
        }
    };

    const handleShift = (e, index) => {
        console.log(e.target.previousSibling.innerText);
        form_backend.addinCompletedList(e.target.previousSibling.innerText);
        setIsClicked(!isClicked);
        const updatedCheckedItems = [...checkedItems];
        updatedCheckedItems[index] = true;
        setCheckedItems(updatedCheckedItems);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const getPendingList1 = await form_backend.getPendingtodo();
                const getCompletedList1 = await form_backend.getCompletedtodo();
                setPendingList(getPendingList1);
                setCompletedList(getCompletedList1);
                setCheckedItems(new Array(getPendingList1.length).fill(false));
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [isClicked]);

    const navigate = useNavigate();

    return (
        <div id="todoList">
            <div id="todol">
                <h1>To-Do List</h1>
                <button type="button" onClick={() => navigate("/")} id="logout">Log Out</button>
            </div>
            <div id="todo">
                <div id="todo1">
                    <div id="tleft">
                        <header>Pending Tasks</header>
                        <div id="pending">
                            {getPendingList.map((item, index) => (
                                <div id="plist" key={index}><p>{item}</p>
                                    <input type="checkbox" onClick={(e) => handleShift(e, index)} checked={checkedItems[index]} />
                                </div>
                            ))}
                        </div>
                        <div id="add">
                            <input type="text" onChange={handleChange} value={value} placeholder='Enter Task'></input>
                            <button type="button" onClick={handleClick}><Add /></button>
                        </div>
                    </div>
                    <div id="tright">
                        <header>Completed Tasks</header>
                        <div id="completed">
                            {getCompletedList.map((item, index) => (
                                <div id="clist" key={index}>{item}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;