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
        winBar: document.querySelector('.progress.win'),
        winBarSpan: document.querySelector('.progress.win > span'),
        loseBar: document.querySelector('.progress.lose'),
        loseBarSpan: document.querySelector('.progress.lose > span'),
        masteryWrapper: document.querySelector('.mastery')
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
    },
    loadBars() {
        setTimeout(() => {
            let progressBars = document.querySelectorAll('.summary-progress .progress');

            for (let i = 0; i < progressBars.length; i++) {
                let bar = progressBars[i];
                let barWidth = bar.getAttribute('data-width');
                bar.setAttribute('style', `width: ${barWidth}%;`);
            }

        }, 500)
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

    lolprofiler.controls.winBar.setAttribute('data-width', winsPercentage.toFixed(2));
    lolprofiler.controls.loseBar.setAttribute('data-width', losePercentage.toFixed(2));

    lolprofiler.controls.winBarSpan.innerText = Math.round(winsPercentage) + '%';
    lolprofiler.controls.loseBarSpan.innerText = Math.round(losePercentage) + '%';

    lolprofiler.loadBars()
}

function handleMastery(championMastery) {
    lolprofiler.controls.masteryWrapper.innerHTML = '';

    championMastery = championMastery.slice(0, 10);
    let championsWrapper = document.createElement('div');
    championsWrapper.className = 'champions-wrapper';

    let champions = Object.values(lol.ddragon.champion.data);
    
    championMastery.forEach((mastery) => {
        let champ = champions.find(x => x.key == mastery.championId);

        let championMastery = document.createElement('div');
        championMastery.className = 'mastery-champ';
        championMastery.innerHTML = 
        `
        <div class="tooltip-container mastery-image-wrapper">
            <span class="champion-level">${Math.round(mastery.championPoints / 1000)}K</span>
            <img class="tooltip" src="${lolprofiler.DDragon.Image.ChampionSquare(champ.image.full)}"/>
            <div class="tooltip-content">
                <span>${champ.name}</span>
                <span class="line"></span>
                <span>Level ${mastery.championLevel}</span>
            </div>
        </div>
        `;

        championsWrapper.appendChild(championMastery);
    });

    lolprofiler.controls.masteryWrapper.appendChild(championsWrapper);
}

function handleV5Matches(matches, summoner) {
    lolprofiler.controls.matchesWrapper.innerHTML = '';

    matches.sort((a, b) => (a.info.gameCreation > b.info.gameCreation) ? -1 : 1)

    let summary = {
        wins: 0,
        loses: 0,
        total: matches.length
    }

    matches.forEach(game => {
        let participant = game.info.participants.find(p => p.puuid == summoner.puuid)
        let team = game.info.teams.find(t => t.teamId == participant.teamId);

        if (team.win) {
            summary.wins += 1;
        } else {
            summary.loses += 1;
        }

        let champion = Object.values(lol.ddragon.champion.data).find(champ => champ.key == participant.championId);

        let queue = lol.ddragon.queues.find(q => q.queueId == game.info.queueId);

        let teamKills = game.info.participants.filter((p) => p.teamId == participant.teamId).map(x => x.kills).reduce((a, b) => a + b, 0);
        let participantsDamage = game.info.participants.map(x => x.totalDamageDealtToChampions);
        let maxDamage = 0;

        participantsDamage.forEach(damage => {
            if (damage > maxDamage) {
                maxDamage = damage
            }
        })

        let keystone = lol.ddragon.runesReforged.find(x => x.id == participant.perks.styles[0].style).slots[0].runes.find(x => x.id == participant.perks.styles[0].selections[0].perk);
        let secondaryRunePath = lol.ddragon.runesReforged.find(x => x.id == participant.perks.styles[1].style);

        let items = [participant.item0, participant.item1, participant.item2, participant.item6, participant.item3, participant.item4, participant.item5];

        let teams = [
            game.info.participants.filter((p) => p.teamId == 100),
            game.info.participants.filter((p) => p.teamId == 200)
        ];

        let summonerSpells = Object.values(lol.ddragon.summoner.data);

        let stats = {
            level: participant.champLevel,
            creepScore: participant.totalMinionsKilled,
            killPercentage: Math.round(((participant.kills + participant.assists) / teamKills) * 100),
            summonerSpell1: summonerSpells.find(spell => spell.key == participant.summoner1Id),
            summonerSpell2: summonerSpells.find(spell => spell.key == participant.summoner2Id),
            keystone: keystone,
            secondaryKeystone: secondaryRunePath,
            items: items,
            damage: participant.totalDamageDealtToChampions,
            maxDamage: maxDamage
        }

        lolprofiler.controls.matchesWrapper.appendChild(
            new Game(
                team.win,
                champion,
                {
                    kills: participant.kills,
                    deaths: participant.deaths,
                    assists: participant.assists
                },
                `${Math.floor(((game.info.gameDuration / 1000) / 60))}m ${(Math.floor((game.info.gameDuration / 1000) % 60))}s`,
                queue,
                null,
                stats,
                teams,
                game.info.gameCreation,
                game.info.gameDuration
                ).ToNode()
        );
    });

    let loadMoreBtn = document.createElement('a');
    loadMoreBtn.href = '#';
    loadMoreBtn.innerText = 'Load More';
    loadMoreBtn.className = 'btn load-more-btn';
    loadMoreBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        loadMoreBtn.innerHTML = '<i class="fas fa-spinner"></i>';
        loadMoreBtn.classList.add('spinning');

        let loadedMatches = lolprofiler.currentSummoner.loadedMatches;

        let matchList = await riotapi.V5MatchlistByPUUID(summoner.puuid, loadedMatches.length);
        let matchRequests = [];
        matchList.forEach(matchId => matchRequests.push(riotapi.V5MatchById(matchId)));

        let matches = loadedMatches.concat(await Promise.all(matchRequests));
        handleV5Matches(matches, summoner);
        lolprofiler.currentSummoner.loadedMatches = matches;
    });
    lolprofiler.controls.matchesWrapper.appendChild(loadMoreBtn);

    handleSummary(summary);
}

