import React from 'react';

function MatchItem({ itemData }) {
    if (itemData) {
        return (
            <div className="tooltip-container">
                <img className="tooltip" src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/item/${itemData.image.full}`} alt="" />
                <div className="tooltip-content">
                    <span>{itemData.name}</span>
                    <span className="line"></span>
                    <div
                        className="item-description"
                        dangerouslySetInnerHTML={{ __html: itemData.description }}
                    />
                </div>
            </div>
        )
    }

    return <div><img className="no-image" alt="" /></div>
}

export default MatchItem;