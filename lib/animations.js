import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Maps pathname to an animation recipe name
function getRouteKey(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/projects") return "projects";
  if (pathname.startsWith("/projects/")) return "project-detail";
  if (pathname === "/coursework") return "coursework";
  if (pathname === "/reports") return "reports";
  if (pathname === "/presentations") return "presentations";
  if (pathname.startsWith("/presentations/")) return "presentation-detail";
  if (pathname === "/resume") return "resume";
  return "default";
}

// Per-route from-states: gives each page a distinct entry feel
const ROUTE_RECIPES = {
  home: {
    headingFrom: { y: 22, opacity: 0 },
    cardFrom:    { y: 18, opacity: 0, scale: 0.985 },
    mediaFrom:   { y: 14, opacity: 0, scale: 0.985 }
  },
  projects: {
    headingFrom: { x: -18, opacity: 0 },
    cardFrom:    { x: -14, opacity: 0, scale: 0.985 },
    mediaFrom:   { y: 12, opacity: 0, scale: 0.99 }
  },
  "project-detail": {
    headingFrom: { y: 18, opacity: 0 },
    cardFrom:    { y: 14, opacity: 0, scale: 0.99 },
    mediaFrom:   { y: 10, opacity: 0, scale: 0.99 }
  },
  coursework: {
    headingFrom: { y: 18, opacity: 0 },
    cardFrom:    { x: 12, opacity: 0, scale: 0.99 },
    mediaFrom:   { y: 10, opacity: 0, scale: 0.99 }
  },
  reports: {
    headingFrom: { y: 18, opacity: 0 },
    cardFrom:    { y: 14, opacity: 0, scale: 0.99 },
    mediaFrom:   { y: 10, opacity: 0, scale: 0.99 }
  },
  presentations: {
    headingFrom: { x: 18, opacity: 0 },
    cardFrom:    { x: 14, opacity: 0, scale: 0.985 },
    mediaFrom:   { y: 10, opacity: 0, scale: 0.985 }
  },
  "presentation-detail": {
    headingFrom: { y: 18, opacity: 0 },
    cardFrom:    { y: 14, opacity: 0, scale: 0.99 },
    mediaFrom:   { y: 10, opacity: 0, scale: 0.99 }
  },
  resume: {
    headingFrom: { y: 18, opacity: 0 },
    cardFrom:    { y: 14, opacity: 0, scale: 0.99 },
    mediaFrom:   { y: 10, opacity: 0, scale: 0.99 }
  },
  default: {
    headingFrom: { y: 18, opacity: 0 },
    cardFrom:    { y: 14, opacity: 0, scale: 0.99 },
    mediaFrom:   { opacity: 0 }
  }
};

// Text scramble: characters randomise on scroll-enter, then lock to final text (data-scramble attr)
const SCRAMBLE_CHARS = "!<>-_\\/[]{}|=+*^?#@&%$~";

function scrambleText(element, duration) {
  if (!element) return;
  if (element.childElementCount > 0) return;
  // Prefer textContent over the attribute value: it's already HTML-decoded
  // and guaranteed to match what the user will see after the animation settles.
  const finalText  = (element.textContent ?? "").trim() || element.getAttribute("data-scramble") || "";
  const totalFrames = Math.ceil((duration ?? 1.1) * 60);
  let frame = 0;
  let raf;

  const run = () => {
    let out = "";
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === " ") { out += " "; continue; }
      const charReveal   = i / finalText.length;
      const globalProgress = frame / totalFrames;
      if (globalProgress > charReveal + 0.32) {
        out += finalText[i];
      } else {
        out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    element.textContent = out;
    frame++;
    if (frame <= totalFrames) {
      raf = requestAnimationFrame(run);
    } else {
      element.textContent = finalText;
    }
  };

  raf = requestAnimationFrame(run);
  return () => { cancelAnimationFrame(raf); element.textContent = finalText; };
}

function createTextScramble(main) {
  const els      = Array.from(main.querySelectorAll("[data-scramble]")).filter((el) => el.childElementCount === 0);
  const cleanups = [];

  els.forEach((el) => {
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => scrambleText(el, 1.1)
    });
    cleanups.push(() => trigger.kill());
  });

  return () => cleanups.forEach((c) => c());
}

// Magnetic elements: data-magnetic attr controls pull strength on hover (default 0.38)
function createMagneticElements() {
  const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!isFine) return () => {};

  const targets  = Array.from(document.querySelectorAll("[data-magnetic]"));
  const cleanups = [];

  targets.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const strength = Number(el.getAttribute("data-magnetic") ?? "0.38");
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (e) => {
      const b  = el.getBoundingClientRect();
      const cx = b.left + b.width  / 2;
      const cy = b.top  + b.height / 2;
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener("mousemove",  onMove);
    el.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    });
  });

  return () => cleanups.forEach((c) => c());
}

