import now from './shims/performance.now';

const mutationsSupported = typeof window.MutationObserver === 'function';

/**
 * A shim for requestAnimationFrame which falls back
 * to setTimeout if the first one is not supported.
 *
 * @returns {Number} Request identifier.
 */
const requestAnimFrame = (function () {
    if (window.requestAnimationFrame) {
        return window.requestAnimationFrame;
    }

    return callback => {
        return setTimeout(() => callback(now()), 1000 / 60);
    };
})();

/**
 * Creates a wrapper function that ensures that
 * provided callback will be invoked only after
 * the specified delay.
 *
 * @param {Function} callback
 * @param {Number} [delay = 0]
 * @returns {Function}
 */
function debounce(callback, delay = 0) {
    let timeoutID = false;

    return function (...args) {
        if (timeoutID !== false) {
            clearTimeout(timeoutID);
        }

        timeoutID = setTimeout(() => {
            timeoutID = false;

            callback.apply(this, args);
        }, delay);
    };
}

/**
 * Controller class that is used to handle updates of registered IntersectionObservers.
 * It controls when and for how long it's necessary to run updates of observations
 * by listening to various events on window along with DOM mutations
 * (nodes removal, changes of attributes, etc.).
  *
 * CSS transitions and animations are handled by running the update cycle
 * until position of DOM elements, added to connected observers, keeps changing
 * or until the idle timeout is reached (default timeout is 50 milliseconds).
 * Timeout value can be manually increased if transitions have a delay.
 *
 * Tracking of changes made by ":hover" class is optional and can be
 * enabled by invoking the "enableHover" method.
 *
 * Infinite update cycle along with a listener of "click" event will be used in case when
 * MutatioObserver is not supported.
 */
export default class IntersectionObserverController {
    /**
     * Creates new IntersectionObserverController instance.
     *
     * @param {Number} [idleTimeout = 50]
     * @pram {Boolean} [trackHovers = false] - Whether to track "mouseover"
     *      events or not. Disabled be default.
     */
    constructor(idleTimeout = 50, trackHovers = false) {
        this._idleTimeout = idleTimeout;
        this._trackHovers = trackHovers;
        this._cycleStartTime = -1;

        // Indicates whether the update of observers is scheduled.
        this._isUpdateScheduled = false;

        // Indicates whether infinite cycles are enabled.
        this._repeatCycle = false;

        // Indicates whether "mouseover" event handler was added.
        this._hoverInitiated = false;

        // Keeps reference to the instance of MutationObserver.
        this._mutationsObserver = null;

        // Indicates whether DOM listeners were initiated.
        this._isListening = false;

        // A list of connected observers.
        this._observers = [];

        // Fix value of "this" binding for the following methods.
        this.startUpdateCycle = this.startUpdateCycle.bind(this);
        this.scheduleUpdate = this.scheduleUpdate.bind(this);
        this._onMutation = this._onMutation.bind(this);

        // Function that will be invoked to re-rerun the update cycle
        // if repeatable cycles are enabled.
        this._repeatHandler = debounce(this.scheduleUpdate, 200);

        // "mouseover" event handler.
        this._onMouseOver = debounce(this.startUpdateCycle, 200);
    }

    /**
     * Returns current idle timeout value.
     *
     * @returns {Number}
     */
    get idleTimeout() {
        return this._idleTimeout;
    }

    /**
     * Sets up new idle timeout value.
     *
     * @param {Number} value - New timeout value.
     */
    set idleTimeout(value) {
        this._idleTimeout = value;
    }

    /**
     * Adds observer to observers list.
     *
     * @param {IntersectionObserver} observer - Observer to be added.
     */
    connect(observer) {
        if (!this.isConnected(observer)) {
            this._observers.push(observer);
        }

        // Instantiate listeners if they
        // weren't instantiated yet.
        if (!this._isListening) {
            this._initListeners();
        }
    }

    /**
     * Removes observer from observers list.
     *
     * @param {IntersectionObserver} observer - Observer to be removed.
     */
    disconnect(observer) {
        let observers = this._observers,
            index = observers.indexOf(observer);

        if (~index) {
            observers.splice(index, 1);
        }

        // Remove listeners if controller
        // has no connected observers.
        if (!observers.length && this._isListening) {
            this._removeListeners();
        }
    }

    /**
     * Tells whether provided observer is connected to controller.
     *
     * @param {IntersectionObserver} observer - Observer to be checked.
     * @returns {Boolean}
     */
    isConnected(observer) {
        return !!~this._observers.indexOf(observer);
    }

    /**
     * Updates every observer from observers list and
     * notifies them of queued entries.
     *
     * @private
     * @returns {Boolean} Returns "true" if any observer
     *      has detected changes in position of its elements.
     */
    _updateObservers() {
        let hasChanges = false;

        for (const observer of this._observers) {
            if (observer.updateObservations()) {
                hasChanges = true;
            }

            if (observer.hasEntries()) {
                observer.notifySubscriber();
            }
        }

        return hasChanges;
    }

    /**
     * Schedules new update cycle.
     */
    startUpdateCycle() {
        this._cycleStartTime = now();

        this.scheduleUpdate();
    }

