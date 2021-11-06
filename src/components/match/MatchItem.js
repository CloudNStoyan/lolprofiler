import React from 'react';
import styles from '../css/MatchItems.module.scss';
import Tooltip from '../tooltip/Tooltip';
import TooltipContent from '../tooltip/TooltipContent';

function MatchItem({ itemData }) {
    if (itemData) {
        return (
            // <div className="tooltip-container">
            //     <img className="tooltip" src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/item/${itemData.image.full}`} alt="" />
            //     <div className="tooltip-content">
            //         <span>{itemData.name}</span>
            //         <span className="line"></span>
            //         <div
            //             className={styles["item-description"]}
            //             dangerouslySetInnerHTML={{ __html: itemData.description }}
            //         />
            //     </div>
            // </div>
            <Tooltip>
                <img className="tooltip" src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/item/${itemData.image.full}`} alt="" />
                <TooltipContent>
                    <span>{itemData.name}</span>
                    <span className="line"></span>
                    <div
                        className={styles["item-description"]}
                        dangerouslySetInnerHTML={{ __html: itemData.description }}
                    />
                </TooltipContent>
            </Tooltip>
        )
    }

    return <div><img className={styles["no-image"]} alt="" /></div>
}

export default MatchItem;