import React, { useState } from 'react';

function SearchSummoner({ onSearch }) {
    const [summonerName, setSummonerName] = useState('');
    const onSubmit = (e) => {
        e.preventDefault();
        onSearch(summonerName);
    }

    return (
        <form className="search-wrapper" onSubmit={onSubmit}>
            <input
                className="empty"
                type="text"
                id="input-name"
                spellCheck="false"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
            />
            <button id="search-btn"><i className="fas fa-search" /></button>
            <button className="favorite-btn" href="#"><i className="fas fa-star" /></button>
        </form>
    )
}

export default SearchSummoner;