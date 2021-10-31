import React, { useEffect, useState } from 'react';

function Toast({ id, text, onDone }) {
    const [expire, setExpire] = useState(5);
    const [isDone, setIsDone] = useState(false);

    const expired = expire === 0;

    useEffect(() => {
        if (isDone) {
            onDone(id);
            return;
        }

        if (expired) {
            const timeout = setTimeout(() => {
                setIsDone(true);
            }, 250);

            return () => clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            setExpire(expire - 1);
        }, 1000)

        return () => clearTimeout(timeout);
    });

    return (
        <div className={`toast ${expired ? 'hide' : ''} ${isDone ? 'done' : ''}`}>
            <div className="content">
                {text}
            </div>
        </div>
    )
}

export default Toast;