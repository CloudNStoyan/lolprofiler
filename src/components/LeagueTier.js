import React from 'react';

function LeagueTier({ league }) {
    const queueName = league.queueType === 'RANKED_SOLO_5x5' ? 'Solo/Duo' : 'Flex';

    const imageLink = `https://raw.githubusercontent.com/RiotAPI/Riot-Games-API-Developer-Assets/master/tier-icons/${league.tier.toLowerCase()}_${league.rank.toLowerCase()}.png`;

    return (
        <div className="rank-info">
            <div className="rank-queue">{queueName}</div>
            <img width={100} height={100}
                src={imageLink}
                alt={queueName}
            />
            <div className="rank-text">{league.tier} {league.rank}</div>
        </div>
    )
}

export default LeagueTier;