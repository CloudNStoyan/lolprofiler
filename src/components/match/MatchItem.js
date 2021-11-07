import React from 'react';
import styles from '../css/MatchItems.module.scss';
import Tooltip from '../tooltip/Tooltip';

function MatchItem({ itemData }) {
    if (itemData) {
        return (
            <Tooltip content={itemData.name}>
                <img src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/item/${itemData.image.full}`} alt="" />
            </Tooltip>
        )
    }

    return <div><img className={styles["no-image"]} alt="" /></div>
}

export default MatchItem;