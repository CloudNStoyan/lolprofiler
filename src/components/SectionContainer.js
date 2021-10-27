import React from 'react';

function SectionContainer({ children, sectionClass, contentClass, title }) {
    return (
        <div className={`section ${sectionClass}`}>
            <div className="section-header">
                <span className="section-title">{title}</span>
                <span className="section-line" />
            </div>
            <div className={`section-content ${contentClass}`}>
                {children}
            </div>
        </div>
    )
}

export default SectionContainer;