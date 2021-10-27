import React from 'react';
import MasteryChamp from './MasteryChamp';
import MatchInfo from './MatchInfo';
import FilterMatches from './FilterMatches';

function ProfileInfo({ profile, ddragon, onLoadMore }) {
    return (
        <>
            <div className="aside">
                <h2 className="profile-name">{profile.summoner.name}</h2>
                <div className="profile-icon">
                    <a href="#" className="spectate-badge" />
                    <img
                        className="img-loaded"
                        style={{ width: 200, height: 200 }}
                        src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/profileicon/${profile?.summoner?.profileIconId}.png`}
                        alt="" />
                    <div className="profile-footer">
                        <div className="profile-level">{profile.summoner.summonerLevel}</div>
                    </div>
                </div>
                <div className="section">
                    <div className="section-header">
                        <span className="section-title">Rank</span>
                        <span className="section-line" />
                    </div>
                    <div className="section-content rank-wrapper">
                    </div>
                </div>
                <div className="section">
                    <div className="section-header">
                        <span className="section-title">Recently Played With</span>
                        <span className="section-line" />
                    </div>
                    <div className="section-content recently-wrapper">
                    </div>
                </div>
            </div>
            <div className="main">
                <div className="profile">
                    <div className="section summary-wrapper">
                        <div className="section-header">
                            <span className="section-title">Summary</span>
                            <span className="section-line" />
                        </div>
                        <div className="section-content summary">
                            <div className="filter-container">
                                <FilterMatches />
                                <a className="btn filter-btn" href="#">Filter</a>
                            </div>
                            <div className="winratio-container">
                                <h4 className="winratio-title">Win/Lose ratio</h4>
                                <div className="summary-progress">
                                    <div className="progress win" style={{ width: `${(profile.wins / profile.totalGames) * 100}%` }}>
                                        <span>{(profile.wins / profile.totalGames) * 100}%</span>
                                    </div>
                                    <div className="progress lose" style={
                                        { width: `${100 - ((profile.wins / profile.totalGames) * 100)}%`, color: 'red;' }
                                    }>
                                        <span>{100 - ((profile.wins / profile.totalGames) * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section mastery-wrapper">
                        <div className="section-header">
                            <span className="section-title">Champion Mastery</span>
                            <span className="section-line" />
                        </div>
                        <div className="section-content mastery">
                            {
                                profile.masteries.map(mastery => <MasteryChamp
                                    mastery={mastery}
                                    champion={ddragon.champion.find(champ => Number(champ.key) === mastery.championId)}
                                />)}
                        </div>
                    </div>
                    <div className="section recent-games">
                        <div className="section-header">
                            <span className="section-title">Recent Games</span>
                            <span className="section-line" />
                        </div>
                        <div className="section-content matches-wrapper">
                            {
                                profile.matches.map((match) =>
                                    <MatchInfo
                                        matchData={match}
                                        summoner={profile.summoner}
                                        ddragon={ddragon}
                                    />)
                            }
                            <button className="btn load-more-btn" onClick={onLoadMore}>Load More</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileInfo;