import React from 'react';
import ProfileIcon from "./ProfileIcon";
import SectionContainer from "./SectionContainer";
import styles from '../App.module.scss';
import LeagueTier from './LeagueTier';
import RecentPlayer from './RecentPlayer';

function ProfileAside({ profile, onSearch }) {
    return (
        <div className={styles.aside}>
            <h2 className="profile-name">{profile.summoner.name}</h2>
            <ProfileIcon summoner={profile.summoner} />
            <SectionContainer contentClass="rank-wrapper" title="Rank">
                {profile.leagues.map(league => <LeagueTier key={league.leagueId} league={league} />)}
            </SectionContainer>
            <SectionContainer contentClass="recently-wrapper" title="Recently Played With">
                {profile.recentlyPlayedWith.filter(p => p.times > 1).map(p => <RecentPlayer onSearch={onSearch} key={p.summonerName} player={p} />)}
            </SectionContainer>
        </div>
    )
}

export default ProfileAside;