import React from 'react';
import ProfileMain from './ProfileMain';
import ProfileAside from './ProfileAside';

function ProfileWrapper({ profile, ddragon, onLoadMore, onFilterMatches, onSearch, imgDragon }) {
    return (
        <>
            <ProfileAside
                profile={profile}
                ddragon={imgDragon}
            />
            <ProfileMain
                profile={profile}
                ddragon={ddragon}
                onLoadMore={onLoadMore}
                onFilterMatches={onFilterMatches}
                onSearch={onSearch}
            />
        </>
    );
}

export default ProfileWrapper;