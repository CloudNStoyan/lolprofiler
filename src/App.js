import './App.css';
import SearchSummoner from './components/SearchSummoner';
import React, { useState } from 'react';
import RiotClient from './api/RiotClient';
import ProfileInfo from './components/ProfileInfo';
import SettingsForm from './components/SettingsForm';

function App() {
  const riotClient = new RiotClient({ token: "YOUR API KEY HERE" })

  const [containerState, setContainerState] = useState('hide');
  const [profile, setProfile] = useState(null);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);

  console.log(riotClient.DDragon.data.champion)

  const changeContainerState = async (summonerName) => {
    const newProfile = {};
    const [summonerStatus, summonerData] = await riotClient.Summoner.getByName(summonerName);

    if (summonerStatus.statusCode !== 200) {
      console.error('Fetching summoner data failed..', summonerStatus, summonerData);
      return;
    }

    newProfile.summoner = summonerData;

    const [masteriesStatus, masteriesData] = await riotClient.Mastery.getMasteriesBySummonerId(summonerData.id);

    if (masteriesStatus.statusCode !== 200) {
      console.error('Fetching masteries data failed..', masteriesStatus, masteriesData);
      return;
    }

    newProfile.masteries = masteriesData.slice(0, 10);

    const [matchIdsStatus, matchIdsData] = await riotClient.Match.getSummonerMatches(summonerData.puuid);
    if (matchIdsStatus.statusCode !== 200) {
      console.error('Fetching match history list failed..', matchIdsStatus, matchIdsData);
      return;
    }

    const matches = await Promise.all(matchIdsData.map(async (matchId) => {
      const [matchStatus, matchData] = await riotClient.Match.getMatchById(matchId);
      if (matchStatus.statusCode !== 200) {
        console.log('Fetching match failed..', matchStatus, matchData);
        return;
      }

      return matchData;
    }));

    newProfile.matches = matches;

    newProfile.wins = matches.map(x => x.info.teams.find(t => x.info.participants.find(p => p.puuid === summonerData.puuid).teamId === t.teamId).win).filter(w => w === true).length;
    newProfile.totalGames = matches.length;

    setProfile(newProfile);
    setContainerState('profile-loaded')
  }

  const loadMoreMatches = async () => {
    const [matchIdsStatus, matchIdsData] = await riotClient.Match.getSummonerMatches(profile.summoner.puuid, profile.matches.length, 5);
    if (matchIdsStatus.statusCode !== 200) {
      console.error('Fetching match history list failed..', matchIdsStatus, matchIdsData);
      return;
    }

    const matches = await Promise.all(matchIdsData.map(async (matchId) => {
      const [matchStatus, matchData] = await riotClient.Match.getMatchById(matchId);
      if (matchStatus.statusCode !== 200) {
        console.log('Fetching match failed..', matchStatus, matchData);
        return;
      }

      return matchData;
    }));

    profile.matches = [...profile.matches, ...matches];
    console.log(profile)
    setProfile(profile);
  }

  return (
    <>
      <button onClick={() => console.log(profile)}>Test</button>
      <div className={`container ${containerState}`}>
        <div className="header">
          <div className="header-content">
            <SearchSummoner onSearch={changeContainerState} />
            <div className="right-nav">
              <button onClick={() => setSettingsIsOpen(true)} className="settings-btn" href="#" alt="Settings"><i className="fas fa-cog" /></button>
            </div>
          </div>
        </div>
        {profile && <ProfileInfo profile={profile} ddragon={riotClient.DDragon.data} onLoadMore={loadMoreMatches} />}
        <div className="footer">
        </div>
      </div>
      <SettingsForm isOpen={settingsIsOpen} onClose={() => setSettingsIsOpen(false)} />
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
