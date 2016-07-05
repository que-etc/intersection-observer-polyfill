import IntersectionObserver from '../src/IntersectionObserver';
import IntersectionObserverEntry from '../src/IntersectionObserverEntry';

const emptyFn = () => {};
const css = `
    #root {
        position: relative;
        width: 400px;
        height: 200px;
        background: #eee;
    }

    #container-1 {
        position: relative;
        width: 200px;
        height: 200px;
    }

    #container-2 {
        position: absolute;
        top: 0px;
        left: 200px;
        overflow: hidden;
        width: 200px;
        height: 200px;
        background: #ddd;
    }

    #target-1, #target-2, #target-3, #target-4 {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 20px;
        height: 20px;
        transform: translateX(0px) translateY(0px);
        transition: transform .5s;
        background: #f00;
    }
`;
const template = `
    <div id="root">
        <div id="container-1">
            <div id="container-2">
                <div id="target-1"></div>
                <div id="target-2"></div>
                <div id="target-3"></div>
                <div id="target-4"></div>
            </div>
        </div>
    </div>
`;

const timeout = 300;

let styles,
    observer = false,
    elements = {};

function appendStyles() {
    styles = document.createElement('style');

    styles.id = 'styles';
    document.head.appendChild(styles);

    styles.innerHTML = css;
}

function removeStyles() {
    document.head.removeChild(styles);

    styles = null;
}

function appendElements() {
    document.body.insertAdjacentHTML('beforeend', template);

    elements = {
        root: document.getElementById('root'),
        container1: document.getElementById('container-1'),
        container2: document.getElementById('container-2'),
        target1: document.getElementById('target-1'),
        target2: document.getElementById('target-2'),
        target3: document.getElementById('target-3'),
        target4: document.getElementById('target-4')
    };
}

function removeElements() {
    if (document.body.contains(elements.root)) {
        document.body.removeChild(elements.root);
    }

    elements = {};
}

function runSequence(callbacks, done) {
    const next = callbacks.shift();

    if (next) {
        next(() => runSequence(callbacks, done));
    } else {
        done && done();
    }
}


function getEntries(call) {
    if (call && call.args) {
        return call.args[0];
    }

    return [{}];
}

