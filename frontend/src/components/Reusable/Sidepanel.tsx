import React from 'react';

const SidePanel = ({isOpen, onClose, children}) => {
    return (
        <div className= {`side-panel ${isOpen? 'open' : '' }`}>
            <div className = 'side-panel-content'>
                <button onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    )
};

export default SidePanel;