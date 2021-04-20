let searchBtn = document.querySelector('#search-btn');
let nameInput = document.querySelector('#input-name');

nameInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      
      fetchProfile(nameInput.value);
    }
  });

searchBtn.addEventListener('click', () => fetchProfile(nameInput.value));

function handleSummoner(summoner) {
    document.querySelector('.profile-name').innerText = summoner.name;
    document.querySelector('.profile-level').innerText = summoner.summonerLevel;
    document.querySelector('.profile-icon img').src = Endpoints.DDragon.Image.ProfileIcon(summoner.profileIconId)
}

function handleQueues(queues) {
    let rankedWrapper = document.querySelector('.rank-wrapper')
    rankedWrapper.innerHTML = '';

    if (queues.length == 0) {
        let rankedInfo = document.createElement('div');
        rankedInfo.className = 'rank-info';
        rankedWrapper.appendChild(rankedInfo);
        
        rankedInfo.innerHTML = '<h1 class="rank-text unranked">UNRANKED</h1>';
    }
                    
    queues.forEach((queue) => {
        let rankedInfo = document.createElement('div');
        rankedInfo.className = 'rank-info';
        rankedInfo.innerHTML = 
        `
        <div class="rank-queue">${lol.constants.ranked[queue.queueType]}</div>
        <img width="100" height="100" src="${Endpoints.DDragon.Image.RankedEmblem(queue.tier[0] + queue.tier.substring(1).toLowerCase())}"/>
        <div class="rank-text">${queue.tier} ${queue.rank}</div>
        `;
        rankedWrapper.appendChild(rankedInfo);
    })
}

function handleSummary(summary) {
    let summaryWrapper = document.querySelector('.summary');

    summaryWrapper.innerHTML = `
    <div>Total: ${summary.total}</div>
    <div>Wins: ${summary.wins}</div>
    <div>Loses: ${summary.loses}</div>
    `
}

function handleMatches(matches, summoner) {
    let matchesWrapper = document.querySelector('.matches-wrapper');
    matchesWrapper.innerHTML = '';
                        
    matches.sort((a, b) => (a.gameCreation > b.gameCreation) ? -1 : 1)

    let summary = {
        wins: 0,
        loses: 0,
        total: matches.length
    }

    matches.forEach(game => {
        console.log(game);
        let participantIdentity = game.participantIdentities.find(identity => identity.player.summonerId == summoner.id);
        let participant = game.participants.find(identity => identity.participantId == participantIdentity.participantId);
        let team = game.teams.find(team => team.teamId == participant.teamId);

        let teams = {
            Blue: game.participants.filter((p) => p.teamId == 100).map((p) => game.participantIdentities.find(identity => identity.participantId == p.participantId)),
            Red: game.participants.filter((p) => p.teamId == 200).map((p) => game.participantIdentities.find(identity => identity.participantId == p.participantId))
        };

        console.log(teams)

        if (team.win == "Win") {
            summary.wins += 1
        } else {
            summary.loses += 1
        }

        console.log(participant.championId);
        let champion = Object.values(lol.ddragon.champion.data).find(champ => champ.key == participant.championId);
        let queue = lol.ddragon.queues.find(q => q.queueId == game.queueId);

        let teamKills = 0;

        game.participants.forEach((player) => {
            if (player.teamId == team.teamId) {
                teamKills += player.stats.kills;
            }
        })

        let summonerSpells = Object.values(lol.ddragon.summoner.data);
        
        let secondaryRunePath = lol.ddragon.runesReforged.find(runePath => runePath.id == participant.stats.perkSubStyle);
        let keystone = lol.ddragon.runesReforged
        .find(runePath => runePath.id == participant.stats.perkPrimaryStyle).slots[0].runes
        .find(rune => rune.id == participant.stats.perk0);

        var items = [participant.stats.item0, participant.stats.item1, participant.stats.item2, participant.stats.item6, participant.stats.item3, participant.stats.item4, participant.stats.item5];

        let stats = {
            level: participant.stats.champLevel,
            creepScore: participant.stats.totalMinionsKilled,
            killPercentage: Math.round(((participant.stats.kills + participant.stats.assists) / teamKills) * 100),
            summonerSpell1: summonerSpells.find(spell => spell.key == participant.spell1Id),
            summonerSpell2: summonerSpells.find(spell => spell.key == participant.spell2Id),
            keystone: keystone,
            secondaryKeystone: secondaryRunePath,
            items: items
        }

        matchesWrapper.appendChild(
            new Game(
                team.win == 'Win',
                champion,
                {
                    kills: participant.stats.kills,
                    deaths: participant.stats.deaths,
                    assists: participant.stats.assists
                },
                `${Math.floor((game.gameDuration / 60))}m ${(game.gameDuration % 60)}s`,
                queue,
                null,
                stats,
                teams
                ).ToNode()
        );
    });

    handleSummary(summary);
}

