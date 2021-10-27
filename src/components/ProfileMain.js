import React from 'react';
import SectionContainer from './SectionContainer';
import FilterMatches from './FilterMatches';
import MatchesWinrate from './MatchesWinrate';
import MasteryChamp from './MasteryChamp';
import MatchInfo from './MatchInfo';

function ProfileMain({ profile, ddragon, onFilterMatches, onSearch, onLoadMore }) {
    return (
        <div className="main">
            <div className="profile">
                <SectionContainer
                    contentClass="summary"
                >
                    <FilterMatches onFilter={onFilterMatches} />
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
                    contentClass="matches-wrapper"
                    title="Recent Games"
                >
                    {
                        profile.matches.map(
                            match => <MatchInfo
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