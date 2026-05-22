const BUILT_IN_API_SOURCE_DEFINITIONS = [
    {
        id: 'qiqi',
        api: 'https://www.qiqidys.com/api.php/provide/vod',
        name: '七七资源',
        priority: 100,
        defaultSelected: false,
        enabled: false,
    },
    {
        id: 'ruyi',
        api: 'https://cj.rycjapi.com/api.php/provide/vod',
        name: '如意资源',
        priority: 95,
        defaultSelected: true,
    },
    {
        id: 'bfzy',
        api: 'https://bfzyapi.com/api.php/provide/vod',
        name: '暴风资源',
        priority: 90,
        defaultSelected: true,
    },
    {
        id: 'tyyszy',
        api: 'https://tyyszy.com/api.php/provide/vod',
        name: '天涯资源',
        priority: 85,
        defaultSelected: false,
        enabled: false,
    },
    {
        id: 'ffzy',
        api: 'http://ffzy5.tv/api.php/provide/vod',
        name: '非凡影视',
        detail: 'http://ffzy5.tv',
        priority: 80,
        defaultSelected: true,
    },
    {
        id: 'lzi',
        api: 'https://cj.lziapi.com/api.php/provide/vod/',
        name: '量子资源站',
        priority: 75,
        defaultSelected: false,
    },
    {
        id: 'zy360',
        api: 'https://360zy.com/api.php/provide/vod',
        name: '360资源',
        priority: 70,
        defaultSelected: false,
    },
    {
        id: 'dbzy',
        api: 'https://dbzy.tv/api.php/provide/vod',
        name: '豆瓣资源',
        priority: 65,
        defaultSelected: true,
    },
    {
        id: 'wujin',
        api: 'https://api.wujinapi.me/api.php/provide/vod',
        name: '无尽资源',
        priority: 60,
        defaultSelected: true,
    },
    {
        id: 'ikun',
        api: 'https://ikunzyapi.com/api.php/provide/vod',
        name: 'iKun资源',
        priority: 55,
        defaultSelected: false,
    },
    {
        id: 'zuid',
        api: 'https://api.zuidapi.com/api.php/provide/vod',
        name: '最大资源',
        priority: 50,
        defaultSelected: true,
    },
    {
        id: 'mozhua',
        api: 'https://mozhuazy.com/api.php/provide/vod',
        name: '魔爪资源',
        priority: 45,
        defaultSelected: false,
    },
    {
        id: 'heimuer',
        api: 'https://json.heimuer.xyz/api.php/provide/vod',
        name: '黑木耳',
        detail: 'https://heimuer.tv',
        priority: 40,
        defaultSelected: false,
    },
    {
        id: 'xiaomaomi',
        api: 'https://zy.xmm.hk/api.php/provide/vod',
        name: '小猫咪资源',
        priority: 35,
        defaultSelected: false,
    },
    {
        id: 'jisu',
        api: 'https://jszyapi.com/api.php/provide/vod',
        name: '极速资源',
        detail: 'https://jszyapi.com',
        priority: 30,
        defaultSelected: false,
    },
];

const sourceDefinitions = [...BUILT_IN_API_SOURCE_DEFINITIONS];

function normalizeSourceDefinition(id, source) {
    return {
        id,
        name: source.name || id,
        api: source.api,
        detail: source.detail,
        adult: source.adult === true,
        enabled: source.enabled !== false,
        priority: Number.isFinite(source.priority) ? source.priority : 0,
        defaultSelected: source.defaultSelected === true,
    };
}

function isSourceEnabled(source) {
    return source.enabled !== false;
}

function buildSourceMap() {
    const sourceMap = {};

    sourceDefinitions.filter(isSourceEnabled).forEach((source) => {
        const { id, ...siteConfig } = source;
        sourceMap[id] = { ...siteConfig };
    });

    return sourceMap;
}

function getSortedDefinitions(includeAdult = false) {
    return sourceDefinitions
        .filter(isSourceEnabled)
        .filter((source) => includeAdult || !source.adult)
        .sort((left, right) => {
            if (right.priority !== left.priority) {
                return right.priority - left.priority;
            }
            return left.name.localeCompare(right.name);
        });
}

function registerBuiltinSources(sources) {
    Object.entries(sources).forEach(([id, source]) => {
        const existingIndex = sourceDefinitions.findIndex((item) => item.id === id);
        const normalizedSource = normalizeSourceDefinition(id, source);

        if (existingIndex >= 0) {
            sourceDefinitions[existingIndex] = {
                ...sourceDefinitions[existingIndex],
                ...normalizedSource,
            };
            return;
        }

        sourceDefinitions.push(normalizedSource);
    });
}

window.API_SOURCE_REGISTRY = {
    buildSourceMap,
    getBuiltInApiIds(options = {}) {
        const { includeAdult = false } = options;
        return getSortedDefinitions(includeAdult).map((source) => source.id);
    },
    getDefaultApiSelection(limit = 6) {
        const preferredSources = getSortedDefinitions(false).filter((source) => source.defaultSelected);
        const selectedSources = preferredSources.length > 0 ? preferredSources : getSortedDefinitions(false);
        return selectedSources.slice(0, limit).map((source) => source.id);
    },
    getSourceDefinition(id) {
        return sourceDefinitions.find((source) => source.id === id) || null;
    },
    registerBuiltinSources,
};
