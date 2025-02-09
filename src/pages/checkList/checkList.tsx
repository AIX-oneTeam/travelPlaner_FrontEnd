import React, { useState, useEffect } from "react";
import styles from "./CheckList.module.css";

function CheckList() {
    const [items, setItems] = useState<{ text: string; id: number; checked: boolean }[]>([]);

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        saveItems();
    }, [items]);

    const loadItems = () => {
        const savedItems = localStorage.getItem("checklist");
        if (savedItems) {
            const parsedItems = JSON.parse(savedItems);
            if (parsedItems.length > 0) {
                setItems(parsedItems);
            } else {
                setItems([{ text: "", id: 0, checked: false }]);
            }
        } else {
            setItems([{ text: "", id: 0, checked: false }]);
        }
    };

    const saveItems = () => {
        localStorage.setItem("checklist", JSON.stringify(items));
    };

    const handleEditItem = (index: number, newText: string) => {
        const updatedItems = [...items];
        updatedItems[index].text = newText;
        setItems(updatedItems);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
            const newItem = { text: "", id: Date.now(), checked: false };
            setItems([...items, newItem]);
            e.currentTarget.blur();
        } else if (e.key === "Backspace" && items[index].text === "" && items.length > 1) {
            e.preventDefault();
            const updatedItems = [];
            for (let i = 0; i < items.length; i++) {
                if (i !== index) {
                    updatedItems.push(items[i]);
                }
            }
            setItems(updatedItems);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedItems = [...items];
        updatedItems[index].text = e.target.value;
        setItems(updatedItems);
    };

    const handleDelete = (index: number) => {
        if (items.length > 1) {
            const updatedItems = [];
            for (let i = 0; i < items.length; i++) {
                if (i !== index) {
                    updatedItems.push(items[i]);
                }
            }
            setItems(updatedItems);
        } else {
            setItems([{ text: "", id: Date.now(), checked: false }]);
        }
    };

    const handleCheckboxChange = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index].checked = !updatedItems[index].checked;
        setItems(updatedItems);
    };

    return (
        <div className={styles.checkList_container}>
            <div className={styles.checkList_header_container}>
                <div className={styles.checkList_header_contents}>
                    <div className={styles.checkList_header_title}>
                        <div>Check List</div>
                    </div>
                    <button className={styles.checkList_header_close_button}>
                        <img
                            className={styles.checkList_header_close_button_img}
                            src="/icons/close_gray.jpg"
                            alt="close icon"
                        />
                    </button>
                </div>
            </div>
            <div className={styles.checkList_main_container}>
                <div className={styles.checkList_main_contents}>
                    {items.map((item, index) => (
                        <div key={item.id} className={styles.checkList_main_content}>
                            <input 
                                type="checkbox" 
                                id={`checkbox-${index}`} 
                                checked={item.checked}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <input
                                type="text"
                                value={item.text}
                                placeholder={items.length === 1 && index === 0 ? "추가 항목을 입력해주세요" : ""}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onChange={(e) => handleChange(e, index)}
                                onBlur={() => handleEditItem(index, item.text)}
                            />
                            <span onClick={() => handleDelete(index)}>삭제</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CheckList;
