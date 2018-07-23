export default {
    domain: {
        mock: false,
        remote: 'https://gitlab.jsplayer.cn',
        local: 'http://127.0.0.1:8898',
        getDomain () {
            return this.mock ? this.local : this.remote
        }
    }
}
