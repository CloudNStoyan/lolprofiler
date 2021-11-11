import styles from './MatchesWinrate.module.scss';

function MatchesWinrate({ profile }) {
    return (
        <div className={styles.wrapper}>
            <h4 className={styles.title}>Win/Lose ratio</h4>
            <div className={styles.container}>
                <div className={`${styles.progress} ${styles.win}`} style={{ width: `${(profile.wins / profile.totalGames) * 100}%` }}>
                    <span>{Math.round((profile.wins / profile.totalGames) * 100)}%</span>
                </div>
                <div className={`${styles.progress} ${styles.lose}`} style={
                    { width: `${100 - ((profile.wins / profile.totalGames) * 100)}%` }
                }>
                    <span>{Math.round((100 - ((profile.wins / profile.totalGames) * 100)))}%</span>
                </div>
            </div>
        </div>
    )
}

export default MatchesWinrate;