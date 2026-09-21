/* dt-live.js - the four-answers bench for learn-data-thinking-with-phoebe.
 *
 * One dataset, three business questions, four levels of answer each. Every number is
 * computed from the rows: a real filter, a real group-by, a real ratio. Nothing is
 * looked up from a table of "what the answer should be".
 *
 * The four levels, in the order a person actually reaches for them:
 *   1 HEADLINE     one number for everyone, before against after
 *   2 SPLIT        the same comparison inside each obvious group
 *   3 CONTROL      against a group the change did not touch
 *   4 LIKE-FOR-LIKE the same units, same weeks, holding the mix fixed
 *
 * The designed lesson is that you cannot tell from the headline whether the headline is
 * safe. One question's headline survives all four levels, which means the cheap answer
 * was the right answer and the extra work bought nothing. One reverses completely once
 * the mix is held fixed. One cannot be answered with these rows at all, and the honest
 * output is to say so rather than to produce a number.
 *
 * Two kinds of number, and the widget labels each one:
 *   measured  - computed from the rows below
 *   heuristic - the one-line verdict, a rule of thumb, badged as one
 *
 * THE DATASET IS CONSTRUCTED. 1,186 rows (ROWS.length is the only source of truth) written so that the three
 * questions behave differently, not sampled from a real business. No published figures
 * exist on how often naive aggregates reverse under stratification, so no such claim is
 * made. What is real is the arithmetic, and the real-world anchor is a published case
 * quoted on the page beside it.
 */
