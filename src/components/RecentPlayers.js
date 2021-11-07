import RecentPlayer from "./RecentPlayer";
import styles from './css/RecentPlayers.module.scss';

function RecentPlayers({ profile, onSearch }) {
    return (
        <div className={styles.wrapper}>
            {profile.recentlyPlayedWith.filter(p => p.times > 1).map(p => <RecentPlayer onSearch={onSearch} key={p.summonerName} player={p} />)}
        </div>
    )
}

export default RecentPlayers;