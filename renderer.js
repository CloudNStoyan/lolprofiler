let utils = {
    sortByProperty(obj, property) {
        return obj.sort((a, b) => (a[property] > b[property]) ? -1 : 1)
    },
    zeroPadStart(number) {
        return number.toString().padStart(2, '0');
    },
    dateToCustomString(date, separator = '<br>') {
        let time = {
            hours: this.zeroPadStart(date.getHours()),
            minutes: this.zeroPadStart(date.getMinutes()),
            seconds: this.zeroPadStart(date.getSeconds()),
            date: this.zeroPadStart(date.getDate()),
            month: this.zeroPadStart(date.getMonth()),
            year: this.zeroPadStart(date.getFullYear()),
        };
        
        return `${time.hours}:${time.minutes}:${time.seconds}${separator}${time.date}/${time.month}/${time.year}`;
    }
}

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
        filterBtn: document.querySelector('.filter-btn'),
        matchDetailsContainer: document.querySelector('.match-details-container'),
        matchDetailsContent: document.querySelector('.match-details-content'),
        closeMatchDetailsContainerBtn: document.querySelector('.match-details-container .close-btn'),
        matchDetailsHeaderContent: document.querySelector('.match-details-header-content'),
        spectateBadge: document.querySelector('.spectate-badge'),
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
        sortedQueueId: null,
        summonerObject: null,
        loadedMatches: null
    },
    DDragon: {
        Version: lol.ddragon.version,
        BaseUrl: 'http://ddragon.leagueoflegends.com/cdn',
        Image: {
            ProfileIcon(profileIconId) {
                return `${lolprofiler.DDragon.BaseUrl}/${lolprofiler.DDragon.Version}/img/profileicon/${profileIconId}.png`;
            },
            ChampionSquare(imageName) {
                return `${lolprofiler.DDragon.BaseUrl}/${lolprofiler.DDragon.Version}/img/champion/${imageName}`;
            },
            SummonerSpell(imageName) {
                return `${lolprofiler.DDragon.BaseUrl}/${lolprofiler.DDragon.Version}/img/spell/${imageName}`;
            },
            Rune(imageName) {
                return `./ddragon/img/${imageName}`;
            },
            RankedEmblem(tier) {
                return `./ddragon/img/ranked-emblems/Emblem_${tier}.png`;
            },
            Item(itemId) {
                return `${lolprofiler.DDragon.BaseUrl}/${lolprofiler.DDragon.Version}/img/item/${itemId}.png`
            }
        }
    },
    updateUIState(state) {
        if (state == lolprofiler.uiStates.load) {
            this.controls.main.classList.add('hide');
            this.controls.main.classList.add('loading');
            this.controls.nameInput.setAttribute('disabled', '');
            this.controls.matchDetailsContainer.classList.remove('open');
            this.controls.main.classList.remove('hide-entirely');
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

        this.controls.closeMatchDetailsContainerBtn.addEventListener('click', (e) => {
            e.preventDefault();

            this.controls.matchDetailsContainer.classList.remove('open');
            this.controls.main.classList.remove('hide-entirely');
        })

        this.controls.profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
        
            this.controls.profileForm.classList.add('show');
            this.controls.main.classList.add("hide-entirely");
        
            let savedSummonerName = localStorage.getItem(this.localStorageKeys.summonerName);
        
            if (savedSummonerName) {
                this.controls.saveSettingsFormInput.value = savedSummonerName;
            }
        });

        function searchSummoner() {
            let name = lolprofiler.controls.nameInput.value;

            if (!name || name.trim().length == 0) {
                return;
            }

            fetchProfile(name);
        }

        this.controls.nameInput.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              
              searchSummoner()
            }
        });

        this.controls.searchBtn.addEventListener('click', searchSummoner);

        let queues = lol.constants.queues.filter(q => q.showInSelect);
        
        let gameTypeDefaultOption = document.createElement('option');
        gameTypeDefaultOption.innerText = 'All'
        gameTypeDefaultOption.value = -1;
        this.controls.selectGameType.appendChild(gameTypeDefaultOption);

        queues.forEach(queue => {
            let option = document.createElement('option');
            option.innerText = queue.name;
            option.value = queue.id;
            this.controls.selectGameType.appendChild(option);
        });

        this.controls.filterBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            let summoner = lolprofiler.currentSummoner.summonerObject

            let queueId = parseInt(this.controls.selectGameType.value);

            if (queueId == -1) {
                lolprofiler.currentSummoner.loadedMatches = [];
                lolprofiler.currentSummoner.sortedQueueId = null;
                return;
            }

            if (lolprofiler.currentSummoner.sortedQueueId != queueId) {
                lolprofiler.currentSummoner.loadedMatches = [];
                lolprofiler.currentSummoner.sortedQueueId = queueId;
            }

            const count = 10;
            const offset = lolprofiler.currentSummoner.loadedMatches.length + count;

            const loggerChannel = 'filterButton'

            logger.log({'offset': offset, 'count': count, 'queueId': queueId}, loggerChannel)

            let matches = await getMatches(summoner, offset, count, queueId);

            logger.log(matches, loggerChannel)

            handleV5Matches(matches, summoner);
        })
    },
    loadBars() {
        setTimeout(() => {
            let progressBars = document.querySelectorAll('.summary-progress .progress');

            for (let i = 0; i < progressBars.length; i++) {
                let bar = progressBars[i];
                let barWidth = parseFloat(bar.getAttribute('data-width'));
                bar.setAttribute('style', barWidth > 0 ? `width: ${barWidth}%;` : 'display: none;');
            }

        }, 500)
    }
}

