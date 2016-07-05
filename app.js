import IntersectionObserver from 'intersection-observer-polyfill/src/IntersectionObserver';

const $observResults = document.getElementById('observation-result');

const el1 = document.getElementById('target1');
const el2 = document.getElementById('target2');
const el3 = document.getElementById('target3');

const config = {
    rootMargin: '0px 0px',
    threshold: '0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1',
    idleTimeout: 50,
    trackHovers: false,
    compact: false,
    useNative: false,
    animate: false,
    transitionDelay: 0
};

let ObserverConstructor,
    observer,
    entries;

entries = [{
    intersectionRect: {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0
    },
    intersectionRatio: 0,
    time: 0
}];

entries[2] = entries[1] = entries[0];

function number(current, previous) {
    if (current !== previous) {
        return `<span class="number changed">${ current }</span>`;
    }

    return `<span class="number">${ current }</span>`;
}

function text(value) {
    return `<span class="text">${ value }</span>`;
}

function intersectioHandler(intersections) {
    let tobs1 = entries[0],
        tobs2 = entries[1],
        tobs3 = entries[2];

    for (const entry of intersections) {
        switch (entry.target) {
            case el1:
                tobs1 = entry;
                break;
            case el2:
                tobs2 = entry;
                break;
            case el3:
                tobs3 = entry;
                break;
        }
    }

    let content =
`
[{
    ${text('intersectionRatio')}: ${number(tobs1.intersectionRatio, entries[0].intersectionRatio)},
    ${text('intersectionRect')}: {
        ${text('bottom')}: ${number(tobs1.intersectionRect.bottom, entries[0].intersectionRect.bottom)},
        ${text('height')}: ${number(tobs1.intersectionRect.height, entries[0].intersectionRect.height)},
        ${text('left')}: ${number(tobs1.intersectionRect.left, entries[0].intersectionRect.left)},
        ${text('right')}: ${number(tobs1.intersectionRect.right, entries[0].intersectionRect.right)},
        ${text('top')}: ${number(tobs1.intersectionRect.top, entries[0].intersectionRect.top)},
        ${text('width')}: ${number(tobs1.intersectionRect.width, entries[0].intersectionRect.width)}
    },
    ${text('target')}: div#target1,
    ${text('time')}: ${number(tobs1.time, entries[0].time)}
}, {
    ${text('intersectionRatio')}: ${number(tobs2.intersectionRatio, entries[1].intersectionRatio)},
    ${text('intersectionRect')}: {
        ${text('bottom')}: ${number(tobs2.intersectionRect.bottom, entries[1].intersectionRect.bottom)},
        ${text('height')}: ${number(tobs2.intersectionRect.height, entries[1].intersectionRect.height)},
        ${text('left')}: ${number(tobs2.intersectionRect.left, entries[1].intersectionRect.left)},
        ${text('right')}: ${number(tobs2.intersectionRect.right, entries[1].intersectionRect.right)},
        ${text('top')}: ${number(tobs2.intersectionRect.top, entries[1].intersectionRect.top)},
        ${text('width')}: ${number(tobs2.intersectionRect.width, entries[1].intersectionRect.width)}
    },
    ${text('target')}: div#target2,
    ${text('time')}: ${number(tobs2.time, entries[1].time)}
}, {
    ${text('intersectionRatio')}: ${number(tobs3.intersectionRatio, entries[2].intersectionRatio)},
    ${text('intersectionRect')}: {
        ${text('bottom')}: ${number(tobs3.intersectionRect.bottom, entries[2].intersectionRect.bottom)},
        ${text('height')}: ${number(tobs3.intersectionRect.height, entries[2].intersectionRect.height)},
        ${text('left')}: ${number(tobs3.intersectionRect.left, entries[2].intersectionRect.left)},
        ${text('right')}: ${number(tobs3.intersectionRect.right, entries[2].intersectionRect.right)},
        ${text('top')}: ${number(tobs3.intersectionRect.top, entries[2].intersectionRect.top)},
        ${text('width')}: ${number(tobs3.intersectionRect.width, entries[2].intersectionRect.width)}
    },
    ${text('target')}: div#target3,
    ${text('time')}: ${number(tobs3.time, entries[2].time)}
}]`;


    $observResults.innerHTML = content.split(/\n/g).map(line => {
        return `<span class="line">${line}</span>`;
    }).join('\n');

    entries[0] = tobs1;
    entries[1] = tobs2;
    entries[2] = tobs3;

    console.log(intersections);
}

function initGui() {
    const gui = new window.dat.GUI();

    gui.add(config, 'rootMargin').onFinishChange(initObserver);
    gui.add(config, 'threshold').onFinishChange(initObserver);

    gui.add(config, 'idleTimeout', 0, 2000).onFinishChange(applyControllerSettings);
    gui.add(config, 'transitionDelay', 0, 2000).step(5).onChange(applyTransitionDelay);
    gui.add(config, 'trackHovers').onChange(applyControllerSettings);

    if (window.IntersectionObserver) {
        gui.add(config, 'useNative').onChange(initObserver);
    }

    gui.add(config, 'compact').onChange(value => {
        document.getElementById('targets').classList.toggle('compact', value);
    });

    gui.add(config, 'animate').onChange(value => {
        document.getElementById('targets').classList.toggle('collapse', value);
    });
}

function initObserver() {
    let tmpObserver;

    if (observer) {
        observer.disconnect();
    }

    ObserverConstructor = config.useNative ?
        window.IntersectionObserver :
        IntersectionObserver;

    try {
        tmpObserver = new ObserverConstructor(intersectioHandler, {
            threshold: parseThreshold(config.threshold),
            rootMargin: config.rootMargin
        });

        observer = tmpObserver;
    } catch (e) {
        alert(e.message);
    }

    observer.observe(el1);
    observer.observe(el2);
    observer.observe(el3);

    applyControllerSettings();
}

function parseThreshold(threshold) {
    return threshold.split(',').map(value => Number(value.trim()));
}

function applyControllerSettings() {
    ObserverConstructor.idleTimeout = config.idleTimeout;
    ObserverConstructor.trackHovers = config.trackHovers;
}

function applyTransitionDelay(value) {
    value = value + 'ms';

    el1.style.transitionDelay = value;
    el2.style.transitionDelay = value;
    el3.style.transitionDelay = value;
}

initGui();
initObserver();
