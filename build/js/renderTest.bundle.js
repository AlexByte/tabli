webpackJsonp([2],[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t["default"]=e,t}function i(e){var t=e.tabItems.map(function(e){return new p.TabItem(e)});e.tabItems=v.Seq(t);var n=new p.TabWindow(e);return n}function s(e){var t=e.allWindows,n=t.map(i),r=new g["default"],o=chrome.extension.getBackgroundPage(),s=o.renderTestSavedHTML,a=r.registerTabWindows(n);console.log("Created mockWinStore and registered test windows"),console.log("mock winStore: ",a.toJS());var l=performance.now(),u=document.getElementById("windowList-region");if(L&&L.start(),s){console.log("Got saved HTML, setting..."),u.innerHTML=s;var c=performance.now();console.log("time to set initial HTML: ",c-l)}var d=f.createElement(y.TabMan,{winStore:a,noListener:!0});f.render(d,u);var v=performance.now();L&&L.stop(),console.log("initial render complete. render time: (",v-l," ms)"),L&&(console.log("inclusive:"),L.printInclusive(),console.log("exclusive:"),L.printExclusive(),console.log("wasted:"),L.printWasted()),console.log("After rendering, parentNode: ",u);var h=f.renderToString(d);o.renderTestSavedHTML=h}function a(e){var t=new XMLHttpRequest;t.open("GET",b,!0),t.onload=function(){if(t.status>=200&&t.status<400){var n=JSON.parse(t.responseText);e(n)}else console.error("request failed, error: ",t.status,t)},t.send()}function l(){a(s)}function u(){window.onload=l}var c=n(159),f=o(c),d=n(4),v=o(d),h=n(5),p=o(h),m=n(1),g=r(m),w=n(2),_=(o(w),n(176)),y=o(_),L=(n(7),c.addons.PureRenderMixin,c.addons.Perf),b="testData/winSnap.json";u()}]);