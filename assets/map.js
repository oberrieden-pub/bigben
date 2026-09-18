/* Click-to-load the Google map.
   Nothing is fetched from Google until the visitor presses the button, so the privacy
   notice on the rest of the site stays true by default. Once pressed, the iframe is
   inserted and the gate is removed. */
(function () {
  var wrap = document.getElementById("mapwrap");
  var gate = document.getElementById("mapgate");
  var btn = document.getElementById("showmap");
  if (!wrap || !gate || !btn) { return; }

  btn.addEventListener("click", function () {
    var frame = document.createElement("iframe");
    frame.src = wrap.getAttribute("data-src");
    frame.title = wrap.getAttribute("data-title") || "Map";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.setAttribute("allowfullscreen", "");
    wrap.appendChild(frame);
    gate.remove();
  });
})();
