import React from 'react';
import Toast from './Toast';

function ToastContainer({ toasts, onDone }) {
    return (
        <div className="toast-container">
            {toasts.map(t => <Toast id={t.id} key={t.id} text={t.text} onDone={onDone} />)}
        </div>
    )
}

export default ToastContainer;