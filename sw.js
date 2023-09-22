importScripts('js/sw-utils.js');
const STATIC_CACHE='static-v1';
const DYNAMIC_CACHE='dynamic-v1'
const INMUTABLE_CACHE='inmutable-v1'


const APP_Shell=['/',
'/index.html',
'css/style.css',
'img/favicon.ico',
'img/avatars/hulk.jpg',
'img/avatars/ironman.jpg',
'img/avatars/spiderman.jpg',
'img/avatars/thor.jpg',
'img/avatars/wolverine.jpg',
'js/app.js'
]
const APP_Shell_INMUTABLE=['https://fonts.googleapis.com/css?family=Quicksand:300,400',
'https://fonts.googleapis.com/css?family=Lato:400,300',
'css/animate.css',
'js/libs/jquery.js'];
self.addEventListener('install',e=>{
    const cacheStatic=caches.open(STATIC_CACHE).then(cache=>cache.addAll(APP_Shell))
    const cacheInmutable=caches.open(INMUTABLE_CACHE).then(cache=>cache.addAll(APP_Shell_INMUTABLE))
     const respuesta=Promise.all([cacheStatic,cacheInmutable]).catch(console.log);
    
    e.waitUntil(respuesta);
})

self.addEventListener('active',e=>{
    caches.keys().then(keys=>{
        keys.map(key=>{
            if(key!==STATIC_CACHE && key.includes('static'))
            return caches.delete(key);
        })
    })
})

self.addEventListener('fetch',e=>{
    const respuesta=caches.match(e.request).then(res=>{
        if(res) return res;else
        return fetch(e.request)
        .then(newRes=> actualizaCacheDinamico(DYNAMIC_CACHE,e.request,newRes))
        
    })
    e.respondWith(respuesta);
})