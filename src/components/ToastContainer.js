import React from 'react';
import Toast from './Toast';

function ToastContainer({ toasts }) {
    return (
        <div className="toast-container">
            {toasts.map(t => <Toast toast={t} />)}
        </div>
    )
}

export default ToastContainer;