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
        masteryWrapper: document.querySelector('.mastery'),
        recentlyWrapper: document.querySelector('.recently-wrapper'),
        selectGameType: document.querySelector('.game-type'),
        filterBtn: document.querySelector('.filter-btn')
    },
    localStorageKeys: {
        summonerName: "summonerName",
    },
    constants: {
        inputNamePlaceholder: "Summoner Name"
    },
    uiStates: {
        load: "load",
        loaded: "loaded",
        error: "error"
    },
    currentSummoner: {
        summonerObject: null,
        loadedMatches: null
    },
    DDragon: {
        Version: lol.ddragon.version,
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
        } else if (state == lolprofiler.uiStates.error) {
            this.controls.main.classList.remove('profile-loaded');
            this.controls.main.classList.remove('loading');
            this.controls.main.classList.add('hide');
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

        let queues = lol.constants.queues.filter(q => q.showInSelect);
        
        let gameTypeDefaultOption = document.createElement('option');
        gameTypeDefaultOption.innerText = 'All'
        gameTypeDefaultOption.value = -1;
        this.controls.selectGameType.appendChild(gameTypeDefaultOption);

        queues.forEach(q => {
            let opt = document.createElement('option');
            opt.innerText = q.name;
            opt.value = q.id;
            this.controls.selectGameType.appendChild(opt);
        });

        this.controls.filterBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            let queueId = parseInt(this.controls.selectGameType.value);

            if (queueId == -1) {
                return;
            }

            let summoner = lolprofiler.currentSummoner.summonerObject;

            let matchList = await riotapi.V5MatchlistByPUUID(summoner.puuid, 0, 10, queueId);
            let matchRequests = [];
            matchList.forEach(matchId => matchRequests.push(riotapi.V5MatchById(matchId)));

            let matchResponses = await Promise.all(matchRequests);
            let matches = await handleMatcheResponses(matchResponses);

            handleV5Matches(matches, summoner);
            lolprofiler.currentSummoner.loadedMatches = matches;
        })
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

function addLoadMoreBtn() {
    let loadMoreBtn = document.createElement('a');
    loadMoreBtn.href = '#';
    loadMoreBtn.innerText = 'Load More';
    loadMoreBtn.className = 'btn load-more-btn';
    loadMoreBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        loadMoreBtn.innerHTML = '<i class="fas fa-spinner"></i>';
        loadMoreBtn.classList.add('spinning');

        let loadedMatches = lolprofiler.currentSummoner.loadedMatches;
        let summoner = lolprofiler.currentSummoner.summonerObject;

        let matchList = await riotapi.V5MatchlistByPUUID(summoner.puuid, loadedMatches.length);
        let matchRequests = [];
        matchList.forEach(matchId => matchRequests.push(riotapi.V5MatchById(matchId)));

        let matches = loadedMatches.concat(await Promise.all(matchRequests));
        handleV5Matches(matches, summoner);
        lolprofiler.currentSummoner.loadedMatches = matches;
    });
    lolprofiler.controls.matchesWrapper.appendChild(loadMoreBtn);
}

function createMasteryElement(mastery, champions) {
    let champ = champions.find(x => x.key == mastery.championId);

    let points = `${Math.round(mastery.championPoints / 1000)}K`;
    let championSquareImage = lolprofiler.DDragon.Image.ChampionSquare(champ.image.full);

    let championMastery = document.createElement('div');
    championMastery.className = 'mastery-champ';
    championMastery.innerHTML = 
    `
    <div class="tooltip-container mastery-image-wrapper">
        <span class="champion-level">${points}</span>
        <img class="tooltip" src="${championSquareImage}"/>
        <div class="tooltip-content">
            <span>${champ.name}</span>
            <span class="line"></span>
            <span>Level ${mastery.championLevel}</span>
        </div>
    </div>
    `;
    return championMastery;
}

function createItemsElement(items) {
    let html = '';
    items.forEach((item) => {
        if (item != 0) {
            html += `<div class="tooltip-container"><img class="tooltip" src="${lolprofiler.DDragon.Image.Item(item)}" /><span class="tooltip-content">${lol.ddragon.item.data[item].name}</span></div>`;
        } else {
            html += '<div><img class="no-image" /></div>'
        }
    });

    return html;
}