(function () {
  "use strict";

  /* ---------- the rows ------------------------------------------------- */
  /* Daybreak, the coffee subscription company from the sibling courses. Twelve weeks of
     orders either side of an autumn promotion. Each row is one customer-week.

     Built from a fixed seed so every learner sees the same numbers, and so the page can
     quote them. Two customer types (new, returning) and two channels (email, social)
     because the three questions need a mix that moves. */

  function mulberry(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* Designed behaviour, stated openly so nobody has to reverse-engineer it:
       Q1 conversion: really rose in both segments, headline survives every level.
       Q2 revenue per order: fell within BOTH channels, but the mix shifted toward the
          higher-value channel, so the headline rises. A textbook reversal.
       Q3 "did it bring in the customers who stay": the rows have no later retention
          column, so no level can answer it. */
  function build() {
    var rnd = mulberry(20260921), rows = [];
    var WEEKS = 24;                       /* 12 before, 12 after */
    for (var w = 0; w < WEEKS; w++) {
      var after = w >= 12;
      /* the mix shift: social grows from ~30% to ~60% of orders after the promo */
      var socialShare = after ? 0.60 : 0.30;
      var nOrders = 45 + Math.floor(rnd() * 11);
      for (var i = 0; i < nOrders; i++) {
        var social = rnd() < socialShare;
        var channel = social ? "social" : "email";
        var returning = rnd() < (after ? 0.55 : 0.58);
        var type = returning ? "returning" : "new";

        /* Q1: conversion genuinely improves in both segments after the promo */
        var pConv = (returning ? 0.42 : 0.26) + (after ? 0.09 : 0);
        var converted = rnd() < pConv;

        /* Q2: value per order falls WITHIN each channel after the promo, but social
           orders are worth more than email ones, and social's share doubles */
        var base = social ? 38 : 24;
        var drop = after ? -3.2 : 0;
        var value = Math.max(4, Math.round((base + drop + (rnd() * 10 - 5)) * 100) / 100);

        rows.push({ w: w, after: after, channel: channel, type: type,
                    converted: converted, value: converted ? value : 0 });
      }
    }
    return rows;
  }

  var ROWS = build();

  /* ---------- the three questions -------------------------------------- */
  var QUESTIONS = [
    { id: "conv", label: "Did the promotion lift conversion?",
      note: "The question the promotion was run to answer. Conversion is orders that converted, over all orders.",
      metric: "rate", field: "converted", unit: "%" },
    { id: "value", label: "Did the promotion lift revenue per order?",
      note: "The question finance asked afterwards. Revenue per converted order, in pounds.",
      metric: "mean", field: "value", unit: "GBP" },
    { id: "stay", label: "Did it bring in customers who stay?",
      note: "The question the founder actually cares about. Read the columns before you answer this one.",
      metric: "none", field: null, unit: "" }
  ];

  /* ---------- the four levels ------------------------------------------ */
  function agg(rows, q) {
    if (q.metric === "rate") {
      if (!rows.length) return null;
      var c = rows.filter(function (r) { return r.converted; }).length;
      return 100 * c / rows.length;
    }
    if (q.metric === "mean") {
      var conv = rows.filter(function (r) { return r.converted; });
      if (!conv.length) return null;
      return conv.reduce(function (a, r) { return a + r.value; }, 0) / conv.length;
    }
    return null;
  }

  function beforeAfter(rows, q) {
    var b = agg(rows.filter(function (r) { return !r.after; }), q);
    var a = agg(rows.filter(function (r) { return r.after; }), q);
    if (b === null || a === null) return null;
    return { before: b, after: a, diff: a - b, pct: b ? 100 * (a - b) / b : null };
  }

  /* level 4: hold the channel mix at its BEFORE proportions, then recompute after.
     This is the like-for-like comparison: same metric, same mix. */
  function mixAdjusted(rows, q) {
    var pre = rows.filter(function (r) { return !r.after; });
    var post = rows.filter(function (r) { return r.after; });
    if (!pre.length || !post.length) return null;
    var channels = ["email", "social"];
    var wts = {}, tot = pre.length;
    channels.forEach(function (c) {
      wts[c] = pre.filter(function (r) { return r.channel === c; }).length / tot;
    });
    function weighted(set) {
      var s = 0, used = 0;
      channels.forEach(function (c) {
        var v = agg(set.filter(function (r) { return r.channel === c; }), q);
        if (v !== null) { s += wts[c] * v; used += wts[c]; }
      });
      return used ? s / used : null;
    }
    var b = weighted(pre), a = weighted(post);
    if (b === null || a === null) return null;
    return { before: b, after: a, diff: a - b, pct: b ? 100 * (a - b) / b : null };
  }

  function levels(q) {
    if (q.metric === "none") {
      return [
        { id: "headline", label: "Headline", verdict: "no column", detail: "Nothing in these rows records what happened to a customer after the promotion window." },
        { id: "split", label: "Split by group", verdict: "no column", detail: "Splitting rows you do not have does not create them." },
        { id: "control", label: "Against a comparison group", verdict: "no column", detail: "There is no later period to compare anybody's behaviour in." },
        { id: "like", label: "Like-for-like", verdict: "no column", detail: "The question needs a follow-up window. The data set ends at week 24." }
      ];
    }
    var out = [];
    var h = beforeAfter(ROWS, q);
    out.push({ id: "headline", label: "Headline", n: ROWS.length, res: h,
               detail: "Every row, before against after." });

    var splits = ["email", "social"].map(function (c) {
      return { name: c, res: beforeAfter(ROWS.filter(function (r) { return r.channel === c; }), q) };
    });
    out.push({ id: "split", label: "Split by channel", splits: splits,
               detail: "The same comparison inside each channel." });

    var ctrl = ["new", "returning"].map(function (t) {
      return { name: t, res: beforeAfter(ROWS.filter(function (r) { return r.type === t; }), q) };
    });
    out.push({ id: "control", label: "Split by customer type", splits: ctrl,
               detail: "The other obvious way to cut it." });

    out.push({ id: "like", label: "Like-for-like (mix held fixed)", res: mixAdjusted(ROWS, q),
               detail: "The after period reweighted to the before period's channel mix." });
    return out;
  }

  function fmt(v, q) {
    if (v === null || v === undefined) return "-";
    return q.unit === "%" ? v.toFixed(1) + "%" : "GBP " + v.toFixed(2);
  }
  function sign(v) { return v > 0 ? "+" : ""; }

  function grade(q, ls) {
    if (q.metric === "none")
      return ["bad", "Not answerable with these columns - and saying so is the answer"];
    var head = ls[0].res, like = ls[3].res;
    var splitRes = ls[1].splits.map(function (s) { return s.res; }).filter(Boolean);
    var allSame = splitRes.every(function (r) { return (r.diff > 0) === (head.diff > 0); });
    var likeSame = like && ((like.diff > 0) === (head.diff > 0));
    if (!allSame || !likeSame)
      return ["bad", "The headline reverses once the mix is held fixed"];
    return ["good", "The headline survives every level - the cheap answer was the right one"];
  }

  /* ---------- widget --------------------------------------------------- */
  var root, readout, table, btns = {}, current = null, out = {};

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function metric(label, value, unit, kind) {
    return '<div class="mb-metric"><span class="mb-mlabel">' + label + "</span>" +
           '<span class="mb-mvalue">' + value + "</span>" +
           '<span class="mb-munit">' + unit + "</span>" +
           '<span class="mb-mkind is-' + kind + '">' + kind + "</span></div>";
  }

  function row(level, q) {
    var cells;
    if (level.verdict === "no column") {
      cells = '<td class="dt-na" colspan="3">' + esc(level.detail) + "</td>";
    } else if (level.splits) {
      cells = '<td colspan="3"><div class="dt-splits">' + level.splits.map(function (s) {
        if (!s.res) return '<span class="dt-sp">' + esc(s.name) + ": -</span>";
        var dir = s.res.diff > 0 ? "up" : "down";
        return '<span class="dt-sp is-' + dir + '"><b>' + esc(s.name) + "</b> " +
               fmt(s.res.before, q) + " &rarr; " + fmt(s.res.after, q) +
               " <em>" + sign(s.res.diff) + s.res.diff.toFixed(q.unit === "%" ? 1 : 2) + "</em></span>";
      }).join("") + "</div></td>";
    } else if (level.res) {
      var d = level.res.diff > 0 ? "up" : "down";
      cells = "<td>" + fmt(level.res.before, q) + "</td><td>" + fmt(level.res.after, q) +
              '</td><td class="dt-' + d + '">' + sign(level.res.diff) + level.res.diff.toFixed(q.unit === "%" ? 1 : 2) +
              (level.res.pct !== null ? " (" + sign(level.res.pct) + level.res.pct.toFixed(1) + "%)" : "") + "</td>";
    } else {
      cells = '<td colspan="3">-</td>';
    }
    return "<tr><th>" + esc(level.label) + "<em>" + esc(level.detail) + "</em></th>" + cells + "</tr>";
  }

  function render() {
    var q = QUESTIONS.filter(function (x) { return x.id === current; })[0];
    var ls = levels(q);
    var g = grade(q, ls);
    out = { question: q.id, levels: ls, verdict: g[1], rows: ROWS.length };
    if (q.metric !== "none") {
      out.headline = ls[0].res; out.like = ls[3].res;
      out.splitChannel = ls[1].splits; out.splitType = ls[2].splits;
    }
    readout.innerHTML =
      '<div class="mb-verdict is-' + g[0] + '">' + esc(g[1]) + ' <span class="mb-mkind is-heuristic">heuristic</span></div>' +
      '<div class="mb-metrics">' +
        metric("Rows in the data", ROWS.length, "customer-weeks, 12 before and 12 after", "measured") +
        (q.metric === "none"
          ? metric("Columns that answer it", 0, "the honest output is a question, not a number", "measured")
          : metric("Headline change", (out.headline.diff > 0 ? "+" : "") + out.headline.diff.toFixed(q.unit === "%" ? 1 : 2),
                   q.unit === "%" ? "percentage points" : "pounds per order", "measured") +
            metric("Like-for-like change", (out.like.diff > 0 ? "+" : "") + out.like.diff.toFixed(q.unit === "%" ? 1 : 2),
                   "mix held at the before period", "measured") +
            metric("Do they agree?", ((out.headline.diff > 0) === (out.like.diff > 0)) ? "yes" : "NO",
                   "same direction, headline against like-for-like", "measured")) +
      "</div>";
    table.innerHTML = '<table class="dt-table"><thead><tr><th>Level</th><th>Before</th><th>After</th><th>Change</th></tr></thead><tbody>' +
      ls.map(function (l) { return row(l, q); }).join("") + "</tbody></table>";
  }

  function setQuestion(id) {
    current = id;
    Object.keys(btns).forEach(function (k) {
      btns[k].classList.toggle("is-on", k === id);
      btns[k].querySelector("input").checked = (k === id);
    });
    render();
  }

  function buildUI() {
    var panel = document.createElement("div");
    panel.className = "mb-presets";
    QUESTIONS.forEach(function (q) {
      var lab = document.createElement("label");
      lab.className = "mb-preset" + (q.metric === "none" ? " is-anti" : "");
      lab.innerHTML = '<input type="radio" name="dt-q" value="' + q.id + '">' +
        '<span class="mb-pname">' + esc(q.label) +
        (q.metric === "none" ? ' <em class="mb-anti">the one with no answer</em>' : "") + "</span>" +
        '<span class="mb-pnote">' + esc(q.note) + "</span>";
      panel.appendChild(lab);
      btns[q.id] = lab;
      lab.querySelector("input").addEventListener("change", function () { setQuestion(q.id); });
    });

    var hint = document.createElement("p");
    hint.className = "mb-hint";
    hint.textContent = ROWS.length.toLocaleString() + " customer-weeks written so the three " +
      "questions behave differently. The arithmetic is real; the business is not. Read the four levels top to " +
      "bottom before reading the verdict.";

    readout = document.createElement("div"); readout.className = "mb-readout";
    table = document.createElement("div"); table.className = "dt-tablewrap";

    root.appendChild(panel); root.appendChild(hint);
    root.appendChild(readout); root.appendChild(table);
    setQuestion("conv");
  }

  function init() {
    root = document.getElementById("four-answers");
    if (!root) return;
    buildUI();
    window.DT_LIVE = {
      questions: QUESTIONS.map(function (q) { return q.id; }),
      ask: setQuestion,
      get current() { return current; },
      get metrics() { return out; },
      rows: ROWS.length,
      raw: ROWS
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
