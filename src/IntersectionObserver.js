import {WeakMap} from './shims/es6-collections';
import IntersectionObserverController from './IntersectionObserverController';
import _IntersectionObserver from './_IntersectionObserver';

// This controllers' instance will be assigned to all IntersectionObservers
const controller = new IntersectionObserverController();

// Registry of internal observers.
const observers = new WeakMap();

/**
 * IntersectionObservers' "Proxy" class which is meant to hide private
 * properties and methods from IntersectionObserver instances.
 *
 * Additionally it implements "idleTimeout" and "trackHovers" static property
 * accessors to give a control over the behavior of IntersectionObserverController
 * instance. Changes made to these properties will affect both future and
 * existing instances of IntersectionObserver.
 */
class IntersectionObserver {
    /**
     * Creates instance of public IntersectionObserver.
     *
     * @param {Function} callback
     * @param {Object} options
     */
    constructor(callback, options) {
        if (!arguments.length) {
            throw new TypeError("1 argument required, but only 0 present.");
        }

        const observer = new _IntersectionObserver(callback, options, controller, this);

        // Due to the spec following properties are non-writable
        // and in native implementation they are also not enumerable.
        Object.defineProperties(this, {
            root:       {value: observer.root},
            thresholds: {value: observer.thresholds},
            rootMargin: {value: observer.rootMargin}
        });

        // Register internal observer.
        observers.set(this, observer);
    }

    /**
     * Extracts controllers' idle timeout value.
     *
     * @returns {Number}
     */
    static get idleTimeout() {
        return controller.idleTimeout;
    }

    /**
     * Sets up new idle timeout.
     *
     * @param {Number} value - New timeout value.
     */
    static set idleTimeout(value) {
        if (typeof value !== 'number') {
            throw new TypeError('type of "idleTimeout" value must be a number.');
        }

        if (typeof value < 0) {
            throw new TypeError('"idleTimeout" value must be greater than 0.');
        }

        controller.idleTimeout = value;
    }

    /**
     * Tells whether controller tracks "hover" events.
     *
     * @returns {Boolean}
     */
    static get trackHovers() {
        return controller.isHoverEnabled();
    }

    /**
     * Enables or disables tracking of "hover" event.
     *
     * @param {Boolean} value - Whether to disable or enable tracking.
     */
    static set trackHovers(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError('type of "trackHovers" value must be a boolean.');
        }

        value ?
            controller.enableHover() :
            controller.disableHover();
    }
}

// Expose public methods of IntersectionObserver.
[
    'observe',
    'unobserve',
    'disconnect',
    'takeRecords'
].forEach(method => {
    IntersectionObserver.prototype[method] = function () {
        return observers.get(this)[method](...arguments);
    };
});

export default IntersectionObserver;