async function fetchProfile(summonerName) {
    document.querySelector('.container').classList.add('hide');
    document.querySelector('.container').classList.add('loading');
    nameInput.setAttribute('disabled', '');

    let summoner = await customFetch(Endpoints.SummonerV4ByName(summonerName));
    handleSummoner(summoner);

    let queues = await customFetch(Endpoints.LeagueV4BySummoner(summoner.id));
    handleQueues(queues);

    let matchList = await customFetch(Endpoints.MatchV4Matchlist(summoner.accountId));
    let matchRequests = [];
    matchList.matches.forEach((match) => matchRequests.push(customFetch(Endpoints.MatchV4MatchById(match.gameId))));

    let matches = await Promise.all(matchRequests);
    handleMatches(matches, summoner);

    document.querySelector('.container').classList.remove('hide');
    document.querySelector('.container').classList.remove('loading');
    nameInput.removeAttribute('disabled', '');
}

async function customFetch(url) {
    let cachedResponse = CustomCache.get(url);

    if (cachedResponse) {
        return cachedResponse;
    }

    let response = await fetch(url).then(resp => resp.json());

    CustomCache.add(url, response);

    return response;
}

class Game {
    constructor(isWin, champion, kda, gameLength, queue, longAgo, stats, teams) {
        this.isWin = isWin;
        this.champion = champion;
        this.kda = kda;
        this.gameLength = gameLength;
        this.queue = queue;
        this.longAgo = longAgo;
        this.stats = stats;
        this.teams = teams;
    }