lolprofiler.init();

window.addEventListener('load', () => setTimeout(() => {
    let placeholder = lolprofiler.constants.inputNamePlaceholder;
    let typingSpeed = 50;
    
    for (let i = 0; i < placeholder.length; i++) {
        let char = placeholder[i];
        let timeout = typingSpeed * (char != " " ? i : (i - 1));
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

        let queueId = lolprofiler.currentSummoner.sortedQueueId

        let matches = loadedMatches.concat(await getMatches(summoner, loadedMatches.length, 10, queueId));
        handleV5Matches(matches, summoner);
    });
    lolprofiler.controls.matchesWrapper.appendChild(loadMoreBtn);
}

async function getMatches(summoner, start = 0, count = 10, queueId = null) {
    const loggerChannel = 'getMatches';

    let matchList = await riotapi.V5MatchlistByPUUID(summoner.puuid, start, count, queueId);

    logger.log(matchList, loggerChannel);

    let matchRequests = [];
    matchList.forEach(matchId => {
        let match = riotapi.V5MatchById(matchId);
        matchRequests.push(match)
    });

    logger.log(matchRequests, loggerChannel);

    let matchResponses = await Promise.all(matchRequests);

    logger.log(matchResponses, loggerChannel)

    let matches = await handleMatcheResponses(matchResponses);

    logger.log(matches, loggerChannel);
    
    return matches;
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
        <img class="tooltip" src="${championSquareImage}" onload="isLoaded(this)"/>
        <div class="tooltip-content">
            <span>${champ.name}</span>
            <span class="line"></span>
            <span>Level ${mastery.championLevel}</span>
            <div class="champ-description">
            ${champ.blurb}
            </div>
        </div>
    </div>
    `;
    return championMastery;
}

function createItemsElement(items) {
    let html = '';
    items.forEach((item) => {
        if (item != 0) {
            let itemData = lol.ddragon.item.data[item];
            html += `
            <div class="tooltip-container">
                <img class="tooltip" src="${lolprofiler.DDragon.Image.Item(item)}" onload="isLoaded(this)"/>
                <div class="tooltip-content">
                    <span>${itemData.name}</span>
                    <span class="line"></span>
                    <div class="item-description">
                    ${itemData.description}
                    </div>
                </div>
            </div>`;
        } else {
            html += '<div><img class="no-image" /></div>'
        }
    });

    return html;
}

function createMatchInfoElement(game) {
    let winText = game.isWin ? 'Victory' : 'Defeat';
    let now = Date.now();
    let gameDate = longAgo(now - game.gameCreation - game.gameDuration);
    let gameType = lol.constants.queues.find(q => q.id == game.queue.queueId);

    if (!gameType) {
        console.log(game.queue.queueId);
    }

    return `
    <div class="tooltip-container">
        <div class="tooltip">${gameType.name}</div>
        <span class="tooltip-content">${gameType.tooltip}</span>
    </div>
    <div class="tooltip-container">
        <div class="tooltip">${gameDate}</div>
        <span class="tooltip-content">${utils.dateToCustomString(new Date(game.gameCreation))}</span>
    </div>
    <div class="seperator"></div>
    <div class="result">${winText}</div>
    <div>${game.gameLength}</div>
    `
}

function createSetupElement(champion, stats) {
    return `
    <div class="additional-info">
        <div class="champion-image">
            <img src="${lolprofiler.DDragon.Image.ChampionSquare(champion.image.full)}" onload="isLoaded(this)"/>
        </div>
        <div class="masteries">
            <div class="summoner-spells">
                <div class="tooltip-container">
                    <img class="tooltip" src="${lolprofiler.DDragon.Image.SummonerSpell(stats.summonerSpell1.image.full)}" onload="isLoaded(this)"/>
                    <span class="tooltip-content">${stats.summonerSpell1.description}</span>
                </div>
                <div class="tooltip-container">
                    <img class="tooltip" src="${lolprofiler.DDragon.Image.SummonerSpell(stats.summonerSpell2.image.full)}" onload="isLoaded(this)"/>
                    <span class="tooltip-content">${stats.summonerSpell2.description}</span>
                </div>
            </div>
            <div class="runes">
                <div class="tooltip-container">
                    <div class="tooltip">
                        <img src="${lolprofiler.DDragon.Image.Rune(stats.keystone.icon)}" onload="isLoaded(this)"/>
                    </div>
                    <div class="tooltip-content">
                        <span>${stats.keystone.name}</span>
                        <span class="line"></span>
                        <div class="keystone-description">
                        ${stats.keystone.shortDesc}
                        </div>
                    </div>
                </div>
                <div class="tooltip-container">
                    <div class="tooltip">
                        <img src="${lolprofiler.DDragon.Image.Rune(stats.secondaryKeystone.icon)}" onload="isLoaded(this)"/>
                    </div>
                    <span class="tooltip-content">${stats.secondaryKeystone.name}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="champion-name">${champion.name}</div>
    `
}

function createScoreElement(kda, stats) {
    return `
    <div>${kda.kills} / <span class="deaths">${kda.deaths}</span> / ${kda.assists}</div>
    <div>${kda.deaths == 0 ? 'Perfect KDA' : `${((kda.kills + kda.assists) / kda.deaths).toFixed(2)}:1 KDA`}</div>
    <div class="tooltip-container">
        <div class="damage-meter tooltip">
            <div class="damage" style="width: ${Math.round((stats.damage / stats.maxDamage) * 100)}%">${Math.round(stats.damage / 1000)}K</div>
        </div>
        <div class="tooltip-content">
            <span>Total Damage Done</span>
            <span class="line"></span>
            <span class="small">* to champions</span>
        </div>
    </div>
    `
}

function createStatsElement(stats) {
    return `
    <div>Level ${stats.level}</div>
    <div>${stats.creepScore} CS</div>
    <div>P/Kill ${stats.killPercentage}%</div>
    `
}

function createClickablePlayerElement(name) {
    return `<a href="#" class="summoner" onclick="putNameAnimation('${name}')">${name}</a>`
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
                        <img class="summoner-champ-icon" src="${lolprofiler.DDragon.Image.ChampionSquare(champ.image.full)}" onload="isLoaded(this)"/>
                        <div class="summoner-name">${p.summonerName}</div>
                    </a>
                    `
            } else {
                team += `
                    <a href="#" class="summoner">
                        <img class="summoner-champ-icon" src="${lolprofiler.DDragon.Image.ChampionSquare(champ.image.full)}" onload="isLoaded(this)"/>
                        <div class="summoner-name tooltip-container">${p.summonerName} <span class="bot-label tooltip">Bot</span><span class="tooltip-content">This is not a real player.</span></div>
                    </a>
                    `
            }
        })

        html += team + "</div>";
    })

    return html;
}

