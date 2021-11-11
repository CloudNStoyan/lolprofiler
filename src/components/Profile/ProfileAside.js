import React from 'react';
import ProfileIcon from "./ProfileIcon";
import SectionContainer from "../SectionContainer/SectionContainer";
import styles from '../../App.module.scss';
import LeagueTier from '../LeagueTier/LeagueTier';
import RecentPlayers from '../RecentPlayer/RecentPlayers';

function ProfileAside({ profile, onSearch }) {
    return (
        <div className={styles.aside}>
            <h2 className="profile-name">{profile.summoner.name}</h2>
            <ProfileIcon summoner={profile.summoner} />
            <SectionContainer contentClass="rank-wrapper" title="Rank">
                {profile.leagues.map(league => <LeagueTier key={league.leagueId} league={league} />)}
            </SectionContainer>
            <SectionContainer title="Recently Played With">
                <RecentPlayers profile={profile} onSearch={onSearch} />
            </SectionContainer>
        </div>
    )
}

export default ProfileAside;