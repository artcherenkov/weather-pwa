const CACHE_PREFIX = `weather-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const self = this;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `index.html`,
          `images/logo.png`,
          'offline.html'
        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => {
          if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
          .filter((key) => key !== null)
      ))
  );
});

const handleFetch = (evt) => {
  const {request} = evt;

  evt.respondWith(
    caches.match(request)
      .then(() => {
        return fetch(evt.request)
          .catch(() => caches.match('offline.html'))
      })
  );
};

self.addEventListener(`fetch`, handleFetch);
