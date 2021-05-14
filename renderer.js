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
    },
    uiStates: {
        load: "load",
        loaded: "loaded"
    },
    currentSummoner: {
        summonerObject: null,
        loadedMatches: null
    },
    DDragon: {
        Version: '11.8.1',
        Image: {
            ProfileIcon(profileIconId) {
                return `http://ddragon.leagueoflegends.com/cdn/${lolprofiler.DDragon.Version}/img/profileicon/${profileIconId}.png`;
            },
            ChampionSquare(imageName) {
                return `http://ddragon.leagueoflegends.com/cdn/${lolprofiler.DDragon.Version}/img/champion/${imageName}`;
            },
            SummonerSpell(imageName) {
                return `http://ddragon.leagueoflegends.com/cdn/${lolprofiler.DDragon.Version}/img/spell/${imageName}`;
            },
            Rune(imageName) {
                return `./ddragon/img/${imageName}`;
            },
            RankedEmblem(tier) {
                return `./ddragon/img/ranked-emblems/Emblem_${tier}.png`;
            },
            Item(itemId) {
                return `http://ddragon.leagueoflegends.com/cdn/${lolprofiler.DDragon.Version}/img/item/${itemId}.png`
            }
        }
    },
    updateUIState(state) {
        if (state == lolprofiler.uiStates.load) {
            this.controls.main.classList.add('hide');
            this.controls.main.classList.add('loading');
            this.controls.nameInput.setAttribute('disabled', '');
        } else if (state == lolprofiler.uiStates.loaded) {
            this.controls.main.classList.remove('hide');
            this.controls.main.classList.remove('loading');
            this.controls.main.classList.add("profile-loaded");
            this.controls.nameInput.removeAttribute('disabled', '');
        }
    },
    init() {
        toast.config.container = lolprofiler.controls.toastContainer;

        this.controls.nameInput.addEventListener('focus', () => this.controls.main.classList.add("hide"));

        this.controls.nameInput.addEventListener('focusout', () => {
            if (!this.controls.main.classList.contains("profile-loaded")) {
                return;
            }
        
            this.controls.main.classList.remove("hide")
        });

        this.controls.favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
        
            let savedSummonerName = localStorage.getItem(this.localStorageKeys.summonerName);
        
            if (savedSummonerName) {
                putNameAnimation(savedSummonerName);
            }
        });

        this.controls.saveSettingsFormBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem(this.localStorageKeys.summonerName, this.controls.saveSettingsFormInput.value);
            toast.create("Saved");
        });
        
        this.controls.closeSettingsFormBtn.addEventListener("click", (e) => {
            e.preventDefault();
        
            this.controls.profileForm.classList.remove('show');
            this.controls.main.classList.remove("hide-entirely");
        });

        this.controls.profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
        
            this.controls.profileForm.classList.add('show');
            this.controls.main.classList.add("hide-entirely");
        
            let savedSummonerName = localStorage.getItem(this.localStorageKeys.summonerName);
        
            if (savedSummonerName) {
                this.controls.saveSettingsFormInput.value = savedSummonerName;
            }
        });

        this.controls.nameInput.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              
              fetchProfile(this.controls.nameInput.value);
            }
        });

        this.controls.searchBtn.addEventListener('click', () => fetchProfile(this.controls.nameInput.value));
    }
}

lolprofiler.init();

window.addEventListener('load', () => setTimeout(() => {
    let placeholder = lolprofiler.constants.inputNamePlaceholder;
    
    for (let i = 0; i < placeholder.length; i++) {
        let char = placeholder[i];
        let timeout = 50 * (char != " " ? i : (i - 1));
        setTimeout(() => {
            lolprofiler.controls.nameInput.placeholder += char;
        }, timeout);
    }
}, 500));