async function fetchProfile(summonerName) {
    lolprofiler.updateUIState(lolprofiler.uiStates.load);

    let summonerResponse = await riotapi.SummonerByName(summonerName)
    if (summonerResponse.status == 404) {
        toast.create('Error Summoner not found!')
        lolprofiler.updateUIState(lolprofiler.uiStates.loaded);
        return;
    }

    let summoner = await summonerResponse.json();

    lolprofiler.currentSummoner.summonerObject = summoner;
    handleSummoner(summoner);

    let mastery = await riotapi.MasteryBySummonerId(summoner.id);
    handleMastery(mastery);

    let queues = await riotapi.LeagueBySummonerId(summoner.id);
    handleQueues(queues);

    let matchList = await riotapi.V5MatchlistByPUUID(summoner.puuid);
    let matchRequests = [];
    matchList.forEach(matchId => matchRequests.push(riotapi.V5MatchById(matchId)));

    let matches = await Promise.all(matchRequests);
    handleV5Matches(matches, summoner);
    lolprofiler.currentSummoner.loadedMatches = matches;

    lolprofiler.updateUIState(lolprofiler.uiStates.loaded);
}

class Game {
    constructor(isWin, champion, kda, gameLength, queue, longAgo, stats, teams, gameCreation, gameDuration) {
        this.isWin = isWin;
        this.champion = champion;
        this.kda = kda;
        this.gameLength = gameLength;
        this.queue = queue;
        this.longAgo = longAgo;
        this.stats = stats;
        this.teams = teams;
        this.gameCreation = gameCreation;
        this.gameDuration = gameDuration;
    }

    ToNode() {
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
                if (p.puuid != "0") { // is player
                    teamString += `
                    <a href="#" class="summoner" onclick="putNameAnimation('${p.summonerName}')">
                    <div class="summoner-name">${p.summonerName}</div>
                    </a>
                    `  
                } else {
                    teamString += `
                    <a href="#" class="summoner" onclick="putNameAnimation('${p.summonerName}')">
                    <div class="summoner-name">${p.summonerName} Bot</div>
                    </a>
                    `  
                }
            })
            teamsString += teamString + "</div>";
        })

        let winText = this.isWin ? 'Victory' : 'Defeat';
        let match = document.createElement('div');
        match.className = 'match ' + winText.toLowerCase();

        let now = Date.now();

        let gameDate = longAgo(now - this.gameCreation - this.gameDuration);

        let gameType = lol.constants.queues.find(q => q.id == this.queue.queueId);

        console.log(this.stats)

        match.innerHTML = 
        `
        <div class="match-info">
            <div class="tooltip-container"><div class="tooltip">${gameType.name}</div><span class="tooltip-content">${gameType.tooltip}</span></div>
            <div class="tooltip-container"><div class="tooltip">${gameDate}</div><span class="tooltip-content">${dateToCustomString(new Date(this.gameCreation))}</span></div>
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
            <div class="tooltip-container">
                <div class="damage-meter tooltip">
                    <div class="damage" style="width: ${Math.round((this.stats.damage / this.stats.maxDamage) * 100)}%">${Math.round(this.stats.damage / 1000)}K</div>
                </div>
                <div class="tooltip-content">
                    <span>Total Damage Done</span>
                    <span class="line"></span>
                    <span class="small">* to champions</span>
                </div>
            </div>
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

function dateToCustomString(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}<br>${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
}