function createExtendedMatchInfo(player, team) {
    let summonerSpells = Object.values(lol.ddragon.summoner.data);

    let keystone = getPlayerKeystone(player);
    let secondaryRunePath = getPlayerSecondKeystone(player);

    let firstSummonerSpell = summonerSpells.find(spell => spell.key == player.summoner1Id);
    let secondSummonerSpell = summonerSpells.find(spell => spell.key == player.summoner2Id);
    let champion = Object.values(lol.ddragon.champion.data).find(champ => champ.key == player.championId);
    let teamKills = team.map(x => x.kills).reduce((a, b) => a + b, 0);
    let items = [player.item0, player.item1, player.item2, player.item6, player.item3, player.item4, player.item5];
    let maxDamage = 0;

    team.map(p => p.totalDamageDealtToChampions).forEach(damage => {
        if (damage > maxDamage) {
            maxDamage = damage
        }
    });

    return `
    <div class="player-info">
        <div class="summoner-info">
            <div class="champion-image">
                <img src="${lolprofiler.DDragon.Image.ChampionSquare(champion.image.full)}" onload="isLoaded(this)"/>
            </div>
            <div class="summoner-spells">
                <div class="tooltip-container">
                    <img class="tooltip" src="${lolprofiler.DDragon.Image.SummonerSpell(firstSummonerSpell.image.full)}" onload="isLoaded(this)"/>
                    <span class="tooltip-content">${firstSummonerSpell.description}</span>
                </div>
                <div class="tooltip-container">
                    <img class="tooltip" src="${lolprofiler.DDragon.Image.SummonerSpell(secondSummonerSpell.image.full)}" onload="isLoaded(this)"/>
                    <span class="tooltip-content">${secondSummonerSpell.description}</span>
                </div>
            </div>
            <div class="runes">
                <div class="tooltip-container">
                    <div class="tooltip">
                        <img src="${lolprofiler.DDragon.Image.Rune(keystone.icon)}" onload="isLoaded(this)"/>
                    </div>
                    <div class="tooltip-content">
                        <span>${keystone.name}</span>
                        <span class="line"></span>
                        <div class="keystone-description">${keystone.shortDesc}</div>
                    </div>
                </div>
                <div class="tooltip-container">
                    <div class="tooltip">
                        <img src="${lolprofiler.DDragon.Image.Rune(secondaryRunePath.icon)}" onload="isLoaded(this)"/>
                    </div>
                    <span class="tooltip-content">${secondaryRunePath.name}</span>
                </div>
            </div>
        </div>
        <div class="player-name">${player.summonerName}</div>
        <div class="stats">
            <div class="rank">
                <span class="player-tier"></span>
                <span class="player-lvl">${player.summonerLevel} lvl</span>
            </div>
            <div class="score">
                <div>${player.kills} / <span class="deaths">${player.deaths}</span> / ${player.assists}</div>
                <div>${player.deaths == 0 ? 'Perfect KDA' : `${((player.kills + player.assists) / player.deaths).toFixed(2)}:1 KDA`}</div>
            </div>
            <div class="damage-container tooltip-container">
                <div class="damage-meter tooltip">
                    <div class="damage" style="width: ${Math.round((player.totalDamageDealtToChampions / maxDamage) * 100)}%">${Math.round(player.totalDamageDealtToChampions / 1000)}K</div>
                </div>
                <div class="tooltip-content">
                    <span>Total Damage Done</span>
                    <span class="line"></span>
                    <span class="small">* to champions</span>
                </div>
            </div>
        </div>
        <div class="player-score">
            <span class="level">LVL ${player.champLevel}</span>
            <span class="creep-score">${player.totalMinionsKilled} CS</span>
            <span class="percentage-kill">P/Kill ${Math.round(((player.kills + player.assists) / teamKills) * 100)}%</span>
        </div>
        <div class="items">
            ${createItemsElement(items)}
        </div>
    </div>
    `
}

