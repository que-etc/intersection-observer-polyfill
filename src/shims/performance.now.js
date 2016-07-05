/**
 * A shim for performance.now method which falls back
 * to Date.now if the first one is not supported.
 *
 * @returns {Timestamp}
 */
export default (function () {
    if (window.performance && window.performance.now) {
        return () => window.performance.now();
    }

    return () => Date.now();
})();