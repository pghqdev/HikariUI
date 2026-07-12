// hikari.js — optional, dependency-free progressive enhancement.
// Helpers so far: copy buttons on <pre>, tabs wiring, and a command-invoker
// fallback for <dialog>. Theme switch + toast helpers land in a later unit.
// Every helper is also documented as paste-it-yourself vanilla, so the file
// stays optional.
(() => {
  let uid = 0;

  // --- Copy buttons ---
  function decorate(pre) {
    if (pre.querySelector(".hk-copy")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hk-copy";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", async () => {
      const source = pre.querySelector("code") ?? pre;
      try {
        await navigator.clipboard.writeText(source.innerText.trimEnd());
        btn.textContent = "Copied";
        btn.dataset.copied = "";
        setTimeout(() => {
          btn.textContent = "Copy";
          delete btn.dataset.copied;
        }, 1400);
      } catch {
        btn.textContent = "Error";
        setTimeout(() => (btn.textContent = "Copy"), 1400);
      }
    });
    pre.appendChild(btn);
  }

  // --- Tabs: wire ARIA + roving arrow-key nav; toggle panel visibility.
  // No-JS leaves every panel visible, so this only ever hides. ---
  function tabs(root) {
    const list = root.querySelector("[data-tab-list]");
    if (!list) return;
    const tabs = [...list.querySelectorAll("button")];
    const panels = [...root.querySelectorAll("[data-tab-panel]")];
    // ponytail: 1:1 tabs↔panels, no nested [data-tabs]. Bail if it doesn't hold.
    if (!tabs.length || tabs.length !== panels.length) return;

    const group = uid++;
    list.setAttribute("role", "tablist");
    tabs.forEach((tab, i) => {
      const panel = panels[i];
      tab.setAttribute("role", "tab");
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("tabindex", "0");
      if (!tab.id) tab.id = `hk-tab-${group}-${i}`;
      if (!panel.id) panel.id = `hk-panel-${group}-${i}`;
      tab.setAttribute("aria-controls", panel.id);
      panel.setAttribute("aria-labelledby", tab.id);
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", (e) => {
        const map = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        const next = (map[e.key] + tabs.length) % tabs.length;
        select(next);
        tabs[next].focus();
      });
    });

    function select(active) {
      tabs.forEach((tab, i) => {
        const on = i === active;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
    }

    // Honour a pre-marked [aria-selected="true"] tab, else the first.
    select(Math.max(0, tabs.findIndex((t) => t.getAttribute("aria-selected") === "true")));
  }

  // --- Dialog: native `command`/`commandfor` invokers do the work where
  // supported. Only polyfill the click when the browser lacks them. ---
  function dialogFallback() {
    if ("command" in HTMLButtonElement.prototype) return;
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[commandfor]");
      if (!btn) return;
      const target = document.getElementById(btn.getAttribute("commandfor"));
      if (!target) return;
      const cmd = btn.getAttribute("command");
      if (cmd === "show-modal") target.showModal?.();
      else if (cmd === "close") target.close?.();
    });
  }

  function run() {
    document.querySelectorAll("pre").forEach(decorate);
    document.querySelectorAll("[data-tabs]").forEach(tabs);
    dialogFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
