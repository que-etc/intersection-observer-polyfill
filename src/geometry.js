/**
 * From provided rectangle creates a new one whose
 * properties are not enumerable, configurable or writable.
 *
 * @param {ClientRect} rect - Initial rectangle.
 * @returns {ClientRect}
 */
export function mapToClientRect(rect) {
    const descriptors = {};

    for (const key of Object.keys(rect)) {
        descriptors[key] = {value: rect[key]};
    }

    return Object.defineProperties({}, descriptors);
}

/**
 * Creates rectangle based on provided arguments.
 * If called without arguments then an empty rectangle
 * will be created.
 *
 * @param {Number} [left = 0] - Left position of rectangle.
 * @param {Number} [top = 0] - Top position of rectangle.
 * @param {Number} [width = 0] - Rectangles' width.
 * @param {Number} [height = 0] - Rectangles' height.
 * @returns {ClientRect}
 */
export function createRectangle(left = 0, top = 0, width = 0, height = 0) {
    return {
        left, top, width, height,
        bottom: top + height,
        right: left + width
    };
}

/**
 * Returns client rectangle of provided element.
 * If element represents documentElement then returns
 * main viewport rectangle.
 *
 * @param {Element} target
 * @returns {ClientRect}
 */
export function getRectangle(target) {
    if (target === document.documentElement) {
        return createRectangle(0, 0, target.clientWidth, target.clientHeight);
    }

    return target.getBoundingClientRect();
}

/**
 * Calculates area of rectangle.
 *
 * @param {ClientRect} rect - Rectangle whose area needs to be calculated.
 * @returns {Number} Rectangles' area.
 */
export function getArea(rect) {
    return rect.width * rect.height;
}

/**
 * Tells whether rectangle is empty.
 *
 * @param {ClientRect} rect - Rectangle to be checked.
 * @returns {Boolean}
 */
export function isEmpty(rect) {
    return rect.height === 0 && rect.width === 0;
}

/**
 * Compares rectangles to each other.
 *
 * @param {ClientRect} first
 * @param {ClientRect} second
 * @returns {Boolean}
 */
export function isEqual(first, second) {
    return (
        first.top === second.top &&
        first.left === second.left &&
        first.right === second.right &&
        first.bottom === second.bottom
    );
}
