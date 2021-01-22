const cacheName = 'cache-v1';
self.addEventListener('install', (event) => {
    self.skipWaiting()
    event.waitUntil(caches.open(cacheName).then(cache => {
        cache.addAll([
            '/',
            '/assets/touch-icon-iphone.png',
            '/assets/minima-social-icons.svg',
            '/assets/css/style.css',
            'https://utteranc.es/client.js',
            'https://utteranc.es/stylesheets/themes/github-light/utterances.css',
            'https://utteranc.es/utterances.html',
        ])
    }
    ))
});
self.addEventListener('activate', (event) => {
  var cacheKeeplist = ['v1'];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        let responseClone = response.clone();
        caches.open(cacheName).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      })
    }
  }));
});
