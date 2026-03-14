const CACHE_NAME = "meandu-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=2",
  "./script.js?v=2",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys
          .filter(function(key){
            return key !== CACHE_NAME;
          })
          .map(function(key){
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event){
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse){
      if(cachedResponse){
        return cachedResponse;
      }

      return fetch(event.request).then(function(networkResponse){
        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque"){
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      });
    })
  );
});
