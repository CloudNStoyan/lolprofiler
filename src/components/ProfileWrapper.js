import React from 'react';
import ProfileMain from './ProfileMain';
import ProfileAside from './ProfileAside';

function ProfileWrapper({ profile, ddragon, onLoadMore, onFilterMatches, onSearch, filterQueueId, setFilterQueueId }) {
    return (
        <>
            <ProfileAside
                profile={profile}
            />
            <ProfileMain
                profile={profile}
                ddragon={ddragon}
                onLoadMore={onLoadMore}
                onFilterMatches={onFilterMatches}
                onSearch={onSearch}
                filterQueueId={filterQueueId}
                setFilterQueueId={setFilterQueueId}
            />
        </>
    );
}

export default ProfileWrapper;