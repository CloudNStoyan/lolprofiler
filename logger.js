let logger = {
    channels: {},
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
        let channels = Object.keys(this.channels).map(ch => channels[ch])
        this.channels.forEach(channel => {
            let logs = this.channels[channel]
            console.log(`%c${channel}`, 'color: purple; font-size: 20px')
            logs.forEach(log => console.log(log))
        });
    }
}