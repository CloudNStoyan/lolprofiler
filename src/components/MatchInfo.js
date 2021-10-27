import React from "react";
import utils from "../utils";
import ItemInfo from "./ItemInfo";
import MatchPlayer from "./MatchPlayer";

function MatchInfo({ matchData, summoner, ddragon }) {
    console.log(matchData, ddragon)
    const queue = utils.constants.queues.find(q => q.id === matchData.info.queueId);
    const participant = matchData.info.participants.find(p => p.puuid === summoner.puuid)
    const participantTeam = matchData.info.teams.find(team => team.teamId === participant.teamId);
    const now = Date.now();
    const gameDate = utils.longAgo(now - matchData.info.gameCreation - matchData.info.gameDuration);
    const winText = participantTeam.win ? 'Win' : 'Defeat';
    const champion = ddragon.champion.find(champ => Number(champ.key) === participant.championId);
    const summonerSpell1 = ddragon.summoner.find(spell => Number(spell.key) === participant.summoner1Id);
    const summonerSpell2 = ddragon.summoner.find(spell => Number(spell.key) === participant.summoner2Id);
    const keystone = ddragon.runesReforged.find(x => x.id === participant.perks.styles[0].style).slots[0].runes.find(x => x.id === participant.perks.styles[0].selections[0].perk);
    const secondKeystone = ddragon.runesReforged.find(x => x.id === participant.perks.styles[1].style);

    const damage = participant.totalDamageDealtToChampions;
    const maxDamage = Math.max(...matchData.info.participants.map(x => x.totalDamageDealtToChampions));

    const damagePercentage = Math.round((damage / maxDamage) * 100);

    const teamKills = matchData.info.participants.filter((p) => p.teamId === participant.teamId).map(x => x.kills).reduce((a, b) => a + b, 0);

    const killPercentage = Math.round(((participant.kills + participant.assists) / teamKills) * 100);

    const items = [participant.item0, participant.item1, participant.item2, participant.item6, participant.item3, participant.item4, participant.item5];

    return (
        <div className={`match ${participantTeam.win ? 'victory' : 'defeat'}`}>
            <div className="match-info">
                <div className="tooltip-container">
                    <div className="tooltip">{queue.name}</div>
                    <span className="tooltip-content">{queue.tooltip}</span>
                </div>
                <div className="tooltip-container">
                    <div className="tooltip">{gameDate}</div>
                    <span className="tooltip-content">{utils.dateToCustomString(new Date(matchData.info.gameCreation))}</span>
                </div>
                <div className="seperator"></div>
                <div className="result">{winText}</div>
                <div>{utils.dateToGameLength(matchData.info.gameDuration)}</div>
            </div>
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
            <div className="score">
                <div>{participant.kills} / <span class="deaths">{participant.deaths}</span> / {participant.assists}</div>
                <div>{participant.deaths === 0 ? 'Perfect KDA' : `${((participant.kills + participant.assists) / participant.deaths).toFixed(2)}:1 KDA`}</div>
                <div class="tooltip-container">
                    <div class="damage-meter tooltip">
                        <div class="damage" style={{ width: `${damagePercentage}%` }}>{Math.round(damage / 1000)}K</div>
                    </div>
                    <div class="tooltip-content">
                        <span>Total Damage Done</span>
                        <span class="line"></span>
                        <span class="small">* to champions</span>
                    </div>
                </div>
            </div>
            <div className="stats">
                <div>Level {participant.champLevel}</div>
                <div>{participant.totalMinionsKilled} CS</div>
                <div>P/Kill {killPercentage}%</div>
            </div>
            <div className="items">
                {items.map((item) => <ItemInfo itemData={ddragon.item.data[item]} />)}
            </div>
            <div className="players">
                <div className="team">
                    {matchData.info.participants.filter(p => p.teamId === 100).map(p => <MatchPlayer participant={p} ddragon={ddragon} />)}
                </div>
                <div className="team">
                    {matchData.info.participants.filter(p => p.teamId === 200).map(p => <MatchPlayer participant={p} ddragon={ddragon} />)}
                </div>
            </div>
        </div>
    )
}

export default MatchInfo;