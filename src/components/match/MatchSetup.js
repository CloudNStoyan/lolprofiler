import styles from '../css/MatchSetup.module.scss';
import Tooltip from '../tooltip/Tooltip';

function MatchSetup({ participant, ddragon }) {
    const champion = ddragon.champion.find(champ => Number(champ.key) === participant.championId);
    const summonerSpell1 = ddragon.summoner.find(spell => Number(spell.key) === participant.summoner1Id);
    const summonerSpell2 = ddragon.summoner.find(spell => Number(spell.key) === participant.summoner2Id);
    const keystone = ddragon.runesReforged.find(x => x.id === participant.perks.styles[0].style).slots[0].runes.find(x => x.id === participant.perks.styles[0].selections[0].perk);
    const secondKeystone = ddragon.runesReforged.find(x => x.id === participant.perks.styles[1].style);

    return (
        <div className={styles.setup}>
            <div className={styles["additional-info"]}>
                <div className={styles["champion-image"]}>
                    <img
                        src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
                    />
                </div>
                <div className={styles.masteries}>
                    <div className={styles["summoner-spells"]}>
                        <Tooltip className={styles["image-wrapper"]} content={summonerSpell1.name}>
                            <img
                                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/spell/${summonerSpell1.image.full}`}
                            />
                        </Tooltip>
                        <Tooltip className={styles["image-wrapper"]} content={summonerSpell2.name}>
                            <img
                                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/spell/${summonerSpell2.image.full}`} />
                        </Tooltip>
                    </div>
                    <div className={styles.runes}>
                        <Tooltip className={styles["image-wrapper"]} content={keystone.name}>
                            <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${keystone.icon.toLowerCase()}`}
                            />
                        </Tooltip>
                        <Tooltip className={styles["image-wrapper"]} content={secondKeystone.name}>
                            <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${secondKeystone.icon.toLowerCase()}`}
                                alt=""
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className={styles["champion-name"]}>{champion.name}</div>
        </div>
    )
}

export default MatchSetup;