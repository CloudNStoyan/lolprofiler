import React from 'react';
import SectionContainer from './SectionContainer';
import FilterMatches from './FilterMatches';
import MatchesWinrate from './MatchesWinrate';
import MasteryChamp from './MasteryChamp';
import MatchWrapper from './match/MatchWrapper';
import styles from '../App.module.scss';

function ProfileMain({ profile, ddragon, onFilterMatches, onSearch, onLoadMore, filterQueueId, setFilterQueueId }) {
    return (
        <div className={styles.main}>
            <div>
                <SectionContainer
                    contentClass="summary"
                >
                    <FilterMatches onFilter={onFilterMatches} selectValue={filterQueueId} setSelectValue={setFilterQueueId} />
                    <MatchesWinrate profile={profile} />
                </SectionContainer>
                <SectionContainer
                    sectionClass="mastery-wrapper"
                    contentClass="mastery"
                    title="Champion Mastery"
                >
                    {
                        profile.masteries.map(
                            mastery => <MasteryChamp
                                mastery={mastery}
                                champion={ddragon.champion.find(champ => Number(champ.key) === mastery.championId)}
                                key={mastery.championId}
                            />
                        )
                    }
                </SectionContainer>
                <SectionContainer
                    sectionClass="recent-games"
                    contentClass={styles["matches-wrapper"]}
                    title="Recent Games"
                >
                    {
                        profile.matches.map(
                            match => <MatchWrapper
                                matchData={match}
                                summoner={profile.summoner}
                                ddragon={ddragon}
                                key={match.info.gameId}
                                onSearch={onSearch}
                            />
                        )
                    }
                    <button className="btn load-more-btn" onClick={onLoadMore}>Load More</button>
                </SectionContainer>
            </div>
        </div>
    )
}

export default ProfileMain;