import utils from '../../utils';
import styles from '../css/MatchInfo.module.scss';
import Tooltip from '../tooltip/Tooltip';

function MatchInfo({ matchData, team }) {
    const queue = utils.constants.queues.find(q => q.id === matchData.info.queueId);
    const now = Date.now();
    const gameDate = utils.longAgo(now - matchData.info.gameCreation - matchData.info.gameDuration);

    return (
        <div className={styles['match-info']}>
            <Tooltip content={queue.tooltip}>{queue.name}</Tooltip>
            <Tooltip content={utils.dateToCustomString(new Date(matchData.info.gameCreation))}>
                {gameDate}
            </Tooltip>
            <div className={`${styles.result} ${team.win ? styles.victory : styles.defeat}`}>{team.win ? 'Win' : 'Defeat'}</div>
            <div>{utils.dateToGameLength(matchData.info.gameDuration)}</div>
        </div>
    )
}

export default MatchInfo;