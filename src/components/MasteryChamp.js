import React from 'react';

function MasteryChamp({ image, points }) {
    return (
        <div className="mastery-champ">
            <div class="tooltip-container mastery-image-wrapper">
                <span class="champion-level">{Math.round(points / 1000)}k</span>
                <img class="tooltip img-loaded" src={image} alt="" />
                {/* <div class="tooltip-content">
            <span>${champ.name}</span>
            <span class="line"></span>
            <span>Level ${mastery.championLevel}</span>
            <div class="champ-description">
            ${champ.blurb}
            </div>
        </div> */}
            </div>
        </div>
    )
}

export default MasteryChamp;