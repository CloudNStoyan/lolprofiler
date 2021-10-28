import React from 'react';
import MatchPlayer from "./MatchPlayer"

function MatchPlayers({ matchData, onSearch, ddragon }) {
    return (
        <div className="players">
            <div className="team">
                {matchData.info.participants.filter(p => p.teamId === 100).map((p, i) => <MatchPlayer onSearch={onSearch} key={i} participant={p} ddragon={ddragon} />)}
            </div>
            <div className="team">
                {matchData.info.participants.filter(p => p.teamId === 200).map((p, i) => <MatchPlayer onSearch={onSearch} key={i} participant={p} ddragon={ddragon} />)}
            </div>
        </div>
    )
}

export default MatchPlayers;