const CACHE_NAME = 'walt-quotes-shell-v53';
const APP_SHELL = [
  './index.html',
  './assets/app.html',
  './assets/og-image.jpg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(APP_SHELL);
  }).then(function() {
    return self.skipWaiting();
  }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key) {
      return key !== CACHE_NAME;
    }).map(function(key) {
      return caches.delete(key);
    }));
  }).then(function() {
    return self.clients.claim();
  }));
});

self.addEventListener('push', function(event) {
  var title = 'Daily Quotes by Walt Grayum';
  var body = "Today's quote is ready";
  var url = '/';
  if (event.data) {
    try {
      var payload = event.data.json();
      if (payload) {
        if (payload.title) title = payload.title;
        if ('body' in payload) body = payload.body;
        if (payload.url) url = payload.url;
      }
    } catch (e) {
      try {
        var text = event.data.text();
        if (text) body = text;
      } catch (e2) {}
    }
  }
  event.waitUntil(self.registration.showNotification(title, {
    body: body,
    icon: './icon-192.png',
    data: { url: url }
  }));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var target = (event.notification.data && event.notification.data.url) || '/';
  var targetUrl = new URL(target, self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
    for (var i = 0; i < windowClients.length; i++) {
      var client = windowClients[i];
      if (client.url.indexOf(self.location.origin) === 0 && 'focus' in client) {
        if ('navigate' in client && client.url !== targetUrl) {
          return client.navigate(targetUrl).then(function(navigated) {
            return (navigated || client).focus();
          }).catch(function() {
            return client.focus();
          });
        }
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    return null;
  }));
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(function(cached) {
    if (cached) return cached;
    return fetch(event.request).then(function(response) {
      if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
      }
      return response;
    }).catch(function() {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      throw new Error('Offline resource unavailable');
    });
  }));
});
