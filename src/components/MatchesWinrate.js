import React from 'react';

function MatchesWinrate({ profile }) {
    return (
        <div className="winratio-container">
            <h4 className="winratio-title">Win/Lose ratio</h4>
            <div className="summary-progress">
                <div className="progress win" style={{ width: `${(profile.wins / profile.totalGames) * 100}%` }}>
                    <span>{Math.round((profile.wins / profile.totalGames) * 100)}%</span>
                </div>
                <div className="progress lose" style={
                    { width: `${100 - ((profile.wins / profile.totalGames) * 100)}%` }
                }>
                    <span>{Math.round((100 - ((profile.wins / profile.totalGames) * 100)))}%</span>
                </div>
            </div>
        </div>
    )
}

export default MatchesWinrate;