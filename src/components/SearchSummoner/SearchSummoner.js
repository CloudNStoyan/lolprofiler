import { useState } from 'react';
import styles from './SearchSummoner.module.scss';

function SearchSummoner({ onSearch, onFocus, onLoseFocus, summonerName, setSummonerName, favSummonerName }) {
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

    const searchFavorite = () => onSearch(favSummonerName);

    return (
        <form className={`${styles["search-wrapper"]} ${disabled ? styles["disabled"] : ''}`} onSubmit={onSubmit}>
            <input
                type="text"
                spellCheck="false"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                className={styles["search-input"]}
                tabIndex={-1}
                onFocus={onFocus}
                onBlur={onLoseFocus}
            />
            <button className={styles["search-btn"]}>
                <i className="fas fa-search" />
            </button>
            <button
                className={styles["favorite-btn"]}
                onClick={searchFavorite}
            >
                <i className="fas fa-star" />
            </button>
        </form>
    )
}

export default SearchSummoner;