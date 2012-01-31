
function enableBlock() {
    $("#wandermind-extension-overlay").show()
}

function disableBlock() {
    $("#wandermind-extension-overlay").hide()
}

$("<div id='wandermind-extension-overlay'>It's blocked!</div>").appendTo("body")

mode.listen(function(request) {
    if (request.mode == "break") {
        disableBlock()
    } else {
        if (blacklist.isBlocked(location.href)) {
            enableBlock()
        } else {
            disableBlock()
        }
    }
})
