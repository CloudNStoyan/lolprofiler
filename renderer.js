let searchBtn = document.querySelector('#search-btn');

searchBtn.addEventListener('click', fetchProfile);

let queueNames = {
    'RANKED_SOLO_5x5': 'Solo/Duo',
    'RANKED_FLEX_SR': 'Flex',
}

let apiKey;

function fetchProfile() {
    if (!apiKey) {
        apiKey = document.body.getAttribute('data-api-key');
    }

    let name = document.querySelector('#input-name').value;

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

                    matchList.matches.forEach(async function(match) {
                        let game = await fetch(Endpoints.MatchV4MatchById(match.gameId)).then(response => response.json())
                        let participantIdentity = game.participantIdentities.find(identity => identity.player.summonerId == summoner.id);
                        let participant = game.participants.find(identity => identity.participantId == participantIdentity.participantId);
                        let team = game.teams.find(team => team.teamId == participant.teamId);

                        console.log('-GAME-');
                        console.log(game);
                        console.log(participantIdentity);
                        console.log(participant);
                        console.log(team);
                        console.log('-/GAME-');
                        
                        let matchDiv = document.createElement('div');
                        matchDiv.className = 'match';
                        matchesWrapper.appendChild(matchDiv);

                        matchDiv.innerHTML =
                        `
                        <span>${team.win}</span>
                        `
                    });
                });
        });
}

class Endpoints {
    static baseUrl = 'https://eun1.api.riotgames.com/lol';

    static SummonerV4ByName(summonerName) {
        return `${this.baseUrl}/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;
    }

    static LeagueV4BySummoner(summonerId) {
        return `${this.baseUrl}/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`;
    }

    static MatchV4Matchlist(accountId) {
        return `${this.baseUrl}/match/v4/matchlists/by-account/${accountId}?endIndex=10&begindIndex=0&api_key=${apiKey}`;
    }

    static MatchV4MatchById(gameId) {
        return `${this.baseUrl}/match/v4/matches/${gameId}?api_key=${apiKey}`;
    }

    static DDragonProfileIcon(profileIconId) {
        return `http://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/${profileIconId}.png`;
    }

    static OPGGTierImage(tier) {
        return `https://opgg-static.akamaized.net/images/medals/${tier}_1.png`;
    }

    static OPGGTierImageDefault = 'https://opgg-static.akamaized.net/images/medals/default.png';
}