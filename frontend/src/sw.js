import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

if (!self.define) {
    let e, s = {};
    const i = (i,n)=>(i = new URL(i + ".js",n).href,
    s[i] || new Promise((s=>{
        if ("document"in self) {
            const e = document.createElement("script");
            e.src = i,
            e.onload = s,
            document.head.appendChild(e)
        } else {
            e = i,
            importScripts(i),
            s()
        }
    }
    )).then((()=>{
        let e = s[i];
        if (!e)
            throw new Error(`Module ${i} didn’t register its module`);
        return e
    }
)));
self.define = (n,r)=>{
    const t = e || ("document"in self ? document.currentScript.src : "") || location.href;
    if (s[t])
        return;
    let o = {};
    const d = e=>i(e, t)
        , l = {
        module: {
            uri: t
        },
        exports: o,
        require: d
    };
    s[t] = Promise.all(n.map((e=>l[e] || d(e)))).then((e=>(r(...e),
    o)))
}
}

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force the waiting service worker to become the active service worker
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
    cleanupOutdatedCaches();
    console.log('Service Worker is active');
});

self.addEventListener("message", ( e => {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting()
}))

// Show notification
self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push received...');
    console.log(data)
    self.registration.showNotification(data.title, {
        body: data.body,
        badge: './icons/badge.png',
        icon: './icons/logo-rounded512.png',
        image: data?.image,
        actions: data?.link ? [
            {
                title: "View",
                action: "view",
            },
        ]
        : data?.actions ? data.actions : [],
        data: {
            url: data?.link
        }
    });
})

// Notification click event
self.addEventListener('notificationclick', e => {
    const notification = e.notification;
    const action = e.action;
    const link = notification.data.url;
    if (action === 'view') {
        if (link) {
            clients.openWindow('https://app.emplorex.com' + link);
        } else {
            clients.openWindow('https://app.emplorex.com');
        }
        notification.close();
    } else {
        clients.openWindow('https://app.emplorex.com');
        notification.close();
    }
})