    ToNode() {
        console.log(this.champion)
        let itemsString = '';

        this.stats.items.forEach((item) => {
            if (item != 0) {
                itemsString += `<div><img src="${Endpoints.DDragon.Image.Item(item)}" /><span>${lol.ddragon.item.data[item].name}</span></div>`;
            } else {
                itemsString += '<img class="no-image" />'
            }
        });

        let blueTeamString = '';
        let redTeamString = '';

        this.teams.Blue.forEach((p) => {
            blueTeamString += `
            <a href="#" class="summoner" onclick="putNameAnimation('${p.player.summonerName}')">
            <div class="summoner-name">${p.player.summonerName}</div>
            </a>
            `
        })

        this.teams.Red.forEach((p) => {
            redTeamString += `
            <a href="#" class="summoner" onclick="putNameAnimation('${p.player.summonerName}')">
            <div class="summoner-name">${p.player.summonerName}</div>
            </a>
            `
        })


        let winText = this.isWin ? 'Victory' : 'Defeat';
        let match = document.createElement('div');
        match.className = 'match ' + winText.toLowerCase();

        console.log(this.queue.queueId)

        let gameType = lol.constants.queues.find(q => q.id == this.queue.queueId);

        match.innerHTML = 
        `
        <div class="match-info">
            <div>${gameType.name}</div>
            <div></div>
            <div class="seperator"></div>
            <div class="result">${winText}</div>
            <div>${this.gameLength}</div>
        </div>
        <div class="setup">
            <div class="additional-info">
                <div class="champion-image">
                    <img src="${Endpoints.DDragon.Image.ChampionSquare(this.champion.image.full)}"/>
                </div>
                <div class="masteries">
                    <div class="summoner-spells">
                        <img src="${Endpoints.DDragon.Image.SummonerSpell(this.stats.summonerSpell1.image.full)}"/>
                        <img src="${Endpoints.DDragon.Image.SummonerSpell(this.stats.summonerSpell2.image.full)}"/>
                    </div>
                    <div class="runes">
                        <img src="${Endpoints.DDragon.Image.Rune(this.stats.keystone.icon)}"/>
                        <img src="${Endpoints.DDragon.Image.Rune(this.stats.secondaryKeystone.icon)}"/>
                    </div>
                </div>
            </div>
            <div class="champion-name">${this.champion.name}</div>
        </div>
        <div class="score">
            <div>${this.kda.kills} / <span class="deaths">${this.kda.deaths}</span> / ${this.kda.assists}</div>
            <div>${this.kda.deaths == 0 ? 'Perfect KDA' : `${((this.kda.kills + this.kda.assists) / this.kda.deaths).toFixed(2)}:1 KDA`}</div>
            <div class="flairs"></div>
        </div>
        <div class="stats">
            <div>Level ${this.stats.level}</div>
            <div>${this.stats.creepScore} CS</div>
            <div>P/Kill ${this.stats.killPercentage}%</div>
        </div>
        <div class="items">
            ${itemsString}
        </div>
        <div class="players">
            <div class="team">
            ${blueTeamString}
            </div>
            <div class="team">
            ${redTeamString}
            </div>
        </div>
        `;

        return match;
    }
}

function putNameAnimation(name) {
    nameInput.value = '';
    for (let i = 0; i < name.length; i++) {
        setTimeout(() => {
            nameInput.value += name[i];
        }, 50 * i);

        if (i + 1 >= name.length) {
            fetchProfile(name);
        }
    }
}

class Endpoints {
    static ApiKey = lol.api.key;

    static baseUrl = 'https://eun1.api.riotgames.com/lol';

    static SummonerV4ByName(summonerName) {
        return `${this.baseUrl}/summoner/v4/summoners/by-name/${summonerName}?api_key=${Endpoints.ApiKey}`;
    }

    static LeagueV4BySummoner(summonerId) {
        return `${this.baseUrl}/league/v4/entries/by-summoner/${summonerId}?api_key=${Endpoints.ApiKey}`;
    }

    static MatchV4Matchlist(accountId) {
        return `${this.baseUrl}/match/v4/matchlists/by-account/${accountId}?endIndex=10&begindIndex=0&api_key=${Endpoints.ApiKey}`;
    }

    static MatchV4MatchById(gameId) {
        return `${this.baseUrl}/match/v4/matches/${gameId}?api_key=${Endpoints.ApiKey}`;
    }

    static DDragon = {
        Version: '11.8.1',
        Image: {
            ProfileIcon(profileIconId) {
                return `http://ddragon.leagueoflegends.com/cdn/${Endpoints.DDragon.Version}/img/profileicon/${profileIconId}.png`;
            },
            ChampionSquare(imageName) {
                return `http://ddragon.leagueoflegends.com/cdn/${Endpoints.DDragon.Version}/img/champion/${imageName}`;
            },
            SummonerSpell(imageName) {
                return `http://ddragon.leagueoflegends.com/cdn/${Endpoints.DDragon.Version}/img/spell/${imageName}`;
            },
            Rune(imageName) {
                return './ddragon/img/' + imageName;
            },
            RankedEmblem(tier) {
                return `./ddragon/img/ranked-emblems/Emblem_${tier}.png`;
            },
            Item(itemId) {
                return `http://ddragon.leagueoflegends.com/cdn/${Endpoints.DDragon.Version}/img/item/${itemId}.png`
            }
        }
    }
}