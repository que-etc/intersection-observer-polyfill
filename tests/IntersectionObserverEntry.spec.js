import IntersectionObserverEntry from '../src/IntersectionObserverEntry';

const keys = [
    'target',
    'boundingClientRect',
    'intersectionRatio',
    'intersectionRect',
    'rootBounds',
    'time'
];

const target = document.body;

const targetRect = target.getBoundingClientRect();

const rootBounds = {
    left: 5,
    top: 1,
    right: 6,
    bottom: 2,
    width: 1,
    height: 1
};

const intersecRect = {
    ...rootBounds,
    left: 0,
    right: 1
};

const entry = new IntersectionObserverEntry(
    target,
    targetRect,
    intersecRect,
    0.5,
    rootBounds,
    22
);

function isEqualRect(first, second) {
    return (
        first.left === second.left &&
        first.top === second.top &&
        first.right === second.right &&
        first.bottom === second.bottom &&
        first.width === second.width &&
        first.height === second.height
    );
}

describe('IntersectionObserverEntry', () => {
    describe('constructor', () => {

        it('creates necessary properties', () => {
            expect(entry.target).toBe(target);
            expect(entry.boundingClientRect).toBe(targetRect);
            expect(isEqualRect(entry.intersectionRect, intersecRect)).toBe(true);
            expect(entry.intersectionRatio).toBe(0.5);
            expect(isEqualRect(entry.rootBounds, rootBounds)).toBe(true);
            expect(entry.time).toEqual(22);
        });

        it('has no enumerable properties', () => {
            expect(Object.keys(entry).length).toBe(0);
        });

        it('properties are not writable', () => {
            for (const key of keys) {
                const descriptor = Object.getOwnPropertyDescriptor(entry, key);

                expect(descriptor.writable).toBe(false);
            }
        });

        it('properties are not configurable', () => {
            for (const key of keys) {
                const descriptor = Object.getOwnPropertyDescriptor(entry, key);

                expect(descriptor.configurable).toBe(false);
            }
        });

        it('properties of intersecRect member are not writable', () => {
            for (const key of Object.keys(intersecRect)) {
                try {
                    entry.intersectionRect[key] = 'foobar';
                } catch (e) {}

                expect(entry.intersectionRect[key]).not.toEqual('foobar');
            }
        });

        it('properties of rootBounds member are not writable', () => {
            for (const key of Object.keys(rootBounds)) {
                try {
                    entry.rootBounds[key] = 'foobar';
                } catch (e) {}

                expect(entry.rootBounds[key]).not.toEqual('foobar');
            }
        });
    });
});