import MatchPlayer from "./MatchPlayer"
import styles from './MatchPlayers.module.scss';

function MatchPlayers({ matchData, onSearch, ddragon }) {
    const teamIds = [100, 200];
    return (
        <div className={styles.players}>
            {teamIds.map(teamId => (
                <div className={styles.team} key={teamId}>
                    {matchData.info.participants.filter(p => p.teamId === teamId).map((p, i) =>
                        <MatchPlayer
                            onSearch={onSearch}
                            key={i}
                            participant={p}
                            ddragon={ddragon}
                        />)}
                </div>
            ))}
        </div>
    )
}

export default MatchPlayers;