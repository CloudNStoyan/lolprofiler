import React from 'react';

function LeagueTier({ league, ddragon }) {
    const queueName = league.queueType === 'RANKED_SOLO_5x5' ? 'Solo/Duo' : 'Flex';
    console.log(ddragon)
    return (
        <div>
            <div className="rank-queue">{queueName}</div>
            <img width={100} height={100}
                src={ddragon.tier(`${league.tier.toLowerCase()}_${league.rank.toLowerCase()}`)}
                alt="" />
            <div className="rank-text">{league.tier} {league.rank}</div>
        </div>
    )
}

export default LeagueTier;