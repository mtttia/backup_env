
const Setting = require('./setting')

main()

function main() {
    if (Setting.firstTime()) {
        // first application opening
        document.getElementById('welcome').classList.remove('d-none')
    }
}