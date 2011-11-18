function ABTest(name, customVarSlot, variationFunctions) {
    this.name = name;
    this.customVarSlot = customVarSlot;
    this.variationFunctions = variationFunctions;
    
    var cookieName = "abjs_variation";
    var assignedVariation = this.getCookie(cookieName);
    
    if (assignedVariation == null || assignedVariation == "") {
       // Assign a variation and set cookie
       variationNumber = Math.floor(Math.random() * Object.keys(variationFunctions).length);
       assignedVariation = Object.keys(variationFunctions)[variationNumber];
       this.setCookie(cookieName, assignedVariation, 365);
    }

    this.addLoadEvent(function() {
        variationFunctions[assignedVariation]();
    });
}

ABTest.prototype.setCookie = function(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "": "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

ABTest.prototype.getCookie = function(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
    return "";
}

// Add onload event with clobbering anything else
ABTest.prototype.addLoadEvent = function(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}
