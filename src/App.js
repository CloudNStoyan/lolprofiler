import React, { useState } from 'react';
import './App.css';
import SearchSummoner from './components/SearchSummoner';
import RiotClient from './api/RiotClient';
import ProfileWrapper from './components/ProfileWrapper';
import SettingsForm from './components/SettingsForm';
import Config from './config';
import ToastContainer from './components/ToastContainer'

function App() {
  const riotClient = new RiotClient(Config)

  const [containerState, setContainerState] = useState('hide');
  const [profile, setProfile] = useState(null);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [filterQueueId, setFilterQueueId] = useState('-1');
  const [toasts, setToasts] = useState([]);
  const [toastSerialId, setToastSerialId] = useState(0);

  const searchSummoner = async (summonerName) => {
    setContainerState('hide');
    const newProfile = {};
    const [summonerStatus, summonerData] = await riotClient.Summoner.getByName(summonerName);

    if (summonerStatus.statusCode !== 200) {
      throwError('Fetching summoner data failed..', summonerStatus, summonerData);
      return;
    }

    newProfile.summoner = summonerData;

    const [masteriesStatus, masteriesData] = await riotClient.Mastery.getMasteriesBySummonerId(summonerData.id);

    if (masteriesStatus.statusCode !== 200) {
      throwError('Fetching masteries data failed..', masteriesStatus, masteriesData);
      return;
    }

    newProfile.masteries = masteriesData.slice(0, 10);

    const [matchIdsStatus, matchIdsData] = await riotClient.Match.getSummonerMatches(summonerData.puuid);
    if (matchIdsStatus.statusCode !== 200) {
      throwError('Fetching match history list failed..', matchIdsStatus, matchIdsData);
      return;
    }

    const matches = await Promise.all(matchIdsData.map(async (matchId) => {
      const [matchStatus, matchData] = await riotClient.Match.getMatchById(matchId);
      if (matchStatus.statusCode !== 200) {
        throwError('Fetching match failed..', matchStatus, matchData);
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

  const loadMatches = async (keepPrevious = true, overrideQueueId = null) => {
    const [matchIdsStatus, matchIdsData] =
      await riotClient.Match.getSummonerMatches(
        profile.summoner.puuid,
        keepPrevious ? profile.matches.length : 0,
        5,
        overrideQueueId ? overrideQueueId : filterQueueId
      );
    if (matchIdsStatus.statusCode !== 200) {
      throwError('Fetching match history list failed..', matchIdsStatus, matchIdsData);
      return;
    }

    const matches = await Promise.all(matchIdsData.map(async (matchId) => {
      const [matchStatus, matchData] = await riotClient.Match.getMatchById(matchId);
      if (matchStatus.statusCode !== 200) {
        throwError('Fetching match failed..', matchStatus, matchData);
        return;
      }

      return matchData;
    }));

    profile.matches = keepPrevious ? [...profile.matches, ...matches] : matches;
    setProfile(Object.assign({}, profile));
  }

  const filterMatches = async (queueId) => {
    setFilterQueueId(queueId);
    loadMatches(false, queueId);
  }

  const createToast = (text) => {
    setToasts([...toasts, {
      id: toastSerialId,
      text: text,
      isDone: false
    }]);

    setToastSerialId(toastSerialId + 1);
  }

  const removeToast = (id) => {
    const activeToasts = [];

    for (const toast of toasts) {
      if (toast.id !== id) {
        activeToasts.push(toast);
      }
    }

    setToasts(activeToasts);
  }

  const throwError = (errorMessage, ...moreArgs) => {
    console.error(errorMessage, ...moreArgs);
    createToast(errorMessage);
  }

  return (
    <>
      <div className={`container ${containerState}`}>
        <div className="header">
          <div className="header-content">
            <SearchSummoner onSearch={searchSummoner} />
            <div className="right-nav">
              <button onClick={() => setSettingsIsOpen(true)} className="settings-btn" alt="Settings"><i className="fas fa-cog" /></button>
            </div>
          </div>
        </div>
        {profile && <ProfileWrapper
          profile={profile}
          ddragon={riotClient.DDragon.data}
          onLoadMore={loadMatches}
          onFilterMatches={filterMatches}
          onSearch={searchSummoner}
        />}
        <div className="footer">
        </div>
      </div>
      <SettingsForm isOpen={settingsIsOpen} onClose={() => setSettingsIsOpen(false)} />
      <ToastContainer toasts={toasts} onDone={removeToast} />
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
