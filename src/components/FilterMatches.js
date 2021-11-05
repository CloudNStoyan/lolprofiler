import utils from "../utils";
import React from 'react';

function FilterMatches({ onFilter, selectValue, setSelectValue }) {
    const handleChange = (e) => {
        const gameType = e.target.value;
        setSelectValue(gameType);
        onFilter(gameType);
    }

    return (
        <div className="filter-container">
            <select
                className="select game-type"
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