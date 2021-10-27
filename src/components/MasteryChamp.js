import React from 'react';

function MasteryChamp({ champion, mastery }) {
    return (
        <div className="mastery-champ">
            <div className="tooltip-container mastery-image-wrapper">
                <span className="champion-level">{Math.round(mastery.championPoints / 1000)}k</span>
                <img
                    className="tooltip img-loaded"
                    src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
                    alt={champion.name}
                />
                <div className="tooltip-content">
                    <span>{champion.name}</span>
                    <span className="line"></span>
                    <span>Level {mastery.championLevel}</span>
                    <div className="champ-description">
                        {champion.blurb}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MasteryChamp;