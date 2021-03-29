let searchBtn = document.querySelector('#search-btn');

searchBtn.addEventListener('click', fetchProfile);

window.addEventListener('load', () => {
    Endpoints.ApiKey = document.body.getAttribute('data-api-key');
    searchBtn.removeAttribute('disabled');
});

let queueNames = {
    "RANKED_SOLO_5x5": "Solo/Duo",
    "RANKED_FLEX_SR": "Flex",
}

function fetchProfile() {
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
                    queues.forEach((queue) => {
                        let rankedInfo = document.createElement('div');
                        rankedInfo.className = "rank-info";
                        rankedWrapper.appendChild(rankedInfo);

                        let rankedQueue = document.createElement('div');
                        rankedQueue.className = "rank-queue";
                        rankedQueue.innerText = queueNames[queue.queueType];
                        rankedInfo.appendChild(rankedQueue);

                        let rankedImage = document.createElement('img');
                        rankedImage.height = "100";
                        rankedImage.width = "100";
                        rankedImage.src = Endpoints.OPGGTierImage(queue.tier.toLowerCase());
                        rankedInfo.appendChild(rankedImage);

                        let rankedText = document.createElement('div');
                        rankedText.className = "rank-text";
                        rankedText.innerText = queue.tier + " " + queue.rank;
                        rankedInfo.appendChild(rankedText);                        
                        
                        
                    })
                })
        });
}

class Endpoints {
    static ApiKey = null;

    static SummonerV4ByName(summonerName) {
        return 'https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + Endpoints.ApiKey;
    }

    static LeagueV4BySummoner(summonerId) {
        return 'https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerId + '?api_key=' + Endpoints.ApiKey;
    }

    static DDragonProfileIcon(profileIconId) {
        return 'http://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/' + profileIconId + '.png';
    }

    static OPGGTierImage(tier) {
        return 'https://opgg-static.akamaized.net/images/medals/' + tier + '_1.png';
    }
}