function openMatchDetails(gameDetails) {
    
    lolprofiler.controls.matchDetailsContainer.classList.add('open');
    lolprofiler.controls.main.classList.add("hide-entirely");

    let content = lolprofiler.controls.matchDetailsContent;
    content.innerHTML = '';

    let headerContent = lolprofiler.controls.matchDetailsHeaderContent;
    
    let game = gameDetails.rawGameResponse;

    let queue = lol.constants.queues.find(q => q.id == game.info.queueId);
    
    headerContent.innerHTML = 
    `
        <span>${queue.tooltip}</span>
        <span>${Math.floor(((game.info.gameDuration / 1000) / 60))}m ${(Math.floor((game.info.gameDuration / 1000) % 60))}s</span>
        <span>${utils.dateToCustomString(new Date(game.info.gameCreation), ' ')}</span>
    `
    const logChannel = 'matchDetails'
    logger.log(game, logChannel)

    let teamIds = {
        blue: 100,
        red: 200
    }

    let teams = [
        {
            info: game.info.teams.find(t => t.teamId == teamIds.blue),
            players: game.info.participants.filter((p) => p.teamId == teamIds.blue)    
        },
        {
            info: game.info.teams.find(t => t.teamId == teamIds.red),
            players: game.info.participants.filter((p) => p.teamId == teamIds.red)
        },
    ]

    logger.log(teams, logChannel)
    
    teams.forEach(team => {
        let teamWrapper = document.createElement('div');
        teamWrapper.className = `team ${(team.info.teamId == teamIds.blue) ? 'blue' : 'red'} ${team.info.win ? 'win' : 'lose'}`;

        let teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';
        teamHeader.innerHTML = `${team.info.win ? 'VICTORY' : 'DEFEAT'}`;
        teamWrapper.appendChild(teamHeader);

        team.players.forEach(player => {
            teamWrapper.innerHTML += createExtendedMatchInfo(player, team.players);
        });
        content.appendChild(teamWrapper);

        let teamFooter = document.createElement('div');
        teamFooter.className = 'team-footer';
        teamFooter.innerHTML = 
        `
            <div${(team.info.objectives.baron.first ? ' class="first"' : '')}>Barons: <span>${team.info.objectives.baron.kills}</span></div>
            <div${(team.info.objectives.champion.first ? ' class="first"' : '')}>Champion Kills: <span>${team.info.objectives.champion.kills}</span></div>
            <div${(team.info.objectives.dragon.first ? ' class="first"' : '')}>Dragons: <span>${team.info.objectives.dragon.kills}</span></div>
            <div${(team.info.objectives.inhibitor.first ? ' class="first"' : '')}>Inhibitors: <span>${team.info.objectives.inhibitor.kills}</span></div>
            <div${(team.info.objectives.riftHerald.first ? ' class="first"' : '')}>Rift Heralds: <span>${team.info.objectives.riftHerald.kills}</span></div>
            <div${(team.info.objectives.tower.first ? ' class="first"' : '')}>Towers: <span>${team.info.objectives.tower.kills}</span></div>
        `;
        teamWrapper.appendChild(teamFooter);
    });

    let teamSeparator = document.createElement('div');
    teamSeparator.className = 'team-separator';
    
    content.insertBefore(teamSeparator, content.children[1]);
}

