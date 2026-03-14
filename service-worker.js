const CACHE_NAME = "meandu-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=3",
  "./script.js?v=3",
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
  const request = event.request;
  const isHtmlRequest = request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html");

  if (isHtmlRequest) {
    event.respondWith(
      fetch(request)
        .then(function(networkResponse){
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache){
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(function(){
          return caches.match(request).then(function(cachedResponse){
            return cachedResponse || caches.match("./index.html");
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function(cachedResponse){
      if(cachedResponse){
        return cachedResponse;
      }

      return fetch(request).then(function(networkResponse){
        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque"){
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(request, responseClone);
        });

        return networkResponse;
      });
    })
  );
});
