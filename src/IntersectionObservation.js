import now from './shims/performance.now';
import {getArea, getRectangle, createRectangle, isEmpty, isEqual}  from './geometry';
import IntersectionObserverEntry from './IntersectionObserverEntry';

const emptyRect = createRectangle();

/**
 * Tells whether target is a descendant of container element
 * and that both of them are present in DOM.
 *
 * @param {Element} container - Container element.
 * @param {Element} target - Target element.
 * @returns {Boolean}
 */
function isDetached(container, target) {
    const docElement = document.documentElement;

    return (
        container !== docElement && !docElement.contains(container) ||
        !container.contains(target)
    );
}

/**
 * Computes intersection rectangle between two rectangles.
 *
 * @param {ClientRect} rootRect - Rectangle of container element.
 * @param {ClientRect} targetRect - Rectangle of target element.
 * @returns {ClientRect} Intersection rectangle.
 */
function computeIntersection(rootRect, targetRect) {
    const left      = Math.max(targetRect.left, rootRect.left);
    const right     = Math.min(targetRect.right, rootRect.right);
    const top       = Math.max(targetRect.top, rootRect.top);
    const bottom    = Math.min(targetRect.bottom, rootRect.bottom);

    const width = right - left;
    const height = bottom - top;

    return createRectangle(left, top, width, height);
}

/**
 * Finds intersection rectangle of provided elements.
 *
 * @param {Element} container - Container element.
 * @param {Element} target - Target element.
 * @param {ClientRect} targetRect - Rectangle of target element.
 * @param {ClientRect} containterRect - Rectangle of container element.
 */
function getIntersection(container, target, containterRect, targetRect) {
    let intersecRect    = targetRect,
        parent          = target.parentNode,
        rootReached     = false;

    while (!rootReached) {
        let parentRect = null;

        if (parent === container || parent.nodeType !== 1) {
            rootReached = true;
            parentRect = containterRect;
        } else if (window.getComputedStyle(parent).overflow !== 'visible') {
            parentRect = getRectangle(parent);
        }

        if (parentRect) {
            intersecRect = computeIntersection(intersecRect, parentRect);
        }

        parent = parent.parentNode;
    }

    return intersecRect;
}

/**
 * This class is responsible for computing and keeping track of intersections
 * between target element and its container. It will create and queue for notification
 * new IntersectionObserverEntry when intersection ratio reaches new thresholded value.
 */
export default class IntersectionObservation {
    /**
     * Creates instance of IntersectionObservation.
     *
     * @param {Element} target - Element being observed.
     * @param {IntersectionObserver} observer - Associated IntersectionObserver.
     */
    constructor(target, observer) {
        this.target = target;
        this.observer = observer;

        this.prevTargetRect = emptyRect;
        this.prevThreshold = 0;
        this.prevRatio = 0;
    }

    /**
     * Updates intersection data. Creates and queues new
     * IntersectionObserverEntry if intersection threshold has changed.
     *
     * @param {Object} root - Element for which to compute intersection.
     * @param {ClientRect} rootRect - Rectangle of root element.
     * @returns {Object} An object with information about detected changes:
     *  {
     *      ratioChanged: boolean,
     *      targetRectChanged: boolean,
     *      thresholdChanged: boolean
     *  }
     */
    updateIntersection(root, rootRect) {
        let targetRect          = getRectangle(this.target),
            intersection        = this.getIntersectionData(root, rootRect, targetRect),
            threshold           = +intersection.exists,
            ratioChanged        = intersection.ratio !== this.prevRatio,
            targetRectChanged   = !isEqual(targetRect, this.prevTargetRect),
            thresholdChanged;

        // Find thresholds' index if intersection
        // and target rectangles are not empty.
        if (intersection.exists && !isEmpty(targetRect)) {
            threshold = this.observer.getThresholdGreaterThan(intersection.ratio);
        }

        thresholdChanged = threshold !== this.prevThreshold;

        // Update cached properties.
        this.prevTargetRect = targetRect;
        this.prevThreshold = threshold;
        this.prevRatio = intersection.ratio;

        // Create an empty rectangle if there is no intersection.
        if (!intersection.exists) {
            intersection.ratio = 0;
            intersection.rect = emptyRect;
        }

        // Create and queue new entry if threshold has changed.
        if (thresholdChanged) {
            const entry = new IntersectionObserverEntry(
                this.target,
                targetRect,
                intersection.rect,
                intersection.ratio,
                rootRect,
                now()
            );

            this.observer.queueEntry(entry);
        }

        return {ratioChanged, thresholdChanged, targetRectChanged};
    }

    /**
     * Computes intersection data.
     *
     * @param {Element} container - Container element.
     * @param {ClientRect} [containterRect]
     * @param {ClientRect} [targetRect]
     * @returns {Object}
     */
    getIntersectionData(container, containterRect, targetRect) {
        const target = this.target;

        if (!targetRect) {
            targetRect = getRectangle(this.target);
        }

        if (!containterRect) {
            containterRect = getRectangle(container);
        }

        let detached        = isDetached(container, target),
            intersecRect    = !detached ? getIntersection(container, target, containterRect, targetRect) : emptyRect,
            intersects      = !detached && intersecRect.width >= 0 && intersecRect.height >= 0,
            intersecRatio   = getArea(intersecRect) / getArea(targetRect) || 0;

        return {
            rect: intersecRect,
            ratio: intersecRatio,
            exists: intersects
        };
    }
}
