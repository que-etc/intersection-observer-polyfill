import {Map} from './shims/es6-collections';
import {getRectangle} from './geometry';
import IntersectionObservation from './IntersectionObservation';

/**
 * Validates and parses threshold values.
 * Throws an error if one of the thresholds
 * is non-finite or not in range of 0 and 1.
 *
 * @param {(Array<Number>|Number)} [thresholds = 0]
 * @returns {Array<Number>} An array of thresholds in ascending order.
 */
function parseThresholds(thresholds = 0) {
    let result = thresholds;

    if (!Array.isArray(thresholds)) {
        result = [thresholds];
    } else if (!thresholds.length) {
        result = [0];
    }

    return result.map(threshold => {
        // We use Number function instead of parseFloat
        // to convert boolean values and null to theirs
        // numeric representation. This is done to act
        // in the same manner as a native implementation.
        threshold = Number(threshold);

        if (!window.isFinite(threshold)) {
            throw new TypeError('The provided double value is non-finite.');
        } else if (threshold < 0 || threshold > 1) {
            throw new RangeError('Threshold values must be between 0 and 1.');
        }

        return threshold;
    }).sort();
}

/**
 * Validates and converts margins value (defined in a form of
 * CSS 'margin' property) to a list of tokens, e.g:
 * 1. '0px' = [['0px'], ['0px'], ['0px'], ['0px']]
 * 2. '5px 11px' = [['5px'], ['11px'], ['5px'], ['11px']]
 *
 * @param {String} [margins = '0px'] - Margins value to be processed.
 * @returns {Array<Array>} Object that contains both: a list of
 *      tokens and its string representation.
 */
function parseMargins(margins = '0px') {
    // Use regular expression in order to properly
    // handle multiple spaces in-between of tokens: '0px     2px   5px'.
    //
    // Casting to a string is required to keep the behavior
    // closer to the native implementation which converts
    // an array like [[['2px 3px']]] to '2px 3px';
    margins = (margins + '').split(/\s+/);

    // Chrome validates tokens length starting from version 53.
    if (margins.length > 4) {
        throw new Error('Extra text found at the end of rootMargin.');
    }

    margins[0] = margins[0] || '0px';
    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];

    const rawData = margins.join(' ');

    const parsedData = margins.map(token => {
        let [,value, unit] = /^(-?\d*\.?\d+)(px|%)$/.exec(token) || [];
        const pixels = unit === 'px';

        value = parseFloat(value);

        if (!window.isFinite(value)) {
            throw new Error('rootMargin must be specified in pixels or percent.');
        }

        if (!pixels) {
            value /= 100;
        }

        return {value, pixels};
    });

    return {rawData, parsedData};
}

/**
 * Creates new rectangle from provided one whose
 * dimensions will be modified by applying margins
 * defined in a form of [[value: Number, pixels: Boolean], ...].
 *
 * @param {ClientRect} targetRect - Initial rectangle.
 * @param {Array<Array>} margins - Margins data.
 * @returns {ClientRect} Modified rectangle.
 */
function applyMargins(targetRect, margins) {
    margins = margins.map((margin, index) => {
        let value = margin.value;

        if (!margin.pixels) {
            value *= index % 2 ? targetRect.width : targetRect.height;
        }

        return value;
    });

    const result = {
        top: targetRect.top - margins[0],
        right: targetRect.right + margins[1],
        bottom: targetRect.bottom + margins[2],
        left: targetRect.left - margins[3]
    };

    result.width = result.right - result.left;
    result.height = result.bottom - result.top;

    return result;
}

