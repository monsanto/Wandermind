
// *** Load jquery, cache, and underscore first! *** //

// Settings

// Strange Chromeness -- can't connect to self.

var modes = ["work", "break"]

var defaultTime = {
    set : function(key, time) {
        cache.setItem("defaultTime" + key, time)
    },

    get : function(key) {
        times = {"work": 1, "break": 1}
        return cache.getItem("defaultTime" + key, times[key])
    },

    import : function(text) {
        return parseInt(text)
    },

    export : function(time) {
        return time.toString()
    },

    open : function(key) {
        return this.export(this.get(key))
    },

    save : function(key, text) {
        this.set(key, this.import(text))
    },
}

// Blacklist

var blacklist = {
    // low-level routines
    
    set : function (bl) {
        cache.setItem("blacklist", bl)
    },

    get : function () {
        return cache.getItem("blacklist", [])
    },

    import : function(text) {
        return text.split("\n")
    },

    export : function(bl) {
        return bl.join("\n")
    },

    // high-level routines

    open : function() {
        return this.export(this.get())
    },
    
    save : function(text) {
        this.set(this.import(text))
    },

    isBlocked : function(url) {
        url = url.toLowerCase()
        return _.any(this.get(), function(item) {
            return url.search(item.toLowerCase()) != -1
        })
    }
}

// Tags

var tagCounter = {
    set : function (tag, value) {
        cache.setItem("tag-" + tag, value)
    },

    get : function (tag) {
        return cache.getItem("tag-" + tag, 0)
    },

     import : function(text) {
        return parseInt(text)
    },

    export : function(value) {
        return value.toString()
    },

    open : function(key) {
        return this.export(this.get(key))
    },

    save : function(key, text) {
        this.set(key, this.import(text))
    },

    increment : function(key) {
        this.set(key, this.get(key) + 1)
    }
}

// Whitelists

var whitelist = {
    set : function (wl) {
        cache.setItem("whitelist", wl)
    },

    get : function () {
        return cache.getItem("whitelist", {})
    },

    import : function(text) {
        items = text.split("\n")
        var currentItem = null
        var whitelist = {}
        _.each(items, function(item) {
            if (item[0] == "*") {
                currentItem = item.substr(1)
            } else {
                whitelist[item].push()
            }
        })
        return whitelist
    },

    export : function(wl) {
        var text = ""
        _.each(wl, function(value, key) {
            text += "*" + key + "\n"
            text += value.join("\n") + "\n"
        })
        return text
    },

    open : function(key) {
        return this.export(this.get(key))
    },

    save : function(text) {
        this.set(this.import(text))
    },

    getTag : function(tag) {
        return this.get()[tag]
    },

    isAllowed : function(tag, url) {
        url = url.toLowerCase()
        return _.any(this.getTag(tag), function(item) {
            return url.search(item.toLowerCase()) != -1
        })
    }
}

// Modes

var mode = {
    change : function (msg) {
        chrome.extension.getBackgroundPage().currentState = msg
        chrome.extension.getBackgroundPage().change()
    },
    // High-level commands

    pause : function () {
        this.change({mode: "pause", tags: [], duration: 0})
    },

    work : function(tags, duration) {
        this.change({mode: "work", tags: tags, duration: duration})
    },

    break : function(duration) {
        this.change({mode: "break", tags: [], duration: duration})
    }
}

// Misc

// Taken from Strict-Pomodoro project
function formatDuration (timeRemaining) {
    if(timeRemaining >= 60) {
        return Math.round(timeRemaining / 60) + "m";
    } else {
        return (timeRemaining % 60) + "s";
    }
}

