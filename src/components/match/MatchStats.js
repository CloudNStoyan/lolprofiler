import React from "react";
import styles from '../css/MatchStats.module.scss';

function MatchStats({ matchData, participant, participants }) {
    const teamKills = participants.filter((p) => p.teamId === participant.teamId).map(x => x.kills).reduce((a, b) => a + b, 0);
    const killPercentage = Math.round(((participant.kills + participant.assists) / teamKills) * 100);
    const creepScore = participant.totalMinionsKilled + participant.neutralMinionsKilled;

    const csPerMinute = Math.round(creepScore / (matchData.info.gameDuration / 60) * 10) / 10;

    return (
        <div className={styles.stats}>
            <div>Level {participant.champLevel}</div>
            <div>{creepScore} ({csPerMinute}) CS</div>
            <div className={styles["kill-percentage"]}>P/Kill {killPercentage}%</div>
        </div>
    )
}

export default MatchStats;