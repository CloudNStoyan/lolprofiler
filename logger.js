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
    }
}