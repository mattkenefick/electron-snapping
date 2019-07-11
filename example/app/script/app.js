

import Snapping from "/lib/index.js";
const BrowserWindow = require("electron").remote.getCurrentWindow();


// Setup Snappable
// -----------------------------------------------------------------------------

const snap = new Snapping({
    snapPoints: [
        { width: 200, height: 200, },
        { width: 500, height: 300, },
        { width: 500, height: 500, },
        { width: 800, height: 600, },
    ]
});


// Event Handlers
// -----------------------------------------------------------------------------

document.querySelectorAll("button[onclick]").forEach((el) => {
    el.onclick = (e) => {
        const method = e.currentTarget.getAttribute("onclick");
        window[method](e);
    }
});

window.Handle_OnClickClose = (e) => {
    e.preventDefault();
    BrowserWindow.close();
}