function createTeamsElement(teams) {
    let html = '';
    let champions = Object.values(lol.ddragon.champion.data);

    teams.forEach((teamObj) => {
        let team = '<div class="team">';
        teamObj.forEach(p => {
            let champ = champions.find(x => x.key == p.championId) ?? champions.find(x => x.name == p.championName);
            if (p.puuid != "BOT") { // is player
                team += `
                    <a href="#" class="summoner" onclick="putNameAnimation('${p.summonerName}')">
                        <img class="summoner-champ-icon" src="${lolprofiler.DDragon.Image.ChampionSquare(champ.image.full)}" />
                        <div class="summoner-name">${p.summonerName}</div>
                    </a>
                    `
            } else {
                team += `
                    <a href="#" class="summoner">
                        <img class="summoner-champ-icon" src="${lolprofiler.DDragon.Image.ChampionSquare(champ.image.full)}" />
                        <div class="summoner-name">${p.summonerName} <span class="bot-label">Bot</span></div>
                    </a>
                    `
            }
        })

        html += team + "</div>";
    })

    return html;
}

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

function handleRecently(recentlyPlayedWith) {
    lolprofiler.controls.recentlyWrapper.innerHTML = "";

    let keys = Object.keys(recentlyPlayedWith);
    let recentlies = keys.filter(k => recentlyPlayedWith[k].times > 1).slice(0, 5).map(k => {
        return {"name": k, "times": recentlyPlayedWith[k].times}
    });

    recentlies.sort((a, b) => (a.times > b.times) ? -1 : 1)

    let recentliesHtml = '';

    recentlies.forEach(recently => {
        recentliesHtml += `
        <div class="section-header recently-summoner">
            <a href="#" class="summoner" onclick="putNameAnimation('${recently.name}')">${recently.name}</a>
            <span class="section-line"></span>
            <span class="recently-times">${recently.times} Games</span>
        </div>`
    })

    lolprofiler.controls.recentlyWrapper.innerHTML = recentliesHtml;
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
    
    championMastery.forEach((mastery) => championsWrapper.appendChild(createMasteryElement(mastery, champions)));

    lolprofiler.controls.masteryWrapper.appendChild(championsWrapper);
}

function handleV5Matches(matches, summoner) {
    lolprofiler.controls.matchesWrapper.innerHTML = '';

    matches.sort((a, b) => (a.info.gameCreation > b.info.gameCreation) ? -1 : 1)

    let allSummonerNames = ([].concat.apply([], matches.map(g => g.info.participants))).filter(p => p.puuid != 'BOT').map(p => p.summonerName);

    let recentlyPlayedWith = {};

    allSummonerNames.forEach(name => {
        if (name == summoner.name) {
            return;
        }

        if (recentlyPlayedWith[name]) {
            recentlyPlayedWith[name].times++
        } else {
            recentlyPlayedWith[name] = {times: 1};
        }
    });
    
    handleRecently(recentlyPlayedWith)

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

        let gameObj = {
            isWin: team.win,
            champion: champion,
            kda: {
                kills: participant.kills,
                deaths: participant.deaths,
                assists: participant.assists
            },
            gameLength: `${Math.floor(((game.info.gameDuration / 1000) / 60))}m ${(Math.floor((game.info.gameDuration / 1000) % 60))}s`,
            queue: queue,
            stats: stats,
            teamsObj: teams,
            gameCreation: game.info.gameCreation,
            gameDuration: game.info.gameDuration,
        }

        lolprofiler.controls.matchesWrapper.appendChild(createGame(gameObj));
    });

    addLoadMoreBtn();

    handleSummary(summary);
}

async function handleMatcheResponses(matchResponses) {
    let matches = []
    for (let i = 0; i < matchResponses.length; i++) {
        let matchResponse = matchResponses[i];
        if (matchResponse.status == 200) {
            let json = await matchResponse.json;
            matches.push(json)   
        } else {
            let matchId = matchResponse.urlSegments[matchResponse.urlSegments - 1].split('?')[0];
            APIErrorsHandler.Match(matchResponse.status, matchId);
        }
    }
    return matches;
}

async function fetchProfile(summonerName) {
    lolprofiler.updateUIState(lolprofiler.uiStates.load);

    let summonerResponse = await riotapi.SummonerByName(summonerName)

    if (summonerResponse.status > 400) {
        APIErrorsHandler.Summoner(summonerResponse.status);
        return;
    }

    let summoner = await summonerResponse.json;

    lolprofiler.currentSummoner.summonerObject = summoner;
    handleSummoner(summoner);

    let mastery = await riotapi.MasteryBySummonerId(summoner.id);
    handleMastery(mastery);

    let queues = await riotapi.LeagueBySummonerId(summoner.id);
    handleQueues(queues);

    let matchList = await riotapi.V5MatchlistByPUUID(summoner.puuid);
    let matchRequests = [];
    matchList.forEach(matchId => matchRequests.push(riotapi.V5MatchById(matchId)));

    let matchResponses = await Promise.all(matchRequests);
    let matches = await handleMatcheResponses(matchResponses);

    handleV5Matches(matches, summoner);
    lolprofiler.currentSummoner.loadedMatches = matches;

    lolprofiler.updateUIState(lolprofiler.uiStates.loaded);
}

