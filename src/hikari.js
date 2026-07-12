// hikari.js — optional, dependency-free progressive enhancement.
// This is the first slice: copy buttons on every <pre>. Theme switch, dialog,
// and toast helpers land in a later unit. Every helper is also documented as
// paste-it-yourself vanilla, so the file stays optional.

// ponytail: copy-buttons only for now; grows into the full helper set later.
(() => {
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

  function run() {
    document.querySelectorAll("pre").forEach(decorate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
