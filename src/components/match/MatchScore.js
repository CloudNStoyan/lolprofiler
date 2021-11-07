import styles from '../css/MatchScore.module.scss';
import Tooltip from '../tooltip/Tooltip'

function MatchScore({ participant, participants }) {
    const damage = participant.totalDamageDealtToChampions;
    const maxDamage = Math.max(...participants.map(x => x.totalDamageDealtToChampions));
    const damagePercentage = Math.round((damage / maxDamage) * 100);

    return (
        <div className={styles.score}>
            <div>{participant.kills} / <span className={styles.deaths}>{participant.deaths}</span> / {participant.assists}</div>
            <div>{participant.deaths === 0 ? 'Perfect KDA' : `${((participant.kills + participant.assists) / participant.deaths).toFixed(2)}:1 KDA`}</div>
            <Tooltip content="Total damage done to champions">
                <div className={styles["damage-meter"]}>
                    <div className={styles.damage} style={{ width: `${damagePercentage}%` }}>{Math.round(damage / 1000)}K</div>
                </div>
            </Tooltip>
        </div>
    )
}

export default MatchScore;