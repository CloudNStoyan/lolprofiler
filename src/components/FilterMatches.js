import utils from "../utils";
import React, { useState } from 'react';

function FilterMatches({ onFilter }) {

    const [selectValue, setSelectValue] = useState('-1');

    const handleChange = (e) => {
        setSelectValue(e.target.value)
    }

    return (
        <div className="filter-container">
            <select
                className="select game-type"
                onChange={handleChange}
                value={selectValue}
            >
                <option value="-1">All</option>
                {utils.constants.queues.filter(q => q.showInSelect).map(q => <option value={q.id} key={q.id}>{q.name}</option>)}
            </select>
            <button className="btn filter-btn" href="#" onClick={() => onFilter(selectValue)}>Filter</button>
        </div>
    )
}

export default FilterMatches;