let APIErrorsHandler = {
    Summoner(status) {
        switch (status) {
            case 404: 
                toast.create('Error Summoner not found!')
                lolprofiler.updateUIState(lolprofiler.uiStates.loaded);
                break;
            case 403: 
                toast.create('Error Currently the Riot API is down!');
                lolprofiler.updateUIState(lolprofiler.uiStates.error);
                break;
            default:
                toast.create('Unexpected API failure!')
                lolprofiler.updateUIState(lolprofiler.uiStates.error);
                break;
        }
    },
    Match(status, matchId) {
        if (status == 404) {
            console.error(`Couldn't find a match with ${matchId} so its skipped!`)
        }
    }
}

function createGame(game) {
    let items = createItemsElement(game.stats.items);

    let teams = createTeamsElement(game.teamsObj);

    let winText = game.isWin ? 'Victory' : 'Defeat';
    let match = document.createElement('div');
    match.className = `match ${game.isWin ? 'victory' : 'defeat'}`;

    let now = Date.now();

    let gameDate = longAgo(now - game.gameCreation - game.gameDuration);

    let gameType = lol.constants.queues.find(q => q.id == game.queue.queueId);

    match.innerHTML =
        `
        <div class="match-info">
            <div class="tooltip-container"><div class="tooltip">${gameType.name}</div><span class="tooltip-content">${gameType.tooltip}</span></div>
            <div class="tooltip-container"><div class="tooltip">${gameDate}</div><span class="tooltip-content">${dateToCustomString(new Date(game.gameCreation))}</span></div>
            <div class="seperator"></div>
            <div class="result">${winText}</div>
            <div>${game.gameLength}</div>
        </div>
        <div class="setup">
            <div class="additional-info">
                <div class="champion-image">
                    <img src="${lolprofiler.DDragon.Image.ChampionSquare(game.champion.image.full)}"/>
                </div>
                <div class="masteries">
                    <div class="summoner-spells">
                        <img src="${lolprofiler.DDragon.Image.SummonerSpell(game.stats.summonerSpell1.image.full)}"/>
                        <img src="${lolprofiler.DDragon.Image.SummonerSpell(game.stats.summonerSpell2.image.full)}"/>
                    </div>
                    <div class="runes">
                        <div class="tooltip-container">
                            <div class="tooltip">
                                <img src="${lolprofiler.DDragon.Image.Rune(game.stats.keystone.icon)}"/>
                            </div>
                            <span class="tooltip-content">${game.stats.keystone.name}</span>
                        </div>
                        <div class="tooltip-container">
                            <div class="tooltip">
                                <img src="${lolprofiler.DDragon.Image.Rune(game.stats.secondaryKeystone.icon)}"/>
                            </div>
                            <span class="tooltip-content">${game.stats.secondaryKeystone.name}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="champion-name">${game.champion.name}</div>
        </div>
        <div class="score">
            <div>${game.kda.kills} / <span class="deaths">${game.kda.deaths}</span> / ${game.kda.assists}</div>
            <div>${game.kda.deaths == 0 ? 'Perfect KDA' : `${((game.kda.kills + game.kda.assists) / game.kda.deaths).toFixed(2)}:1 KDA`}</div>
            <div class="tooltip-container">
                <div class="damage-meter tooltip">
                    <div class="damage" style="width: ${Math.round((game.stats.damage / game.stats.maxDamage) * 100)}%">${Math.round(game.stats.damage / 1000)}K</div>
                </div>
                <div class="tooltip-content">
                    <span>Total Damage Done</span>
                    <span class="line"></span>
                    <span class="small">* to champions</span>
                </div>
            </div>
        </div>
        <div class="stats">
            <div>Level ${game.stats.level}</div>
            <div>${game.stats.creepScore} CS</div>
            <div>P/Kill ${game.stats.killPercentage}%</div>
        </div>
        <div class="items">
            ${items}
        </div>
        <div class="players">
            ${teams}
        </div>
        `;

    return match;
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
    let time = {
        hours: zeroPadStart(date.getHours()),
        minutes: zeroPadStart(date.getMinutes()),
        seconds: zeroPadStart(date.getSeconds()),
        date: zeroPadStart(date.getDate()),
        month: zeroPadStart(date.getMonth()),
        year: zeroPadStart(date.getFullYear()),
    };
    
    return `${time.hours}:${time.minutes}:${time.seconds}<br>${time.date}/${time.month}/${time.year}`;
}

function zeroPadStart(number) {
    return number.toString().padStart(2, '0');
}