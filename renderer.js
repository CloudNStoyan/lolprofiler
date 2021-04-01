let searchBtn = document.querySelector('#search-btn');
let nameInput = document.querySelector('#input-name');

nameInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      
      fetchProfile();
    }
  });

searchBtn.addEventListener('click', fetchProfile);

let queueNames = {
    'RANKED_SOLO_5x5': 'Solo/Duo',
    'RANKED_FLEX_SR': 'Flex',
}

function fetchProfile() {
    let name = nameInput.value;

    fetch(Endpoints.SummonerV4ByName(name))
        .then(response => response.json())
        .then(summoner => {
            document.querySelector('.profile-name').innerText = summoner.name;
            document.querySelector('.profile-level').innerText = summoner.summonerLevel;
            document.querySelector('.profile-icon img').src = Endpoints.DDragonProfileIcon(summoner.profileIconId)

            fetch(Endpoints.LeagueV4BySummoner(summoner.id))
                .then(response => response.json())
                .then(queues => {
                    let rankedWrapper = document.querySelector('.rank-wrapper')
                    rankedWrapper.innerHTML = '';

                    if (queues.length == 0) {
                        let rankedInfo = document.createElement('div');
                        rankedInfo.className = 'rank-info';
                        rankedWrapper.appendChild(rankedInfo);

                        rankedInfo.innerHTML = 
                        `
                        <img width="100" height="100" src="${Endpoints.OPGGTierImageDefault}"/>
                        <div class="rank-text">UNRANKED</div>
                        `;
                    }
                    
                    queues.forEach((queue) => {
                        let rankedInfo = document.createElement('div');
                        rankedInfo.className = 'rank-info';
                        rankedWrapper.appendChild(rankedInfo);

                        rankedInfo.innerHTML = 
                        `
                        <div class="rank-queue">${queueNames[queue.queueType]}</div>
                        <img width="100" height="100" src="${Endpoints.OPGGTierImage(queue.tier.toLowerCase())}"/>
                        <div class="rank-text">${queue.tier} ${queue.rank}</div>
                        `;
                    })
                });
            
            fetch(Endpoints.MatchV4Matchlist(summoner.accountId))
                .then(response => response.json())
                .then(matchList => {
                    let matchesWrapper = document.querySelector('.matches-wrapper');

                    let fetchArr = [];
                    matchList.matches.forEach(async function(match) {
                        fetchArr.push(fetch(Endpoints.MatchV4MatchById(match.gameId)).then(response => response.json()));
                    });

                    Promise.all(fetchArr).then(matches => {
                        matches.sort((a, b) => (a.gameCreation > b.gameCreation) ? -1 : 1)

                        matches.forEach(game => {
                            console.log(game);

                            let participantIdentity = game.participantIdentities.find(identity => identity.player.summonerId == summoner.id);
                            let participant = game.participants.find(identity => identity.participantId == participantIdentity.participantId);
                            let team = game.teams.find(team => team.teamId == participant.teamId);
                            let champion = lol.ddragon.champion.find(champ => champ.key == participant.championId);
                            console.log(champion);
                            
                            matchesWrapper.appendChild(
                                new Game(
                                    team.win == 'Win',
                                    champion,
                                    {
                                        kills: participant.stats.kills,
                                        deaths: participant.stats.deaths,
                                        assists: participant.stats.assists
                                    },
                                    `${Math.floor((game.gameDuration / 60))}m ${(game.gameDuration % 60)}s`
                                    ).ToNode()
                            );
                        })
                    });
                });
        });
}

class Game {
    constructor(isWin, champion, kda, gameLength) {
        this.isWin = isWin;
        this.champion = champion;
        this.kda = kda;
        this.gameLength = gameLength;
    }

    ToNode() {
        let match = document.createElement('div');
        match.className = `match ${this.isWin ? 'victory' : 'defeat'}`;

        match.innerHTML = 
        `
        <span class="match-status">${this.isWin ? 'Victory' : 'Defeat'}</span>
        <span>${this.champion.name}</span>
        <span>${this.kda.kills} / <span class="deaths">${this.kda.deaths}</span> / ${this.kda.assists}</span>
        <span>${this.gameLength}</span>
        `;

        return match;
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

    static DDragonProfileIcon(profileIconId) {
        return `http://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/${profileIconId}.png`;
    }

    static OPGGTierImage(tier) {
        return `https://opgg-static.akamaized.net/images/medals/${tier}_1.png`;
    }

    static OPGGTierImageDefault = 'https://opgg-static.akamaized.net/images/medals/default.png';
}