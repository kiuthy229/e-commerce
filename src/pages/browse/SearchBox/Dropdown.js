import { useState } from 'react';
import { FaCaretDown } from "react-icons/fa";
import './Dropdown.css';

export function Dropdown ({selected, setSelected}) {
    const [isActive, setIsActive] = useState(false);
    const options = ['Dresses','T-shirts','Pants','Skirts','Jeans']
    return (
        <div className="dropdown">
            <h4>Categories</h4>
            <div className="dropdown-btn" onClick={(e) => 
                setIsActive(!isActive)}>{selected}
            <span className="caret-down"><FaCaretDown/></span>
            </div>
            {isActive && (
            <div className="dropdown-content">
                {options.map((option) => (
                    <div onClick={(e) => {
                        setSelected(option);
                        setIsActive(false); 
                    }}
                    className="dropdown-item">{option}
                    </div>
                ))}
            </div>
            )}
        </div>
    )
};
