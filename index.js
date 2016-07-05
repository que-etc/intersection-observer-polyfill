import IntersectionObserverPolyfill from './src/IntersectionObserver';

let IntersectionObserver;

// Define what implementation of IntersectionObserver
// needs to be exported: existing or polyfilled.
if (typeof window.IntersectionObserver === 'function') {
    // Export existing IntersectionObservers' implementation.
    IntersectionObserver = window.IntersectionObserver;
} else {
    // Export polyfill.
    IntersectionObserver = IntersectionObserverPolyfill;
}

export default IntersectionObserver;