    /**
     * Controls invocation of "_updateObservers" method.
     * It will re-invoke itself in the following cases:
     *      - Update of observers detected changes in elements position.
     *        In this case we need to postpone cycle end time in order to ensure
     *        that we won't miss next iteration of animations.
     *
     *      - Idle timeout wasn't reached yet.
     *        In this case we need to schedule new single update
     *        because changes may be delayed.
     *
     * @param {Number} [timestamp] - Internal parameter
     *      that is used to define whether method was invoked
     *      as a callback of requestAnimationFrame.
     */
    scheduleUpdate(timestamp) {
        let calledFromRAF = typeof timestamp === 'number';

        // Invoke the update of observers only if function
        // was called as a requestAnimationFrame callback.
        if (calledFromRAF) {
            const hasChanges = this._updateObservers();

            this._isUpdateScheduled = false;

            // Do nothing if cycle wasn't started.
            if (!this._wasCycleStarted()) {
                return;
            }

            if (hasChanges) {
                // Postpone cycle end time if changes were detected.
                this.startUpdateCycle();
            } else if (!this._hasIdleTimeEnded()) {
                // Schedule new single update if cycle timeout wasn't reached yet.
                this.scheduleUpdate();
            } else {
                // Finish cycle.
                this._onCycleEnded();
            }
        } else if (!this._isUpdateScheduled) {
            // Request new update if it wasn't requested already.
            requestAnimFrame(this.scheduleUpdate);

            this._isUpdateScheduled = true;
        }
    }

    /**
     * Tells whether cycle has reached its idle timeout.
     *
     * @private
     * @returns {Boolean}
     */
    _hasIdleTimeEnded() {
        return now() - this._cycleStartTime > this._idleTimeout;
    }

    /**
     * Tells whether the update cycle is currently running.
     *
     * @private
     * @returns {Boolean}
     */
    _wasCycleStarted() {
        return this._cycleStartTime !== -1;
    }

    /**
     * Callback that will be invoked after the update cycle is finished.
     *
     * @private
     */
    _onCycleEnded() {
        // Mark that update cycle is not running.
        this._cycleStartTime = -1;

        if (this._repeatCycle) {
            // Time is set to '0' because we want to automatically
            // start update cycle when single update detects changes.
            this._cycleStartTime = 0;

            this._repeatHandler();
        }
    }

    /**
     * Initializes DOM listeners.
     *
     * @private
     */
    _initListeners() {
        // Do nothing if listeners are already initiated.
        if (this._isListening) {
            return;
        }

        this._isListening = true;

        // Use update cycle here instead of a single update because we may encounter
        // with delayed changes, e.g. when width or height of an
        // element are changed by CSS transitions.
        window.addEventListener('resize', this.startUpdateCycle, true);

        window.addEventListener('scroll', this.scheduleUpdate, true);

        // Listen to possible changes made by ":hover" class.
        if (this._trackHovers) {
            this._addHoverListener();
        }

        // Fall back to repeatable cycle with additional tracking of
        // "click" event if MutationObserver is not supported.
        if (!mutationsSupported) {
            this._repeatCycle = true;

            // Listen to clicks as they may cause changes in elements position.
            window.addEventListener('click', this.startUpdateCycle, true);

            // Manually start cycle.
            this.startUpdateCycle();
        } else {
            // Subscribe to DOM mutations as they may lead to changes in position of elements.
            this._mutationsObserver = new MutationObserver(this._onMutation);

            this._mutationsObserver.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }

    /**
     * Removes all DOM listeners.
     *
     * @private
     */
    _removeListeners() {
        // Do nothing if listeners were already removed.
        if (!this._isListening) {
            return;
        }

        window.removeEventListener('resize', this.startUpdateCycle, true);
        window.removeEventListener('scroll', this.scheduleUpdate, true);

        this._removeHoverListener();

        if (!mutationsSupported) {
            this._repeatCycle = false;

            window.removeEventListener('click', this.startUpdateCycle, true);
        } else if (this._mutationsObserver) {
            this._mutationsObserver.disconnect();
            this._mutationsObserver = null;
        }

        this._isListening = false;
    }

    /**
     * Enables hover listener.
     */
    enableHover() {
        this._trackHovers = true;

        // Manually add hover listener
        // if listeners were already initiated.
        if (this._isListening) {
            this._addHoverListener();
        }
    }

    /**
     * Disables hover listener.
     */
    disableHover() {
        this._trackHovers = false;

        this._removeHoverListener();
    }

    /**
     * Tells whether hover listener is enabled.
     *
     * @returns {Boolean}
     */
    isHoverEnabled() {
        return this._trackHovers;
    }

    /**
     * Adds "mouseover" listener if it wasn't already added.
     *
     * @private
     */
    _addHoverListener() {
        if (this._hoverInitiated) {
            return;
        }

        window.addEventListener('mouseover', this._onMouseOver, true);

        this._hoverInitiated = true;
    }

    /**
     * Removes "mouseover" listener if it was added previously.
     *
     * @private
     */
    _removeHoverListener() {
        if (!this._hoverInitiated) {
            return;
        }

        window.removeEventListener('mouseover', this._onMouseOver, true);

        this._hoverInitiated = false;
    }

    /**
     * DOM mutations handler.
     *
     * @private
     * @param {Array<MutationRecord>} entries
     */
    _onMutation(entries) {
        const runSingleUpdate = entries.every(entry => {
            return entry.type !== 'attributes';
        });

        // Schedule single update if attributes (class, style, etc.)
        // were not changed. Otherwise run update cycle because
        // animations are expected to appear only in this case.
        runSingleUpdate ?
            this.scheduleUpdate() :
            this.startUpdateCycle();
    }
}