// Ambient layer: drifting glow nodes + cursor-tracking orb (data-motion-ambient / data-motion-pulse)
function createAmbientLayerAnimation() {
  const root = document.querySelector("[data-motion-ambient]");
  if (!root) return () => {};

  const cursorOrb = root.querySelector("[data-motion-cursor]");
  const pulseNodes = gsap.utils.toArray("[data-motion-pulse]", root);

  const context = gsap.context(() => {
    pulseNodes.forEach((node, i) => {
      gsap.to(node, {
        x:        i % 2 === 0 ?  90 : -70,
        y:        i % 2 === 0 ? -60 :  70,
        scale:    i % 3 === 0 ? 1.18 : 0.88,
        duration: 7 + i * 2.2,
        repeat:   -1,
        yoyo:     true,
        ease:     "sine.inOut"
      });
    });
  }, root);

  let removePointer = () => {};

  if (cursorOrb && window.matchMedia("(min-width: 768px)").matches) {
    gsap.set(cursorOrb, { x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 });
    const moveX = gsap.quickTo(cursorOrb, "x", { duration: 0.7, ease: "power3.out" });
    const moveY = gsap.quickTo(cursorOrb, "y", { duration: 0.7, ease: "power3.out" });
    const onMove = (e) => { moveX(e.clientX); moveY(e.clientY); };
    window.addEventListener("mousemove", onMove, { passive: true });
    removePointer = () => window.removeEventListener("mousemove", onMove);
  }

  return () => { removePointer(); context.revert(); };
}

// Detail view expansion: morphs gallery card to full page on enter
function createDetailViewExpansionAnimation(main) {
  const detailMorphs = Array.from(main.querySelectorAll("[layoutId*='project-card'], [layoutId*='about-card']"));
  const cleanups = [];

  detailMorphs.forEach((morph) => {
    if (!(morph instanceof HTMLElement)) return;
    
    const ctx = gsap.context(() => {
      // Subtle scale and opacity boost on detail page entry
      gsap.from(morph, {
        scale: 0.95,
        opacity: 0.9,
        duration: 0.55,
        ease: "power2.out",
        clearProps: "all"
      });
    }, morph);
    cleanups.push(() => ctx.revert());
  });

  return () => cleanups.forEach((c) => c());
}

// Cinematic intro: blur+opacity reveal on page load with directional push hint
function createCinematicIntro(main, direction) {
  const context = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const navHeader = document.querySelector("[data-nav]");
    const mainFromX = direction === "forward" ? 26 : direction === "backward" ? -26 : 0;

    tl.fromTo(
      main,
      { opacity: 0, y: 12, x: mainFromX, filter: "blur(4px)" },
      { opacity: 1, y: 0, x: 0, filter: "blur(0px)", duration: 0.62, clearProps: "opacity,y,x,filter" }
    );

    if (navHeader) {
      tl.from(
        navHeader,
        { yPercent: -100, opacity: 0, duration: 0.42, clearProps: "all" },
        "<0.08"
      );
    }
  }, main);

  return () => context.revert();
}

// Navigation: moves the active indicator pill; nav links are NOT staggered (causes flash on route change)
function createNavigationAnimation() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return () => {};

  const navLinks  = Array.from(nav.querySelectorAll("[data-nav-link]"));
  const indicator = nav.querySelector("[data-nav-indicator]");

  const updateIndicator = (target) => {
    if (!indicator || !(target instanceof HTMLElement)) return;
    const listRect = target.closest("ul")?.getBoundingClientRect();
    const rect     = target.getBoundingClientRect();
    if (!listRect) return;
    gsap.to(indicator, {
      x: rect.left - listRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.4,
      ease: "power3.inOut"
    });
  };

  const activeLink = navLinks.find((l) => l.getAttribute("data-active") === "true");
  if (activeLink) updateIndicator(activeLink);

  const resetToActive = () => {
    if (activeLink instanceof HTMLElement) {
      updateIndicator(activeLink);
    }
  };

  const cleanups = [];
  navLinks.forEach((link) => {
    const onEnter = () => updateIndicator(link);
    link.addEventListener("mouseenter", onEnter);
    link.addEventListener("focus",      onEnter);
    cleanups.push(() => {
      link.removeEventListener("mouseenter", onEnter);
      link.removeEventListener("focus",      onEnter);
    });
  });

  const onNavLeave = () => resetToActive();
  const onNavFocusOut = (event) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !nav.contains(nextTarget)) {
      resetToActive();
    }
  };

  nav.addEventListener("mouseleave", onNavLeave);
  nav.addEventListener("focusout", onNavFocusOut);
  cleanups.push(() => {
    nav.removeEventListener("mouseleave", onNavLeave);
    nav.removeEventListener("focusout", onNavFocusOut);
  });

  return () => { cleanups.forEach((c) => c()); };
}

