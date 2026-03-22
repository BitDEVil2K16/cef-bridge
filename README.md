# CEF Bridge 🌉
> Universal CEF communication layer for game clients — write your UI once, run it everywhere.

**Deutsch weiter unten** | [Jump to German version](#deutsch-)

---
## What is CEF Bridge?

CEF Bridge is a minimal (~30 lines) but powerful communication layer that lets you build web-based UIs once and use them across multiple game clients without changing your frontend code.

Instead of writing platform-specific event handlers for every game client, CEF Bridge abstracts the communication into simple direct function calls — in both directions.

### Supported Platforms

| Platform | Inbound (Game → UI) | Outbound (UI → Game) |
|----------|---------------------|----------------------|
| FiveM / RedM | ✅ | ✅ |
| RAGE:MP | ✅ | ✅ |
| Browser (Dev) | ✅ | ✅ (console.log) |

---
## Quick Start

Add to your webpage:

```html
<script src="bridge.js"></script>
<!-- or external: -->
<script src="https://cdn.jsdelivr.net/gh/BitDEVil2K16/cef-bridge@main/bridge.js"></script>
```

---
## How it works

```
C# Client
    │
    │  SendNuiMessage (FiveM) / mp.events (RAGE)
    ▼
Your App (any webpage — local HTML or external PHP/ASP)
    │
    │  sendData()
    ▼
C# Client  ←  fetch / mp.trigger
```

---

## Installation

### 1. Add to your App Page

Add these two snippets to any webpage that should be controllable from the game.

**Receive calls from the game — direct function dispatch:**
```js
window.addEventListener('message', (e) => {
    if (!e.data || !e.data.fivem) return;
    window._isFiveM = true;
    window._fivemResource = e.data.resourcename;
    const { func, args } = e.data;
    if (typeof window[func] === 'function') {
        window[func](...(args || []));
    }
});
```

Any function defined on `window` is automatically callable from C#. No registration needed — just define it:

```js
// This function is now callable from C# with func = "showWeather"
function showWeather(data) {
    document.getElementById('temp').innerText = data.temperature + '°C';
}
```

**Send data back to the game client:**
```js
function sendData(name, data) {
    if (typeof mp !== 'undefined') {
        mp.trigger(name, JSON.stringify(data));          // RAGE:MP
    } else if (typeof nuiTargetGameBuild !== 'undefined') {
        fetch(`https://${window._fivemResource}/${name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });                                               // FiveM / RedM
    } else {
        console.log(name, data);                         // Browser / Dev
    }
}
```

---

### 2. C# Client — Trigger UI Functions

```csharp
SendNuiMessage(Json.Serialize(new Dictionary<string, object>
{
    { "fivem",        true                           },
    { "resourcename", GetCurrentResourceName()       },
    { "func",         "showWeather"                  }, // JS function to call
    { "args",         new[] { weatherData }          }  // arguments array
}));
```

---

## Usage Example

**Scenario:** Show weather data in an in-game app.

### C# (Client)
```csharp
SendNuiMessage(Json.Serialize(new Dictionary<string, object>
{
    { "fivem",        true                     },
    { "resourcename", GetCurrentResourceName() },
    { "func",         "showWeather"            },
    { "args",         new[] { new {
        temperature  = 22.4,
        description  = "Mostly Clear"
    }}}
}));
```

### JavaScript (your webpage — local or external)
```js
function showWeather(data) {
    document.getElementById('temp').innerText = data.temperature + '°C';
    document.getElementById('desc').innerText = data.description;
}

