let lolprofiler = {
    controls: {
        searchBtn: document.querySelector('#search-btn'),
        nameInput: document.querySelector('#input-name'),
        profileName: document.querySelector('.profile-name'),
        profileLevel: document.querySelector('.profile-level'),
        profileIcon: document.querySelector('.profile-icon img'),
        rankWrapper: document.querySelector('.rank-wrapper'),
        summaryWrapper: document.querySelector('.summary'),
        matchesWrapper: document.querySelector('.matches-wrapper'),
        main: document.querySelector('.container'),
        profileBtn: document.querySelector('.settings-btn'),
        profileForm: document.querySelector('.settings-form'),
        closeSettingsFormBtn: document.querySelector('.settings-form .close-btn'),
        saveSettingsFormBtn: document.querySelector('.settings-form .save-btn'),
        saveSettingsFormInput: document.querySelector('.settings-form .summoner-name-input'),
        favoriteBtn: document.querySelector('.favorite-btn'),
        toastContainer: document.querySelector('.toast-container'),
    },
    localStorageKeys: {
        summonerName: "summonerName",
    },
    constants: {
        inputNamePlaceholder: "Summoner Name"
    }
}

toast.config.container = lolprofiler.controls.toastContainer;

function addPlaceholder() {
    let placeholder = lolprofiler.constants.inputNamePlaceholder;
    
    for (let i = 0; i < placeholder.length; i++) {
        let char = placeholder[i];
        let timeout = 50 * (char != " " ? i : (i - 1));
        setTimeout(() => {
            lolprofiler.controls.nameInput.placeholder += char;
        }, timeout);
    }
}

lolprofiler.controls.nameInput.addEventListener('focus', () => lolprofiler.controls.main.classList.add("hide"))
lolprofiler.controls.nameInput.addEventListener('focusout', () => {
    if (!lolprofiler.controls.main.classList.contains("profile-loaded")) {
        return;
    }

    lolprofiler.controls.main.classList.remove("hide")
})

window.addEventListener('load', () => setTimeout(addPlaceholder, 100));

lolprofiler.controls.favoriteBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let savedSummonerName = localStorage.getItem(lolprofiler.localStorageKeys.summonerName);

    if (savedSummonerName) {
        putNameAnimation(savedSummonerName);
    }
});

lolprofiler.controls.saveSettingsFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem(lolprofiler.localStorageKeys.summonerName, lolprofiler.controls.saveSettingsFormInput.value);
    toast.create("Saved");
})

lolprofiler.controls.closeSettingsFormBtn.addEventListener("click", (e) => {
    e.preventDefault();

    lolprofiler.controls.profileForm.classList.remove('show');
    lolprofiler.controls.main.classList.remove("hide-entirely");
})

lolprofiler.controls.profileBtn.addEventListener("click", (e) => {
    e.preventDefault();

    lolprofiler.controls.profileForm.classList.add('show');
    lolprofiler.controls.main.classList.add("hide-entirely");

    let savedSummonerName = localStorage.getItem(lolprofiler.localStorageKeys.summonerName);

    if (savedSummonerName) {
        lolprofiler.controls.saveSettingsFormInput.value = savedSummonerName;
    }
})

lolprofiler.controls.nameInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      
      fetchProfile(lolprofiler.controls.nameInput.value);
    }
  });

lolprofiler.controls.searchBtn.addEventListener('click', () => fetchProfile(lolprofiler.controls.nameInput.value));

function handleSummoner(summoner) {
    lolprofiler.controls.profileName.innerText = summoner.name;
    lolprofiler.controls.profileLevel.innerText = summoner.summonerLevel;
    lolprofiler.controls.profileIcon.src = Endpoints.DDragon.Image.ProfileIcon(summoner.profileIconId);
}

function handleQueues(queues) {
    lolprofiler.controls.rankWrapper.innerHTML = '';

    if (queues.length == 0) {
        let rankedInfo = document.createElement('div');
        rankedInfo.className = 'rank-info';
        lolprofiler.controls.rankWrapper.appendChild(rankedInfo);
        
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
        lolprofiler.controls.rankWrapper.appendChild(rankedInfo);
    })
}

function handleSummary(summary) {
    lolprofiler.controls.summaryWrapper.innerHTML = `
    <div>Total: ${summary.total}</div>
    <div>Wins: ${summary.wins}</div>
    <div>Loses: ${summary.loses}</div>
    `
}

function handleMatches(matches, summoner) {
    lolprofiler.controls.matchesWrapper.innerHTML = '';
                        
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

        let teams = [
            game.participants.filter((p) => p.teamId == 100).map((p) => game.participantIdentities.find(identity => identity.participantId == p.participantId)),
            game.participants.filter((p) => p.teamId == 200).map((p) => game.participantIdentities.find(identity => identity.participantId == p.participantId))
        ];

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

        lolprofiler.controls.matchesWrapper.appendChild(
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
    lolprofiler.controls.main.classList.add('hide');
    lolprofiler.controls.main.classList.add('loading');
    lolprofiler.controls.nameInput.setAttribute('disabled', '');

    let summoner = await customFetch(Endpoints.SummonerV4ByName(summonerName));
    handleSummoner(summoner);

    let queues = await customFetch(Endpoints.LeagueV4BySummoner(summoner.id));
    handleQueues(queues);

    let matchList = await customFetch(Endpoints.MatchV4Matchlist(summoner.accountId));
    let matchRequests = [];
    matchList.matches.forEach((match) => matchRequests.push(customFetch(Endpoints.MatchV4MatchById(match.gameId))));

    let matches = await Promise.all(matchRequests);
    handleMatches(matches, summoner);

    lolprofiler.controls.main.classList.remove('hide');
    lolprofiler.controls.main.classList.remove('loading');
    lolprofiler.controls.main.classList.add("profile-loaded");
    lolprofiler.controls.nameInput.removeAttribute('disabled', '');
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

        var teamsString = '';

        this.teams.forEach((team) => {
            let teamString = '<div class="team">';
            team.forEach(p => {
                if (p.accountId != "0") { // is player
                    teamString += `
                    <a href="#" class="summoner" onclick="putNameAnimation('${p.player.summonerName}')">
                    <div class="summoner-name">${p.player.summonerName}</div>
                    </a>
                    `  
                } else {
                    teamString += `
                    <a href="#" class="summoner" onclick="putNameAnimation('${p.player.summonerName}')">
                    <div class="summoner-name">${p.player.summonerName} Bot</div>
                    </a>
                    `  
                }
            })
            teamsString += teamString + "</div>";
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
            ${teamsString}
        </div>
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

function putNameAnimation(name) {
    lolprofiler.controls.nameInput.value = '';
    for (let i = 0; i < name.length; i++) {
        setTimeout(() => {
            lolprofiler.controls.nameInput.value += name[i];
        }, 50 * i);

        if (i + 1 >= name.length) {
            setTimeout(() => fetchProfile(name), (50 * i) + 50);
        }
    }
}