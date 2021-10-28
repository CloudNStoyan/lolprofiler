import React from "react";

function MatchStats({ participant, participants }) {
    const teamKills = participants.filter((p) => p.teamId === participant.teamId).map(x => x.kills).reduce((a, b) => a + b, 0);
    const killPercentage = Math.round(((participant.kills + participant.assists) / teamKills) * 100);

    return (
        <div className="stats">
            <div>Level {participant.champLevel}</div>
            <div>{participant.totalMinionsKilled} CS</div>
            <div>P/Kill {killPercentage}%</div>
        </div>
    )
}

export default MatchStats;