// Send back to game when user taps a button
document.getElementById('closeBtn').onclick = () => {
    sendData('app:close', { reason: 'user' });
};
```

### C# — Handle callback
```csharp
RegisterNuiCallbackType("app:close");
On("__cfx_nui:app:close", new Action<IDictionary<string, object>, CallbackDelegate>((data, cb) => {
    cb(new { ok = true });
}));
```

---

## Why CEF Bridge?

| | Traditional NUI | CEF Bridge |
|---|---|---|
| Event handler size | Grows with every feature | Fixed, never changes |
| Cross-platform | ❌ Rewrite per client | ✅ One codebase |
| External pages | ❌ Complex setup | ✅ Works out of the box |
| New feature | Add handler + type check | Just define a function |
| Dev without game | ❌ Hard to test | ✅ Falls back to console.log |

---

## License

MIT License — Copyright (c) 2026 BitDEVil2K16

You must retain the copyright notice in all copies or substantial portions of the software.

---

---

# Deutsch 🇩🇪

## Was ist CEF Bridge?

CEF Bridge ist ein minimales (~30 Zeilen) aber leistungsstarkes Kommunikations-Layer für CEF-basierte Spiel-Clients. Schreibe deine UI einmal und nutze sie überall — ohne plattformspezifischen Code.

Statt für jeden Game-Client eigene Event-Handler zu schreiben, abstrahiert CEF Bridge die Kommunikation in einfache direkte Funktionsaufrufe — in beide Richtungen.

### Unterstützte Plattformen

| Plattform | Eingehend (Game → UI) | Ausgehend (UI → Game) |
|-----------|----------------------|----------------------|
| FiveM / RedM | ✅ | ✅ |
| RAGE:MP | ✅ | ✅ |
| Browser (Dev) | ✅ | ✅ (console.log) |

---

## Wie es funktioniert

```
C# Client
    │
    │  SendNuiMessage (FiveM) / mp.events (RAGE)
    ▼
Deine App (beliebige Webseite — lokales HTML oder externes PHP/ASP)
    │
    │  sendData()
    ▼
C# Client  ←  fetch / mp.trigger
```
---
## Schnellstart

Füge das auf deiner Webseite hinzu:

```html
<script src="bridge.js"></script>
<!-- oder extern: -->
<script src="https://cdn.jsdelivr.net/gh/BitDEVil2K16/cef-bridge@main/bridge.js"></script>
```

---
## Installation

### 1. App-Seite einrichten

Füge diese zwei Snippets zu jeder Webseite hinzu die vom Spiel steuerbar sein soll.

**Aufrufe vom Spiel empfangen — direkter Funktionsaufruf:**
```js
window.addEventListener('message', (e) => {
    if (!e.data || !e.data.fivem) return;
    window._isFiveM = true;
    window._fivemResource = e.data.resourcename;
    const { func, args } = e.data;
    if (typeof window[func] === 'function') {
        window[func](...(args || []));
    }
});
```

Jede Funktion die auf `window` definiert ist, kann direkt aus C# aufgerufen werden — keine Registrierung nötig:

```js
// Diese Funktion ist jetzt aus C# aufrufbar mit func = "showWeather"
function showWeather(data) {
    document.getElementById('temp').innerText = data.temperature + '°C';
}
```

**Daten zurück an den Game-Client senden:**

```js
function sendData(name, data) {
    if (typeof mp !== 'undefined') {
        mp.trigger(name, JSON.stringify(data));          // RAGE:MP
    } else if (typeof nuiTargetGameBuild !== 'undefined') {
        fetch(`https://${window._fivemResource}/${name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });                                               // FiveM / RedM
    } else {
        console.log(name, data);                         // Browser / Dev
    }
}
```

---

### 2. C# Client — UI-Funktionen aufrufen

```csharp
SendNuiMessage(Json.Serialize(new Dictionary<string, object>
{
    { "fivem",        true                           },
    { "resourcename", GetCurrentResourceName()       },
    { "func",         "showWeather"                  }, // JS-Funktion die aufgerufen wird
    { "args",         new[] { weatherData }          }  // Argumente als Array
}));
```

## Anwendungsbeispiel

-> Siehe [englische Version](#usage-example) für ein vollständiges Beispiel.

---

## Warum CEF Bridge?

| | Klassisches NUI | CEF Bridge |
|---|---|---|
| Event-Handler Größe | Wächst mit jedem Feature | Fix, wird nie geändert |
| Cross-Platform | ❌ Neuschreiben pro Client | ✅ Eine Codebase |
| Externe Seiten | ❌ Komplexes Setup | ✅ Funktioniert direkt |
| Neues Feature | Handler + Type-Check hinzufügen | Einfach Funktion definieren |
| Dev ohne Spiel | ❌ Schwer testbar | ✅ Fällt auf console.log zurück |

---

## Lizenz

MIT Lizenz — Copyright (c) 2026 BitDEVil2K16

Der Copyright-Hinweis muss in allen Kopien oder wesentlichen Teilen der Software erhalten bleiben.
