class utils {
    static constants = {
        queues: [
            { "id": 450, "name": "ARAM", "tooltip": "ARAM 5v5", "showInSelect": true },
            { "id": 400, "name": "Draft", "tooltip": "Normal Draft", "showInSelect": true },
            { "id": 830, "name": "Bot", "tooltip": "Co-op Intro", "showInSelect": false },
            { "id": 840, "name": "Bot", "tooltip": "Co-op Beginner", "showInSelect": false },
            { "id": 850, "name": "Bot", "tooltip": "Co-op Intermediate", "showInSelect": false },
            { "id": 440, "name": "Flex", "tooltip": "Ranked Flex", "showInSelect": true },
            { "id": 420, "name": "Solo/Duo", "tooltip": "Ranked Solo/Duo", "showInSelect": true },
            { "id": 700, "name": "Clash", "tooltip": "Clash 5v5", "showInSelect": true },
            { "id": 1020, "name": "One for All", "tooltip": "One for All", "showInSelect": false },
            { "id": 430, "name": "Blind", "tooltip": "Normal Blind", "showInSelect": true },
            { "id": 1300, "name": "Nexus Blitz", "tooltip": "Nexus Blitz", "showInSelect": true },
            { "id": 1400, "name": "Ultimates", "tooltip": "Ultimates", "showInSelect": true },
            { "id": 900, "name": "URF", "tooltip": "URF", "showInSelect": true }
        ]
    }

    static longAgo = (difference) => {
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

    static dateToGameLength = (gameDuration) => `${Math.floor((gameDuration / 60))}m ${Math.floor((gameDuration % 60))}s`;

    static zeroPadStart = (number) => number.toString().padStart(2, '0');

    static dateToCustomString = (date, separator = '\r\n') => {
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

    static getRecentlyPlayedWith(matches, summoner) {
        let allSummonerNames = ([].concat.apply([], matches.map(g => {
            const participant = g.info.participants.find(p => p.puuid === summoner.puuid);
            const participantTeam = g.info.teams.find(team => team.teamId === participant.teamId);
            return g.info.participants.filter(p => p.teamId === participantTeam.teamId)
        }))).filter(p => p.puuid !== 'BOT').map(p => p.summonerName);

        let recentlyPlayedWith = [];

        allSummonerNames.forEach(name => {
            if (name === summoner.name) {
                return;
            }

            const player = recentlyPlayedWith.find(p => p.summonerName === name);

            if (player) {
                player.times++;
                return;
            }

            recentlyPlayedWith.push({ summonerName: name, times: 1 })
        });

        recentlyPlayedWith.sort((a, b) => b.times - a.times);

        return recentlyPlayedWith;
    }
}

export default utils;