// Navigation order for directional push animations
const NAV_ORDER = ["/", "/about", "/projects", "/coursework", "/reports", "/presentations", "/resume"];

function getNavDirection(prevPathname, nextPathname) {
  const getBasePath = (pathname) => NAV_ORDER.find((path) => path !== "/" && (pathname === path || pathname.startsWith(`${path}/`))) ?? "/";
  const prevIndex = NAV_ORDER.indexOf(getBasePath(prevPathname));
  const nextIndex = NAV_ORDER.indexOf(getBasePath(nextPathname));
  
  if (prevIndex === -1 || nextIndex === -1 || prevIndex === nextIndex) return null;
  return nextIndex > prevIndex ? "forward" : "backward";
}

// Store last pathname for direction detection
let lastPathnameForDirection = "/";

// Route entrance: per-route timeline with directional push
function createRouteEntranceAnimation(main, pathname) {
  const pendingDirection = window.__portfolioRouteDirection ?? null;
  const direction = pendingDirection ?? getNavDirection(lastPathnameForDirection, pathname);
  window.__portfolioRouteDirection = null;
  lastPathnameForDirection = pathname;
  
  const recipe   = ROUTE_RECIPES[getRouteKey(pathname)] ?? ROUTE_RECIPES.default;
  const headings = Array.from(main.querySelectorAll("h1, .section-title")).slice(0, 10);
  const cards    = Array.from(main.querySelectorAll(".card:not([data-horizontal-panel]):not(details)")).slice(0, 32);
  const media    = Array.from(main.querySelectorAll("img, iframe, video")).slice(0, 16);

  // Apply directional push to recipe
  const directionalRecipe = { ...recipe };
  if (direction === "forward") {
    directionalRecipe.headingFrom = { ...recipe.headingFrom, x: (recipe.headingFrom.x ?? 0) + 80 };
    directionalRecipe.cardFrom = { ...recipe.cardFrom, x: (recipe.cardFrom.x ?? 0) + 40 };
  } else if (direction === "backward") {
    directionalRecipe.headingFrom = { ...recipe.headingFrom, x: (recipe.headingFrom.x ?? 0) - 80 };
    directionalRecipe.cardFrom = { ...recipe.cardFrom, x: (recipe.cardFrom.x ?? 0) - 40 };
  }

  const context = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (headings.length) {
      tl.from(headings, { ...directionalRecipe.headingFrom, duration: 0.58, stagger: 0.05, clearProps: "all" });
    }
    if (cards.length) {
      tl.from(cards, { ...directionalRecipe.cardFrom, duration: 0.52, stagger: 0.03, clearProps: "all" }, "<0.08");
    }
    if (media.length) {
      tl.from(media, { ...directionalRecipe.mediaFrom, duration: 0.48, stagger: 0.03, clearProps: "all" }, "<0.06");
    }
  }, main);

  return () => context.revert();
}

// Section transitions: sections scrub in from y/opacity offset on scroll
function createSectionTransitionAnimation(main) {
  const sections = Array.from(main.querySelectorAll("section[id], article[id]"));
  const cleanups = [];

  sections.forEach((section) => {
    gsap.set(section, { opacity: 0, y: 18 });
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(section, {
          opacity: 1,
          y: 0,
          duration: 0.58,
          ease: "power2.out",
          clearProps: "opacity,y"
        });
      }
    });
    cleanups.push(() => trigger.kill());
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

// Parallax: data-parallax-speed attr; yPercent shifts proportional to speed value
function createParallaxAnimation(main) {
  const layers = gsap.utils.toArray("[data-parallax-speed]", main);
  const contexts = [];

  layers.forEach((layer) => {
    const speed = Number(layer.getAttribute("data-parallax-speed") ?? "0.15");
    const ctx   = gsap.context(() => {
      gsap.to(layer, {
        yPercent: -20 * speed * 10,
        ease: "none",
        scrollTrigger: {
          trigger: layer.closest("section") ?? layer,
          start: "top bottom",
          end:   "bottom top",
          scrub: true
        }
      });
    }, layer);
    contexts.push(ctx);
  });

  return () => contexts.forEach((c) => c.revert());
}

