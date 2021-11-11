import MatchItem from './MatchItem';
import styles from './MatchItems.module.scss';

function MatchItems({ participant, ddragon }) {
    const items = [participant.item0, participant.item1, participant.item2, participant.item6, participant.item3, participant.item4, participant.item5];

    return (
        <div className={styles.items}>
            {items.map((item, index) => <MatchItem key={index} itemData={ddragon.item.data[item]} />)}
        </div>
    )
}

export default MatchItems;