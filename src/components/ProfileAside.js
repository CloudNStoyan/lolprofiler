import React from 'react';
import ProfileIcon from "./ProfileIcon";
import SectionContainer from "./SectionContainer";
import styles from '../App.module.scss';
import LeagueTier from './LeagueTier';

function ProfileAside({ profile, ddragon }) {
    return (
        <div className={styles.aside}>
            <h2 className="profile-name">{profile.summoner.name}</h2>
            <ProfileIcon summoner={profile.summoner} />
            <SectionContainer contentClass="rank-wrapper" title="Rank">
                {profile.leagues.map(league => <LeagueTier ddragon={ddragon} league={league} />)}
            </SectionContainer>
            <SectionContainer contentClass="recently-wrapper" title="Recently Played With" />
        </div>
    )
}

export default ProfileAside;