(function () {
  var stage = document.getElementById("hero-stage");
  var data = window.__HERO__;
  if (!stage || !data) return;

  var params = new URLSearchParams(location.search);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("reduced") === "1";
  /* Same timing as the project-page carousel: duration-300 ease-out. */
  var SLIDE_MS = 300;
  var SLIDE_EASE = "cubic-bezier(0, 0, 0.2, 1)";
  var mq = window.matchMedia("(min-width: 768px)");

  function desktop() { return mq.matches; }
  function slides() { return desktop() ? data.desktop : data.mobile; }
  function sizes() { return desktop() ? "calc(100vw - 96px)" : "calc(100vw - 32px)"; }
  function duration() { return reduce ? 200 : SLIDE_MS; }

  function variant(src) {
    var row = data.manifest && data.manifest[src];
    if (!row || !row.src) return { src: src, srcset: "" };
    return row;
  }

  var cache = new Map();
  function loadImage(url) {
    if (!url) return Promise.resolve(null);
    if (cache.has(url)) return cache.get(url);
    var pending = new Promise(function (resolve) {
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { img.decode().then(function () { resolve(img); }, function () { resolve(img); }); };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
    cache.set(url, pending);
    return pending;
  }

  function layerImg(layer) {
    return layer.querySelector("img");
  }
  var layers = [].slice.call(stage.querySelectorAll(".hero-layer"));
  if (layers.length < 2) return;
  var current = 0;
  var index = 0;
  var aim = 0;
  var job = 0;
  var run = null;

  function paint(layer, project) {
    var img = layerImg(layer);
    var pic = layer.querySelector("picture");
    if (pic) pic.querySelectorAll("source").forEach(function (node) { node.remove(); });
    var picked = variant(project.img);
    img.sizes = sizes();
    img.srcset = picked.srcset || "";
    img.src = picked.src || project.img;
    return loadImage(img.src);
  }

  function langStore() {
    return window.Alpine && Alpine.store && Alpine.store("lang");
  }
  function langCode() {
    var store = langStore();
    if (store && (store.code === "zh" || store.code === "en")) return store.code;
    return window.__MMCM_LANG === "zh" ? "zh" : "en";
  }
  function plain(value) { return String(value == null ? "" : value).replace(/_/g, " "); }
  function fieldText(project, key) {
    var store = langStore();
    if (key === "arch") return store ? store.architect(project) : plain(project.architect);
    if (key === "name") return store ? store.name(project) : (langCode() === "zh" && project.title_zh ? project.title_zh : plain(project.title));
    if (key === "place") return store ? store.place(project.address) : plain(project.address);
    return project.coords || "";
  }
  var KEYS = ["arch", "name", "place", "coords"];
  var textJob = 0;
  function fields(key) { return [].slice.call(document.querySelectorAll('.fld[data-k="' + key + '"]')); }
  function escapeText(text) {
    return String(text).replace(/[&<>]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch];
    });
  }
  function setLine(field, text) {
    if (field.getAttribute("data-k") === "coords") { paintCoord(field, text, 999); return; }
    field.innerHTML = '<span class="ln">' + escapeText(text) + "</span>";
  }
  function digitCount(text) {
    var n = 0;
    for (var i = 0; i < text.length; i++) if (/\d/.test(text[i])) n += 1;
    return n;
  }
  function paintCoord(field, text, settled) {
    var html = "";
    var di = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (/\d/.test(ch)) {
        var show = di < settled ? ch : String((Math.random() * 10) | 0);
        html += '<i class="d">' + show + "</i>";
        di += 1;
      } else html += '<i class="s">' + escapeText(ch) + "</i>";
    }
    field.innerHTML = '<span class="ln coord">' + html + "</span>";
  }
  function cycleCoords(text, token) {
    if (reduce || digitCount(text) === 0) {
      fields("coords").forEach(function (field) { paintCoord(field, text, 999); });
      return;
    }
    var digits = digitCount(text);
    var startAt = SLIDE_MS;
    var total = 560;
    var t0 = performance.now();
    var bucket = -1;
    var rolling = [];
    function frame(now) {
      if (token !== textJob) return;
      var elapsed = now - t0 - startAt;
      if (elapsed < 0) { requestAnimationFrame(frame); return; }
      var p = Math.min(1, elapsed / total);
      var settled = p >= 1 ? digits : Math.floor(p * digits);
      var step = Math.floor(elapsed / 50);
      if (step !== bucket) {
        bucket = step;
        for (var i = settled; i < digits; i++) rolling[i] = (Math.random() * 10) | 0;
      }
      var html = "";
      var di = 0;
      for (var c = 0; c < text.length; c++) {
        var ch = text[c];
        if (/\d/.test(ch)) {
          var show = di < settled ? ch : String(rolling[di] == null ? 0 : rolling[di]);
          html += '<i class="d">' + show + "</i>";
          di += 1;
        } else html += '<i class="s">' + escapeText(ch) + "</i>";
      }
      fields("coords").forEach(function (field) {
        field.innerHTML = '<span class="ln coord">' + html + "</span>";
      });
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function lockSide() {
    var host = document.querySelector(".hero-side .t-title") || document.querySelector(".t-title");
    if (!host) return;
    var probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font-variant-numeric:tabular-nums;";
    probe.style.font = getComputedStyle(host).font;
    document.body.appendChild(probe);
    probe.textContent = "0";
    var digit = Math.max(1, Math.round(probe.getBoundingClientRect().width));
    document.documentElement.style.setProperty("--hero-digit", digit + "px");
    var max = 0;
    [data.desktop, data.mobile].forEach(function (list) {
      (list || []).forEach(function (project) {
        ["place", "coords"].forEach(function (key) {
          probe.textContent = fieldText(project, key);
          max = Math.max(max, probe.getBoundingClientRect().width);
        });
      });
    });
    probe.remove();
    var px = Math.ceil(max) + digit + 16;
    document.querySelectorAll(".hero-side").forEach(function (el) {
      el.style.width = px + "px";
      el.style.maxWidth = px + "px";
      el.style.flex = "0 0 " + px + "px";
    });
  }
  function setStatic(project) {
    textJob += 1;
    KEYS.forEach(function (key) {
      fields(key).forEach(function (field) {
        field.getAnimations().forEach(function (anim) { anim.cancel(); });
        setLine(field, fieldText(project, key));
        var line = field.querySelector(".ln");
        if (line) { line.style.opacity = "1"; line.style.transform = "none"; }
      });
    });
    lockSide();
  }
  function swapText(project) {
    textJob += 1;
    var dur = duration();
    KEYS.forEach(function (key) {
      var next = fieldText(project, key);
      if (key === "coords") {
        var changed = fields(key).some(function (field) {
          var line = field.querySelector(".ln");
          return !line || line.textContent !== next;
        });
        if (!changed || reduce) fields(key).forEach(function (field) { paintCoord(field, next, 999); });
        else cycleCoords(next, textJob);
        return;
      }
      fields(key).forEach(function (field) {
        field.getAnimations().forEach(function (anim) { anim.cancel(); });
        var line = field.querySelector(".ln");
        var prev = line ? line.textContent : "";
        if (prev === next || !line) { setLine(field, next); return; }
        field.innerHTML = '<span class="ln is-old">' + line.innerHTML + '</span><span class="ln is-new">' + escapeText(next) + '</span>';
        var oldLine = field.querySelector(".is-old");
        var newLine = field.querySelector(".is-new");
        newLine.style.opacity = "0";
        newLine.style.transform = "none";
        oldLine.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: "linear", fill: "forwards" });
        newLine.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, easing: "linear", fill: "forwards" });
      });
    });
  }

  function syncIndex(i) {
    var root = document.querySelector("[x-data]");
    var app = root && root._x_dataStack && root._x_dataStack[0];
    if (!app) return;
    if (desktop()) app.currentHomeIndex = i;
    else app.currentHomeMobileIndex = i;
  }

  function resetLayer(layer) {
    var img = layerImg(layer);
    img.getAnimations().forEach(function (anim) { anim.cancel(); });
    layer.getAnimations().forEach(function (anim) { anim.cancel(); });
    layer.style.opacity = "1";
    layer.style.clipPath = "none";
    layer.style.visibility = "";
    layer.style.transform = "none";
    img.style.transform = "none";
    img.style.opacity = "1";
  }

  function finishRun() {
    if (!run) return;
    var done = run;
    run = null;
    done.anims.forEach(function (anim) { try { anim.cancel(); } catch (err) {} });
    resetLayer(done.incoming);
    resetLayer(done.outgoing);
    done.incoming.classList.add("is-current");
    done.incoming.classList.remove("is-next");
    done.outgoing.classList.add("is-next");
    done.outgoing.classList.remove("is-current");
    done.incoming.style.zIndex = "2";
    done.outgoing.style.zIndex = "1";
    done.outgoing.style.visibility = "hidden";
    current = layers.indexOf(done.incoming);
    index = done.to;
    aim = done.to;
    if (!done.keepText) setStatic(slides()[index]);
    syncIndex(index);
  }

  function play(incoming, outgoing, dir) {
    var dur = duration();
    incoming.style.zIndex = "2";
    outgoing.style.zIndex = "1";
    incoming.style.visibility = "visible";
    incoming.style.clipPath = "none";
    outgoing.style.clipPath = "none";
    if (reduce) {
      incoming.style.transform = "none";
      incoming.style.opacity = "0";
      outgoing.style.opacity = "1";
      return [incoming.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear", fill: "forwards" })];
    }
    var w = Math.round(stage.getBoundingClientRect().width) || 1;
    var from = dir > 0 ? w : -w;
    var outTo = dir > 0 ? -w : w;
    var opts = { duration: dur, easing: SLIDE_EASE, fill: "forwards" };
    incoming.style.opacity = "1";
    outgoing.style.opacity = "1";
    incoming.style.transform = "translate3d(" + from + "px,0,0)";
    outgoing.style.transform = "translate3d(0,0,0)";
    return [
      incoming.animate([
        { transform: "translate3d(" + from + "px,0,0)" },
        { transform: "translate3d(0,0,0)" }
      ], opts),
      outgoing.animate([
        { transform: "translate3d(0,0,0)" },
        { transform: "translate3d(" + outTo + "px,0,0)" }
      ], opts)
    ];
  }

  function start(to, dir) {
    var incoming = layers[1 - current];
    var outgoing = layers[current];
    var list = slides();
    paint(incoming, list[to]);
    swapText(list[to]);
    var anims = play(incoming, outgoing, dir);
    var handle = { incoming: incoming, outgoing: outgoing, to: to, anims: anims };
    run = handle;
    var my = job;
    Promise.all(anims.map(function (anim) { return anim.finished.catch(function () {}); })).then(function () {
      if (run !== handle || my !== job) return;
      handle.keepText = true;
      finishRun();
      neighbours();
    });
  }

  function neighbours() {
    var list = slides();
    [1, -1].forEach(function (step) {
      var item = list[(index + step + list.length) % list.length];
      if (item) loadImage(variant(item.img).src);
    });
  }

  function go(dir) {
    if (run) finishRun();
    var list = slides();
    if (!list.length) return;
    aim = (aim + dir + list.length) % list.length;
    var to = aim;
    var my = ++job;
    var picked = variant(list[to].img);
    return loadImage(picked.src).then(function () {
      if (my !== job) return;
      if (to === index && !run) return;
      start(to, dir);
    });
  }

  function boot() {
    var list = slides();
    index = 0;
    aim = 0;
    current = 0;
    if (run) { run = null; }
    layers.forEach(resetLayer);
    layers[0].classList.add("is-current");
    layers[0].classList.remove("is-next");
    layers[1].classList.add("is-next");
    layers[1].classList.remove("is-current");
    layers[1].style.visibility = "hidden";
    paint(layers[0], list[0]);
    setStatic(list[0]);
    syncIndex(0);
    neighbours();
  }

  paint(layers[0], slides()[0]).then(function () {
    setStatic(slides()[0]);
    neighbours();
  });
  setStatic(slides()[0]);

  mq.addEventListener ? mq.addEventListener("change", boot) : mq.addListener(boot);

  function refreshLang() {
    window.__MMCM_LANG = langCode();
    setStatic(slides()[index]);
  }
  function hookLang() {
    var store = langStore();
    if (!store || !store.set) return false;
    if (store.set.__heroBound) { refreshLang(); return true; }
    var orig = store.set.bind(store);
    function wrapped(code) {
      orig(code);
      window.__MMCM_LANG = code;
      refreshLang();
    }
    wrapped.__heroBound = true;
    store.set = wrapped;
    refreshLang();
    return true;
  }
  if (!hookLang()) {
    document.addEventListener("alpine:init", hookLang);
    document.addEventListener("alpine:initialized", hookLang);
  }
  function zoneDir(x) {
    var box = stage.getBoundingClientRect();
    return (x - box.left) < box.width / 3 ? -1 : 1;
  }
  var sx = 0;
  var sy = 0;
  var tracking = false;
  var swiped = false;
  stage.addEventListener("pointerdown", function (event) {
    if (event.button !== 0) return;
    sx = event.clientX;
    sy = event.clientY;
    tracking = true;
    swiped = false;
  });
  stage.addEventListener("pointerup", function (event) {
    if (!tracking) return;
    tracking = false;
    var dx = event.clientX - sx;
    var dy = event.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swiped = true;
      go(dx < 0 ? 1 : -1);
    }
  });
  stage.addEventListener("click", function (event) {
    if (swiped) { swiped = false; return; }
    var box = stage.getBoundingClientRect();
    go(zoneDir(event.clientX), [event.clientX - box.left, event.clientY - box.top]);
  });

  window.addEventListener("keydown", function (event) {
    if (event.altKey || event.metaKey || event.ctrlKey) return;
    var tag = (event.target && event.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    var root = document.querySelector("[x-data]");
    var app = root && root._x_dataStack && root._x_dataStack[0];
    if (app && app.currentView !== "home") return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
  });
})();
