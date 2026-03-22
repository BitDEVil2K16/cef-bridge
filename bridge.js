/**
 * CEF Bridge v1.0.0
 * https://github.com/BitDEVil2K16/cef-bridge
 * 
 * Copyright (c) 2026 BitDEVil2K16
 * MIT License
 */

window.addEventListener('message', (e) => {
    if (!e.data || !e.data.fivem) return;
    window._isFiveM = true;
    window._fivemResource = e.data.resourcename;
    const { func, args } = e.data;
    if (typeof window[func] === 'function') {
        window[func](...(args || []));
    }
});

function sendData(name, data) {
    if (typeof mp !== 'undefined') {
        mp.trigger(name, JSON.stringify(data));
    } else if (typeof nuiTargetGameBuild !== 'undefined') {
        fetch(`https://${window._fivemResource}/${name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        console.log(name, data);
    }
}