describe('IntersectionObserver', () => {
    beforeEach(() => {
        appendStyles();
        appendElements();
    });

    afterEach(() => {
        if (observer) {
            observer.disconnect();
        }

        observer = null;

        removeStyles();
        removeElements();
    });

    describe('constructor', () => {
        it('throws an exception if no arguments were provided', () => {
            expect(() => {
                new IntersectionObserver();
            }).toThrowError(/1 argument required/i);
        });

        it('throws an exception if callback is not a function', () => {
            expect(() => {
                new IntersectionObserver(true);
            }).toThrowError(/function/i);
        });

        it('throws an exception if options is not an object', () => {
            expect(() => {
                new IntersectionObserver(emptyFn, true);
            }).toThrowError(/is not an object/i);
        });

        it('initializes root member correctly', () => {
            observer = new IntersectionObserver(emptyFn, {});
            expect(observer.root).toEqual(null);

            observer = new IntersectionObserver(emptyFn, { root: document.body });
            expect(observer.root).toEqual(document.body);
        });

        it('throws an exception if root is not of type Element', () => {
            expect(() => {
                new IntersectionObserver(emptyFn, {
                    root: {}
                });
            }).toThrowError(/Element/i);

            expect(() => {
                new IntersectionObserver(emptyFn, {
                    root: false
                });
            }).toThrowError(/Element/i);
        });

        it('creates a non-writable root member', () => {
            observer = new IntersectionObserver(emptyFn, {});

            try {
                observer.root = 'foobar';
            } catch (e) {}

            expect(observer.root).not.toEqual('foobar');
        });

        describe('rootMargin member', () => {
            it('parsed correctly', () => {
                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: ''
                });
                expect(observer.rootMargin).toBe('0px 0px 0px 0px');

                observer = new IntersectionObserver(emptyFn, {});
                expect(observer.rootMargin).toBe('0px 0px 0px 0px');

                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: undefined
                });
                expect(observer.rootMargin).toBe('0px 0px 0px 0px');

                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: '5px'
                });
                expect(observer.rootMargin).toBe('5px 5px 5px 5px');

                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: '80px 3%'
                });
                expect(observer.rootMargin).toBe('80px 3% 80px 3%');

                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: '5px 10% -100px'
                });
                expect(observer.rootMargin).toBe('5px 10% -100px 10%');

                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: '5px    10%  -100px -8%'
                });
                expect(observer.rootMargin).toBe('5px 10% -100px -8%');

                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: []
                });
                expect(observer.rootMargin).toBe('0px 0px 0px 0px');

                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: ['1px 2px']
                });
                expect(observer.rootMargin).toBe('1px 2px 1px 2px');
            });

            it('throws an exception if value is not in pixels or percents', () => {
                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: '20rm'
                    });
                }).toThrowError(/pixels or percent/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: '0'
                    });
                }).toThrowError(/pixels or percent/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: 0
                    });
                }).toThrowError(/pixels or percent/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: '10px ab'
                    });
                }).toThrowError(/pixels or percent/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: false
                    });
                }).toThrowError(/pixels or percent/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: true
                    });
                }).toThrowError(/pixels or percent/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: null
                    });
                }).toThrowError(/pixels or percent/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: ['1px', '2px']
                    });
                }).toThrowError(/pixels or percent/i);
            });

            it('throws an exception if value exceeds maximum number of tokens', () => {
                expect(() => {
                    new IntersectionObserver(emptyFn, {
                        rootMargin: '1px 2px 3px 4px 5px'
                    });
                }).toThrowError(/Extra text found/i);
            });

            it('is not writable', () => {
                observer = new IntersectionObserver(emptyFn, {
                    rootMargin: '1px 2px 3px 4px'
                });

                try {
                    observer.rootMargin = '10px';
                } catch (e) {}

                expect(observer.rootMargin).toEqual('1px 2px 3px 4px');
            });
        });

        describe('thresholds member', () => {
            it('parsed correctly', () => {
                observer = new IntersectionObserver(emptyFn, {});
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: [] });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: undefined });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: '' });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: [''] });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: null });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: [null] });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: false });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: [false] });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: true });
                expect(observer.thresholds).toEqual([1]);

                observer = new IntersectionObserver(emptyFn, { threshold: [true] });
                expect(observer.thresholds).toEqual([1]);

                observer = new IntersectionObserver(emptyFn, { threshold: 0 });
                expect(observer.thresholds).toEqual([0]);

                observer = new IntersectionObserver(emptyFn, { threshold: 1 });
                expect(observer.thresholds).toEqual([1]);

                observer = new IntersectionObserver(emptyFn, { threshold: 0.5 });
                expect(observer.thresholds).toEqual([0.5]);

                observer = new IntersectionObserver(emptyFn, { threshold: [0.5] });
                expect(observer.thresholds).toEqual([0.5]);

                observer = new IntersectionObserver(emptyFn, { threshold: '0.5' });
                expect(observer.thresholds).toEqual([0.5]);

                observer = new IntersectionObserver(emptyFn, { threshold: ['0.5'] });
                expect(observer.thresholds).toEqual([0.5]);

                observer = new IntersectionObserver(emptyFn, { threshold: [0, 0.2, 0.3] });
                expect(observer.thresholds).toEqual([0, 0.2, 0.3]);
            });

            it('sorted in ascending order', () => {
                const threshold = [0, 0.9, 0.2, 1, 0.3, 0.1, 0.5];

                observer = new IntersectionObserver(emptyFn, {
                    threshold: threshold
                });

                expect(observer.thresholds).toEqual(threshold.sort());
            });

            it("doesn't affect initial threshold array", () => {
                const threshold = [0, 0.9, 0.2, 1, 0.3, 0.1, 0.5];
                const copy = threshold.slice();

                observer = new IntersectionObserver(emptyFn, {
                    threshold: threshold
                });

                expect(observer.thresholds === threshold).toBe(false);
                expect(threshold).toEqual(copy);
            });

            it('throws an exception if value is not in range of 0 and 1', () => {
                expect(() => {
                    new IntersectionObserver(emptyFn, { threshold: -1.1 });
                }).toThrowError(/between 0 and 1/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, { threshold: -0.1 });
                }).toThrowError(/between 0 and 1/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, { threshold: [0, 0.2, 0.3, 1.1] });
                }).toThrowError(/between 0 and 1/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, { threshold: [0, 0.2, -0.1, 0.3] });
                }).toThrowError(/between 0 and 1/i);
            });

            it('throws an exception if value is non-finite', () => {
                expect(() => {
                    new IntersectionObserver(emptyFn, { threshold: {} });
                }).toThrowError(/non-finite/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, { threshold: [undefined] });
                }).toThrowError(/non-finite/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, { threshold: 'foo' });
                }).toThrowError(/non-finite/i);

                expect(() => {
                    new IntersectionObserver(emptyFn, { threshold: [0, 'foo'] });
                }).toThrowError(/non-finite/i);
            });

            it('is not modifiable', () => {
                observer = new IntersectionObserver(emptyFn, {
                    threshold: [0.2]
                });

                try {
                    observer.thresholds = [0.5];
                } catch (e) {}

                try {
                    observer.thresholds.push(0.1);
                } catch (e) {}

                expect(observer.thresholds).toEqual([0.2]);
            });
        });
    });

    describe('observe', () => {
        it('throws an error if no argument were provided', () => {
            observer = new IntersectionObserver(emptyFn);

            expect(() => {
                observer.observe();
            }).toThrowError(/1 argument required/i);
        });

        it('throws an error if target is not Element', () => {
            observer = new IntersectionObserver(emptyFn);

            expect(() => {
                observer.observe(false);
            }).toThrowError(/Element/i);

            expect(() => {
                observer.observe(null);
            }).toThrowError(/Element/i);

            expect(() => {
                observer.observe({});
            }).toThrowError(/Element/i);

            expect(() => {
                observer.observe(document.createTextNode(''));
            }).toThrowError(/Element/i);
        });

        it('triggers if target intersects when observing begins', done => {
            observer = new IntersectionObserver(entries => {
                expect(entries.length).toBe(1);
                expect(entries[0].intersectionRatio).toBe(1);

                done();
            }, {
                root: elements.root
            });

            observer.observe(elements.target1);
        });

        it('triggers with the correct arguments', done => {
            observer = new IntersectionObserver(function (...args) {
                const [entries, ob] = args;

                expect(args.length).toBe(2);

                expect(entries.length).toBe(1);
                expect(entries[0] instanceof IntersectionObserverEntry).toBe(true);

                expect(ob).toBe(observer);
                expect(this).toBe(observer);

                done();
            }, {
                root: elements.root
            });

            observer.observe(elements.target1);
        });

        it('does not trigger if target does not intersect when observation begins', done => {
            const spy = jasmine.createSpy();

            observer = new IntersectionObserver(spy, {
                root: elements.root
            });

            elements.target2.style.top = '-40px';

            observer.observe(elements.target2);

            setTimeout(() => {
                expect(spy).not.toHaveBeenCalled();
                done();
            }, timeout);
        });

        it('handles container elements with non-visible overflow', done => {
            const spy = jasmine.createSpy();

            observer = new IntersectionObserver(spy, {
                root: elements.root
            });

            observer.observe(elements.target1);

            runSequence([done => {
                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(entries.length).toBe(1);
                    expect(entries[0].intersectionRatio).toBe(1);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.left = '-40px';

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(entries.length).toBe(1);
                    expect(entries[0].intersectionRatio).toBe(0);

                    done();
                }, timeout);
            }, done => {
                elements.container2.style.overflow = 'visible';

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(3);
                    expect(entries.length).toBe(1);
                    expect(entries[0].intersectionRatio).toBe(1);

                    done();
                }, timeout);
            }], done);
        });

        it('observes one target at a single threshold correctly', done => {
            const spy = jasmine.createSpy();

            observer = new IntersectionObserver(spy, {
                root: elements.root,
                threshold: 0.5
            });

            observer.observe(elements.target1);

            runSequence([done => {
                elements.target1.style.left = '-5px';

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(entries.length).toBe(1);
                    expect(entries[0].intersectionRatio).toBeGreaterThan(0.5);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.left = '-15px';

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(entries.length).toBe(1);
                    expect(entries[0].intersectionRatio).toBeLessThan(0.5);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.left = '-25px';

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(2);
                    done();
                }, timeout);
            }, done => {
                elements.target1.style.left = '-10px';

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(3);
                    expect(entries.length).toBe(1);
                    expect(entries[0].intersectionRatio).toBe(0.5);

                    done();
                }, timeout);
            }], done);
        });

        it('observes multiple targets at multiple thresholds correctly', done => {
            const spy = jasmine.createSpy();

            observer = new IntersectionObserver(spy, {
                root: elements.root,
                threshold: [1, 0.5, 0]
            });

            runSequence([done => {
                elements.target1.style.top = '0px';
                elements.target1.style.left = '-15px';

                elements.target2.style.top = '-5px';
                elements.target2.style.left = '0px';

                elements.target3.style.top = '0px';
                elements.target3.style.left = '205px';

                observer.observe(elements.target1);
                observer.observe(elements.target2);
                observer.observe(elements.target3);

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(entries.length).toBe(2);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].intersectionRatio).toBe(0.25);

                    expect(entries[1].target).toBe(elements.target2);
                    expect(entries[1].intersectionRatio).toBe(0.75);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.top = '0px';
                elements.target1.style.left = '-5px';

                elements.target2.style.top = '-15px';
                elements.target2.style.left = '0px';

                elements.target3.style.top = '0px';
                elements.target3.style.left = '195px';

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(entries.length).toBe(3);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].intersectionRatio).toBe(0.75);

                    expect(entries[1].target).toBe(elements.target2);
                    expect(entries[1].intersectionRatio).toBe(0.25);

                    expect(entries[2].target).toBe(elements.target3);
                    expect(entries[2].intersectionRatio).toBe(0.25);
                    done();
                }, timeout);
            }, done => {
                elements.target1.style.top = '0px';
                elements.target1.style.left = '5px';

                elements.target2.style.top = '-25px';
                elements.target2.style.left = '0px';

                elements.target3.style.top = '0px';
                elements.target3.style.left = '185px';

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(3);
                    expect(entries.length).toBe(3);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].intersectionRatio).toBe(1);

                    expect(entries[1].target).toBe(elements.target2);
                    expect(entries[1].intersectionRatio).toBe(0);

                    expect(entries[2].target).toBe(elements.target3);
                    expect(entries[2].intersectionRatio).toBe(0.75);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.top = '0px';
                elements.target1.style.left = '15px';

                elements.target2.style.top = '-35px';
                elements.target2.style.left = '0px';

                elements.target3.style.top = '0px';
                elements.target3.style.left = '175px';

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(4);
                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target3);
                    expect(entries[0].intersectionRatio).toBe(1);

                    done();
                }, timeout);
            }], done);
        });

        it('handles rootMargin properly', done => {
            elements.container2.style.overflow = 'visible';

            elements.target1.style.top = '0px';
            elements.target1.style.left = '-20px';

            elements.target2.style.top = '-20px';
            elements.target2.style.left = '0px';

            elements.target3.style.top = '0px';
            elements.target3.style.left = '200px';

            elements.target4.style.top = '180px';
            elements.target4.style.left = '180px';

            runSequence([done => {
                observer = new IntersectionObserver(entries => {
                    expect(entries.length).toBe(4);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].intersectionRatio).toBe(1);

                    expect(entries[1].target).toBe(elements.target2);
                    expect(entries[1].intersectionRatio).toBeCloseTo(0.5, 6);

                    expect(entries[2].target).toBe(elements.target3);
                    expect(entries[2].intersectionRatio).toBeCloseTo(0.5, 6);

                    expect(entries[3].target).toBe(elements.target4);
                    expect(entries[3].intersectionRatio).toBe(1);

                    observer.disconnect();

                    done();
                }, {
                    root: elements.root,
                    rootMargin: '10px'
                });

                observer.observe(elements.target1);
                observer.observe(elements.target2);
                observer.observe(elements.target3);
                observer.observe(elements.target4);
            }, done => {
                observer = new IntersectionObserver(entries => {
                    expect(entries.length).toBe(3);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].intersectionRatio).toBe(0.5);

                    expect(entries[1].target).toBe(elements.target3);
                    expect(entries[1].intersectionRatio).toBe(0.5);

                    expect(entries[2].target).toBe(elements.target4);
                    expect(entries[2].intersectionRatio).toBe(0.5);

                    observer.disconnect();

                    done();
                }, {
                    root: elements.root,
                    rootMargin: '-10px 10%'
                });

                observer.observe(elements.target1);
                observer.observe(elements.target2);
                observer.observe(elements.target3);
                observer.observe(elements.target4);
            }, done => {
                observer = new IntersectionObserver(entries => {
                    expect(entries.length).toBe(2);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].intersectionRatio).toBe(0.5);

                    expect(entries[1].target).toBe(elements.target4);
                    expect(entries[1].intersectionRatio).toBe(0.5);

                    observer.disconnect();

                    done();
                }, {
                    root: elements.root,
                    rootMargin: '-5% -2.5% 0px'
                });

                observer.observe(elements.target1);
                observer.observe(elements.target2);
                observer.observe(elements.target3);
                observer.observe(elements.target4);
            }, done => {
                observer = new IntersectionObserver(entries => {
                    expect(entries.length).toBe(3);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].intersectionRatio).toBe(0.5);

                    expect(entries[1].target).toBe(elements.target2);
                    expect(entries[1].intersectionRatio).toBeCloseTo(0.5, 6);

                    expect(entries[2].target).toBe(elements.target4);
                    expect(entries[2].intersectionRatio).toBe(0.25);

                    observer.disconnect();

                    done();
                }, {
                    root: elements.root,
                    rootMargin: '5% -2.5% -10px -190px'
                });

                observer.observe(elements.target1);
                observer.observe(elements.target2);
                observer.observe(elements.target3);
                observer.observe(elements.target4);
            }], done);
        });

        it('handles targets on the boundary of root', done => {
            const spy = jasmine.createSpy();

            observer = new IntersectionObserver(spy, {
                root: elements.root
            });

            runSequence([done => {
                    elements.target1.style.top = '0px';
                    elements.target1.style.left = '-21px';

                    elements.target2.style.top = '-20px';
                    elements.target2.style.left = '0px';

                    observer.observe(elements.target1);
                    observer.observe(elements.target2);

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(entries.length).toBe(1);

                        expect(entries[0].intersectionRatio).toBe(0);
                        expect(entries[0].target).toBe(elements.target2);

                        done();
                    }, timeout);
                }, done => {
                    elements.target1.style.top = '0px';
                    elements.target1.style.left = '-20px';
                    elements.target2.style.top = '-21px';
                    elements.target2.style.left = '0px';

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(2);
                        expect(entries.length).toBe(2);

                        expect(entries[0].intersectionRatio).toBe(0);
                        expect(entries[0].target).toBe(elements.target1);

                        expect(entries[1].intersectionRatio).toBe(0);
                        expect(entries[1].target).toBe(elements.target2);

                        done();
                    }, timeout);
                }, done => {
                    elements.target1.style.top = '-20px';
                    elements.target1.style.left = '200px';

                    elements.target2.style.top = '200px';
                    elements.target2.style.left = '200px';

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(3);
                        expect(entries.length).toBe(1);

                        expect(entries[0].intersectionRatio).toBe(0);
                        expect(entries[0].target).toBe(elements.target2);

                        done();
                    }, timeout);
                }
            ], done);
        });

        it('handles zero-size targets within the root coordinate space', done => {
            const style = elements.target1.style;

            observer = new IntersectionObserver(entries => {
                expect(entries.length).toBe(1);
                expect(entries[0].intersectionRatio).toBe(0);

                done();
            }, {
                root: elements.root
            });

            style.top = style.left = style.width = style.height = '0px';

            observer.observe(elements.target1);
        });

        it('handles sub-root element scrolling', done => {
            elements.container2.style.overflow = 'auto';
            elements.target1.style.margin = '201px 0px';

            observer = new IntersectionObserver(entries => {
                expect(entries.length).toBe(1);
                expect(entries[0].intersectionRatio).toBe(1);

                done();
            }, {
                root: elements.root
            });

            observer.observe(elements.target1);

            setTimeout(() => {
                elements.container2.scrollTop = 200;
            }, timeout);
        });

        if (typeof document.body.style.transform !== 'undefined') {
            it('supports CSS transitions and transforms', done => {
                elements.target1.style.top = '220px';
                elements.target1.style.left = '220px';

                observer = new IntersectionObserver(entries => {
                    expect(entries.length).toBe(1);
                    expect(entries[0].intersectionRatio).toBe(1);

                    done();
                }, {
                    root: elements.root,
                    threshold: [1]
                });

                observer.observe(elements.target1);

                setTimeout(() => {
                    elements.target1.style.transform = 'translateX(-40px) translateY(-40px)';
                }, 0);
            });
        }

        it('uses viewport when no root is specified', done => {
            observer = new IntersectionObserver(entries => {
                const viewport = document.documentElement;
                const viewportRect = {
                    top: 0,
                    left: 0,
                    right: viewport.clientWidth,
                    bottom: viewport.clientHeight,
                    width: viewport.clientWidth,
                    height: viewport.clientHeight
                };

                const rootBounds = entries[0].rootBounds;

                expect(entries.length).toBe(1);

                for (const key of Object.keys(viewportRect)) {
                    expect(rootBounds[key]).toEqual(viewportRect[key]);
                }

                done();
            });

            window.scrollTo(0, 0);

            elements.root.style.position = 'absolute';
            elements.root.style.top = '0px';
            elements.root.style.left = '0px';

            observer.observe(elements.target1);
        });

        it('handles root/target elements not yet in the DOM', done => {
            const spy = jasmine.createSpy();

            document.body.removeChild(elements.root);
            elements.container2.removeChild(elements.target1);

            observer = new IntersectionObserver(spy, {
                root: elements.root
            });

            runSequence([done => {
                    observer.observe(elements.target1);
                    setTimeout(done, 0);
                }, done => {
                    document.body.appendChild(elements.root);

                    setTimeout(() => {
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    }, timeout);
                }, done => {
                    elements.container2.insertBefore(elements.target1, elements.target2);

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(entries.length).toBe(1);

                        expect(entries[0].intersectionRatio).toBe(1);
                        expect(entries[0].target).toBe(elements.target1);

                        done();
                    }, timeout);
                }, done => {
                    elements.root.removeChild(elements.container1);

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(2);
                        expect(entries.length).toBe(1);

                        expect(entries[0].intersectionRatio).toBe(0);
                        expect(entries[0].target).toBe(elements.target1);

                        done();
                    }, timeout);
                }, done => {
                    elements.root.appendChild(elements.target1);

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(3);
                        expect(entries.length).toBe(1);

                        expect(entries[0].intersectionRatio).toBe(1);
                        expect(entries[0].target).toBe(elements.target1);

                        done();
                    }, timeout);
                }, done => {
                    elements.root.parentNode.removeChild(elements.root);

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(4);
                        expect(entries.length).toBe(1);

                        expect(entries[0].intersectionRatio).toBe(0);
                        expect(entries[0].target).toBe(elements.target1);

                        done();
                    }, timeout);
                }
            ], done);
        });
    });

    describe('takeRecords', () => {
        xit('supports getting entries before the callback is invoked', done => {
            const spy = jasmine.createSpy();
            let entries = [];

            observer = new IntersectionObserver(spy, {root: elements.root});

            const intervalID = window.setInterval(() => {
                entries.push(...observer.takeRecords());
            }, 0);

            observer.observe(elements.target3);

            setTimeout(() => {
                window.clearInterval(intervalID);

                expect(spy).not.toHaveBeenCalled();
                expect(entries.length).toBe(1);

                done();
            }, timeout);
        });
    });

    describe('unobserve', () => {
        it('throws an error if no arguments were provided', () => {
            observer = new IntersectionObserver(emptyFn);

            expect(() => {
                observer.unobserve();
            }).toThrowError(/1 argument required/i);
        });

        it('throws an error if target is not Element', () => {
            observer = new IntersectionObserver(emptyFn);

            expect(() => {
                observer.unobserve(false);
            }).toThrowError(/Element/i);

            expect(() => {
                observer.unobserve(null);
            }).toThrowError(/Element/i);

            expect(() => {
                observer.unobserve({});
            }).toThrowError(/Element/i);

            expect(() => {
                observer.unobserve(document.createTextNode(''));
            }).toThrowError(/Element/i);
        });

        it('removes targets from the internal store', done => {
            const spy = jasmine.createSpy();

            observer = new IntersectionObserver(spy, {
                root: elements.root
            });

            runSequence([done => {
                    elements.target1.style.top = elements.target2.style.top = '0px';
                    elements.target1.style.left = elements.target2.style.left = '0px';

                    observer.observe(elements.target1);
                    observer.observe(elements.target2);

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(entries.length).toBe(2);

                        expect(entries[0].target).toBe(elements.target1);
                        expect(entries[0].intersectionRatio).toBe(1);

                        expect(entries[1].target).toBe(elements.target2);
                        expect(entries[1].intersectionRatio).toBe(1);

                        done();
                    }, timeout);
                }, done => {
                    observer.unobserve(elements.target1);

                    elements.target1.style.top = elements.target2.style.top = '0px';
                    elements.target1.style.left = elements.target2.style.left = '-40px';

                    setTimeout(() => {
                        const entries = getEntries(spy.calls.mostRecent());

                        expect(spy).toHaveBeenCalledTimes(2);
                        expect(entries.length).toBe(1);

                        expect(entries[0].target).toBe(elements.target2);
                        expect(entries[0].intersectionRatio).toBe(0);
                        done();
                    }, timeout);
                }, done => {
                    observer.unobserve(elements.target2);

                    elements.target1.style.top = elements.target2.style.top = '0px';
                    elements.target1.style.left = elements.target2.style.left = '0px';

                    setTimeout(() => {
                        expect(spy).toHaveBeenCalledTimes(2);
                        done();
                    }, timeout);
                }
            ], done);
        });
    });

    describe('disconnect', () => {
        it('removes all targets and stops listening for changes', done => {
            const spy = jasmine.createSpy();

            observer = new IntersectionObserver(spy, {root: elements.root});

            runSequence([done => {
                elements.target1.style.top = elements.target2.style.top = '0px';
                elements.target1.style.left = elements.target2.style.left = '0px';

                observer.observe(elements.target1);
                observer.observe(elements.target2);

                setTimeout(() => {
                    const entries = getEntries(spy.calls.mostRecent());

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(entries.length).toBe(2);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].intersectionRatio).toBe(1);

                    expect(entries[1].target).toBe(elements.target2);
                    expect(entries[1].intersectionRatio).toBe(1);

                    done();
                }, timeout);
            }, done => {
                observer.disconnect();

                elements.target1.style.top = elements.target2.style.top = '0px';
                elements.target1.style.left = elements.target2.style.left = '-40px';

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(1);
                    done();
                }, timeout);
            }], done);
        });
    });
});