export default class IntersectionObserver {
    /**
     * Creates new IntersectionObserver instance.
     *
     * @param {Function} callback - Callback function that will be invoked
     *      whenever one of the observed targets reaches new ratio value defined in "options.threshold".
     * @param {Object} [options = {}] - Optional configuration.
     * @param {IntersectionObserverController} controller - Associated controller instance.
     * @param {IntersectionObserver} publicObserver - This value will be used as
     *      a value of "this" binding for the callback function.
     */
    constructor(callback, options = {}, controller, publicObserver) {
        if (typeof callback !== 'function') {
            throw new TypeError("The callback provided as parameter 1 is not a function.");
        }

        if (typeof options !== 'object') {
            throw new TypeError("parameter 2 is not an object.");
        }

        if ('root' in options && !(options.root instanceof Element)) {
            throw new TypeError("member root is not of type Element.");
        }


        const thresholds = parseThresholds(options.threshold);
        const rootMargin = parseMargins(options.rootMargin);

        this.root = options.root || null;
        this.rootMargin = rootMargin.rawData;

        // Thresholds array needs to be immutable
        // according to the native implementation.
        this.thresholds = Object.freeze(thresholds);

        this._root = options.root || document.documentElement;
        this._callback = callback;
        this._rootMargin = rootMargin.parsedData;

        // Registry of observed elements and
        // corresponding IntersectionObservation instances.
        this._targets = new Map();

        // A list of queued IntersectionObserverEntry
        // items that will passed to the callback function.
        this._quedEntries = [];

        this._publicObserver = publicObserver || this;

        this.controller = controller;
    }

    /**
     * Adds provided target to observations list.
     *
     * @param {Element} target - DOM element to be observed.
     */
    observe(target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        if (!(target instanceof Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }

        let targets = this._targets;

        // Do nothing if target is already observed.
        if (targets.has(target)) {
            return;
        }

        // Create new IntersectionObservation instance and assign it
        // to provided target.
        targets.set(target, new IntersectionObservation(target, this));

        // Connect current observer to controller
        // if it wasn't connected yet.
        if (!this.controller.isConnected(this)) {
            this.controller.connect(this);
        }

        // Request the update of observers.
        this.controller.startUpdateCycle();
    }

    /**
     * Removes provided target from observations list.
     *
     * @param {Element} target - DOM element to stop observing.
     */
    unobserve(target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        if (!(target instanceof Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }

        let targets = this._targets;

        if (targets.has(target)) {
            targets.delete(target);
        }

        // Disconnect observer if the list of observed targets is empty.
        if (!targets.size) {
            this.disconnect();
        }
    }

    /**
     * Removes all targets from observations list
     * and disconnects observer from associated controller, i.e.
     * no updates will be invoked for it.
     */
    disconnect() {
        this._targets.clear();
        this.controller.disconnect(this);
    }

    /**
     * Returns a list of queued observation entries and
     * clears the queue.
     *
     * @returns {Array}
     */
    takeRecords() {
        return this._quedEntries.splice(0);
    }

    /**
     * Invokes callback function with a list
     * of queued entries if the last one is not empty.
     *
     * @private
     */
    notifySubscriber() {
        const entries = this.takeRecords();
        const publicObserver = this._publicObserver;

        if (entries.length) {
            this._callback.call(publicObserver, entries, publicObserver);
        }
    }

    /**
     * Adds entry to the queue.
     *
     * @param {IntersectionObserverEntry} entry
     */
    queueEntry(entry) {
        this._quedEntries.push(entry);
    }

    /**
     * Tells whether observer has queued entries.
     *
     * @returns {Boolean}
     */
    hasEntries() {
        return !!this._quedEntries.length;
    }

    /**
     * Updates intersection data of each observed target.
     *
     * @returns {Boolean} Returns "true" if intersection ratio or the rectangle of one of the
     *      observed targets has changed. This information is required for
     *      controller to decide whether to continue running the update cycle.
     */
    updateObservations() {
        let root     = this._root,
            rootRect = this.getRootRect(),
            hasChanges = false;

        this._targets.forEach(observation => {
            const changes = observation.updateIntersection(root, rootRect);

            if (changes.ratioChanged || changes.targetRectChanged) {
                hasChanges = true;
            }
        });

        return hasChanges;
    }

    /**
     * Finds index of the first threshold whose value is greater than provided ratio.
     * In case if there is no such value the amount of thresholds will be returned.
     *
     * @param {Number} ratio
     * @returns {Number}
     */
    getThresholdGreaterThan(ratio) {
        let thresholds = this.thresholds,
            thresholdsLen = thresholds.length,
            index = 0;

        while (index < thresholdsLen && thresholds[index] <= ratio) {
            ++index;
        }

        return index;
    }

    /**
     * Calculates rectangle of root node with applied margins.
     *
     * @returns {ClientRect}
     */
    getRootRect() {
        let rootRect = getRectangle(this._root);

        return applyMargins(rootRect, this._rootMargin);
    }
}
