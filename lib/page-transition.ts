type RouterLike = {
  push: (href: string) => void;
};

type SharedTransitionState = {
  originPath: string;
  destinationPath: string;
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  borderRadius: string;
  timestamp: number;
};

type NavigateWithTransitionOptions = {
  href: string;
  router: RouterLike;
  sourceElement?: HTMLElement | null;
  sharedKey?: string;
  beforeNavigate?: () => void;
  preferBack?: boolean;
};

const NAV_ORDER = ["/", "/about", "/projects", "/coursework", "/reports", "/presentations", "/resume"];
const SHARED_STATE_PREFIX = "portfolio:shared-transition:";
const SHARED_STATE_MAX_AGE_MS = 1000 * 60 * 10;

let transitionLock = false;
let releaseTransitionLockTimer: number | null = null;
const TRANSITION_LOCK_RELEASE_MS = 1000;

function getBaseRoute(pathname: string) {
  const matchedRoute = NAV_ORDER.find((route) => route !== "/" && (pathname === route || pathname.startsWith(`${route}/`)));
  return matchedRoute ?? "/";
}

export function getRouteDirection(currentPathname: string, nextPathname: string) {
  const currentIndex = NAV_ORDER.indexOf(getBaseRoute(currentPathname));
  const nextIndex = NAV_ORDER.indexOf(getBaseRoute(nextPathname));

  if (currentIndex === -1 || nextIndex === -1 || currentIndex === nextIndex) {
    return null;
  }

  return nextIndex > currentIndex ? "forward" : "backward";
}

function setTransitionDirection(direction: "forward" | "backward" | null) {
  if (typeof window === "undefined") {
    return;
  }

  (window as Window & { __portfolioRouteDirection?: "forward" | "backward" | null }).__portfolioRouteDirection = direction;
}

function resolveInternalHref(href: string) {
  const url = new URL(href, window.location.origin);

  if (url.origin !== window.location.origin) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function storeSharedState(sharedKey: string, sourceElement: HTMLElement, destinationPath: string) {
  const rect = sourceElement.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(sourceElement);

  const state: SharedTransitionState = {
    originPath: window.location.pathname,
    destinationPath,
    rect: {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    },
    borderRadius: computedStyle.borderRadius,
    timestamp: Date.now()
  };

  window.sessionStorage.setItem(`${SHARED_STATE_PREFIX}${sharedKey}`, JSON.stringify(state));
}

function getSharedState(sharedKey: string) {
  const rawState = window.sessionStorage.getItem(`${SHARED_STATE_PREFIX}${sharedKey}`);

  if (!rawState) {
    return null;
  }

  try {
    const parsedState = JSON.parse(rawState) as SharedTransitionState;

    if (Date.now() - parsedState.timestamp > SHARED_STATE_MAX_AGE_MS) {
      window.sessionStorage.removeItem(`${SHARED_STATE_PREFIX}${sharedKey}`);
      return null;
    }

    return parsedState;
  } catch {
    window.sessionStorage.removeItem(`${SHARED_STATE_PREFIX}${sharedKey}`);
    return null;
  }
}

function releaseTransitionLock() {
  transitionLock = false;

  if (releaseTransitionLockTimer !== null) {
    window.clearTimeout(releaseTransitionLockTimer);
    releaseTransitionLockTimer = null;
  }
}

function scheduleTransitionLockRelease() {
  if (releaseTransitionLockTimer !== null) {
    window.clearTimeout(releaseTransitionLockTimer);
  }

  releaseTransitionLockTimer = window.setTimeout(releaseTransitionLock, TRANSITION_LOCK_RELEASE_MS);
}

function performNavigation(href: string, router: RouterLike, preferBack: boolean, sharedState: SharedTransitionState | null) {
  if (preferBack && sharedState && sharedState.originPath === href && sharedState.destinationPath === window.location.pathname && window.history.length > 1) {
    window.history.back();
    return;
  }

  router.push(href);
}

export function navigateWithTransition({
  href,
  router,
  sourceElement,
  sharedKey,
  beforeNavigate,
  preferBack = false
}: NavigateWithTransitionOptions) {
  if (typeof window === "undefined") {
    router.push(href);
    return true;
  }

  const internalHref = resolveInternalHref(href);

  if (!internalHref) {
    window.location.href = href;
    return true;
  }

  const targetUrl = new URL(internalHref, window.location.origin);

  if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
    window.location.href = targetUrl.toString();
    return true;
  }

  if (transitionLock) {
    return false;
  }

  transitionLock = true;
  scheduleTransitionLockRelease();

  beforeNavigate?.();

  const direction = getRouteDirection(window.location.pathname, targetUrl.pathname);
  setTransitionDirection(direction);

  const destinationHref = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;

  window.requestAnimationFrame(() => {
    try {
      if (sourceElement instanceof HTMLElement && sharedKey) {
        if (!document.body.contains(sourceElement)) {
          performNavigation(destinationHref, router, preferBack, null);
          return;
        }

        storeSharedState(sharedKey, sourceElement, targetUrl.pathname);
      }

      performNavigation(destinationHref, router, preferBack, sharedKey ? getSharedState(sharedKey) : null);
    } catch (error) {
      releaseTransitionLock();
      throw error;
    }
  });

  return true;
}
