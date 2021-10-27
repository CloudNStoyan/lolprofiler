import React from 'react';

function Toast({ toast }) {
    return (
        <div className="toast">
            <div className="content">
                {toast.text}
            </div>
        </div>
    )
}

export default Toast;