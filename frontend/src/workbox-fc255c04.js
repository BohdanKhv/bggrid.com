define(["exports"], (function(t) {
    "use strict";
    try {
        self["workbox:core:6.5.4"] && _()
    } catch (t) {}
    try {
        self["workbox:core:6.5.4"] && _()
    } catch (t) {}
    const e = (t,...e)=>{
        let s = t;
        return e.length > 0 && (s += ` :: ${JSON.stringify(e)}`),
        s
    }
    ;
    class s extends Error {
        constructor(t, s) {
            super(e(t, s)),
            this.name = t,
            this.details = s
        }
    }
    try {
        self["workbox:routing:6.5.4"] && _()
    } catch (t) {}
    const n = t=>t && "object" == typeof t ? t : {
        handle: t
    };
    class r {
        constructor(t, e, s="GET") {
            this.handler = n(e),
            this.match = t,
            this.method = s
        }
        setCatchHandler(t) {
            this.catchHandler = n(t)
        }
    }
    class i extends r {
        constructor(t, e, s) {
            super((({url: e})=>{
                const s = t.exec(e.href);
                if (s && (e.origin === location.origin || 0 === s.index))
                    return s.slice(1)
            }
            ), e, s)
        }
    }
    class o {
        constructor() {
            this.t = new Map,
            this.i = new Map
        }
        get routes() {
            return this.t
        }
        addFetchListener() {
            self.addEventListener("fetch", (t=>{
                const {request: e} = t
                  , s = this.handleRequest({
                    request: e,
                    event: t
                });
                s && t.respondWith(s)
            }
            ))
        }
        addCacheListener() {
            self.addEventListener("message", (t=>{
                if (t.data && "CACHE_URLS" === t.data.type) {
                    const {payload: e} = t.data
                      , s = Promise.all(e.urlsToCache.map((e=>{
                        "string" == typeof e && (e = [e]);
                        const s = new Request(...e);
                        return this.handleRequest({
                            request: s,
                            event: t
                        })
                    }
                    )));
                    t.waitUntil(s),
                    t.ports && t.ports[0] && s.then((()=>t.ports[0].postMessage(!0)))
                }
            }
            ))
        }
        handleRequest({request: t, event: e}) {
            const s = new URL(t.url,location.href);
            if (!s.protocol.startsWith("http"))
                return;
            const n = s.origin === location.origin
              , {params: r, route: i} = this.findMatchingRoute({
                event: e,
                request: t,
                sameOrigin: n,
                url: s
            });
            let o = i && i.handler;
            const c = t.method;
            if (!o && this.i.has(c) && (o = this.i.get(c)),
            !o)
                return;
            let a;
            try {
                a = o.handle({
                    url: s,
                    request: t,
                    event: e,
                    params: r
                })
            } catch (t) {
                a = Promise.reject(t)
            }
            const h = i && i.catchHandler;
            return a instanceof Promise && (this.o || h) && (a = a.catch((async n=>{
                if (h)
                    try {
                        return await h.handle({
                            url: s,
                            request: t,
                            event: e,
                            params: r
                        })
                    } catch (t) {
                        t instanceof Error && (n = t)
                    }
                if (this.o)
                    return this.o.handle({
                        url: s,
                        request: t,
                        event: e
                    });
                throw n
            }
            ))),
            a
        }
        findMatchingRoute({url: t, sameOrigin: e, request: s, event: n}) {
            const r = this.t.get(s.method) || [];
            for (const i of r) {
                let r;
                const o = i.match({
                    url: t,
                    sameOrigin: e,
                    request: s,
                    event: n
                });
                if (o)
                    return r = o,
                    (Array.isArray(r) && 0 === r.length || o.constructor === Object && 0 === Object.keys(o).length || "boolean" == typeof o) && (r = void 0),
                    {
                        route: i,
                        params: r
                    }
            }
            return {}
        }
        setDefaultHandler(t, e="GET") {
            this.i.set(e, n(t))
        }
        setCatchHandler(t) {
            this.o = n(t)
        }
        registerRoute(t) {
            this.t.has(t.method) || this.t.set(t.method, []),
            this.t.get(t.method).push(t)
        }
        unregisterRoute(t) {
            if (!this.t.has(t.method))
                throw new s("unregister-route-but-not-found-with-method",{
                    method: t.method
                });
            const e = this.t.get(t.method).indexOf(t);
            if (!(e > -1))
                throw new s("unregister-route-route-not-registered");
            this.t.get(t.method).splice(e, 1)
        }
    }
    let c;
    const a = ()=>(c || (c = new o,
    c.addFetchListener(),
    c.addCacheListener()),
    c);
    function h(t, e, n) {
        let o;
        if ("string" == typeof t) {
            const s = new URL(t,location.href);
            o = new r((({url: t})=>t.href === s.href),e,n)
        } else if (t instanceof RegExp)
            o = new i(t,e,n);
        else if ("function" == typeof t)
            o = new r(t,e,n);
        else {
            if (!(t instanceof r))
                throw new s("unsupported-route-type",{
                    moduleName: "workbox-routing",
                    funcName: "registerRoute",
                    paramName: "capture"
                });
            o = t
        }
        return a().registerRoute(o),
        o
    }
    const u = (t,...e)=>{
        let s = t;
        return e.length > 0 && (s += ` :: ${JSON.stringify(e)}`),
        s
    }
    ;
    class l extends Error {
        constructor(t, e) {
            super(u(t, e)),
            this.name = t,
            this.details = e
        }
    }
    const f = {
        googleAnalytics: "googleAnalytics",
        precache: "precache-v2",
        prefix: "workbox",
        runtime: "runtime",
        suffix: "undefined" != typeof registration ? registration.scope : ""
    }
      , w = t=>[f.prefix, t, f.suffix].filter((t=>t && t.length > 0)).join("-")
      , d = t=>t || w(f.precache);
    function p(t, e) {
        const s = e();
        return t.waitUntil(s),
        s
    }
    try {
        self["workbox:precaching:6.5.4"] && _()
    } catch (t) {}
    function y(t) {
        if (!t)
            throw new l("add-to-cache-list-unexpected-type",{
                entry: t
            });
        if ("string" == typeof t) {
            const e = new URL(t,location.href);
            return {
                cacheKey: e.href,
                url: e.href
            }
        }
        const {revision: e, url: s} = t;
        if (!s)
            throw new l("add-to-cache-list-unexpected-type",{
                entry: t
            });
        if (!e) {
            const t = new URL(s,location.href);
            return {
                cacheKey: t.href,
                url: t.href
            }
        }
        const n = new URL(s,location.href)
          , r = new URL(s,location.href);
        return n.searchParams.set("__WB_REVISION__", e),
        {
            cacheKey: n.href,
            url: r.href
        }
    }
    class g {
        constructor() {
            this.updatedURLs = [],
            this.notUpdatedURLs = [],
            this.handlerWillStart = async({request: t, state: e})=>{
                e && (e.originalRequest = t)
            }
            ,
            this.cachedResponseWillBeUsed = async({event: t, state: e, cachedResponse: s})=>{
                if ("install" === t.type && e && e.originalRequest && e.originalRequest instanceof Request) {
                    const t = e.originalRequest.url;
                    s ? this.notUpdatedURLs.push(t) : this.updatedURLs.push(t)
                }
                return s
            }
        }
    }
    class R {
        constructor({precacheController: t}) {
            this.cacheKeyWillBeUsed = async({request: t, params: e})=>{
                const s = (null == e ? void 0 : e.cacheKey) || this.h.getCacheKeyForURL(t.url);
                return s ? new Request(s,{
                    headers: t.headers
                }) : t
            }
            ,
            this.h = t
        }
    }
    let m;
    async function v(t, e) {
        let s = null;
        if (t.url) {
            s = new URL(t.url).origin
        }
        if (s !== self.location.origin)
            throw new l("cross-origin-copy-response",{
                origin: s
            });
        const n = t.clone()
          , r = {
            headers: new Headers(n.headers),
            status: n.status,
            statusText: n.statusText
        }
          , i = e ? e(r) : r
          , o = function() {
            if (void 0 === m) {
                const t = new Response("");
                if ("body"in t)
                    try {
                        new Response(t.body),
                        m = !0
                    } catch (t) {
                        m = !1
                    }
                m = !1
            }
            return m
        }() ? n.body : await n.blob();
        return new Response(o,i)
    }
    try {
        self["workbox:core:6.5.4"] && _()
    } catch (t) {}
    const q = {
        googleAnalytics: "googleAnalytics",
        precache: "precache-v2",
        prefix: "workbox",
        runtime: "runtime",
        suffix: "undefined" != typeof registration ? registration.scope : ""
    }
      , U = t=>[q.prefix, t, q.suffix].filter((t=>t && t.length > 0)).join("-")
      , b = t=>t || U(q.runtime)
      , L = (t,...e)=>{
        let s = t;
        return e.length > 0 && (s += ` :: ${JSON.stringify(e)}`),
        s
    }
    ;
    class x extends Error {
        constructor(t, e) {
            super(L(t, e)),
            this.name = t,
            this.details = e
        }
    }
    function E(t, e) {
        const s = new URL(t);
        for (const t of e)
            s.searchParams.delete(t);
        return s.href
    }
    class O {
        constructor() {
            this.promise = new Promise(((t,e)=>{
                this.resolve = t,
                this.reject = e
            }
            ))
        }
    }
    const C = new Set;
    try {
        self["workbox:strategies:6.5.4"] && _()
    } catch (t) {}
    function N(t) {
        return "string" == typeof t ? new Request(t) : t
    }
    class k {
        constructor(t, e) {
            this.u = {},
            Object.assign(this, e),
            this.event = e.event,
            this.l = t,
            this.p = new O,
            this.g = [],
            this.R = [...t.plugins],
            this.m = new Map;
            for (const t of this.R)
                this.m.set(t, {});
            this.event.waitUntil(this.p.promise)
        }
        async fetch(t) {
            const {event: e} = this;
            let s = N(t);
            if ("navigate" === s.mode && e instanceof FetchEvent && e.preloadResponse) {
                const t = await e.preloadResponse;
                if (t)
                    return t
            }
            const n = this.hasCallback("fetchDidFail") ? s.clone() : null;
            try {
                for (const t of this.iterateCallbacks("requestWillFetch"))
                    s = await t({
                        request: s.clone(),
                        event: e
                    })
            } catch (t) {
                if (t instanceof Error)
                    throw new x("plugin-error-request-will-fetch",{
                        thrownErrorMessage: t.message
                    })
            }
            const r = s.clone();
            try {
                let t;
                t = await fetch(s, "navigate" === s.mode ? void 0 : this.l.fetchOptions);
                for (const s of this.iterateCallbacks("fetchDidSucceed"))
                    t = await s({
                        event: e,
                        request: r,
                        response: t
                    });
                return t
            } catch (t) {
                throw n && await this.runCallbacks("fetchDidFail", {
                    error: t,
                    event: e,
                    originalRequest: n.clone(),
                    request: r.clone()
                }),
                t
            }
        }
        async fetchAndCachePut(t) {
            const e = await this.fetch(t)
              , s = e.clone();
            return this.waitUntil(this.cachePut(t, s)),
            e
        }
        async cacheMatch(t) {
            const e = N(t);
            let s;
            const {cacheName: n, matchOptions: r} = this.l
              , i = await this.getCacheKey(e, "read")
              , o = Object.assign(Object.assign({}, r), {
                cacheName: n
            });
            s = await caches.match(i, o);
            for (const t of this.iterateCallbacks("cachedResponseWillBeUsed"))
                s = await t({
                    cacheName: n,
                    matchOptions: r,
                    cachedResponse: s,
                    request: i,
                    event: this.event
                }) || void 0;
            return s
        }
        async cachePut(t, e) {
            const s = N(t);
            var n;
            await (n = 0,
            new Promise((t=>setTimeout(t, n))));
            const r = await this.getCacheKey(s, "write");
            if (!e)
                throw new x("cache-put-with-no-response",{
                    url: (i = r.url,
                    new URL(String(i),location.href).href.replace(new RegExp(`^${location.origin}`), ""))
                });
            var i;
            const o = await this.v(e);
            if (!o)
                return !1;
            const {cacheName: c, matchOptions: a} = this.l
              , h = await self.caches.open(c)
              , u = this.hasCallback("cacheDidUpdate")
              , l = u ? await async function(t, e, s, n) {
                const r = E(e.url, s);
                if (e.url === r)
                    return t.match(e, n);
                const i = Object.assign(Object.assign({}, n), {
                    ignoreSearch: !0
                })
                  , o = await t.keys(e, i);
                for (const e of o)
                    if (r === E(e.url, s))
                        return t.match(e, n)
            }(h, r.clone(), ["__WB_REVISION__"], a) : null;
            try {
                await h.put(r, u ? o.clone() : o)
            } catch (t) {
                if (t instanceof Error)
                    throw "QuotaExceededError" === t.name && await async function() {
                        for (const t of C)
                            await t()
                    }(),
                    t
            }
            for (const t of this.iterateCallbacks("cacheDidUpdate"))
                await t({
                    cacheName: c,
                    oldResponse: l,
                    newResponse: o.clone(),
                    request: r,
                    event: this.event
                });
            return !0
        }
        async getCacheKey(t, e) {
            const s = `${t.url} | ${e}`;
            if (!this.u[s]) {
                let n = t;
                for (const t of this.iterateCallbacks("cacheKeyWillBeUsed"))
                    n = N(await t({
                        mode: e,
                        request: n,
                        event: this.event,
                        params: this.params
                    }));
                this.u[s] = n
            }
            return this.u[s]
        }
        hasCallback(t) {
            for (const e of this.l.plugins)
                if (t in e)
                    return !0;
            return !1
        }
        async runCallbacks(t, e) {
            for (const s of this.iterateCallbacks(t))
                await s(e)
        }
        *iterateCallbacks(t) {
            for (const e of this.l.plugins)
                if ("function" == typeof e[t]) {
                    const s = this.m.get(e)
                      , n = n=>{
                        const r = Object.assign(Object.assign({}, n), {
                            state: s
                        });
                        return e[t](r)
                    }
                    ;
                    yield n
                }
        }
        waitUntil(t) {
            return this.g.push(t),
            t
        }
        async doneWaiting() {
            let t;
            for (; t = this.g.shift(); )
                await t
        }
        destroy() {
            this.p.resolve(null)
        }
        async v(t) {
            let e = t
              , s = !1;
            for (const t of this.iterateCallbacks("cacheWillUpdate"))
                if (e = await t({
                    request: this.request,
                    response: e,
                    event: this.event
                }) || void 0,
                s = !0,
                !e)
                    break;
            return s || e && 200 !== e.status && (e = void 0),
            e
        }
    }
    class S {
        constructor(t={}) {
            this.cacheName = b(t.cacheName),
            this.plugins = t.plugins || [],
            this.fetchOptions = t.fetchOptions,
            this.matchOptions = t.matchOptions
        }
        handle(t) {
            const [e] = this.handleAll(t);
            return e
        }
        handleAll(t) {
            t instanceof FetchEvent && (t = {
                event: t,
                request: t.request
            });
            const e = t.event
              , s = "string" == typeof t.request ? new Request(t.request) : t.request
              , n = "params"in t ? t.params : void 0
              , r = new k(this,{
                event: e,
                request: s,
                params: n
            })
              , i = this.q(r, s, e);
            return [i, this.U(i, r, s, e)]
        }
        async q(t, e, s) {
            let n;
            await t.runCallbacks("handlerWillStart", {
                event: s,
                request: e
            });
            try {
                if (n = await this.L(e, t),
                !n || "error" === n.type)
                    throw new x("no-response",{
                        url: e.url
                    })
            } catch (r) {
                if (r instanceof Error)
                    for (const i of t.iterateCallbacks("handlerDidError"))
                        if (n = await i({
                            error: r,
                            event: s,
                            request: e
                        }),
                        n)
                            break;
                if (!n)
                    throw r
            }
            for (const r of t.iterateCallbacks("handlerWillRespond"))
                n = await r({
                    event: s,
                    request: e,
                    response: n
                });
            return n
        }
        async U(t, e, s, n) {
            let r, i;
            try {
                r = await t
            } catch (i) {}
            try {
                await e.runCallbacks("handlerDidRespond", {
                    event: n,
                    request: s,
                    response: r
                }),
                await e.doneWaiting()
            } catch (t) {
                t instanceof Error && (i = t)
            }
            if (await e.runCallbacks("handlerDidComplete", {
                event: n,
                request: s,
                response: r,
                error: i
            }),
            e.destroy(),
            i)
                throw i
        }
    }
    class K extends S {
        constructor(t={}) {
            t.cacheName = d(t.cacheName),
            super(t),
            this._ = !1 !== t.fallbackToNetwork,
            this.plugins.push(K.copyRedirectedCacheableResponsesPlugin)
        }
        async L(t, e) {
            const s = await e.cacheMatch(t);
            return s || (e.event && "install" === e.event.type ? await this.O(t, e) : await this.C(t, e))
        }
        async C(t, e) {
            let s;
            const n = e.params || {};
            if (!this._)
                throw new l("missing-precache-entry",{
                    cacheName: this.cacheName,
                    url: t.url
                });
            {
                const r = n.integrity
                  , i = t.integrity
                  , o = !i || i === r;
                s = await e.fetch(new Request(t,{
                    integrity: "no-cors" !== t.mode ? i || r : void 0
                })),
                r && o && "no-cors" !== t.mode && (this.N(),
                await e.cachePut(t, s.clone()))
            }
            return s
        }
        async O(t, e) {
            this.N();
            const s = await e.fetch(t);
            if (!await e.cachePut(t, s.clone()))
                throw new l("bad-precaching-response",{
                    url: t.url,
                    status: s.status
                });
            return s
        }
        N() {
            let t = null
              , e = 0;
            for (const [s,n] of this.plugins.entries())
                n !== K.copyRedirectedCacheableResponsesPlugin && (n === K.defaultPrecacheCacheabilityPlugin && (t = s),
                n.cacheWillUpdate && e++);
            0 === e ? this.plugins.push(K.defaultPrecacheCacheabilityPlugin) : e > 1 && null !== t && this.plugins.splice(t, 1)
        }
    }
    K.defaultPrecacheCacheabilityPlugin = {
        cacheWillUpdate: async({response: t})=>!t || t.status >= 400 ? null : t
    },
    K.copyRedirectedCacheableResponsesPlugin = {
        cacheWillUpdate: async({response: t})=>t.redirected ? await v(t) : t
    };
    class P {
        constructor({cacheName: t, plugins: e=[], fallbackToNetwork: s=!0}={}) {
            this.k = new Map,
            this.S = new Map,
            this.K = new Map,
            this.l = new K({
                cacheName: d(t),
                plugins: [...e, new R({
                    precacheController: this
                })],
                fallbackToNetwork: s
            }),
            this.install = this.install.bind(this),
            this.activate = this.activate.bind(this)
        }
        get strategy() {
            return this.l
        }
        precache(t) {
            this.addToCacheList(t),
            this.P || (self.addEventListener("install", this.install),
            self.addEventListener("activate", this.activate),
            this.P = !0)
        }
        addToCacheList(t) {
            const e = [];
            for (const s of t) {
                "string" == typeof s ? e.push(s) : s && void 0 === s.revision && e.push(s.url);
                const {cacheKey: t, url: n} = y(s)
                  , r = "string" != typeof s && s.revision ? "reload" : "default";
                if (this.k.has(n) && this.k.get(n) !== t)
                    throw new l("add-to-cache-list-conflicting-entries",{
                        firstEntry: this.k.get(n),
                        secondEntry: t
                    });
                if ("string" != typeof s && s.integrity) {
                    if (this.K.has(t) && this.K.get(t) !== s.integrity)
                        throw new l("add-to-cache-list-conflicting-integrities",{
                            url: n
                        });
                    this.K.set(t, s.integrity)
                }
                if (this.k.set(n, t),
                this.S.set(n, r),
                e.length > 0) {
                    const t = `Workbox is precaching URLs without revision info: ${e.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
                    console.warn(t)
                }
            }
        }
        install(t) {
            return p(t, (async()=>{
                const e = new g;
                this.strategy.plugins.push(e);
                for (const [e,s] of this.k) {
                    const n = this.K.get(s)
                      , r = this.S.get(e)
                      , i = new Request(e,{
                        integrity: n,
                        cache: r,
                        credentials: "same-origin"
                    });
                    await Promise.all(this.strategy.handleAll({
                        params: {
                            cacheKey: s
                        },
                        request: i,
                        event: t
                    }))
                }
                const {updatedURLs: s, notUpdatedURLs: n} = e;
                return {
                    updatedURLs: s,
                    notUpdatedURLs: n
                }
            }
            ))
        }
        activate(t) {
            return p(t, (async()=>{
                const t = await self.caches.open(this.strategy.cacheName)
                  , e = await t.keys()
                  , s = new Set(this.k.values())
                  , n = [];
                for (const r of e)
                    s.has(r.url) || (await t.delete(r),
                    n.push(r.url));
                return {
                    deletedURLs: n
                }
            }
            ))
        }
        getURLsToCacheKeys() {
            return this.k
        }
        getCachedURLs() {
            return [...this.k.keys()]
        }
        getCacheKeyForURL(t) {
            const e = new URL(t,location.href);
            return this.k.get(e.href)
        }
        getIntegrityForCacheKey(t) {
            return this.K.get(t)
        }
        async matchPrecache(t) {
            const e = t instanceof Request ? t.url : t
              , s = this.getCacheKeyForURL(e);
            if (s) {
                return (await self.caches.open(this.strategy.cacheName)).match(s)
            }
        }
        createHandlerBoundToURL(t) {
            const e = this.getCacheKeyForURL(t);
            if (!e)
                throw new l("non-precached-url",{
                    url: t
                });
            return s=>(s.request = new Request(t),
            s.params = Object.assign({
                cacheKey: e
            }, s.params),
            this.strategy.handle(s))
        }
    }
    let T;
    const W = ()=>(T || (T = new P),
    T);
    class j extends r {
        constructor(t, e) {
            super((({request: s})=>{
                const n = t.getURLsToCacheKeys();
                for (const r of function*(t, {ignoreURLParametersMatching: e=[/^utm_/, /^fbclid$/], directoryIndex: s="index.html", cleanURLs: n=!0, urlManipulation: r}={}) {
                    const i = new URL(t,location.href);
                    i.hash = "",
                    yield i.href;
                    const o = function(t, e=[]) {
                        for (const s of [...t.searchParams.keys()])
                            e.some((t=>t.test(s))) && t.searchParams.delete(s);
                        return t
                    }(i, e);
                    if (yield o.href,
                    s && o.pathname.endsWith("/")) {
                        const t = new URL(o.href);
                        t.pathname += s,
                        yield t.href
                    }
                    if (n) {
                        const t = new URL(o.href);
                        t.pathname += ".html",
                        yield t.href
                    }
                    if (r) {
                        const t = r({
                            url: i
                        });
                        for (const e of t)
                            yield e.href
                    }
                }(s.url, e)) {
                    const e = n.get(r);
                    if (e) {
                        return {
                            cacheKey: e,
                            integrity: t.getIntegrityForCacheKey(e)
                        }
                    }
                }
            }
            ), t.strategy)
        }
    }
    t.NavigationRoute = class extends r {
        constructor(t, {allowlist: e=[/./], denylist: s=[]}={}) {
            super((t=>this.T(t)), t),
            this.W = e,
            this.j = s
        }
        T({url: t, request: e}) {
            if (e && "navigate" !== e.mode)
                return !1;
            const s = t.pathname + t.search;
            for (const t of this.j)
                if (t.test(s))
                    return !1;
            return !!this.W.some((t=>t.test(s)))
        }
    }
    ,
    t.cleanupOutdatedCaches = function() {
        self.addEventListener("activate", (t=>{
            const e = d();
            t.waitUntil((async(t,e="-precache-")=>{
                const s = (await self.caches.keys()).filter((s=>s.includes(e) && s.includes(self.registration.scope) && s !== t));
                return await Promise.all(s.map((t=>self.caches.delete(t)))),
                s
            }
            )(e).then((t=>{}
            )))
        }
        ))
    }
    ,
    t.clientsClaim = function() {
        self.addEventListener("activate", (()=>self.clients.claim()))
    }
    ,
    t.createHandlerBoundToURL = function(t) {
        return W().createHandlerBoundToURL(t)
    }
    ,
    t.precacheAndRoute = function(t, e) {
        !function(t) {
            W().precache(t)
        }(t),
        function(t) {
            const e = W();
            h(new j(e,t))
        }(e)
    }
    ,
    t.registerRoute = h
}
));
