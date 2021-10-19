const bootstrap = require('bootstrap')
const Setting = require('./setting')

main()

function main() {
    if (Setting.firstTime()) {
        // first application opening
        var settingModal = new bootstrap.Modal(document.getElementById('settingModal'), {
            keyboard: false
        })

        settingModal.show()
    }
}