function handleSummoner(summoner) {
    lolprofiler.controls.profileName.innerText = summoner.name;
    lolprofiler.controls.profileLevel.innerText = summoner.summonerLevel;
    lolprofiler.controls.profileIcon.src = lolprofiler.DDragon.Image.ProfileIcon(summoner.profileIconId);
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
        <img width="100" height="100" src="${lolprofiler.DDragon.Image.RankedEmblem(queue.tier[0] + queue.tier.substring(1).toLowerCase())}"/>
        <div class="rank-text">${queue.tier} ${queue.rank}</div>
        `;
        lolprofiler.controls.rankWrapper.appendChild(rankedInfo);
    })
}

function handleSummary(summary) {
    let winsPercentage = (summary.wins / summary.total) * 100
    let losePercentage = 100 - winsPercentage;

    lolprofiler.controls.summaryWrapper.innerHTML = `
    <div class="summary-progress">
        <div class="progress win" style="width: ${winsPercentage.toFixed(2)}%">
            <span>${winsPercentage}%</span>
        </div>
        <div class="progress lose" style="width: ${losePercentage.toFixed(2)}%">
            <span>${losePercentage}%</span>
        </div>
    </div>
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
                teams,
                game.gameCreation
                ).ToNode()
        );

        
    });

    let loadMoreBtn = document.createElement('a');
    loadMoreBtn.href = '#';
    loadMoreBtn.innerText = 'Load More';
    loadMoreBtn.className = 'btn';
    loadMoreBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        loadMoreBtn.innerHTML = '<i class="fas fa-spinner"></i>';
        loadMoreBtn.classList.add('spinning');

        let loadedMatches = lolprofiler.currentSummoner.loadedMatches;

        let matchList = await riotapi.MatchlistByAccountId(summoner.accountId, loadedMatches.length, loadedMatches.length + 10);
        let matchRequests = [];
        matchList.matches.forEach((match) => matchRequests.push(riotapi.MatchById(match.gameId)));

        let matches = loadedMatches.concat(await Promise.all(matchRequests));
        handleMatches(matches, summoner);
        lolprofiler.currentSummoner.loadedMatches = matches;
    });
    lolprofiler.controls.matchesWrapper.appendChild(loadMoreBtn);

    handleSummary(summary);
}

async function fetchProfile(summonerName) {
    lolprofiler.updateUIState(lolprofiler.uiStates.load);

    let summoner = await riotapi.SummonerByName(summonerName)
    lolprofiler.currentSummoner.summonerObject = summoner;
    handleSummoner(summoner);

    let queues = await riotapi.LeagueBySummonerId(summoner.id);
    handleQueues(queues);

    let matchList = await riotapi.MatchlistByAccountId(summoner.accountId);
    let matchRequests = [];
    matchList.matches.forEach((match) => matchRequests.push(riotapi.MatchById(match.gameId)));

    let matches = await Promise.all(matchRequests);
    handleMatches(matches, summoner);
    lolprofiler.currentSummoner.loadedMatches = matches;

    lolprofiler.updateUIState(lolprofiler.uiStates.loaded);
}

class Game {
    constructor(isWin, champion, kda, gameLength, queue, longAgo, stats, teams, gameCreation) {
        this.isWin = isWin;
        this.champion = champion;
        this.kda = kda;
        this.gameLength = gameLength;
        this.queue = queue;
        this.longAgo = longAgo;
        this.stats = stats;
        this.teams = teams;
        this.gameCreation = gameCreation;
    }

    ToNode() {
        console.log(this.champion)
        let itemsString = '';

        this.stats.items.forEach((item) => {
            if (item != 0) {
                itemsString += `<div class="tooltip-container"><img class="tooltip" src="${lolprofiler.DDragon.Image.Item(item)}" /><span class="tooltip-content">${lol.ddragon.item.data[item].name}</span></div>`;
            } else {
                itemsString += '<div><img class="no-image" /></div>'
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

        console.log(this);

        let now = Date.now();

        let gameDate = longAgo(now - this.gameCreation);

        let gameType = lol.constants.queues.find(q => q.id == this.queue.queueId);

        match.innerHTML = 
        `
        <div class="match-info">
            <div class="tooltip-container"><div class="tooltip">${gameType.name}</div><span class="tooltip-content">${gameType.tooltip}</span></div>
            <div>${gameDate}</div>
            <div class="seperator"></div>
            <div class="result">${winText}</div>
            <div>${this.gameLength}</div>
        </div>
        <div class="setup">
            <div class="additional-info">
                <div class="champion-image">
                    <img src="${lolprofiler.DDragon.Image.ChampionSquare(this.champion.image.full)}"/>
                </div>
                <div class="masteries">
                    <div class="summoner-spells">
                        <img src="${lolprofiler.DDragon.Image.SummonerSpell(this.stats.summonerSpell1.image.full)}"/>
                        <img src="${lolprofiler.DDragon.Image.SummonerSpell(this.stats.summonerSpell2.image.full)}"/>
                    </div>
                    <div class="runes">
                        <div class="tooltip-container">
                            <div class="tooltip">
                                <img src="${lolprofiler.DDragon.Image.Rune(this.stats.keystone.icon)}"/>
                            </div>
                            <span class="tooltip-content">${this.stats.keystone.name}</span>
                        </div>
                        <div class="tooltip-container">
                            <div class="tooltip">
                                <img src="${lolprofiler.DDragon.Image.Rune(this.stats.secondaryKeystone.icon)}"/>
                            </div>
                            <span class="tooltip-content">${this.stats.secondaryKeystone.name}</span>
                        </div>
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

function longAgo(difference) {
    let seconds = difference / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;

    if (days >= 1) {
        return Math.round(days) + ' days ago';
    }

    if (hours >= 1) {
        return Math.round(hours) + ' hours ago';
    }

    if (minutes >= 1) {
        return Math.round(minutes) + ' min ago';
    }

    return Math.round(seconds) + ' seconds ago'
}