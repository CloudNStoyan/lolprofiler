import React, { useState } from 'react';

function Tooltip({ children }) {
    const [isHovered, setIsHovered] = useState(false);

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type.name === 'TooltipContent') {
            return React.cloneElement(child, { isHovered: isHovered });
        }
        return child;
    });

    return (
        <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {childrenWithProps}
        </div>

    )
}

export default Tooltip;