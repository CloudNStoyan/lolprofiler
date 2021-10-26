import React, { useState } from 'react';

function SearchSummoner({ onSearch }) {
    const [summonerName, setSummonerName] = useState('');

    return (
        <div className="search-wrapper">
            <input
                className="empty"
                type="text"
                id="input-name"
                spellCheck="false"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
            />
            <button id="search-btn" onClick={() => onSearch(summonerName)}><i className="fas fa-search" /></button>
            <button className="favorite-btn" href="#"><i className="fas fa-star" /></button>
        </div>
    )
}

export default SearchSummoner;