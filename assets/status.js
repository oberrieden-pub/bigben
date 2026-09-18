/* Open / closed line under the wordmark.
   Reads the pub's regular hours below and the current time in Europe/Zurich, so it is
   correct for a visitor in any timezone. Language comes from data-lang on the element.
   If anything fails the page keeps its static fallback line and nothing is broken.

   Hours live here and in the visible list on each page. Change both together. */
(function () {
  var hours = {
    0: [720, 1170],   // Sunday   12:00 - 19:30
    1: null,          // Monday   closed
    2: [1020, 1350],  // Tuesday  17:00 - 22:30
    3: [1020, 1350],  // Wednesday
    4: [1020, 1380],  // Thursday 17:00 - 23:00
    5: [1020, 1410],  // Friday   17:00 - 23:30
    6: [1020, 1410]   // Saturday
  };

  var days = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
  };

  var phrase = {
    en: {
      open: function (t) { return "Open now until " + t; },
      today: function (t) { return "Closed. Opens today at " + t; },
      tomorrow: function (t) { return "Closed. Opens tomorrow at " + t; },
      later: function (t, d) { return "Closed. Opens " + d + " at " + t; }
    },
    de: {
      open: function (t) { return "Jetzt offen bis " + t + " Uhr"; },
      today: function (t) { return "Geschlossen. Öffnet heute um " + t + " Uhr"; },
      tomorrow: function (t) { return "Geschlossen. Öffnet morgen um " + t + " Uhr"; },
      later: function (t, d) { return "Geschlossen. Öffnet am " + d + " um " + t + " Uhr"; }
    }
  };

  function fmt(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  function nowZurich() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich", weekday: "short",
        hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var o = {}, i;
      for (i = 0; i < parts.length; i++) { o[parts[i].type] = parts[i].value; }
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var d = map[o.weekday];
      if (d === undefined) { return null; }
      var h = parseInt(o.hour, 10) % 24, m = parseInt(o.minute, 10);
      if (isNaN(h) || isNaN(m)) { return null; }
      return { d: d, t: h * 60 + m };
    } catch (e) { return null; }
  }

  var el = document.getElementById("status");
  var now = nowZurich();
  if (!el || !now) { return; }

  var lang = el.getAttribute("data-lang") === "de" ? "de" : "en";
  var say = phrase[lang];
  var today = hours[now.d];
  var text, isOpen = false;

  if (today && now.t >= today[0] && now.t < today[1]) {
    isOpen = true;
    text = say.open(fmt(today[1]));
  } else {
    var next = null;
    for (var i = 0; i < 8; i++) {
      var idx = (now.d + i) % 7, slot = hours[idx];
      if (!slot) { continue; }
      if (i === 0) {
        if (now.t < slot[0]) { next = { idx: idx, open: slot[0], when: "today" }; break; }
        continue;
      }
      next = { idx: idx, open: slot[0], when: i === 1 ? "tomorrow" : "later" };
      break;
    }
    if (!next) { return; }
    var at = fmt(next.open);
    text = next.when === "later" ? say.later(at, days[lang][next.idx]) : say[next.when](at);
  }

  el.className = "status" + (isOpen ? " is-open" : "");
  el.textContent = "";
  var dot = document.createElement("span");
  dot.className = "dot";
  var span = document.createElement("span");
  span.className = "s-txt";
  span.textContent = text;
  el.appendChild(dot);
  el.appendChild(span);
})();
