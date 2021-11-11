import MasteryChamp from "./MasteryChamp";
import styles from './MasteryChamps.module.scss';

function MasteryChamps({ profile, ddragon }) {
    return (
        <div className={styles.wrapper}>
            {
                profile.masteries.map(
                    mastery => <MasteryChamp
                        mastery={mastery}
                        champion={ddragon.champion.find(champ => Number(champ.key) === mastery.championId)}
                        key={mastery.championId}
                    />
                )
            }
        </div>
    )
}

export default MasteryChamps;