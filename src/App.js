import './App.css';
import SearchSummoner from './components/SearchSummoner';
import React, { useState } from 'react';
import RiotClient from './api/RiotClient';
import MasteryChamp from './components/MasteryChamp';

function App() {
  const riotClient = new RiotClient({})
  const [containerState, setContainerState] = useState('hide');
  const [summoner, setSummoner] = useState({});
  const [masteries, setMasteries] = useState([]);

  const changeContainerState = async (summonerName) => {
    const [status, data] = await riotClient.Summoner.getByName(summonerName);
    console.log(status, data);
    setSummoner(data);
    setContainerState('profile-loaded')

    const [masteriesStatus, masteriesData] = await riotClient.Mastery.getMasteriesBySummonerId(data.id);
    setMasteries(masteriesData.slice(0, 10));
  }

  return (
    <>
      <div className={`container ${containerState}`}>
        <div className="header">
          <div className="header-content">
            <SearchSummoner onSearch={changeContainerState} />
            <div className="right-nav">
              <a className="settings-btn" href="#" alt="Settings"><i className="fas fa-cog" /></a>
            </div>
          </div>
        </div>
        <div className="aside">
          <h2 className="profile-name">{summoner.name}</h2>
          <div className="profile-icon">
            <a href="#" className="spectate-badge" />
            <img className="img-loaded" style={{ width: 200, height: 200 }} src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/profileicon/${summoner.profileIconId}.png`} alt="" />
            <div className="profile-footer">
              <div className="profile-level">{summoner.summonerLevel}</div>
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
                  <select className="select game-type" />
                  <a className="btn filter-btn" href="#">Filter</a>
                </div>
                <div className="winratio-container">
                  <h4 className="winratio-title">Win/Lose ratio</h4>
                  <div className="summary-progress">
                    <div className="progress win">
                      <span />
                    </div>
                    <div className="progress lose">
                      <span />
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
                {masteries.map(mastery => <MasteryChamp points={mastery.championPoints} image={'http://placehold.it/80'} />)}
              </div>
            </div>
            <div className="section recent-games">
              <div className="section-header">
                <span className="section-title">Recent Games</span>
                <span className="section-line" />
              </div>
              <div className="section-content matches-wrapper">
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
        </div>
      </div>
      <div className="settings-form">
        <div>
          <h2 className="settings-form-header">Settings</h2>
          <a className="close-btn" href="#"><i className="fas fa-times" /></a>
        </div>
        <div className="settings-form-content">
          <div className="summoner-form">
            <label className="form-label">Summoner name</label>
            <input className="form-input summoner-name-input" type="text" />
          </div>
          <a href="#" className="btn save-btn">Save</a>
        </div>
      </div>
      <div className="toast-container" />
      <div className="match-details-container">
        <div className="match-details-header">
          <div className="match-details-header-content" />
          <a className="close-btn" href="#"><i className="fas fa-times" /></a>
        </div>
        <div className="match-details-content" />
      </div>
    </>
  );
}

export default App;
