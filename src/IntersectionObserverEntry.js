import {mapToClientRect} from './geometry';

export default class IntersectionObserverEntry {
    /**
     * Creates new instance of IntersectionObserverEntry.
     *
     * @param {Element} target
     * @param {ClientRect} targetRect
     * @param {ClientRect} intersecRect
     * @param {Number} intersecRatio
     * @param {ClientRect} rootBounds
     * @param {Timestamp} time
     */
    constructor(target, targetRect, intersecRect, intersecRatio, rootBounds, time) {

        // According to the spec following properties are not writable and
        // in native implementation they are also not enumerable.
        Object.defineProperties(this, {
            boundingClientRect: {value: targetRect},
            intersectionRatio:  {value: intersecRatio},
            intersectionRect:   {value: mapToClientRect(intersecRect)},
            rootBounds:         {value: mapToClientRect(rootBounds)},
            target:             {value: target},
            time:               {value: time}
        });
    }
}
