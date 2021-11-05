import React, { useState } from 'react';
import './Global.css';
import SearchSummoner from './components/SearchSummoner';
import RiotClient from './api/RiotClient';
import ProfileWrapper from './components/ProfileWrapper';
import SettingsForm from './components/SettingsForm';
import Config from './config';
import ToastContainer from './components/ToastContainer'
import styles from './App.module.scss';
import utils from './utils';

function App() {
  const riotClient = new RiotClient(Config)

  //#region states
  const [containerState, setContainerState] = useState('hide');
  const [profile, setProfile] = useState(null);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [filterQueueId, setFilterQueueId] = useState('-1');
  const [toasts, setToasts] = useState([]);
  const [toastSerialId, setToastSerialId] = useState(0);
  const [summonerName, setSummonerName] = useState('');
  //#endregion

  //#region Functions
  const searchSummoner = async (name) => {
    setSummonerName(name)
    setContainerState('hide');
    const newProfile = {};
    const [summonerStatus, summonerData] = await riotClient.Summoner.getByName(name);

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

    const [leagueStatus, leaguesData] = await riotClient.League.getLeagueEntriesBySummonerId(summonerData.id);

    if (leagueStatus.statusCode !== 200) {
      throwError('Fetching leagues data failed..', leagueStatus, leaguesData);
      return;
    }

    newProfile.leagues = leaguesData;

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
    newProfile.recentlyPlayedWith = utils.getRecentlyPlayedWith(matches, summonerData);

    setFilterQueueId('-1');
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
    profile.wins = profile.matches.map(x => x.info.teams.find(t => x.info.participants.find(p => p.puuid === profile.summoner.puuid).teamId === t.teamId).win).filter(w => w === true).length;
    profile.totalGames = profile.matches.length;
    profile.recentlyPlayedWith = utils.getRecentlyPlayedWith(profile.matches, profile.summoner);
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

  const openSettings = () => {
    setSettingsIsOpen(true);
    setContainerState('hide-entirely');
  }

  const closeSettings = () => {
    setSettingsIsOpen(false);
    setContainerState(profile ? 'profile-loaded' : 'hide');
  }


  //#endregion

  return (
    <>
      <div className={`${styles.container} ${styles[containerState]}`}>
        <div className={styles.header}>
          <div className={styles["header-content"]}>
            <SearchSummoner
              onSearch={searchSummoner}
              onFocus={() => setContainerState('hide')}
              onLoseFocus={() => setContainerState(profile ? 'profile-loaded' : 'hide')}
              summonerName={summonerName}
              setSummonerName={setSummonerName}
            />
            <div className={styles["right-nav"]}>
              <button
                className={styles["settings-btn"]}
                alt="Settings"
                onClick={openSettings}
              >
                <i className="fas fa-cog" />
              </button>
            </div>
          </div>
        </div>
        {profile && <ProfileWrapper
          profile={profile}
          ddragon={riotClient.DDragon.data}
          onLoadMore={loadMatches}
          onFilterMatches={filterMatches}
          onSearch={searchSummoner}
          filterQueueId={filterQueueId}
          setFilterQueueId={setFilterQueueId}
        />}
        <div className={styles.footer}></div>
      </div>
      <SettingsForm isOpen={settingsIsOpen} onClose={closeSettings} setContainerState={setContainerState} />
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
