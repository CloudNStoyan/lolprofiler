import React, { useState } from 'react';
import styles from './css/SearchSummoner.module.scss';

function SearchSummoner({ onSearch, onFocus, onLoseFocus, summonerName, setSummonerName }) {
    const [disabled, setDisabled] = useState(false);
    const onSubmit = async (e) => {
        e.preventDefault();

        if (disabled) {
            return;
        }

        setDisabled(true);
        await onSearch(summonerName);
        setDisabled(false);
    }

    return (
        <form className={`${styles["search-wrapper"]} ${disabled ? styles["disabled"] : ''}`} onSubmit={onSubmit}>
            <input
                type="text"
                spellCheck="false"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                className={styles["search-input"]}
                onFocus={onFocus}
                onBlur={onLoseFocus}
            />
            <button className={styles["search-btn"]}>
                <i className="fas fa-search" />
            </button>
            <button className={styles["favorite-btn"]}>
                <i className="fas fa-star" />
            </button>
        </form>
    )
}

export default SearchSummoner;