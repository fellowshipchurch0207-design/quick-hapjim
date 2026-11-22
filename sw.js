// 퀵 합짐 서비스 워커: 공유받은 스크린샷을 앱으로 넘겨줌 (앱 화면은 저장하지 않음)
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method==='POST'&&u.pathname.endsWith('/share-target')){
    e.respondWith((async()=>{
      const f=await e.request.formData(),c=await caches.open('qh-share');
      const img=f.get('image'),txt=[f.get('title'),f.get('text')].filter(Boolean).join(' ');
      await c.delete('img');await c.delete('txt');
      if(img&&img.size)await c.put('img',new Response(img,{headers:{'content-type':img.type||'image/png'}}));
      if(txt)await c.put('txt',new Response(txt));
      return Response.redirect('./?shared='+Date.now(),303);
    })());
  }
});
