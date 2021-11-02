import React from 'react';
import ProfileIcon from "./ProfileIcon";
import SectionContainer from "./SectionContainer";
import styles from '../App.module.scss';

function ProfileAside({ profile }) {
    return (
        <div className={styles.aside}>
            <h2 className="profile-name">{profile.summoner.name}</h2>
            <ProfileIcon summoner={profile.summoner} />
            <SectionContainer contentClass="rank-wrapper" title="Rank" />
            <SectionContainer contentClass="recently-wrapper" title="Recently Played With" />
        </div>
    )
}

export default ProfileAside;