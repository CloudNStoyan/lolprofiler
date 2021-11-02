import React from 'react';
import utils from '../../utils';
import styles from '../css/MatchInfo.module.scss';

function MatchInfo({ matchData, team }) {
    const queue = utils.constants.queues.find(q => q.id === matchData.info.queueId);
    const now = Date.now();
    const gameDate = utils.longAgo(now - matchData.info.gameCreation - matchData.info.gameDuration);

    return (
        <div className={styles['match-info']}>
            <div className="tooltip-container">
                <div className="tooltip">{queue.name}</div>
                <span className="tooltip-content">{queue.tooltip}</span>
            </div>
            <div className="tooltip-container">
                <div className="tooltip">{gameDate}</div>
                <span className="tooltip-content">{utils.dateToCustomString(new Date(matchData.info.gameCreation))}</span>
            </div>
            <div className={`${styles.result} ${team.win ? styles.victory : styles.defeat}`}>{team.win ? 'Win' : 'Defeat'}</div>
            <div>{utils.dateToGameLength(matchData.info.gameDuration)}</div>
        </div>
    )
}

export default MatchInfo;