// Section indicator: activates fixed right-edge dots as each section enters focus
function createSectionIndicatorAnimation(main) {
  const dots     = Array.from(document.querySelectorAll("[data-section-dot]"));
  const sections = Array.from(main.querySelectorAll("section[id], article[id]")).slice(0, dots.length);

  if (!dots.length || sections.length < 2) return () => {};

  const cleanups = [];

  sections.forEach((section, i) => {
    const dot  = dots[i];
    const core = dot?.querySelector("[data-section-dot-core]");
    if (!(dot instanceof HTMLElement) || !(core instanceof HTMLElement)) return;

    const trigger = ScrollTrigger.create({
      trigger:     section,
      start:       "top center",
      end:         "bottom center",
      onEnter:     () => gsap.to(core, { scale: 1.55, backgroundColor: "#f87171", duration: 0.26, ease: "power2.out" }),
      onEnterBack: () => gsap.to(core, { scale: 1.55, backgroundColor: "#f87171", duration: 0.26, ease: "power2.out" }),
      onLeave:     () => gsap.to(core, { scale: 1, backgroundColor: "rgba(248,113,113,0.35)", duration: 0.26 }),
      onLeaveBack: () => gsap.to(core, { scale: 1, backgroundColor: "rgba(248,113,113,0.35)", duration: 0.26 })
    });
    cleanups.push(() => trigger.kill());
  });

  return () => cleanups.forEach((c) => c());
}

// Divider reveal: data-motion-divider elements scaleX from left on scroll entry
function createDividerAnimation() {
  const dividers = Array.from(document.querySelectorAll("[data-motion-divider]"));
  const contexts = [];

  dividers.forEach((divider) => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        divider,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1,
          duration: 1.1, ease: "power3.out",
          transformOrigin: "left center",
          scrollTrigger: { trigger: divider, start: "top 96%" }
        }
      );
    }, divider);
    contexts.push(ctx);
  });

  return () => contexts.forEach((c) => c.revert());
}

// Card hover: 3D tilt on mousemove; transforms reset on cleanup to prevent stale state on route change
function createInteractiveHoverAnimation() {
  const isFine   = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cards    = Array.from(document.querySelectorAll(".card:not([data-horizontal-panel]):not(details)"));
  const cleanups = [];

  if (!isFine) return () => {};

  cards.forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    const onEnter = () => {
      gsap.to(card, { y: -8, scale: 1.035, duration: 0.28, ease: "power2.out", overwrite: "auto" });
    };
    const onLeave = () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.24, ease: "power2.inOut", overwrite: "auto" });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("focusin", onEnter);
    card.addEventListener("focusout", onLeave);

    cleanups.push(() => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("focusin", onEnter);
      card.removeEventListener("focusout", onLeave);
      gsap.set(card, { y: 0, scale: 1, clearProps: "transform" });
    });
  });

  return () => cleanups.forEach((c) => c());
}

// Section numbers: data-section-num elements fade+slide in on scroll entry
function createSectionNumberReveal(main) {
  const numEls   = Array.from(main.querySelectorAll("[data-section-num]"));
  const cleanups = [];

  numEls.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 24 });
    const trigger = ScrollTrigger.create({
      trigger: el.closest("section") ?? el,
      start:   "top 82%",
      once:    true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" })
    });
    cleanups.push(() => trigger.kill());
  });

  return () => cleanups.forEach((c) => c());
}

// Orchestrates all animation systems on route change; returns a full cleanup function
export function setupRouteAnimations(pathname) {
  if (typeof window === "undefined") return () => {};

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  gsap.killTweensOf("*");
  gsap.registerPlugin(ScrollTrigger);

  const main = document.querySelector("main");
  if (!main) return () => {};

  const direction = getNavDirection(lastPathnameForDirection, pathname);

  const cleanups = [
    createCinematicIntro(main, direction),
    createAmbientLayerAnimation(),
    createNavigationAnimation(),
    createRouteEntranceAnimation(main, pathname),
    createSectionTransitionAnimation(main),
    createParallaxAnimation(main),
    createSectionIndicatorAnimation(main),
    createDividerAnimation(),
    createInteractiveHoverAnimation(),
    createMagneticElements(),
    createTextScramble(main),
    createSectionNumberReveal(main)
  ];

  ScrollTrigger.refresh();

  return () => {
    cleanups.forEach((cleanup) => { if (typeof cleanup === "function") cleanup(); });
  };
}
