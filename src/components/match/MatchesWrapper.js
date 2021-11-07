import MatchWrapper from "./MatchWrapper";
import styles from '../css/MatchesWrapper.module.scss';

function MatchesWrapper({ profile, ddragon, onSearch, onLoadMore }) {
    return (
        <div className={styles.wrapper}>
            {profile.matches.map(
                match => <MatchWrapper
                    matchData={match}
                    summoner={profile.summoner}
                    ddragon={ddragon}
                    key={match.info.gameId}
                    onSearch={onSearch}
                />
            )}
            <button className={`btn ${styles.more}`} onClick={onLoadMore}>Load More</button>
        </div>
    )
}

export default MatchesWrapper;