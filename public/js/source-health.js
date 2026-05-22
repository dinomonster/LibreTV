const SOURCE_HEALTH_STORAGE_KEY = 'sourceHealthState';
const SOURCE_HEALTH_TTL = 12 * 60 * 60 * 1000;

function loadSourceHealthState() {
    try {
        const rawValue = localStorage.getItem(SOURCE_HEALTH_STORAGE_KEY);
        const parsedValue = rawValue ? JSON.parse(rawValue) : {};
        const now = Date.now();
        const normalizedState = {};

        Object.entries(parsedValue).forEach(([sourceKey, sourceState]) => {
            if (!sourceState || typeof sourceState !== 'object') {
                return;
            }

            const timestamp = Number(sourceState.timestamp);
            if (!timestamp || (now - timestamp) > SOURCE_HEALTH_TTL) {
                return;
            }

            normalizedState[sourceKey] = sourceState;
        });

        return normalizedState;
    } catch (error) {
        return {};
    }
}

function saveSourceHealthState(sourceHealthState) {
    try {
        localStorage.setItem(SOURCE_HEALTH_STORAGE_KEY, JSON.stringify(sourceHealthState));
    } catch (error) {
    }
}

function markSourceUnavailable(sourceKey, metadata = {}) {
    if (!sourceKey) {
        return;
    }

    const sourceHealthState = loadSourceHealthState();
    sourceHealthState[sourceKey] = {
        timestamp: Date.now(),
        ...metadata,
    };
    saveSourceHealthState(sourceHealthState);
}

function markSourceAvailable(sourceKey) {
    if (!sourceKey) {
        return;
    }

    const sourceHealthState = loadSourceHealthState();
    if (!sourceHealthState[sourceKey]) {
        return;
    }

    delete sourceHealthState[sourceKey];
    saveSourceHealthState(sourceHealthState);
}

function isSourceAvailable(sourceKey) {
    if (!sourceKey) {
        return true;
    }

    const sourceHealthState = loadSourceHealthState();
    return !sourceHealthState[sourceKey];
}

function getUnavailableSources() {
    return Object.keys(loadSourceHealthState());
}

function clearUnavailableSources() {
    try {
        localStorage.removeItem(SOURCE_HEALTH_STORAGE_KEY);
    } catch (error) {
    }
}

window.SourceHealth = {
    markSourceUnavailable,
    markSourceAvailable,
    isSourceAvailable,
    getUnavailableSources,
    clearUnavailableSources,
};
