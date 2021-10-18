const { sayStop } = require('./api')

const btnStop = document.getElementById('btnStop')

btnStop.addEventListener('click', (e) => {
    sayStop()
})