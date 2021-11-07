import styles from './css/MasteryChamp.module.scss';
import Tooltip from './tooltip/Tooltip';

function MasteryChamp({ champion, mastery }) {
    return (
        <Tooltip className={styles.wrapper} content={champion.name}>
            <span className={styles.level}>{mastery.championLevel}</span>
            <img
                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
            />
            <span className={styles.points}>{Math.round(mastery.championPoints / 1000)}k</span>
        </Tooltip>
    )
}

export default MasteryChamp;