import React, { useEffect, useRef, useState } from 'react';
import style from './TooltipContent.module.scss';

function TooltipContent({ children, isHovered }) {
    const wrapper = useRef();
    const [direction, setDirection] = useState('');

    useEffect(() => {
        if (isHovered) {
            const boundaries = wrapper.current.getBoundingClientRect();
            const margin = 100;

            if (boundaries.x + boundaries.weight > window.outerWidth - margin) {
                console.log('Overflowing right');
                setDirection('left');
            }

            if (boundaries.y + boundaries.height > window.outerHeight - margin) {
                console.log("Overflowing down");
                setDirection('up');
            }
        }
    }, [isHovered])
    return (isHovered ?
        <div ref={wrapper} className={`${style["outer-wrapper"]} ${style[direction]}`}>
            <div className={style["inner-wrapper"]}>
                {children}
            </div>
        </div>
        : <></>)
}

export default TooltipContent;