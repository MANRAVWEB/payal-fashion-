
;

    (function() {
      function dismissPreloader() {
        var p = document.getElementById("luxury-preloader");
        if (p && !p.classList.contains("fade-out")) {
          p.classList.add("fade-out");
          setTimeout(function() { if (p && p.parentNode) p.parentNode.removeChild(p); }, 800);
        }
      }
      window.addEventListener("load", function() { setTimeout(dismissPreloader, 500); });
      setTimeout(dismissPreloader, 1500);
    })();
  