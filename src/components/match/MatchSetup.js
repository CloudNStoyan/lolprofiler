import React from 'react';

function MatchSetup({ participant, ddragon }) {
    const champion = ddragon.champion.find(champ => Number(champ.key) === participant.championId);
    const summonerSpell1 = ddragon.summoner.find(spell => Number(spell.key) === participant.summoner1Id);
    const summonerSpell2 = ddragon.summoner.find(spell => Number(spell.key) === participant.summoner2Id);
    const keystone = ddragon.runesReforged.find(x => x.id === participant.perks.styles[0].style).slots[0].runes.find(x => x.id === participant.perks.styles[0].selections[0].perk);
    const secondKeystone = ddragon.runesReforged.find(x => x.id === participant.perks.styles[1].style);

    return (
        <div className="setup">
            <div className="additional-info">
                <div className="champion-image">
                    <img
                        className="img-loaded"
                        src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
                        alt={champion.name}
                    />
                </div>
                <div className="masteries">
                    <div className="summoner-spells">
                        <div className="tooltip-container">
                            <img
                                className="tooltip"
                                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/spell/${summonerSpell1.image.full}`}
                                alt=""
                            />
                            <span className="tooltip-content">{summonerSpell1.description}</span>
                        </div>
                        <div className="tooltip-container">
                            <img
                                className="tooltip"
                                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/spell/${summonerSpell2.image.full}`}
                                alt="" />
                            <span className="tooltip-content">{summonerSpell2.description}</span>
                        </div>
                    </div>
                    <div className="runes">
                        <div className="tooltip-container">
                            <div className="tooltip">
                                <img
                                    src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${keystone.icon.toLowerCase()}`}
                                    alt=""
                                />
                            </div>
                            <div className="tooltip-content">
                                <span>{keystone.name}</span>
                                <span className="line"></span>
                                <div className="keystone-description">
                                    {keystone.shortDesc}
                                </div>
                            </div>
                        </div>
                        <div className="tooltip-container">
                            <div className="tooltip">
                                <img
                                    src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${secondKeystone.icon.toLowerCase()}`}
                                    alt=""
                                />
                            </div>
                            <div className="tooltip-content">
                                <span>{secondKeystone.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="champion-name">{champion.name}</div>
        </div>
    )
}

export default MatchSetup;