function handleInGame(spectatorInfo) {
    lolprofiler.controls.spectateBadge.classList.remove('ingame');

    if (!spectatorInfo) {
        lolprofiler.controls.spectateBadge.innerText = 'NOT INGAME';
        return;
    }

    lolprofiler.controls.spectateBadge.innerText = 'INGAME';
    lolprofiler.controls.spectateBadge.classList.add('ingame');
}

function handleSummoner(summoner) {
    lolprofiler.controls.profileName.innerText = summoner.name;
    lolprofiler.controls.profileLevel.innerText = summoner.summonerLevel;
    lolprofiler.controls.profileIcon.src = lolprofiler.DDragon.Image.ProfileIcon(summoner.profileIconId);
}

function handleQueues(queues) {
    lolprofiler.controls.rankWrapper.innerHTML = '';

    if (queues.length == 0) {
        lolprofiler.controls.rankWrapper.innerHTML = '<div class="rank-info"><h1 class="rank-text unranked">UNRANKED</h1></div>';
    }
                    
    queues.forEach((queue) => {
        let rankedInfo = document.createElement('div');
        rankedInfo.className = 'rank-info';
        rankedInfo.innerHTML = 
        `
        <div class="rank-queue">${lol.constants.ranked[queue.queueType]}</div>
        <img width="100" height="100" src="${lolprofiler.DDragon.Image.RankedEmblem(queue.tier[0] + queue.tier.substring(1).toLowerCase())}" onload="isLoaded(this)"/>
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

    recentlies = utils.sortByProperty(recentlies, 'times')

    let recentliesHtml = '';

    recentlies.forEach(recently => {
        recentliesHtml += `
        <div class="section-header recently-summoner">
            ${createClickablePlayerElement(recently.name)}
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

    lolprofiler.loadBars();
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
    const loggerChannel = 'handleV5Matches';

    logger.log(matches, loggerChannel)

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

    let games = matches.map(game => getGameInfo(game, summoner));

    logger.log(games, loggerChannel)

    games.forEach(game => {
        try {
            lolprofiler.controls.matchesWrapper.appendChild(createGame(game))
        } catch (error) {
            console.error(error)
        }
    });

    let summary = {
        wins: games.filter(x => x.isWin).length,
        loses: matches.length - this.wins,
        total: matches.length
    }

    addLoadMoreBtn();

    handleSummary(summary);

    lolprofiler.currentSummoner.loadedMatches = matches;
}

function getPlayerKeystone(player) {
    return lol.ddragon.runesReforged.find(x => x.id == player.perks.styles[0].style).slots[0].runes.find(x => x.id == player.perks.styles[0].selections[0].perk);
}

function getPlayerSecondKeystone(participant) {
    return lol.ddragon.runesReforged.find(x => x.id == participant.perks.styles[1].style)
}

function getPlayerKillPercentage(player, participants) {
    let teamKills = participants.filter((p) => p.teamId == player.teamId).map(x => x.kills).reduce((a, b) => a + b, 0);

    return Math.round(((player.kills + player.assists) / teamKills) * 100)
}

function getParticipantByPuuid(game, puuid) {
    return game.info.participants.find(p => p.puuid == puuid)
}

function getGameInfo(game, summoner) {
    let participant = getParticipantByPuuid(game, summoner.puuid)
    let team = game.info.teams.find(t => t.teamId == participant.teamId);

    let champion = Object.values(lol.ddragon.champion.data).find(champ => champ.key == participant.championId);

    let queue = lol.ddragon.queues.find(q => q.queueId == game.info.queueId);

    let participantsDamage = game.info.participants.map(x => x.totalDamageDealtToChampions);
    let maxDamage = 0;

    participantsDamage.forEach(damage => {
        if (damage > maxDamage) {
            maxDamage = damage
        }
    })
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
        killPercentage: getPlayerKillPercentage(participant, game.info.participants),
        summonerSpell1: summonerSpells.find(spell => spell.key == participant.summoner1Id),
        summonerSpell2: summonerSpells.find(spell => spell.key == participant.summoner2Id),
        keystone: getPlayerKeystone(participant),
        secondaryKeystone: getPlayerSecondKeystone(participant),
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
        rawGameResponse: game
    }

    return gameObj;
}

async function handleMatcheResponses(matchResponses) {
    let matches = []
    for (let i = 0; i < matchResponses.length; i++) {
        let matchResponse = matchResponses[i];
        if (matchResponse.status == 200) {
            let json = await matchResponse.json;
            matches.push(json)   
        } else {
            let matchId = matchResponse.urlSegments[matchResponse.urlSegments.length - 1].split('?')[0];
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

    let matches = await getMatches(summoner)

    logger.log(matches, 'fetchProfile')

    handleV5Matches(matches, summoner);

    let spectator = await riotapi.SpectatorV4BySummonerId(summoner.id);
    
    if (!spectator.status) {
        handleInGame(spectator);   
    } else {
        handleInGame(null)
    }

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
            console.error(`Couldn't find a match with id '${matchId}' so its skipped!`)
        }
    }
}

function createGame(game) {
    let match = document.createElement('div');
    match.className = `match ${game.isWin ? 'victory' : 'defeat'}`;

    match.innerHTML =
        `
        <div class="match-info">
            ${createMatchInfoElement(game)}
        </div>
        <div class="setup">
            ${createSetupElement(game.champion, game.stats)}
        </div>
        <div class="score">
            ${createScoreElement(game.kda, game.stats)}
        </div>
        <div class="stats">
            ${createStatsElement(game.stats)}
        </div>
        <div class="items">
            ${createItemsElement(game.stats.items)}
        </div>
        <div class="players">
            ${createTeamsElement(game.teamsObj)}
        </div>
        `;
    
    let detailsBtn = document.createElement('a');
    detailsBtn.className = 'details-btn';
    detailsBtn.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
    detailsBtn.href = '#';
    detailsBtn.addEventListener('click', (e) => {
        e.preventDefault();

        openMatchDetails(game);
    })

    match.appendChild(detailsBtn);

    return match;
}

function putNameAnimation(name) {
    lolprofiler.controls.nameInput.value = name[0];
    for (let i = 1; i < name.length; i++) {
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

function isLoaded(el) {
    el.classList.add('img-loaded');
}