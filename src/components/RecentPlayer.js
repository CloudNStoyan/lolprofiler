import React from 'react';
import styles from './css/RecentPlayer.module.scss';

function RecentPlayer({ player, onSearch }) {
    const handleClick = () => onSearch(player.summonerName);
    return (
        <div className={styles['recently-summoner']}>
            <button onClick={handleClick}>{player.summonerName}</button>
            <span className={styles.line}></span>
            <span className={styles.times}>{player.times} Games</span>
        </div>
    )
}

export default RecentPlayer;