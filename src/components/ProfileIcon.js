import React from 'react';

function ProfileIcon({ summoner }) {
    return (
        <div className="profile-icon">
            <img
                className="img-loaded"
                style={{ width: 200, height: 200 }}
                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/profileicon/${summoner.profileIconId}.png`}
                alt="" />
            <div className="profile-footer">
                <div className="profile-level">{summoner.summonerLevel}</div>
            </div>
        </div>
    )
}

export default ProfileIcon;