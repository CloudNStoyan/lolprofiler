import utils from "../utils";
import styles from './css/FilterMatches.module.scss';

function FilterMatches({ onFilter, selectValue, setSelectValue }) {
    const handleChange = (e) => {
        const gameType = e.target.value;
        setSelectValue(gameType);
        onFilter(gameType);
    }

    return (
        <div className={styles.wrapper}>
            <select
                onChange={handleChange}
                value={selectValue}
            >
                <option value="-1">Match Type: All</option>
                {utils.constants.queues.filter(q => q.showInSelect).map(q => <option value={q.id} key={q.id}>Match Type: {q.name}</option>)}
            </select>
        </div>
    )
}

export default FilterMatches;