let logger = {
    headerCss: 'color: purple; font-size: 20px',
    channels: {},
    init() {
        console.log('%cLogger Initiated', this.headerCss)
    },
    log(msg, channel) {
        if (!this.channels[channel]) {
            this.channels[channel] = []
        }

        this.channels[channel].push(msg)
    },
    show(...channels) {
        channels.forEach(channel => {
            let logs = this.channels[channel]
            logs.forEach(log => console.log(log))
        });
    },
    showAll() {
        let channelKeys = Object.keys(this.channels)

        if (channelKeys.length == 0) {
            console.log('%cThere is not anything logged yet!', this.headerCss)
            return
        }

        channelKeys.map(key => {
            return {
                logs: this.channels[key],
                name: key
            }
        }).forEach(channel => {
            console.log(`%c${channel.name}`, this.headerCss)
            channel.logs.forEach(log => console.log(log))
        });
    }
}

logger.init()