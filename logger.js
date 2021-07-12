let logger = {
    config: {
        log: [logger.tags.match]
    },
    tags: {
        match: 'match'
    },
    log(msg, tag) {
        if (this.config.log.includes(tag)) {
            console.log(msg)
        }
    }
}