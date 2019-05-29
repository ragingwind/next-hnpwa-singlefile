importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

workbox.routing.registerRoute(
	new RegExp(/^http[s|]?.*/),
	new workbox.strategies.NetworkFirst()
);
