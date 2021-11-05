import React from 'react';
import styles from './css/RecentPlayer.module.scss';

function RecentPlayer({ player }) {
    return (
        <div className={styles['recently-summoner']}>
            <button>{player.summonerName}</button>
            <span className={styles.line}></span>
            <span className={styles.times}>{player.times} Games</span>
        </div>
    )
}

export default RecentPlayer;