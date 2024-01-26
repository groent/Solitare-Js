
// global handle to cancel the axios.get request in pollDie
export var controller = new AbortController();


// *****************************************************************
export function sleep(ms) {  // Pause execution for x msec
// Has to be called with "await sleep(xxx)"
// Creates a pause before further execution. 
// Can be used for animation purposes by stopping a loop. 
// *****************************************************************
return new Promise(resolve => setTimeout(resolve, ms));
} // end of: sleep()


// *****************************************************************
export function generateId(len = 4) {  // Generate code with alphanumeric characters
// Code has 'len' length, default 4. Caps only, O & 0 and I & 1 omitted for clarity.
// *****************************************************************
    let result = "";
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // eligble chars
    const charsLen = chars.length;

    // for requested length; pick random char out of chars 
    // charAt is zero based, floor rounds down, random between 0 and <1
    for (let i=0; i < len; i++) result += chars.charAt(Math.floor(Math.random() * charsLen));

    return result;
}  // end of: generateId()
    
    
// *****************************************************************
export function showThrow(el, eyes) {  // turn the die (dom el) so the number of eyes are shown
// ('eyes' must be an integer)
// *****************************************************************
    switch (eyes) {
        case 6:
            el.style.transform = "rotateX(180deg)";    // 6
            break;
        case 5:
            el.style.transform = "rotateX(90deg)";     // 5
            break;
        case 4:
            el.style.transform = "rotateY(90deg)";     // 4
            break;
        case 3:
            el.style.transform = "rotateY(-90deg)";    // 3
            break;
        case 2:
            el.style.transform = "rotateX(-90deg)";    // 2
            break;
        case 1: 
            el.style.transform = "rotateX(0deg)";      // 1

    }  // end of: switch on eyes

}  // end of: showThrow()
    
    
    
/***********************************************************************/
/***                      COOKIE  FUNCTIONS                          ***/
/***********************************************************************/

/******************************************************************************/
// don't use sessionStorage, use localStorage instead for simplicity,         //
// it is supported by all browsers and devices, and thus no need for wrappers //
/******************************************************************************/

function storage() { // Check if local (and session) storage is supported, returns true or false

    // because of iOS an actual attempt has to be made, this function may run before iOSprivMode()
    try {
        sessionStorage.setItem("test", "1");
        sessionStorage.removeItem("test");
    } catch (e) {
        return false;
    }
    // return false; // DEBUG // force alternative path...
    return 'localStorage' in window && window['localStorage'] !== null;
} // /storage()

function iOSprivMode() { // Check if sessionStorage is supported AND working; iOS check
    try {
        sessionStorage.setItem("test", "1");
        sessionStorage.removeItem("test");
    } catch (e) {
        if (e.code === DOMException.QUOTA_EXCEEDED_ERR && sessionStorage.length === 0) {
            console.log("sessionStorage not active: iOS in Private mode");
            return true;
        } else {
            console.log("sessionStorage not present");
            return false;
        }
    }
    //console.log("sessionStorage works");
    //return true; // DEBUG // force alternative path... 
    return false;
} // /iOSprivMode()


function rdGlbl(name) {         // readGlobal var, name is string; usage: var = (storage())? rdGlbl("name") : name;
    var data = sessionStorage.getItem(name);
    if ( data == null) data = "";
    return data;
} // /rdGlbl()


function wrtGlbl(name, data) {  // writeGlobal var, name and data are strings; usage: name = wrtGlbl("name", data); (may need a JSON.stringify)
    if (storage()) {
        sessionStorage.setItem(name, data);
    }
    return data;
} // /wrtGlbl()


function clrGlbl(name) {        // clearGlobal var, name is string; usage: name = clrGlbl("name");
    if (storage()) sessionStorage.removeItem(name);
    return "";
} // /clrGlbl()


export function readCkie(name) { // Returns a cookie by name ('name=') as a string, 'name' has to be string
    // if (false) {
    if (storage() == true) {
        return localStorage.getItem(name);                                                              // return cookie
    } else {
        var a_ckie = document.cookie.split("; ");                                                       // split domain cookies and their sections
        for (var i = 0; i < a_ckie.length; i++) {                                                       // for each cookie section
            while (a_ckie[i].charAt(0) == " ") a_ckie[i] = a_ckie[i].substring(1, a_ckie[i].length);    // strip any spaces before cookie name
            if (a_ckie[i].indexOf(name + "=") == 0) {                                                   // if right cookie found
                return decodeURIComponent(a_ckie[i].substring(name.length + 1, a_ckie[i].length));                // return the section after '='
            }
        }
    }
    return "";  // returns empty because the result might be parsed into a string
} // /readCkie()


export function writeCkie(name, data, days) { // Write cookie with name (as a string) and data, use of days is optional (only works with old cookie system)
    // if (false) {
    if (storage() == true) {
        localStorage.setItem(name, data);                                                               // persistence (local) storage is always unlimited
    } else {
        var date_today = new Date();                                                                    // today's date, for expiry calculation
        var date_expire = (days) ? new Date(date_today.valueOf() + (days * 86400000)) : null;           // expiry date (= today + exp days in msec)
        var s_ckie = name + "=" + encodeURIComponent(data);                                                         // cookie will be named 'name' DON'T ESCAPE THE '='sign!

        if (days) s_ckie += "; expires=" + date_expire.toGMTString();                                   // and add expiry date in proper format (only when defined)
        s_ckie += "; path=/"                                                                            // set path to use cookie from pages in different dir's
        document.cookie = s_ckie;                                                                       // set the cookie
    }
} // /writeCkie()


export function clearCkie(name) { // Wipes cookie, could be used in conjunction with cookie existence check with writeCkie() 
    if (storage() == true) {
        localStorage.removeItem(name);
    } else {
        writeCkie(name, "", -1);
    }
} // /clearCkie()