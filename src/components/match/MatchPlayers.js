import React from 'react';
import MatchPlayer from "./MatchPlayer"
import styles from '../css/MatchPlayers.module.scss';

function MatchPlayers({ matchData, onSearch, ddragon }) {
    const teamIds = [100, 200];
    return (
        <div className={styles.players}>
            {teamIds.map(teamId => (
                <div className={styles.team}>
                    {matchData.info.participants.filter(p => p.teamId === teamId).map((p, i) => <MatchPlayer onSearch={onSearch} key={i} participant={p} ddragon={ddragon} />)}
                </div>
            ))}
        </div>
    )
}

export default MatchPlayers;