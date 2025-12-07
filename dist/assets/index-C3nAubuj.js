import{r as A,a as Zg,g as ep,R as Du,u as Pu,b as tp,c as rp,L as or,N as Eo,B as sp,d as np,e as er}from"./react-vendor-Dou2_yf_.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();var $u={exports:{}},ki={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ap=A,ip=Symbol.for("react.element"),op=Symbol.for("react.fragment"),lp=Object.prototype.hasOwnProperty,cp=ap.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,dp={key:!0,ref:!0,__self:!0,__source:!0};function Mu(r,e,t){var s,a={},i=null,l=null;t!==void 0&&(i=""+t),e.key!==void 0&&(i=""+e.key),e.ref!==void 0&&(l=e.ref);for(s in e)lp.call(e,s)&&!dp.hasOwnProperty(s)&&(a[s]=e[s]);if(r&&r.defaultProps)for(s in e=r.defaultProps,e)a[s]===void 0&&(a[s]=e[s]);return{$$typeof:ip,type:r,key:i,ref:l,props:a,_owner:cp.current}}ki.Fragment=op;ki.jsx=Mu;ki.jsxs=Mu;$u.exports=ki;var n=$u.exports,jo={},Bc=Zg;jo.createRoot=Bc.createRoot,jo.hydrateRoot=Bc.hydrateRoot;const up={},qc=r=>{let e;const t=new Set,s=(m,x)=>{const b=typeof m=="function"?m(e):m;if(!Object.is(b,e)){const I=e;e=x??(typeof b!="object"||b===null)?b:Object.assign({},e,b),t.forEach(N=>N(e,I))}},a=()=>e,d={setState:s,getState:a,getInitialState:()=>h,subscribe:m=>(t.add(m),()=>t.delete(m)),destroy:()=>{(up?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),t.clear()}},h=e=r(s,a,d);return d},hp=r=>r?qc(r):qc;var Ou={exports:{}},Vu={},Lu={exports:{}},Fu={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ys=A;function mp(r,e){return r===e&&(r!==0||1/r===1/e)||r!==r&&e!==e}var gp=typeof Object.is=="function"?Object.is:mp,pp=Ys.useState,fp=Ys.useEffect,xp=Ys.useLayoutEffect,yp=Ys.useDebugValue;function bp(r,e){var t=e(),s=pp({inst:{value:t,getSnapshot:e}}),a=s[0].inst,i=s[1];return xp(function(){a.value=t,a.getSnapshot=e,io(a)&&i({inst:a})},[r,t,e]),fp(function(){return io(a)&&i({inst:a}),r(function(){io(a)&&i({inst:a})})},[r]),yp(t),t}function io(r){var e=r.getSnapshot;r=r.value;try{var t=e();return!gp(r,t)}catch{return!0}}function vp(r,e){return e()}var wp=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?vp:bp;Fu.useSyncExternalStore=Ys.useSyncExternalStore!==void 0?Ys.useSyncExternalStore:wp;Lu.exports=Fu;var _p=Lu.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ni=A,kp=_p;function Np(r,e){return r===e&&(r!==0||1/r===1/e)||r!==r&&e!==e}var Ep=typeof Object.is=="function"?Object.is:Np,jp=kp.useSyncExternalStore,Ip=Ni.useRef,Tp=Ni.useEffect,Sp=Ni.useMemo,Ap=Ni.useDebugValue;Vu.useSyncExternalStoreWithSelector=function(r,e,t,s,a){var i=Ip(null);if(i.current===null){var l={hasValue:!1,value:null};i.current=l}else l=i.current;i=Sp(function(){function d(I){if(!h){if(h=!0,m=I,I=s(I),a!==void 0&&l.hasValue){var N=l.value;if(a(N,I))return x=N}return x=I}if(N=x,Ep(m,I))return N;var T=s(I);return a!==void 0&&a(N,T)?(m=I,N):(m=I,x=T)}var h=!1,m,x,b=t===void 0?null:t;return[function(){return d(e())},b===null?void 0:function(){return d(b())}]},[e,t,s,a]);var c=jp(r,i[0],i[1]);return Tp(function(){l.hasValue=!0,l.value=c},[c]),Ap(c),c};Ou.exports=Vu;var Cp=Ou.exports;const Rp=ep(Cp),Uu={},{useDebugValue:Dp}=Du,{useSyncExternalStoreWithSelector:Pp}=Rp;let Wc=!1;const $p=r=>r;function Mp(r,e=$p,t){(Uu?"production":void 0)!=="production"&&t&&!Wc&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Wc=!0);const s=Pp(r.subscribe,r.getState,r.getServerState||r.getInitialState,e,t);return Dp(s),s}const Op=r=>{(Uu?"production":void 0)!=="production"&&typeof r!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const e=typeof r=="function"?hp(r):r,t=(s,a)=>Mp(e,s,a);return Object.assign(t,e),t},el=r=>Op,Vp={};function Lp(r,e){let t;try{t=r()}catch{return}return{getItem:a=>{var i;const l=d=>d===null?null:JSON.parse(d,void 0),c=(i=t.getItem(a))!=null?i:null;return c instanceof Promise?c.then(l):l(c)},setItem:(a,i)=>t.setItem(a,JSON.stringify(i,void 0)),removeItem:a=>t.removeItem(a)}}const Ln=r=>e=>{try{const t=r(e);return t instanceof Promise?t:{then(s){return Ln(s)(t)},catch(s){return this}}}catch(t){return{then(s){return this},catch(s){return Ln(s)(t)}}}},Fp=(r,e)=>(t,s,a)=>{let i={getStorage:()=>localStorage,serialize:JSON.stringify,deserialize:JSON.parse,partialize:E=>E,version:0,merge:(E,P)=>({...P,...E}),...e},l=!1;const c=new Set,d=new Set;let h;try{h=i.getStorage()}catch{}if(!h)return r((...E)=>{console.warn(`[zustand persist middleware] Unable to update item '${i.name}', the given storage is currently unavailable.`),t(...E)},s,a);const m=Ln(i.serialize),x=()=>{const E=i.partialize({...s()});let P;const O=m({state:E,version:i.version}).then(C=>h.setItem(i.name,C)).catch(C=>{P=C});if(P)throw P;return O},b=a.setState;a.setState=(E,P)=>{b(E,P),x()};const I=r((...E)=>{t(...E),x()},s,a);let N;const T=()=>{var E;if(!h)return;l=!1,c.forEach(O=>O(s()));const P=((E=i.onRehydrateStorage)==null?void 0:E.call(i,s()))||void 0;return Ln(h.getItem.bind(h))(i.name).then(O=>{if(O)return i.deserialize(O)}).then(O=>{if(O)if(typeof O.version=="number"&&O.version!==i.version){if(i.migrate)return i.migrate(O.state,O.version);console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return O.state}).then(O=>{var C;return N=i.merge(O,(C=s())!=null?C:I),t(N,!0),x()}).then(()=>{P==null||P(N,void 0),l=!0,d.forEach(O=>O(N))}).catch(O=>{P==null||P(void 0,O)})};return a.persist={setOptions:E=>{i={...i,...E},E.getStorage&&(h=E.getStorage())},clearStorage:()=>{h==null||h.removeItem(i.name)},getOptions:()=>i,rehydrate:()=>T(),hasHydrated:()=>l,onHydrate:E=>(c.add(E),()=>{c.delete(E)}),onFinishHydration:E=>(d.add(E),()=>{d.delete(E)})},T(),N||I},Up=(r,e)=>(t,s,a)=>{let i={storage:Lp(()=>localStorage),partialize:T=>T,version:0,merge:(T,E)=>({...E,...T}),...e},l=!1;const c=new Set,d=new Set;let h=i.storage;if(!h)return r((...T)=>{console.warn(`[zustand persist middleware] Unable to update item '${i.name}', the given storage is currently unavailable.`),t(...T)},s,a);const m=()=>{const T=i.partialize({...s()});return h.setItem(i.name,{state:T,version:i.version})},x=a.setState;a.setState=(T,E)=>{x(T,E),m()};const b=r((...T)=>{t(...T),m()},s,a);a.getInitialState=()=>b;let I;const N=()=>{var T,E;if(!h)return;l=!1,c.forEach(O=>{var C;return O((C=s())!=null?C:b)});const P=((E=i.onRehydrateStorage)==null?void 0:E.call(i,(T=s())!=null?T:b))||void 0;return Ln(h.getItem.bind(h))(i.name).then(O=>{if(O)if(typeof O.version=="number"&&O.version!==i.version){if(i.migrate)return[!0,i.migrate(O.state,O.version)];console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return[!1,O.state];return[!1,void 0]}).then(O=>{var C;const[M,ee]=O;if(I=i.merge(ee,(C=s())!=null?C:b),t(I,!0),M)return m()}).then(()=>{P==null||P(I,void 0),I=s(),l=!0,d.forEach(O=>O(I))}).catch(O=>{P==null||P(void 0,O)})};return a.persist={setOptions:T=>{i={...i,...T},T.storage&&(h=T.storage)},clearStorage:()=>{h==null||h.removeItem(i.name)},getOptions:()=>i,rehydrate:()=>N(),hasHydrated:()=>l,onHydrate:T=>(c.add(T),()=>{c.delete(T)}),onFinishHydration:T=>(d.add(T),()=>{d.delete(T)})},i.skipHydration||N(),I||b},Bp=(r,e)=>"getStorage"in e||"serialize"in e||"deserialize"in e?((Vp?"production":void 0)!=="production"&&console.warn("[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead."),Fp(r,e)):Up(r,e),tl=Bp,xs={memecoins:{label:"Мемкоины",accent:"emerald",icon:"rocket"},futures:{label:"Фьючерсы",accent:"blue",icon:"line"},nft:{label:"NFT",accent:"purple",icon:"image"},spot:{label:"Спот",accent:"amber",icon:"coins"},polymarket:{label:"PolyMarket",accent:"pink",icon:"barchart"},staking:{label:"Стейкинг",accent:"indigo",icon:"shield"},other:{label:"Другое",accent:"gray",icon:"sparkles"}},Ne=[{id:"1",name:"Артём",login:"artyom03",password:"248artdex",avatar:"/avatars/artyom.jpg"},{id:"2",name:"Адель",login:"adel05",password:"058adeldex",avatar:"/avatars/adel.jpg"},{id:"3",name:"Ксения",login:"ksen03",password:"907ksendex",avatar:"/avatars/kseniya.jpg"},{id:"4",name:"Ольга",login:"olga04",password:"638olgadex",avatar:"/avatars/olga.jpg"},{id:"5",name:"Анастасия",login:"anastasia05",password:"638anastadex",avatar:"/avatars/anastasia.jpg"}],ei={trading:{label:"Торговля",icon:"candles",color:"green"},learning:{label:"Обучение",icon:"book",color:"blue"},technical:{label:"ТЧ",icon:"cpu",color:"purple"},stream:{label:"Стрим",icon:"broadcast",color:"red"},research:{label:"Изучение",icon:"flask",color:"yellow"},organization:{label:"Ресёрч",icon:"clipboard",color:"indigo"}},Fn={pending:{label:"Проверка",color:"yellow"},in_progress:{label:"В работе",color:"blue"},completed:{label:"Выполнена",color:"green"},closed:{label:"Закрыта",color:"gray"},rejected:{label:"Отклонена",color:"red"}},At=el()(tl(r=>({user:null,isAuthenticated:!1,login:(e,t)=>{const s=Ne.find(a=>a.login===e&&a.password===t);return s?(r({user:s,isAuthenticated:!0}),!0):!1},logout:()=>r({user:null,isAuthenticated:!1})}),{name:"apevault-auth"})),qp="9119ApeVault",Vt=el()(tl(r=>({isAdmin:!1,activateAdmin:e=>e===qp?(r({isAdmin:!0}),!0):!1,deactivateAdmin:()=>r({isAdmin:!1})}),{name:"apevault-admin"})),Ze=el()(tl(r=>({theme:"light",toggleTheme:()=>r(e=>{const t=e.theme==="light"?"dark":"light";return document.body.classList.toggle("dark",t==="dark"),{theme:t}}),setTheme:e=>r(()=>(document.body.classList.toggle("dark",e==="dark"),{theme:e}))}),{name:"apevault-theme"}));/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Wp={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zp=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),ie=(r,e)=>{const t=A.forwardRef(({color:s="currentColor",size:a=24,strokeWidth:i=2,absoluteStrokeWidth:l,className:c="",children:d,...h},m)=>A.createElement("svg",{ref:m,...Wp,width:a,height:a,stroke:s,strokeWidth:l?Number(i)*24/Number(a):i,className:["lucide",`lucide-${zp(r)}`,c].join(" "),...h},[...e.map(([x,b])=>A.createElement(x,b)),...Array.isArray(d)?d:[d]]));return t.displayName=`${r}`,t};/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hp=ie("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rl=ie("AlarmClock",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M12 9v4l2 2",key:"1c63tq"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sl=ie("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gp=ie("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kp=ie("Archive",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=ie("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ei=ie("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Io=ie("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zc=ie("CalendarCheck",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"m9 16 2 2 4-4",key:"19s6y9"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qp=ie("CalendarClock",[["path",{d:"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",key:"1osxxc"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M3 10h5",key:"r794hk"}],["path",{d:"M17.5 17.5 16 16.25V14",key:"re2vv1"}],["path",{d:"M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",key:"ame013"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pr=ie("Calendar",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yp=ie("CandlestickChart",[["path",{d:"M9 5v4",key:"14uxtq"}],["rect",{width:"4",height:"6",x:"7",y:"9",rx:"1",key:"f4fvz0"}],["path",{d:"M9 15v2",key:"r5rk32"}],["path",{d:"M17 3v2",key:"1l2re6"}],["rect",{width:"4",height:"8",x:"15",y:"5",rx:"1",key:"z38je5"}],["path",{d:"M17 13v3",key:"5l0wba"}],["path",{d:"M3 3v18h18",key:"1s2lah"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ji=ie("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dr=ie("CheckSquare",[["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}],["path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",key:"1jnkn4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vs=ie("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sn=ie("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hc=ie("CircleDot",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xp=ie("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bu=ie("Clock3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16.5 12",key:"1aq6pp"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ea=ie("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ta=ie("Coins",[["circle",{cx:"8",cy:"8",r:"6",key:"3yglwk"}],["path",{d:"M18.09 10.37A6 6 0 1 1 10.34 18",key:"t5s6rm"}],["path",{d:"M7 6h1v4",key:"1obek4"}],["path",{d:"m16.71 13.88.7.71-2.82 2.82",key:"1rbuyh"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const To=ie("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jp=ie("Cpu",[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"9",y:"9",width:"6",height:"6",key:"o3kz5p"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ra=ie("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zp=ie("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qu=ie("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ef=ie("Feather",[["path",{d:"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z",key:"u4sw5n"}],["line",{x1:"16",x2:"2",y1:"8",y2:"22",key:"1c47m2"}],["line",{x1:"17.5",x2:"9",y1:"15",y2:"15",key:"2fj3pr"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wu=ie("FileText",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"16",x2:"8",y1:"13",y2:"13",key:"14keom"}],["line",{x1:"16",x2:"8",y1:"17",y2:"17",key:"17nazh"}],["line",{x1:"10",x2:"8",y1:"9",y2:"9",key:"1a5vjj"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zu=ie("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hu=ie("Flame",[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tf=ie("FlaskConical",[["path",{d:"M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",key:"pzvekw"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rf=ie("Gauge",[["path",{d:"m12 14 4-4",key:"9kzdfg"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0",key:"19p75a"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sf=ie("HeartPulse",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",key:"1uw2ng"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nf=ie("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ii=ie("HelpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sa=ie("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ur=ie("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const af=ie("Key",[["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["path",{d:"m15.5 7.5 3 3L22 7l-3-3",key:"1rn1fs"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const of=ie("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lf=ie("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const na=ie("LineChart",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gc=ie("List",[["line",{x1:"8",x2:"21",y1:"6",y2:"6",key:"7ey8pc"}],["line",{x1:"8",x2:"21",y1:"12",y2:"12",key:"rjfblc"}],["line",{x1:"8",x2:"21",y1:"18",y2:"18",key:"c3b1m8"}],["line",{x1:"3",x2:"3.01",y1:"6",y2:"6",key:"1g7gq3"}],["line",{x1:"3",x2:"3.01",y1:"12",y2:"12",key:"1pjlvk"}],["line",{x1:"3",x2:"3.01",y1:"18",y2:"18",key:"28t2mc"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kc=ie("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cf=ie("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const df=ie("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uf=ie("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gu=ie("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nl=ie("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hf=ie("MoreVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mf=ie("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",key:"1xcu5"}],["circle",{cx:"17.5",cy:"10.5",r:".5",key:"736e4u"}],["circle",{cx:"8.5",cy:"7.5",r:".5",key:"clrty"}],["circle",{cx:"6.5",cy:"12.5",r:".5",key:"1s4xz9"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qc=ie("PenLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"ymcmye"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zt=ie("PenSquare",[["path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1qinfi"}],["path",{d:"M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z",key:"w2jsv5"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yc=ie("Pen",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ku=ie("PieChart",[["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}],["path",{d:"M22 12A10 10 0 0 0 12 2v10z",key:"1rfc4y"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xc=ie("PiggyBank",[["path",{d:"M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z",key:"uf6l00"}],["path",{d:"M2 9v1c0 1.1.9 2 2 2h1",key:"nm575m"}],["path",{d:"M16 11h0",key:"k2aug8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qu=ie("Plane",[["path",{d:"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",key:"1v9wt8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yu=ie("PlusCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Un=ie("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xu=ie("Radio",[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9",key:"1vaf9d"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5",key:"u1ii0m"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5",key:"1j5fej"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19",key:"10b0cb"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gf=ie("RefreshCcw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aa=ie("Rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pf=ie("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ff=ie("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jc=ie("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const al=ie("ShieldCheck",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kt=ie("Shield",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zc=ie("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bt=ie("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xf=ie("StickyNote",[["path",{d:"M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z",key:"1wis1t"}],["path",{d:"M15 3v6h6",key:"edgan2"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ju=ie("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ed=ie("Table2",[["path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",key:"gugj83"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yf=ie("Tag",[["path",{d:"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z",key:"14b2ls"}],["path",{d:"M7 7h.01",key:"7u93v4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zu=ie("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const It=ie("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ws=ie("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xs=ie("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ln=ie("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bf=ie("Wallet2",[["path",{d:"M17 14h.01",key:"7oqj8z"}],["path",{d:"M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14",key:"u1rqew"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vf=ie("Wallet",[["path",{d:"M21 12V7H5a2 2 0 0 1 0-4h14v4",key:"195gfw"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h16v-5",key:"195n9w"}],["path",{d:"M18 12a2 2 0 0 0 0 4h4v-4Z",key:"vllfpd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wf=ie("Wand2",[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z",key:"1bcowg"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eh=ie("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xt=ie("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ti=ie("Zap",[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2",key:"45s27k"}]]),th="/assets/logo-D0_tMQfC.png",_f=()=>{const[r,e]=A.useState("member"),[t,s]=A.useState(""),[a,i]=A.useState(""),[l,c]=A.useState(""),{login:d,user:h,isAuthenticated:m}=At(),{theme:x,toggleTheme:b}=Ze(),{activateAdmin:I}=Vt(),N=Pu(),[T]=tp();A.useEffect(()=>{document.body.classList.toggle("dark",x==="dark")},[x]),A.useEffect(()=>{var O,C,M;if(m&&h){N("/management");return}if((O=window.Telegram)!=null&&O.WebApp){window.Telegram.WebApp.ready(),window.Telegram.WebApp.expand();const Z=T.get("tgWebAppData")||window.Telegram.WebApp.initData,j=T.get("login"),y=T.get("password");if(j&&y&&d(j,y)){N("/management");return}if(Z)try{const _=new URLSearchParams(Z).get("user");if(_){const p=JSON.parse(decodeURIComponent(_)).id;sessionStorage.setItem("telegram_user_id",String(p));const $=localStorage.getItem("apevault-auth");if($)try{const q=JSON.parse($);if((C=q.state)!=null&&C.user){const se=q.state.user;if(d(se.login,se.password)){N("/management");return}}}catch(q){console.error("Error parsing saved auth:",q)}console.log("Telegram Mini App detected, user ID:",p)}}catch(f){console.error("Error parsing Telegram initData:",f)}const v=(M=window.Telegram.WebApp.initDataUnsafe)==null?void 0:M.user;v&&(sessionStorage.setItem("telegram_user_id",String(v.id)),console.log("Telegram user detected:",v.first_name))}},[T,m,h,N,d]);const E=O=>{if(O.preventDefault(),c(""),!a){c("Пожалуйста, введите пароль");return}if(r==="admin")I(a)?N("/management"):c("Неверный пароль администратора");else{if(!t){c("Пожалуйста, введите логин");return}d(t,a)?N("/management"):c("Неверный логин или пароль")}},P=()=>{b()};return n.jsxs("div",{className:`min-h-screen relative overflow-hidden ${x==="dark"?"bg-[#0b0f17]":"bg-gradient-to-br from-slate-50 via-white to-slate-100"}`,children:[n.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[n.jsx("div",{className:"absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4E6E49]/35 via-emerald-400/22 to-transparent blur-[110px]"}),n.jsx("div",{className:"absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-blue-500/24 via-purple-500/22 to-transparent blur-[140px]"}),n.jsx("div",{className:"absolute bottom-[-200px] right-[-80px] w-[620px] h-[620px] bg-gradient-to-tr from-amber-400/18 via-[#4E6E49]/18 to-transparent blur-[120px]"}),n.jsx("div",{className:"floating-grid opacity-75 dark:opacity-45"})]}),n.jsx("div",{className:"relative z-10 max-w-6xl mx-auto px-4 lg:px-6 min-h-screen flex items-center justify-center py-10",children:n.jsxs("div",{className:"glass-panel rounded-[28px] p-4 sm:p-6 md:p-8 border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden w-full",children:[n.jsx("div",{className:"accent-dots"}),n.jsxs("div",{className:"relative z-10 grid md:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 items-stretch",children:[n.jsxs("div",{className:"section-card rounded-2xl p-6 lg:p-7 border border-white/60 dark:border-white/10 shadow-xl flex flex-col items-center text-center gap-4",children:[n.jsx("div",{className:"p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg",children:n.jsx("img",{src:th,alt:"ApeVault Logo",className:"w-16 h-16 object-contain"})}),n.jsxs("div",{className:"space-y-1",children:[n.jsx("p",{className:`text-xs uppercase tracking-[0.16em] ${x==="dark"?"text-gray-400":"text-gray-500"}`,children:"ApeVault Black Ops"}),n.jsx("h1",{className:`text-3xl lg:text-4xl font-extrabold ${x==="dark"?"text-white":"text-gray-900"}`,children:"Командная панель"})]}),n.jsxs("div",{className:"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#4E6E49]/15 to-emerald-500/10 text-[#4E6E49] text-xs font-semibold",children:[n.jsx(Kt,{className:"w-4 h-4"}),"Защищенный доступ"]}),n.jsxs("div",{className:`w-full mt-4 rounded-xl border ${x==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white/80"} p-4 text-left space-y-3`,children:[n.jsxs("div",{className:"flex items-center gap-2 text-sm font-semibold",children:[n.jsx(Kt,{className:"w-4 h-4 text-[#4E6E49]"}),n.jsx("span",{className:x==="dark"?"text-white":"text-gray-900",children:"Правила и доступ"})]}),n.jsxs("ul",{className:`text-xs leading-relaxed space-y-1 ${x==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx("li",{children:"• Пользуемся данными из бота: логин + пароль."}),n.jsx("li",{children:"• Админ пароль: только для доверенных (режим администратора)."}),n.jsxs("li",{children:["• Правила: ",n.jsx("a",{className:"text-[#4E6E49] font-semibold",href:"https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20",target:"_blank",rel:"noreferrer",children:"читать"}),"."]})]}),n.jsxs("div",{className:`text-xs ${x==="dark"?"text-gray-400":"text-gray-600"}`,children:["Администратор: ",n.jsx("span",{className:"font-semibold",children:"@artyommedoed"})]})]})]}),n.jsxs("div",{className:"section-card rounded-2xl p-6 lg:p-7 border border-white/60 dark:border-white/10 shadow-xl",children:[n.jsxs("div",{className:"flex items-center justify-between mb-6",children:[n.jsxs("div",{children:[n.jsx("p",{className:`text-xs uppercase tracking-[0.12em] ${x==="dark"?"text-gray-400":"text-gray-500"}`,children:"Доступ"}),n.jsx("h2",{className:`text-2xl font-extrabold ${x==="dark"?"text-white":"text-gray-900"}`,children:"Вход в систему"})]}),n.jsx("button",{onClick:P,className:"nav-chip px-3 py-2","data-active":"false","aria-label":"Toggle theme",children:x==="dark"?n.jsx(Ju,{className:"w-5 h-5 text-amber-300"}):n.jsx(nl,{className:"w-5 h-5 text-gray-700"})})]}),n.jsxs("form",{onSubmit:E,className:"space-y-5",children:[n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-semibold mb-3 ${x==="dark"?"text-gray-300":"text-gray-700"}`,children:"Тип пользователя"}),n.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[n.jsxs("button",{type:"button",onClick:()=>{e("member"),s(""),i(""),c("")},className:"pill justify-center","data-active":r==="member",children:[n.jsx(ln,{className:"w-5 h-5"}),n.jsx("span",{children:"Участник"})]}),n.jsxs("button",{type:"button",onClick:()=>{e("admin"),s(""),i(""),c("")},className:"pill justify-center","data-active":r==="admin",children:[n.jsx(Kt,{className:"w-5 h-5"}),n.jsx("span",{children:"Админ"})]})]})]}),r==="member"&&n.jsxs("div",{children:[n.jsxs("label",{htmlFor:"login",className:`block text-sm font-semibold mb-2 ${x==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx(Xs,{className:"w-4 h-4 inline mr-2"}),"Логин"]}),n.jsx("div",{className:"flex items-center gap-2",children:n.jsx("input",{id:"login",type:"text",value:t,onChange:O=>s(O.target.value),className:`w-full px-4 py-3 rounded-xl border transition-all ${x==="dark"?"bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4E6E49]":"bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]"} focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/20`,placeholder:"Введите ваш логин",autoComplete:"username"})})]}),n.jsxs("div",{children:[n.jsxs("label",{htmlFor:"password",className:`block text-sm font-semibold mb-2 ${x==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx(Kt,{className:"w-4 h-4 inline mr-2"}),"Пароль"]}),n.jsx("input",{id:"password",type:"password",value:a,onChange:O=>i(O.target.value),className:`w-full px-4 py-3 rounded-xl border transition-all ${x==="dark"?"bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4E6E49]":"bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]"} focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/20`,placeholder:r==="admin"?"Введите пароль администратора":"Введите ваш пароль",autoComplete:r==="admin"?"off":"current-password"}),r==="admin"&&n.jsx("p",{className:`mt-2 text-xs ${x==="dark"?"text-gray-400":"text-gray-500"}`,children:"Для входа в режим администратора требуется специальный пароль"})]}),l&&n.jsx("div",{className:`p-4 rounded-xl border ${x==="dark"?"bg-red-500/15 border-red-500/40 text-red-300":"bg-red-50 border-red-300 text-red-700"} text-sm font-semibold animate-shake`,children:l}),n.jsx("button",{type:"submit",className:"w-full py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white",children:"Войти в систему"})]}),n.jsxs("div",{className:`mt-6 pt-6 border-t ${x==="dark"?"border-white/10":"border-gray-200"} flex items-center justify-between gap-3 flex-wrap`,children:[n.jsx("div",{className:`text-xs ${x==="dark"?"text-gray-400":"text-gray-600"}`,children:"Защищенная система для команды ApeVault"}),n.jsxs("button",{type:"button",onClick:()=>N("/faq"),className:"inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-transparent bg-white/70 hover:bg-white shadow-sm transition-colors dark:bg-white/10 dark:hover:bg-white/20 dark:text-white text-gray-800",children:[n.jsx(Ii,{className:"w-4 h-4"}),"FAQ",n.jsx(Nt,{className:"w-3.5 h-3.5 opacity-80"})]})]})]})]})]})})]})},sr=({children:r})=>{const{theme:e,toggleTheme:t}=Ze(),{isAdmin:s}=Vt(),a=rp(),[i,l]=A.useState(!1),[c,d]=A.useState(!1),h=[{path:"/management",label:"Расписание",icon:Pr},{path:"/earnings",label:"Заработок",icon:ra},{path:"/tasks",label:"Задачи",icon:Dr},{path:"/rating",label:"Рейтинг",icon:ws}],m=[{path:"/faq",label:"FAQ",icon:Ii},{path:"/about",label:"О сообществе",icon:ur}],x=h.some(N=>a.pathname===N.path),b=N=>a.pathname===N,I=m.some(N=>a.pathname===N.path);return A.useEffect(()=>{l(!1),d(!1)},[a.pathname]),n.jsxs("div",{className:"app-shell",children:[n.jsxs("div",{className:"absolute inset-0 pointer-events-none -z-10 overflow-hidden",children:[n.jsx("div",{className:"absolute -top-24 -left-12 w-80 h-80 bg-gradient-to-br from-[#4E6E49]/25 via-transparent to-transparent blur-3xl"}),n.jsx("div",{className:"absolute top-8 right-0 w-[520px] h-[520px] bg-gradient-to-bl from-blue-500/12 via-purple-500/10 to-transparent blur-3xl"}),n.jsx("div",{className:"absolute bottom-[-120px] left-12 w-96 h-96 bg-gradient-to-tr from-amber-400/10 to-[#4E6E49]/12 blur-3xl"}),n.jsx("div",{className:"floating-grid"})]}),n.jsx("header",{className:"sticky top-0 z-50 backdrop-blur-md",children:n.jsx("div",{className:"max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-2",children:n.jsxs("div",{className:"glass-panel rounded-2xl px-4 lg:px-6 py-3 flex items-center gap-4 shadow-2xl",children:[n.jsxs("div",{className:"flex items-center gap-3 min-w-0",children:[n.jsxs("div",{className:"relative w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg overflow-hidden flex items-center justify-center",children:[n.jsx("img",{src:th,alt:"ApeVault Logo",className:"w-10 h-10 object-contain"}),n.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5"})]}),n.jsxs("div",{className:"leading-tight",children:[n.jsx("p",{className:`text-xs uppercase tracking-[0.16em] ${e==="dark"?"text-gray-400":"text-gray-500"}`,children:"ApeVault Black Ops"}),n.jsx("p",{className:`text-xl font-extrabold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Панель команды"})]})]}),n.jsxs("nav",{className:"hidden lg:flex items-center gap-2 flex-1 justify-center",children:[n.jsxs(or,{to:"/call","data-active":a.pathname==="/call",className:"nav-chip",children:[n.jsx(ti,{className:"w-4 h-4"}),n.jsx("span",{children:"Call"}),n.jsx(Nt,{className:"w-4 h-4 opacity-70"})]}),n.jsxs("div",{className:"relative",children:[n.jsxs("button",{onClick:()=>{l(!i),d(!1)},"data-active":x,className:"nav-chip",children:[n.jsx(Jc,{className:"w-4 h-4"}),n.jsx("span",{children:"Функционал"}),n.jsx(Sn,{className:`w-4 h-4 transition-transform ${i?"rotate-180":""}`})]}),i&&n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>l(!1)}),n.jsxs("div",{className:"absolute top-[calc(100%+12px)] left-0 min-w-[220px] glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden",children:[n.jsx("div",{className:"accent-dots"}),n.jsx("div",{className:"relative z-10 divide-y divide-gray-100/60 dark:divide-white/5",children:h.map(N=>n.jsxs(or,{to:N.path,onClick:()=>l(!1),className:`flex items-center gap-3 px-4 py-3 transition-colors ${b(N.path)?"bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]":e==="dark"?"hover:bg-white/5 text-gray-200":"hover:bg-gray-50 text-gray-800"}`,children:[n.jsx(N.icon,{className:"w-4 h-4 flex-shrink-0"}),n.jsx("span",{className:"font-semibold flex-1",children:N.label}),n.jsx(Nt,{className:"w-4 h-4 opacity-70"})]},N.path))})]})]})]}),n.jsxs("div",{className:"relative",children:[n.jsxs("button",{onClick:()=>{d(!c),l(!1)},"data-active":I,className:"nav-chip",children:[n.jsx(ur,{className:"w-4 h-4"}),n.jsx("span",{children:"О нас"}),n.jsx(Sn,{className:`w-4 h-4 transition-transform ${c?"rotate-180":""}`})]}),c&&n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>d(!1)}),n.jsxs("div",{className:"absolute top-[calc(100%+12px)] left-0 min-w-[220px] glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden",children:[n.jsx("div",{className:"accent-dots"}),n.jsx("div",{className:"relative z-10 divide-y divide-gray-100/60 dark:divide-white/5",children:m.map(N=>n.jsxs(or,{to:N.path,onClick:()=>d(!1),className:`flex items-center gap-3 px-4 py-3 transition-colors ${a.pathname===N.path?"bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]":e==="dark"?"hover:bg-white/5 text-gray-200":"hover:bg-gray-50 text-gray-800"}`,children:[n.jsx(N.icon,{className:"w-4 h-4 flex-shrink-0"}),n.jsx("span",{className:"font-semibold flex-1",children:N.label}),n.jsx(Nt,{className:"w-4 h-4 opacity-70"})]},N.path))})]})]})]}),n.jsxs(or,{to:"/profile","data-active":a.pathname==="/profile",className:"nav-chip",children:[n.jsx(Xs,{className:"w-4 h-4"}),n.jsx("span",{children:"ЛК"}),n.jsx(Nt,{className:"w-4 h-4 opacity-70"})]}),s&&n.jsxs(or,{to:"/admin","data-active":a.pathname==="/admin",className:"nav-chip",children:[n.jsx(Kt,{className:"w-4 h-4"}),n.jsx("span",{children:"Админ"}),n.jsx(Nt,{className:"w-4 h-4 opacity-70"})]})]}),n.jsxs("div",{className:"flex items-center gap-3 ml-auto",children:[s&&n.jsxs("div",{className:"badge-glow px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hidden md:inline-flex items-center gap-2",children:[n.jsx(Kt,{className:"w-4 h-4"}),n.jsx("span",{className:"text-sm",children:"Админ"})]}),n.jsx("button",{onClick:t,className:"nav-chip px-3 py-2","data-active":"false","aria-label":"Toggle theme",children:e==="dark"?n.jsx(Ju,{className:"w-5 h-5 text-amber-300"}):n.jsx(nl,{className:"w-5 h-5 text-gray-700"})})]})]})})}),n.jsx("main",{className:"page-shell",children:r}),n.jsx("nav",{className:"lg:hidden fixed bottom-4 left-0 right-0 px-3 z-50",children:n.jsx("div",{className:"max-w-5xl mx-auto",children:n.jsx("div",{className:"glass-panel rounded-2xl shadow-2xl border border-white/60 dark:border-white/10",children:n.jsxs("div",{className:"grid grid-cols-4 divide-x divide-white/40 dark:divide-white/5",children:[n.jsxs(or,{to:"/call",className:`flex flex-col items-center justify-center gap-1 py-3 ${a.pathname==="/call"?"text-[#4E6E49]":e==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx(ti,{className:"w-5 h-5"}),n.jsxs("div",{className:"flex items-center gap-1",children:[n.jsx("span",{className:"text-[11px] font-semibold",children:"Call"}),n.jsx(Nt,{className:"w-3 h-3 opacity-70"})]})]}),n.jsxs("button",{onClick:()=>{l(!i),d(!1)},className:`flex flex-col items-center justify-center gap-1 py-3 ${x?"text-[#4E6E49]":e==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx(Jc,{className:"w-5 h-5"}),n.jsxs("div",{className:"flex items-center gap-1",children:[n.jsx("span",{className:"text-[11px] font-semibold",children:"Функционал"}),n.jsx(Sn,{className:"w-3 h-3 opacity-70"})]})]}),n.jsxs("button",{onClick:()=>{d(!c),l(!1)},className:`flex flex-col items-center justify-center gap-1 py-3 ${I?"text-[#4E6E49]":e==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx(ur,{className:"w-5 h-5"}),n.jsxs("div",{className:"flex items-center gap-1",children:[n.jsx("span",{className:"text-[11px] font-semibold",children:"О нас"}),n.jsx(Sn,{className:"w-3 h-3 opacity-70"})]})]}),n.jsxs(or,{to:"/profile",className:`flex flex-col items-center justify-center gap-1 py-3 ${a.pathname==="/profile"?"text-[#4E6E49]":e==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx(Xs,{className:"w-5 h-5"}),n.jsxs("div",{className:"flex items-center gap-1",children:[n.jsx("span",{className:"text-[11px] font-semibold",children:"ЛК"}),n.jsx(Nt,{className:"w-3 h-3 opacity-70"})]})]})]})})})}),i&&n.jsx("div",{className:"lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",onClick:()=>l(!1),children:n.jsxs("div",{className:"absolute bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm glass-panel rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden",children:[n.jsx("div",{className:"accent-dots"}),n.jsx("div",{className:"relative z-10 divide-y divide-gray-100/60 dark:divide-white/5",children:h.map(N=>n.jsxs(or,{to:N.path,onClick:()=>l(!1),className:`flex items-center gap-3 px-4 py-3 transition-colors ${b(N.path)?"bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]":e==="dark"?"hover:bg-white/5 text-gray-200":"hover:bg-gray-50 text-gray-800"}`,children:[n.jsx(N.icon,{className:"w-4 h-4 flex-shrink-0"}),n.jsx("span",{className:"font-semibold flex-1",children:N.label}),n.jsx(Nt,{className:"w-4 h-4 opacity-70"})]},N.path))})]})}),c&&n.jsx("div",{className:"lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",onClick:()=>d(!1),children:n.jsxs("div",{className:"absolute bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm glass-panel rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden",children:[n.jsx("div",{className:"accent-dots"}),n.jsx("div",{className:"relative z-10 divide-y divide-gray-100/60 dark:divide-white/5",children:m.map(N=>n.jsxs(or,{to:N.path,onClick:()=>d(!1),className:`flex items-center gap-3 px-4 py-3 transition-colors ${a.pathname===N.path?"bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]":e==="dark"?"hover:bg-white/5 text-gray-200":"hover:bg-gray-50 text-gray-800"}`,children:[n.jsx(N.icon,{className:"w-4 h-4 flex-shrink-0"}),n.jsx("span",{className:"font-semibold flex-1",children:N.label}),n.jsx(Nt,{className:"w-4 h-4 opacity-70"})]},N.path))})]})})]})};var td={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rh=function(r){const e=[];let t=0;for(let s=0;s<r.length;s++){let a=r.charCodeAt(s);a<128?e[t++]=a:a<2048?(e[t++]=a>>6|192,e[t++]=a&63|128):(a&64512)===55296&&s+1<r.length&&(r.charCodeAt(s+1)&64512)===56320?(a=65536+((a&1023)<<10)+(r.charCodeAt(++s)&1023),e[t++]=a>>18|240,e[t++]=a>>12&63|128,e[t++]=a>>6&63|128,e[t++]=a&63|128):(e[t++]=a>>12|224,e[t++]=a>>6&63|128,e[t++]=a&63|128)}return e},kf=function(r){const e=[];let t=0,s=0;for(;t<r.length;){const a=r[t++];if(a<128)e[s++]=String.fromCharCode(a);else if(a>191&&a<224){const i=r[t++];e[s++]=String.fromCharCode((a&31)<<6|i&63)}else if(a>239&&a<365){const i=r[t++],l=r[t++],c=r[t++],d=((a&7)<<18|(i&63)<<12|(l&63)<<6|c&63)-65536;e[s++]=String.fromCharCode(55296+(d>>10)),e[s++]=String.fromCharCode(56320+(d&1023))}else{const i=r[t++],l=r[t++];e[s++]=String.fromCharCode((a&15)<<12|(i&63)<<6|l&63)}}return e.join("")},sh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let a=0;a<r.length;a+=3){const i=r[a],l=a+1<r.length,c=l?r[a+1]:0,d=a+2<r.length,h=d?r[a+2]:0,m=i>>2,x=(i&3)<<4|c>>4;let b=(c&15)<<2|h>>6,I=h&63;d||(I=64,l||(b=64)),s.push(t[m],t[x],t[b],t[I])}return s.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(rh(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):kf(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let a=0;a<r.length;){const i=t[r.charAt(a++)],c=a<r.length?t[r.charAt(a)]:0;++a;const h=a<r.length?t[r.charAt(a)]:64;++a;const x=a<r.length?t[r.charAt(a)]:64;if(++a,i==null||c==null||h==null||x==null)throw new Nf;const b=i<<2|c>>4;if(s.push(b),h!==64){const I=c<<4&240|h>>2;if(s.push(I),x!==64){const N=h<<6&192|x;s.push(N)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Nf extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ef=function(r){const e=rh(r);return sh.encodeByteArray(e,!0)},ri=function(r){return Ef(r).replace(/\./g,"")},nh=function(r){try{return sh.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const If=()=>jf().__FIREBASE_DEFAULTS__,Tf=()=>{if(typeof process>"u"||typeof td>"u")return;const r=td.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Sf=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&nh(r[1]);return e&&JSON.parse(e)},Ti=()=>{try{return If()||Tf()||Sf()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},ah=r=>{var e,t;return(t=(e=Ti())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},ih=r=>{const e=ah(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},oh=()=>{var r;return(r=Ti())===null||r===void 0?void 0:r.config},lh=r=>{var e;return(e=Ti())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Af{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ch(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",a=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:a,exp:a+3600,auth_time:a,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},r);return[ri(JSON.stringify(t)),ri(JSON.stringify(l)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Cf(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Mt())}function Rf(){var r;const e=(r=Ti())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Df(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Pf(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function $f(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Mf(){const r=Mt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Of(){return!Rf()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Vf(){try{return typeof indexedDB=="object"}catch{return!1}}function Lf(){return new Promise((r,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",a=self.indexedDB.open(s);a.onsuccess=()=>{a.result.close(),t||self.indexedDB.deleteDatabase(s),r(!0)},a.onupgradeneeded=()=>{t=!1},a.onerror=()=>{var i;e(((i=a.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ff="FirebaseError";class vr extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=Ff,Object.setPrototypeOf(this,vr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ia.prototype.create)}}class ia{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},a=`${this.service}/${e}`,i=this.errors[e],l=i?Uf(i,s):"Error",c=`${this.serviceName}: ${l} (${a}).`;return new vr(a,c,s)}}function Uf(r,e){return r.replace(Bf,(t,s)=>{const a=e[s];return a!=null?String(a):`<${s}?>`})}const Bf=/\{\$([^}]+)}/g;function qf(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function si(r,e){if(r===e)return!0;const t=Object.keys(r),s=Object.keys(e);for(const a of t){if(!s.includes(a))return!1;const i=r[a],l=e[a];if(rd(i)&&rd(l)){if(!si(i,l))return!1}else if(i!==l)return!1}for(const a of s)if(!t.includes(a))return!1;return!0}function rd(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oa(r){const e=[];for(const[t,s]of Object.entries(r))Array.isArray(s)?s.forEach(a=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(a))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Wf(r,e){const t=new zf(r,e);return t.subscribe.bind(t)}class zf{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let a;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");Hf(e,["next","error","complete"])?a=e:a={next:e,error:t,complete:s},a.next===void 0&&(a.next=oo),a.error===void 0&&(a.error=oo),a.complete===void 0&&(a.complete=oo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?a.error(this.finalError):a.complete()}catch{}}),this.observers.push(a),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Hf(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function oo(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ot(r){return r&&r._delegate?r._delegate:r}class ss{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gs="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gf{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new Af;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const a=this.getOrInitializeService({instanceIdentifier:t});a&&s.resolve(a)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),a=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(a)return null;throw i}else{if(a)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Qf(e))try{this.getOrInitializeService({instanceIdentifier:gs})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:a});s.resolve(i)}catch{}}}}clearInstance(e=gs){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=gs){return this.instances.has(e)}getOptions(e=gs){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const a=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[i,l]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);s===c&&l.resolve(a)}return a}onInit(e,t){var s;const a=this.normalizeInstanceIdentifier(t),i=(s=this.onInitCallbacks.get(a))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(a,i);const l=this.instances.get(a);return l&&e(l,a),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const a of s)try{a(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Kf(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=gs){return this.component?this.component.multipleInstances?e:gs:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Kf(r){return r===gs?void 0:r}function Qf(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yf{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Gf(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Fe;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Fe||(Fe={}));const Xf={debug:Fe.DEBUG,verbose:Fe.VERBOSE,info:Fe.INFO,warn:Fe.WARN,error:Fe.ERROR,silent:Fe.SILENT},Jf=Fe.INFO,Zf={[Fe.DEBUG]:"log",[Fe.VERBOSE]:"log",[Fe.INFO]:"info",[Fe.WARN]:"warn",[Fe.ERROR]:"error"},e0=(r,e,...t)=>{if(e<r.logLevel)return;const s=new Date().toISOString(),a=Zf[e];if(a)console[a](`[${s}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class il{constructor(e){this.name=e,this._logLevel=Jf,this._logHandler=e0,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Fe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Xf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Fe.DEBUG,...e),this._logHandler(this,Fe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Fe.VERBOSE,...e),this._logHandler(this,Fe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Fe.INFO,...e),this._logHandler(this,Fe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Fe.WARN,...e),this._logHandler(this,Fe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Fe.ERROR,...e),this._logHandler(this,Fe.ERROR,...e)}}const t0=(r,e)=>e.some(t=>r instanceof t);let sd,nd;function r0(){return sd||(sd=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function s0(){return nd||(nd=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const dh=new WeakMap,So=new WeakMap,uh=new WeakMap,lo=new WeakMap,ol=new WeakMap;function n0(r){const e=new Promise((t,s)=>{const a=()=>{r.removeEventListener("success",i),r.removeEventListener("error",l)},i=()=>{t(Zr(r.result)),a()},l=()=>{s(r.error),a()};r.addEventListener("success",i),r.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&dh.set(t,r)}).catch(()=>{}),ol.set(e,r),e}function a0(r){if(So.has(r))return;const e=new Promise((t,s)=>{const a=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",l),r.removeEventListener("abort",l)},i=()=>{t(),a()},l=()=>{s(r.error||new DOMException("AbortError","AbortError")),a()};r.addEventListener("complete",i),r.addEventListener("error",l),r.addEventListener("abort",l)});So.set(r,e)}let Ao={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return So.get(r);if(e==="objectStoreNames")return r.objectStoreNames||uh.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Zr(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function i0(r){Ao=r(Ao)}function o0(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=r.call(co(this),e,...t);return uh.set(s,e.sort?e.sort():[e]),Zr(s)}:s0().includes(r)?function(...e){return r.apply(co(this),e),Zr(dh.get(this))}:function(...e){return Zr(r.apply(co(this),e))}}function l0(r){return typeof r=="function"?o0(r):(r instanceof IDBTransaction&&a0(r),t0(r,r0())?new Proxy(r,Ao):r)}function Zr(r){if(r instanceof IDBRequest)return n0(r);if(lo.has(r))return lo.get(r);const e=l0(r);return e!==r&&(lo.set(r,e),ol.set(e,r)),e}const co=r=>ol.get(r);function c0(r,e,{blocked:t,upgrade:s,blocking:a,terminated:i}={}){const l=indexedDB.open(r,e),c=Zr(l);return s&&l.addEventListener("upgradeneeded",d=>{s(Zr(l.result),d.oldVersion,d.newVersion,Zr(l.transaction),d)}),t&&l.addEventListener("blocked",d=>t(d.oldVersion,d.newVersion,d)),c.then(d=>{i&&d.addEventListener("close",()=>i()),a&&d.addEventListener("versionchange",h=>a(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}const d0=["get","getKey","getAll","getAllKeys","count"],u0=["put","add","delete","clear"],uo=new Map;function ad(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(uo.get(e))return uo.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,a=u0.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(a||d0.includes(t)))return;const i=async function(l,...c){const d=this.transaction(l,a?"readwrite":"readonly");let h=d.store;return s&&(h=h.index(c.shift())),(await Promise.all([h[t](...c),a&&d.done]))[0]};return uo.set(e,i),i}i0(r=>({...r,get:(e,t,s)=>ad(e,t)||r.get(e,t,s),has:(e,t)=>!!ad(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h0{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(m0(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function m0(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Co="@firebase/app",id="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r=new il("@firebase/app"),g0="@firebase/app-compat",p0="@firebase/analytics-compat",f0="@firebase/analytics",x0="@firebase/app-check-compat",y0="@firebase/app-check",b0="@firebase/auth",v0="@firebase/auth-compat",w0="@firebase/database",_0="@firebase/data-connect",k0="@firebase/database-compat",N0="@firebase/functions",E0="@firebase/functions-compat",j0="@firebase/installations",I0="@firebase/installations-compat",T0="@firebase/messaging",S0="@firebase/messaging-compat",A0="@firebase/performance",C0="@firebase/performance-compat",R0="@firebase/remote-config",D0="@firebase/remote-config-compat",P0="@firebase/storage",$0="@firebase/storage-compat",M0="@firebase/firestore",O0="@firebase/vertexai-preview",V0="@firebase/firestore-compat",L0="firebase",F0="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ro="[DEFAULT]",U0={[Co]:"fire-core",[g0]:"fire-core-compat",[f0]:"fire-analytics",[p0]:"fire-analytics-compat",[y0]:"fire-app-check",[x0]:"fire-app-check-compat",[b0]:"fire-auth",[v0]:"fire-auth-compat",[w0]:"fire-rtdb",[_0]:"fire-data-connect",[k0]:"fire-rtdb-compat",[N0]:"fire-fn",[E0]:"fire-fn-compat",[j0]:"fire-iid",[I0]:"fire-iid-compat",[T0]:"fire-fcm",[S0]:"fire-fcm-compat",[A0]:"fire-perf",[C0]:"fire-perf-compat",[R0]:"fire-rc",[D0]:"fire-rc-compat",[P0]:"fire-gcs",[$0]:"fire-gcs-compat",[M0]:"fire-fst",[V0]:"fire-fst-compat",[O0]:"fire-vertex","fire-js":"fire-js",[L0]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ni=new Map,B0=new Map,Do=new Map;function od(r,e){try{r.container.addComponent(e)}catch(t){$r.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function _s(r){const e=r.name;if(Do.has(e))return $r.debug(`There were multiple attempts to register component ${e}.`),!1;Do.set(e,r);for(const t of ni.values())od(t,r);for(const t of B0.values())od(t,r);return!0}function Si(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Xr(r){return r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q0={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},es=new ia("app","Firebase",q0);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W0{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ss("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw es.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ss=F0;function hh(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Ro,automaticDataCollectionEnabled:!1},e),a=s.name;if(typeof a!="string"||!a)throw es.create("bad-app-name",{appName:String(a)});if(t||(t=oh()),!t)throw es.create("no-options");const i=ni.get(a);if(i){if(si(t,i.options)&&si(s,i.config))return i;throw es.create("duplicate-app",{appName:a})}const l=new Yf(a);for(const d of Do.values())l.addComponent(d);const c=new W0(t,s,l);return ni.set(a,c),c}function ll(r=Ro){const e=ni.get(r);if(!e&&r===Ro&&oh())return hh();if(!e)throw es.create("no-app",{appName:r});return e}function hr(r,e,t){var s;let a=(s=U0[r])!==null&&s!==void 0?s:r;t&&(a+=`-${t}`);const i=a.match(/\s|\//),l=e.match(/\s|\//);if(i||l){const c=[`Unable to register library "${a}" with version "${e}":`];i&&c.push(`library name "${a}" contains illegal characters (whitespace or "/")`),i&&l&&c.push("and"),l&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),$r.warn(c.join(" "));return}_s(new ss(`${a}-version`,()=>({library:a,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z0="firebase-heartbeat-database",H0=1,Bn="firebase-heartbeat-store";let ho=null;function mh(){return ho||(ho=c0(z0,H0,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(Bn)}catch(t){console.warn(t)}}}}).catch(r=>{throw es.create("idb-open",{originalErrorMessage:r.message})})),ho}async function G0(r){try{const t=(await mh()).transaction(Bn),s=await t.objectStore(Bn).get(gh(r));return await t.done,s}catch(e){if(e instanceof vr)$r.warn(e.message);else{const t=es.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});$r.warn(t.message)}}}async function ld(r,e){try{const s=(await mh()).transaction(Bn,"readwrite");await s.objectStore(Bn).put(e,gh(r)),await s.done}catch(t){if(t instanceof vr)$r.warn(t.message);else{const s=es.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});$r.warn(s.message)}}}function gh(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K0=1024,Q0=30*24*60*60*1e3;class Y0{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new J0(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const a=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=cd();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(l=>l.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:a}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(l=>{const c=new Date(l.date).valueOf();return Date.now()-c<=Q0}),this._storage.overwrite(this._heartbeatsCache))}catch(s){$r.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=cd(),{heartbeatsToSend:s,unsentEntries:a}=X0(this._heartbeatsCache.heartbeats),i=ri(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,a.length>0?(this._heartbeatsCache.heartbeats=a,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return $r.warn(t),""}}}function cd(){return new Date().toISOString().substring(0,10)}function X0(r,e=K0){const t=[];let s=r.slice();for(const a of r){const i=t.find(l=>l.agent===a.agent);if(i){if(i.dates.push(a.date),dd(t)>e){i.dates.pop();break}}else if(t.push({agent:a.agent,dates:[a.date]}),dd(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class J0{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Vf()?Lf().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await G0(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const a=await this.read();return ld(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:a.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const a=await this.read();return ld(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:a.lastSentHeartbeatDate,heartbeats:[...a.heartbeats,...e.heartbeats]})}else return}}function dd(r){return ri(JSON.stringify({version:2,heartbeats:r})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z0(r){_s(new ss("platform-logger",e=>new h0(e),"PRIVATE")),_s(new ss("heartbeat",e=>new Y0(e),"PRIVATE")),hr(Co,id,r),hr(Co,id,"esm2017"),hr("fire-js","")}Z0("");var ud=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ys,ph;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(j,y){function v(){}v.prototype=y.prototype,j.D=y.prototype,j.prototype=new v,j.prototype.constructor=j,j.C=function(f,_,k){for(var p=Array(arguments.length-2),$=2;$<arguments.length;$++)p[$-2]=arguments[$];return y.prototype[_].apply(f,p)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function a(j,y,v){v||(v=0);var f=Array(16);if(typeof y=="string")for(var _=0;16>_;++_)f[_]=y.charCodeAt(v++)|y.charCodeAt(v++)<<8|y.charCodeAt(v++)<<16|y.charCodeAt(v++)<<24;else for(_=0;16>_;++_)f[_]=y[v++]|y[v++]<<8|y[v++]<<16|y[v++]<<24;y=j.g[0],v=j.g[1],_=j.g[2];var k=j.g[3],p=y+(k^v&(_^k))+f[0]+3614090360&4294967295;y=v+(p<<7&4294967295|p>>>25),p=k+(_^y&(v^_))+f[1]+3905402710&4294967295,k=y+(p<<12&4294967295|p>>>20),p=_+(v^k&(y^v))+f[2]+606105819&4294967295,_=k+(p<<17&4294967295|p>>>15),p=v+(y^_&(k^y))+f[3]+3250441966&4294967295,v=_+(p<<22&4294967295|p>>>10),p=y+(k^v&(_^k))+f[4]+4118548399&4294967295,y=v+(p<<7&4294967295|p>>>25),p=k+(_^y&(v^_))+f[5]+1200080426&4294967295,k=y+(p<<12&4294967295|p>>>20),p=_+(v^k&(y^v))+f[6]+2821735955&4294967295,_=k+(p<<17&4294967295|p>>>15),p=v+(y^_&(k^y))+f[7]+4249261313&4294967295,v=_+(p<<22&4294967295|p>>>10),p=y+(k^v&(_^k))+f[8]+1770035416&4294967295,y=v+(p<<7&4294967295|p>>>25),p=k+(_^y&(v^_))+f[9]+2336552879&4294967295,k=y+(p<<12&4294967295|p>>>20),p=_+(v^k&(y^v))+f[10]+4294925233&4294967295,_=k+(p<<17&4294967295|p>>>15),p=v+(y^_&(k^y))+f[11]+2304563134&4294967295,v=_+(p<<22&4294967295|p>>>10),p=y+(k^v&(_^k))+f[12]+1804603682&4294967295,y=v+(p<<7&4294967295|p>>>25),p=k+(_^y&(v^_))+f[13]+4254626195&4294967295,k=y+(p<<12&4294967295|p>>>20),p=_+(v^k&(y^v))+f[14]+2792965006&4294967295,_=k+(p<<17&4294967295|p>>>15),p=v+(y^_&(k^y))+f[15]+1236535329&4294967295,v=_+(p<<22&4294967295|p>>>10),p=y+(_^k&(v^_))+f[1]+4129170786&4294967295,y=v+(p<<5&4294967295|p>>>27),p=k+(v^_&(y^v))+f[6]+3225465664&4294967295,k=y+(p<<9&4294967295|p>>>23),p=_+(y^v&(k^y))+f[11]+643717713&4294967295,_=k+(p<<14&4294967295|p>>>18),p=v+(k^y&(_^k))+f[0]+3921069994&4294967295,v=_+(p<<20&4294967295|p>>>12),p=y+(_^k&(v^_))+f[5]+3593408605&4294967295,y=v+(p<<5&4294967295|p>>>27),p=k+(v^_&(y^v))+f[10]+38016083&4294967295,k=y+(p<<9&4294967295|p>>>23),p=_+(y^v&(k^y))+f[15]+3634488961&4294967295,_=k+(p<<14&4294967295|p>>>18),p=v+(k^y&(_^k))+f[4]+3889429448&4294967295,v=_+(p<<20&4294967295|p>>>12),p=y+(_^k&(v^_))+f[9]+568446438&4294967295,y=v+(p<<5&4294967295|p>>>27),p=k+(v^_&(y^v))+f[14]+3275163606&4294967295,k=y+(p<<9&4294967295|p>>>23),p=_+(y^v&(k^y))+f[3]+4107603335&4294967295,_=k+(p<<14&4294967295|p>>>18),p=v+(k^y&(_^k))+f[8]+1163531501&4294967295,v=_+(p<<20&4294967295|p>>>12),p=y+(_^k&(v^_))+f[13]+2850285829&4294967295,y=v+(p<<5&4294967295|p>>>27),p=k+(v^_&(y^v))+f[2]+4243563512&4294967295,k=y+(p<<9&4294967295|p>>>23),p=_+(y^v&(k^y))+f[7]+1735328473&4294967295,_=k+(p<<14&4294967295|p>>>18),p=v+(k^y&(_^k))+f[12]+2368359562&4294967295,v=_+(p<<20&4294967295|p>>>12),p=y+(v^_^k)+f[5]+4294588738&4294967295,y=v+(p<<4&4294967295|p>>>28),p=k+(y^v^_)+f[8]+2272392833&4294967295,k=y+(p<<11&4294967295|p>>>21),p=_+(k^y^v)+f[11]+1839030562&4294967295,_=k+(p<<16&4294967295|p>>>16),p=v+(_^k^y)+f[14]+4259657740&4294967295,v=_+(p<<23&4294967295|p>>>9),p=y+(v^_^k)+f[1]+2763975236&4294967295,y=v+(p<<4&4294967295|p>>>28),p=k+(y^v^_)+f[4]+1272893353&4294967295,k=y+(p<<11&4294967295|p>>>21),p=_+(k^y^v)+f[7]+4139469664&4294967295,_=k+(p<<16&4294967295|p>>>16),p=v+(_^k^y)+f[10]+3200236656&4294967295,v=_+(p<<23&4294967295|p>>>9),p=y+(v^_^k)+f[13]+681279174&4294967295,y=v+(p<<4&4294967295|p>>>28),p=k+(y^v^_)+f[0]+3936430074&4294967295,k=y+(p<<11&4294967295|p>>>21),p=_+(k^y^v)+f[3]+3572445317&4294967295,_=k+(p<<16&4294967295|p>>>16),p=v+(_^k^y)+f[6]+76029189&4294967295,v=_+(p<<23&4294967295|p>>>9),p=y+(v^_^k)+f[9]+3654602809&4294967295,y=v+(p<<4&4294967295|p>>>28),p=k+(y^v^_)+f[12]+3873151461&4294967295,k=y+(p<<11&4294967295|p>>>21),p=_+(k^y^v)+f[15]+530742520&4294967295,_=k+(p<<16&4294967295|p>>>16),p=v+(_^k^y)+f[2]+3299628645&4294967295,v=_+(p<<23&4294967295|p>>>9),p=y+(_^(v|~k))+f[0]+4096336452&4294967295,y=v+(p<<6&4294967295|p>>>26),p=k+(v^(y|~_))+f[7]+1126891415&4294967295,k=y+(p<<10&4294967295|p>>>22),p=_+(y^(k|~v))+f[14]+2878612391&4294967295,_=k+(p<<15&4294967295|p>>>17),p=v+(k^(_|~y))+f[5]+4237533241&4294967295,v=_+(p<<21&4294967295|p>>>11),p=y+(_^(v|~k))+f[12]+1700485571&4294967295,y=v+(p<<6&4294967295|p>>>26),p=k+(v^(y|~_))+f[3]+2399980690&4294967295,k=y+(p<<10&4294967295|p>>>22),p=_+(y^(k|~v))+f[10]+4293915773&4294967295,_=k+(p<<15&4294967295|p>>>17),p=v+(k^(_|~y))+f[1]+2240044497&4294967295,v=_+(p<<21&4294967295|p>>>11),p=y+(_^(v|~k))+f[8]+1873313359&4294967295,y=v+(p<<6&4294967295|p>>>26),p=k+(v^(y|~_))+f[15]+4264355552&4294967295,k=y+(p<<10&4294967295|p>>>22),p=_+(y^(k|~v))+f[6]+2734768916&4294967295,_=k+(p<<15&4294967295|p>>>17),p=v+(k^(_|~y))+f[13]+1309151649&4294967295,v=_+(p<<21&4294967295|p>>>11),p=y+(_^(v|~k))+f[4]+4149444226&4294967295,y=v+(p<<6&4294967295|p>>>26),p=k+(v^(y|~_))+f[11]+3174756917&4294967295,k=y+(p<<10&4294967295|p>>>22),p=_+(y^(k|~v))+f[2]+718787259&4294967295,_=k+(p<<15&4294967295|p>>>17),p=v+(k^(_|~y))+f[9]+3951481745&4294967295,j.g[0]=j.g[0]+y&4294967295,j.g[1]=j.g[1]+(_+(p<<21&4294967295|p>>>11))&4294967295,j.g[2]=j.g[2]+_&4294967295,j.g[3]=j.g[3]+k&4294967295}s.prototype.u=function(j,y){y===void 0&&(y=j.length);for(var v=y-this.blockSize,f=this.B,_=this.h,k=0;k<y;){if(_==0)for(;k<=v;)a(this,j,k),k+=this.blockSize;if(typeof j=="string"){for(;k<y;)if(f[_++]=j.charCodeAt(k++),_==this.blockSize){a(this,f),_=0;break}}else for(;k<y;)if(f[_++]=j[k++],_==this.blockSize){a(this,f),_=0;break}}this.h=_,this.o+=y},s.prototype.v=function(){var j=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);j[0]=128;for(var y=1;y<j.length-8;++y)j[y]=0;var v=8*this.o;for(y=j.length-8;y<j.length;++y)j[y]=v&255,v/=256;for(this.u(j),j=Array(16),y=v=0;4>y;++y)for(var f=0;32>f;f+=8)j[v++]=this.g[y]>>>f&255;return j};function i(j,y){var v=c;return Object.prototype.hasOwnProperty.call(v,j)?v[j]:v[j]=y(j)}function l(j,y){this.h=y;for(var v=[],f=!0,_=j.length-1;0<=_;_--){var k=j[_]|0;f&&k==y||(v[_]=k,f=!1)}this.g=v}var c={};function d(j){return-128<=j&&128>j?i(j,function(y){return new l([y|0],0>y?-1:0)}):new l([j|0],0>j?-1:0)}function h(j){if(isNaN(j)||!isFinite(j))return x;if(0>j)return E(h(-j));for(var y=[],v=1,f=0;j>=v;f++)y[f]=j/v|0,v*=4294967296;return new l(y,0)}function m(j,y){if(j.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(j.charAt(0)=="-")return E(m(j.substring(1),y));if(0<=j.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=h(Math.pow(y,8)),f=x,_=0;_<j.length;_+=8){var k=Math.min(8,j.length-_),p=parseInt(j.substring(_,_+k),y);8>k?(k=h(Math.pow(y,k)),f=f.j(k).add(h(p))):(f=f.j(v),f=f.add(h(p)))}return f}var x=d(0),b=d(1),I=d(16777216);r=l.prototype,r.m=function(){if(T(this))return-E(this).m();for(var j=0,y=1,v=0;v<this.g.length;v++){var f=this.i(v);j+=(0<=f?f:4294967296+f)*y,y*=4294967296}return j},r.toString=function(j){if(j=j||10,2>j||36<j)throw Error("radix out of range: "+j);if(N(this))return"0";if(T(this))return"-"+E(this).toString(j);for(var y=h(Math.pow(j,6)),v=this,f="";;){var _=M(v,y).g;v=P(v,_.j(y));var k=((0<v.g.length?v.g[0]:v.h)>>>0).toString(j);if(v=_,N(v))return k+f;for(;6>k.length;)k="0"+k;f=k+f}},r.i=function(j){return 0>j?0:j<this.g.length?this.g[j]:this.h};function N(j){if(j.h!=0)return!1;for(var y=0;y<j.g.length;y++)if(j.g[y]!=0)return!1;return!0}function T(j){return j.h==-1}r.l=function(j){return j=P(this,j),T(j)?-1:N(j)?0:1};function E(j){for(var y=j.g.length,v=[],f=0;f<y;f++)v[f]=~j.g[f];return new l(v,~j.h).add(b)}r.abs=function(){return T(this)?E(this):this},r.add=function(j){for(var y=Math.max(this.g.length,j.g.length),v=[],f=0,_=0;_<=y;_++){var k=f+(this.i(_)&65535)+(j.i(_)&65535),p=(k>>>16)+(this.i(_)>>>16)+(j.i(_)>>>16);f=p>>>16,k&=65535,p&=65535,v[_]=p<<16|k}return new l(v,v[v.length-1]&-2147483648?-1:0)};function P(j,y){return j.add(E(y))}r.j=function(j){if(N(this)||N(j))return x;if(T(this))return T(j)?E(this).j(E(j)):E(E(this).j(j));if(T(j))return E(this.j(E(j)));if(0>this.l(I)&&0>j.l(I))return h(this.m()*j.m());for(var y=this.g.length+j.g.length,v=[],f=0;f<2*y;f++)v[f]=0;for(f=0;f<this.g.length;f++)for(var _=0;_<j.g.length;_++){var k=this.i(f)>>>16,p=this.i(f)&65535,$=j.i(_)>>>16,q=j.i(_)&65535;v[2*f+2*_]+=p*q,O(v,2*f+2*_),v[2*f+2*_+1]+=k*q,O(v,2*f+2*_+1),v[2*f+2*_+1]+=p*$,O(v,2*f+2*_+1),v[2*f+2*_+2]+=k*$,O(v,2*f+2*_+2)}for(f=0;f<y;f++)v[f]=v[2*f+1]<<16|v[2*f];for(f=y;f<2*y;f++)v[f]=0;return new l(v,0)};function O(j,y){for(;(j[y]&65535)!=j[y];)j[y+1]+=j[y]>>>16,j[y]&=65535,y++}function C(j,y){this.g=j,this.h=y}function M(j,y){if(N(y))throw Error("division by zero");if(N(j))return new C(x,x);if(T(j))return y=M(E(j),y),new C(E(y.g),E(y.h));if(T(y))return y=M(j,E(y)),new C(E(y.g),y.h);if(30<j.g.length){if(T(j)||T(y))throw Error("slowDivide_ only works with positive integers.");for(var v=b,f=y;0>=f.l(j);)v=ee(v),f=ee(f);var _=Z(v,1),k=Z(f,1);for(f=Z(f,2),v=Z(v,2);!N(f);){var p=k.add(f);0>=p.l(j)&&(_=_.add(v),k=p),f=Z(f,1),v=Z(v,1)}return y=P(j,_.j(y)),new C(_,y)}for(_=x;0<=j.l(y);){for(v=Math.max(1,Math.floor(j.m()/y.m())),f=Math.ceil(Math.log(v)/Math.LN2),f=48>=f?1:Math.pow(2,f-48),k=h(v),p=k.j(y);T(p)||0<p.l(j);)v-=f,k=h(v),p=k.j(y);N(k)&&(k=b),_=_.add(k),j=P(j,p)}return new C(_,j)}r.A=function(j){return M(this,j).h},r.and=function(j){for(var y=Math.max(this.g.length,j.g.length),v=[],f=0;f<y;f++)v[f]=this.i(f)&j.i(f);return new l(v,this.h&j.h)},r.or=function(j){for(var y=Math.max(this.g.length,j.g.length),v=[],f=0;f<y;f++)v[f]=this.i(f)|j.i(f);return new l(v,this.h|j.h)},r.xor=function(j){for(var y=Math.max(this.g.length,j.g.length),v=[],f=0;f<y;f++)v[f]=this.i(f)^j.i(f);return new l(v,this.h^j.h)};function ee(j){for(var y=j.g.length+1,v=[],f=0;f<y;f++)v[f]=j.i(f)<<1|j.i(f-1)>>>31;return new l(v,j.h)}function Z(j,y){var v=y>>5;y%=32;for(var f=j.g.length-v,_=[],k=0;k<f;k++)_[k]=0<y?j.i(k+v)>>>y|j.i(k+v+1)<<32-y:j.i(k+v);return new l(_,j.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,ph=s,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=h,l.fromString=m,ys=l}).apply(typeof ud<"u"?ud:typeof self<"u"?self:typeof window<"u"?window:{});var Pa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var fh,An,xh,za,Po,yh,bh,vh;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,g){return o==Array.prototype||o==Object.prototype||(o[u]=g.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Pa=="object"&&Pa];for(var u=0;u<o.length;++u){var g=o[u];if(g&&g.Math==Math)return g}throw Error("Cannot find global object")}var s=t(this);function a(o,u){if(u)e:{var g=s;o=o.split(".");for(var w=0;w<o.length-1;w++){var V=o[w];if(!(V in g))break e;g=g[V]}o=o[o.length-1],w=g[o],u=u(w),u!=w&&u!=null&&e(g,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var g=0,w=!1,V={next:function(){if(!w&&g<o.length){var W=g++;return{value:u(W,o[W]),done:!1}}return w=!0,{done:!0,value:void 0}}};return V[Symbol.iterator]=function(){return V},V}a("Array.prototype.values",function(o){return o||function(){return i(this,function(u,g){return g})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},c=this||self;function d(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function h(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function m(o,u,g){return o.call.apply(o.bind,arguments)}function x(o,u,g){if(!o)throw Error();if(2<arguments.length){var w=Array.prototype.slice.call(arguments,2);return function(){var V=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(V,w),o.apply(u,V)}}return function(){return o.apply(u,arguments)}}function b(o,u,g){return b=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?m:x,b.apply(null,arguments)}function I(o,u){var g=Array.prototype.slice.call(arguments,1);return function(){var w=g.slice();return w.push.apply(w,arguments),o.apply(this,w)}}function N(o,u){function g(){}g.prototype=u.prototype,o.aa=u.prototype,o.prototype=new g,o.prototype.constructor=o,o.Qb=function(w,V,W){for(var le=Array(arguments.length-2),Je=2;Je<arguments.length;Je++)le[Je-2]=arguments[Je];return u.prototype[V].apply(w,le)}}function T(o){const u=o.length;if(0<u){const g=Array(u);for(let w=0;w<u;w++)g[w]=o[w];return g}return[]}function E(o,u){for(let g=1;g<arguments.length;g++){const w=arguments[g];if(d(w)){const V=o.length||0,W=w.length||0;o.length=V+W;for(let le=0;le<W;le++)o[V+le]=w[le]}else o.push(w)}}class P{constructor(u,g){this.i=u,this.j=g,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function O(o){return/^[\s\xa0]*$/.test(o)}function C(){var o=c.navigator;return o&&(o=o.userAgent)?o:""}function M(o){return M[" "](o),o}M[" "]=function(){};var ee=C().indexOf("Gecko")!=-1&&!(C().toLowerCase().indexOf("webkit")!=-1&&C().indexOf("Edge")==-1)&&!(C().indexOf("Trident")!=-1||C().indexOf("MSIE")!=-1)&&C().indexOf("Edge")==-1;function Z(o,u,g){for(const w in o)u.call(g,o[w],w,o)}function j(o,u){for(const g in o)u.call(void 0,o[g],g,o)}function y(o){const u={};for(const g in o)u[g]=o[g];return u}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function f(o,u){let g,w;for(let V=1;V<arguments.length;V++){w=arguments[V];for(g in w)o[g]=w[g];for(let W=0;W<v.length;W++)g=v[W],Object.prototype.hasOwnProperty.call(w,g)&&(o[g]=w[g])}}function _(o){var u=1;o=o.split(":");const g=[];for(;0<u&&o.length;)g.push(o.shift()),u--;return o.length&&g.push(o.join(":")),g}function k(o){c.setTimeout(()=>{throw o},0)}function p(){var o=ce;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class ${constructor(){this.h=this.g=null}add(u,g){const w=q.get();w.set(u,g),this.h?this.h.next=w:this.g=w,this.h=w}}var q=new P(()=>new se,o=>o.reset());class se{constructor(){this.next=this.g=this.h=null}set(u,g){this.h=u,this.g=g,this.next=null}reset(){this.next=this.g=this.h=null}}let B,Y=!1,ce=new $,re=()=>{const o=c.Promise.resolve(void 0);B=()=>{o.then(he)}};var he=()=>{for(var o;o=p();){try{o.h.call(o.g)}catch(g){k(g)}var u=q;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}Y=!1};function K(){this.s=this.s,this.C=this.C}K.prototype.s=!1,K.prototype.ma=function(){this.s||(this.s=!0,this.N())},K.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function G(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}G.prototype.h=function(){this.defaultPrevented=!0};var xe=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const g=()=>{};c.addEventListener("test",g,u),c.removeEventListener("test",g,u)}catch{}return o}();function we(o,u){if(G.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var g=this.type=o.type,w=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(ee){e:{try{M(u.nodeName);var V=!0;break e}catch{}V=!1}V||(u=null)}}else g=="mouseover"?u=o.fromElement:g=="mouseout"&&(u=o.toElement);this.relatedTarget=u,w?(this.clientX=w.clientX!==void 0?w.clientX:w.pageX,this.clientY=w.clientY!==void 0?w.clientY:w.pageY,this.screenX=w.screenX||0,this.screenY=w.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:H[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&we.aa.h.call(this)}}N(we,G);var H={2:"touch",3:"pen",4:"mouse"};we.prototype.h=function(){we.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var _e="closure_listenable_"+(1e6*Math.random()|0),ye=0;function Ee(o,u,g,w,V){this.listener=o,this.proxy=null,this.src=u,this.type=g,this.capture=!!w,this.ha=V,this.key=++ye,this.da=this.fa=!1}function X(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function R(o){this.src=o,this.g={},this.h=0}R.prototype.add=function(o,u,g,w,V){var W=o.toString();o=this.g[W],o||(o=this.g[W]=[],this.h++);var le=ge(o,u,w,V);return-1<le?(u=o[le],g||(u.fa=!1)):(u=new Ee(u,this.src,W,!!w,V),u.fa=g,o.push(u)),u};function L(o,u){var g=u.type;if(g in o.g){var w=o.g[g],V=Array.prototype.indexOf.call(w,u,void 0),W;(W=0<=V)&&Array.prototype.splice.call(w,V,1),W&&(X(u),o.g[g].length==0&&(delete o.g[g],o.h--))}}function ge(o,u,g,w){for(var V=0;V<o.length;++V){var W=o[V];if(!W.da&&W.listener==u&&W.capture==!!g&&W.ha==w)return V}return-1}var pe="closure_lm_"+(1e6*Math.random()|0),U={};function S(o,u,g,w,V){if(Array.isArray(u)){for(var W=0;W<u.length;W++)S(o,u[W],g,w,V);return null}return g=ae(g),o&&o[_e]?o.K(u,g,h(w)?!!w.capture:!1,V):Q(o,u,g,!1,w,V)}function Q(o,u,g,w,V,W){if(!u)throw Error("Invalid event type");var le=h(V)?!!V.capture:!!V,Je=Oe(o);if(Je||(o[pe]=Je=new R(o)),g=Je.add(u,g,w,le,W),g.proxy)return g;if(w=de(),g.proxy=w,w.src=o,w.listener=g,o.addEventListener)xe||(V=le),V===void 0&&(V=!1),o.addEventListener(u.toString(),w,V);else if(o.attachEvent)o.attachEvent(je(u.toString()),w);else if(o.addListener&&o.removeListener)o.addListener(w);else throw Error("addEventListener and attachEvent are unavailable.");return g}function de(){function o(g){return u.call(o.src,o.listener,g)}const u=Ue;return o}function D(o,u,g,w,V){if(Array.isArray(u))for(var W=0;W<u.length;W++)D(o,u[W],g,w,V);else w=h(w)?!!w.capture:!!w,g=ae(g),o&&o[_e]?(o=o.i,u=String(u).toString(),u in o.g&&(W=o.g[u],g=ge(W,g,w,V),-1<g&&(X(W[g]),Array.prototype.splice.call(W,g,1),W.length==0&&(delete o.g[u],o.h--)))):o&&(o=Oe(o))&&(u=o.g[u.toString()],o=-1,u&&(o=ge(u,g,w,V)),(g=-1<o?u[o]:null)&&ue(g))}function ue(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[_e])L(u.i,o);else{var g=o.type,w=o.proxy;u.removeEventListener?u.removeEventListener(g,w,o.capture):u.detachEvent?u.detachEvent(je(g),w):u.addListener&&u.removeListener&&u.removeListener(w),(g=Oe(u))?(L(g,o),g.h==0&&(g.src=null,u[pe]=null)):X(o)}}}function je(o){return o in U?U[o]:U[o]="on"+o}function Ue(o,u){if(o.da)o=!0;else{u=new we(u,this);var g=o.listener,w=o.ha||o.src;o.fa&&ue(o),o=g.call(w,u)}return o}function Oe(o){return o=o[pe],o instanceof R?o:null}var F="__closure_events_fn_"+(1e9*Math.random()>>>0);function ae(o){return typeof o=="function"?o:(o[F]||(o[F]=function(u){return o.handleEvent(u)}),o[F])}function ne(){K.call(this),this.i=new R(this),this.M=this,this.F=null}N(ne,K),ne.prototype[_e]=!0,ne.prototype.removeEventListener=function(o,u,g,w){D(this,o,u,g,w)};function be(o,u){var g,w=o.F;if(w)for(g=[];w;w=w.F)g.push(w);if(o=o.M,w=u.type||u,typeof u=="string")u=new G(u,o);else if(u instanceof G)u.target=u.target||o;else{var V=u;u=new G(w,o),f(u,V)}if(V=!0,g)for(var W=g.length-1;0<=W;W--){var le=u.g=g[W];V=Ye(le,w,!0,u)&&V}if(le=u.g=o,V=Ye(le,w,!0,u)&&V,V=Ye(le,w,!1,u)&&V,g)for(W=0;W<g.length;W++)le=u.g=g[W],V=Ye(le,w,!1,u)&&V}ne.prototype.N=function(){if(ne.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var g=o.g[u],w=0;w<g.length;w++)X(g[w]);delete o.g[u],o.h--}}this.F=null},ne.prototype.K=function(o,u,g,w){return this.i.add(String(o),u,!1,g,w)},ne.prototype.L=function(o,u,g,w){return this.i.add(String(o),u,!0,g,w)};function Ye(o,u,g,w){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var V=!0,W=0;W<u.length;++W){var le=u[W];if(le&&!le.da&&le.capture==g){var Je=le.listener,kt=le.ha||le.src;le.fa&&L(o.i,le),V=Je.call(kt,w)!==!1&&V}}return V&&!w.defaultPrevented}function at(o,u,g){if(typeof o=="function")g&&(o=b(o,g));else if(o&&typeof o.handleEvent=="function")o=b(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:c.setTimeout(o,u||0)}function yt(o){o.g=at(()=>{o.g=null,o.i&&(o.i=!1,yt(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class He extends K{constructor(u,g){super(),this.m=u,this.l=g,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:yt(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function dt(o){K.call(this),this.h=o,this.g={}}N(dt,K);var Me=[];function fe(o){Z(o.g,function(u,g){this.g.hasOwnProperty(g)&&ue(u)},o),o.g={}}dt.prototype.N=function(){dt.aa.N.call(this),fe(this)},dt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ge=c.JSON.stringify,ut=c.JSON.parse,_r=class{stringify(o){return c.JSON.stringify(o,void 0)}parse(o){return c.JSON.parse(o,void 0)}};function Jt(){}Jt.prototype.h=null;function cs(o){return o.h||(o.h=o.i())}function Ae(){}var Se={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function _t(){G.call(this,"d")}N(_t,G);function $s(){G.call(this,"c")}N($s,G);var kr={},va=null;function ds(){return va=va||new ne}kr.La="serverreachability";function z(o){G.call(this,kr.La,o)}N(z,G);function oe(o){const u=ds();be(u,new z(u))}kr.STAT_EVENT="statevent";function Te(o,u){G.call(this,kr.STAT_EVENT,o),this.stat=u}N(Te,G);function De(o){const u=ds();be(u,new Te(u,o))}kr.Ma="timingevent";function rt(o,u){G.call(this,kr.Ma,o),this.size=u}N(rt,G);function Xe(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){o()},u)}function qe(){this.g=!0}qe.prototype.xa=function(){this.g=!1};function gt(o,u,g,w,V,W){o.info(function(){if(o.g)if(W)for(var le="",Je=W.split("&"),kt=0;kt<Je.length;kt++){var We=Je[kt].split("=");if(1<We.length){var Ct=We[0];We=We[1];var Rt=Ct.split("_");le=2<=Rt.length&&Rt[1]=="type"?le+(Ct+"="+We+"&"):le+(Ct+"=redacted&")}}else le=null;else le=W;return"XMLHTTP REQ ("+w+") [attempt "+V+"]: "+u+`
`+g+`
`+le})}function qt(o,u,g,w,V,W,le){o.info(function(){return"XMLHTTP RESP ("+w+") [ attempt "+V+"]: "+u+`
`+g+`
`+W+" "+le})}function pt(o,u,g,w){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+ft(o,g)+(w?" "+w:"")})}function Ft(o,u){o.info(function(){return"TIMEOUT: "+u})}qe.prototype.info=function(){};function ft(o,u){if(!o.g)return u;if(!u)return null;try{var g=JSON.parse(u);if(g){for(o=0;o<g.length;o++)if(Array.isArray(g[o])){var w=g[o];if(!(2>w.length)){var V=w[1];if(Array.isArray(V)&&!(1>V.length)){var W=V[0];if(W!="noop"&&W!="stop"&&W!="close")for(var le=1;le<V.length;le++)V[le]=""}}}}return Ge(g)}catch{return u}}var ot={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ir={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Nr;function wa(){}N(wa,Jt),wa.prototype.g=function(){return new XMLHttpRequest},wa.prototype.i=function(){return{}},Nr=new wa;function Ur(o,u,g,w){this.j=o,this.i=u,this.l=g,this.R=w||1,this.U=new dt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new nc}function nc(){this.i=null,this.g="",this.h=!1}var ac={},Qi={};function Yi(o,u,g){o.L=1,o.v=Ea(Er(u)),o.m=g,o.P=!0,ic(o,null)}function ic(o,u){o.F=Date.now(),_a(o),o.A=Er(o.v);var g=o.A,w=o.R;Array.isArray(w)||(w=[String(w)]),vc(g.i,"t",w),o.C=0,g=o.j.J,o.h=new nc,o.g=Vc(o.j,g?u:null,!o.m),0<o.O&&(o.M=new He(b(o.Y,o,o.g),o.O)),u=o.U,g=o.g,w=o.ca;var V="readystatechange";Array.isArray(V)||(V&&(Me[0]=V.toString()),V=Me);for(var W=0;W<V.length;W++){var le=S(g,V[W],w||u.handleEvent,!1,u.h||u);if(!le)break;u.g[le.key]=le}u=o.H?y(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),oe(),gt(o.i,o.u,o.A,o.l,o.R,o.m)}Ur.prototype.ca=function(o){o=o.target;const u=this.M;u&&jr(o)==3?u.j():this.Y(o)},Ur.prototype.Y=function(o){try{if(o==this.g)e:{const Rt=jr(this.g);var u=this.g.Ba();const Vs=this.g.Z();if(!(3>Rt)&&(Rt!=3||this.g&&(this.h.h||this.g.oa()||Ic(this.g)))){this.J||Rt!=4||u==7||(u==8||0>=Vs?oe(3):oe(2)),Xi(this);var g=this.g.Z();this.X=g;t:if(oc(this)){var w=Ic(this.g);o="";var V=w.length,W=jr(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){us(this),fn(this);var le="";break t}this.h.i=new c.TextDecoder}for(u=0;u<V;u++)this.h.h=!0,o+=this.h.i.decode(w[u],{stream:!(W&&u==V-1)});w.length=0,this.h.g+=o,this.C=0,le=this.h.g}else le=this.g.oa();if(this.o=g==200,qt(this.i,this.u,this.A,this.l,this.R,Rt,g),this.o){if(this.T&&!this.K){t:{if(this.g){var Je,kt=this.g;if((Je=kt.g?kt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!O(Je)){var We=Je;break t}}We=null}if(g=We)pt(this.i,this.l,g,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ji(this,g);else{this.o=!1,this.s=3,De(12),us(this),fn(this);break e}}if(this.P){g=!0;let Zt;for(;!this.J&&this.C<le.length;)if(Zt=Pg(this,le),Zt==Qi){Rt==4&&(this.s=4,De(14),g=!1),pt(this.i,this.l,null,"[Incomplete Response]");break}else if(Zt==ac){this.s=4,De(15),pt(this.i,this.l,le,"[Invalid Chunk]"),g=!1;break}else pt(this.i,this.l,Zt,null),Ji(this,Zt);if(oc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Rt!=4||le.length!=0||this.h.h||(this.s=1,De(16),g=!1),this.o=this.o&&g,!g)pt(this.i,this.l,le,"[Invalid Chunked Response]"),us(this),fn(this);else if(0<le.length&&!this.W){this.W=!0;var Ct=this.j;Ct.g==this&&Ct.ba&&!Ct.M&&(Ct.j.info("Great, no buffering proxy detected. Bytes received: "+le.length),no(Ct),Ct.M=!0,De(11))}}else pt(this.i,this.l,le,null),Ji(this,le);Rt==4&&us(this),this.o&&!this.J&&(Rt==4?Pc(this.j,this):(this.o=!1,_a(this)))}else Xg(this.g),g==400&&0<le.indexOf("Unknown SID")?(this.s=3,De(12)):(this.s=0,De(13)),us(this),fn(this)}}}catch{}finally{}};function oc(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Pg(o,u){var g=o.C,w=u.indexOf(`
`,g);return w==-1?Qi:(g=Number(u.substring(g,w)),isNaN(g)?ac:(w+=1,w+g>u.length?Qi:(u=u.slice(w,w+g),o.C=w+g,u)))}Ur.prototype.cancel=function(){this.J=!0,us(this)};function _a(o){o.S=Date.now()+o.I,lc(o,o.I)}function lc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Xe(b(o.ba,o),u)}function Xi(o){o.B&&(c.clearTimeout(o.B),o.B=null)}Ur.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Ft(this.i,this.A),this.L!=2&&(oe(),De(17)),us(this),this.s=2,fn(this)):lc(this,this.S-o)};function fn(o){o.j.G==0||o.J||Pc(o.j,o)}function us(o){Xi(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,fe(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Ji(o,u){try{var g=o.j;if(g.G!=0&&(g.g==o||Zi(g.h,o))){if(!o.K&&Zi(g.h,o)&&g.G==3){try{var w=g.Da.g.parse(u)}catch{w=null}if(Array.isArray(w)&&w.length==3){var V=w;if(V[0]==0){e:if(!g.u){if(g.g)if(g.g.F+3e3<o.F)Ca(g),Sa(g);else break e;so(g),De(18)}}else g.za=V[1],0<g.za-g.T&&37500>V[2]&&g.F&&g.v==0&&!g.C&&(g.C=Xe(b(g.Za,g),6e3));if(1>=uc(g.h)&&g.ca){try{g.ca()}catch{}g.ca=void 0}}else ms(g,11)}else if((o.K||g.g==o)&&Ca(g),!O(u))for(V=g.Da.g.parse(u),u=0;u<V.length;u++){let We=V[u];if(g.T=We[0],We=We[1],g.G==2)if(We[0]=="c"){g.K=We[1],g.ia=We[2];const Ct=We[3];Ct!=null&&(g.la=Ct,g.j.info("VER="+g.la));const Rt=We[4];Rt!=null&&(g.Aa=Rt,g.j.info("SVER="+g.Aa));const Vs=We[5];Vs!=null&&typeof Vs=="number"&&0<Vs&&(w=1.5*Vs,g.L=w,g.j.info("backChannelRequestTimeoutMs_="+w)),w=g;const Zt=o.g;if(Zt){const Da=Zt.g?Zt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Da){var W=w.h;W.g||Da.indexOf("spdy")==-1&&Da.indexOf("quic")==-1&&Da.indexOf("h2")==-1||(W.j=W.l,W.g=new Set,W.h&&(eo(W,W.h),W.h=null))}if(w.D){const ao=Zt.g?Zt.g.getResponseHeader("X-HTTP-Session-Id"):null;ao&&(w.ya=ao,et(w.I,w.D,ao))}}g.G=3,g.l&&g.l.ua(),g.ba&&(g.R=Date.now()-o.F,g.j.info("Handshake RTT: "+g.R+"ms")),w=g;var le=o;if(w.qa=Oc(w,w.J?w.ia:null,w.W),le.K){hc(w.h,le);var Je=le,kt=w.L;kt&&(Je.I=kt),Je.B&&(Xi(Je),_a(Je)),w.g=le}else Rc(w);0<g.i.length&&Aa(g)}else We[0]!="stop"&&We[0]!="close"||ms(g,7);else g.G==3&&(We[0]=="stop"||We[0]=="close"?We[0]=="stop"?ms(g,7):ro(g):We[0]!="noop"&&g.l&&g.l.ta(We),g.v=0)}}oe(4)}catch{}}var $g=class{constructor(o,u){this.g=o,this.map=u}};function cc(o){this.l=o||10,c.PerformanceNavigationTiming?(o=c.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function dc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function uc(o){return o.h?1:o.g?o.g.size:0}function Zi(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function eo(o,u){o.g?o.g.add(u):o.h=u}function hc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}cc.prototype.cancel=function(){if(this.i=mc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function mc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const g of o.g.values())u=u.concat(g.D);return u}return T(o.i)}function Mg(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(d(o)){for(var u=[],g=o.length,w=0;w<g;w++)u.push(o[w]);return u}u=[],g=0;for(w in o)u[g++]=o[w];return u}function Og(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(d(o)||typeof o=="string"){var u=[];o=o.length;for(var g=0;g<o;g++)u.push(g);return u}u=[],g=0;for(const w in o)u[g++]=w;return u}}}function gc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(d(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var g=Og(o),w=Mg(o),V=w.length,W=0;W<V;W++)u.call(void 0,w[W],g&&g[W],o)}var pc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Vg(o,u){if(o){o=o.split("&");for(var g=0;g<o.length;g++){var w=o[g].indexOf("="),V=null;if(0<=w){var W=o[g].substring(0,w);V=o[g].substring(w+1)}else W=o[g];u(W,V?decodeURIComponent(V.replace(/\+/g," ")):"")}}}function hs(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof hs){this.h=o.h,ka(this,o.j),this.o=o.o,this.g=o.g,Na(this,o.s),this.l=o.l;var u=o.i,g=new bn;g.i=u.i,u.g&&(g.g=new Map(u.g),g.h=u.h),fc(this,g),this.m=o.m}else o&&(u=String(o).match(pc))?(this.h=!1,ka(this,u[1]||"",!0),this.o=xn(u[2]||""),this.g=xn(u[3]||"",!0),Na(this,u[4]),this.l=xn(u[5]||"",!0),fc(this,u[6]||"",!0),this.m=xn(u[7]||"")):(this.h=!1,this.i=new bn(null,this.h))}hs.prototype.toString=function(){var o=[],u=this.j;u&&o.push(yn(u,xc,!0),":");var g=this.g;return(g||u=="file")&&(o.push("//"),(u=this.o)&&o.push(yn(u,xc,!0),"@"),o.push(encodeURIComponent(String(g)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),g=this.s,g!=null&&o.push(":",String(g))),(g=this.l)&&(this.g&&g.charAt(0)!="/"&&o.push("/"),o.push(yn(g,g.charAt(0)=="/"?Ug:Fg,!0))),(g=this.i.toString())&&o.push("?",g),(g=this.m)&&o.push("#",yn(g,qg)),o.join("")};function Er(o){return new hs(o)}function ka(o,u,g){o.j=g?xn(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function Na(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function fc(o,u,g){u instanceof bn?(o.i=u,Wg(o.i,o.h)):(g||(u=yn(u,Bg)),o.i=new bn(u,o.h))}function et(o,u,g){o.i.set(u,g)}function Ea(o){return et(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function xn(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function yn(o,u,g){return typeof o=="string"?(o=encodeURI(o).replace(u,Lg),g&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Lg(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var xc=/[#\/\?@]/g,Fg=/[#\?:]/g,Ug=/[#\?]/g,Bg=/[#\?@]/g,qg=/#/g;function bn(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function Br(o){o.g||(o.g=new Map,o.h=0,o.i&&Vg(o.i,function(u,g){o.add(decodeURIComponent(u.replace(/\+/g," ")),g)}))}r=bn.prototype,r.add=function(o,u){Br(this),this.i=null,o=Ms(this,o);var g=this.g.get(o);return g||this.g.set(o,g=[]),g.push(u),this.h+=1,this};function yc(o,u){Br(o),u=Ms(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function bc(o,u){return Br(o),u=Ms(o,u),o.g.has(u)}r.forEach=function(o,u){Br(this),this.g.forEach(function(g,w){g.forEach(function(V){o.call(u,V,w,this)},this)},this)},r.na=function(){Br(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),g=[];for(let w=0;w<u.length;w++){const V=o[w];for(let W=0;W<V.length;W++)g.push(u[w])}return g},r.V=function(o){Br(this);let u=[];if(typeof o=="string")bc(this,o)&&(u=u.concat(this.g.get(Ms(this,o))));else{o=Array.from(this.g.values());for(let g=0;g<o.length;g++)u=u.concat(o[g])}return u},r.set=function(o,u){return Br(this),this.i=null,o=Ms(this,o),bc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},r.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function vc(o,u,g){yc(o,u),0<g.length&&(o.i=null,o.g.set(Ms(o,u),T(g)),o.h+=g.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var g=0;g<u.length;g++){var w=u[g];const W=encodeURIComponent(String(w)),le=this.V(w);for(w=0;w<le.length;w++){var V=W;le[w]!==""&&(V+="="+encodeURIComponent(String(le[w]))),o.push(V)}}return this.i=o.join("&")};function Ms(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Wg(o,u){u&&!o.j&&(Br(o),o.i=null,o.g.forEach(function(g,w){var V=w.toLowerCase();w!=V&&(yc(this,w),vc(this,V,g))},o)),o.j=u}function zg(o,u){const g=new qe;if(c.Image){const w=new Image;w.onload=I(qr,g,"TestLoadImage: loaded",!0,u,w),w.onerror=I(qr,g,"TestLoadImage: error",!1,u,w),w.onabort=I(qr,g,"TestLoadImage: abort",!1,u,w),w.ontimeout=I(qr,g,"TestLoadImage: timeout",!1,u,w),c.setTimeout(function(){w.ontimeout&&w.ontimeout()},1e4),w.src=o}else u(!1)}function Hg(o,u){const g=new qe,w=new AbortController,V=setTimeout(()=>{w.abort(),qr(g,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:w.signal}).then(W=>{clearTimeout(V),W.ok?qr(g,"TestPingServer: ok",!0,u):qr(g,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(V),qr(g,"TestPingServer: error",!1,u)})}function qr(o,u,g,w,V){try{V&&(V.onload=null,V.onerror=null,V.onabort=null,V.ontimeout=null),w(g)}catch{}}function Gg(){this.g=new _r}function Kg(o,u,g){const w=g||"";try{gc(o,function(V,W){let le=V;h(V)&&(le=Ge(V)),u.push(w+W+"="+encodeURIComponent(le))})}catch(V){throw u.push(w+"type="+encodeURIComponent("_badmap")),V}}function ja(o){this.l=o.Ub||null,this.j=o.eb||!1}N(ja,Jt),ja.prototype.g=function(){return new Ia(this.l,this.j)},ja.prototype.i=function(o){return function(){return o}}({});function Ia(o,u){ne.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}N(Ia,ne),r=Ia.prototype,r.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,wn(this)},r.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||c).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,vn(this)),this.readyState=0},r.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,wn(this)),this.g&&(this.readyState=3,wn(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;wc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function wc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}r.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?vn(this):wn(this),this.readyState==3&&wc(this)}},r.Ra=function(o){this.g&&(this.response=this.responseText=o,vn(this))},r.Qa=function(o){this.g&&(this.response=o,vn(this))},r.ga=function(){this.g&&vn(this)};function vn(o){o.readyState=4,o.l=null,o.j=null,o.v=null,wn(o)}r.setRequestHeader=function(o,u){this.u.append(o,u)},r.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var g=u.next();!g.done;)g=g.value,o.push(g[0]+": "+g[1]),g=u.next();return o.join(`\r
`)};function wn(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ia.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function _c(o){let u="";return Z(o,function(g,w){u+=w,u+=":",u+=g,u+=`\r
`}),u}function to(o,u,g){e:{for(w in g){var w=!1;break e}w=!0}w||(g=_c(g),typeof o=="string"?g!=null&&encodeURIComponent(String(g)):et(o,u,g))}function it(o){ne.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}N(it,ne);var Qg=/^https?$/i,Yg=["POST","PUT"];r=it.prototype,r.Ha=function(o){this.J=o},r.ea=function(o,u,g,w){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Nr.g(),this.v=this.o?cs(this.o):cs(Nr),this.g.onreadystatechange=b(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(W){kc(this,W);return}if(o=g||"",g=new Map(this.headers),w)if(Object.getPrototypeOf(w)===Object.prototype)for(var V in w)g.set(V,w[V]);else if(typeof w.keys=="function"&&typeof w.get=="function")for(const W of w.keys())g.set(W,w.get(W));else throw Error("Unknown input type for opt_headers: "+String(w));w=Array.from(g.keys()).find(W=>W.toLowerCase()=="content-type"),V=c.FormData&&o instanceof c.FormData,!(0<=Array.prototype.indexOf.call(Yg,u,void 0))||w||V||g.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[W,le]of g)this.g.setRequestHeader(W,le);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{jc(this),this.u=!0,this.g.send(o),this.u=!1}catch(W){kc(this,W)}};function kc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Nc(o),Ta(o)}function Nc(o){o.A||(o.A=!0,be(o,"complete"),be(o,"error"))}r.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,be(this,"complete"),be(this,"abort"),Ta(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ta(this,!0)),it.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?Ec(this):this.bb())},r.bb=function(){Ec(this)};function Ec(o){if(o.h&&typeof l<"u"&&(!o.v[1]||jr(o)!=4||o.Z()!=2)){if(o.u&&jr(o)==4)at(o.Ea,0,o);else if(be(o,"readystatechange"),jr(o)==4){o.h=!1;try{const le=o.Z();e:switch(le){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var g;if(!(g=u)){var w;if(w=le===0){var V=String(o.D).match(pc)[1]||null;!V&&c.self&&c.self.location&&(V=c.self.location.protocol.slice(0,-1)),w=!Qg.test(V?V.toLowerCase():"")}g=w}if(g)be(o,"complete"),be(o,"success");else{o.m=6;try{var W=2<jr(o)?o.g.statusText:""}catch{W=""}o.l=W+" ["+o.Z()+"]",Nc(o)}}finally{Ta(o)}}}}function Ta(o,u){if(o.g){jc(o);const g=o.g,w=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||be(o,"ready");try{g.onreadystatechange=w}catch{}}}function jc(o){o.I&&(c.clearTimeout(o.I),o.I=null)}r.isActive=function(){return!!this.g};function jr(o){return o.g?o.g.readyState:0}r.Z=function(){try{return 2<jr(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),ut(u)}};function Ic(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Xg(o){const u={};o=(o.g&&2<=jr(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let w=0;w<o.length;w++){if(O(o[w]))continue;var g=_(o[w]);const V=g[0];if(g=g[1],typeof g!="string")continue;g=g.trim();const W=u[V]||[];u[V]=W,W.push(g)}j(u,function(w){return w.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function _n(o,u,g){return g&&g.internalChannelParams&&g.internalChannelParams[o]||u}function Tc(o){this.Aa=0,this.i=[],this.j=new qe,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=_n("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=_n("baseRetryDelayMs",5e3,o),this.cb=_n("retryDelaySeedMs",1e4,o),this.Wa=_n("forwardChannelMaxRetries",2,o),this.wa=_n("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new cc(o&&o.concurrentRequestLimit),this.Da=new Gg,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=Tc.prototype,r.la=8,r.G=1,r.connect=function(o,u,g,w){De(0),this.W=o,this.H=u||{},g&&w!==void 0&&(this.H.OSID=g,this.H.OAID=w),this.F=this.X,this.I=Oc(this,null,this.W),Aa(this)};function ro(o){if(Sc(o),o.G==3){var u=o.U++,g=Er(o.I);if(et(g,"SID",o.K),et(g,"RID",u),et(g,"TYPE","terminate"),kn(o,g),u=new Ur(o,o.j,u),u.L=2,u.v=Ea(Er(g)),g=!1,c.navigator&&c.navigator.sendBeacon)try{g=c.navigator.sendBeacon(u.v.toString(),"")}catch{}!g&&c.Image&&(new Image().src=u.v,g=!0),g||(u.g=Vc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),_a(u)}Mc(o)}function Sa(o){o.g&&(no(o),o.g.cancel(),o.g=null)}function Sc(o){Sa(o),o.u&&(c.clearTimeout(o.u),o.u=null),Ca(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&c.clearTimeout(o.s),o.s=null)}function Aa(o){if(!dc(o.h)&&!o.s){o.s=!0;var u=o.Ga;B||re(),Y||(B(),Y=!0),ce.add(u,o),o.B=0}}function Jg(o,u){return uc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Xe(b(o.Ga,o,u),$c(o,o.B)),o.B++,!0)}r.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const V=new Ur(this,this.j,o);let W=this.o;if(this.S&&(W?(W=y(W),f(W,this.S)):W=this.S),this.m!==null||this.O||(V.H=W,W=null),this.P)e:{for(var u=0,g=0;g<this.i.length;g++){t:{var w=this.i[g];if("__data__"in w.map&&(w=w.map.__data__,typeof w=="string")){w=w.length;break t}w=void 0}if(w===void 0)break;if(u+=w,4096<u){u=g;break e}if(u===4096||g===this.i.length-1){u=g+1;break e}}u=1e3}else u=1e3;u=Cc(this,V,u),g=Er(this.I),et(g,"RID",o),et(g,"CVER",22),this.D&&et(g,"X-HTTP-Session-Id",this.D),kn(this,g),W&&(this.O?u="headers="+encodeURIComponent(String(_c(W)))+"&"+u:this.m&&to(g,this.m,W)),eo(this.h,V),this.Ua&&et(g,"TYPE","init"),this.P?(et(g,"$req",u),et(g,"SID","null"),V.T=!0,Yi(V,g,null)):Yi(V,g,u),this.G=2}}else this.G==3&&(o?Ac(this,o):this.i.length==0||dc(this.h)||Ac(this))};function Ac(o,u){var g;u?g=u.l:g=o.U++;const w=Er(o.I);et(w,"SID",o.K),et(w,"RID",g),et(w,"AID",o.T),kn(o,w),o.m&&o.o&&to(w,o.m,o.o),g=new Ur(o,o.j,g,o.B+1),o.m===null&&(g.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Cc(o,g,1e3),g.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),eo(o.h,g),Yi(g,w,u)}function kn(o,u){o.H&&Z(o.H,function(g,w){et(u,w,g)}),o.l&&gc({},function(g,w){et(u,w,g)})}function Cc(o,u,g){g=Math.min(o.i.length,g);var w=o.l?b(o.l.Na,o.l,o):null;e:{var V=o.i;let W=-1;for(;;){const le=["count="+g];W==-1?0<g?(W=V[0].g,le.push("ofs="+W)):W=0:le.push("ofs="+W);let Je=!0;for(let kt=0;kt<g;kt++){let We=V[kt].g;const Ct=V[kt].map;if(We-=W,0>We)W=Math.max(0,V[kt].g-100),Je=!1;else try{Kg(Ct,le,"req"+We+"_")}catch{w&&w(Ct)}}if(Je){w=le.join("&");break e}}}return o=o.i.splice(0,g),u.D=o,w}function Rc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;B||re(),Y||(B(),Y=!0),ce.add(u,o),o.v=0}}function so(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Xe(b(o.Fa,o),$c(o,o.v)),o.v++,!0)}r.Fa=function(){if(this.u=null,Dc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Xe(b(this.ab,this),o)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,De(10),Sa(this),Dc(this))};function no(o){o.A!=null&&(c.clearTimeout(o.A),o.A=null)}function Dc(o){o.g=new Ur(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=Er(o.qa);et(u,"RID","rpc"),et(u,"SID",o.K),et(u,"AID",o.T),et(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&et(u,"TO",o.ja),et(u,"TYPE","xmlhttp"),kn(o,u),o.m&&o.o&&to(u,o.m,o.o),o.L&&(o.g.I=o.L);var g=o.g;o=o.ia,g.L=1,g.v=Ea(Er(u)),g.m=null,g.P=!0,ic(g,o)}r.Za=function(){this.C!=null&&(this.C=null,Sa(this),so(this),De(19))};function Ca(o){o.C!=null&&(c.clearTimeout(o.C),o.C=null)}function Pc(o,u){var g=null;if(o.g==u){Ca(o),no(o),o.g=null;var w=2}else if(Zi(o.h,u))g=u.D,hc(o.h,u),w=1;else return;if(o.G!=0){if(u.o)if(w==1){g=u.m?u.m.length:0,u=Date.now()-u.F;var V=o.B;w=ds(),be(w,new rt(w,g)),Aa(o)}else Rc(o);else if(V=u.s,V==3||V==0&&0<u.X||!(w==1&&Jg(o,u)||w==2&&so(o)))switch(g&&0<g.length&&(u=o.h,u.i=u.i.concat(g)),V){case 1:ms(o,5);break;case 4:ms(o,10);break;case 3:ms(o,6);break;default:ms(o,2)}}}function $c(o,u){let g=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(g*=2),g*u}function ms(o,u){if(o.j.info("Error code "+u),u==2){var g=b(o.fb,o),w=o.Xa;const V=!w;w=new hs(w||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||ka(w,"https"),Ea(w),V?zg(w.toString(),g):Hg(w.toString(),g)}else De(2);o.G=0,o.l&&o.l.sa(u),Mc(o),Sc(o)}r.fb=function(o){o?(this.j.info("Successfully pinged google.com"),De(2)):(this.j.info("Failed to ping google.com"),De(1))};function Mc(o){if(o.G=0,o.ka=[],o.l){const u=mc(o.h);(u.length!=0||o.i.length!=0)&&(E(o.ka,u),E(o.ka,o.i),o.h.i.length=0,T(o.i),o.i.length=0),o.l.ra()}}function Oc(o,u,g){var w=g instanceof hs?Er(g):new hs(g);if(w.g!="")u&&(w.g=u+"."+w.g),Na(w,w.s);else{var V=c.location;w=V.protocol,u=u?u+"."+V.hostname:V.hostname,V=+V.port;var W=new hs(null);w&&ka(W,w),u&&(W.g=u),V&&Na(W,V),g&&(W.l=g),w=W}return g=o.D,u=o.ya,g&&u&&et(w,g,u),et(w,"VER",o.la),kn(o,w),w}function Vc(o,u,g){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new it(new ja({eb:g})):new it(o.pa),u.Ha(o.J),u}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Lc(){}r=Lc.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function Ra(){}Ra.prototype.g=function(o,u){return new Gt(o,u)};function Gt(o,u){ne.call(this),this.g=new Tc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!O(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!O(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Os(this)}N(Gt,ne),Gt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Gt.prototype.close=function(){ro(this.g)},Gt.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var g={};g.__data__=o,o=g}else this.u&&(g={},g.__data__=Ge(o),o=g);u.i.push(new $g(u.Ya++,o)),u.G==3&&Aa(u)},Gt.prototype.N=function(){this.g.l=null,delete this.j,ro(this.g),delete this.g,Gt.aa.N.call(this)};function Fc(o){_t.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const g in u){o=g;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}N(Fc,_t);function Uc(){$s.call(this),this.status=1}N(Uc,$s);function Os(o){this.g=o}N(Os,Lc),Os.prototype.ua=function(){be(this.g,"a")},Os.prototype.ta=function(o){be(this.g,new Fc(o))},Os.prototype.sa=function(o){be(this.g,new Uc)},Os.prototype.ra=function(){be(this.g,"b")},Ra.prototype.createWebChannel=Ra.prototype.g,Gt.prototype.send=Gt.prototype.o,Gt.prototype.open=Gt.prototype.m,Gt.prototype.close=Gt.prototype.close,vh=function(){return new Ra},bh=function(){return ds()},yh=kr,Po={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},ot.NO_ERROR=0,ot.TIMEOUT=8,ot.HTTP_ERROR=6,za=ot,ir.COMPLETE="complete",xh=ir,Ae.EventType=Se,Se.OPEN="a",Se.CLOSE="b",Se.ERROR="c",Se.MESSAGE="d",ne.prototype.listen=ne.prototype.K,An=Ae,it.prototype.listenOnce=it.prototype.L,it.prototype.getLastError=it.prototype.Ka,it.prototype.getLastErrorCode=it.prototype.Ba,it.prototype.getStatus=it.prototype.Z,it.prototype.getResponseJson=it.prototype.Oa,it.prototype.getResponseText=it.prototype.oa,it.prototype.send=it.prototype.ea,it.prototype.setWithCredentials=it.prototype.Ha,fh=it}).apply(typeof Pa<"u"?Pa:typeof self<"u"?self:typeof window<"u"?window:{});const hd="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Pt.UNAUTHENTICATED=new Pt(null),Pt.GOOGLE_CREDENTIALS=new Pt("google-credentials-uid"),Pt.FIRST_PARTY=new Pt("first-party-uid"),Pt.MOCK_USER=new Pt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let cn="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ks=new il("@firebase/firestore");function Nn(){return ks.logLevel}function ke(r,...e){if(ks.logLevel<=Fe.DEBUG){const t=e.map(cl);ks.debug(`Firestore (${cn}): ${r}`,...t)}}function Mr(r,...e){if(ks.logLevel<=Fe.ERROR){const t=e.map(cl);ks.error(`Firestore (${cn}): ${r}`,...t)}}function Js(r,...e){if(ks.logLevel<=Fe.WARN){const t=e.map(cl);ks.warn(`Firestore (${cn}): ${r}`,...t)}}function cl(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Re(r="Unexpected state"){const e=`FIRESTORE (${cn}) INTERNAL ASSERTION FAILED: `+r;throw Mr(e),new Error(e)}function Qe(r,e){r||Re()}function $e(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ve extends vr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ts{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class ex{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Pt.UNAUTHENTICATED))}shutdown(){}}class tx{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class rx{constructor(e){this.t=e,this.currentUser=Pt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Qe(this.o===void 0);let s=this.i;const a=d=>this.i!==s?(s=this.i,t(d)):Promise.resolve();let i=new ts;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new ts,e.enqueueRetryable(()=>a(this.currentUser))};const l=()=>{const d=i;e.enqueueRetryable(async()=>{await d.promise,await a(this.currentUser)})},c=d=>{ke("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=d,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit(d=>c(d)),setTimeout(()=>{if(!this.auth){const d=this.t.getImmediate({optional:!0});d?c(d):(ke("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new ts)}},0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(ke("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Qe(typeof s.accessToken=="string"),new wh(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Qe(e===null||typeof e=="string"),new Pt(e)}}class sx{constructor(e,t,s){this.l=e,this.h=t,this.P=s,this.type="FirstParty",this.user=Pt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class nx{constructor(e,t,s){this.l=e,this.h=t,this.P=s}getToken(){return Promise.resolve(new sx(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Pt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ax{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ix{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){Qe(this.o===void 0);const s=i=>{i.error!=null&&ke("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const l=i.token!==this.R;return this.R=i.token,ke("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>s(i))};const a=i=>{ke("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>a(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?a(i):ke("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Qe(typeof t.token=="string"),this.R=t.token,new ax(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ox(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<r;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const a=ox(40);for(let i=0;i<a.length;++i)s.length<20&&a[i]<t&&(s+=e.charAt(a[i]%e.length))}return s}}function ze(r,e){return r<e?-1:r>e?1:0}function Zs(r,e,t){return r.length===e.length&&r.every((s,a)=>t(s,e[a]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new ve(J.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new ve(J.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new ve(J.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new ve(J.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return xt.fromMillis(Date.now())}static fromDate(e){return xt.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*t));return new xt(t,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ze(this.nanoseconds,e.nanoseconds):ze(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Pe(e)}static min(){return new Pe(new xt(0,0))}static max(){return new Pe(new xt(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e,t,s){t===void 0?t=0:t>e.length&&Re(),s===void 0?s=e.length-t:s>e.length-t&&Re(),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return qn.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof qn?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let a=0;a<s;a++){const i=e.get(a),l=t.get(a);if(i<l)return-1;if(i>l)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class tt extends qn{construct(e,t,s){return new tt(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new ve(J.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(a=>a.length>0))}return new tt(t)}static emptyPath(){return new tt([])}}const lx=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class jt extends qn{construct(e,t,s){return new jt(e,t,s)}static isValidIdentifier(e){return lx.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),jt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new jt(["__name__"])}static fromServerFormat(e){const t=[];let s="",a=0;const i=()=>{if(s.length===0)throw new ve(J.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let l=!1;for(;a<e.length;){const c=e[a];if(c==="\\"){if(a+1===e.length)throw new ve(J.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const d=e[a+1];if(d!=="\\"&&d!=="."&&d!=="`")throw new ve(J.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=d,a+=2}else c==="`"?(l=!l,a++):c!=="."||l?(s+=c,a++):(i(),a++)}if(i(),l)throw new ve(J.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new jt(t)}static emptyPath(){return new jt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e){this.path=e}static fromPath(e){return new Ie(tt.fromString(e))}static fromName(e){return new Ie(tt.fromString(e).popFirst(5))}static empty(){return new Ie(tt.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&tt.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return tt.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Ie(new tt(e.slice()))}}function cx(r,e){const t=r.toTimestamp().seconds,s=r.toTimestamp().nanoseconds+1,a=Pe.fromTimestamp(s===1e9?new xt(t+1,0):new xt(t,s));return new ns(a,Ie.empty(),e)}function dx(r){return new ns(r.readTime,r.key,-1)}class ns{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new ns(Pe.min(),Ie.empty(),-1)}static max(){return new ns(Pe.max(),Ie.empty(),-1)}}function ux(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=Ie.comparator(r.documentKey,e.documentKey),t!==0?t:ze(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hx="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class mx{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function la(r){if(r.code!==J.FAILED_PRECONDITION||r.message!==hx)throw r;ke("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Re(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new te((s,a)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,a)},this.catchCallback=i=>{this.wrapFailure(t,i).next(s,a)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof te?t:te.resolve(t)}catch(t){return te.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):te.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):te.reject(t)}static resolve(e){return new te((t,s)=>{t(e)})}static reject(e){return new te((t,s)=>{s(e)})}static waitFor(e){return new te((t,s)=>{let a=0,i=0,l=!1;e.forEach(c=>{++a,c.next(()=>{++i,l&&i===a&&t()},d=>s(d))}),l=!0,i===a&&t()})}static or(e){let t=te.resolve(!1);for(const s of e)t=t.next(a=>a?te.resolve(a):s());return t}static forEach(e,t){const s=[];return e.forEach((a,i)=>{s.push(t.call(this,a,i))}),this.waitFor(s)}static mapArray(e,t){return new te((s,a)=>{const i=e.length,l=new Array(i);let c=0;for(let d=0;d<i;d++){const h=d;t(e[h]).next(m=>{l[h]=m,++c,c===i&&s(l)},m=>a(m))}})}static doWhile(e,t){return new te((s,a)=>{const i=()=>{e()===!0?t().next(()=>{i()},a):s()};i()})}}function gx(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function ca(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dl{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ie(s),this.se=s=>t.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}dl.oe=-1;function Ai(r){return r==null}function ai(r){return r===0&&1/r==-1/0}function px(r){return typeof r=="number"&&Number.isInteger(r)&&!ai(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function md(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function As(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function kh(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e,t){this.comparator=e,this.root=t||Et.EMPTY}insert(e,t){return new st(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Et.BLACK,null,null))}remove(e){return new st(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Et.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const a=this.comparator(e,s.key);if(a===0)return t+s.left.size;a<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,s)=>(e(t,s),!1))}toString(){const e=[];return this.inorderTraversal((t,s)=>(e.push(`${t}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new $a(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new $a(this.root,e,this.comparator,!1)}getReverseIterator(){return new $a(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new $a(this.root,e,this.comparator,!0)}}class $a{constructor(e,t,s,a){this.isReverse=a,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?s(e.key,t):1,t&&a&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Et{constructor(e,t,s,a,i){this.key=e,this.value=t,this.color=s??Et.RED,this.left=a??Et.EMPTY,this.right=i??Et.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,a,i){return new Et(e??this.key,t??this.value,s??this.color,a??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let a=this;const i=s(e,a.key);return a=i<0?a.copy(null,null,null,a.left.insert(e,t,s),null):i===0?a.copy(null,t,null,null,null):a.copy(null,null,null,null,a.right.insert(e,t,s)),a.fixUp()}removeMin(){if(this.left.isEmpty())return Et.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,a=this;if(t(e,a.key)<0)a.left.isEmpty()||a.left.isRed()||a.left.left.isRed()||(a=a.moveRedLeft()),a=a.copy(null,null,null,a.left.remove(e,t),null);else{if(a.left.isRed()&&(a=a.rotateRight()),a.right.isEmpty()||a.right.isRed()||a.right.left.isRed()||(a=a.moveRedRight()),t(e,a.key)===0){if(a.right.isEmpty())return Et.EMPTY;s=a.right.min(),a=a.copy(s.key,s.value,null,null,a.right.removeMin())}a=a.copy(null,null,null,null,a.right.remove(e,t))}return a.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Et.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Et.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Re();const e=this.left.check();if(e!==this.right.check())throw Re();return e+(this.isRed()?0:1)}}Et.EMPTY=null,Et.RED=!0,Et.BLACK=!1;Et.EMPTY=new class{constructor(){this.size=0}get key(){throw Re()}get value(){throw Re()}get color(){throw Re()}get left(){throw Re()}get right(){throw Re()}copy(e,t,s,a,i){return this}insert(e,t,s){return new Et(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e){this.comparator=e,this.data=new st(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,s)=>(e(t),!1))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const a=s.getNext();if(this.comparator(a.key,e[1])>=0)return;t(a.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new gd(this.data.getIterator())}getIteratorFrom(e){return new gd(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(s=>{t=t.add(s)}),t}isEqual(e){if(!(e instanceof Tt)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const a=t.getNext().key,i=s.getNext().key;if(this.comparator(a,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Tt(this.comparator);return t.data=e,t}}class gd{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(e){this.fields=e,e.sort(jt.comparator)}static empty(){return new Qt([])}unionWith(e){let t=new Tt(jt.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new Qt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Zs(this.fields,e.fields,(t,s)=>t.isEqual(s))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(a){try{return atob(a)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Nh("Invalid base64 string: "+i):i}}(e);return new St(t)}static fromUint8Array(e){const t=function(a){let i="";for(let l=0;l<a.length;++l)i+=String.fromCharCode(a[l]);return i}(e);return new St(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let a=0;a<t.length;a++)s[a]=t.charCodeAt(a);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ze(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}St.EMPTY_BYTE_STRING=new St("");const fx=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function as(r){if(Qe(!!r),typeof r=="string"){let e=0;const t=fx.exec(r);if(Qe(!!t),t[1]){let a=t[1];a=(a+"000000000").substr(0,9),e=Number(a)}const s=new Date(r);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:lt(r.seconds),nanos:lt(r.nanos)}}function lt(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Ns(r){return typeof r=="string"?St.fromBase64String(r):St.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ul(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function hl(r){const e=r.mapValue.fields.__previous_value__;return ul(e)?hl(e):e}function Wn(r){const e=as(r.mapValue.fields.__local_write_time__.timestampValue);return new xt(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xx{constructor(e,t,s,a,i,l,c,d,h){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=a,this.ssl=i,this.forceLongPolling=l,this.autoDetectLongPolling=c,this.longPollingOptions=d,this.useFetchStreams=h}}class zn{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new zn("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof zn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ma={mapValue:{}};function Es(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?ul(r)?4:bx(r)?9007199254740991:yx(r)?10:11:Re()}function xr(r,e){if(r===e)return!0;const t=Es(r);if(t!==Es(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Wn(r).isEqual(Wn(e));case 3:return function(a,i){if(typeof a.timestampValue=="string"&&typeof i.timestampValue=="string"&&a.timestampValue.length===i.timestampValue.length)return a.timestampValue===i.timestampValue;const l=as(a.timestampValue),c=as(i.timestampValue);return l.seconds===c.seconds&&l.nanos===c.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(a,i){return Ns(a.bytesValue).isEqual(Ns(i.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(a,i){return lt(a.geoPointValue.latitude)===lt(i.geoPointValue.latitude)&&lt(a.geoPointValue.longitude)===lt(i.geoPointValue.longitude)}(r,e);case 2:return function(a,i){if("integerValue"in a&&"integerValue"in i)return lt(a.integerValue)===lt(i.integerValue);if("doubleValue"in a&&"doubleValue"in i){const l=lt(a.doubleValue),c=lt(i.doubleValue);return l===c?ai(l)===ai(c):isNaN(l)&&isNaN(c)}return!1}(r,e);case 9:return Zs(r.arrayValue.values||[],e.arrayValue.values||[],xr);case 10:case 11:return function(a,i){const l=a.mapValue.fields||{},c=i.mapValue.fields||{};if(md(l)!==md(c))return!1;for(const d in l)if(l.hasOwnProperty(d)&&(c[d]===void 0||!xr(l[d],c[d])))return!1;return!0}(r,e);default:return Re()}}function Hn(r,e){return(r.values||[]).find(t=>xr(t,e))!==void 0}function en(r,e){if(r===e)return 0;const t=Es(r),s=Es(e);if(t!==s)return ze(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return ze(r.booleanValue,e.booleanValue);case 2:return function(i,l){const c=lt(i.integerValue||i.doubleValue),d=lt(l.integerValue||l.doubleValue);return c<d?-1:c>d?1:c===d?0:isNaN(c)?isNaN(d)?0:-1:1}(r,e);case 3:return pd(r.timestampValue,e.timestampValue);case 4:return pd(Wn(r),Wn(e));case 5:return ze(r.stringValue,e.stringValue);case 6:return function(i,l){const c=Ns(i),d=Ns(l);return c.compareTo(d)}(r.bytesValue,e.bytesValue);case 7:return function(i,l){const c=i.split("/"),d=l.split("/");for(let h=0;h<c.length&&h<d.length;h++){const m=ze(c[h],d[h]);if(m!==0)return m}return ze(c.length,d.length)}(r.referenceValue,e.referenceValue);case 8:return function(i,l){const c=ze(lt(i.latitude),lt(l.latitude));return c!==0?c:ze(lt(i.longitude),lt(l.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return fd(r.arrayValue,e.arrayValue);case 10:return function(i,l){var c,d,h,m;const x=i.fields||{},b=l.fields||{},I=(c=x.value)===null||c===void 0?void 0:c.arrayValue,N=(d=b.value)===null||d===void 0?void 0:d.arrayValue,T=ze(((h=I==null?void 0:I.values)===null||h===void 0?void 0:h.length)||0,((m=N==null?void 0:N.values)===null||m===void 0?void 0:m.length)||0);return T!==0?T:fd(I,N)}(r.mapValue,e.mapValue);case 11:return function(i,l){if(i===Ma.mapValue&&l===Ma.mapValue)return 0;if(i===Ma.mapValue)return 1;if(l===Ma.mapValue)return-1;const c=i.fields||{},d=Object.keys(c),h=l.fields||{},m=Object.keys(h);d.sort(),m.sort();for(let x=0;x<d.length&&x<m.length;++x){const b=ze(d[x],m[x]);if(b!==0)return b;const I=en(c[d[x]],h[m[x]]);if(I!==0)return I}return ze(d.length,m.length)}(r.mapValue,e.mapValue);default:throw Re()}}function pd(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return ze(r,e);const t=as(r),s=as(e),a=ze(t.seconds,s.seconds);return a!==0?a:ze(t.nanos,s.nanos)}function fd(r,e){const t=r.values||[],s=e.values||[];for(let a=0;a<t.length&&a<s.length;++a){const i=en(t[a],s[a]);if(i)return i}return ze(t.length,s.length)}function tn(r){return $o(r)}function $o(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const s=as(t);return`time(${s.seconds},${s.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return Ns(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return Ie.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let s="[",a=!0;for(const i of t.values||[])a?a=!1:s+=",",s+=$o(i);return s+"]"}(r.arrayValue):"mapValue"in r?function(t){const s=Object.keys(t.fields||{}).sort();let a="{",i=!0;for(const l of s)i?i=!1:a+=",",a+=`${l}:${$o(t.fields[l])}`;return a+"}"}(r.mapValue):Re()}function xd(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Mo(r){return!!r&&"integerValue"in r}function ml(r){return!!r&&"arrayValue"in r}function yd(r){return!!r&&"nullValue"in r}function bd(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Ha(r){return!!r&&"mapValue"in r}function yx(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Dn(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return As(r.mapValue.fields,(t,s)=>e.mapValue.fields[t]=Dn(s)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Dn(r.arrayValue.values[t]);return e}return Object.assign({},r)}function bx(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e){this.value=e}static empty(){return new Wt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!Ha(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Dn(t)}setAll(e){let t=jt.emptyPath(),s={},a=[];e.forEach((l,c)=>{if(!t.isImmediateParentOf(c)){const d=this.getFieldsMap(t);this.applyChanges(d,s,a),s={},a=[],t=c.popLast()}l?s[c.lastSegment()]=Dn(l):a.push(c.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,s,a)}delete(e){const t=this.field(e.popLast());Ha(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return xr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let a=t.mapValue.fields[e.get(s)];Ha(a)&&a.mapValue.fields||(a={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=a),t=a}return t.mapValue.fields}applyChanges(e,t,s){As(t,(a,i)=>e[a]=i);for(const a of s)delete e[a]}clone(){return new Wt(Dn(this.value))}}function Eh(r){const e=[];return As(r.fields,(t,s)=>{const a=new jt([t]);if(Ha(s)){const i=Eh(s.mapValue).fields;if(i.length===0)e.push(a);else for(const l of i)e.push(a.child(l))}else e.push(a)}),new Qt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e,t,s,a,i,l,c){this.key=e,this.documentType=t,this.version=s,this.readTime=a,this.createTime=i,this.data=l,this.documentState=c}static newInvalidDocument(e){return new $t(e,0,Pe.min(),Pe.min(),Pe.min(),Wt.empty(),0)}static newFoundDocument(e,t,s,a){return new $t(e,1,t,Pe.min(),s,a,0)}static newNoDocument(e,t){return new $t(e,2,t,Pe.min(),Pe.min(),Wt.empty(),0)}static newUnknownDocument(e,t){return new $t(e,3,t,Pe.min(),Pe.min(),Wt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Pe.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Wt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Wt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Pe.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof $t&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new $t(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ii{constructor(e,t){this.position=e,this.inclusive=t}}function vd(r,e,t){let s=0;for(let a=0;a<r.position.length;a++){const i=e[a],l=r.position[a];if(i.field.isKeyField()?s=Ie.comparator(Ie.fromName(l.referenceValue),t.key):s=en(l,t.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function wd(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!xr(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn{constructor(e,t="asc"){this.field=e,this.dir=t}}function vx(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{}class mt extends jh{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new _x(e,t,s):t==="array-contains"?new Ex(e,s):t==="in"?new jx(e,s):t==="not-in"?new Ix(e,s):t==="array-contains-any"?new Tx(e,s):new mt(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new kx(e,s):new Nx(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(en(t,this.value)):t!==null&&Es(this.value)===Es(t)&&this.matchesComparison(en(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Re()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class nr extends jh{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new nr(e,t)}matches(e){return Ih(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Ih(r){return r.op==="and"}function Th(r){return wx(r)&&Ih(r)}function wx(r){for(const e of r.filters)if(e instanceof nr)return!1;return!0}function Oo(r){if(r instanceof mt)return r.field.canonicalString()+r.op.toString()+tn(r.value);if(Th(r))return r.filters.map(e=>Oo(e)).join(",");{const e=r.filters.map(t=>Oo(t)).join(",");return`${r.op}(${e})`}}function Sh(r,e){return r instanceof mt?function(s,a){return a instanceof mt&&s.op===a.op&&s.field.isEqual(a.field)&&xr(s.value,a.value)}(r,e):r instanceof nr?function(s,a){return a instanceof nr&&s.op===a.op&&s.filters.length===a.filters.length?s.filters.reduce((i,l,c)=>i&&Sh(l,a.filters[c]),!0):!1}(r,e):void Re()}function Ah(r){return r instanceof mt?function(t){return`${t.field.canonicalString()} ${t.op} ${tn(t.value)}`}(r):r instanceof nr?function(t){return t.op.toString()+" {"+t.getFilters().map(Ah).join(" ,")+"}"}(r):"Filter"}class _x extends mt{constructor(e,t,s){super(e,t,s),this.key=Ie.fromName(s.referenceValue)}matches(e){const t=Ie.comparator(e.key,this.key);return this.matchesComparison(t)}}class kx extends mt{constructor(e,t){super(e,"in",t),this.keys=Ch("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Nx extends mt{constructor(e,t){super(e,"not-in",t),this.keys=Ch("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Ch(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(s=>Ie.fromName(s.referenceValue))}class Ex extends mt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ml(t)&&Hn(t.arrayValue,this.value)}}class jx extends mt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Hn(this.value.arrayValue,t)}}class Ix extends mt{constructor(e,t){super(e,"not-in",t)}matches(e){if(Hn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Hn(this.value.arrayValue,t)}}class Tx extends mt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ml(t)||!t.arrayValue.values)&&t.arrayValue.values.some(s=>Hn(this.value.arrayValue,s))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sx{constructor(e,t=null,s=[],a=[],i=null,l=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=a,this.limit=i,this.startAt=l,this.endAt=c,this.ue=null}}function _d(r,e=null,t=[],s=[],a=null,i=null,l=null){return new Sx(r,e,t,s,a,i,l)}function gl(r){const e=$e(r);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(s=>Oo(s)).join(","),t+="|ob:",t+=e.orderBy.map(s=>function(i){return i.field.canonicalString()+i.dir}(s)).join(","),Ai(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(s=>tn(s)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(s=>tn(s)).join(",")),e.ue=t}return e.ue}function pl(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!vx(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Sh(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!wd(r.startAt,e.startAt)&&wd(r.endAt,e.endAt)}function Vo(r){return Ie.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{constructor(e,t=null,s=[],a=[],i=null,l="F",c=null,d=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=a,this.limit=i,this.limitType=l,this.startAt=c,this.endAt=d,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Ax(r,e,t,s,a,i,l,c){return new dn(r,e,t,s,a,i,l,c)}function Rh(r){return new dn(r)}function kd(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Dh(r){return r.collectionGroup!==null}function Pn(r){const e=$e(r);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(l){let c=new Tt(jt.comparator);return l.filters.forEach(d=>{d.getFlattenedFilters().forEach(h=>{h.isInequality()&&(c=c.add(h.field))})}),c})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new Gn(i,s))}),t.has(jt.keyField().canonicalString())||e.ce.push(new Gn(jt.keyField(),s))}return e.ce}function mr(r){const e=$e(r);return e.le||(e.le=Cx(e,Pn(r))),e.le}function Cx(r,e){if(r.limitType==="F")return _d(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(a=>{const i=a.dir==="desc"?"asc":"desc";return new Gn(a.field,i)});const t=r.endAt?new ii(r.endAt.position,r.endAt.inclusive):null,s=r.startAt?new ii(r.startAt.position,r.startAt.inclusive):null;return _d(r.path,r.collectionGroup,e,r.filters,r.limit,t,s)}}function Lo(r,e){const t=r.filters.concat([e]);return new dn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function Fo(r,e,t){return new dn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Ci(r,e){return pl(mr(r),mr(e))&&r.limitType===e.limitType}function Ph(r){return`${gl(mr(r))}|lt:${r.limitType}`}function Fs(r){return`Query(target=${function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map(a=>Ah(a)).join(", ")}]`),Ai(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map(a=>function(l){return`${l.field.canonicalString()} (${l.dir})`}(a)).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map(a=>tn(a)).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map(a=>tn(a)).join(",")),`Target(${s})`}(mr(r))}; limitType=${r.limitType})`}function Ri(r,e){return e.isFoundDocument()&&function(s,a){const i=a.key.path;return s.collectionGroup!==null?a.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(i):Ie.isDocumentKey(s.path)?s.path.isEqual(i):s.path.isImmediateParentOf(i)}(r,e)&&function(s,a){for(const i of Pn(s))if(!i.field.isKeyField()&&a.data.field(i.field)===null)return!1;return!0}(r,e)&&function(s,a){for(const i of s.filters)if(!i.matches(a))return!1;return!0}(r,e)&&function(s,a){return!(s.startAt&&!function(l,c,d){const h=vd(l,c,d);return l.inclusive?h<=0:h<0}(s.startAt,Pn(s),a)||s.endAt&&!function(l,c,d){const h=vd(l,c,d);return l.inclusive?h>=0:h>0}(s.endAt,Pn(s),a))}(r,e)}function Rx(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function $h(r){return(e,t)=>{let s=!1;for(const a of Pn(r)){const i=Dx(a,e,t);if(i!==0)return i;s=s||a.field.isKeyField()}return 0}}function Dx(r,e,t){const s=r.field.isKeyField()?Ie.comparator(e.key,t.key):function(i,l,c){const d=l.data.field(i),h=c.data.field(i);return d!==null&&h!==null?en(d,h):Re()}(r.field,e,t);switch(r.dir){case"asc":return s;case"desc":return-1*s;default:return Re()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[a,i]of s)if(this.equalsFn(a,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),a=this.inner[s];if(a===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let i=0;i<a.length;i++)if(this.equalsFn(a[i][0],e))return void(a[i]=[e,t]);a.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let a=0;a<s.length;a++)if(this.equalsFn(s[a][0],e))return s.length===1?delete this.inner[t]:s.splice(a,1),this.innerSize--,!0;return!1}forEach(e){As(this.inner,(t,s)=>{for(const[a,i]of s)e(a,i)})}isEmpty(){return kh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Px=new st(Ie.comparator);function Or(){return Px}const Mh=new st(Ie.comparator);function Cn(...r){let e=Mh;for(const t of r)e=e.insert(t.key,t);return e}function Oh(r){let e=Mh;return r.forEach((t,s)=>e=e.insert(t,s.overlayedDocument)),e}function fs(){return $n()}function Vh(){return $n()}function $n(){return new un(r=>r.toString(),(r,e)=>r.isEqual(e))}const $x=new st(Ie.comparator),Mx=new Tt(Ie.comparator);function Ve(...r){let e=Mx;for(const t of r)e=e.add(t);return e}const Ox=new Tt(ze);function Vx(){return Ox}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fl(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ai(e)?"-0":e}}function Lh(r){return{integerValue:""+r}}function Lx(r,e){return px(e)?Lh(e):fl(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(){this._=void 0}}function Fx(r,e,t){return r instanceof oi?function(a,i){const l={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:a.seconds,nanos:a.nanoseconds}}}};return i&&ul(i)&&(i=hl(i)),i&&(l.fields.__previous_value__=i),{mapValue:l}}(t,e):r instanceof Kn?Uh(r,e):r instanceof Qn?Bh(r,e):function(a,i){const l=Fh(a,i),c=Nd(l)+Nd(a.Pe);return Mo(l)&&Mo(a.Pe)?Lh(c):fl(a.serializer,c)}(r,e)}function Ux(r,e,t){return r instanceof Kn?Uh(r,e):r instanceof Qn?Bh(r,e):t}function Fh(r,e){return r instanceof li?function(s){return Mo(s)||function(i){return!!i&&"doubleValue"in i}(s)}(e)?e:{integerValue:0}:null}class oi extends Di{}class Kn extends Di{constructor(e){super(),this.elements=e}}function Uh(r,e){const t=qh(e);for(const s of r.elements)t.some(a=>xr(a,s))||t.push(s);return{arrayValue:{values:t}}}class Qn extends Di{constructor(e){super(),this.elements=e}}function Bh(r,e){let t=qh(e);for(const s of r.elements)t=t.filter(a=>!xr(a,s));return{arrayValue:{values:t}}}class li extends Di{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Nd(r){return lt(r.integerValue||r.doubleValue)}function qh(r){return ml(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}function Bx(r,e){return r.field.isEqual(e.field)&&function(s,a){return s instanceof Kn&&a instanceof Kn||s instanceof Qn&&a instanceof Qn?Zs(s.elements,a.elements,xr):s instanceof li&&a instanceof li?xr(s.Pe,a.Pe):s instanceof oi&&a instanceof oi}(r.transform,e.transform)}class qx{constructor(e,t){this.version=e,this.transformResults=t}}class rr{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rr}static exists(e){return new rr(void 0,e)}static updateTime(e){return new rr(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Ga(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Pi{}function Wh(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new xl(r.key,rr.none()):new da(r.key,r.data,rr.none());{const t=r.data,s=Wt.empty();let a=new Tt(jt.comparator);for(let i of e.fields)if(!a.has(i)){let l=t.field(i);l===null&&i.length>1&&(i=i.popLast(),l=t.field(i)),l===null?s.delete(i):s.set(i,l),a=a.add(i)}return new os(r.key,s,new Qt(a.toArray()),rr.none())}}function Wx(r,e,t){r instanceof da?function(a,i,l){const c=a.value.clone(),d=jd(a.fieldTransforms,i,l.transformResults);c.setAll(d),i.convertToFoundDocument(l.version,c).setHasCommittedMutations()}(r,e,t):r instanceof os?function(a,i,l){if(!Ga(a.precondition,i))return void i.convertToUnknownDocument(l.version);const c=jd(a.fieldTransforms,i,l.transformResults),d=i.data;d.setAll(zh(a)),d.setAll(c),i.convertToFoundDocument(l.version,d).setHasCommittedMutations()}(r,e,t):function(a,i,l){i.convertToNoDocument(l.version).setHasCommittedMutations()}(0,e,t)}function Mn(r,e,t,s){return r instanceof da?function(i,l,c,d){if(!Ga(i.precondition,l))return c;const h=i.value.clone(),m=Id(i.fieldTransforms,d,l);return h.setAll(m),l.convertToFoundDocument(l.version,h).setHasLocalMutations(),null}(r,e,t,s):r instanceof os?function(i,l,c,d){if(!Ga(i.precondition,l))return c;const h=Id(i.fieldTransforms,d,l),m=l.data;return m.setAll(zh(i)),m.setAll(h),l.convertToFoundDocument(l.version,m).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(x=>x.field))}(r,e,t,s):function(i,l,c){return Ga(i.precondition,l)?(l.convertToNoDocument(l.version).setHasLocalMutations(),null):c}(r,e,t)}function zx(r,e){let t=null;for(const s of r.fieldTransforms){const a=e.data.field(s.field),i=Fh(s.transform,a||null);i!=null&&(t===null&&(t=Wt.empty()),t.set(s.field,i))}return t||null}function Ed(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(s,a){return s===void 0&&a===void 0||!(!s||!a)&&Zs(s,a,(i,l)=>Bx(i,l))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class da extends Pi{constructor(e,t,s,a=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=a,this.type=0}getFieldMask(){return null}}class os extends Pi{constructor(e,t,s,a,i=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=a,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function zh(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const s=r.data.field(t);e.set(t,s)}}),e}function jd(r,e,t){const s=new Map;Qe(r.length===t.length);for(let a=0;a<t.length;a++){const i=r[a],l=i.transform,c=e.data.field(i.field);s.set(i.field,Ux(l,c,t[a]))}return s}function Id(r,e,t){const s=new Map;for(const a of r){const i=a.transform,l=t.data.field(a.field);s.set(a.field,Fx(i,l,e))}return s}class xl extends Pi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Hx extends Pi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gx{constructor(e,t,s,a){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=a}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let a=0;a<this.mutations.length;a++){const i=this.mutations[a];i.key.isEqual(e.key)&&Wx(i,e,s[a])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Mn(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Mn(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=Vh();return this.mutations.forEach(a=>{const i=e.get(a.key),l=i.overlayedDocument;let c=this.applyToLocalView(l,i.mutatedFields);c=t.has(a.key)?null:c;const d=Wh(l,c);d!==null&&s.set(a.key,d),l.isValidDocument()||l.convertToNoDocument(Pe.min())}),s}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Ve())}isEqual(e){return this.batchId===e.batchId&&Zs(this.mutations,e.mutations,(t,s)=>Ed(t,s))&&Zs(this.baseMutations,e.baseMutations,(t,s)=>Ed(t,s))}}class yl{constructor(e,t,s,a){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=a}static from(e,t,s){Qe(e.mutations.length===s.length);let a=function(){return $x}();const i=e.mutations;for(let l=0;l<i.length;l++)a=a.insert(i[l].key,s[l].version);return new yl(e,t,s,a)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kx{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qx{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ht,Be;function Yx(r){switch(r){default:return Re();case J.CANCELLED:case J.UNKNOWN:case J.DEADLINE_EXCEEDED:case J.RESOURCE_EXHAUSTED:case J.INTERNAL:case J.UNAVAILABLE:case J.UNAUTHENTICATED:return!1;case J.INVALID_ARGUMENT:case J.NOT_FOUND:case J.ALREADY_EXISTS:case J.PERMISSION_DENIED:case J.FAILED_PRECONDITION:case J.ABORTED:case J.OUT_OF_RANGE:case J.UNIMPLEMENTED:case J.DATA_LOSS:return!0}}function Hh(r){if(r===void 0)return Mr("GRPC error has no .code"),J.UNKNOWN;switch(r){case ht.OK:return J.OK;case ht.CANCELLED:return J.CANCELLED;case ht.UNKNOWN:return J.UNKNOWN;case ht.DEADLINE_EXCEEDED:return J.DEADLINE_EXCEEDED;case ht.RESOURCE_EXHAUSTED:return J.RESOURCE_EXHAUSTED;case ht.INTERNAL:return J.INTERNAL;case ht.UNAVAILABLE:return J.UNAVAILABLE;case ht.UNAUTHENTICATED:return J.UNAUTHENTICATED;case ht.INVALID_ARGUMENT:return J.INVALID_ARGUMENT;case ht.NOT_FOUND:return J.NOT_FOUND;case ht.ALREADY_EXISTS:return J.ALREADY_EXISTS;case ht.PERMISSION_DENIED:return J.PERMISSION_DENIED;case ht.FAILED_PRECONDITION:return J.FAILED_PRECONDITION;case ht.ABORTED:return J.ABORTED;case ht.OUT_OF_RANGE:return J.OUT_OF_RANGE;case ht.UNIMPLEMENTED:return J.UNIMPLEMENTED;case ht.DATA_LOSS:return J.DATA_LOSS;default:return Re()}}(Be=ht||(ht={}))[Be.OK=0]="OK",Be[Be.CANCELLED=1]="CANCELLED",Be[Be.UNKNOWN=2]="UNKNOWN",Be[Be.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Be[Be.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Be[Be.NOT_FOUND=5]="NOT_FOUND",Be[Be.ALREADY_EXISTS=6]="ALREADY_EXISTS",Be[Be.PERMISSION_DENIED=7]="PERMISSION_DENIED",Be[Be.UNAUTHENTICATED=16]="UNAUTHENTICATED",Be[Be.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Be[Be.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Be[Be.ABORTED=10]="ABORTED",Be[Be.OUT_OF_RANGE=11]="OUT_OF_RANGE",Be[Be.UNIMPLEMENTED=12]="UNIMPLEMENTED",Be[Be.INTERNAL=13]="INTERNAL",Be[Be.UNAVAILABLE=14]="UNAVAILABLE",Be[Be.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xx(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jx=new ys([4294967295,4294967295],0);function Td(r){const e=Xx().encode(r),t=new ph;return t.update(e),new Uint8Array(t.digest())}function Sd(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),a=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new ys([t,s],0),new ys([a,i],0)]}class bl{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Rn(`Invalid padding: ${t}`);if(s<0)throw new Rn(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Rn(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Rn(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=ys.fromNumber(this.Ie)}Ee(e,t,s){let a=e.add(t.multiply(ys.fromNumber(s)));return a.compare(Jx)===1&&(a=new ys([a.getBits(0),a.getBits(1)],0)),a.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Td(e),[s,a]=Sd(t);for(let i=0;i<this.hashCount;i++){const l=this.Ee(s,a,i);if(!this.de(l))return!1}return!0}static create(e,t,s){const a=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),l=new bl(i,a,t);return s.forEach(c=>l.insert(c)),l}insert(e){if(this.Ie===0)return;const t=Td(e),[s,a]=Sd(t);for(let i=0;i<this.hashCount;i++){const l=this.Ee(s,a,i);this.Ae(l)}}Ae(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Rn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,t,s,a,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=a,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const a=new Map;return a.set(e,ua.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new $i(Pe.min(),a,new st(ze),Or(),Ve())}}class ua{constructor(e,t,s,a,i){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=a,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new ua(s,t,Ve(),Ve(),Ve())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ka{constructor(e,t,s,a){this.Re=e,this.removedTargetIds=t,this.key=s,this.Ve=a}}class Gh{constructor(e,t){this.targetId=e,this.me=t}}class Kh{constructor(e,t,s=St.EMPTY_BYTE_STRING,a=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=a}}class Ad{constructor(){this.fe=0,this.ge=Rd(),this.pe=St.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=Ve(),t=Ve(),s=Ve();return this.ge.forEach((a,i)=>{switch(i){case 0:e=e.add(a);break;case 2:t=t.add(a);break;case 1:s=s.add(a);break;default:Re()}}),new ua(this.pe,this.ye,e,t,s)}Ce(){this.we=!1,this.ge=Rd()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Qe(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class Zx{constructor(e){this.Le=e,this.Be=new Map,this.ke=Or(),this.qe=Cd(),this.Qe=new st(ze)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const s=this.Ge(t);switch(e.state){case 0:this.ze(t)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),s.De(e.resumeToken));break;default:Re()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((s,a)=>{this.ze(a)&&t(a)})}He(e){const t=e.targetId,s=e.me.count,a=this.Je(t);if(a){const i=a.target;if(Vo(i))if(s===0){const l=new Ie(i.path);this.Ue(t,l,$t.newNoDocument(l,Pe.min()))}else Qe(s===1);else{const l=this.Ye(t);if(l!==s){const c=this.Ze(e),d=c?this.Xe(c,e,l):1;if(d!==0){this.je(t);const h=d===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:a=0},hashCount:i=0}=t;let l,c;try{l=Ns(s).toUint8Array()}catch(d){if(d instanceof Nh)return Js("Decoding the base64 bloom filter in existence filter failed ("+d.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw d}try{c=new bl(l,a,i)}catch(d){return Js(d instanceof Rn?"BloomFilter error: ":"Applying bloom filter failed: ",d),null}return c.Ie===0?null:c}Xe(e,t,s){return t.me.count===s-this.nt(e,t.targetId)?0:2}nt(e,t){const s=this.Le.getRemoteKeysForTarget(t);let a=0;return s.forEach(i=>{const l=this.Le.tt(),c=`projects/${l.projectId}/databases/${l.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,i,null),a++)}),a}rt(e){const t=new Map;this.Be.forEach((i,l)=>{const c=this.Je(l);if(c){if(i.current&&Vo(c.target)){const d=new Ie(c.target.path);this.ke.get(d)!==null||this.it(l,d)||this.Ue(l,d,$t.newNoDocument(d,e))}i.be&&(t.set(l,i.ve()),i.Ce())}});let s=Ve();this.qe.forEach((i,l)=>{let c=!0;l.forEachWhile(d=>{const h=this.Je(d);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(s=s.add(i))}),this.ke.forEach((i,l)=>l.setReadTime(e));const a=new $i(e,t,this.Qe,this.ke,s);return this.ke=Or(),this.qe=Cd(),this.Qe=new st(ze),a}$e(e,t){if(!this.ze(e))return;const s=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,s),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,s){if(!this.ze(e))return;const a=this.Ge(e);this.it(e,t)?a.Fe(t,1):a.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),s&&(this.ke=this.ke.insert(t,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Ad,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new Tt(ze),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||ke("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Ad),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Cd(){return new st(Ie.comparator)}function Rd(){return new st(Ie.comparator)}const ey={asc:"ASCENDING",desc:"DESCENDING"},ty={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},ry={and:"AND",or:"OR"};class sy{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Uo(r,e){return r.useProto3Json||Ai(e)?e:{value:e}}function ci(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Qh(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function ny(r,e){return ci(r,e.toTimestamp())}function gr(r){return Qe(!!r),Pe.fromTimestamp(function(t){const s=as(t);return new xt(s.seconds,s.nanos)}(r))}function vl(r,e){return Bo(r,e).canonicalString()}function Bo(r,e){const t=function(a){return new tt(["projects",a.projectId,"databases",a.database])}(r).child("documents");return e===void 0?t:t.child(e)}function Yh(r){const e=tt.fromString(r);return Qe(tm(e)),e}function qo(r,e){return vl(r.databaseId,e.path)}function mo(r,e){const t=Yh(e);if(t.get(1)!==r.databaseId.projectId)throw new ve(J.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new ve(J.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new Ie(Jh(t))}function Xh(r,e){return vl(r.databaseId,e)}function ay(r){const e=Yh(r);return e.length===4?tt.emptyPath():Jh(e)}function Wo(r){return new tt(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Jh(r){return Qe(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}function Dd(r,e,t){return{name:qo(r,e),fields:t.value.mapValue.fields}}function iy(r,e){let t;if("targetChange"in e){e.targetChange;const s=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:Re()}(e.targetChange.targetChangeType||"NO_CHANGE"),a=e.targetChange.targetIds||[],i=function(h,m){return h.useProto3Json?(Qe(m===void 0||typeof m=="string"),St.fromBase64String(m||"")):(Qe(m===void 0||m instanceof Buffer||m instanceof Uint8Array),St.fromUint8Array(m||new Uint8Array))}(r,e.targetChange.resumeToken),l=e.targetChange.cause,c=l&&function(h){const m=h.code===void 0?J.UNKNOWN:Hh(h.code);return new ve(m,h.message||"")}(l);t=new Kh(s,a,i,c||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const a=mo(r,s.document.name),i=gr(s.document.updateTime),l=s.document.createTime?gr(s.document.createTime):Pe.min(),c=new Wt({mapValue:{fields:s.document.fields}}),d=$t.newFoundDocument(a,i,l,c),h=s.targetIds||[],m=s.removedTargetIds||[];t=new Ka(h,m,d.key,d)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const a=mo(r,s.document),i=s.readTime?gr(s.readTime):Pe.min(),l=$t.newNoDocument(a,i),c=s.removedTargetIds||[];t=new Ka([],c,l.key,l)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const a=mo(r,s.document),i=s.removedTargetIds||[];t=new Ka([],i,a,null)}else{if(!("filter"in e))return Re();{e.filter;const s=e.filter;s.targetId;const{count:a=0,unchangedNames:i}=s,l=new Qx(a,i),c=s.targetId;t=new Gh(c,l)}}return t}function oy(r,e){let t;if(e instanceof da)t={update:Dd(r,e.key,e.value)};else if(e instanceof xl)t={delete:qo(r,e.key)};else if(e instanceof os)t={update:Dd(r,e.key,e.data),updateMask:fy(e.fieldMask)};else{if(!(e instanceof Hx))return Re();t={verify:qo(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(s=>function(i,l){const c=l.transform;if(c instanceof oi)return{fieldPath:l.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Kn)return{fieldPath:l.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Qn)return{fieldPath:l.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof li)return{fieldPath:l.field.canonicalString(),increment:c.Pe};throw Re()}(0,s))),e.precondition.isNone||(t.currentDocument=function(a,i){return i.updateTime!==void 0?{updateTime:ny(a,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Re()}(r,e.precondition)),t}function ly(r,e){return r&&r.length>0?(Qe(e!==void 0),r.map(t=>function(a,i){let l=a.updateTime?gr(a.updateTime):gr(i);return l.isEqual(Pe.min())&&(l=gr(i)),new qx(l,a.transformResults||[])}(t,e))):[]}function cy(r,e){return{documents:[Xh(r,e.path)]}}function dy(r,e){const t={structuredQuery:{}},s=e.path;let a;e.collectionGroup!==null?(a=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(a=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Xh(r,a);const i=function(h){if(h.length!==0)return em(nr.create(h,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const l=function(h){if(h.length!==0)return h.map(m=>function(b){return{field:Us(b.field),direction:my(b.dir)}}(m))}(e.orderBy);l&&(t.structuredQuery.orderBy=l);const c=Uo(r,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:a}}function uy(r){let e=ay(r.parent);const t=r.structuredQuery,s=t.from?t.from.length:0;let a=null;if(s>0){Qe(s===1);const m=t.from[0];m.allDescendants?a=m.collectionId:e=e.child(m.collectionId)}let i=[];t.where&&(i=function(x){const b=Zh(x);return b instanceof nr&&Th(b)?b.getFilters():[b]}(t.where));let l=[];t.orderBy&&(l=function(x){return x.map(b=>function(N){return new Gn(Bs(N.field),function(E){switch(E){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(N.direction))}(b))}(t.orderBy));let c=null;t.limit&&(c=function(x){let b;return b=typeof x=="object"?x.value:x,Ai(b)?null:b}(t.limit));let d=null;t.startAt&&(d=function(x){const b=!!x.before,I=x.values||[];return new ii(I,b)}(t.startAt));let h=null;return t.endAt&&(h=function(x){const b=!x.before,I=x.values||[];return new ii(I,b)}(t.endAt)),Ax(e,a,l,i,c,"F",d,h)}function hy(r,e){const t=function(a){switch(a){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Re()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Zh(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=Bs(t.unaryFilter.field);return mt.create(s,"==",{doubleValue:NaN});case"IS_NULL":const a=Bs(t.unaryFilter.field);return mt.create(a,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Bs(t.unaryFilter.field);return mt.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const l=Bs(t.unaryFilter.field);return mt.create(l,"!=",{nullValue:"NULL_VALUE"});default:return Re()}}(r):r.fieldFilter!==void 0?function(t){return mt.create(Bs(t.fieldFilter.field),function(a){switch(a){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Re()}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return nr.create(t.compositeFilter.filters.map(s=>Zh(s)),function(a){switch(a){case"AND":return"and";case"OR":return"or";default:return Re()}}(t.compositeFilter.op))}(r):Re()}function my(r){return ey[r]}function gy(r){return ty[r]}function py(r){return ry[r]}function Us(r){return{fieldPath:r.canonicalString()}}function Bs(r){return jt.fromServerFormat(r.fieldPath)}function em(r){return r instanceof mt?function(t){if(t.op==="=="){if(bd(t.value))return{unaryFilter:{field:Us(t.field),op:"IS_NAN"}};if(yd(t.value))return{unaryFilter:{field:Us(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(bd(t.value))return{unaryFilter:{field:Us(t.field),op:"IS_NOT_NAN"}};if(yd(t.value))return{unaryFilter:{field:Us(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Us(t.field),op:gy(t.op),value:t.value}}}(r):r instanceof nr?function(t){const s=t.getFilters().map(a=>em(a));return s.length===1?s[0]:{compositeFilter:{op:py(t.op),filters:s}}}(r):Re()}function fy(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function tm(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jr{constructor(e,t,s,a,i=Pe.min(),l=Pe.min(),c=St.EMPTY_BYTE_STRING,d=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=a,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=l,this.resumeToken=c,this.expectedCount=d}withSequenceNumber(e){return new Jr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Jr(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Jr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Jr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xy{constructor(e){this.ct=e}}function yy(r){const e=uy({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Fo(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class by{constructor(){this.un=new vy}addToCollectionParentIndex(e,t){return this.un.add(t),te.resolve()}getCollectionParents(e,t){return te.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return te.resolve()}deleteFieldIndex(e,t){return te.resolve()}deleteAllFieldIndexes(e){return te.resolve()}createTargetIndexes(e,t){return te.resolve()}getDocumentsMatchingTarget(e,t){return te.resolve(null)}getIndexType(e,t){return te.resolve(0)}getFieldIndexes(e,t){return te.resolve([])}getNextCollectionGroupToUpdate(e){return te.resolve(null)}getMinOffset(e,t){return te.resolve(ns.min())}getMinOffsetFromCollectionGroup(e,t){return te.resolve(ns.min())}updateCollectionGroup(e,t,s){return te.resolve()}updateIndexEntries(e,t){return te.resolve()}}class vy{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),a=this.index[t]||new Tt(tt.comparator),i=!a.has(s);return this.index[t]=a.add(s),i}has(e){const t=e.lastSegment(),s=e.popLast(),a=this.index[t];return a&&a.has(s)}getEntries(e){return(this.index[e]||new Tt(tt.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new rn(0)}static kn(){return new rn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wy{constructor(){this.changes=new un(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,$t.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?te.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _y{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ky{constructor(e,t,s,a){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=a}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next(a=>(s=a,this.remoteDocumentCache.getEntry(e,t))).next(a=>(s!==null&&Mn(s.mutation,a,Qt.empty(),xt.now()),a))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.getLocalViewOfDocuments(e,s,Ve()).next(()=>s))}getLocalViewOfDocuments(e,t,s=Ve()){const a=fs();return this.populateOverlays(e,a,t).next(()=>this.computeViews(e,t,a,s).next(i=>{let l=Cn();return i.forEach((c,d)=>{l=l.insert(c,d.overlayedDocument)}),l}))}getOverlayedDocuments(e,t){const s=fs();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,Ve()))}populateOverlays(e,t,s){const a=[];return s.forEach(i=>{t.has(i)||a.push(i)}),this.documentOverlayCache.getOverlays(e,a).next(i=>{i.forEach((l,c)=>{t.set(l,c)})})}computeViews(e,t,s,a){let i=Or();const l=$n(),c=function(){return $n()}();return t.forEach((d,h)=>{const m=s.get(h.key);a.has(h.key)&&(m===void 0||m.mutation instanceof os)?i=i.insert(h.key,h):m!==void 0?(l.set(h.key,m.mutation.getFieldMask()),Mn(m.mutation,h,m.mutation.getFieldMask(),xt.now())):l.set(h.key,Qt.empty())}),this.recalculateAndSaveOverlays(e,i).next(d=>(d.forEach((h,m)=>l.set(h,m)),t.forEach((h,m)=>{var x;return c.set(h,new _y(m,(x=l.get(h))!==null&&x!==void 0?x:null))}),c))}recalculateAndSaveOverlays(e,t){const s=$n();let a=new st((l,c)=>l-c),i=Ve();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(l=>{for(const c of l)c.keys().forEach(d=>{const h=t.get(d);if(h===null)return;let m=s.get(d)||Qt.empty();m=c.applyToLocalView(h,m),s.set(d,m);const x=(a.get(c.batchId)||Ve()).add(d);a=a.insert(c.batchId,x)})}).next(()=>{const l=[],c=a.getReverseIterator();for(;c.hasNext();){const d=c.getNext(),h=d.key,m=d.value,x=Vh();m.forEach(b=>{if(!i.has(b)){const I=Wh(t.get(b),s.get(b));I!==null&&x.set(b,I),i=i.add(b)}}),l.push(this.documentOverlayCache.saveOverlays(e,h,x))}return te.waitFor(l)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,t,s,a){return function(l){return Ie.isDocumentKey(l.path)&&l.collectionGroup===null&&l.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Dh(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,a):this.getDocumentsMatchingCollectionQuery(e,t,s,a)}getNextDocuments(e,t,s,a){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,a).next(i=>{const l=a-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,a-i.size):te.resolve(fs());let c=-1,d=i;return l.next(h=>te.forEach(h,(m,x)=>(c<x.largestBatchId&&(c=x.largestBatchId),i.get(m)?te.resolve():this.remoteDocumentCache.getEntry(e,m).next(b=>{d=d.insert(m,b)}))).next(()=>this.populateOverlays(e,h,i)).next(()=>this.computeViews(e,d,h,Ve())).next(m=>({batchId:c,changes:Oh(m)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new Ie(t)).next(s=>{let a=Cn();return s.isFoundDocument()&&(a=a.insert(s.key,s)),a})}getDocumentsMatchingCollectionGroupQuery(e,t,s,a){const i=t.collectionGroup;let l=Cn();return this.indexManager.getCollectionParents(e,i).next(c=>te.forEach(c,d=>{const h=function(x,b){return new dn(b,null,x.explicitOrderBy.slice(),x.filters.slice(),x.limit,x.limitType,x.startAt,x.endAt)}(t,d.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,s,a).next(m=>{m.forEach((x,b)=>{l=l.insert(x,b)})})}).next(()=>l))}getDocumentsMatchingCollectionQuery(e,t,s,a){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next(l=>(i=l,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,i,a))).next(l=>{i.forEach((d,h)=>{const m=h.getKey();l.get(m)===null&&(l=l.insert(m,$t.newInvalidDocument(m)))});let c=Cn();return l.forEach((d,h)=>{const m=i.get(d);m!==void 0&&Mn(m.mutation,h,Qt.empty(),xt.now()),Ri(t,h)&&(c=c.insert(d,h))}),c})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ny{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return te.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(a){return{id:a.id,version:a.version,createTime:gr(a.createTime)}}(t)),te.resolve()}getNamedQuery(e,t){return te.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(a){return{name:a.name,query:yy(a.bundledQuery),readTime:gr(a.readTime)}}(t)),te.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ey{constructor(){this.overlays=new st(Ie.comparator),this.Ir=new Map}getOverlay(e,t){return te.resolve(this.overlays.get(t))}getOverlays(e,t){const s=fs();return te.forEach(t,a=>this.getOverlay(e,a).next(i=>{i!==null&&s.set(a,i)})).next(()=>s)}saveOverlays(e,t,s){return s.forEach((a,i)=>{this.ht(e,t,i)}),te.resolve()}removeOverlaysForBatchId(e,t,s){const a=this.Ir.get(s);return a!==void 0&&(a.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(s)),te.resolve()}getOverlaysForCollection(e,t,s){const a=fs(),i=t.length+1,l=new Ie(t.child("")),c=this.overlays.getIteratorFrom(l);for(;c.hasNext();){const d=c.getNext().value,h=d.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===i&&d.largestBatchId>s&&a.set(d.getKey(),d)}return te.resolve(a)}getOverlaysForCollectionGroup(e,t,s,a){let i=new st((h,m)=>h-m);const l=this.overlays.getIterator();for(;l.hasNext();){const h=l.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>s){let m=i.get(h.largestBatchId);m===null&&(m=fs(),i=i.insert(h.largestBatchId,m)),m.set(h.getKey(),h)}}const c=fs(),d=i.getIterator();for(;d.hasNext()&&(d.getNext().value.forEach((h,m)=>c.set(h,m)),!(c.size()>=a)););return te.resolve(c)}ht(e,t,s){const a=this.overlays.get(s.key);if(a!==null){const l=this.Ir.get(a.largestBatchId).delete(s.key);this.Ir.set(a.largestBatchId,l)}this.overlays=this.overlays.insert(s.key,new Kx(t,s));let i=this.Ir.get(t);i===void 0&&(i=Ve(),this.Ir.set(t,i)),this.Ir.set(t,i.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{constructor(){this.sessionToken=St.EMPTY_BYTE_STRING}getSessionToken(e){return te.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,te.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wl{constructor(){this.Tr=new Tt(bt.Er),this.dr=new Tt(bt.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const s=new bt(e,t);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,t){e.forEach(s=>this.addReference(s,t))}removeReference(e,t){this.Vr(new bt(e,t))}mr(e,t){e.forEach(s=>this.removeReference(s,t))}gr(e){const t=new Ie(new tt([])),s=new bt(t,e),a=new bt(t,e+1),i=[];return this.dr.forEachInRange([s,a],l=>{this.Vr(l),i.push(l.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new Ie(new tt([])),s=new bt(t,e),a=new bt(t,e+1);let i=Ve();return this.dr.forEachInRange([s,a],l=>{i=i.add(l.key)}),i}containsKey(e){const t=new bt(e,0),s=this.Tr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class bt{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return Ie.comparator(e.key,t.key)||ze(e.wr,t.wr)}static Ar(e,t){return ze(e.wr,t.wr)||Ie.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Tt(bt.Er)}checkEmpty(e){return te.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,a){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const l=new Gx(i,t,s,a);this.mutationQueue.push(l);for(const c of a)this.br=this.br.add(new bt(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return te.resolve(l)}lookupMutationBatch(e,t){return te.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,a=this.vr(s),i=a<0?0:a;return te.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return te.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return te.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new bt(t,0),a=new bt(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([s,a],l=>{const c=this.Dr(l.wr);i.push(c)}),te.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new Tt(ze);return t.forEach(a=>{const i=new bt(a,0),l=new bt(a,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,l],c=>{s=s.add(c.wr)})}),te.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,a=s.length+1;let i=s;Ie.isDocumentKey(i)||(i=i.child(""));const l=new bt(new Ie(i),0);let c=new Tt(ze);return this.br.forEachWhile(d=>{const h=d.key.path;return!!s.isPrefixOf(h)&&(h.length===a&&(c=c.add(d.wr)),!0)},l),te.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach(s=>{const a=this.Dr(s);a!==null&&t.push(a)}),t}removeMutationBatch(e,t){Qe(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return te.forEach(t.mutations,a=>{const i=new bt(a.key,t.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,a.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,t){const s=new bt(t,0),a=this.br.firstAfterOrEqual(s);return te.resolve(t.isEqual(a&&a.key))}performConsistencyCheck(e){return this.mutationQueue.length,te.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ty{constructor(e){this.Mr=e,this.docs=function(){return new st(Ie.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,a=this.docs.get(s),i=a?a.size:0,l=this.Mr(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:l}),this.size+=l-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return te.resolve(s?s.document.mutableCopy():$t.newInvalidDocument(t))}getEntries(e,t){let s=Or();return t.forEach(a=>{const i=this.docs.get(a);s=s.insert(a,i?i.document.mutableCopy():$t.newInvalidDocument(a))}),te.resolve(s)}getDocumentsMatchingQuery(e,t,s,a){let i=Or();const l=t.path,c=new Ie(l.child("")),d=this.docs.getIteratorFrom(c);for(;d.hasNext();){const{key:h,value:{document:m}}=d.getNext();if(!l.isPrefixOf(h.path))break;h.path.length>l.length+1||ux(dx(m),s)<=0||(a.has(m.key)||Ri(t,m))&&(i=i.insert(m.key,m.mutableCopy()))}return te.resolve(i)}getAllFromCollectionGroup(e,t,s,a){Re()}Or(e,t){return te.forEach(this.docs,s=>t(s))}newChangeBuffer(e){return new Sy(this)}getSize(e){return te.resolve(this.size)}}class Sy extends wy{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((s,a)=>{a.isValidDocument()?t.push(this.cr.addEntry(e,a)):this.cr.removeEntry(s)}),te.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ay{constructor(e){this.persistence=e,this.Nr=new un(t=>gl(t),pl),this.lastRemoteSnapshotVersion=Pe.min(),this.highestTargetId=0,this.Lr=0,this.Br=new wl,this.targetCount=0,this.kr=rn.Bn()}forEachTarget(e,t){return this.Nr.forEach((s,a)=>t(a)),te.resolve()}getLastRemoteSnapshotVersion(e){return te.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return te.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),te.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.Lr&&(this.Lr=t),te.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new rn(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,te.resolve()}updateTargetData(e,t){return this.Kn(t),te.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,te.resolve()}removeTargets(e,t,s){let a=0;const i=[];return this.Nr.forEach((l,c)=>{c.sequenceNumber<=t&&s.get(c.targetId)===null&&(this.Nr.delete(l),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),a++)}),te.waitFor(i).next(()=>a)}getTargetCount(e){return te.resolve(this.targetCount)}getTargetData(e,t){const s=this.Nr.get(t)||null;return te.resolve(s)}addMatchingKeys(e,t,s){return this.Br.Rr(t,s),te.resolve()}removeMatchingKeys(e,t,s){this.Br.mr(t,s);const a=this.persistence.referenceDelegate,i=[];return a&&t.forEach(l=>{i.push(a.markPotentiallyOrphaned(e,l))}),te.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),te.resolve()}getMatchingKeysForTargetId(e,t){const s=this.Br.yr(t);return te.resolve(s)}containsKey(e,t){return te.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cy{constructor(e,t){this.qr={},this.overlays={},this.Qr=new dl(0),this.Kr=!1,this.Kr=!0,this.$r=new jy,this.referenceDelegate=e(this),this.Ur=new Ay(this),this.indexManager=new by,this.remoteDocumentCache=function(a){return new Ty(a)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new xy(t),this.Gr=new Ny(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Ey,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.qr[e.toKey()];return s||(s=new Iy(t,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,s){ke("MemoryPersistence","Starting transaction:",e);const a=new Ry(this.Qr.next());return this.referenceDelegate.zr(),s(a).next(i=>this.referenceDelegate.jr(a).next(()=>i)).toPromise().then(i=>(a.raiseOnCommittedEvent(),i))}Hr(e,t){return te.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,t)))}}class Ry extends mx{constructor(e){super(),this.currentSequenceNumber=e}}class _l{constructor(e){this.persistence=e,this.Jr=new wl,this.Yr=null}static Zr(e){return new _l(e)}get Xr(){if(this.Yr)return this.Yr;throw Re()}addReference(e,t,s){return this.Jr.addReference(s,t),this.Xr.delete(s.toString()),te.resolve()}removeReference(e,t,s){return this.Jr.removeReference(s,t),this.Xr.add(s.toString()),te.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),te.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(a=>this.Xr.add(a.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next(a=>{a.forEach(i=>this.Xr.add(i.toString()))}).next(()=>s.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return te.forEach(this.Xr,s=>{const a=Ie.fromPath(s);return this.ei(e,a).next(i=>{i||t.removeEntry(a,Pe.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(s=>{s?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return te.or([()=>te.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kl{constructor(e,t,s,a){this.targetId=e,this.fromCache=t,this.$i=s,this.Ui=a}static Wi(e,t){let s=Ve(),a=Ve();for(const i of t.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:a=a.add(i.doc.key)}return new kl(e,t.fromCache,s,a)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Of()?8:gx(Mt())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,s,a){const i={result:null};return this.Yi(e,t).next(l=>{i.result=l}).next(()=>{if(!i.result)return this.Zi(e,t,a,s).next(l=>{i.result=l})}).next(()=>{if(i.result)return;const l=new Dy;return this.Xi(e,t,l).next(c=>{if(i.result=c,this.zi)return this.es(e,t,l,c.size)})}).next(()=>i.result)}es(e,t,s,a){return s.documentReadCount<this.ji?(Nn()<=Fe.DEBUG&&ke("QueryEngine","SDK will not create cache indexes for query:",Fs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),te.resolve()):(Nn()<=Fe.DEBUG&&ke("QueryEngine","Query:",Fs(t),"scans",s.documentReadCount,"local documents and returns",a,"documents as results."),s.documentReadCount>this.Hi*a?(Nn()<=Fe.DEBUG&&ke("QueryEngine","The SDK decides to create cache indexes for query:",Fs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,mr(t))):te.resolve())}Yi(e,t){if(kd(t))return te.resolve(null);let s=mr(t);return this.indexManager.getIndexType(e,s).next(a=>a===0?null:(t.limit!==null&&a===1&&(t=Fo(t,null,"F"),s=mr(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next(i=>{const l=Ve(...i);return this.Ji.getDocuments(e,l).next(c=>this.indexManager.getMinOffset(e,s).next(d=>{const h=this.ts(t,c);return this.ns(t,h,l,d.readTime)?this.Yi(e,Fo(t,null,"F")):this.rs(e,h,t,d)}))})))}Zi(e,t,s,a){return kd(t)||a.isEqual(Pe.min())?te.resolve(null):this.Ji.getDocuments(e,s).next(i=>{const l=this.ts(t,i);return this.ns(t,l,s,a)?te.resolve(null):(Nn()<=Fe.DEBUG&&ke("QueryEngine","Re-using previous result from %s to execute query: %s",a.toString(),Fs(t)),this.rs(e,l,t,cx(a,-1)).next(c=>c))})}ts(e,t){let s=new Tt($h(e));return t.forEach((a,i)=>{Ri(e,i)&&(s=s.add(i))}),s}ns(e,t,s,a){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(a)>0)}Xi(e,t,s){return Nn()<=Fe.DEBUG&&ke("QueryEngine","Using full collection scan to execute query:",Fs(t)),this.Ji.getDocumentsMatchingQuery(e,t,ns.min(),s)}rs(e,t,s,a){return this.Ji.getDocumentsMatchingQuery(e,s,a).next(i=>(t.forEach(l=>{i=i.insert(l.key,l)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $y{constructor(e,t,s,a){this.persistence=e,this.ss=t,this.serializer=a,this.os=new st(ze),this._s=new un(i=>gl(i),pl),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ky(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function My(r,e,t,s){return new $y(r,e,t,s)}async function rm(r,e){const t=$e(r);return await t.persistence.runTransaction("Handle user change","readonly",s=>{let a;return t.mutationQueue.getAllMutationBatches(s).next(i=>(a=i,t.ls(e),t.mutationQueue.getAllMutationBatches(s))).next(i=>{const l=[],c=[];let d=Ve();for(const h of a){l.push(h.batchId);for(const m of h.mutations)d=d.add(m.key)}for(const h of i){c.push(h.batchId);for(const m of h.mutations)d=d.add(m.key)}return t.localDocuments.getDocuments(s,d).next(h=>({hs:h,removedBatchIds:l,addedBatchIds:c}))})})}function Oy(r,e){const t=$e(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const a=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(c,d,h,m){const x=h.batch,b=x.keys();let I=te.resolve();return b.forEach(N=>{I=I.next(()=>m.getEntry(d,N)).next(T=>{const E=h.docVersions.get(N);Qe(E!==null),T.version.compareTo(E)<0&&(x.applyToRemoteDocument(T,h),T.isValidDocument()&&(T.setReadTime(h.commitVersion),m.addEntry(T)))})}),I.next(()=>c.mutationQueue.removeMutationBatch(d,x))}(t,s,e,i).next(()=>i.apply(s)).next(()=>t.mutationQueue.performConsistencyCheck(s)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(s,a,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(c){let d=Ve();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(d=d.add(c.batch.mutations[h].key));return d}(e))).next(()=>t.localDocuments.getDocuments(s,a))})}function sm(r){const e=$e(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function Vy(r,e){const t=$e(r),s=e.snapshotVersion;let a=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const l=t.cs.newChangeBuffer({trackRemovals:!0});a=t.os;const c=[];e.targetChanges.forEach((m,x)=>{const b=a.get(x);if(!b)return;c.push(t.Ur.removeMatchingKeys(i,m.removedDocuments,x).next(()=>t.Ur.addMatchingKeys(i,m.addedDocuments,x)));let I=b.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(x)!==null?I=I.withResumeToken(St.EMPTY_BYTE_STRING,Pe.min()).withLastLimboFreeSnapshotVersion(Pe.min()):m.resumeToken.approximateByteSize()>0&&(I=I.withResumeToken(m.resumeToken,s)),a=a.insert(x,I),function(T,E,P){return T.resumeToken.approximateByteSize()===0||E.snapshotVersion.toMicroseconds()-T.snapshotVersion.toMicroseconds()>=3e8?!0:P.addedDocuments.size+P.modifiedDocuments.size+P.removedDocuments.size>0}(b,I,m)&&c.push(t.Ur.updateTargetData(i,I))});let d=Or(),h=Ve();if(e.documentUpdates.forEach(m=>{e.resolvedLimboDocuments.has(m)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,m))}),c.push(Ly(i,l,e.documentUpdates).next(m=>{d=m.Ps,h=m.Is})),!s.isEqual(Pe.min())){const m=t.Ur.getLastRemoteSnapshotVersion(i).next(x=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,s));c.push(m)}return te.waitFor(c).next(()=>l.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,d,h)).next(()=>d)}).then(i=>(t.os=a,i))}function Ly(r,e,t){let s=Ve(),a=Ve();return t.forEach(i=>s=s.add(i)),e.getEntries(r,s).next(i=>{let l=Or();return t.forEach((c,d)=>{const h=i.get(c);d.isFoundDocument()!==h.isFoundDocument()&&(a=a.add(c)),d.isNoDocument()&&d.version.isEqual(Pe.min())?(e.removeEntry(c,d.readTime),l=l.insert(c,d)):!h.isValidDocument()||d.version.compareTo(h.version)>0||d.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(d),l=l.insert(c,d)):ke("LocalStore","Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",d.version)}),{Ps:l,Is:a}})}function Fy(r,e){const t=$e(r);return t.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function Uy(r,e){const t=$e(r);return t.persistence.runTransaction("Allocate target","readwrite",s=>{let a;return t.Ur.getTargetData(s,e).next(i=>i?(a=i,te.resolve(a)):t.Ur.allocateTargetId(s).next(l=>(a=new Jr(e,l,"TargetPurposeListen",s.currentSequenceNumber),t.Ur.addTargetData(s,a).next(()=>a))))}).then(s=>{const a=t.os.get(s.targetId);return(a===null||s.snapshotVersion.compareTo(a.snapshotVersion)>0)&&(t.os=t.os.insert(s.targetId,s),t._s.set(e,s.targetId)),s})}async function zo(r,e,t){const s=$e(r),a=s.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",i,l=>s.persistence.referenceDelegate.removeTarget(l,a))}catch(l){if(!ca(l))throw l;ke("LocalStore",`Failed to update sequence numbers for target ${e}: ${l}`)}s.os=s.os.remove(e),s._s.delete(a.target)}function Pd(r,e,t){const s=$e(r);let a=Pe.min(),i=Ve();return s.persistence.runTransaction("Execute query","readwrite",l=>function(d,h,m){const x=$e(d),b=x._s.get(m);return b!==void 0?te.resolve(x.os.get(b)):x.Ur.getTargetData(h,m)}(s,l,mr(e)).next(c=>{if(c)return a=c.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(l,c.targetId).next(d=>{i=d})}).next(()=>s.ss.getDocumentsMatchingQuery(l,e,t?a:Pe.min(),t?i:Ve())).next(c=>(By(s,Rx(e),c),{documents:c,Ts:i})))}function By(r,e,t){let s=r.us.get(e)||Pe.min();t.forEach((a,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)}),r.us.set(e,s)}class $d{constructor(){this.activeTargetIds=Vx()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class qy{constructor(){this.so=new $d,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,s){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new $d,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Md{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){ke("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){ke("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Oa=null;function go(){return Oa===null?Oa=function(){return 268435456+Math.round(2147483648*Math.random())}():Oa++,"0x"+Oa.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zy={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt="WebChannelConnection";class Gy extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const s=t.ssl?"https":"http",a=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+t.host,this.vo=`projects/${a}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${a}`:`project_id=${a}&database_id=${i}`}get Fo(){return!1}Mo(t,s,a,i,l){const c=go(),d=this.xo(t,s.toUriEncodedString());ke("RestConnection",`Sending RPC '${t}' ${c}:`,d,a);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,i,l),this.No(t,d,h,a).then(m=>(ke("RestConnection",`Received RPC '${t}' ${c}: `,m),m),m=>{throw Js("RestConnection",`RPC '${t}' ${c} failed with error: `,m,"url: ",d,"request:",a),m})}Lo(t,s,a,i,l,c){return this.Mo(t,s,a,i,l)}Oo(t,s,a){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+cn}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((i,l)=>t[l]=i),a&&a.headers.forEach((i,l)=>t[l]=i)}xo(t,s){const a=zy[t];return`${this.Do}/v1/${s}:${a}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,s,a){const i=go();return new Promise((l,c)=>{const d=new fh;d.setWithCredentials(!0),d.listenOnce(xh.COMPLETE,()=>{try{switch(d.getLastErrorCode()){case za.NO_ERROR:const m=d.getResponseJson();ke(Dt,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(m)),l(m);break;case za.TIMEOUT:ke(Dt,`RPC '${e}' ${i} timed out`),c(new ve(J.DEADLINE_EXCEEDED,"Request time out"));break;case za.HTTP_ERROR:const x=d.getStatus();if(ke(Dt,`RPC '${e}' ${i} failed with status:`,x,"response text:",d.getResponseText()),x>0){let b=d.getResponseJson();Array.isArray(b)&&(b=b[0]);const I=b==null?void 0:b.error;if(I&&I.status&&I.message){const N=function(E){const P=E.toLowerCase().replace(/_/g,"-");return Object.values(J).indexOf(P)>=0?P:J.UNKNOWN}(I.status);c(new ve(N,I.message))}else c(new ve(J.UNKNOWN,"Server responded with status "+d.getStatus()))}else c(new ve(J.UNAVAILABLE,"Connection failed."));break;default:Re()}}finally{ke(Dt,`RPC '${e}' ${i} completed.`)}});const h=JSON.stringify(a);ke(Dt,`RPC '${e}' ${i} sending request:`,a),d.send(t,"POST",h,s,15)})}Bo(e,t,s){const a=go(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],l=vh(),c=bh(),d={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(d.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(d.useFetchStreams=!0),this.Oo(d.initMessageHeaders,t,s),d.encodeInitMessageHeaders=!0;const m=i.join("");ke(Dt,`Creating RPC '${e}' stream ${a}: ${m}`,d);const x=l.createWebChannel(m,d);let b=!1,I=!1;const N=new Hy({Io:E=>{I?ke(Dt,`Not sending because RPC '${e}' stream ${a} is closed:`,E):(b||(ke(Dt,`Opening RPC '${e}' stream ${a} transport.`),x.open(),b=!0),ke(Dt,`RPC '${e}' stream ${a} sending:`,E),x.send(E))},To:()=>x.close()}),T=(E,P,O)=>{E.listen(P,C=>{try{O(C)}catch(M){setTimeout(()=>{throw M},0)}})};return T(x,An.EventType.OPEN,()=>{I||(ke(Dt,`RPC '${e}' stream ${a} transport opened.`),N.yo())}),T(x,An.EventType.CLOSE,()=>{I||(I=!0,ke(Dt,`RPC '${e}' stream ${a} transport closed`),N.So())}),T(x,An.EventType.ERROR,E=>{I||(I=!0,Js(Dt,`RPC '${e}' stream ${a} transport errored:`,E),N.So(new ve(J.UNAVAILABLE,"The operation could not be completed")))}),T(x,An.EventType.MESSAGE,E=>{var P;if(!I){const O=E.data[0];Qe(!!O);const C=O,M=C.error||((P=C[0])===null||P===void 0?void 0:P.error);if(M){ke(Dt,`RPC '${e}' stream ${a} received error:`,M);const ee=M.status;let Z=function(v){const f=ht[v];if(f!==void 0)return Hh(f)}(ee),j=M.message;Z===void 0&&(Z=J.INTERNAL,j="Unknown error status: "+ee+" with message "+M.message),I=!0,N.So(new ve(Z,j)),x.close()}else ke(Dt,`RPC '${e}' stream ${a} received:`,O),N.bo(O)}}),T(c,yh.STAT_EVENT,E=>{E.stat===Po.PROXY?ke(Dt,`RPC '${e}' stream ${a} detected buffering proxy`):E.stat===Po.NOPROXY&&ke(Dt,`RPC '${e}' stream ${a} detected no buffering proxy`)}),setTimeout(()=>{N.wo()},0),N}}function po(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mi(r){return new sy(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nm{constructor(e,t,s=1e3,a=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=s,this.qo=a,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),a=Math.max(0,t-s);a>0&&ke("ExponentialBackoff",`Backing off for ${a} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,a,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class am{constructor(e,t,s,a,i,l,c,d){this.ui=e,this.Ho=s,this.Jo=a,this.connection=i,this.authCredentialsProvider=l,this.appCheckCredentialsProvider=c,this.listener=d,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new nm(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===J.RESOURCE_EXHAUSTED?(Mr(t.toString()),Mr("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===J.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,a])=>{this.Yo===t&&this.P_(s,a)},s=>{e(()=>{const a=new ve(J.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(a)})})}P_(e,t){const s=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(a=>{s(()=>this.I_(a))}),this.stream.onMessage(a=>{s(()=>++this.e_==1?this.E_(a):this.onNext(a))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return ke("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(ke("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Ky extends am{constructor(e,t,s,a,i,l){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,a,l),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=iy(this.serializer,e),s=function(i){if(!("targetChange"in i))return Pe.min();const l=i.targetChange;return l.targetIds&&l.targetIds.length?Pe.min():l.readTime?gr(l.readTime):Pe.min()}(e);return this.listener.d_(t,s)}A_(e){const t={};t.database=Wo(this.serializer),t.addTarget=function(i,l){let c;const d=l.target;if(c=Vo(d)?{documents:cy(i,d)}:{query:dy(i,d)._t},c.targetId=l.targetId,l.resumeToken.approximateByteSize()>0){c.resumeToken=Qh(i,l.resumeToken);const h=Uo(i,l.expectedCount);h!==null&&(c.expectedCount=h)}else if(l.snapshotVersion.compareTo(Pe.min())>0){c.readTime=ci(i,l.snapshotVersion.toTimestamp());const h=Uo(i,l.expectedCount);h!==null&&(c.expectedCount=h)}return c}(this.serializer,e);const s=hy(this.serializer,e);s&&(t.labels=s),this.a_(t)}R_(e){const t={};t.database=Wo(this.serializer),t.removeTarget=e,this.a_(t)}}class Qy extends am{constructor(e,t,s,a,i,l){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,a,l),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return Qe(!!e.streamToken),this.lastStreamToken=e.streamToken,Qe(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Qe(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=ly(e.writeResults,e.commitTime),s=gr(e.commitTime);return this.listener.g_(s,t)}p_(){const e={};e.database=Wo(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(s=>oy(this.serializer,s))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yy extends class{}{constructor(e,t,s,a){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=a,this.y_=!1}w_(){if(this.y_)throw new ve(J.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,s,a){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,l])=>this.connection.Mo(e,Bo(t,s),a,i,l)).catch(i=>{throw i.name==="FirebaseError"?(i.code===J.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new ve(J.UNKNOWN,i.toString())})}Lo(e,t,s,a,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([l,c])=>this.connection.Lo(e,Bo(t,s),a,l,c,i)).catch(l=>{throw l.name==="FirebaseError"?(l.code===J.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new ve(J.UNKNOWN,l.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class Xy{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Mr(t),this.D_=!1):ke("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jy{constructor(e,t,s,a,i){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(l=>{s.enqueueAndForget(async()=>{Cs(this)&&(ke("RemoteStore","Restarting streams for network reachability change."),await async function(d){const h=$e(d);h.L_.add(4),await ha(h),h.q_.set("Unknown"),h.L_.delete(4),await Oi(h)}(this))})}),this.q_=new Xy(s,a)}}async function Oi(r){if(Cs(r))for(const e of r.B_)await e(!0)}async function ha(r){for(const e of r.B_)await e(!1)}function im(r,e){const t=$e(r);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Il(t)?jl(t):hn(t).r_()&&El(t,e))}function Nl(r,e){const t=$e(r),s=hn(t);t.N_.delete(e),s.r_()&&om(t,e),t.N_.size===0&&(s.r_()?s.o_():Cs(t)&&t.q_.set("Unknown"))}function El(r,e){if(r.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Pe.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}hn(r).A_(e)}function om(r,e){r.Q_.xe(e),hn(r).R_(e)}function jl(r){r.Q_=new Zx({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>r.N_.get(e)||null,tt:()=>r.datastore.serializer.databaseId}),hn(r).start(),r.q_.v_()}function Il(r){return Cs(r)&&!hn(r).n_()&&r.N_.size>0}function Cs(r){return $e(r).L_.size===0}function lm(r){r.Q_=void 0}async function Zy(r){r.q_.set("Online")}async function eb(r){r.N_.forEach((e,t)=>{El(r,e)})}async function tb(r,e){lm(r),Il(r)?(r.q_.M_(e),jl(r)):r.q_.set("Unknown")}async function rb(r,e,t){if(r.q_.set("Online"),e instanceof Kh&&e.state===2&&e.cause)try{await async function(a,i){const l=i.cause;for(const c of i.targetIds)a.N_.has(c)&&(await a.remoteSyncer.rejectListen(c,l),a.N_.delete(c),a.Q_.removeTarget(c))}(r,e)}catch(s){ke("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await di(r,s)}else if(e instanceof Ka?r.Q_.Ke(e):e instanceof Gh?r.Q_.He(e):r.Q_.We(e),!t.isEqual(Pe.min()))try{const s=await sm(r.localStore);t.compareTo(s)>=0&&await function(i,l){const c=i.Q_.rt(l);return c.targetChanges.forEach((d,h)=>{if(d.resumeToken.approximateByteSize()>0){const m=i.N_.get(h);m&&i.N_.set(h,m.withResumeToken(d.resumeToken,l))}}),c.targetMismatches.forEach((d,h)=>{const m=i.N_.get(d);if(!m)return;i.N_.set(d,m.withResumeToken(St.EMPTY_BYTE_STRING,m.snapshotVersion)),om(i,d);const x=new Jr(m.target,d,h,m.sequenceNumber);El(i,x)}),i.remoteSyncer.applyRemoteEvent(c)}(r,t)}catch(s){ke("RemoteStore","Failed to raise snapshot:",s),await di(r,s)}}async function di(r,e,t){if(!ca(e))throw e;r.L_.add(1),await ha(r),r.q_.set("Offline"),t||(t=()=>sm(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{ke("RemoteStore","Retrying IndexedDB access"),await t(),r.L_.delete(1),await Oi(r)})}function cm(r,e){return e().catch(t=>di(r,t,e))}async function Vi(r){const e=$e(r),t=is(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;sb(e);)try{const a=await Fy(e.localStore,s);if(a===null){e.O_.length===0&&t.o_();break}s=a.batchId,nb(e,a)}catch(a){await di(e,a)}dm(e)&&um(e)}function sb(r){return Cs(r)&&r.O_.length<10}function nb(r,e){r.O_.push(e);const t=is(r);t.r_()&&t.V_&&t.m_(e.mutations)}function dm(r){return Cs(r)&&!is(r).n_()&&r.O_.length>0}function um(r){is(r).start()}async function ab(r){is(r).p_()}async function ib(r){const e=is(r);for(const t of r.O_)e.m_(t.mutations)}async function ob(r,e,t){const s=r.O_.shift(),a=yl.from(s,e,t);await cm(r,()=>r.remoteSyncer.applySuccessfulWrite(a)),await Vi(r)}async function lb(r,e){e&&is(r).V_&&await async function(s,a){if(function(l){return Yx(l)&&l!==J.ABORTED}(a.code)){const i=s.O_.shift();is(s).s_(),await cm(s,()=>s.remoteSyncer.rejectFailedWrite(i.batchId,a)),await Vi(s)}}(r,e),dm(r)&&um(r)}async function Od(r,e){const t=$e(r);t.asyncQueue.verifyOperationInProgress(),ke("RemoteStore","RemoteStore received new credentials");const s=Cs(t);t.L_.add(3),await ha(t),s&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Oi(t)}async function cb(r,e){const t=$e(r);e?(t.L_.delete(2),await Oi(t)):e||(t.L_.add(2),await ha(t),t.q_.set("Unknown"))}function hn(r){return r.K_||(r.K_=function(t,s,a){const i=$e(t);return i.w_(),new Ky(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,a)}(r.datastore,r.asyncQueue,{Eo:Zy.bind(null,r),Ro:eb.bind(null,r),mo:tb.bind(null,r),d_:rb.bind(null,r)}),r.B_.push(async e=>{e?(r.K_.s_(),Il(r)?jl(r):r.q_.set("Unknown")):(await r.K_.stop(),lm(r))})),r.K_}function is(r){return r.U_||(r.U_=function(t,s,a){const i=$e(t);return i.w_(),new Qy(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,a)}(r.datastore,r.asyncQueue,{Eo:()=>Promise.resolve(),Ro:ab.bind(null,r),mo:lb.bind(null,r),f_:ib.bind(null,r),g_:ob.bind(null,r)}),r.B_.push(async e=>{e?(r.U_.s_(),await Vi(r)):(await r.U_.stop(),r.O_.length>0&&(ke("RemoteStore",`Stopping write stream with ${r.O_.length} pending writes`),r.O_=[]))})),r.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(e,t,s,a,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=a,this.removalCallback=i,this.deferred=new ts,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(l=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,a,i){const l=Date.now()+s,c=new Tl(e,t,l,a,i);return c.start(s),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new ve(J.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Sl(r,e){if(Mr("AsyncQueue",`${e}: ${r}`),ca(r))return new ve(J.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(e){this.comparator=e?(t,s)=>e(t,s)||Ie.comparator(t.key,s.key):(t,s)=>Ie.comparator(t.key,s.key),this.keyedMap=Cn(),this.sortedSet=new st(this.comparator)}static emptySet(e){return new Ws(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,s)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ws)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const a=t.getNext().key,i=s.getNext().key;if(!a.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new Ws;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vd{constructor(){this.W_=new st(Ie.comparator)}track(e){const t=e.doc.key,s=this.W_.get(t);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(t,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(t):e.type===1&&s.type===2?this.W_=this.W_.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):Re():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,s)=>{e.push(s)}),e}}class sn{constructor(e,t,s,a,i,l,c,d,h){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=a,this.mutatedKeys=i,this.fromCache=l,this.syncStateChanged=c,this.excludesMetadataChanges=d,this.hasCachedResults=h}static fromInitialDocuments(e,t,s,a,i){const l=[];return t.forEach(c=>{l.push({type:0,doc:c})}),new sn(e,t,Ws.emptySet(t),l,s,a,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ci(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let a=0;a<t.length;a++)if(t[a].type!==s[a].type||!t[a].doc.isEqual(s[a].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class db{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class ub{constructor(){this.queries=Ld(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,s){const a=$e(t),i=a.queries;a.queries=Ld(),i.forEach((l,c)=>{for(const d of c.j_)d.onError(s)})})(this,new ve(J.ABORTED,"Firestore shutting down"))}}function Ld(){return new un(r=>Ph(r),Ci)}async function hb(r,e){const t=$e(r);let s=3;const a=e.query;let i=t.queries.get(a);i?!i.H_()&&e.J_()&&(s=2):(i=new db,s=e.J_()?0:1);try{switch(s){case 0:i.z_=await t.onListen(a,!0);break;case 1:i.z_=await t.onListen(a,!1);break;case 2:await t.onFirstRemoteStoreListen(a)}}catch(l){const c=Sl(l,`Initialization of query '${Fs(e.query)}' failed`);return void e.onError(c)}t.queries.set(a,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&Al(t)}async function mb(r,e){const t=$e(r),s=e.query;let a=3;const i=t.queries.get(s);if(i){const l=i.j_.indexOf(e);l>=0&&(i.j_.splice(l,1),i.j_.length===0?a=e.J_()?0:1:!i.H_()&&e.J_()&&(a=2))}switch(a){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function gb(r,e){const t=$e(r);let s=!1;for(const a of e){const i=a.query,l=t.queries.get(i);if(l){for(const c of l.j_)c.X_(a)&&(s=!0);l.z_=a}}s&&Al(t)}function pb(r,e,t){const s=$e(r),a=s.queries.get(e);if(a)for(const i of a.j_)i.onError(t);s.queries.delete(e)}function Al(r){r.Y_.forEach(e=>{e.next()})}var Ho,Fd;(Fd=Ho||(Ho={})).ea="default",Fd.Cache="cache";class fb{constructor(e,t,s){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const a of e.docChanges)a.type!==3&&s.push(a);e=new sn(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const s=t!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=sn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Ho.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hm{constructor(e){this.key=e}}class mm{constructor(e){this.key=e}}class xb{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=Ve(),this.mutatedKeys=Ve(),this.Aa=$h(e),this.Ra=new Ws(this.Aa)}get Va(){return this.Ta}ma(e,t){const s=t?t.fa:new Vd,a=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,l=a,c=!1;const d=this.query.limitType==="F"&&a.size===this.query.limit?a.last():null,h=this.query.limitType==="L"&&a.size===this.query.limit?a.first():null;if(e.inorderTraversal((m,x)=>{const b=a.get(m),I=Ri(this.query,x)?x:null,N=!!b&&this.mutatedKeys.has(b.key),T=!!I&&(I.hasLocalMutations||this.mutatedKeys.has(I.key)&&I.hasCommittedMutations);let E=!1;b&&I?b.data.isEqual(I.data)?N!==T&&(s.track({type:3,doc:I}),E=!0):this.ga(b,I)||(s.track({type:2,doc:I}),E=!0,(d&&this.Aa(I,d)>0||h&&this.Aa(I,h)<0)&&(c=!0)):!b&&I?(s.track({type:0,doc:I}),E=!0):b&&!I&&(s.track({type:1,doc:b}),E=!0,(d||h)&&(c=!0)),E&&(I?(l=l.add(I),i=T?i.add(m):i.delete(m)):(l=l.delete(m),i=i.delete(m)))}),this.query.limit!==null)for(;l.size>this.query.limit;){const m=this.query.limitType==="F"?l.last():l.first();l=l.delete(m.key),i=i.delete(m.key),s.track({type:1,doc:m})}return{Ra:l,fa:s,ns:c,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,a){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const l=e.fa.G_();l.sort((m,x)=>function(I,N){const T=E=>{switch(E){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Re()}};return T(I)-T(N)}(m.type,x.type)||this.Aa(m.doc,x.doc)),this.pa(s),a=a!=null&&a;const c=t&&!a?this.ya():[],d=this.da.size===0&&this.current&&!a?1:0,h=d!==this.Ea;return this.Ea=d,l.length!==0||h?{snapshot:new sn(this.query,e.Ra,i,l,e.mutatedKeys,d===0,h,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:c}:{wa:c}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Vd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=Ve(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const t=[];return e.forEach(s=>{this.da.has(s)||t.push(new mm(s))}),this.da.forEach(s=>{e.has(s)||t.push(new hm(s))}),t}ba(e){this.Ta=e.Ts,this.da=Ve();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return sn.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class yb{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class bb{constructor(e){this.key=e,this.va=!1}}class vb{constructor(e,t,s,a,i,l){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=a,this.currentUser=i,this.maxConcurrentLimboResolutions=l,this.Ca={},this.Fa=new un(c=>Ph(c),Ci),this.Ma=new Map,this.xa=new Set,this.Oa=new st(Ie.comparator),this.Na=new Map,this.La=new wl,this.Ba={},this.ka=new Map,this.qa=rn.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function wb(r,e,t=!0){const s=bm(r);let a;const i=s.Fa.get(e);return i?(s.sharedClientState.addLocalQueryTarget(i.targetId),a=i.view.Da()):a=await gm(s,e,t,!0),a}async function _b(r,e){const t=bm(r);await gm(t,e,!0,!1)}async function gm(r,e,t,s){const a=await Uy(r.localStore,mr(e)),i=a.targetId,l=r.sharedClientState.addLocalQueryTarget(i,t);let c;return s&&(c=await kb(r,e,i,l==="current",a.resumeToken)),r.isPrimaryClient&&t&&im(r.remoteStore,a),c}async function kb(r,e,t,s,a){r.Ka=(x,b,I)=>async function(T,E,P,O){let C=E.view.ma(P);C.ns&&(C=await Pd(T.localStore,E.query,!1).then(({documents:j})=>E.view.ma(j,C)));const M=O&&O.targetChanges.get(E.targetId),ee=O&&O.targetMismatches.get(E.targetId)!=null,Z=E.view.applyChanges(C,T.isPrimaryClient,M,ee);return Bd(T,E.targetId,Z.wa),Z.snapshot}(r,x,b,I);const i=await Pd(r.localStore,e,!0),l=new xb(e,i.Ts),c=l.ma(i.documents),d=ua.createSynthesizedTargetChangeForCurrentChange(t,s&&r.onlineState!=="Offline",a),h=l.applyChanges(c,r.isPrimaryClient,d);Bd(r,t,h.wa);const m=new yb(e,t,l);return r.Fa.set(e,m),r.Ma.has(t)?r.Ma.get(t).push(e):r.Ma.set(t,[e]),h.snapshot}async function Nb(r,e,t){const s=$e(r),a=s.Fa.get(e),i=s.Ma.get(a.targetId);if(i.length>1)return s.Ma.set(a.targetId,i.filter(l=>!Ci(l,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(a.targetId),s.sharedClientState.isActiveQueryTarget(a.targetId)||await zo(s.localStore,a.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(a.targetId),t&&Nl(s.remoteStore,a.targetId),Go(s,a.targetId)}).catch(la)):(Go(s,a.targetId),await zo(s.localStore,a.targetId,!0))}async function Eb(r,e){const t=$e(r),s=t.Fa.get(e),a=t.Ma.get(s.targetId);t.isPrimaryClient&&a.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Nl(t.remoteStore,s.targetId))}async function jb(r,e,t){const s=Db(r);try{const a=await function(l,c){const d=$e(l),h=xt.now(),m=c.reduce((I,N)=>I.add(N.key),Ve());let x,b;return d.persistence.runTransaction("Locally write mutations","readwrite",I=>{let N=Or(),T=Ve();return d.cs.getEntries(I,m).next(E=>{N=E,N.forEach((P,O)=>{O.isValidDocument()||(T=T.add(P))})}).next(()=>d.localDocuments.getOverlayedDocuments(I,N)).next(E=>{x=E;const P=[];for(const O of c){const C=zx(O,x.get(O.key).overlayedDocument);C!=null&&P.push(new os(O.key,C,Eh(C.value.mapValue),rr.exists(!0)))}return d.mutationQueue.addMutationBatch(I,h,P,c)}).next(E=>{b=E;const P=E.applyToLocalDocumentSet(x,T);return d.documentOverlayCache.saveOverlays(I,E.batchId,P)})}).then(()=>({batchId:b.batchId,changes:Oh(x)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(a.batchId),function(l,c,d){let h=l.Ba[l.currentUser.toKey()];h||(h=new st(ze)),h=h.insert(c,d),l.Ba[l.currentUser.toKey()]=h}(s,a.batchId,t),await ma(s,a.changes),await Vi(s.remoteStore)}catch(a){const i=Sl(a,"Failed to persist write");t.reject(i)}}async function pm(r,e){const t=$e(r);try{const s=await Vy(t.localStore,e);e.targetChanges.forEach((a,i)=>{const l=t.Na.get(i);l&&(Qe(a.addedDocuments.size+a.modifiedDocuments.size+a.removedDocuments.size<=1),a.addedDocuments.size>0?l.va=!0:a.modifiedDocuments.size>0?Qe(l.va):a.removedDocuments.size>0&&(Qe(l.va),l.va=!1))}),await ma(t,s,e)}catch(s){await la(s)}}function Ud(r,e,t){const s=$e(r);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const a=[];s.Fa.forEach((i,l)=>{const c=l.view.Z_(e);c.snapshot&&a.push(c.snapshot)}),function(l,c){const d=$e(l);d.onlineState=c;let h=!1;d.queries.forEach((m,x)=>{for(const b of x.j_)b.Z_(c)&&(h=!0)}),h&&Al(d)}(s.eventManager,e),a.length&&s.Ca.d_(a),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function Ib(r,e,t){const s=$e(r);s.sharedClientState.updateQueryState(e,"rejected",t);const a=s.Na.get(e),i=a&&a.key;if(i){let l=new st(Ie.comparator);l=l.insert(i,$t.newNoDocument(i,Pe.min()));const c=Ve().add(i),d=new $i(Pe.min(),new Map,new st(ze),l,c);await pm(s,d),s.Oa=s.Oa.remove(i),s.Na.delete(e),Cl(s)}else await zo(s.localStore,e,!1).then(()=>Go(s,e,t)).catch(la)}async function Tb(r,e){const t=$e(r),s=e.batch.batchId;try{const a=await Oy(t.localStore,e);xm(t,s,null),fm(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await ma(t,a)}catch(a){await la(a)}}async function Sb(r,e,t){const s=$e(r);try{const a=await function(l,c){const d=$e(l);return d.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let m;return d.mutationQueue.lookupMutationBatch(h,c).next(x=>(Qe(x!==null),m=x.keys(),d.mutationQueue.removeMutationBatch(h,x))).next(()=>d.mutationQueue.performConsistencyCheck(h)).next(()=>d.documentOverlayCache.removeOverlaysForBatchId(h,m,c)).next(()=>d.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,m)).next(()=>d.localDocuments.getDocuments(h,m))})}(s.localStore,e);xm(s,e,t),fm(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await ma(s,a)}catch(a){await la(a)}}function fm(r,e){(r.ka.get(e)||[]).forEach(t=>{t.resolve()}),r.ka.delete(e)}function xm(r,e,t){const s=$e(r);let a=s.Ba[s.currentUser.toKey()];if(a){const i=a.get(e);i&&(t?i.reject(t):i.resolve(),a=a.remove(e)),s.Ba[s.currentUser.toKey()]=a}}function Go(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const s of r.Ma.get(e))r.Fa.delete(s),t&&r.Ca.$a(s,t);r.Ma.delete(e),r.isPrimaryClient&&r.La.gr(e).forEach(s=>{r.La.containsKey(s)||ym(r,s)})}function ym(r,e){r.xa.delete(e.path.canonicalString());const t=r.Oa.get(e);t!==null&&(Nl(r.remoteStore,t),r.Oa=r.Oa.remove(e),r.Na.delete(t),Cl(r))}function Bd(r,e,t){for(const s of t)s instanceof hm?(r.La.addReference(s.key,e),Ab(r,s)):s instanceof mm?(ke("SyncEngine","Document no longer in limbo: "+s.key),r.La.removeReference(s.key,e),r.La.containsKey(s.key)||ym(r,s.key)):Re()}function Ab(r,e){const t=e.key,s=t.path.canonicalString();r.Oa.get(t)||r.xa.has(s)||(ke("SyncEngine","New document in limbo: "+t),r.xa.add(s),Cl(r))}function Cl(r){for(;r.xa.size>0&&r.Oa.size<r.maxConcurrentLimboResolutions;){const e=r.xa.values().next().value;r.xa.delete(e);const t=new Ie(tt.fromString(e)),s=r.qa.next();r.Na.set(s,new bb(t)),r.Oa=r.Oa.insert(t,s),im(r.remoteStore,new Jr(mr(Rh(t.path)),s,"TargetPurposeLimboResolution",dl.oe))}}async function ma(r,e,t){const s=$e(r),a=[],i=[],l=[];s.Fa.isEmpty()||(s.Fa.forEach((c,d)=>{l.push(s.Ka(d,e,t).then(h=>{var m;if((h||t)&&s.isPrimaryClient){const x=h?!h.fromCache:(m=t==null?void 0:t.targetChanges.get(d.targetId))===null||m===void 0?void 0:m.current;s.sharedClientState.updateQueryState(d.targetId,x?"current":"not-current")}if(h){a.push(h);const x=kl.Wi(d.targetId,h);i.push(x)}}))}),await Promise.all(l),s.Ca.d_(a),await async function(d,h){const m=$e(d);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",x=>te.forEach(h,b=>te.forEach(b.$i,I=>m.persistence.referenceDelegate.addReference(x,b.targetId,I)).next(()=>te.forEach(b.Ui,I=>m.persistence.referenceDelegate.removeReference(x,b.targetId,I)))))}catch(x){if(!ca(x))throw x;ke("LocalStore","Failed to update sequence numbers: "+x)}for(const x of h){const b=x.targetId;if(!x.fromCache){const I=m.os.get(b),N=I.snapshotVersion,T=I.withLastLimboFreeSnapshotVersion(N);m.os=m.os.insert(b,T)}}}(s.localStore,i))}async function Cb(r,e){const t=$e(r);if(!t.currentUser.isEqual(e)){ke("SyncEngine","User change. New user:",e.toKey());const s=await rm(t.localStore,e);t.currentUser=e,function(i,l){i.ka.forEach(c=>{c.forEach(d=>{d.reject(new ve(J.CANCELLED,l))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await ma(t,s.hs)}}function Rb(r,e){const t=$e(r),s=t.Na.get(e);if(s&&s.va)return Ve().add(s.key);{let a=Ve();const i=t.Ma.get(e);if(!i)return a;for(const l of i){const c=t.Fa.get(l);a=a.unionWith(c.view.Va)}return a}}function bm(r){const e=$e(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=pm.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Rb.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Ib.bind(null,e),e.Ca.d_=gb.bind(null,e.eventManager),e.Ca.$a=pb.bind(null,e.eventManager),e}function Db(r){const e=$e(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Tb.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Sb.bind(null,e),e}class ui{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Mi(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return My(this.persistence,new Py,e.initialUser,this.serializer)}Ga(e){return new Cy(_l.Zr,this.serializer)}Wa(e){return new qy}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ui.provider={build:()=>new ui};class Ko{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>Ud(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=Cb.bind(null,this.syncEngine),await cb(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new ub}()}createDatastore(e){const t=Mi(e.databaseInfo.databaseId),s=function(i){return new Gy(i)}(e.databaseInfo);return function(i,l,c,d){return new Yy(i,l,c,d)}(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return function(s,a,i,l,c){return new Jy(s,a,i,l,c)}(this.localStore,this.datastore,e.asyncQueue,t=>Ud(this.syncEngine,t,0),function(){return Md.D()?new Md:new Wy}())}createSyncEngine(e,t){return function(a,i,l,c,d,h,m){const x=new vb(a,i,l,c,d,h);return m&&(x.Qa=!0),x}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(a){const i=$e(a);ke("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await ha(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Ko.provider={build:()=>new Ko};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pb{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Mr("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $b{constructor(e,t,s,a,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=a,this.user=Pt.UNAUTHENTICATED,this.clientId=_h.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(s,async l=>{ke("FirestoreClient","Received user=",l.uid),await this.authCredentialListener(l),this.user=l}),this.appCheckCredentials.start(s,l=>(ke("FirestoreClient","Received new app check token=",l),this.appCheckCredentialListener(l,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ts;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=Sl(t,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function fo(r,e){r.asyncQueue.verifyOperationInProgress(),ke("FirestoreClient","Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let s=t.initialUser;r.setCredentialChangeListener(async a=>{s.isEqual(a)||(await rm(e.localStore,a),s=a)}),e.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=e}async function qd(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Mb(r);ke("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(s=>Od(e.remoteStore,s)),r.setAppCheckTokenChangeListener((s,a)=>Od(e.remoteStore,a)),r._onlineComponents=e}async function Mb(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){ke("FirestoreClient","Using user provided OfflineComponentProvider");try{await fo(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(a){return a.name==="FirebaseError"?a.code===J.FAILED_PRECONDITION||a.code===J.UNIMPLEMENTED:!(typeof DOMException<"u"&&a instanceof DOMException)||a.code===22||a.code===20||a.code===11}(t))throw t;Js("Error using user provided cache. Falling back to memory cache: "+t),await fo(r,new ui)}}else ke("FirestoreClient","Using default OfflineComponentProvider"),await fo(r,new ui);return r._offlineComponents}async function vm(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(ke("FirestoreClient","Using user provided OnlineComponentProvider"),await qd(r,r._uninitializedComponentsProvider._online)):(ke("FirestoreClient","Using default OnlineComponentProvider"),await qd(r,new Ko))),r._onlineComponents}function Ob(r){return vm(r).then(e=>e.syncEngine)}async function Vb(r){const e=await vm(r),t=e.eventManager;return t.onListen=wb.bind(null,e.syncEngine),t.onUnlisten=Nb.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=_b.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Eb.bind(null,e.syncEngine),t}function Lb(r,e,t={}){const s=new ts;return r.asyncQueue.enqueueAndForget(async()=>function(i,l,c,d,h){const m=new Pb({next:b=>{m.Za(),l.enqueueAndForget(()=>mb(i,x)),b.fromCache&&d.source==="server"?h.reject(new ve(J.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(b)},error:b=>h.reject(b)}),x=new fb(c,m,{includeMetadataChanges:!0,_a:!0});return hb(i,x)}(await Vb(r),r.asyncQueue,e,t,s)),s.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wm(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wd=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _m(r,e,t){if(!t)throw new ve(J.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function Fb(r,e,t,s){if(e===!0&&s===!0)throw new ve(J.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function zd(r){if(!Ie.isDocumentKey(r))throw new ve(J.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Hd(r){if(Ie.isDocumentKey(r))throw new ve(J.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Li(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":Re()}function js(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new ve(J.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Li(r);throw new ve(J.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new ve(J.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new ve(J.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Fb("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=wm((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new ve(J.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new ve(J.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new ve(J.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,a){return s.timeoutSeconds===a.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Fi{constructor(e,t,s,a){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=a,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Gd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ve(J.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new ve(J.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Gd(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new ex;switch(s.type){case"firstParty":return new nx(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new ve(J.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=Wd.get(t);s&&(ke("ComponentProvider","Removing Datastore"),Wd.delete(t),s.terminate())}(this),Promise.resolve()}}function Ub(r,e,t,s={}){var a;const i=(r=js(r,Fi))._getSettings(),l=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==l&&Js("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),r._setSettings(Object.assign(Object.assign({},i),{host:l,ssl:!1})),s.mockUserToken){let c,d;if(typeof s.mockUserToken=="string")c=s.mockUserToken,d=Pt.MOCK_USER;else{c=ch(s.mockUserToken,(a=r._app)===null||a===void 0?void 0:a.options.projectId);const h=s.mockUserToken.sub||s.mockUserToken.user_id;if(!h)throw new ve(J.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");d=new Pt(h)}r._authCredentials=new tx(new wh(c,d))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rs{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Rs(this.firestore,e,this._query)}}class Yt{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new rs(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Yt(this.firestore,e,this._key)}}class rs extends Rs{constructor(e,t,s){super(e,t,Rh(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Yt(this.firestore,null,new Ie(e))}withConverter(e){return new rs(this.firestore,e,this._path)}}function wt(r,e,...t){if(r=Ot(r),_m("collection","path",e),r instanceof Fi){const s=tt.fromString(e,...t);return Hd(s),new rs(r,null,s)}{if(!(r instanceof Yt||r instanceof rs))throw new ve(J.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(tt.fromString(e,...t));return Hd(s),new rs(r.firestore,null,s)}}function Lt(r,e,...t){if(r=Ot(r),arguments.length===1&&(e=_h.newId()),_m("doc","path",e),r instanceof Fi){const s=tt.fromString(e,...t);return zd(s),new Yt(r,null,new Ie(s))}{if(!(r instanceof Yt||r instanceof rs))throw new ve(J.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(tt.fromString(e,...t));return zd(s),new Yt(r.firestore,r instanceof rs?r.converter:null,new Ie(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kd{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new nm(this,"async_queue_retry"),this.Vu=()=>{const s=po();s&&ke("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const t=po();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=po();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new ts;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!ca(e))throw e;ke("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const a=function(l){let c=l.message||"";return l.stack&&(c=l.stack.includes(l.message)?l.stack:l.message+`
`+l.stack),c}(s);throw Mr("INTERNAL UNHANDLED ERROR: ",a),s}).then(s=>(this.du=!1,s))));return this.mu=t,t}enqueueAfterDelay(e,t,s){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const a=Tl.createAndSchedule(this,e,t,s,i=>this.yu(i));return this.Tu.push(a),a}fu(){this.Eu&&Re()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class ga extends Fi{constructor(e,t,s,a){super(e,t,s,a),this.type="firestore",this._queue=new Kd,this._persistenceKey=(a==null?void 0:a.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Kd(e),this._firestoreClient=void 0,await e}}}function Bb(r,e){const t=typeof r=="object"?r:ll(),s=typeof r=="string"?r:"(default)",a=Si(t,"firestore").getImmediate({identifier:s});if(!a._initialized){const i=ih("firestore");i&&Ub(a,...i)}return a}function km(r){if(r._terminated)throw new ve(J.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||qb(r),r._firestoreClient}function qb(r){var e,t,s;const a=r._freezeSettings(),i=function(c,d,h,m){return new xx(c,d,h,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,wm(m.experimentalLongPollingOptions),m.useFetchStreams)}(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,a);r._componentsProvider||!((t=a.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=a.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(r._componentsProvider={_offline:a.localCache._offlineComponentProvider,_online:a.localCache._onlineComponentProvider}),r._firestoreClient=new $b(r._authCredentials,r._appCheckCredentials,r._queue,i,r._componentsProvider&&function(c){const d=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(d),_online:d}}(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new nn(St.fromBase64String(e))}catch(t){throw new ve(J.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new nn(St.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ui{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new ve(J.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new jt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rl{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dl{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new ve(J.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new ve(J.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ze(this._lat,e._lat)||ze(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,a){if(s.length!==a.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==a[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wb=/^__.*__$/;class zb{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new os(e,this.data,this.fieldMask,t,this.fieldTransforms):new da(e,this.data,t,this.fieldTransforms)}}class Nm{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new os(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Em(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Re()}}class $l{constructor(e,t,s,a,i,l){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=a,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=l||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new $l(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),a=this.Fu({path:s,xu:!1});return a.Ou(e),a}Nu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),a=this.Fu({path:s,xu:!1});return a.vu(),a}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return hi(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Em(this.Cu)&&Wb.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Hb{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Mi(e)}Qu(e,t,s,a=!1){return new $l({Cu:e,methodName:t,qu:s,path:jt.emptyPath(),xu:!1,ku:a},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ml(r){const e=r._freezeSettings(),t=Mi(r._databaseId);return new Hb(r._databaseId,!!e.ignoreUndefinedProperties,t)}function Gb(r,e,t,s,a,i={}){const l=r.Qu(i.merge||i.mergeFields?2:0,e,t,a);Ol("Data must be an object, but it was:",l,s);const c=jm(s,l);let d,h;if(i.merge)d=new Qt(l.fieldMask),h=l.fieldTransforms;else if(i.mergeFields){const m=[];for(const x of i.mergeFields){const b=Qo(e,x,t);if(!l.contains(b))throw new ve(J.INVALID_ARGUMENT,`Field '${b}' is specified in your field mask but missing from your input data.`);Tm(m,b)||m.push(b)}d=new Qt(m),h=l.fieldTransforms.filter(x=>d.covers(x.field))}else d=null,h=l.fieldTransforms;return new zb(new Wt(c),d,h)}class Bi extends Rl{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Bi}}function Kb(r,e,t,s){const a=r.Qu(1,e,t);Ol("Data must be an object, but it was:",a,s);const i=[],l=Wt.empty();As(s,(d,h)=>{const m=Vl(e,d,t);h=Ot(h);const x=a.Nu(m);if(h instanceof Bi)i.push(m);else{const b=pa(h,x);b!=null&&(i.push(m),l.set(m,b))}});const c=new Qt(i);return new Nm(l,c,a.fieldTransforms)}function Qb(r,e,t,s,a,i){const l=r.Qu(1,e,t),c=[Qo(e,s,t)],d=[a];if(i.length%2!=0)throw new ve(J.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let b=0;b<i.length;b+=2)c.push(Qo(e,i[b])),d.push(i[b+1]);const h=[],m=Wt.empty();for(let b=c.length-1;b>=0;--b)if(!Tm(h,c[b])){const I=c[b];let N=d[b];N=Ot(N);const T=l.Nu(I);if(N instanceof Bi)h.push(I);else{const E=pa(N,T);E!=null&&(h.push(I),m.set(I,E))}}const x=new Qt(h);return new Nm(m,x,l.fieldTransforms)}function Yb(r,e,t,s=!1){return pa(t,r.Qu(s?4:3,e))}function pa(r,e){if(Im(r=Ot(r)))return Ol("Unsupported field value:",e,r),jm(r,e);if(r instanceof Rl)return function(s,a){if(!Em(a.Cu))throw a.Bu(`${s._methodName}() can only be used with update() and set()`);if(!a.path)throw a.Bu(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(a);i&&a.fieldTransforms.push(i)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,a){const i=[];let l=0;for(const c of s){let d=pa(c,a.Lu(l));d==null&&(d={nullValue:"NULL_VALUE"}),i.push(d),l++}return{arrayValue:{values:i}}}(r,e)}return function(s,a){if((s=Ot(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Lx(a.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=xt.fromDate(s);return{timestampValue:ci(a.serializer,i)}}if(s instanceof xt){const i=new xt(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:ci(a.serializer,i)}}if(s instanceof Dl)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof nn)return{bytesValue:Qh(a.serializer,s._byteString)};if(s instanceof Yt){const i=a.databaseId,l=s.firestore._databaseId;if(!l.isEqual(i))throw a.Bu(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:vl(s.firestore._databaseId||a.databaseId,s._key.path)}}if(s instanceof Pl)return function(l,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:l.toArray().map(d=>{if(typeof d!="number")throw c.Bu("VectorValues must only contain numeric values.");return fl(c.serializer,d)})}}}}}}(s,a);throw a.Bu(`Unsupported field value: ${Li(s)}`)}(r,e)}function jm(r,e){const t={};return kh(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):As(r,(s,a)=>{const i=pa(a,e.Mu(s));i!=null&&(t[s]=i)}),{mapValue:{fields:t}}}function Im(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof xt||r instanceof Dl||r instanceof nn||r instanceof Yt||r instanceof Rl||r instanceof Pl)}function Ol(r,e,t){if(!Im(t)||!function(a){return typeof a=="object"&&a!==null&&(Object.getPrototypeOf(a)===Object.prototype||Object.getPrototypeOf(a)===null)}(t)){const s=Li(t);throw s==="an object"?e.Bu(r+" a custom object"):e.Bu(r+" "+s)}}function Qo(r,e,t){if((e=Ot(e))instanceof Ui)return e._internalPath;if(typeof e=="string")return Vl(r,e);throw hi("Field path arguments must be of type string or ",r,!1,void 0,t)}const Xb=new RegExp("[~\\*/\\[\\]]");function Vl(r,e,t){if(e.search(Xb)>=0)throw hi(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Ui(...e.split("."))._internalPath}catch{throw hi(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function hi(r,e,t,s,a){const i=s&&!s.isEmpty(),l=a!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let d="";return(i||l)&&(d+=" (found",i&&(d+=` in field ${s}`),l&&(d+=` in document ${a}`),d+=")"),new ve(J.INVALID_ARGUMENT,c+r+d)}function Tm(r,e){return r.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sm{constructor(e,t,s,a,i){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=a,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Yt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Jb(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(qi("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Jb extends Sm{data(){return super.data()}}function qi(r,e){return typeof e=="string"?Vl(r,e):e instanceof Ui?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zb(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new ve(J.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ll{}class Am extends Ll{}function ct(r,e,...t){let s=[];e instanceof Ll&&s.push(e),s=s.concat(t),function(i){const l=i.filter(d=>d instanceof Fl).length,c=i.filter(d=>d instanceof Wi).length;if(l>1||l>0&&c>0)throw new ve(J.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const a of s)r=a._apply(r);return r}class Wi extends Am{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new Wi(e,t,s)}_apply(e){const t=this._parse(e);return Cm(e._query,t),new Rs(e.firestore,e.converter,Lo(e._query,t))}_parse(e){const t=Ml(e.firestore);return function(i,l,c,d,h,m,x){let b;if(h.isKeyField()){if(m==="array-contains"||m==="array-contains-any")throw new ve(J.INVALID_ARGUMENT,`Invalid Query. You can't perform '${m}' queries on documentId().`);if(m==="in"||m==="not-in"){Yd(x,m);const I=[];for(const N of x)I.push(Qd(d,i,N));b={arrayValue:{values:I}}}else b=Qd(d,i,x)}else m!=="in"&&m!=="not-in"&&m!=="array-contains-any"||Yd(x,m),b=Yb(c,l,x,m==="in"||m==="not-in");return mt.create(h,m,b)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Ht(r,e,t){const s=e,a=qi("where",r);return Wi._create(a,s,t)}class Fl extends Ll{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Fl(e,t)}_parse(e){const t=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return t.length===1?t[0]:nr.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(a,i){let l=a;const c=i.getFlattenedFilters();for(const d of c)Cm(l,d),l=Lo(l,d)}(e._query,t),new Rs(e.firestore,e.converter,Lo(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Ul extends Am{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Ul(e,t)}_apply(e){const t=function(a,i,l){if(a.startAt!==null)throw new ve(J.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(a.endAt!==null)throw new ve(J.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Gn(i,l)}(e._query,this._field,this._direction);return new Rs(e.firestore,e.converter,function(a,i){const l=a.explicitOrderBy.concat([i]);return new dn(a.path,a.collectionGroup,l,a.filters.slice(),a.limit,a.limitType,a.startAt,a.endAt)}(e._query,t))}}function Yn(r,e="asc"){const t=e,s=qi("orderBy",r);return Ul._create(s,t)}function Qd(r,e,t){if(typeof(t=Ot(t))=="string"){if(t==="")throw new ve(J.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Dh(e)&&t.indexOf("/")!==-1)throw new ve(J.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(tt.fromString(t));if(!Ie.isDocumentKey(s))throw new ve(J.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return xd(r,new Ie(s))}if(t instanceof Yt)return xd(r,t._key);throw new ve(J.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Li(t)}.`)}function Yd(r,e){if(!Array.isArray(r)||r.length===0)throw new ve(J.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Cm(r,e){const t=function(a,i){for(const l of a)for(const c of l.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null}(r.filters,function(a){switch(a){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new ve(J.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new ve(J.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class ev{convertValue(e,t="none"){switch(Es(e)){case 0:return null;case 1:return e.booleanValue;case 2:return lt(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ns(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Re()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return As(e,(a,i)=>{s[a]=this.convertValue(i,t)}),s}convertVectorValue(e){var t,s,a;const i=(a=(s=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||s===void 0?void 0:s.values)===null||a===void 0?void 0:a.map(l=>lt(l.doubleValue));return new Pl(i)}convertGeoPoint(e){return new Dl(lt(e.latitude),lt(e.longitude))}convertArray(e,t){return(e.values||[]).map(s=>this.convertValue(s,t))}convertServerTimestamp(e,t){switch(t){case"previous":const s=hl(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Wn(e));default:return null}}convertTimestamp(e){const t=as(e);return new xt(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=tt.fromString(e);Qe(tm(s));const a=new zn(s.get(1),s.get(3)),i=new Ie(s.popFirst(5));return a.isEqual(t)||Mr(`Document ${i} contains a document reference within a different database (${a.projectId}/${a.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tv(r,e,t){let s;return s=r?r.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Va{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class rv extends Sm{constructor(e,t,s,a,i,l){super(e,t,s,a,l),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Qa(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(qi("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}}class Qa extends rv{data(e={}){return super.data(e)}}class sv{constructor(e,t,s,a){this._firestore=e,this._userDataWriter=t,this._snapshot=a,this.metadata=new Va(a.hasPendingWrites,a.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new Qa(this._firestore,this._userDataWriter,s.key,s,new Va(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new ve(J.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(a,i){if(a._snapshot.oldDocs.isEmpty()){let l=0;return a._snapshot.docChanges.map(c=>{const d=new Qa(a._firestore,a._userDataWriter,c.doc.key,c.doc,new Va(a._snapshot.mutatedKeys.has(c.doc.key),a._snapshot.fromCache),a.query.converter);return c.doc,{type:"added",doc:d,oldIndex:-1,newIndex:l++}})}{let l=a._snapshot.oldDocs;return a._snapshot.docChanges.filter(c=>i||c.type!==3).map(c=>{const d=new Qa(a._firestore,a._userDataWriter,c.doc.key,c.doc,new Va(a._snapshot.mutatedKeys.has(c.doc.key),a._snapshot.fromCache),a.query.converter);let h=-1,m=-1;return c.type!==0&&(h=l.indexOf(c.doc.key),l=l.delete(c.doc.key)),c.type!==1&&(l=l.add(c.doc),m=l.indexOf(c.doc.key)),{type:nv(c.type),doc:d,oldIndex:h,newIndex:m}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function nv(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Re()}}class av extends ev{constructor(e){super(),this.firestore=e}convertBytes(e){return new nn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Yt(this.firestore,null,t)}}function ar(r){r=js(r,Rs);const e=js(r.firestore,ga),t=km(e),s=new av(e);return Zb(r._query),Lb(t,r._query).then(a=>new sv(e,s,r,a))}function Ds(r,e,t,...s){r=js(r,Yt);const a=js(r.firestore,ga),i=Ml(a);let l;return l=typeof(e=Ot(e))=="string"||e instanceof Ui?Qb(i,"updateDoc",r._key,e,t,s):Kb(i,"updateDoc",r._key,e),Bl(a,[l.toMutation(r._key,rr.exists(!0))])}function ls(r){return Bl(js(r.firestore,ga),[new xl(r._key,rr.none())])}function Ps(r,e){const t=js(r.firestore,ga),s=Lt(r),a=tv(r.converter,e);return Bl(t,[Gb(Ml(r.firestore),"addDoc",s._key,a,r.converter!==null,{}).toMutation(s._key,rr.exists(!1))]).then(()=>s)}function Bl(r,e){return function(s,a){const i=new ts;return s.asyncQueue.enqueueAndForget(async()=>jb(await Ob(s),a,i)),i.promise}(km(r),e)}(function(e,t=!0){(function(a){cn=a})(Ss),_s(new ss("firestore",(s,{instanceIdentifier:a,options:i})=>{const l=s.getProvider("app").getImmediate(),c=new ga(new rx(s.getProvider("auth-internal")),new ix(s.getProvider("app-check-internal")),function(h,m){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new ve(J.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new zn(h.options.projectId,m)}(l,a),l);return i=Object.assign({useFetchStreams:t},i),c._setSettings(i),c},"PUBLIC").setMultipleInstances(!0)),hr(hd,"4.7.3",e),hr(hd,"4.7.3","esm2017")})();var iv="firebase",ov="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */hr(iv,ov,"app");function ql(r,e){var t={};for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&e.indexOf(s)<0&&(t[s]=r[s]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,s=Object.getOwnPropertySymbols(r);a<s.length;a++)e.indexOf(s[a])<0&&Object.prototype.propertyIsEnumerable.call(r,s[a])&&(t[s[a]]=r[s[a]]);return t}function Rm(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const lv=Rm,Dm=new ia("auth","Firebase",Rm());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mi=new il("@firebase/auth");function cv(r,...e){mi.logLevel<=Fe.WARN&&mi.warn(`Auth (${Ss}): ${r}`,...e)}function Ya(r,...e){mi.logLevel<=Fe.ERROR&&mi.error(`Auth (${Ss}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vr(r,...e){throw Wl(r,...e)}function pr(r,...e){return Wl(r,...e)}function Pm(r,e,t){const s=Object.assign(Object.assign({},lv()),{[e]:t});return new ia("auth","Firebase",s).create(e,{appName:r.name})}function bs(r){return Pm(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Wl(r,...e){if(typeof r!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=r.name),r._errorFactory.create(t,...s)}return Dm.create(r,...e)}function Ce(r,e,...t){if(!r)throw Wl(e,...t)}function Sr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Ya(e),new Error(e)}function Lr(r,e){r||Sr(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yo(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function dv(){return Xd()==="http:"||Xd()==="https:"}function Xd(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uv(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(dv()||Pf()||"connection"in navigator)?navigator.onLine:!0}function hv(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa{constructor(e,t){this.shortDelay=e,this.longDelay=t,Lr(t>e,"Short delay should be less than long delay!"),this.isMobile=Cf()||$f()}get(){return uv()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zl(r,e){Lr(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $m{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Sr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Sr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Sr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mv={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gv=new fa(3e4,6e4);function Hl(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function mn(r,e,t,s,a={}){return Mm(r,a,async()=>{let i={},l={};s&&(e==="GET"?l=s:i={body:JSON.stringify(s)});const c=oa(Object.assign({key:r.config.apiKey},l)).slice(1),d=await r._getAdditionalHeaders();d["Content-Type"]="application/json",r.languageCode&&(d["X-Firebase-Locale"]=r.languageCode);const h=Object.assign({method:e,headers:d},i);return Df()||(h.referrerPolicy="no-referrer"),$m.fetch()(Om(r,r.config.apiHost,t,c),h)})}async function Mm(r,e,t){r._canInitEmulator=!1;const s=Object.assign(Object.assign({},mv),e);try{const a=new fv(r),i=await Promise.race([t(),a.promise]);a.clearNetworkTimeout();const l=await i.json();if("needConfirmation"in l)throw La(r,"account-exists-with-different-credential",l);if(i.ok&&!("errorMessage"in l))return l;{const c=i.ok?l.errorMessage:l.error.message,[d,h]=c.split(" : ");if(d==="FEDERATED_USER_ID_ALREADY_LINKED")throw La(r,"credential-already-in-use",l);if(d==="EMAIL_EXISTS")throw La(r,"email-already-in-use",l);if(d==="USER_DISABLED")throw La(r,"user-disabled",l);const m=s[d]||d.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Pm(r,m,h);Vr(r,m)}}catch(a){if(a instanceof vr)throw a;Vr(r,"network-request-failed",{message:String(a)})}}async function pv(r,e,t,s,a={}){const i=await mn(r,e,t,s,a);return"mfaPendingCredential"in i&&Vr(r,"multi-factor-auth-required",{_serverResponse:i}),i}function Om(r,e,t,s){const a=`${e}${t}?${s}`;return r.config.emulator?zl(r.config,a):`${r.config.apiScheme}://${a}`}class fv{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(pr(this.auth,"network-request-failed")),gv.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function La(r,e,t){const s={appName:r.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const a=pr(r,e,s);return a.customData._tokenResponse=t,a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xv(r,e){return mn(r,"POST","/v1/accounts:delete",e)}async function Vm(r,e){return mn(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function On(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function yv(r,e=!1){const t=Ot(r),s=await t.getIdToken(e),a=Gl(s);Ce(a&&a.exp&&a.auth_time&&a.iat,t.auth,"internal-error");const i=typeof a.firebase=="object"?a.firebase:void 0,l=i==null?void 0:i.sign_in_provider;return{claims:a,token:s,authTime:On(xo(a.auth_time)),issuedAtTime:On(xo(a.iat)),expirationTime:On(xo(a.exp)),signInProvider:l||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function xo(r){return Number(r)*1e3}function Gl(r){const[e,t,s]=r.split(".");if(e===void 0||t===void 0||s===void 0)return Ya("JWT malformed, contained fewer than 3 sections"),null;try{const a=nh(t);return a?JSON.parse(a):(Ya("Failed to decode base64 JWT payload"),null)}catch(a){return Ya("Caught error parsing JWT payload as JSON",a==null?void 0:a.toString()),null}}function Jd(r){const e=Gl(r);return Ce(e,"internal-error"),Ce(typeof e.exp<"u","internal-error"),Ce(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xn(r,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof vr&&bv(s)&&r.auth.currentUser===r&&await r.auth.signOut(),s}}function bv({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vv{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const a=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,a)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xo{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=On(this.lastLoginAt),this.creationTime=On(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gi(r){var e;const t=r.auth,s=await r.getIdToken(),a=await Xn(r,Vm(t,{idToken:s}));Ce(a==null?void 0:a.users.length,t,"internal-error");const i=a.users[0];r._notifyReloadListener(i);const l=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Lm(i.providerUserInfo):[],c=_v(r.providerData,l),d=r.isAnonymous,h=!(r.email&&i.passwordHash)&&!(c!=null&&c.length),m=d?h:!1,x={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:c,metadata:new Xo(i.createdAt,i.lastLoginAt),isAnonymous:m};Object.assign(r,x)}async function wv(r){const e=Ot(r);await gi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function _v(r,e){return[...r.filter(s=>!e.some(a=>a.providerId===s.providerId)),...e]}function Lm(r){return r.map(e=>{var{providerId:t}=e,s=ql(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kv(r,e){const t=await Mm(r,{},async()=>{const s=oa({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:a,apiKey:i}=r.config,l=Om(r,a,"/v1/token",`key=${i}`),c=await r._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",$m.fetch()(l,{method:"POST",headers:c,body:s})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Nv(r,e){return mn(r,"POST","/v2/accounts:revokeToken",Hl(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Ce(e.idToken,"internal-error"),Ce(typeof e.idToken<"u","internal-error"),Ce(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Jd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Ce(e.length!==0,"internal-error");const t=Jd(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(Ce(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:a,expiresIn:i}=await kv(e,t);this.updateTokensAndExpiration(s,a,Number(i))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:a,expirationTime:i}=t,l=new zs;return s&&(Ce(typeof s=="string","internal-error",{appName:e}),l.refreshToken=s),a&&(Ce(typeof a=="string","internal-error",{appName:e}),l.accessToken=a),i&&(Ce(typeof i=="number","internal-error",{appName:e}),l.expirationTime=i),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new zs,this.toJSON())}_performRefresh(){return Sr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wr(r,e){Ce(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Ar{constructor(e){var{uid:t,auth:s,stsTokenManager:a}=e,i=ql(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new vv(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=a,this.accessToken=a.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Xo(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Xn(this,this.stsTokenManager.getToken(this.auth,e));return Ce(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return yv(this,e)}reload(){return wv(this)}_assign(e){this!==e&&(Ce(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ar(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){Ce(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await gi(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Xr(this.auth.app))return Promise.reject(bs(this.auth));const e=await this.getIdToken();return await Xn(this,xv(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,a,i,l,c,d,h,m;const x=(s=t.displayName)!==null&&s!==void 0?s:void 0,b=(a=t.email)!==null&&a!==void 0?a:void 0,I=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,N=(l=t.photoURL)!==null&&l!==void 0?l:void 0,T=(c=t.tenantId)!==null&&c!==void 0?c:void 0,E=(d=t._redirectEventId)!==null&&d!==void 0?d:void 0,P=(h=t.createdAt)!==null&&h!==void 0?h:void 0,O=(m=t.lastLoginAt)!==null&&m!==void 0?m:void 0,{uid:C,emailVerified:M,isAnonymous:ee,providerData:Z,stsTokenManager:j}=t;Ce(C&&j,e,"internal-error");const y=zs.fromJSON(this.name,j);Ce(typeof C=="string",e,"internal-error"),Wr(x,e.name),Wr(b,e.name),Ce(typeof M=="boolean",e,"internal-error"),Ce(typeof ee=="boolean",e,"internal-error"),Wr(I,e.name),Wr(N,e.name),Wr(T,e.name),Wr(E,e.name),Wr(P,e.name),Wr(O,e.name);const v=new Ar({uid:C,auth:e,email:b,emailVerified:M,displayName:x,isAnonymous:ee,photoURL:N,phoneNumber:I,tenantId:T,stsTokenManager:y,createdAt:P,lastLoginAt:O});return Z&&Array.isArray(Z)&&(v.providerData=Z.map(f=>Object.assign({},f))),E&&(v._redirectEventId=E),v}static async _fromIdTokenResponse(e,t,s=!1){const a=new zs;a.updateFromServerResponse(t);const i=new Ar({uid:t.localId,auth:e,stsTokenManager:a,isAnonymous:s});return await gi(i),i}static async _fromGetAccountInfoResponse(e,t,s){const a=t.users[0];Ce(a.localId!==void 0,"internal-error");const i=a.providerUserInfo!==void 0?Lm(a.providerUserInfo):[],l=!(a.email&&a.passwordHash)&&!(i!=null&&i.length),c=new zs;c.updateFromIdToken(s);const d=new Ar({uid:a.localId,auth:e,stsTokenManager:c,isAnonymous:l}),h={uid:a.localId,displayName:a.displayName||null,photoURL:a.photoUrl||null,email:a.email||null,emailVerified:a.emailVerified||!1,phoneNumber:a.phoneNumber||null,tenantId:a.tenantId||null,providerData:i,metadata:new Xo(a.createdAt,a.lastLoginAt),isAnonymous:!(a.email&&a.passwordHash)&&!(i!=null&&i.length)};return Object.assign(d,h),d}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zd=new Map;function Cr(r){Lr(r instanceof Function,"Expected a class definition");let e=Zd.get(r);return e?(Lr(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Zd.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Fm.type="NONE";const eu=Fm;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xa(r,e,t){return`firebase:${r}:${e}:${t}`}class Hs{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:a,name:i}=this.auth;this.fullUserKey=Xa(this.userKey,a.apiKey,i),this.fullPersistenceKey=Xa("persistence",a.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Ar._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new Hs(Cr(eu),e,s);const a=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let i=a[0]||Cr(eu);const l=Xa(s,e.config.apiKey,e.name);let c=null;for(const h of t)try{const m=await h._get(l);if(m){const x=Ar._fromJSON(e,m);h!==i&&(c=x),i=h;break}}catch{}const d=a.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!d.length?new Hs(i,e,s):(i=d[0],c&&await i._set(l,c.toJSON()),await Promise.all(t.map(async h=>{if(h!==i)try{await h._remove(l)}catch{}})),new Hs(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tu(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Wm(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Um(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Hm(e))return"Blackberry";if(Gm(e))return"Webos";if(Bm(e))return"Safari";if((e.includes("chrome/")||qm(e))&&!e.includes("edge/"))return"Chrome";if(zm(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=r.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Um(r=Mt()){return/firefox\//i.test(r)}function Bm(r=Mt()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function qm(r=Mt()){return/crios\//i.test(r)}function Wm(r=Mt()){return/iemobile/i.test(r)}function zm(r=Mt()){return/android/i.test(r)}function Hm(r=Mt()){return/blackberry/i.test(r)}function Gm(r=Mt()){return/webos/i.test(r)}function Kl(r=Mt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function Ev(r=Mt()){var e;return Kl(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function jv(){return Mf()&&document.documentMode===10}function Km(r=Mt()){return Kl(r)||zm(r)||Gm(r)||Hm(r)||/windows phone/i.test(r)||Wm(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qm(r,e=[]){let t;switch(r){case"Browser":t=tu(Mt());break;case"Worker":t=`${tu(Mt())}-${r}`;break;default:t=r}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Ss}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iv{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=i=>new Promise((l,c)=>{try{const d=e(i);l(d)}catch(d){c(d)}});s.onAbort=t,this.queue.push(s);const a=this.queue.length-1;return()=>{this.queue[a]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const a of t)try{a()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tv(r,e={}){return mn(r,"GET","/v2/passwordPolicy",Hl(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sv=6;class Av{constructor(e){var t,s,a,i;const l=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=l.minPasswordLength)!==null&&t!==void 0?t:Sv,l.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=l.maxPasswordLength),l.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=l.containsLowercaseCharacter),l.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=l.containsUppercaseCharacter),l.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=l.containsNumericCharacter),l.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=l.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(a=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&a!==void 0?a:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,a,i,l,c;const d={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,d),this.validatePasswordCharacterOptions(e,d),d.isValid&&(d.isValid=(t=d.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),d.isValid&&(d.isValid=(s=d.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),d.isValid&&(d.isValid=(a=d.containsLowercaseLetter)!==null&&a!==void 0?a:!0),d.isValid&&(d.isValid=(i=d.containsUppercaseLetter)!==null&&i!==void 0?i:!0),d.isValid&&(d.isValid=(l=d.containsNumericCharacter)!==null&&l!==void 0?l:!0),d.isValid&&(d.isValid=(c=d.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),d}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,a=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),a&&(t.meetsMaxPasswordLength=e.length<=a)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let a=0;a<e.length;a++)s=e.charAt(a),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,a,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=a)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cv{constructor(e,t,s,a){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=a,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ru(this),this.idTokenSubscription=new ru(this),this.beforeStateQueue=new Iv(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Dm,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=a.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Cr(t)),this._initializationPromise=this.queue(async()=>{var s,a;if(!this._deleted&&(this.persistenceManager=await Hs.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((a=this.currentUser)===null||a===void 0?void 0:a.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Vm(this,{idToken:e}),s=await Ar._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Xr(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(c,c))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let a=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=a==null?void 0:a._redirectEventId,d=await this.tryRedirectSignIn(e);(!l||l===c)&&(d!=null&&d.user)&&(a=d.user,i=!0)}if(!a)return this.directlySetCurrentUser(null);if(!a._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(a)}catch(l){a=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return a?this.reloadAndSetCurrentUserOrClear(a):this.directlySetCurrentUser(null)}return Ce(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===a._redirectEventId?this.directlySetCurrentUser(a):this.reloadAndSetCurrentUserOrClear(a)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await gi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=hv()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Xr(this.app))return Promise.reject(bs(this));const t=e?Ot(e):null;return t&&Ce(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Ce(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Xr(this.app)?Promise.reject(bs(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Xr(this.app)?Promise.reject(bs(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Cr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Tv(this),t=new Av(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ia("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await Nv(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Cr(e)||this._popupRedirectResolver;Ce(t,this,"argument-error"),this.redirectPersistenceManager=await Hs.create(this,[Cr(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,a){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let l=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(Ce(c,this,"internal-error"),c.then(()=>{l||i(this.currentUser)}),typeof t=="function"){const d=e.addObserver(t,s,a);return()=>{l=!0,d()}}else{const d=e.addObserver(t);return()=>{l=!0,d()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Ce(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Qm(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const a=await this._getAppCheckToken();return a&&(t["X-Firebase-AppCheck"]=a),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&cv(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Ql(r){return Ot(r)}class ru{constructor(e){this.auth=e,this.observer=null,this.addObserver=Wf(t=>this.observer=t)}get next(){return Ce(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yl={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Rv(r){Yl=r}function Dv(r){return Yl.loadJS(r)}function Pv(){return Yl.gapiScript}function $v(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mv(r,e){const t=Si(r,"auth");if(t.isInitialized()){const a=t.getImmediate(),i=t.getOptions();if(si(i,e??{}))return a;Vr(a,"already-initialized")}return t.initialize({options:e})}function Ov(r,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Cr);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Vv(r,e,t){const s=Ql(r);Ce(s._canInitEmulator,s,"emulator-config-failed"),Ce(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const a=!1,i=Ym(e),{host:l,port:c}=Lv(e),d=c===null?"":`:${c}`;s.config.emulator={url:`${i}//${l}${d}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:l,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:a})}),Fv()}function Ym(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function Lv(r){const e=Ym(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",a=/^(\[[^\]]+\])(:|$)/.exec(s);if(a){const i=a[1];return{host:i,port:su(s.substr(i.length+1))}}else{const[i,l]=s.split(":");return{host:i,port:su(l)}}}function su(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function Fv(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xm{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Sr("not implemented")}_getIdTokenResponse(e){return Sr("not implemented")}_linkToIdToken(e,t){return Sr("not implemented")}_getReauthenticationResolver(e){return Sr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gs(r,e){return pv(r,"POST","/v1/accounts:signInWithIdp",Hl(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uv="http://localhost";class Is extends Xm{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Is(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Vr("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:a}=t,i=ql(t,["providerId","signInMethod"]);if(!s||!a)return null;const l=new Is(s,a);return l.idToken=i.idToken||void 0,l.accessToken=i.accessToken||void 0,l.secret=i.secret,l.nonce=i.nonce,l.pendingToken=i.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return Gs(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,Gs(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Gs(e,t)}buildRequest(){const e={requestUri:Uv,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=oa(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jm{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xa extends Jm{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gr extends xa{constructor(){super("facebook.com")}static credential(e){return Is._fromParams({providerId:Gr.PROVIDER_ID,signInMethod:Gr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Gr.credentialFromTaggedObject(e)}static credentialFromError(e){return Gr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Gr.credential(e.oauthAccessToken)}catch{return null}}}Gr.FACEBOOK_SIGN_IN_METHOD="facebook.com";Gr.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr extends xa{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Is._fromParams({providerId:Kr.PROVIDER_ID,signInMethod:Kr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Kr.credentialFromTaggedObject(e)}static credentialFromError(e){return Kr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Kr.credential(t,s)}catch{return null}}}Kr.GOOGLE_SIGN_IN_METHOD="google.com";Kr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr extends xa{constructor(){super("github.com")}static credential(e){return Is._fromParams({providerId:Qr.PROVIDER_ID,signInMethod:Qr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Qr.credentialFromTaggedObject(e)}static credentialFromError(e){return Qr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Qr.credential(e.oauthAccessToken)}catch{return null}}}Qr.GITHUB_SIGN_IN_METHOD="github.com";Qr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr extends xa{constructor(){super("twitter.com")}static credential(e,t){return Is._fromParams({providerId:Yr.PROVIDER_ID,signInMethod:Yr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Yr.credentialFromTaggedObject(e)}static credentialFromError(e){return Yr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return Yr.credential(t,s)}catch{return null}}}Yr.TWITTER_SIGN_IN_METHOD="twitter.com";Yr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,a=!1){const i=await Ar._fromIdTokenResponse(e,s,a),l=nu(s);return new an({user:i,providerId:l,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const a=nu(s);return new an({user:e,providerId:a,_tokenResponse:s,operationType:t})}}function nu(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pi extends vr{constructor(e,t,s,a){var i;super(t.code,t.message),this.operationType=s,this.user=a,Object.setPrototypeOf(this,pi.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,a){return new pi(e,t,s,a)}}function Zm(r,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?pi._fromErrorAndOperation(r,i,e,s):i})}async function Bv(r,e,t=!1){const s=await Xn(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return an._forOperation(r,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qv(r,e,t=!1){const{auth:s}=r;if(Xr(s.app))return Promise.reject(bs(s));const a="reauthenticate";try{const i=await Xn(r,Zm(s,a,e,r),t);Ce(i.idToken,s,"internal-error");const l=Gl(i.idToken);Ce(l,s,"internal-error");const{sub:c}=l;return Ce(r.uid===c,s,"user-mismatch"),an._forOperation(r,a,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Vr(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wv(r,e,t=!1){if(Xr(r.app))return Promise.reject(bs(r));const s="signIn",a=await Zm(r,s,e),i=await an._fromIdTokenResponse(r,s,a);return t||await r._updateCurrentUser(i.user),i}function zv(r,e,t,s){return Ot(r).onIdTokenChanged(e,t,s)}function Hv(r,e,t){return Ot(r).beforeAuthStateChanged(e,t)}const fi="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(fi,"1"),this.storage.removeItem(fi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gv=1e3,Kv=10;class tg extends eg{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Km(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),a=this.localCache[t];s!==a&&e(t,a,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,c,d)=>{this.notifyListeners(l,d)});return}const s=e.key;t?this.detachListener():this.stopPolling();const a=()=>{const l=this.storage.getItem(s);!t&&this.localCache[s]===l||this.notifyListeners(s,l)},i=this.storage.getItem(s);jv()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(a,Kv):a()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const a of Array.from(s))a(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},Gv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}tg.type="LOCAL";const Qv=tg;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg extends eg{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}rg.type="SESSION";const sg=rg;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yv(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(a=>a.isListeningto(e));if(t)return t;const s=new zi(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:a,data:i}=t.data,l=this.handlersMap[a];if(!(l!=null&&l.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:a});const c=Array.from(l).map(async h=>h(t.origin,i)),d=await Yv(c);t.ports[0].postMessage({status:"done",eventId:s,eventType:a,response:d})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}zi.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xl(r="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xv{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const a=typeof MessageChannel<"u"?new MessageChannel:null;if(!a)throw new Error("connection_unavailable");let i,l;return new Promise((c,d)=>{const h=Xl("",20);a.port1.start();const m=setTimeout(()=>{d(new Error("unsupported_event"))},s);l={messageChannel:a,onMessage(x){const b=x;if(b.data.eventId===h)switch(b.data.status){case"ack":clearTimeout(m),i=setTimeout(()=>{d(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(b.data.response);break;default:clearTimeout(m),clearTimeout(i),d(new Error("invalid_response"));break}}},this.handlers.add(l),a.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[a.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fr(){return window}function Jv(r){fr().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ng(){return typeof fr().WorkerGlobalScope<"u"&&typeof fr().importScripts=="function"}async function Zv(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ew(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function tw(){return ng()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ag="firebaseLocalStorageDb",rw=1,xi="firebaseLocalStorage",ig="fbase_key";class ya{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Hi(r,e){return r.transaction([xi],e?"readwrite":"readonly").objectStore(xi)}function sw(){const r=indexedDB.deleteDatabase(ag);return new ya(r).toPromise()}function Jo(){const r=indexedDB.open(ag,rw);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const s=r.result;try{s.createObjectStore(xi,{keyPath:ig})}catch(a){t(a)}}),r.addEventListener("success",async()=>{const s=r.result;s.objectStoreNames.contains(xi)?e(s):(s.close(),await sw(),e(await Jo()))})})}async function au(r,e,t){const s=Hi(r,!0).put({[ig]:e,value:t});return new ya(s).toPromise()}async function nw(r,e){const t=Hi(r,!1).get(e),s=await new ya(t).toPromise();return s===void 0?null:s.value}function iu(r,e){const t=Hi(r,!0).delete(e);return new ya(t).toPromise()}const aw=800,iw=3;class og{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Jo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>iw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ng()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=zi._getInstance(tw()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Zv(),!this.activeServiceWorker)return;this.sender=new Xv(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ew()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Jo();return await au(e,fi,"1"),await iu(e,fi),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>au(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>nw(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>iu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(a=>{const i=Hi(a,!1).getAll();return new ya(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:a,value:i}of e)s.add(a),JSON.stringify(this.localCache[a])!==JSON.stringify(i)&&(this.notifyListeners(a,i),t.push(a));for(const a of Object.keys(this.localCache))this.localCache[a]&&!s.has(a)&&(this.notifyListeners(a,null),t.push(a));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const a of Array.from(s))a(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),aw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}og.type="LOCAL";const ow=og;new fa(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lw(r,e){return e?Cr(e):(Ce(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl extends Xm{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Gs(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Gs(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Gs(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function cw(r){return Wv(r.auth,new Jl(r),r.bypassAuthState)}function dw(r){const{auth:e,user:t}=r;return Ce(t,e,"internal-error"),qv(t,new Jl(r),r.bypassAuthState)}async function uw(r){const{auth:e,user:t}=r;return Ce(t,e,"internal-error"),Bv(t,new Jl(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lg{constructor(e,t,s,a,i=!1){this.auth=e,this.resolver=s,this.user=a,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:a,tenantId:i,error:l,type:c}=e;if(l){this.reject(l);return}const d={auth:this.auth,requestUri:t,sessionId:s,tenantId:i||void 0,postBody:a||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(d))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return cw;case"linkViaPopup":case"linkViaRedirect":return uw;case"reauthViaPopup":case"reauthViaRedirect":return dw;default:Vr(this.auth,"internal-error")}}resolve(e){Lr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Lr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hw=new fa(2e3,1e4);class qs extends lg{constructor(e,t,s,a,i){super(e,t,a,i),this.provider=s,this.authWindow=null,this.pollId=null,qs.currentPopupAction&&qs.currentPopupAction.cancel(),qs.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Ce(e,this.auth,"internal-error"),e}async onExecution(){Lr(this.filter.length===1,"Popup operations only handle one event");const e=Xl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(pr(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(pr(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,qs.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(pr(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,hw.get())};e()}}qs.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mw="pendingRedirect",Ja=new Map;class gw extends lg{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Ja.get(this.auth._key());if(!e){try{const s=await pw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Ja.set(this.auth._key(),e)}return this.bypassAuthState||Ja.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function pw(r,e){const t=yw(e),s=xw(r);if(!await s._isAvailable())return!1;const a=await s._get(t)==="true";return await s._remove(t),a}function fw(r,e){Ja.set(r._key(),e)}function xw(r){return Cr(r._redirectPersistence)}function yw(r){return Xa(mw,r.config.apiKey,r.name)}async function bw(r,e,t=!1){if(Xr(r.app))return Promise.reject(bs(r));const s=Ql(r),a=lw(s,e),l=await new gw(s,a,t).execute();return l&&!t&&(delete l.user._redirectEventId,await s._persistUserIfCurrent(l.user),await s._setRedirectUser(null,e)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vw=10*60*1e3;class ww{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!_w(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!cg(e)){const a=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(pr(this.auth,a))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=vw&&this.cachedEventUids.clear(),this.cachedEventUids.has(ou(e))}saveEventToCache(e){this.cachedEventUids.add(ou(e)),this.lastProcessedEventTime=Date.now()}}function ou(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function cg({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function _w(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return cg(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kw(r,e={}){return mn(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Ew=/^https?/;async function jw(r){if(r.config.emulator)return;const{authorizedDomains:e}=await kw(r);for(const t of e)try{if(Iw(t))return}catch{}Vr(r,"unauthorized-domain")}function Iw(r){const e=Yo(),{protocol:t,hostname:s}=new URL(e);if(r.startsWith("chrome-extension://")){const l=new URL(r);return l.hostname===""&&s===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===s}if(!Ew.test(t))return!1;if(Nw.test(r))return s===r;const a=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+a+"|"+a+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tw=new fa(3e4,6e4);function lu(){const r=fr().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function Sw(r){return new Promise((e,t)=>{var s,a,i;function l(){lu(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{lu(),t(pr(r,"network-request-failed"))},timeout:Tw.get()})}if(!((a=(s=fr().gapi)===null||s===void 0?void 0:s.iframes)===null||a===void 0)&&a.Iframe)e(gapi.iframes.getContext());else if(!((i=fr().gapi)===null||i===void 0)&&i.load)l();else{const c=$v("iframefcb");return fr()[c]=()=>{gapi.load?l():t(pr(r,"network-request-failed"))},Dv(`${Pv()}?onload=${c}`).catch(d=>t(d))}}).catch(e=>{throw Za=null,e})}let Za=null;function Aw(r){return Za=Za||Sw(r),Za}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cw=new fa(5e3,15e3),Rw="__/auth/iframe",Dw="emulator/auth/iframe",Pw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},$w=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Mw(r){const e=r.config;Ce(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?zl(e,Dw):`https://${r.config.authDomain}/${Rw}`,s={apiKey:e.apiKey,appName:r.name,v:Ss},a=$w.get(r.config.apiHost);a&&(s.eid=a);const i=r._getFrameworks();return i.length&&(s.fw=i.join(",")),`${t}?${oa(s).slice(1)}`}async function Ow(r){const e=await Aw(r),t=fr().gapi;return Ce(t,r,"internal-error"),e.open({where:document.body,url:Mw(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Pw,dontclear:!0},s=>new Promise(async(a,i)=>{await s.restyle({setHideOnLeave:!1});const l=pr(r,"network-request-failed"),c=fr().setTimeout(()=>{i(l)},Cw.get());function d(){fr().clearTimeout(c),a(s)}s.ping(d).then(d,()=>{i(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Lw=500,Fw=600,Uw="_blank",Bw="http://localhost";class cu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function qw(r,e,t,s=Lw,a=Fw){const i=Math.max((window.screen.availHeight-a)/2,0).toString(),l=Math.max((window.screen.availWidth-s)/2,0).toString();let c="";const d=Object.assign(Object.assign({},Vw),{width:s.toString(),height:a.toString(),top:i,left:l}),h=Mt().toLowerCase();t&&(c=qm(h)?Uw:t),Um(h)&&(e=e||Bw,d.scrollbars="yes");const m=Object.entries(d).reduce((b,[I,N])=>`${b}${I}=${N},`,"");if(Ev(h)&&c!=="_self")return Ww(e||"",c),new cu(null);const x=window.open(e||"",c,m);Ce(x,r,"popup-blocked");try{x.focus()}catch{}return new cu(x)}function Ww(r,e){const t=document.createElement("a");t.href=r,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zw="__/auth/handler",Hw="emulator/auth/handler",Gw=encodeURIComponent("fac");async function du(r,e,t,s,a,i){Ce(r.config.authDomain,r,"auth-domain-config-required"),Ce(r.config.apiKey,r,"invalid-api-key");const l={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:s,v:Ss,eventId:a};if(e instanceof Jm){e.setDefaultLanguage(r.languageCode),l.providerId=e.providerId||"",qf(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[m,x]of Object.entries({}))l[m]=x}if(e instanceof xa){const m=e.getScopes().filter(x=>x!=="");m.length>0&&(l.scopes=m.join(","))}r.tenantId&&(l.tid=r.tenantId);const c=l;for(const m of Object.keys(c))c[m]===void 0&&delete c[m];const d=await r._getAppCheckToken(),h=d?`#${Gw}=${encodeURIComponent(d)}`:"";return`${Kw(r)}?${oa(c).slice(1)}${h}`}function Kw({config:r}){return r.emulator?zl(r,Hw):`https://${r.authDomain}/${zw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yo="webStorageSupport";class Qw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=sg,this._completeRedirectFn=bw,this._overrideRedirectResult=fw}async _openPopup(e,t,s,a){var i;Lr((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const l=await du(e,t,s,Yo(),a);return qw(e,l,Xl())}async _openRedirect(e,t,s,a){await this._originValidation(e);const i=await du(e,t,s,Yo(),a);return Jv(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:a,promise:i}=this.eventManagers[t];return a?Promise.resolve(a):(Lr(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await Ow(e),s=new ww(e);return t.register("authEvent",a=>(Ce(a==null?void 0:a.authEvent,e,"invalid-auth-event"),{status:s.onEvent(a.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(yo,{type:yo},a=>{var i;const l=(i=a==null?void 0:a[0])===null||i===void 0?void 0:i[yo];l!==void 0&&t(!!l),Vr(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=jw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Km()||Bm()||Kl()}}const Yw=Qw;var uu="@firebase/auth",hu="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Ce(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jw(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Zw(r){_s(new ss("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),a=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:l,authDomain:c}=s.options;Ce(l&&!l.includes(":"),"invalid-api-key",{appName:s.name});const d={apiKey:l,authDomain:c,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Qm(r)},h=new Cv(s,a,i,d);return Ov(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),_s(new ss("auth-internal",e=>{const t=Ql(e.getProvider("auth").getImmediate());return(s=>new Xw(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),hr(uu,hu,Jw(r)),hr(uu,hu,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e1=5*60,t1=lh("authIdTokenMaxAge")||e1;let mu=null;const r1=r=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>t1)return;const a=t==null?void 0:t.token;mu!==a&&(mu=a,await fetch(r,{method:a?"POST":"DELETE",headers:a?{Authorization:`Bearer ${a}`}:{}}))};function s1(r=ll()){const e=Si(r,"auth");if(e.isInitialized())return e.getImmediate();const t=Mv(r,{popupRedirectResolver:Yw,persistence:[ow,Qv,sg]}),s=lh("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const l=r1(i.toString());Hv(t,l,()=>l(t.currentUser)),zv(t,c=>l(c))}}const a=ah("auth");return a&&Vv(t,`http://${a}`),t}function n1(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}Rv({loadJS(r){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",r),s.onload=e,s.onerror=a=>{const i=pr("internal-error");i.customData=a,t(i)},s.type="text/javascript",s.charset="UTF-8",n1().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Zw("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dg="firebasestorage.googleapis.com",a1="storageBucket",i1=2*60*1e3,o1=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wr extends vr{constructor(e,t,s=0){super(bo(e),`Firebase Storage: ${t} (${bo(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,wr.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return bo(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var yr;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(yr||(yr={}));function bo(r){return"storage/"+r}function l1(){const r="An unknown error occurred, please check the error payload for server response.";return new wr(yr.UNKNOWN,r)}function c1(){return new wr(yr.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function d1(){return new wr(yr.CANCELED,"User canceled the upload/download.")}function u1(r){return new wr(yr.INVALID_URL,"Invalid URL '"+r+"'.")}function h1(r){return new wr(yr.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function gu(r){return new wr(yr.INVALID_ARGUMENT,r)}function ug(){return new wr(yr.APP_DELETED,"The Firebase app was deleted.")}function m1(r){return new wr(yr.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let s;try{s=tr.makeFromUrl(e,t)}catch{return new tr(e,"")}if(s.path==="")return s;throw h1(e)}static makeFromUrl(e,t){let s=null;const a="([A-Za-z0-9.\\-_]+)";function i(M){M.path.charAt(M.path.length-1)==="/"&&(M.path_=M.path_.slice(0,-1))}const l="(/(.*))?$",c=new RegExp("^gs://"+a+l,"i"),d={bucket:1,path:3};function h(M){M.path_=decodeURIComponent(M.path)}const m="v[A-Za-z0-9_]+",x=t.replace(/[.]/g,"\\."),b="(/([^?#]*).*)?$",I=new RegExp(`^https?://${x}/${m}/b/${a}/o${b}`,"i"),N={bucket:1,path:3},T=t===dg?"(?:storage.googleapis.com|storage.cloud.google.com)":t,E="([^?#]*)",P=new RegExp(`^https?://${T}/${a}/${E}`,"i"),C=[{regex:c,indices:d,postModify:i},{regex:I,indices:N,postModify:h},{regex:P,indices:{bucket:1,path:2},postModify:h}];for(let M=0;M<C.length;M++){const ee=C[M],Z=ee.regex.exec(e);if(Z){const j=Z[ee.indices.bucket];let y=Z[ee.indices.path];y||(y=""),s=new tr(j,y),ee.postModify(s);break}}if(s==null)throw u1(e);return s}}class g1{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p1(r,e,t){let s=1,a=null,i=null,l=!1,c=0;function d(){return c===2}let h=!1;function m(...E){h||(h=!0,e.apply(null,E))}function x(E){a=setTimeout(()=>{a=null,r(I,d())},E)}function b(){i&&clearTimeout(i)}function I(E,...P){if(h){b();return}if(E){b(),m.call(null,E,...P);return}if(d()||l){b(),m.call(null,E,...P);return}s<64&&(s*=2);let C;c===1?(c=2,C=0):C=(s+Math.random())*1e3,x(C)}let N=!1;function T(E){N||(N=!0,b(),!h&&(a!==null?(E||(c=2),clearTimeout(a),x(0)):E||(c=1)))}return x(0),i=setTimeout(()=>{l=!0,T(!0)},t),T}function f1(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x1(r){return r!==void 0}function pu(r,e,t,s){if(s<e)throw gu(`Invalid value for '${r}'. Expected ${e} or greater.`);if(s>t)throw gu(`Invalid value for '${r}'. Expected ${t} or less.`)}function y1(r){const e=encodeURIComponent;let t="?";for(const s in r)if(r.hasOwnProperty(s)){const a=e(s)+"="+e(r[s]);t=t+a+"&"}return t=t.slice(0,-1),t}var yi;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(yi||(yi={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function b1(r,e){const t=r>=500&&r<600,a=[408,429].indexOf(r)!==-1,i=e.indexOf(r)!==-1;return t||a||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v1{constructor(e,t,s,a,i,l,c,d,h,m,x,b=!0){this.url_=e,this.method_=t,this.headers_=s,this.body_=a,this.successCodes_=i,this.additionalRetryCodes_=l,this.callback_=c,this.errorCallback_=d,this.timeout_=h,this.progressCallback_=m,this.connectionFactory_=x,this.retry=b,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((I,N)=>{this.resolve_=I,this.reject_=N,this.start_()})}start_(){const e=(s,a)=>{if(a){s(!1,new Fa(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const l=c=>{const d=c.loaded,h=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(d,h)};this.progressCallback_!==null&&i.addUploadProgressListener(l),i.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(l),this.pendingConnection_=null;const c=i.getErrorCode()===yi.NO_ERROR,d=i.getStatus();if(!c||b1(d,this.additionalRetryCodes_)&&this.retry){const m=i.getErrorCode()===yi.ABORT;s(!1,new Fa(!1,null,m));return}const h=this.successCodes_.indexOf(d)!==-1;s(!0,new Fa(h,i))})},t=(s,a)=>{const i=this.resolve_,l=this.reject_,c=a.connection;if(a.wasSuccessCode)try{const d=this.callback_(c,c.getResponse());x1(d)?i(d):i()}catch(d){l(d)}else if(c!==null){const d=l1();d.serverResponse=c.getErrorText(),this.errorCallback_?l(this.errorCallback_(c,d)):l(d)}else if(a.canceled){const d=this.appDelete_?ug():d1();l(d)}else{const d=c1();l(d)}};this.canceled_?t(!1,new Fa(!1,null,!0)):this.backoffId_=p1(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&f1(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Fa{constructor(e,t,s){this.wasSuccessCode=e,this.connection=t,this.canceled=!!s}}function w1(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function _1(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function k1(r,e){e&&(r["X-Firebase-GMPID"]=e)}function N1(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function E1(r,e,t,s,a,i,l=!0){const c=y1(r.urlParams),d=r.url+c,h=Object.assign({},r.headers);return k1(h,e),w1(h,t),_1(h,i),N1(h,s),new v1(d,r.method,h,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,a,l)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j1(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function I1(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{constructor(e,t){this._service=e,t instanceof tr?this._location=t:this._location=tr.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new bi(e,t)}get root(){const e=new tr(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return I1(this._location.path)}get storage(){return this._service}get parent(){const e=j1(this._location.path);if(e===null)return null;const t=new tr(this._location.bucket,e);return new bi(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw m1(e)}}function fu(r,e){const t=e==null?void 0:e[a1];return t==null?null:tr.makeFromBucketSpec(t,r)}function T1(r,e,t,s={}){r.host=`${e}:${t}`,r._protocol="http";const{mockUserToken:a}=s;a&&(r._overrideAuthToken=typeof a=="string"?a:ch(a,r.app.options.projectId))}class S1{constructor(e,t,s,a,i){this.app=e,this._authProvider=t,this._appCheckProvider=s,this._url=a,this._firebaseVersion=i,this._bucket=null,this._host=dg,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=i1,this._maxUploadRetryTime=o1,this._requests=new Set,a!=null?this._bucket=tr.makeFromBucketSpec(a,this._host):this._bucket=fu(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=tr.makeFromBucketSpec(this._url,e):this._bucket=fu(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){pu("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){pu("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new bi(this,e)}_makeRequest(e,t,s,a,i=!0){if(this._deleted)return new g1(ug());{const l=E1(e,this._appId,s,a,t,this._firebaseVersion,i);return this._requests.add(l),l.getPromise().then(()=>this._requests.delete(l),()=>this._requests.delete(l)),l}}async makeRequestWithTokens(e,t){const[s,a]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,s,a).getPromise()}}const xu="@firebase/storage",yu="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hg="storage";function A1(r=ll(),e){r=Ot(r);const s=Si(r,hg).getImmediate({identifier:e}),a=ih("storage");return a&&C1(s,...a),s}function C1(r,e,t,s={}){T1(r,e,t,s)}function R1(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),s=r.getProvider("auth-internal"),a=r.getProvider("app-check-internal");return new S1(t,s,a,e,Ss)}function D1(){_s(new ss(hg,R1,"PUBLIC").setMultipleInstances(!0)),hr(xu,yu,""),hr(xu,yu,"esm2017")}D1();const Ir={apiKey:"your-api-key",authDomain:"your-auth-domain",projectId:"your-project-id",storageBucket:"your-storage-bucket",messagingSenderId:"your-messaging-sender-id",appId:"your-app-id"};console.log("Firebase config check:",{hasApiKey:!!Ir.apiKey&&Ir.apiKey!=="your-api-key",authDomain:Ir.authDomain,projectId:Ir.projectId,hasStorageBucket:!!Ir.storageBucket&&Ir.storageBucket!=="your-storage-bucket",hasAppId:!!Ir.appId&&Ir.appId!=="your-app-id"});console.log("Raw env values:",{VITE_FIREBASE_API_KEY:void 0,VITE_FIREBASE_AUTH_DOMAIN:void 0,VITE_FIREBASE_PROJECT_ID:void 0,VITE_FIREBASE_STORAGE_BUCKET:void 0});const Zl=hh(Ir);s1(Zl);const Le=Bb(Zl);A1(Zl);console.log("Firestore db initialized:",!!Le);const P1=30,bu=r=>r.toString().padStart(2,"0"),$1=()=>{const r=new Date;return r.setDate(r.getDate()-P1),{dateOnly:`${r.getFullYear()}-${bu(r.getMonth()+1)}-${bu(r.getDate())}`,iso:r.toISOString()}},Ua=async(r,e,t)=>{const s=wt(Le,r),a=ct(s,Ht(e,"<",t)),i=await ar(a);await Promise.all(i.docs.map(l=>ls(Lt(Le,r,l.id))))},mg=async()=>{try{const{dateOnly:r,iso:e}=$1();await Promise.all([Ua("workSlots","date",r),Ua("dayStatuses","date",r),Ua("earnings","date",r),Ua("referrals","createdAt",e)])}catch(r){console.error("Failed to cleanup old data",r)}},Fr=async(r,e)=>{const t=wt(Le,"workSlots");let s;r&&e||r?s=ct(t,Ht("userId","==",r)):e?s=ct(t,Ht("date","==",e)):s=ct(t);let i=(await ar(s)).docs.map(l=>{const c=l.data(),d=((c==null?void 0:c.slots)||[]).map(h=>h.break&&!h.breaks?{...h,breaks:[h.break],break:void 0}:h);return{id:l.id,userId:(c==null?void 0:c.userId)||"",date:(c==null?void 0:c.date)||"",slots:d,participants:(c==null?void 0:c.participants)||[],...(c==null?void 0:c.comment)&&{comment:c.comment}}});return r&&e&&(i=i.filter(l=>l.date===e)),i.sort((l,c)=>l.date.localeCompare(c.date)),i},M1=async r=>{try{console.log("addWorkSlot: Starting, db initialized:",!!Le);const e=wt(Le,"workSlots");console.log("addWorkSlot: Collection reference created");const t=Object.fromEntries(Object.entries(r).filter(([a,i])=>i!==void 0));console.log("addWorkSlot: Clean slot prepared:",t),console.log("addWorkSlot: Calling addDoc...");const s=await Ps(e,t);return console.log("addWorkSlot: Work slot added successfully:",s.id),s}catch(e){throw console.error("addWorkSlot: Error caught:",e),console.error("addWorkSlot: Error code:",e==null?void 0:e.code),console.error("addWorkSlot: Error message:",e==null?void 0:e.message),console.error("addWorkSlot: Full error:",JSON.stringify(e,null,2)),e}},O1=async(r,e)=>{const t=Lt(Le,"workSlots",r),s=Object.fromEntries(Object.entries(e).filter(([a,i])=>i!==void 0));await Ds(t,s)},ec=async r=>{const e=Lt(Le,"workSlots",r);await ls(e)},Rr=async(r,e)=>{const t=wt(Le,"dayStatuses");let s;r?s=ct(t,Ht("userId","==",r)):s=ct(t);let i=(await ar(s)).docs.map(l=>{const c=l.data();return{id:l.id,userId:(c==null?void 0:c.userId)||"",date:(c==null?void 0:c.date)||"",type:(c==null?void 0:c.type)||"dayoff",...(c==null?void 0:c.comment)&&{comment:c.comment},...(c==null?void 0:c.endDate)&&{endDate:c.endDate}}});return i.sort((l,c)=>l.date.localeCompare(c.date)),i},V1=async r=>{try{const e=wt(Le,"dayStatuses"),t=Object.fromEntries(Object.entries(r).filter(([a,i])=>i!==void 0));console.log("Adding day status:",t);const s=await Ps(e,t);return console.log("Day status added successfully:",s.id),s}catch(e){throw console.error("Error in addDayStatus:",e),e}},L1=async(r,e)=>{const t=Lt(Le,"dayStatuses",r),s=Object.fromEntries(Object.entries(e).filter(([a,i])=>i!==void 0));await Ds(t,s)},gg=async r=>{const e=Lt(Le,"dayStatuses",r);await ls(e)},Jn=async(r,e,t)=>{const s=wt(Le,"earnings");let a;r?a=ct(s):e&&t?a=ct(s,Ht("date",">=",e),Ht("date","<=",t)):a=ct(s);let l=(await ar(a)).docs.map(c=>{const d=c.data();return{id:c.id,userId:(d==null?void 0:d.userId)||"",date:(d==null?void 0:d.date)||"",amount:(d==null?void 0:d.amount)||0,poolAmount:(d==null?void 0:d.poolAmount)||0,slotId:(d==null?void 0:d.slotId)||"",extraWalletsCount:(d==null?void 0:d.extraWalletsCount)||0,extraWalletsAmount:(d==null?void 0:d.extraWalletsAmount)||0,category:(d==null?void 0:d.category)||"other",participants:(d==null?void 0:d.participants)||[]}});return r&&(l=l.filter(c=>(c.participants&&c.participants.length>0?[...c.participants,c.userId]:[c.userId]).includes(r))),r&&e&&t?l=l.filter(c=>c.date>=e&&c.date<=t):!r&&e&&t&&(l=l.filter(c=>c.date>=e&&c.date<=t)),l.sort((c,d)=>d.date.localeCompare(c.date)),l},F1=async r=>{try{const e=wt(Le,"earnings"),t=Object.fromEntries(Object.entries(r).filter(([a,i])=>i!==void 0));console.log("Adding earnings:",t);const s=await Ps(e,t);return console.log("Earnings added successfully:",s.id),s}catch(e){throw console.error("Error in addEarnings:",e),e}},U1=async(r,e)=>{const t=Lt(Le,"earnings",r),s=Object.fromEntries(Object.entries(e).filter(([a,i])=>i!==void 0));await Ds(t,s)},B1=async r=>{const e=Lt(Le,"earnings",r);await ls(e)},pg=async r=>{const e=wt(Le,"ratings");let t=ct(e);return r&&(t=ct(t,Ht("userId","==",r))),(await ar(t)).docs.map(a=>{const i=a.data();return{id:a.id,userId:i.userId||"",earnings:i.earnings||0,messages:i.messages||0,initiatives:i.initiatives||0,signals:i.signals||0,profitableSignals:i.profitableSignals||0,referrals:i.referrals||0,daysOff:i.daysOff||0,sickDays:i.sickDays||0,vacationDays:i.vacationDays||0,poolAmount:i.poolAmount||0,rating:i.rating||0,lastUpdated:i.lastUpdated||new Date().toISOString()}})},fg=async(r,e,t)=>{try{const s=wt(Le,"messages"),a=ct(s,Ht("userId","==",r));return(await ar(a)).docs.filter(c=>{const h=c.data().date||"";return h>=e&&h<=t}).length}catch(s){console.error("Error getting weekly messages:",s);const a=wt(Le,"ratings"),i=ct(a,Ht("userId","==",r)),l=await ar(i);return l.empty?0:l.docs[0].data().messages||0}},q1=async r=>{try{const e=wt(Le,"referrals"),t=Object.fromEntries(Object.entries(r).filter(([a,i])=>i!==void 0));console.log("Adding referral:",t);const s=await Ps(e,t);return console.log("Referral added successfully:",s.id),s}catch(e){throw console.error("Error in addReferral:",e),e}},xg=async(r,e,t)=>{const s=wt(Le,"referrals");let a;a=ct(s,Yn("createdAt","desc"));let l=(await ar(a)).docs.map(c=>{const d=c.data();return{id:c.id,referralId:d.referralId,ownerId:d.ownerId,name:d.name,age:d.age,createdAt:d.createdAt,comment:d.comment}});return e&&t&&(l=l.filter(c=>c.createdAt>=e&&c.createdAt<=t)),l.sort((c,d)=>c.createdAt<d.createdAt?1:-1)},W1=async(r,e)=>{const t=Lt(Le,"referrals",r),s=Object.fromEntries(Object.entries(e).filter(([a,i])=>i!==void 0));await Ds(t,s)},z1=async r=>{const e=Lt(Le,"referrals",r);await ls(e)},H1=async r=>{if(console.log("📝 Service site: Creating call:",{category:r.category,userId:r.userId,status:r.status,createdAt:r.createdAt}),!Le)throw console.error("❌ Service site: Firestore db is not initialized"),new Error("Firestore database is not initialized");const e=wt(Le,"calls"),t=await Ps(e,r);return console.log("✅ Service site: Call created successfully with ID:",t.id),console.log("📊 Service site: Call data saved to Firestore:",r),t.id},G1=async r=>{const e=wt(Le,"calls"),t=[];t.push(Yn("createdAt","desc"));let s;return t.length>0?s=ct(e,...t):s=ct(e,Yn("createdAt","desc")),(await ar(s)).docs.map(l=>{var I,N,T,E,P,O,C,M;const c=l.data(),d=c.category||"memecoins",h=!c.details&&c.ticker?{memecoins:{coinName:c.pair||c.ticker,ticker:c.ticker||"",network:c.network||"solana",contract:c.contract,signalType:c.sentiment||"buy",reason:c.comment||c.risks||"",entryCap:c.entryPoint||"",targets:c.target||"",stopLoss:c.cancelConditions,riskLevel:c.riskLevel||"medium",risks:c.risks||"",holdPlan:"short",liquidityLocked:!1,traderComment:c.comment}}:{},m=c.details||h||{},x=c.riskLevel||((I=m.memecoins)==null?void 0:I.riskLevel)||((N=m.polymarket)==null?void 0:N.riskLevel)||((T=m.staking)==null?void 0:T.protocolRisk)||((E=m.spot)==null?void 0:E.riskLevel)||((P=m.futures)==null?void 0:P.riskLevel),b=c.sentiment||((O=m.memecoins)==null?void 0:O.signalType)||(((C=m.futures)==null?void 0:C.direction)==="long"?"buy":((M=m.futures)==null?void 0:M.direction)==="short"?"sell":void 0);return{id:l.id,userId:c.userId||"",category:d,details:m,sentiment:b,riskLevel:x,comment:c.comment,createdAt:c.createdAt||new Date().toISOString(),status:c.status||"active",maxProfit:c.maxProfit,currentPnL:c.currentPnL,currentMarketCap:c.currentMarketCap,signalMarketCap:c.signalMarketCap,currentPrice:c.currentPrice,entryPrice:c.entryPrice,tags:c.tags||[]}})},K1=async(r,e)=>{const t=Lt(Le,"calls",r);await Ds(t,e)},Q1=async r=>{const e=Lt(Le,"calls",r);await ls(e)},Y1=async r=>{const e=wt(Le,"tasks");return(await Ps(e,r)).id},yg=async r=>{const e=wt(Le,"tasks"),t=[];r!=null&&r.status&&t.push(Ht("status","==",r.status)),r!=null&&r.category&&t.push(Ht("category","==",r.category)),r!=null&&r.createdBy&&t.push(Ht("createdBy","==",r.createdBy)),t.push(Yn("createdAt","desc"));let s;t.length>0?s=ct(e,...t):s=ct(e,Yn("createdAt","desc"));let i=(await ar(s)).docs.map(h=>{const m=h.data(),b=((Array.isArray(m.assignees)?m.assignees:(m.assignedTo||[]).map(N=>({userId:N,priority:"medium"})))||[]).map(N=>({userId:N.userId||"",priority:N.priority==="high"||N.priority==="low"?N.priority:"medium",comment:N.comment})).filter(N=>!!N.userId),I=b.map(N=>N.userId);return{id:h.id,title:m.title||"",description:m.description,category:m.category||"trading",status:m.status||"pending",createdBy:m.createdBy||"",assignedTo:I,assignees:b,approvals:m.approvals||[],createdAt:m.createdAt||new Date().toISOString(),updatedAt:m.updatedAt||new Date().toISOString(),completedAt:m.completedAt,closedAt:m.closedAt,completedBy:m.completedBy,priority:m.priority,dueDate:m.dueDate||new Date().toISOString().split("T")[0],dueTime:m.dueTime||"12:00",startTime:m.startTime,mainExecutor:m.mainExecutor,deputies:m.deputies||[],executors:m.executors||[],curators:m.curators||[],leads:m.leads||[],stages:m.stages||[],currentStageId:m.currentStageId,comments:m.comments||[]}});const l=new Date,c=new Date(l.getTime()-12*60*60*1e3),d=i.filter(h=>h.status==="closed"&&h.closedAt?new Date(h.closedAt)<c:!1);if(d.length>0&&(await Promise.all(d.map(h=>bg(h.id))),i=i.filter(h=>!d.find(m=>m.id===h.id))),r!=null&&r.assignedTo)if(Array.isArray(r.assignedTo)){const h=r.assignedTo;h.length>0&&(i=i.filter(m=>h.some(x=>m.assignedTo.includes(x))))}else i=i.filter(h=>h.assignedTo.includes(r.assignedTo));return i},Tr=async(r,e)=>{const t=Lt(Le,"tasks",r),s=Object.fromEntries(Object.entries({...e,updatedAt:new Date().toISOString()}).filter(([a,i])=>i!==void 0));await Ds(t,s)},bg=async r=>{const e=Lt(Le,"tasks",r);await ls(e)},vu=async(r,e=!1)=>{const t=wt(Le,"notes");let s;!e&&r?s=ct(t,Ht("userId","==",r)):s=ct(t);const i=(await ar(s)).docs.map(l=>{const c=l.data();return{id:l.id,userId:c.userId||"",title:c.title||"",text:c.text||"",priority:c.priority==="low"||c.priority==="high"?c.priority:"medium",createdAt:c.createdAt||new Date().toISOString(),updatedAt:c.updatedAt||new Date().toISOString()}});return i.sort((l,c)=>(c.updatedAt||"").localeCompare(l.updatedAt||"")),r&&!e?i.filter(l=>l.userId===r):i},X1=async r=>{const e=wt(Le,"notes"),t={...r,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return(await Ps(e,t)).id},J1=async(r,e)=>{const t=Lt(Le,"notes",r),s=Object.fromEntries(Object.entries({...e,updatedAt:new Date().toISOString()}).filter(([a,i])=>i!==void 0));await Ds(t,s)},Z1=async r=>{const e=Lt(Le,"notes",r);await ls(e)},wu=[{value:"solana",label:"Solana"},{value:"ethereum",label:"ETH"},{value:"bsc",label:"BSC"},{value:"ton",label:"TON"},{value:"base",label:"Base"},{value:"sui",label:"SUI"},{value:"monad",label:"Monad"},{value:"polygon",label:"Polygon"}],vo={memecoins:{label:"Мемкоины",gradient:"from-emerald-400 to-teal-500",icon:n.jsx(aa,{className:"w-5 h-5"})},futures:{label:"Фьючерсы",gradient:"from-blue-400 to-indigo-500",icon:n.jsx(na,{className:"w-5 h-5"})},nft:{label:"NFT",gradient:"from-purple-400 to-pink-500",icon:n.jsx(sa,{className:"w-5 h-5"})},spot:{label:"Спот",gradient:"from-amber-400 to-orange-500",icon:n.jsx(ta,{className:"w-5 h-5"})},polymarket:{label:"Polymarket",gradient:"from-rose-400 to-red-500",icon:n.jsx(Zu,{className:"w-5 h-5"})},staking:{label:"Стейкинг",gradient:"from-cyan-400 to-blue-500",icon:n.jsx(Kt,{className:"w-5 h-5"})}},e_={memecoins:[{key:"coinName",label:"Название монеты",placeholder:"PEPE"},{key:"ticker",label:"Тикер",placeholder:"PEPE"},{key:"network",label:"Сеть",type:"select",options:wu},{key:"contract",label:"Контракт",placeholder:"0x..."},{key:"signalType",label:"Тип сигнала",type:"select",options:[{value:"buy",label:"Buy"},{value:"sell",label:"Sell"},{value:"hold",label:"Hold"},{value:"alert",label:"Alert"}]},{key:"reason",label:"Причина входа",placeholder:"Хайп, крупные покупки..."},{key:"entryCap",label:"Зона входа в капитализации",placeholder:"10M-15M"},{key:"targets",label:"Цели (TP1/TP2/TP3)",placeholder:"20M / 30M / 50M"},{key:"stopLoss",label:"Стоп-лосс (если применим)",placeholder:"5M или 15%"},{key:"riskLevel",label:"Риск-уровень",type:"select",options:[{value:"low",label:"Низкий"},{value:"medium",label:"Средний"},{value:"high",label:"Высокий"},{value:"ultra",label:"Ультра-высокий"}]},{key:"risks",label:"Риски",placeholder:"Разворот тренда, низкая ликвидность",type:"textarea"},{key:"holdPlan",label:"План удержания",type:"select",options:[{value:"flip",label:"Флип"},{value:"short",label:"Краткосрок"},{value:"medium",label:"Среднесрок"},{value:"long",label:"Дальнесрок"}]},{key:"liquidityLocked",label:"Залочена ли ликвидность",type:"checkbox"},{key:"traderComment",label:"Комментарий трейдера",type:"textarea",placeholder:"Доп. наблюдения, планы"}],futures:[{key:"pair",label:"Пара",placeholder:"BTC/USDT"},{key:"direction",label:"Направление",type:"select",options:[{value:"long",label:"Long"},{value:"short",label:"Short"}]},{key:"leverage",label:"Рекомендованное плечо",placeholder:"x3 - x10"},{key:"entryPrice",label:"Цена входа",placeholder:"69500"},{key:"entryZone",label:"Зоны входа (min-max)",placeholder:"69000 - 70000"},{key:"targets",label:"Цели (TP1/TP2/TP3)",placeholder:"71000 / 72500 / 74000"},{key:"stopLoss",label:"SL уровень",placeholder:"68000"},{key:"signalStyle",label:"Тип сигнала",type:"select",options:[{value:"breakout",label:"Breakout"},{value:"retest",label:"Retest"},{value:"range",label:"Range"},{value:"scalping",label:"Scalping"},{value:"swing",label:"Swing"}]},{key:"positionSize",label:"Размер позиции (% от депо)",placeholder:"2-5%"},{key:"reason",label:"Причина входа (анализ)",placeholder:"Тренд, объемы, дивергенция...",type:"textarea"},{key:"timeframe",label:"Таймфрейм анализа",type:"select",options:[{value:"1m",label:"1m"},{value:"5m",label:"5m"},{value:"15m",label:"15m"},{value:"1h",label:"1h"},{value:"4h",label:"4h"}]},{key:"risks",label:"Риски",placeholder:"Резкий вброс, низкая волатильность",type:"textarea"},{key:"riskLevel",label:"Риск-уровень",type:"select",options:[{value:"low",label:"Низкий"},{value:"medium",label:"Средний"},{value:"high",label:"Высокий"},{value:"ultra",label:"Ультра-высокий"}]}],nft:[{key:"collectionLink",label:"Коллекция (ссылка)",placeholder:"https://..."},{key:"nftLink",label:"NFT (ссылка)",placeholder:"https://.../item"},{key:"marketplace",label:"Маркетплейс",placeholder:"OpenSea / Magic Eden"},{key:"network",label:"Сеть",type:"select",options:wu},{key:"entryPrice",label:"Рекомендованная цена входа",placeholder:"1.2 ETH"},{key:"rarity",label:"Редкость / атрибуты",placeholder:"Rank < 5% или редкий фон"},{key:"signalType",label:"Тип сигнала",type:"select",options:[{value:"buy",label:"Buy"},{value:"sell",label:"Sell"},{value:"mint",label:"Mint"}]},{key:"reason",label:"Причина входа",placeholder:"Новый минт, хайп, инсайд",type:"textarea"},{key:"holdingHorizon",label:"Срок удержания",type:"select",options:[{value:"flip",label:"Скоростной флип"},{value:"short",label:"Краткосрок"},{value:"medium",label:"Среднесрок"},{value:"long",label:"Долгосрок"}]},{key:"minLiquidity",label:"Минимальная ликвидность (floor + объём)",placeholder:"Floor 2 ETH, объём 120 ETH"},{key:"targetPrice",label:"Цель продажи / Target price",placeholder:"3 ETH"},{key:"traderComment",label:"Комментарий трейдера",type:"textarea",placeholder:"Что смотрим, когда фиксируем"},{key:"risks",label:"Риски",type:"textarea",placeholder:"Падение спроса, фальшивый объём"}],spot:[{key:"coin",label:"Монета",placeholder:"BTC"},{key:"entryCap",label:"Капитализация входа",placeholder:"500M"},{key:"targets",label:"Цели (TP1/TP2/TP3)",placeholder:"550M / 650M / 750M"},{key:"stopLoss",label:"SL",placeholder:"-10%"},{key:"holdingHorizon",label:"Горизонт удержания",type:"select",options:[{value:"short",label:"Краткосрок"},{value:"medium",label:"Среднесрок"},{value:"long",label:"Долгосрок"}]},{key:"reason",label:"Причина входа",placeholder:"Фундаментал, хайп, запуск",type:"textarea"},{key:"positionSize",label:"Размер позиции",placeholder:"5-10% портфеля"},{key:"risks",label:"Риски",placeholder:"Регуляторика, конкуренты",type:"textarea"},{key:"traderComment",label:"Комментарий",type:"textarea",placeholder:"Условия фиксации, обновления"},{key:"riskLevel",label:"Риск-уровень",type:"select",options:[{value:"low",label:"Низкий"},{value:"medium",label:"Средний"},{value:"high",label:"Высокий"},{value:"ultra",label:"Ультра-высокий"}]}],polymarket:[{key:"event",label:"Событие",placeholder:"Trump wins 2025"},{key:"positionType",label:"Тип позиции",type:"select",options:[{value:"yes",label:"Yes"},{value:"no",label:"No"}]},{key:"entryPrice",label:"Цена входа (%)",placeholder:"42%"},{key:"expectedProbability",label:"Ожидаемая вероятность (%)",placeholder:"65%"},{key:"reason",label:"Причина входа",placeholder:"Аналитика, инсайд, тренд новостей",type:"textarea"},{key:"eventDeadline",label:"Срок исхода события",placeholder:"31.12.2025"},{key:"riskLevel",label:"Риск",type:"select",options:[{value:"low",label:"Низкий"},{value:"medium",label:"Средний"},{value:"high",label:"Высокий"},{value:"ultra",label:"Ультра-высокий"}]},{key:"maxStake",label:"Максимальный объём ставки",placeholder:"до $5k"},{key:"risks",label:"Риски",placeholder:"Неопределённость новостей, низкая ликвидность",type:"textarea"},{key:"targetPlan",label:"Цель",placeholder:"Продажа до события или удержание"}],staking:[{key:"coin",label:"Монета",placeholder:"SOL"},{key:"platform",label:"Платформа",placeholder:"Jito, Lido..."},{key:"term",label:"Срок стейкинга",type:"select",options:[{value:"flexible",label:"Гибкий"},{value:"30d",label:"30 дней"},{value:"90d",label:"90 дней"},{value:"fixed",label:"Фиксированный"}]},{key:"apy",label:"APY",placeholder:"12-18%"},{key:"minDeposit",label:"Минимальный депозит",placeholder:"100 USDT"},{key:"protocolRisk",label:"Риски протокола",type:"select",options:[{value:"low",label:"Низкие"},{value:"medium",label:"Средние"},{value:"high",label:"Высокие"},{value:"ultra",label:"Ультра"}]},{key:"action",label:"Тип сигнала",type:"select",options:[{value:"enter",label:"Вход"},{value:"exit",label:"Выход"},{value:"rebalance",label:"Перераспределение"}]},{key:"reason",label:"Причина",placeholder:"Рост доходности, снижение рисков...",type:"textarea"},{key:"risks",label:"Риски",placeholder:"Смарт-контракт, ликвидность",type:"textarea"},{key:"traderComment",label:"Комментарий трейдера",type:"textarea",placeholder:"Тактика выхода, дополнительные условия"}]},_u=()=>({memecoins:{coinName:"",ticker:"",network:"solana",contract:"",signalType:"buy",reason:"",entryCap:"",targets:"",stopLoss:"",riskLevel:"medium",risks:"",holdPlan:"short",liquidityLocked:!1,traderComment:""},futures:{pair:"",direction:"long",leverage:"",entryPrice:"",entryZone:"",targets:"",stopLoss:"",signalStyle:"breakout",positionSize:"",reason:"",timeframe:"1h",risks:"",riskLevel:"medium"},nft:{collectionLink:"",nftLink:"",marketplace:"",network:"ethereum",entryPrice:"",rarity:"",signalType:"buy",reason:"",holdingHorizon:"short",minLiquidity:"",targetPrice:"",traderComment:"",risks:""},spot:{coin:"",entryCap:"",targets:"",stopLoss:"",holdingHorizon:"medium",reason:"",positionSize:"",risks:"",traderComment:"",riskLevel:"medium"},polymarket:{event:"",positionType:"yes",entryPrice:"",expectedProbability:"",reason:"",eventDeadline:"",riskLevel:"medium",maxStake:"",risks:"",targetPlan:""},staking:{coin:"",platform:"",term:"flexible",apy:"",minDeposit:"",protocolRisk:"medium",action:"enter",reason:"",risks:"",traderComment:""}}),ku=(r,e)=>({memecoins:{...r.memecoins,...(e==null?void 0:e.memecoins)||{}},futures:{...r.futures,...(e==null?void 0:e.futures)||{}},nft:{...r.nft,...(e==null?void 0:e.nft)||{}},spot:{...r.spot,...(e==null?void 0:e.spot)||{}},polymarket:{...r.polymarket,...(e==null?void 0:e.polymarket)||{}},staking:{...r.staking,...(e==null?void 0:e.staking)||{}}}),t_=({onSuccess:r,onCancel:e,callToEdit:t,initialCategory:s})=>{const{theme:a}=Ze(),{user:i}=At(),[l,c]=A.useState(!1),[d,h]=A.useState(""),m=ku(_u(),t==null?void 0:t.details),[x,b]=A.useState((t==null?void 0:t.category)||s||"memecoins"),[I,N]=A.useState((t==null?void 0:t.comment)||""),[T,E]=A.useState(m);A.useEffect(()=>{const f=ku(_u(),t==null?void 0:t.details);E(f),b((t==null?void 0:t.category)||s||"memecoins"),N((t==null?void 0:t.comment)||"")},[t,s]);const P=a==="dark"?"text-white":"text-gray-900",O=a==="dark"?"border-gray-800":"border-gray-200",C=a==="dark"?"bg-gray-700/60":"bg-gray-50",M=a==="dark"?"text-gray-400":"text-gray-500",ee=(f,_)=>{E(k=>({...k,[x]:{...k[x],[f]:_}}))},Z=f=>(f==null?void 0:f.riskLevel)||(f==null?void 0:f.protocolRisk)||void 0,j=f=>{if(f!=null&&f.signalType)return f.signalType;if((f==null?void 0:f.direction)==="long")return"buy";if((f==null?void 0:f.direction)==="short")return"sell"},y=async f=>{f.preventDefault(),h(""),c(!0);try{const _=T[x],k={...t==null?void 0:t.details,[x]:_},p={userId:(t==null?void 0:t.userId)||(i==null?void 0:i.id)||"",category:x,details:k,createdAt:(t==null?void 0:t.createdAt)||new Date().toISOString(),status:(t==null?void 0:t.status)||"active",comment:I!=null&&I.trim()?I.trim():void 0,sentiment:j(_),riskLevel:Z(_),tags:(t==null?void 0:t.tags)||[],maxProfit:t==null?void 0:t.maxProfit,currentPnL:t==null?void 0:t.currentPnL,currentMarketCap:t==null?void 0:t.currentMarketCap,signalMarketCap:t==null?void 0:t.signalMarketCap,currentPrice:t==null?void 0:t.currentPrice,entryPrice:t==null?void 0:t.entryPrice};t?await K1(t.id,p):await H1(p),r==null||r()}catch(_){console.error("Error creating call:",_),h("Ошибка при сохранении сигнала. Попробуйте ещё раз.")}finally{c(!1)}},v=f=>{var $;const k=(T[x]||{})[f.key],p=`w-full px-4 py-2 rounded-lg border ${O} ${C} ${P} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`;return f.type==="textarea"?n.jsx("textarea",{value:k||"",onChange:q=>ee(f.key,q.target.value),className:`${p} min-h-[100px] resize-y`,placeholder:f.placeholder}):f.type==="select"&&f.options?n.jsx("select",{value:k||(($=f.options[0])==null?void 0:$.value)||"",onChange:q=>ee(f.key,q.target.value),className:`${p} appearance-none`,children:f.options.map(q=>n.jsx("option",{value:q.value,children:q.label},q.value))}):f.type==="checkbox"?n.jsxs("label",{className:"inline-flex items-center gap-2 cursor-pointer select-none",children:[n.jsx("input",{type:"checkbox",checked:!!k,onChange:q=>ee(f.key,q.target.checked),className:"accent-[#4E6E49] w-4 h-4"}),n.jsx("span",{className:P,children:f.label})]}):n.jsx("input",{type:"text",value:k||"",onChange:q=>ee(f.key,q.target.value),className:p,placeholder:f.placeholder})};return n.jsxs("form",{onSubmit:y,className:"space-y-6",children:[d&&n.jsx("div",{className:`p-4 rounded-lg ${a==="dark"?"bg-red-900/30 border border-red-700 text-red-300":"bg-red-50 border border-red-200 text-red-800"}`,children:d}),n.jsxs("div",{className:"space-y-3",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx(Bt,{className:"w-4 h-4 text-[#4E6E49]"}),n.jsx("p",{className:`text-sm font-semibold ${P}`,children:"Выберите сферу сигнала"}),n.jsx("span",{className:`text-xs ${M}`,children:"каждая сфера имеет свой набор полей"})]}),n.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:Object.keys(vo).map(f=>{const _=vo[f],k=x===f;return n.jsxs("button",{type:"button",onClick:()=>b(f),className:`relative overflow-hidden rounded-xl px-3 py-3 border ${k?"border-transparent shadow-lg shadow-emerald-500/30":O} transition-all ${a==="dark"?"bg-gray-800/70":"bg-white"}`,children:[n.jsx("div",{className:`absolute inset-0 opacity-90 ${k?`bg-gradient-to-r ${_.gradient}`:"bg-gray-900/5 dark:bg-white/5"}`}),n.jsxs("div",{className:"relative flex items-center gap-3 text-left",children:[n.jsx("span",{className:`p-2 rounded-lg ${k?"bg-white/20 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`,children:_.icon}),n.jsxs("div",{children:[n.jsx("p",{className:`font-semibold ${k?"text-white":P}`,children:_.label}),n.jsx("p",{className:`text-xs ${k?"text-white/80":M}`,children:"Кликните для шаблона полей"})]}),k&&n.jsx(wf,{className:"w-4 h-4 text-white ml-auto"})]})]},f)})})]}),n.jsxs("div",{className:`rounded-2xl border ${O} ${a==="dark"?"bg-gray-800/60":"bg-white"} p-4 sm:p-6 space-y-4`,children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("div",{className:"w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg",style:{background:"linear-gradient(135deg, #4E6E49, #3b8d5a)"},children:n.jsx(Bt,{className:"w-5 h-5"})}),n.jsxs("div",{children:[n.jsx("p",{className:`text-lg font-bold ${P}`,children:vo[x].label}),n.jsx("p",{className:`text-xs ${M}`,children:"Добавьте любые детали по этому типу сигнала"})]})]}),n.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:e_[x].map(f=>n.jsxs("div",{className:"space-y-2",children:[f.type!=="checkbox"&&n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("label",{className:`text-sm font-semibold ${P}`,children:f.label}),f.helper&&n.jsx("span",{className:`text-[11px] ${M}`,children:f.helper})]}),v(f)]},f.key))})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-medium ${P} mb-2`,children:"Общий комментарий или доп. заметки"}),n.jsx("textarea",{value:I,onChange:f=>N(f.target.value),className:`w-full px-4 py-3 rounded-lg border ${O} ${C} ${P} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] min-h-[90px] resize-y`,placeholder:"Здесь можно оставить чеклист для апдейтов, условия выхода, алерты."})]}),n.jsxs("div",{className:"flex flex-col sm:flex-row gap-4",children:[n.jsx("button",{type:"submit",disabled:l,className:`flex-1 py-3 rounded-lg font-semibold transition-all shadow-md ${a==="dark"?"bg-gradient-to-r from-[#4E6E49] to-emerald-700 text-white hover:scale-[1.01] disabled:bg-gray-700":"bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-600"}`,children:l?"Сохраняем...":t?"Обновить сигнал":"Создать сигнал"}),e&&n.jsx("button",{type:"button",onClick:e,className:`px-6 py-3 rounded-lg font-semibold border ${O} ${a==="dark"?"text-white hover:bg-gray-800":"text-gray-800 hover:bg-gray-100"}`,children:"Отмена"})]})]})},vi="modal-open";let Vn=0;const r_=()=>{typeof document>"u"||(Vn===0&&(document.body.classList.add(vi),document.documentElement.classList.add(vi)),Vn+=1)},s_=()=>{typeof document>"u"||(Vn=Math.max(Vn-1,0),Vn===0&&(document.body.classList.remove(vi),document.documentElement.classList.remove(vi)))},gn=(r=!0)=>{A.useEffect(()=>{if(r)return r_(),()=>{s_()}},[r])},En={memecoins:{label:"Мемкоины",gradient:"from-emerald-400 to-teal-500",chip:"bg-emerald-500/10 text-emerald-600",icon:n.jsx(aa,{className:"w-4 h-4"})},futures:{label:"Фьючерсы",gradient:"from-blue-400 to-indigo-500",chip:"bg-blue-500/10 text-blue-600",icon:n.jsx(na,{className:"w-4 h-4"})},nft:{label:"NFT",gradient:"from-purple-400 to-pink-500",chip:"bg-purple-500/10 text-purple-600",icon:n.jsx(sa,{className:"w-4 h-4"})},spot:{label:"Спот",gradient:"from-amber-400 to-orange-500",chip:"bg-amber-500/10 text-amber-600",icon:n.jsx(ta,{className:"w-4 h-4"})},polymarket:{label:"Polymarket",gradient:"from-rose-400 to-red-500",chip:"bg-rose-500/10 text-rose-600",icon:n.jsx(Zu,{className:"w-4 h-4"})},staking:{label:"Стейкинг",gradient:"from-cyan-400 to-blue-500",chip:"bg-cyan-500/10 text-cyan-600",icon:n.jsx(Kt,{className:"w-4 h-4"})}},Ba={all:{label:"Все",className:""},active:{label:"Активен",className:"bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"},completed:{label:"Завершен",className:"bg-blue-500/15 text-blue-500 border border-blue-500/20"},cancelled:{label:"Отменен",className:"bg-red-500/15 text-red-500 border border-red-500/20"},reviewed:{label:"На рассмотрении",className:"bg-gray-500/15 text-gray-500 border border-gray-500/20"}},n_={low:"bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",medium:"bg-blue-500/10 text-blue-600 border border-blue-500/20",high:"bg-amber-500/10 text-amber-600 border border-amber-500/20",ultra:"bg-red-500/10 text-red-600 border border-red-500/20"},a_=()=>{const{theme:r}=Ze(),[e,t]=A.useState([]),[s,a]=A.useState(!0),[i,l]=A.useState(!1),[c,d]=A.useState(!1),[h,m]=A.useState(null),[x,b]=A.useState(null),[I,N]=A.useState("memecoins"),[T,E]=A.useState(null),[P,O]=A.useState(""),[C,M]=A.useState("all"),[ee,Z]=A.useState("all"),[j,y]=A.useState("all"),[v,f]=A.useState("all");gn(i||c),A.useEffect(()=>{_()},[]);const _=async()=>{a(!0);try{const U=await G1();t(U)}catch(U){console.error("Error loading calls:",U),t([])}finally{a(!1)}},k=r==="dark"?"bg-[#121212]":"bg-white",p=r==="dark"?"text-white":"text-gray-900",$=r==="dark"?"text-gray-400":"text-gray-600",q=r==="dark"?"border-gray-800":"border-gray-200",se=()=>{l(!1),b(null),_()},B=()=>{l(!1),b(null)},Y=U=>{b(U),N(U.category),l(!0)},ce=U=>{m(U),d(!0)},re=async()=>{if(h)try{await Q1(h),d(!1),m(null),_()}catch(U){console.error("Error deleting call:",U),alert("Ошибка при удалении сигнала")}},he=async U=>{try{await navigator.clipboard.writeText(U),E(U),setTimeout(()=>E(null),1800)}catch(S){console.error("Failed to copy:",S)}},K=U=>{var S;return((S=U.details)==null?void 0:S[U.category])||{}},G=U=>{const S=K(U);switch(U.category){case"memecoins":return S.coinName||S.ticker||"Мемкоин";case"futures":return S.pair||"Фьючерс";case"nft":return S.collectionLink||"NFT коллекция";case"spot":return S.coin||"Спот";case"polymarket":return S.event||"Polymarket событие";case"staking":return S.coin||"Стейкинг";default:return"Сигнал"}},xe=U=>{const S=K(U);switch(U.category){case"memecoins":return`${S.ticker||""} ${S.network?`• ${String(S.network).toUpperCase()}`:""}`.trim();case"futures":return`${S.direction==="long"?"Long":"Short"} • ${S.timeframe||""}`;case"nft":return`${S.marketplace||""}${S.network?` • ${String(S.network).toUpperCase()}`:""}`;case"spot":return S.holdingHorizon?`Горизонт: ${S.holdingHorizon}`:"";case"polymarket":return`${S.positionType==="yes"?"YES":"NO"} • ${S.entryPrice||""}`;case"staking":return`${S.platform||""}${S.term?` • ${S.term}`:""}`;default:return""}},we=U=>U.riskLevel||K(U).riskLevel||K(U).protocolRisk||"medium",H=U=>{const S=K(U);return[U.category,U.status,U.comment,S.coinName,S.ticker,S.pair,S.reason,S.targets,S.event,S.marketplace,S.platform,S.entryCap,S.entryZone,S.network].filter(Boolean).join(" ").toLowerCase()},_e=e.filter(U=>C!=="all"&&U.status!==C||ee!=="all"&&U.category!==ee||j!=="all"&&we(U)!==j||v!=="all"&&U.userId!==v?!1:P.trim()?H(U).includes(P.toLowerCase()):!0),ye=A.useMemo(()=>e.reduce((U,S)=>(U[S.category]||(U[S.category]={total:0,active:0}),U[S.category].total+=1,S.status==="active"&&(U[S.category].active+=1),U),{memecoins:{total:0,active:0},futures:{total:0,active:0},nft:{total:0,active:0},spot:{total:0,active:0},polymarket:{total:0,active:0},staking:{total:0,active:0}}),[e]),Ee=A.useMemo(()=>({total:e.length,active:e.filter(U=>U.status==="active").length,completed:e.filter(U=>U.status==="completed").length,highRisk:e.filter(U=>we(U)==="high"||we(U)==="ultra").length}),[e]),X=r==="dark"?"bg-gray-800 text-gray-200 border border-gray-700":"bg-white text-gray-700 border border-gray-200",R="bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-300/30",L=(U,S,Q)=>n.jsxs("div",{className:`p-4 rounded-xl border ${q} ${r==="dark"?"bg-gray-800/70":"bg-gray-50"}`,children:[n.jsx("p",{className:`text-xs uppercase tracking-wider ${$}`,children:U}),n.jsx("p",{className:`text-2xl font-bold ${Q}`,children:S})]}),ge=U=>{var de;const S=K(U),Q=[];switch(U.category){case"memecoins":Q.push({label:"Тип",value:(de=S.signalType)==null?void 0:de.toUpperCase()},{label:"Сеть",value:S.network?String(S.network).toUpperCase():""},{label:"Вход (кап.)",value:S.entryCap},{label:"Цели",value:S.targets},{label:"SL",value:S.stopLoss},{label:"План",value:S.holdPlan},{label:"Ликвидность",value:S.liquidityLocked?"Залочена":"—"});break;case"futures":Q.push({label:"Направление",value:S.direction?S.direction.toUpperCase():""},{label:"Плечо",value:S.leverage},{label:"Вход",value:S.entryZone||S.entryPrice},{label:"Цели",value:S.targets},{label:"SL",value:S.stopLoss},{label:"Стиль",value:S.signalStyle},{label:"Размер позиции",value:S.positionSize});break;case"nft":Q.push({label:"Маркетплейс",value:S.marketplace},{label:"Сеть",value:S.network?String(S.network).toUpperCase():""},{label:"Вход",value:S.entryPrice},{label:"Рарность",value:S.rarity},{label:"Ликвидность",value:S.minLiquidity},{label:"Target",value:S.targetPrice},{label:"Тип",value:S.signalType});break;case"spot":Q.push({label:"Вход (кап.)",value:S.entryCap},{label:"Цели",value:S.targets},{label:"SL",value:S.stopLoss},{label:"Горизонт",value:S.holdingHorizon},{label:"Размер",value:S.positionSize});break;case"polymarket":Q.push({label:"Позиция",value:S.positionType==="yes"?"YES":"NO"},{label:"Вход %",value:S.entryPrice},{label:"Ожидание %",value:S.expectedProbability},{label:"Срок",value:S.eventDeadline},{label:"Макс ставка",value:S.maxStake},{label:"Цель",value:S.targetPlan});break;case"staking":Q.push({label:"Платформа",value:S.platform},{label:"Срок",value:S.term},{label:"APY",value:S.apy},{label:"Мин. депозит",value:S.minDeposit},{label:"Тип",value:S.action},{label:"Риск протокола",value:S.protocolRisk});break}return n.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-3",children:Q.filter(D=>D.value).map(D=>n.jsxs("div",{className:`p-3 rounded-xl border ${q} ${r==="dark"?"bg-gray-800/60":"bg-gray-50"}`,children:[n.jsx("p",{className:`text-[11px] uppercase tracking-wider ${$}`,children:D.label}),n.jsx("p",{className:`${p} font-semibold truncate`,children:D.value})]},D.label))})},pe=(U,S)=>S?n.jsxs("div",{className:`p-4 rounded-xl border ${q} ${r==="dark"?"bg-gray-800/60":"bg-gray-50"}`,children:[n.jsx("p",{className:`text-xs uppercase tracking-wider ${$} mb-1`,children:U}),n.jsx("p",{className:`${p} leading-relaxed text-sm whitespace-pre-line`,children:S})]}):null;return n.jsx(sr,{children:n.jsxs("div",{className:"space-y-6",children:[n.jsx("div",{className:`rounded-2xl p-6 sm:p-7 ${r==="dark"?"bg-[#0f1218]":"bg-white"} shadow-xl border ${q} relative overflow-hidden`,children:n.jsxs("div",{className:"relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",children:[n.jsx("div",{className:"space-y-2",children:n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx("div",{className:"p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-md",children:n.jsx(ti,{className:"w-6 h-6"})}),n.jsxs("div",{children:[n.jsx("p",{className:"text-xs uppercase tracking-[0.2em] text-[#4E6E49]",children:"Signals Hub"}),n.jsx("h1",{className:`text-2xl sm:text-3xl font-bold ${p}`,children:"Call: мульти-сигналы"}),n.jsx("p",{className:`${$} text-sm`,children:"Мемы, фьючи, спот, NFT, Polymarket и стейкинг в одном окне."})]})]})}),n.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[n.jsxs("button",{onClick:()=>{b(null),N("memecoins"),l(!0)},className:"inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-sky-500 to-teal-500 shadow-md hover:shadow-lg transition-all",children:[n.jsx(Un,{className:"w-5 h-5"}),"Новый сигнал"]}),n.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",children:[n.jsx(Hp,{className:"w-4 h-4"}),n.jsxs("span",{className:"text-sm font-semibold",children:["Активных: ",Ee.active]})]}),n.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",children:[n.jsx(Hu,{className:"w-4 h-4"}),n.jsxs("span",{className:"text-sm font-semibold",children:["High risk: ",Ee.highRisk]})]})]})]})}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4",children:Object.keys(En).map(U=>{const S=En[U],Q=ye[U];return n.jsxs("button",{onClick:()=>{N(U),b(null),l(!0)},className:`relative overflow-hidden rounded-2xl border ${q} ${r==="dark"?"bg-gray-900/70":"bg-white"} p-4 text-left shadow-md hover:shadow-lg transition-all`,children:[n.jsx("div",{className:`absolute inset-0 opacity-55 bg-gradient-to-r ${S.gradient}`}),n.jsxs("div",{className:"relative z-10 flex items-start justify-between",children:[n.jsxs("div",{className:"space-y-1",children:[n.jsxs("div",{className:"flex items-center gap-2 text-white",children:[S.icon,n.jsx("p",{className:"font-semibold",children:S.label})]}),n.jsxs("p",{className:"text-xs text-white/80",children:["Всего ",(Q==null?void 0:Q.total)||0," • Активных ",(Q==null?void 0:Q.active)||0]})]}),n.jsx("div",{className:"bg-white/20 text-white rounded-full px-3 py-1 text-xs font-semibold",children:"Добавить"})]})]},U)})}),n.jsx("div",{className:`rounded-2xl border ${q} ${r==="dark"?"bg-gray-900/70":"bg-white"} p-5 space-y-4`,children:n.jsxs("div",{className:"flex flex-col gap-3",children:[n.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[n.jsxs("div",{className:"flex items-center gap-2 text-sm font-semibold",children:[n.jsx(zu,{className:`w-4 h-4 ${$}`}),n.jsx("span",{className:p,children:"Фильтры"})]}),n.jsx("div",{className:"flex flex-wrap gap-2",children:Object.keys(Ba).map(U=>n.jsx("button",{onClick:()=>M(U),className:`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${C===U?R:X}`,children:Ba[U].label},U))})]}),n.jsxs("div",{className:"flex flex-col gap-2",children:[n.jsxs("label",{className:`text-xs uppercase tracking-wider ${$} flex items-center gap-2`,children:[n.jsx(ff,{className:"w-4 h-4"}),"Поиск по всем сферам ",n.jsxs("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:[_e.length,"/",e.length]})]}),n.jsx("input",{value:P,onChange:U=>O(U.target.value),placeholder:"тикер, событие, сеть, причина...",className:`w-full px-3 py-2 rounded-xl border ${q} ${r==="dark"?"bg-gray-800":"bg-gray-50"} ${p} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/60`})]}),n.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[n.jsx("span",{className:`text-xs ${$} uppercase tracking-wider`,children:"Сфера:"}),n.jsx("button",{onClick:()=>Z("all"),className:`px-3 py-1.5 rounded-full text-sm font-semibold border ${ee==="all"?R:X}`,children:"Все"}),Object.keys(En).map(U=>n.jsx("button",{onClick:()=>Z(ee===U?"all":U),className:`px-3 py-1.5 rounded-full text-sm font-semibold border ${ee===U?R:X}`,children:En[U].label},U))]}),n.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[n.jsx("span",{className:`text-xs ${$} uppercase tracking-wider`,children:"Риск:"}),["all","low","medium","high","ultra"].map(U=>n.jsx("button",{onClick:()=>y(U),className:`px-3 py-1.5 rounded-full text-sm font-semibold border ${j===U?R:X}`,children:U==="all"?"Все":U},U))]}),n.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[n.jsx("span",{className:`text-xs ${$} uppercase tracking-wider`,children:"Трейдер:"}),n.jsxs("select",{value:v,onChange:U=>f(U.target.value),className:`px-3 py-2 rounded-lg border ${q} ${r==="dark"?"bg-gray-800 text-white":"bg-gray-50 text-gray-900"} text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`,children:[n.jsx("option",{value:"all",children:"Все трейдеры"}),Ne.map(U=>n.jsx("option",{value:U.id,children:U.name},U.id))]})]}),n.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:[L("Всего сигналов",Ee.total,p),L("Активных",Ee.active,"text-emerald-500"),L("Завершено",Ee.completed,"text-blue-500"),L("High risk",Ee.highRisk,"text-amber-500")]})]})}),i&&n.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto",children:n.jsx("div",{className:`${k} rounded-2xl shadow-2xl border ${q} max-w-3xl w-full max-h-[90vh] overflow-y-auto`,children:n.jsxs("div",{className:"flex flex-col h-full",children:[n.jsxs("div",{className:"p-6 flex items-center justify-between border-b border-gray-800/50 sticky top-0 z-10",style:{background:"inherit"},children:[n.jsx("h2",{className:`text-2xl font-bold ${p}`,children:x?"Редактировать сигнал":"Создать сигнал"}),n.jsx("button",{onClick:B,className:`p-2 rounded-xl ${r==="dark"?"hover:bg-gray-800":"hover:bg-gray-100"}`,children:n.jsx(Xt,{className:`w-5 h-5 ${$}`})})]}),n.jsx("div",{className:"px-6 pb-6 pt-2 overflow-y-auto",children:n.jsx(t_,{callToEdit:x,onSuccess:se,onCancel:B,initialCategory:I})})]})})}),c&&n.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto overscroll-contain",children:n.jsx("div",{className:`${k} rounded-2xl shadow-2xl border ${q} max-w-md w-full`,children:n.jsxs("div",{className:"p-6 space-y-4",children:[n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx(Gp,{className:"w-6 h-6 text-red-500"}),n.jsxs("div",{children:[n.jsx("h3",{className:`text-xl font-bold ${p}`,children:"Удалить сигнал?"}),n.jsx("p",{className:$,children:"Это действие нельзя отменить"})]})]}),n.jsxs("div",{className:"flex gap-3",children:[n.jsx("button",{onClick:()=>{d(!1),m(null)},className:`flex-1 px-4 py-3 rounded-xl border ${q} ${r==="dark"?"text-white":"text-gray-800"}`,children:"Отмена"}),n.jsx("button",{onClick:re,className:"flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700",children:"Удалить"})]})]})})}),!i&&n.jsx(n.Fragment,{children:s?n.jsxs("div",{className:`${k} rounded-2xl p-12 text-center ${q} border shadow-xl`,children:[n.jsx("div",{className:"animate-spin rounded-full h-14 w-14 border-4 border-[#4E6E49] border-t-transparent mx-auto mb-4"}),n.jsx("p",{className:`${$} text-lg`,children:"Загрузка сигналов..."})]}):e.length===0?n.jsxs("div",{className:`${k} rounded-2xl p-12 text-center ${q} border shadow-xl`,children:[n.jsx(Bt,{className:`w-16 h-16 mx-auto mb-4 ${$}`}),n.jsx("p",{className:`text-xl font-bold ${p}`,children:"Пока пусто"}),n.jsx("p",{className:$,children:"Создайте первый сигнал в новой структуре"})]}):_e.length===0?n.jsxs("div",{className:`${k} rounded-2xl p-12 text-center ${q} border shadow-xl`,children:[n.jsx(Bt,{className:`w-16 h-16 mx-auto mb-4 ${$}`}),n.jsx("p",{className:`text-xl font-bold ${p}`,children:"Нет совпадений"}),n.jsxs("p",{className:$,children:["Сигналы есть (",e.length,"), но фильтр ничего не нашел."]})]}):n.jsx("div",{className:"grid grid-cols-1 gap-5",children:_e.map(U=>{const S=En[U.category],Q=Ba[U.status]||Ba.active,de=we(U),D=K(U),ue=Ne.find(Oe=>Oe.id===U.userId),je=D.ticker||D.pair||D.coin||G(U),Ue=new Date(U.createdAt).toLocaleDateString("ru-RU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});return n.jsxs("div",{className:`${k} rounded-2xl border ${q} shadow-lg overflow-hidden`,children:[n.jsxs("div",{className:"border-b border-gray-800/30 flex items-center justify-between px-4 py-3",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsxs("span",{className:`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${S.chip}`,children:[S.icon,S.label]}),n.jsx("span",{className:`px-3 py-1 rounded-lg text-xs font-semibold ${Q.className}`,children:Q.label}),n.jsxs("span",{className:`px-3 py-1 rounded-lg text-xs font-semibold ${n_[de]}`,children:["Риск: ",de]})]}),n.jsxs("div",{className:"flex items-center gap-2",children:[ue&&n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("div",{className:"w-8 h-8 rounded-full bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white flex items-center justify-center text-sm font-bold",children:ue.name[0]}),n.jsx("span",{className:`text-xs ${$}`,children:ue.name})]}),n.jsx("span",{className:`text-xs ${$}`,children:Ue}),n.jsx("button",{onClick:()=>Y(U),className:`p-2 rounded-lg ${r==="dark"?"hover:bg-gray-800":"hover:bg-gray-100"}`,children:n.jsx(zt,{className:"w-4 h-4"})}),n.jsx("button",{onClick:()=>ce(U.id),className:`p-2 rounded-lg ${r==="dark"?"hover:bg-gray-800":"hover:bg-gray-100"}`,children:n.jsx(It,{className:"w-4 h-4 text-red-500"})})]})]}),n.jsxs("div",{className:"p-5 space-y-4",children:[n.jsxs("div",{className:"flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[n.jsxs("div",{children:[n.jsx("p",{className:`text-2xl font-bold ${p}`,children:G(U)}),n.jsx("p",{className:`text-sm ${$}`,children:xe(U)})]}),n.jsx("div",{className:"flex items-center gap-2",children:n.jsxs("button",{onClick:()=>he(je),className:`px-3 py-2 rounded-xl border ${q} ${r==="dark"?"hover:bg-gray-800":"hover:bg-gray-100"} text-sm font-semibold flex items-center gap-2`,children:[T===je?n.jsx(vs,{className:"w-4 h-4 text-emerald-500"}):n.jsx(To,{className:"w-4 h-4"}),T===je?"Скопировано":"Скопировать"]})})]}),ge(U),n.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3",children:[pe("Причина входа",D.reason),pe("Комментарий трейдера",D.traderComment||U.comment),pe("Риски",D.risks),U.currentPnL!==void 0&&n.jsxs("div",{className:`p-4 rounded-xl border ${q} ${r==="dark"?"bg-gray-800/60":"bg-gray-50"}`,children:[n.jsx("p",{className:`text-xs uppercase tracking-wider ${$} mb-1`,children:"Текущий PNL"}),n.jsxs("p",{className:`text-xl font-bold ${U.currentPnL>=0?"text-emerald-500":"text-red-500"}`,children:[U.currentPnL>=0?"+":"",U.currentPnL.toFixed(2),"%"]})]}),U.maxProfit!==void 0&&n.jsxs("div",{className:`p-4 rounded-xl border ${q} ${r==="dark"?"bg-gray-800/60":"bg-gray-50"}`,children:[n.jsx("p",{className:`text-xs uppercase tracking-wider ${$} mb-1`,children:"MAX прибыль"}),n.jsxs("p",{className:"text-xl font-bold text-emerald-500",children:["+",U.maxProfit.toFixed(2),"%"]})]})]})]})]},U.id)})})})]})})};function wi(r){"@babel/helpers - typeof";return wi=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},wi(r)}function br(r){if(r===null||r===!0||r===!1)return NaN;var e=Number(r);return isNaN(e)?e:e<0?Math.ceil(e):Math.floor(e)}function nt(r,e){if(e.length<r)throw new TypeError(r+" argument"+(r>1?"s":"")+" required, but only "+e.length+" present")}function vt(r){nt(1,arguments);var e=Object.prototype.toString.call(r);return r instanceof Date||wi(r)==="object"&&e==="[object Date]"?new Date(r.getTime()):typeof r=="number"||e==="[object Number]"?new Date(r):((typeof r=="string"||e==="[object String]")&&typeof console<"u"&&(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"),console.warn(new Error().stack)),new Date(NaN))}function i_(r,e){nt(2,arguments);var t=vt(r).getTime(),s=br(e);return new Date(t+s)}var o_={};function pn(){return o_}function l_(r,e){var t,s,a,i,l,c,d,h;nt(1,arguments);var m=pn(),x=br((t=(s=(a=(i=e==null?void 0:e.weekStartsOn)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.weekStartsOn)!==null&&a!==void 0?a:m.weekStartsOn)!==null&&s!==void 0?s:(d=m.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.weekStartsOn)!==null&&t!==void 0?t:0);if(!(x>=0&&x<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var b=vt(r),I=b.getDay(),N=(I<x?7:0)+I-x;return b.setDate(b.getDate()-N),b.setHours(0,0,0,0),b}function c_(r){var e=new Date(Date.UTC(r.getFullYear(),r.getMonth(),r.getDate(),r.getHours(),r.getMinutes(),r.getSeconds(),r.getMilliseconds()));return e.setUTCFullYear(r.getFullYear()),r.getTime()-e.getTime()}function Nu(r){nt(1,arguments);var e=vt(r);return e.setHours(0,0,0,0),e}var vg=6e4,wg=36e5;function d_(r,e){nt(2,arguments);var t=Nu(r),s=Nu(e);return t.getTime()===s.getTime()}function u_(r){return nt(1,arguments),r instanceof Date||wi(r)==="object"&&Object.prototype.toString.call(r)==="[object Date]"}function h_(r){if(nt(1,arguments),!u_(r)&&typeof r!="number")return!1;var e=vt(r);return!isNaN(Number(e))}function m_(r,e){var t;nt(1,arguments);var s=r||{},a=vt(s.start),i=vt(s.end),l=i.getTime();if(!(a.getTime()<=l))throw new RangeError("Invalid interval");var c=[],d=a;d.setHours(0,0,0,0);var h=Number((t=void 0)!==null&&t!==void 0?t:1);if(h<1||isNaN(h))throw new RangeError("`options.step` must be a number greater than 1");for(;d.getTime()<=l;)c.push(vt(d)),d.setDate(d.getDate()+h),d.setHours(0,0,0,0);return c}function g_(r,e){var t,s,a,i,l,c,d,h;nt(1,arguments);var m=pn(),x=br((t=(s=(a=(i=e==null?void 0:e.weekStartsOn)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.weekStartsOn)!==null&&a!==void 0?a:m.weekStartsOn)!==null&&s!==void 0?s:(d=m.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.weekStartsOn)!==null&&t!==void 0?t:0);if(!(x>=0&&x<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var b=vt(r),I=b.getDay(),N=(I<x?-7:0)+6-(I-x);return b.setDate(b.getDate()+N),b.setHours(23,59,59,999),b}function p_(r,e){nt(2,arguments);var t=br(e);return i_(r,-t)}var f_=864e5;function x_(r){nt(1,arguments);var e=vt(r),t=e.getTime();e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0);var s=e.getTime(),a=t-s;return Math.floor(a/f_)+1}function _i(r){nt(1,arguments);var e=1,t=vt(r),s=t.getUTCDay(),a=(s<e?7:0)+s-e;return t.setUTCDate(t.getUTCDate()-a),t.setUTCHours(0,0,0,0),t}function _g(r){nt(1,arguments);var e=vt(r),t=e.getUTCFullYear(),s=new Date(0);s.setUTCFullYear(t+1,0,4),s.setUTCHours(0,0,0,0);var a=_i(s),i=new Date(0);i.setUTCFullYear(t,0,4),i.setUTCHours(0,0,0,0);var l=_i(i);return e.getTime()>=a.getTime()?t+1:e.getTime()>=l.getTime()?t:t-1}function y_(r){nt(1,arguments);var e=_g(r),t=new Date(0);t.setUTCFullYear(e,0,4),t.setUTCHours(0,0,0,0);var s=_i(t);return s}var b_=6048e5;function v_(r){nt(1,arguments);var e=vt(r),t=_i(e).getTime()-y_(e).getTime();return Math.round(t/b_)+1}function on(r,e){var t,s,a,i,l,c,d,h;nt(1,arguments);var m=pn(),x=br((t=(s=(a=(i=e==null?void 0:e.weekStartsOn)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.weekStartsOn)!==null&&a!==void 0?a:m.weekStartsOn)!==null&&s!==void 0?s:(d=m.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.weekStartsOn)!==null&&t!==void 0?t:0);if(!(x>=0&&x<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var b=vt(r),I=b.getUTCDay(),N=(I<x?7:0)+I-x;return b.setUTCDate(b.getUTCDate()-N),b.setUTCHours(0,0,0,0),b}function kg(r,e){var t,s,a,i,l,c,d,h;nt(1,arguments);var m=vt(r),x=m.getUTCFullYear(),b=pn(),I=br((t=(s=(a=(i=e==null?void 0:e.firstWeekContainsDate)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.firstWeekContainsDate)!==null&&a!==void 0?a:b.firstWeekContainsDate)!==null&&s!==void 0?s:(d=b.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.firstWeekContainsDate)!==null&&t!==void 0?t:1);if(!(I>=1&&I<=7))throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");var N=new Date(0);N.setUTCFullYear(x+1,0,I),N.setUTCHours(0,0,0,0);var T=on(N,e),E=new Date(0);E.setUTCFullYear(x,0,I),E.setUTCHours(0,0,0,0);var P=on(E,e);return m.getTime()>=T.getTime()?x+1:m.getTime()>=P.getTime()?x:x-1}function w_(r,e){var t,s,a,i,l,c,d,h;nt(1,arguments);var m=pn(),x=br((t=(s=(a=(i=e==null?void 0:e.firstWeekContainsDate)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.firstWeekContainsDate)!==null&&a!==void 0?a:m.firstWeekContainsDate)!==null&&s!==void 0?s:(d=m.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.firstWeekContainsDate)!==null&&t!==void 0?t:1),b=kg(r,e),I=new Date(0);I.setUTCFullYear(b,0,x),I.setUTCHours(0,0,0,0);var N=on(I,e);return N}var __=6048e5;function k_(r,e){nt(1,arguments);var t=vt(r),s=on(t,e).getTime()-w_(t,e).getTime();return Math.round(s/__)+1}function Ke(r,e){for(var t=r<0?"-":"",s=Math.abs(r).toString();s.length<e;)s="0"+s;return t+s}var zr={y:function(e,t){var s=e.getUTCFullYear(),a=s>0?s:1-s;return Ke(t==="yy"?a%100:a,t.length)},M:function(e,t){var s=e.getUTCMonth();return t==="M"?String(s+1):Ke(s+1,2)},d:function(e,t){return Ke(e.getUTCDate(),t.length)},a:function(e,t){var s=e.getUTCHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return s.toUpperCase();case"aaa":return s;case"aaaaa":return s[0];case"aaaa":default:return s==="am"?"a.m.":"p.m."}},h:function(e,t){return Ke(e.getUTCHours()%12||12,t.length)},H:function(e,t){return Ke(e.getUTCHours(),t.length)},m:function(e,t){return Ke(e.getUTCMinutes(),t.length)},s:function(e,t){return Ke(e.getUTCSeconds(),t.length)},S:function(e,t){var s=t.length,a=e.getUTCMilliseconds(),i=Math.floor(a*Math.pow(10,s-3));return Ke(i,t.length)}},Ls={midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},N_={G:function(e,t,s){var a=e.getUTCFullYear()>0?1:0;switch(t){case"G":case"GG":case"GGG":return s.era(a,{width:"abbreviated"});case"GGGGG":return s.era(a,{width:"narrow"});case"GGGG":default:return s.era(a,{width:"wide"})}},y:function(e,t,s){if(t==="yo"){var a=e.getUTCFullYear(),i=a>0?a:1-a;return s.ordinalNumber(i,{unit:"year"})}return zr.y(e,t)},Y:function(e,t,s,a){var i=kg(e,a),l=i>0?i:1-i;if(t==="YY"){var c=l%100;return Ke(c,2)}return t==="Yo"?s.ordinalNumber(l,{unit:"year"}):Ke(l,t.length)},R:function(e,t){var s=_g(e);return Ke(s,t.length)},u:function(e,t){var s=e.getUTCFullYear();return Ke(s,t.length)},Q:function(e,t,s){var a=Math.ceil((e.getUTCMonth()+1)/3);switch(t){case"Q":return String(a);case"QQ":return Ke(a,2);case"Qo":return s.ordinalNumber(a,{unit:"quarter"});case"QQQ":return s.quarter(a,{width:"abbreviated",context:"formatting"});case"QQQQQ":return s.quarter(a,{width:"narrow",context:"formatting"});case"QQQQ":default:return s.quarter(a,{width:"wide",context:"formatting"})}},q:function(e,t,s){var a=Math.ceil((e.getUTCMonth()+1)/3);switch(t){case"q":return String(a);case"qq":return Ke(a,2);case"qo":return s.ordinalNumber(a,{unit:"quarter"});case"qqq":return s.quarter(a,{width:"abbreviated",context:"standalone"});case"qqqqq":return s.quarter(a,{width:"narrow",context:"standalone"});case"qqqq":default:return s.quarter(a,{width:"wide",context:"standalone"})}},M:function(e,t,s){var a=e.getUTCMonth();switch(t){case"M":case"MM":return zr.M(e,t);case"Mo":return s.ordinalNumber(a+1,{unit:"month"});case"MMM":return s.month(a,{width:"abbreviated",context:"formatting"});case"MMMMM":return s.month(a,{width:"narrow",context:"formatting"});case"MMMM":default:return s.month(a,{width:"wide",context:"formatting"})}},L:function(e,t,s){var a=e.getUTCMonth();switch(t){case"L":return String(a+1);case"LL":return Ke(a+1,2);case"Lo":return s.ordinalNumber(a+1,{unit:"month"});case"LLL":return s.month(a,{width:"abbreviated",context:"standalone"});case"LLLLL":return s.month(a,{width:"narrow",context:"standalone"});case"LLLL":default:return s.month(a,{width:"wide",context:"standalone"})}},w:function(e,t,s,a){var i=k_(e,a);return t==="wo"?s.ordinalNumber(i,{unit:"week"}):Ke(i,t.length)},I:function(e,t,s){var a=v_(e);return t==="Io"?s.ordinalNumber(a,{unit:"week"}):Ke(a,t.length)},d:function(e,t,s){return t==="do"?s.ordinalNumber(e.getUTCDate(),{unit:"date"}):zr.d(e,t)},D:function(e,t,s){var a=x_(e);return t==="Do"?s.ordinalNumber(a,{unit:"dayOfYear"}):Ke(a,t.length)},E:function(e,t,s){var a=e.getUTCDay();switch(t){case"E":case"EE":case"EEE":return s.day(a,{width:"abbreviated",context:"formatting"});case"EEEEE":return s.day(a,{width:"narrow",context:"formatting"});case"EEEEEE":return s.day(a,{width:"short",context:"formatting"});case"EEEE":default:return s.day(a,{width:"wide",context:"formatting"})}},e:function(e,t,s,a){var i=e.getUTCDay(),l=(i-a.weekStartsOn+8)%7||7;switch(t){case"e":return String(l);case"ee":return Ke(l,2);case"eo":return s.ordinalNumber(l,{unit:"day"});case"eee":return s.day(i,{width:"abbreviated",context:"formatting"});case"eeeee":return s.day(i,{width:"narrow",context:"formatting"});case"eeeeee":return s.day(i,{width:"short",context:"formatting"});case"eeee":default:return s.day(i,{width:"wide",context:"formatting"})}},c:function(e,t,s,a){var i=e.getUTCDay(),l=(i-a.weekStartsOn+8)%7||7;switch(t){case"c":return String(l);case"cc":return Ke(l,t.length);case"co":return s.ordinalNumber(l,{unit:"day"});case"ccc":return s.day(i,{width:"abbreviated",context:"standalone"});case"ccccc":return s.day(i,{width:"narrow",context:"standalone"});case"cccccc":return s.day(i,{width:"short",context:"standalone"});case"cccc":default:return s.day(i,{width:"wide",context:"standalone"})}},i:function(e,t,s){var a=e.getUTCDay(),i=a===0?7:a;switch(t){case"i":return String(i);case"ii":return Ke(i,t.length);case"io":return s.ordinalNumber(i,{unit:"day"});case"iii":return s.day(a,{width:"abbreviated",context:"formatting"});case"iiiii":return s.day(a,{width:"narrow",context:"formatting"});case"iiiiii":return s.day(a,{width:"short",context:"formatting"});case"iiii":default:return s.day(a,{width:"wide",context:"formatting"})}},a:function(e,t,s){var a=e.getUTCHours(),i=a/12>=1?"pm":"am";switch(t){case"a":case"aa":return s.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"aaa":return s.dayPeriod(i,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return s.dayPeriod(i,{width:"narrow",context:"formatting"});case"aaaa":default:return s.dayPeriod(i,{width:"wide",context:"formatting"})}},b:function(e,t,s){var a=e.getUTCHours(),i;switch(a===12?i=Ls.noon:a===0?i=Ls.midnight:i=a/12>=1?"pm":"am",t){case"b":case"bb":return s.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"bbb":return s.dayPeriod(i,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return s.dayPeriod(i,{width:"narrow",context:"formatting"});case"bbbb":default:return s.dayPeriod(i,{width:"wide",context:"formatting"})}},B:function(e,t,s){var a=e.getUTCHours(),i;switch(a>=17?i=Ls.evening:a>=12?i=Ls.afternoon:a>=4?i=Ls.morning:i=Ls.night,t){case"B":case"BB":case"BBB":return s.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"BBBBB":return s.dayPeriod(i,{width:"narrow",context:"formatting"});case"BBBB":default:return s.dayPeriod(i,{width:"wide",context:"formatting"})}},h:function(e,t,s){if(t==="ho"){var a=e.getUTCHours()%12;return a===0&&(a=12),s.ordinalNumber(a,{unit:"hour"})}return zr.h(e,t)},H:function(e,t,s){return t==="Ho"?s.ordinalNumber(e.getUTCHours(),{unit:"hour"}):zr.H(e,t)},K:function(e,t,s){var a=e.getUTCHours()%12;return t==="Ko"?s.ordinalNumber(a,{unit:"hour"}):Ke(a,t.length)},k:function(e,t,s){var a=e.getUTCHours();return a===0&&(a=24),t==="ko"?s.ordinalNumber(a,{unit:"hour"}):Ke(a,t.length)},m:function(e,t,s){return t==="mo"?s.ordinalNumber(e.getUTCMinutes(),{unit:"minute"}):zr.m(e,t)},s:function(e,t,s){return t==="so"?s.ordinalNumber(e.getUTCSeconds(),{unit:"second"}):zr.s(e,t)},S:function(e,t){return zr.S(e,t)},X:function(e,t,s,a){var i=a._originalDate||e,l=i.getTimezoneOffset();if(l===0)return"Z";switch(t){case"X":return ju(l);case"XXXX":case"XX":return ps(l);case"XXXXX":case"XXX":default:return ps(l,":")}},x:function(e,t,s,a){var i=a._originalDate||e,l=i.getTimezoneOffset();switch(t){case"x":return ju(l);case"xxxx":case"xx":return ps(l);case"xxxxx":case"xxx":default:return ps(l,":")}},O:function(e,t,s,a){var i=a._originalDate||e,l=i.getTimezoneOffset();switch(t){case"O":case"OO":case"OOO":return"GMT"+Eu(l,":");case"OOOO":default:return"GMT"+ps(l,":")}},z:function(e,t,s,a){var i=a._originalDate||e,l=i.getTimezoneOffset();switch(t){case"z":case"zz":case"zzz":return"GMT"+Eu(l,":");case"zzzz":default:return"GMT"+ps(l,":")}},t:function(e,t,s,a){var i=a._originalDate||e,l=Math.floor(i.getTime()/1e3);return Ke(l,t.length)},T:function(e,t,s,a){var i=a._originalDate||e,l=i.getTime();return Ke(l,t.length)}};function Eu(r,e){var t=r>0?"-":"+",s=Math.abs(r),a=Math.floor(s/60),i=s%60;if(i===0)return t+String(a);var l=e;return t+String(a)+l+Ke(i,2)}function ju(r,e){if(r%60===0){var t=r>0?"-":"+";return t+Ke(Math.abs(r)/60,2)}return ps(r,e)}function ps(r,e){var t=e||"",s=r>0?"-":"+",a=Math.abs(r),i=Ke(Math.floor(a/60),2),l=Ke(a%60,2);return s+i+t+l}var Iu=function(e,t){switch(e){case"P":return t.date({width:"short"});case"PP":return t.date({width:"medium"});case"PPP":return t.date({width:"long"});case"PPPP":default:return t.date({width:"full"})}},Ng=function(e,t){switch(e){case"p":return t.time({width:"short"});case"pp":return t.time({width:"medium"});case"ppp":return t.time({width:"long"});case"pppp":default:return t.time({width:"full"})}},E_=function(e,t){var s=e.match(/(P+)(p+)?/)||[],a=s[1],i=s[2];if(!i)return Iu(e,t);var l;switch(a){case"P":l=t.dateTime({width:"short"});break;case"PP":l=t.dateTime({width:"medium"});break;case"PPP":l=t.dateTime({width:"long"});break;case"PPPP":default:l=t.dateTime({width:"full"});break}return l.replace("{{date}}",Iu(a,t)).replace("{{time}}",Ng(i,t))},j_={p:Ng,P:E_},I_=["D","DD"],T_=["YY","YYYY"];function S_(r){return I_.indexOf(r)!==-1}function A_(r){return T_.indexOf(r)!==-1}function Tu(r,e,t){if(r==="YYYY")throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(e,"`) for formatting years to the input `").concat(t,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(r==="YY")throw new RangeError("Use `yy` instead of `YY` (in `".concat(e,"`) for formatting years to the input `").concat(t,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(r==="D")throw new RangeError("Use `d` instead of `D` (in `".concat(e,"`) for formatting days of the month to the input `").concat(t,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(r==="DD")throw new RangeError("Use `dd` instead of `DD` (in `".concat(e,"`) for formatting days of the month to the input `").concat(t,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"))}var C_={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},R_=function(e,t,s){var a,i=C_[e];return typeof i=="string"?a=i:t===1?a=i.one:a=i.other.replace("{{count}}",t.toString()),s!=null&&s.addSuffix?s.comparison&&s.comparison>0?"in "+a:a+" ago":a};function Ks(r){return function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.width?String(e.width):r.defaultWidth,s=r.formats[t]||r.formats[r.defaultWidth];return s}}var D_={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},P_={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},$_={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},M_={date:Ks({formats:D_,defaultWidth:"full"}),time:Ks({formats:P_,defaultWidth:"full"}),dateTime:Ks({formats:$_,defaultWidth:"full"})},O_={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},V_=function(e,t,s,a){return O_[e]};function cr(r){return function(e,t){var s=t!=null&&t.context?String(t.context):"standalone",a;if(s==="formatting"&&r.formattingValues){var i=r.defaultFormattingWidth||r.defaultWidth,l=t!=null&&t.width?String(t.width):i;a=r.formattingValues[l]||r.formattingValues[i]}else{var c=r.defaultWidth,d=t!=null&&t.width?String(t.width):r.defaultWidth;a=r.values[d]||r.values[c]}var h=r.argumentCallback?r.argumentCallback(e):e;return a[h]}}var L_={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},F_={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},U_={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},B_={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},q_={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},W_={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},z_=function(e,t){var s=Number(e),a=s%100;if(a>20||a<10)switch(a%10){case 1:return s+"st";case 2:return s+"nd";case 3:return s+"rd"}return s+"th"},H_={ordinalNumber:z_,era:cr({values:L_,defaultWidth:"wide"}),quarter:cr({values:F_,defaultWidth:"wide",argumentCallback:function(e){return e-1}}),month:cr({values:U_,defaultWidth:"wide"}),day:cr({values:B_,defaultWidth:"wide"}),dayPeriod:cr({values:q_,defaultWidth:"wide",formattingValues:W_,defaultFormattingWidth:"wide"})};function dr(r){return function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=t.width,a=s&&r.matchPatterns[s]||r.matchPatterns[r.defaultMatchWidth],i=e.match(a);if(!i)return null;var l=i[0],c=s&&r.parsePatterns[s]||r.parsePatterns[r.defaultParseWidth],d=Array.isArray(c)?K_(c,function(x){return x.test(l)}):G_(c,function(x){return x.test(l)}),h;h=r.valueCallback?r.valueCallback(d):d,h=t.valueCallback?t.valueCallback(h):h;var m=e.slice(l.length);return{value:h,rest:m}}}function G_(r,e){for(var t in r)if(r.hasOwnProperty(t)&&e(r[t]))return t}function K_(r,e){for(var t=0;t<r.length;t++)if(e(r[t]))return t}function Eg(r){return function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=e.match(r.matchPattern);if(!s)return null;var a=s[0],i=e.match(r.parsePattern);if(!i)return null;var l=r.valueCallback?r.valueCallback(i[0]):i[0];l=t.valueCallback?t.valueCallback(l):l;var c=e.slice(a.length);return{value:l,rest:c}}}var Q_=/^(\d+)(th|st|nd|rd)?/i,Y_=/\d+/i,X_={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},J_={any:[/^b/i,/^(a|c)/i]},Z_={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},e2={any:[/1/i,/2/i,/3/i,/4/i]},t2={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},r2={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},s2={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},n2={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},a2={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},i2={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},o2={ordinalNumber:Eg({matchPattern:Q_,parsePattern:Y_,valueCallback:function(e){return parseInt(e,10)}}),era:dr({matchPatterns:X_,defaultMatchWidth:"wide",parsePatterns:J_,defaultParseWidth:"any"}),quarter:dr({matchPatterns:Z_,defaultMatchWidth:"wide",parsePatterns:e2,defaultParseWidth:"any",valueCallback:function(e){return e+1}}),month:dr({matchPatterns:t2,defaultMatchWidth:"wide",parsePatterns:r2,defaultParseWidth:"any"}),day:dr({matchPatterns:s2,defaultMatchWidth:"wide",parsePatterns:n2,defaultParseWidth:"any"}),dayPeriod:dr({matchPatterns:a2,defaultMatchWidth:"any",parsePatterns:i2,defaultParseWidth:"any"})},l2={code:"en-US",formatDistance:R_,formatLong:M_,formatRelative:V_,localize:H_,match:o2,options:{weekStartsOn:0,firstWeekContainsDate:1}},c2=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,d2=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,u2=/^'([^]*?)'?$/,h2=/''/g,m2=/[a-zA-Z]/;function jg(r,e,t){var s,a,i,l,c,d,h,m,x,b,I,N,T,E,P,O,C,M;nt(2,arguments);var ee=String(e),Z=pn(),j=(s=(a=t==null?void 0:t.locale)!==null&&a!==void 0?a:Z.locale)!==null&&s!==void 0?s:l2,y=br((i=(l=(c=(d=t==null?void 0:t.firstWeekContainsDate)!==null&&d!==void 0?d:t==null||(h=t.locale)===null||h===void 0||(m=h.options)===null||m===void 0?void 0:m.firstWeekContainsDate)!==null&&c!==void 0?c:Z.firstWeekContainsDate)!==null&&l!==void 0?l:(x=Z.locale)===null||x===void 0||(b=x.options)===null||b===void 0?void 0:b.firstWeekContainsDate)!==null&&i!==void 0?i:1);if(!(y>=1&&y<=7))throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");var v=br((I=(N=(T=(E=t==null?void 0:t.weekStartsOn)!==null&&E!==void 0?E:t==null||(P=t.locale)===null||P===void 0||(O=P.options)===null||O===void 0?void 0:O.weekStartsOn)!==null&&T!==void 0?T:Z.weekStartsOn)!==null&&N!==void 0?N:(C=Z.locale)===null||C===void 0||(M=C.options)===null||M===void 0?void 0:M.weekStartsOn)!==null&&I!==void 0?I:0);if(!(v>=0&&v<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");if(!j.localize)throw new RangeError("locale must contain localize property");if(!j.formatLong)throw new RangeError("locale must contain formatLong property");var f=vt(r);if(!h_(f))throw new RangeError("Invalid time value");var _=c_(f),k=p_(f,_),p={firstWeekContainsDate:y,weekStartsOn:v,locale:j,_originalDate:f},$=ee.match(d2).map(function(q){var se=q[0];if(se==="p"||se==="P"){var B=j_[se];return B(q,j.formatLong)}return q}).join("").match(c2).map(function(q){if(q==="''")return"'";var se=q[0];if(se==="'")return g2(q);var B=N_[se];if(B)return!(t!=null&&t.useAdditionalWeekYearTokens)&&A_(q)&&Tu(q,e,String(r)),!(t!=null&&t.useAdditionalDayOfYearTokens)&&S_(q)&&Tu(q,e,String(r)),B(k,q,j.localize,p);if(se.match(m2))throw new RangeError("Format string contains an unescaped latin alphabet character `"+se+"`");return q}).join("");return $}function g2(r){var e=r.match(u2);return e?e[1].replace(h2,"'"):r}function p2(r,e){nt(2,arguments);var t=vt(r),s=vt(e);return t.getTime()<s.getTime()}function Ts(r,e){var t;nt(1,arguments);var s=br((t=void 0)!==null&&t!==void 0?t:2);if(s!==2&&s!==1&&s!==0)throw new RangeError("additionalDigits must be 0, 1 or 2");if(!(typeof r=="string"||Object.prototype.toString.call(r)==="[object String]"))return new Date(NaN);var a=b2(r),i;if(a.date){var l=v2(a.date,s);i=w2(l.restDateString,l.year)}if(!i||isNaN(i.getTime()))return new Date(NaN);var c=i.getTime(),d=0,h;if(a.time&&(d=_2(a.time),isNaN(d)))return new Date(NaN);if(a.timezone){if(h=k2(a.timezone),isNaN(h))return new Date(NaN)}else{var m=new Date(c+d),x=new Date(0);return x.setFullYear(m.getUTCFullYear(),m.getUTCMonth(),m.getUTCDate()),x.setHours(m.getUTCHours(),m.getUTCMinutes(),m.getUTCSeconds(),m.getUTCMilliseconds()),x}return new Date(c+d+h)}var qa={dateTimeDelimiter:/[T ]/,timeZoneDelimiter:/[Z ]/i,timezone:/([Z+-].*)$/},f2=/^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,x2=/^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,y2=/^([+-])(\d{2})(?::?(\d{2}))?$/;function b2(r){var e={},t=r.split(qa.dateTimeDelimiter),s;if(t.length>2)return e;if(/:/.test(t[0])?s=t[0]:(e.date=t[0],s=t[1],qa.timeZoneDelimiter.test(e.date)&&(e.date=r.split(qa.timeZoneDelimiter)[0],s=r.substr(e.date.length,r.length))),s){var a=qa.timezone.exec(s);a?(e.time=s.replace(a[1],""),e.timezone=a[1]):e.time=s}return e}function v2(r,e){var t=new RegExp("^(?:(\\d{4}|[+-]\\d{"+(4+e)+"})|(\\d{2}|[+-]\\d{"+(2+e)+"})$)"),s=r.match(t);if(!s)return{year:NaN,restDateString:""};var a=s[1]?parseInt(s[1]):null,i=s[2]?parseInt(s[2]):null;return{year:i===null?a:i*100,restDateString:r.slice((s[1]||s[2]).length)}}function w2(r,e){if(e===null)return new Date(NaN);var t=r.match(f2);if(!t)return new Date(NaN);var s=!!t[4],a=jn(t[1]),i=jn(t[2])-1,l=jn(t[3]),c=jn(t[4]),d=jn(t[5])-1;if(s)return T2(e,c,d)?N2(e,c,d):new Date(NaN);var h=new Date(0);return!j2(e,i,l)||!I2(e,a)?new Date(NaN):(h.setUTCFullYear(e,i,Math.max(a,l)),h)}function jn(r){return r?parseInt(r):1}function _2(r){var e=r.match(x2);if(!e)return NaN;var t=wo(e[1]),s=wo(e[2]),a=wo(e[3]);return S2(t,s,a)?t*wg+s*vg+a*1e3:NaN}function wo(r){return r&&parseFloat(r.replace(",","."))||0}function k2(r){if(r==="Z")return 0;var e=r.match(y2);if(!e)return 0;var t=e[1]==="+"?-1:1,s=parseInt(e[2]),a=e[3]&&parseInt(e[3])||0;return A2(s,a)?t*(s*wg+a*vg):NaN}function N2(r,e,t){var s=new Date(0);s.setUTCFullYear(r,0,4);var a=s.getUTCDay()||7,i=(e-1)*7+t+1-a;return s.setUTCDate(s.getUTCDate()+i),s}var E2=[31,null,31,30,31,30,31,31,30,31,30,31];function Ig(r){return r%400===0||r%4===0&&r%100!==0}function j2(r,e,t){return e>=0&&e<=11&&t>=1&&t<=(E2[e]||(Ig(r)?29:28))}function I2(r,e){return e>=1&&e<=(Ig(r)?366:365)}function T2(r,e,t){return e>=1&&e<=53&&t>=0&&t<=6}function S2(r,e,t){return r===24?e===0&&t===0:t>=0&&t<60&&e>=0&&e<60&&r>=0&&r<25}function A2(r,e){return e>=0&&e<=59}function Su(r,e,t){nt(2,arguments);var s=on(r,t),a=on(e,t);return s.getTime()===a.getTime()}function In(r,e){if(r.one!==void 0&&e===1)return r.one;var t=e%10,s=e%100;return t===1&&s!==11?r.singularNominative.replace("{{count}}",String(e)):t>=2&&t<=4&&(s<10||s>20)?r.singularGenitive.replace("{{count}}",String(e)):r.pluralGenitive.replace("{{count}}",String(e))}function Ut(r){return function(e,t){return t!=null&&t.addSuffix?t.comparison&&t.comparison>0?r.future?In(r.future,e):"через "+In(r.regular,e):r.past?In(r.past,e):In(r.regular,e)+" назад":In(r.regular,e)}}var C2={lessThanXSeconds:Ut({regular:{one:"меньше секунды",singularNominative:"меньше {{count}} секунды",singularGenitive:"меньше {{count}} секунд",pluralGenitive:"меньше {{count}} секунд"},future:{one:"меньше, чем через секунду",singularNominative:"меньше, чем через {{count}} секунду",singularGenitive:"меньше, чем через {{count}} секунды",pluralGenitive:"меньше, чем через {{count}} секунд"}}),xSeconds:Ut({regular:{singularNominative:"{{count}} секунда",singularGenitive:"{{count}} секунды",pluralGenitive:"{{count}} секунд"},past:{singularNominative:"{{count}} секунду назад",singularGenitive:"{{count}} секунды назад",pluralGenitive:"{{count}} секунд назад"},future:{singularNominative:"через {{count}} секунду",singularGenitive:"через {{count}} секунды",pluralGenitive:"через {{count}} секунд"}}),halfAMinute:function(e,t){return t!=null&&t.addSuffix?t.comparison&&t.comparison>0?"через полминуты":"полминуты назад":"полминуты"},lessThanXMinutes:Ut({regular:{one:"меньше минуты",singularNominative:"меньше {{count}} минуты",singularGenitive:"меньше {{count}} минут",pluralGenitive:"меньше {{count}} минут"},future:{one:"меньше, чем через минуту",singularNominative:"меньше, чем через {{count}} минуту",singularGenitive:"меньше, чем через {{count}} минуты",pluralGenitive:"меньше, чем через {{count}} минут"}}),xMinutes:Ut({regular:{singularNominative:"{{count}} минута",singularGenitive:"{{count}} минуты",pluralGenitive:"{{count}} минут"},past:{singularNominative:"{{count}} минуту назад",singularGenitive:"{{count}} минуты назад",pluralGenitive:"{{count}} минут назад"},future:{singularNominative:"через {{count}} минуту",singularGenitive:"через {{count}} минуты",pluralGenitive:"через {{count}} минут"}}),aboutXHours:Ut({regular:{singularNominative:"около {{count}} часа",singularGenitive:"около {{count}} часов",pluralGenitive:"около {{count}} часов"},future:{singularNominative:"приблизительно через {{count}} час",singularGenitive:"приблизительно через {{count}} часа",pluralGenitive:"приблизительно через {{count}} часов"}}),xHours:Ut({regular:{singularNominative:"{{count}} час",singularGenitive:"{{count}} часа",pluralGenitive:"{{count}} часов"}}),xDays:Ut({regular:{singularNominative:"{{count}} день",singularGenitive:"{{count}} дня",pluralGenitive:"{{count}} дней"}}),aboutXWeeks:Ut({regular:{singularNominative:"около {{count}} недели",singularGenitive:"около {{count}} недель",pluralGenitive:"около {{count}} недель"},future:{singularNominative:"приблизительно через {{count}} неделю",singularGenitive:"приблизительно через {{count}} недели",pluralGenitive:"приблизительно через {{count}} недель"}}),xWeeks:Ut({regular:{singularNominative:"{{count}} неделя",singularGenitive:"{{count}} недели",pluralGenitive:"{{count}} недель"}}),aboutXMonths:Ut({regular:{singularNominative:"около {{count}} месяца",singularGenitive:"около {{count}} месяцев",pluralGenitive:"около {{count}} месяцев"},future:{singularNominative:"приблизительно через {{count}} месяц",singularGenitive:"приблизительно через {{count}} месяца",pluralGenitive:"приблизительно через {{count}} месяцев"}}),xMonths:Ut({regular:{singularNominative:"{{count}} месяц",singularGenitive:"{{count}} месяца",pluralGenitive:"{{count}} месяцев"}}),aboutXYears:Ut({regular:{singularNominative:"около {{count}} года",singularGenitive:"около {{count}} лет",pluralGenitive:"около {{count}} лет"},future:{singularNominative:"приблизительно через {{count}} год",singularGenitive:"приблизительно через {{count}} года",pluralGenitive:"приблизительно через {{count}} лет"}}),xYears:Ut({regular:{singularNominative:"{{count}} год",singularGenitive:"{{count}} года",pluralGenitive:"{{count}} лет"}}),overXYears:Ut({regular:{singularNominative:"больше {{count}} года",singularGenitive:"больше {{count}} лет",pluralGenitive:"больше {{count}} лет"},future:{singularNominative:"больше, чем через {{count}} год",singularGenitive:"больше, чем через {{count}} года",pluralGenitive:"больше, чем через {{count}} лет"}}),almostXYears:Ut({regular:{singularNominative:"почти {{count}} год",singularGenitive:"почти {{count}} года",pluralGenitive:"почти {{count}} лет"},future:{singularNominative:"почти через {{count}} год",singularGenitive:"почти через {{count}} года",pluralGenitive:"почти через {{count}} лет"}})},R2=function(e,t,s){return C2[e](t,s)},D2={full:"EEEE, d MMMM y 'г.'",long:"d MMMM y 'г.'",medium:"d MMM y 'г.'",short:"dd.MM.y"},P2={full:"H:mm:ss zzzz",long:"H:mm:ss z",medium:"H:mm:ss",short:"H:mm"},$2={any:"{{date}}, {{time}}"},M2={date:Ks({formats:D2,defaultWidth:"full"}),time:Ks({formats:P2,defaultWidth:"full"}),dateTime:Ks({formats:$2,defaultWidth:"any"})},tc=["воскресенье","понедельник","вторник","среду","четверг","пятницу","субботу"];function O2(r){var e=tc[r];switch(r){case 0:return"'в прошлое "+e+" в' p";case 1:case 2:case 4:return"'в прошлый "+e+" в' p";case 3:case 5:case 6:return"'в прошлую "+e+" в' p"}}function Au(r){var e=tc[r];return r===2?"'во "+e+" в' p":"'в "+e+" в' p"}function V2(r){var e=tc[r];switch(r){case 0:return"'в следующее "+e+" в' p";case 1:case 2:case 4:return"'в следующий "+e+" в' p";case 3:case 5:case 6:return"'в следующую "+e+" в' p"}}var L2={lastWeek:function(e,t,s){var a=e.getUTCDay();return Su(e,t,s)?Au(a):O2(a)},yesterday:"'вчера в' p",today:"'сегодня в' p",tomorrow:"'завтра в' p",nextWeek:function(e,t,s){var a=e.getUTCDay();return Su(e,t,s)?Au(a):V2(a)},other:"P"},F2=function(e,t,s,a){var i=L2[e];return typeof i=="function"?i(t,s,a):i},U2={narrow:["до н.э.","н.э."],abbreviated:["до н. э.","н. э."],wide:["до нашей эры","нашей эры"]},B2={narrow:["1","2","3","4"],abbreviated:["1-й кв.","2-й кв.","3-й кв.","4-й кв."],wide:["1-й квартал","2-й квартал","3-й квартал","4-й квартал"]},q2={narrow:["Я","Ф","М","А","М","И","И","А","С","О","Н","Д"],abbreviated:["янв.","фев.","март","апр.","май","июнь","июль","авг.","сент.","окт.","нояб.","дек."],wide:["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"]},W2={narrow:["Я","Ф","М","А","М","И","И","А","С","О","Н","Д"],abbreviated:["янв.","фев.","мар.","апр.","мая","июн.","июл.","авг.","сент.","окт.","нояб.","дек."],wide:["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]},z2={narrow:["В","П","В","С","Ч","П","С"],short:["вс","пн","вт","ср","чт","пт","сб"],abbreviated:["вск","пнд","втр","срд","чтв","птн","суб"],wide:["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"]},H2={narrow:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утро",afternoon:"день",evening:"веч.",night:"ночь"},abbreviated:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утро",afternoon:"день",evening:"веч.",night:"ночь"},wide:{am:"ДП",pm:"ПП",midnight:"полночь",noon:"полдень",morning:"утро",afternoon:"день",evening:"вечер",night:"ночь"}},G2={narrow:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утра",afternoon:"дня",evening:"веч.",night:"ночи"},abbreviated:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утра",afternoon:"дня",evening:"веч.",night:"ночи"},wide:{am:"ДП",pm:"ПП",midnight:"полночь",noon:"полдень",morning:"утра",afternoon:"дня",evening:"вечера",night:"ночи"}},K2=function(e,t){var s=Number(e),a=t==null?void 0:t.unit,i;return a==="date"?i="-е":a==="week"||a==="minute"||a==="second"?i="-я":i="-й",s+i},Q2={ordinalNumber:K2,era:cr({values:U2,defaultWidth:"wide"}),quarter:cr({values:B2,defaultWidth:"wide",argumentCallback:function(e){return e-1}}),month:cr({values:q2,defaultWidth:"wide",formattingValues:W2,defaultFormattingWidth:"wide"}),day:cr({values:z2,defaultWidth:"wide"}),dayPeriod:cr({values:H2,defaultWidth:"any",formattingValues:G2,defaultFormattingWidth:"wide"})},Y2=/^(\d+)(-?(е|я|й|ое|ье|ая|ья|ый|ой|ий|ый))?/i,X2=/\d+/i,J2={narrow:/^((до )?н\.?\s?э\.?)/i,abbreviated:/^((до )?н\.?\s?э\.?)/i,wide:/^(до нашей эры|нашей эры|наша эра)/i},Z2={any:[/^д/i,/^н/i]},ek={narrow:/^[1234]/i,abbreviated:/^[1234](-?[ыои]?й?)? кв.?/i,wide:/^[1234](-?[ыои]?й?)? квартал/i},tk={any:[/1/i,/2/i,/3/i,/4/i]},rk={narrow:/^[яфмаисонд]/i,abbreviated:/^(янв|фев|март?|апр|ма[йя]|июн[ья]?|июл[ья]?|авг|сент?|окт|нояб?|дек)\.?/i,wide:/^(январ[ья]|феврал[ья]|марта?|апрел[ья]|ма[йя]|июн[ья]|июл[ья]|августа?|сентябр[ья]|октябр[ья]|октябр[ья]|ноябр[ья]|декабр[ья])/i},sk={narrow:[/^я/i,/^ф/i,/^м/i,/^а/i,/^м/i,/^и/i,/^и/i,/^а/i,/^с/i,/^о/i,/^н/i,/^я/i],any:[/^я/i,/^ф/i,/^мар/i,/^ап/i,/^ма[йя]/i,/^июн/i,/^июл/i,/^ав/i,/^с/i,/^о/i,/^н/i,/^д/i]},nk={narrow:/^[впсч]/i,short:/^(вс|во|пн|по|вт|ср|чт|че|пт|пя|сб|су)\.?/i,abbreviated:/^(вск|вос|пнд|пон|втр|вто|срд|сре|чтв|чет|птн|пят|суб).?/i,wide:/^(воскресень[ея]|понедельника?|вторника?|сред[аы]|четверга?|пятниц[аы]|суббот[аы])/i},ak={narrow:[/^в/i,/^п/i,/^в/i,/^с/i,/^ч/i,/^п/i,/^с/i],any:[/^в[ос]/i,/^п[он]/i,/^в/i,/^ср/i,/^ч/i,/^п[ят]/i,/^с[уб]/i]},ik={narrow:/^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,abbreviated:/^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,wide:/^([дп]п|полночь|полдень|утр[оа]|день|дня|вечера?|ноч[ьи])/i},ok={any:{am:/^дп/i,pm:/^пп/i,midnight:/^полн/i,noon:/^полд/i,morning:/^у/i,afternoon:/^д[ен]/i,evening:/^в/i,night:/^н/i}},lk={ordinalNumber:Eg({matchPattern:Y2,parsePattern:X2,valueCallback:function(e){return parseInt(e,10)}}),era:dr({matchPatterns:J2,defaultMatchWidth:"wide",parsePatterns:Z2,defaultParseWidth:"any"}),quarter:dr({matchPatterns:ek,defaultMatchWidth:"wide",parsePatterns:tk,defaultParseWidth:"any",valueCallback:function(e){return e+1}}),month:dr({matchPatterns:rk,defaultMatchWidth:"wide",parsePatterns:sk,defaultParseWidth:"any"}),day:dr({matchPatterns:nk,defaultMatchWidth:"wide",parsePatterns:ak,defaultParseWidth:"any"}),dayPeriod:dr({matchPatterns:ik,defaultMatchWidth:"wide",parsePatterns:ok,defaultParseWidth:"any"})},ck={code:"ru",formatDistance:R2,formatLong:M2,formatRelative:F2,localize:Q2,match:lk,options:{weekStartsOn:1,firstWeekContainsDate:1}};const me=(r,e="dd.MM.yyyy")=>{const t=typeof r=="string"?Ts(r):r;return jg(t,e,{locale:ck})},ba=(r=new Date)=>{const e=l_(r,{weekStartsOn:1}),t=g_(r,{weekStartsOn:1});return{start:e,end:t}},rc=(r=new Date)=>{const{start:e,end:t}=ba(r);return m_({start:e,end:t})},Tg=r=>{const e=new Date,t=new Date(e);t.setHours(0,0,0,0),t.setDate(t.getDate()-(r-1));const s=new Date(e);return s.setHours(23,59,59,999),{start:t,end:s}},dk=(r,e)=>{const t=typeof r=="string"?Ts(r):r,s=typeof e=="string"?Ts(e):e;return d_(t,s)},Gi=r=>r.reduce((e,t)=>{const[s,a]=t.start.split(":").map(Number),[i,l]=t.end.split(":").map(Number),c=s*60+a;let h=(i*60+l-c)/60;if((h<0||t.endDate)&&(h+=24),t.breaks&&t.breaks.length>0){const m=t.breaks.reduce((x,b)=>{const[I,N]=b.start.split(":").map(Number),[T,E]=b.end.split(":").map(Number),P=I*60+N;let C=(T*60+E-P)/60;return C<0&&(C+=24),x+C},0);h-=m}return e+h},0),lr=r=>{const[e,t]=r.split(":").map(Number);return e*60+t},Sg=(r,e)=>{if(!r||!e)return[];const t=Ts(r),s=Ts(e);if(p2(s,t))return[];const a=[],i=new Date(t);for(;i<=s;)a.push(me(i,"yyyy-MM-dd")),i.setDate(i.getDate()+1);return a},Ag=r=>{const e=Array.from(new Set(r.filter(Boolean)));return e.sort(),e},uk=(r,e)=>{const t=lr(r.start),s=lr(r.end),a=lr(e.start),i=lr(e.end);return t<i&&s>a},Zo=()=>{const r=new Date,e=3*60,t=r.getTimezoneOffset();return new Date(r.getTime()+(e+t)*60*1e3)},Cu=(r,e=Zo())=>{const t=e.getHours(),s=new Date(`${jg(e,"yyyy-MM-dd")}T${r}:00`);return t>=21||e>s},hk=r=>{const e=Math.floor(r),t=Math.round((r-e)*60);return e===0&&t===0?"0ч":e===0?`${t}м`:t===0?`${e}ч`:`${e}ч ${t}м`},Qs=(r,e,t,s)=>{const a=r,i=e||r;if(i<t||a>s)return 0;const l=a>t?a:t,c=i<s?i:s,d=Ts(l),m=Ts(c).getTime()-d.getTime();return Math.floor(m/(1e3*60*60*24))+1},mk=({selectedUserId:r,slotFilter:e,onEditSlot:t,onEditStatus:s})=>{const{theme:a}=Ze(),{user:i}=At(),{isAdmin:l}=Vt(),[c,d]=A.useState([]),[h,m]=A.useState([]),[x,b]=A.useState(new Date),[I,N]=A.useState(!0),T=rc(x),E=r?Ne.filter(k=>k.id===r):Ne;A.useEffect(()=>{P()},[r,x]),A.useEffect(()=>{const k=()=>{P()};return window.addEventListener("focus",k),()=>window.removeEventListener("focus",k)},[]);const P=async()=>{N(!0);try{const k=new Date(T[0]);k.setHours(0,0,0,0);const p=new Date(T[6]);p.setHours(23,59,59,999);const $=me(k,"yyyy-MM-dd"),q=me(p,"yyyy-MM-dd"),[se,B]=await Promise.all([Fr(),Rr()]),Y=se.filter(K=>K.date>=$&&K.date<=q),ce=B.filter(K=>{const G=K.date,xe=K.endDate||K.date;return G<=q&&xe>=$}),re=r?Y.filter(K=>K.userId===r):Y,he=r?ce.filter(K=>K.userId===r):ce;console.log("Loaded slots:",{weekStart:$,weekEnd:q,allSlotsCount:se.length,weekSlotsCount:Y.length,filteredSlotsCount:re.length,selectedUserId:r}),d(re),m(he)}catch(k){console.error("Error loading data:",k)}finally{N(!1)}},O=async k=>{var p;if(!l&&(i==null?void 0:i.id)!==((p=c.find($=>$.id===k))==null?void 0:p.userId)){alert("Только администратор может удалять чужие слоты");return}confirm("Удалить слот?")&&(await ec(k),P())},C=async k=>{var p;if(!l&&(i==null?void 0:i.id)!==((p=h.find($=>$.id===k))==null?void 0:p.userId)){alert("Только администратор может удалять чужие статусы");return}confirm("Удалить статус?")&&(await gg(k),P())},M=k=>{const p=new Date;p.setHours(0,0,0,0);const $=new Date(k.date);if($.setHours(0,0,0,0),$>p)return!0;if($.getTime()===p.getTime()){const se=new Date,B=se.getHours()*60+se.getMinutes();return k.slots.some(Y=>{if(Y.endDate){const K=new Date(Y.endDate);if(K.setHours(0,0,0,0),new Date(p).setHours(23,59,59),K>p)return!0;if(K.getTime()===p.getTime()){const[xe,we]=Y.end.split(":").map(Number);return xe*60+we>B}return!1}const[ce,re]=Y.end.split(":").map(Number);return ce*60+re>B})}return k.slots.some(se=>{if(se.endDate){const B=new Date(se.endDate);return B.setHours(0,0,0,0),B>=p}return!1})},ee=(k,p)=>{const $=c.find(q=>q.userId===k&&q.date===p)||null;if($&&e!=="all"){const q=M($);if(e==="upcoming"&&!q||e==="completed"&&q)return null}return $},Z=(k,p)=>h.find($=>$.userId!==k?!1:$.endDate?$.date<=p&&$.endDate>=p:$.date===p)||null,j=k=>{const $=c.filter(ce=>ce.userId===k).reduce((ce,re)=>ce+Gi(re.slots),0),q=h.filter(ce=>ce.userId===k),se=q.filter(ce=>ce.type==="dayoff").length,B=q.filter(ce=>ce.type==="sick").length,Y=q.filter(ce=>ce.type==="vacation").length;return{totalHours:$,daysOff:se,sickDays:B,vacationDays:Y}},y=k=>{const p=new Date(x);k==="prev"?p.setDate(p.getDate()-7):p.setDate(p.getDate()+7),b(p)};if(I)return n.jsx("div",{className:`rounded-lg p-8 text-center ${a==="dark"?"bg-[#1a1a1a]":"bg-white"}`,children:n.jsx("p",{className:a==="dark"?"text-gray-400":"text-gray-600",children:"Загрузка..."})});const v=a==="dark"?"text-white":"text-gray-900",f=a==="dark"?"text-gray-300":"text-gray-600",_={dayoff:"bg-teal-100 text-teal-900 border border-teal-200 dark:bg-teal-900/40 dark:text-teal-100 dark:border-teal-800",sick:"bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-700",vacation:"bg-sky-100 text-sky-900 border border-sky-200 dark:bg-sky-900/40 dark:text-sky-100 dark:border-sky-800"};return n.jsxs("div",{className:`rounded-lg ${a==="dark"?"bg-[#1a1a1a]":"bg-white"} shadow-md overflow-hidden`,children:[n.jsxs("div",{className:`p-4 border-b ${a==="dark"?"border-gray-800":"border-gray-200"} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r ${a==="dark"?"from-[#0f172a] via-[#0b1323] to-[#0f172a]":"from-green-50 via-white to-green-50"}`,children:[n.jsx("button",{onClick:()=>y("prev"),className:"w-full sm:w-auto px-3 py-2 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors",children:"← Предыдущая неделя"}),n.jsxs("span",{className:`${v} font-semibold text-center text-sm sm:text-base`,children:[me(T[0],"dd.MM.yyyy")," - ",me(T[6],"dd.MM.yyyy")]}),n.jsx("button",{onClick:()=>y("next"),className:"w-full sm:w-auto px-3 py-2 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors",children:"Следующая неделя →"})]}),n.jsx("div",{className:"overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8",children:n.jsx("div",{className:"min-w-full inline-block align-middle",children:n.jsxs("table",{className:"w-full min-w-[640px]",children:[n.jsx("thead",{className:"sticky top-0 z-30",children:n.jsxs("tr",{className:`${a==="dark"?"bg-[#0f172a]":"bg-gray-50"} shadow-sm`,children:[n.jsx("th",{className:`px-2 sm:px-3 md:px-4 py-3 text-left text-xs sm:text-sm font-semibold ${v} sticky left-0 z-30 ${a==="dark"?"bg-[#0f172a]":"bg-gray-50"}`,children:"Участник"}),T.map(k=>n.jsx("th",{className:"px-1.5 sm:px-2 md:px-3 lg:px-4 py-3",children:n.jsxs("div",{className:`mx-auto w-full max-w-[110px] rounded-xl border ${a==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"} shadow-sm text-center`,children:[n.jsx("div",{className:"text-[10px] sm:text-xs opacity-70",children:me(k,"EEE")}),n.jsx("div",{className:"text-sm font-semibold",children:me(k,"dd.MM")})]})},k.toISOString())),n.jsx("th",{className:`px-2 sm:px-3 md:px-4 py-3 text-center text-xs sm:text-sm font-bold ${v} whitespace-nowrap`,children:"Итог"})]})}),n.jsx("tbody",{children:E.map((k,p)=>{const $=j(k.id),q=p%2===0;return n.jsxs("tr",{className:`
                    group border-b transition-all duration-300 relative
                    ${a==="dark"?"border-gray-800/30":"border-gray-200/30"}
                    ${q?a==="dark"?"bg-gradient-to-r from-[#1a1a1a]/40 via-[#1a1a1a]/20 to-transparent hover:from-[#1a1a1a]/70 hover:via-[#1a1a1a]/50 hover:shadow-lg hover:shadow-#4E6E49/10":"bg-gradient-to-r from-gray-50/70 via-gray-50/40 to-transparent hover:from-gray-100/90 hover:via-gray-100/70 hover:shadow-lg hover:shadow-#4E6E49/5":a==="dark"?"bg-gradient-to-r from-[#1a1a1a]/10 via-[#1a1a1a]/5 to-transparent hover:from-[#1a1a1a]/50 hover:via-[#1a1a1a]/30 hover:shadow-lg hover:shadow-#4E6E49/10":"bg-gradient-to-r from-white via-gray-50/30 to-transparent hover:from-gray-50 hover:via-gray-50/60 hover:shadow-lg hover:shadow-#4E6E49/5"}
                    hover:scale-[1.01] hover:-translate-y-0.5
                  `,children:[n.jsx("td",{className:`px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 font-semibold text-xs sm:text-sm ${v} sticky left-0 z-10 transition-all duration-300 backdrop-blur-sm min-w-[140px] sm:min-w-[160px] ${q?a==="dark"?"bg-gradient-to-r from-[#1a1a1a]/40 via-[#1a1a1a]/20 to-transparent group-hover:from-[#1a1a1a]/70 group-hover:via-[#1a1a1a]/50":"bg-gradient-to-r from-gray-50/70 via-gray-50/40 to-transparent group-hover:from-gray-100/90 group-hover:via-gray-100/70":a==="dark"?"bg-gradient-to-r from-[#1a1a1a]/10 via-[#1a1a1a]/5 to-transparent group-hover:from-[#1a1a1a]/50 group-hover:via-[#1a1a1a]/30":"bg-gradient-to-r from-white via-gray-50/30 to-transparent group-hover:from-gray-50 group-hover:via-gray-50/60"}`,children:n.jsxs("div",{className:"flex items-center gap-2 sm:gap-3",children:[n.jsxs("div",{className:"relative flex-shrink-0 group/avatar",children:[k.avatar?n.jsx("img",{src:k.avatar,alt:k.name,className:"w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-#4E6E49/30 ring-2 ring-transparent group-hover:ring-#4E6E49/50",style:{borderColor:a==="dark"?"rgba(34, 197, 94, 0.6)":"rgba(34, 197, 94, 0.4)"},onError:se=>{const B=se.target;B.style.display="none";const Y=B.nextElementSibling;Y&&(Y.style.display="flex")}}):null,n.jsx("div",{className:`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg ring-2 ring-transparent group-hover/avatar:scale-110 group-hover/avatar:shadow-xl group-hover/avatar:ring-#4E6E49/50 ${a==="dark"?"bg-gradient-to-br from-[#4E6E49] via-[#4E6E49] to-blue-500 text-white group-hover/avatar:shadow-#4E6E49/40":"bg-gradient-to-br from-[#4E6E49] via-[#4E6E49] to-blue-400 text-white group-hover/avatar:shadow-#4E6E49/40"} ${k.avatar?"absolute inset-0 hidden":""}`,children:k.name.charAt(0).toUpperCase()}),n.jsx("div",{className:"absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-[#4E6E49] rounded-full border border-white sm:border-2 shadow-lg animate-pulse opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"})]}),n.jsx("span",{className:"font-semibold group-hover:text-[#4E6E49] transition-colors duration-300 truncate hidden sm:inline",children:k.name}),n.jsx("span",{className:"font-semibold group-hover:text-[#4E6E49] transition-colors duration-300 sm:hidden",children:(k.name.split(" ")[0]||k.name).substring(0,8)})]})}),T.map(se=>{const B=me(se,"yyyy-MM-dd"),Y=ee(k.id,B),ce=Z(k.id,B);return n.jsx("td",{className:"px-1 sm:px-2 py-2 sm:py-3 text-center border-l border-r border-transparent hover:border-blue-500/20 transition-colors min-w-[80px] sm:min-w-[100px]",children:Y?n.jsxs("div",{className:"space-y-2",children:[(()=>{const re=M(Y),he=re?"bg-gradient-to-r from-emerald-500 to-teal-600":"bg-gradient-to-r from-slate-500 to-slate-700",G=re?Pr:ji;return Y.slots.map((xe,we)=>n.jsxs("div",{className:"space-y-1",children:[n.jsx("div",{className:`${he} text-white rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${re?"hover:shadow-emerald-500/40 ring-2 ring-emerald-400/40":"hover:shadow-slate-500/40 ring-2 ring-slate-400/40"}`,children:n.jsxs("div",{className:"flex items-center justify-center gap-0.5 sm:gap-1 flex-wrap",children:[n.jsx(G,{className:"w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse flex-shrink-0"}),n.jsxs("span",{className:"whitespace-nowrap",children:[xe.start," - ",xe.end]}),xe.endDate&&n.jsxs("span",{className:"text-[9px] sm:text-[10px] opacity-90 whitespace-nowrap",children:["(до ",me(new Date(xe.endDate),"dd.MM"),")"]})]})}),xe.breaks&&xe.breaks.length>0&&n.jsxs("div",{className:"space-y-1",children:[n.jsx("div",{className:`text-[10px] ${a==="dark"?"text-gray-400":"text-gray-600"} font-medium`,children:"Перерывы:"}),xe.breaks.map((H,_e)=>n.jsx("div",{className:`${a==="dark"?"bg-gray-700/90":"bg-white"} ${a==="dark"?"text-gray-200":"text-gray-900"} border-2 ${a==="dark"?"border-orange-500/50":"border-orange-300"} rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${a==="dark"?"hover:border-orange-400/70 hover:shadow-orange-500/20":"hover:border-orange-400 hover:shadow-orange-400/20"}`,children:n.jsxs("span",{className:"flex items-center gap-0.5 sm:gap-1 justify-center flex-wrap",children:[n.jsx("span",{className:"w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-orange-500 flex-shrink-0"}),n.jsxs("span",{className:"whitespace-nowrap",children:[H.start," - ",H.end]})]})},_e))]})]},we))})(),Y.comment&&n.jsxs("div",{className:"flex items-center justify-center group relative",children:[n.jsx(ur,{className:"w-4 h-4 text-gray-400 cursor-help"}),n.jsx("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10",children:Y.comment})]}),n.jsx("div",{className:"flex gap-1 justify-center",children:l||(k==null?void 0:k.id)===Y.userId?n.jsxs(n.Fragment,{children:[n.jsx("button",{onClick:()=>t(Y),className:"p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded",children:n.jsx(zt,{className:"w-3 h-3"})}),n.jsx("button",{onClick:()=>O(Y.id),className:"p-1 text-red-500 hover:bg-red-500 hover:text-white rounded",children:n.jsx(It,{className:"w-3 h-3"})})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{disabled:!0,className:"p-1 text-gray-400 cursor-not-allowed rounded",title:"Вы можете редактировать только свои слоты",children:n.jsx(zt,{className:"w-3 h-3"})}),n.jsx("button",{disabled:!0,className:"p-1 text-gray-400 cursor-not-allowed rounded",title:"Вы можете удалять только свои слоты",children:n.jsx(It,{className:"w-3 h-3"})})]})})]}):ce?n.jsxs("div",{className:"space-y-1",children:[n.jsx("div",{className:`rounded px-2 py-1 text-xs font-semibold ${_[ce.type]}`,children:ce.type==="dayoff"?"Выходной":ce.type==="sick"?"Больничный":"Отпуск"}),ce.comment&&n.jsxs("div",{className:"flex items-center justify-center group relative",children:[n.jsx(ur,{className:"w-4 h-4 text-gray-400 cursor-help"}),n.jsx("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10",children:ce.comment})]}),n.jsx("div",{className:"flex gap-1 justify-center",children:l||(k==null?void 0:k.id)===ce.userId?n.jsxs(n.Fragment,{children:[n.jsx("button",{onClick:()=>s(ce),className:"p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded",children:n.jsx(zt,{className:"w-3 h-3"})}),n.jsx("button",{onClick:()=>C(ce.id),className:"p-1 text-red-500 hover:bg-red-500 hover:text-white rounded",children:n.jsx(It,{className:"w-3 h-3"})})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{disabled:!0,className:"p-1 text-gray-400 cursor-not-allowed rounded",title:"Вы можете редактировать только свои статусы",children:n.jsx(zt,{className:"w-3 h-3"})}),n.jsx("button",{disabled:!0,className:"p-1 text-gray-400 cursor-not-allowed rounded",title:"Вы можете удалять только свои статусы",children:n.jsx(It,{className:"w-3 h-3"})})]})})]}):n.jsx("span",{className:`text-sm ${f}`,children:"—"})},B)}),n.jsx("td",{className:`px-4 py-3 text-sm ${v}`,children:n.jsxs("div",{className:"space-y-1",children:[n.jsxs("div",{children:["Часов: ",$.totalHours.toFixed(1)]}),n.jsxs("div",{children:["Выходных: ",$.daysOff]}),n.jsxs("div",{children:["Больничных: ",$.sickDays]}),n.jsxs("div",{children:["Отпусков: ",$.vacationDays]})]})})]},k.id)})})]})})})]})},gk=({selectedUserId:r,slotFilter:e,onEditSlot:t,onEditStatus:s})=>{const{theme:a}=Ze(),{user:i}=At(),{isAdmin:l}=Vt(),[c,d]=A.useState([]),[h,m]=A.useState([]),[x,b]=A.useState(new Date),[I,N]=A.useState(!0),T=rc(x);A.useEffect(()=>{E()},[r,x]),A.useEffect(()=>{const f=()=>{E()};return window.addEventListener("focus",f),()=>window.removeEventListener("focus",f)},[]);const E=async()=>{N(!0);try{const f=new Date(T[0]);f.setHours(0,0,0,0);const _=new Date(T[6]);_.setHours(23,59,59,999);const k=me(f,"yyyy-MM-dd"),p=me(_,"yyyy-MM-dd"),[$,q]=await Promise.all([Fr(),Rr()]),se=$.filter(re=>re.date>=k&&re.date<=p),B=q.filter(re=>{const he=re.date,K=re.endDate||re.date;return he<=p&&K>=k}),Y=r?se.filter(re=>re.userId===r):se,ce=r?B.filter(re=>re.userId===r):B;console.log("Loaded slots (week view):",{weekStart:k,weekEnd:p,allSlotsCount:$.length,weekSlotsCount:se.length,filteredSlotsCount:Y.length,selectedUserId:r}),d(Y),m(ce)}catch(f){console.error("Error loading data:",f)}finally{N(!1)}},P=async f=>{var _;if(!l&&(i==null?void 0:i.id)!==((_=c.find(k=>k.id===f))==null?void 0:_.userId)){alert("Только администратор может удалять чужие слоты");return}confirm("Удалить слот?")&&(await ec(f),E())},O=async f=>{var _;if(!l&&(i==null?void 0:i.id)!==((_=h.find(k=>k.id===f))==null?void 0:_.userId)){alert("Только администратор может удалять чужие статусы");return}confirm("Удалить статус?")&&(await gg(f),E())},C=f=>{const _=new Date;_.setHours(0,0,0,0);const k=new Date(f.date);if(k.setHours(0,0,0,0),k>_)return!0;if(k.getTime()===_.getTime()){const $=new Date,q=$.getHours()*60+$.getMinutes();return f.slots.some(se=>{if(se.endDate){const re=new Date(se.endDate);if(re.setHours(0,0,0,0),new Date(_).setHours(23,59,59),re>_)return!0;if(re.getTime()===_.getTime()){const[K,G]=se.end.split(":").map(Number);return K*60+G>q}return!1}const[B,Y]=se.end.split(":").map(Number);return B*60+Y>q})}return f.slots.some($=>{if($.endDate){const q=new Date($.endDate);return q.setHours(0,0,0,0),q>=_}return!1})},M=f=>{let _=c.filter(k=>k.date===f);return e!=="all"&&(_=_.filter(k=>{const p=C(k);return e==="upcoming"?p:e==="completed"?!p:!0})),_},ee=f=>h.filter(_=>_.endDate?_.date<=f&&_.endDate>=f:_.date===f),Z=f=>{const _=new Date(x);f==="prev"?_.setDate(_.getDate()-7):_.setDate(_.getDate()+7),b(_)};if(I)return n.jsx("div",{className:`rounded-lg p-8 text-center ${a==="dark"?"bg-[#1a1a1a]":"bg-white"}`,children:n.jsx("p",{className:a==="dark"?"text-gray-400":"text-gray-600",children:"Загрузка..."})});const j=a==="dark"?"text-white":"text-gray-900",y=a==="dark"?"text-gray-400":"text-gray-600",v={dayoff:"bg-teal-100 text-teal-900 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-100 dark:border-teal-800",sick:"bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-700",vacation:"bg-sky-100 text-sky-900 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-100 dark:border-sky-800"};return n.jsxs("div",{className:`rounded-lg ${a==="dark"?"bg-[#1a1a1a]":"bg-white"} shadow-md overflow-hidden`,children:[n.jsxs("div",{className:`p-3 sm:p-4 border-b ${a==="dark"?"border-gray-800":"border-gray-200"} flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between`,children:[n.jsx("button",{onClick:()=>Z("prev"),className:"w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors touch-manipulation active:scale-95",children:"← Предыдущая неделя"}),n.jsxs("span",{className:`${j} font-semibold text-center text-xs sm:text-sm md:text-base whitespace-nowrap`,children:[me(T[0],"dd.MM.yyyy")," - ",me(T[6],"dd.MM.yyyy")]}),n.jsx("button",{onClick:()=>Z("next"),className:"w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors touch-manipulation active:scale-95",children:"Следующая неделя →"})]}),n.jsx("div",{className:"p-3 sm:p-4 space-y-3 sm:space-y-4",children:T.map(f=>{const _=me(f,"yyyy-MM-dd"),k=M(_),p=ee(_);return n.jsxs("div",{className:`rounded-xl p-4 sm:p-5 border ${a==="dark"?"bg-gray-800/70 border-gray-700":"bg-gray-50 border-gray-200"}`,children:[n.jsx("h3",{className:`text-lg font-semibold mb-3 ${j}`,children:me(f,"dd.MM.yyyy")}),n.jsxs("div",{className:"space-y-3 sm:space-y-4",children:[p.map($=>{const se=Ne.find(Y=>Y.id===$.userId)||Ne.find(Y=>({artyom:"1",adel:"2",kseniya:"3",olga:"4",anastasia:"5"})[$.userId]===Y.id),B=(se==null?void 0:se.name)||$.userId;return n.jsxs("div",{className:`group relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl shadow-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl backdrop-blur text-center sm:text-left ${v[$.type]}`,children:[n.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start w-full",children:[n.jsx("span",{className:"font-semibold",children:B}),n.jsx("span",{className:"text-sm",children:$.type==="dayoff"?"Выходной":$.type==="sick"?"Больничный":"Отпуск"}),$.comment&&n.jsxs("div",{className:"relative group self-center sm:self-auto",children:[n.jsx(ur,{className:"w-4 h-4 text-current cursor-help"}),n.jsx("div",{className:"absolute bottom-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 mb-2 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap",children:$.comment})]})]}),n.jsx("div",{className:"flex gap-2 justify-center sm:justify-end w-full",children:l||(i==null?void 0:i.id)===$.userId?n.jsxs(n.Fragment,{children:[n.jsx("button",{onClick:()=>s($),className:`p-1 rounded transition-colors ${a==="dark"?"bg-white/10 hover:bg-white/20 text-white":"bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"}`,children:n.jsx(zt,{className:"w-4 h-4 text-current"})}),n.jsx("button",{onClick:()=>O($.id),className:`p-1 rounded transition-colors ${a==="dark"?"bg-white/10 hover:bg-white/20 text-white":"bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"}`,children:n.jsx(It,{className:"w-4 h-4 text-current"})})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{disabled:!0,className:`p-1 cursor-not-allowed rounded ${a==="dark"?"bg-white/5 text-white/60":"bg-gray-100 text-gray-400 border border-gray-200"}`,title:"Вы можете редактировать только свои статусы",children:n.jsx(zt,{className:"w-4 h-4 text-current opacity-60"})}),n.jsx("button",{disabled:!0,className:`p-1 cursor-not-allowed rounded ${a==="dark"?"bg-white/5 text-white/60":"bg-gray-100 text-gray-400 border border-gray-200"}`,title:"Вы можете удалять только свои статусы",children:n.jsx(It,{className:"w-4 h-4 text-current opacity-60"})})]})})]},$.id)}),k.map($=>{const se=Ne.find(he=>he.id===$.userId)||Ne.find(he=>({artyom:"1",adel:"2",kseniya:"3",olga:"4",anastasia:"5"})[$.userId]===he.id),B=(se==null?void 0:se.name)||$.userId,Y=C($),ce=Y?"bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300/40":"bg-gradient-to-r from-slate-500 to-slate-700 border-slate-300/40",re=Y?Pr:ji;return n.jsxs("div",{className:`group relative space-y-2 sm:space-y-3 p-3 sm:p-4 ${ce} rounded-lg sm:rounded-xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl active:scale-[0.98] sm:hover:scale-[1.03] mb-2 sm:mb-3 ${Y?"hover:border-emerald-200/80 ring-2 ring-emerald-200/40 hover:ring-4 hover:ring-emerald-200/60":"hover:border-slate-200/80 ring-2 ring-slate-200/40 hover:ring-4 hover:ring-slate-200/60"}`,children:[n.jsxs("div",{className:"flex items-center justify-between border-b border-white/20 pb-2 sm:pb-3",children:[n.jsxs("div",{className:"flex items-center gap-2 sm:gap-3 min-w-0 flex-1",children:[n.jsxs("div",{className:"relative flex-shrink-0 group/avatar",children:[se!=null&&se.avatar?n.jsx("img",{src:se.avatar,alt:B,className:`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full object-cover border-2 shadow-xl transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:shadow-2xl ${Y?"border-white/50 ring-2 ring-white/40 ring-offset-2 ring-offset-emerald-400/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/60":"border-white/40 ring-2 ring-white/30 ring-offset-2 ring-offset-slate-400/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/50"}`,onError:he=>{const K=he.target;K.style.display="none";const G=K.nextElementSibling;G&&(G.style.display="flex")}}):null,n.jsx("div",{className:`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-xl group-hover/avatar:scale-110 group-hover/avatar:shadow-2xl ${Y?"bg-white/25 backdrop-blur-md border-2 border-white/40 ring-2 ring-white/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/60":"bg-white/15 backdrop-blur-md border-2 border-white/30 ring-2 ring-white/20 group-hover/avatar:ring-4 group-hover/avatar:ring-white/50"} ${se!=null&&se.avatar?"absolute inset-0 hidden":""}`,children:B.charAt(0).toUpperCase()}),n.jsx("div",{className:`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full border border-white sm:border-2 shadow-lg animate-pulse opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 ${Y?"bg-emerald-300":"bg-slate-400"}`})]}),n.jsx("span",{className:"text-white font-bold text-sm sm:text-base group-hover:scale-105 transition-transform duration-300 truncate",children:B})]}),n.jsx("div",{className:"flex gap-2",children:l||(i==null?void 0:i.id)===$.userId?n.jsxs(n.Fragment,{children:[n.jsx("button",{onClick:()=>t($),className:"p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors",children:n.jsx(zt,{className:"w-4 h-4 text-white"})}),n.jsx("button",{onClick:()=>P($.id),className:"p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors",children:n.jsx(It,{className:"w-4 h-4 text-white"})})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{disabled:!0,className:"p-1.5 bg-white/10 cursor-not-allowed rounded-lg",title:"Вы можете редактировать только свои слоты",children:n.jsx(zt,{className:"w-4 h-4 text-white/50"})}),n.jsx("button",{disabled:!0,className:"p-1.5 bg-white/10 cursor-not-allowed rounded-lg",title:"Вы можете удалять только свои слоты",children:n.jsx(It,{className:"w-4 h-4 text-white/50"})})]})})]}),n.jsxs("div",{className:"space-y-2",children:[$.slots.map((he,K)=>n.jsxs("div",{className:"space-y-1.5",children:[n.jsx("div",{className:`bg-white/25 backdrop-blur-md rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${Y?"border-white/40 ring-2 ring-white/20 hover:border-white/60 hover:ring-4 hover:ring-white/40":"border-white/30 ring-2 ring-white/10 hover:border-white/50 hover:ring-4 hover:ring-white/30"}`,children:n.jsxs("div",{className:"flex items-center gap-1.5 sm:gap-2 flex-wrap",children:[n.jsx(re,{className:`w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0 ${Y?"animate-pulse":""}`}),n.jsxs("span",{className:"text-white font-bold text-xs sm:text-sm whitespace-nowrap",children:[he.start," - ",he.end]}),he.endDate&&n.jsxs("span",{className:"text-white/80 font-medium text-[10px] sm:text-xs whitespace-nowrap",children:["(до ",me(new Date(he.endDate),"dd.MM"),")"]})]})}),he.breaks&&he.breaks.length>0&&n.jsxs("div",{className:"space-y-1 w-full",children:[n.jsx("div",{className:`text-[10px] ${a==="dark"?"text-gray-300":"text-gray-700"} font-medium text-center sm:text-left`,children:"Перерывы:"}),he.breaks.map((G,xe)=>n.jsx("div",{className:`${a==="dark"?"bg-gray-700/95":"bg-white"} ${a==="dark"?"text-gray-200":"text-gray-900"} border-2 ${a==="dark"?"border-orange-500/60":"border-orange-300"} rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${a==="dark"?"hover:border-orange-400/80 hover:shadow-orange-500/30 ring-2 ring-orange-500/20 hover:ring-4 hover:ring-orange-400/40":"hover:border-orange-400 hover:shadow-orange-400/30 ring-2 ring-orange-300/20 hover:ring-4 hover:ring-orange-300/40"} w-full`,children:n.jsxs("span",{className:"flex items-center gap-1 sm:gap-1.5 justify-center flex-wrap w-full",children:[n.jsx("span",{className:`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${a==="dark"?"bg-orange-400":"bg-orange-500"} animate-pulse flex-shrink-0`}),n.jsxs("span",{className:"whitespace-nowrap",children:[G.start," - ",G.end]})]})},xe))]})]},K)),$.comment&&n.jsxs("div",{className:"relative group flex items-center gap-2 pt-2",children:[n.jsx(ur,{className:"w-4 h-4 text-white cursor-help"}),n.jsx("div",{className:"absolute bottom-full left-0 mb-2 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap",children:$.comment})]})]})]},$.id)}),k.length===0&&p.length===0&&n.jsx("p",{className:`text-sm ${y}`,children:"Нет данных"})]})]},_)})})]})},pk=({slot:r,onClose:e,onSave:t})=>{var ds;const{user:s}=At(),{theme:a}=Ze(),{isAdmin:i}=Vt(),l=a==="dark"?"text-white":"text-gray-900",c=(r==null?void 0:r.date)||me(new Date,"yyyy-MM-dd"),[d,h]=A.useState(c),[m,x]=A.useState(r!=null&&r.userId?[r.userId]:s!=null&&s.id?[s.id]:[]),[b,I]=A.useState(((ds=r==null?void 0:r.slots)==null?void 0:ds.map(z=>{const oe=z;return oe.break&&!oe.breaks?{...z,breaks:[oe.break]}:z}))||[]),[N,T]=A.useState(""),[E,P]=A.useState(""),[O,C]=A.useState(!1),[M,ee]=A.useState(""),[Z,j]=A.useState(""),[y,v]=A.useState(""),[f,_]=A.useState(null),[k,p]=A.useState(null),[$,q]=A.useState(null),[se,B]=A.useState(null),[Y,ce]=A.useState((r==null?void 0:r.comment)||""),[re,he]=A.useState(!1),[K,G]=A.useState([]),[xe,we]=A.useState(!1),[H,_e]=A.useState([]),[ye,Ee]=A.useState("single"),[X,R]=A.useState(c),[L,ge]=A.useState(c),[pe,U]=A.useState(c),[S,Q]=A.useState([]),[de,D]=A.useState(""),[ue,je]=A.useState(!1);gn();const Ue=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],Oe=i&&!r;A.useEffect(()=>{console.log("SlotForm mounted, user:",s==null?void 0:s.name,"slots count:",b.length)},[]),A.useEffect(()=>{if(re&&d){const z=new Date(d),oe=z.getDay()===0?6:z.getDay()-1;G([oe])}},[re,d]),A.useEffect(()=>{ye!=="single"&&(he(!1),we(!1),G([]),_e([]))},[ye]),A.useEffect(()=>{if(O&&d&&N&&E)if(N>=E){const z=new Date(d);z.setDate(z.getDate()+1),ee(me(z,"yyyy-MM-dd"))}else ee("");else ee("")},[O,d,N,E]);const F=()=>{var rt;if(!N||!E){D("Заполните время начала и окончания");return}const z=O&&N>=E;if(!z&&N>=E){D('Время окончания должно быть позже времени начала. Включите "Переходит через полночь" для слотов, переходящих на следующий день.');return}let oe;if(z&&d)if(M)oe=M;else{const Xe=new Date(d);Xe.setDate(Xe.getDate()+1),oe=me(Xe,"yyyy-MM-dd")}const Te=f!==null?((rt=b[f])==null?void 0:rt.breaks)||[]:[],De={start:N,end:E,...oe&&{endDate:oe},breaks:Te};if(f!==null){const Xe=[...b];Xe[f]=De,I(Xe)}else I([...b,De]);T(""),P(""),C(!1),ee(""),j(""),v(""),_(null),p(null),D("")},ae=z=>{const oe=b[z];if(!oe)return;const Te=!!oe.endDate||lr(oe.end)<=lr(oe.start);T(oe.start),P(oe.end),C(Te),ee(oe.endDate||""),_(z),p(null),q(null),B(null),j(""),v(""),D("")},ne=()=>{_(null),T(""),P(""),C(!1),ee(""),D("")},be=z=>{if(!Z||!y){D("Заполните время начала и окончания перерыва");return}const oe=b[z];if(!oe)return;if(Z>=y){D("Время окончания перерыва должно быть позже времени начала");return}const Te=lr(Z),De=lr(y),rt=lr(oe.start),Xe=lr(oe.end),qe=oe.endDate||Xe<=rt;let gt=!1;if(qe){const ot=Te>=rt&&Te<1440&&De>Te&&De<=1440&&De>Te,ir=Te>=0&&Te<=Xe&&De>Te&&De<=Xe,Nr=Te>=rt&&Te<1440&&De>0&&De<=Xe&&Te>De;gt=ot||ir||Nr}else gt=Te>=rt&&De<=Xe&&De>Te;if(!gt){D(`Перерыв должен быть в пределах времени слота (${oe.start} - ${oe.end})`);return}const qt=oe.breaks||[];for(let ft=0;ft<qt.length;ft++){if($===z&&se===ft)continue;const ot=qt[ft];if(Z>=ot.start&&Z<ot.end||y>ot.start&&y<=ot.end||Z<=ot.start&&y>=ot.end){D("Перерывы не должны пересекаться");return}}let pt;$===z&&se!==null?(pt=[...qt],pt[se]={start:Z,end:y},pt.sort((ft,ot)=>ft.start.localeCompare(ot.start))):pt=[...qt,{start:Z,end:y}].sort((ft,ot)=>ft.start.localeCompare(ot.start));const Ft=[...b];Ft[z]={...oe,breaks:pt},I(Ft),j(""),v(""),p(null),q(null),B(null),D("")},Ye=(z,oe)=>{const Te=b[z];if(!Te||!Te.breaks||!Te.breaks[oe])return;const De=Te.breaks[oe];q(z),B(oe),p(z),j(De.start),v(De.end),D("")},at=()=>{j(""),v(""),p(null),q(null),B(null),D("")},yt=(z,oe)=>{const Te=b[z];if(!Te||!Te.breaks)return;const De=Te.breaks.filter((Xe,qe)=>qe!==oe),rt=[...b];rt[z]={...Te,breaks:De.length>0?De:void 0},I(rt)},He=z=>{I(b.filter((oe,Te)=>Te!==z)),f===z&&ne()},dt=z=>{K.includes(z)?G(K.filter(oe=>oe!==z)):G([...K,z])},Me=z=>{H.includes(z)?_e(H.filter(oe=>oe!==z)):_e([...H,z])},fe=z=>{x(oe=>oe.includes(z)?oe.filter(Te=>Te!==z):[...oe,z])},Ge=()=>{m.length===Ne.length?x([]):x(Ne.map(z=>z.id))},ut=()=>{if(!pe)return;const z=Ag([...S,pe]);Q(z),U("")},_r=z=>{Q(oe=>oe.filter(Te=>Te!==z))},Jt=()=>{if(Oe){if(ye==="range")return Sg(X,L);if(ye==="multiple")return S}return[d]},cs=()=>r?[r.userId]:Oe?m:i&&!s?m.length>0?m:[]:s!=null&&s.id?[s.id]:[],Ae=z=>{var oe;return((oe=Ne.find(Te=>Te.id===z))==null?void 0:oe.name)||z},Se=async(z,oe)=>{const De=(await Fr(void 0,z)).filter(rt=>rt.id!==(r==null?void 0:r.id));for(const rt of oe)for(const Xe of De)if(uk(rt,Xe.slots[0])&&Xe.participants.length>=3)return`Слот ${rt.start}-${rt.end} уже занят максимальным количеством участников (3)`;return null},_t=async()=>{if(console.log("handleSave called"),!i&&!s){console.log("No user found"),D("Пользователь не найден");return}if(b.length===0){D("Добавьте хотя бы один временной интервал");return}if(r&&!i&&s&&r.userId!==s.id){D("Вы можете редактировать только свои слоты"),je(!1);return}const z=cs();if(z.length===0){D("Выберите хотя бы одного участника");return}const oe=Jt();if(oe.length===0){D("Выберите даты");return}const Te=new Date;Te.setHours(0,0,0,0);const De=me(Te,"yyyy-MM-dd"),rt=qe=>qe<De,Xe=async(qe,gt,qt=[qe])=>{const pt=await Se(gt,b);if(pt)throw new Error(`[${Ae(qe)} • ${me(new Date(gt),"dd.MM.yyyy")}] ${pt}`);const Ft={userId:qe,date:gt,slots:b,...Y&&{comment:Y},participants:qt};r?await O1(r.id,Ft):await M1(Ft)};console.log("Starting save process..."),D(""),je(!0);try{if(r){await Xe(r.userId,d,r.participants||[r.userId]),t();return}if(re&&K.length>0){const qe=new Date(d),gt=qe.getMonth(),qt=qe.getFullYear(),pt=new Date(qt,gt+1,0).getDate();for(let Ft=1;Ft<=pt;Ft++){const ft=new Date(qt,gt,Ft),ot=ft.getDay()===0?6:ft.getDay()-1;if(K.includes(ot)){const ir=me(ft,"yyyy-MM-dd");if(rt(ir))continue;for(const Nr of z)await Xe(Nr,ir)}}}else if(xe&&H.length>0){const qe=new Date(d),gt=qe.getMonth(),qt=qe.getFullYear(),pt=new Date(qt,gt+1,0).getDate();for(let Ft=1;Ft<=pt;Ft++){const ft=new Date(qt,gt,Ft),ot=ft.getDay()===0?6:ft.getDay()-1;if(H.includes(ot)){const ir=me(ft,"yyyy-MM-dd");if(rt(ir))continue;for(const Nr of z)await Xe(Nr,ir)}}}else if(Oe&&ye!=="single")for(const qe of oe)for(const gt of z)await Xe(gt,qe);else for(const qe of z)await Xe(qe,d);try{await mg()}catch(qe){console.error("Cleanup after slot save failed:",qe)}t()}catch(qe){console.error("Error saving slot:",qe);const gt=qe.message||qe.code||"Ошибка при сохранении";D(gt)}finally{je(!1)}},$s=Oe?Jt():[d],kr=m.map(z=>Ae(z)).join(", "),va=b.map(z=>`${z.start}–${z.end}${z.endDate?" (+1)":""}`);return n.jsx("div",{className:"fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 touch-manipulation overflow-y-auto",children:n.jsx("div",{className:`w-full max-w-5xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${a==="dark"?"bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10":"bg-gradient-to-br from-white via-slate-50 to-white border-slate-200"} max-h-[90vh] overflow-y-auto`,children:n.jsxs("div",{className:"p-4 sm:p-6 lg:p-7 flex flex-col h-full min-h-0 overflow-y-auto",children:[n.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[n.jsxs("div",{className:"space-y-1",children:[n.jsxs("div",{className:"flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4E6E49] font-semibold",children:[n.jsxs("span",{className:"inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30",children:[r?"Редактирование":"Создание"," слота"]}),n.jsx("span",{className:`${a==="dark"?"text-gray-400":"text-gray-500"}`,children:"расписание"})]}),n.jsx("h3",{className:`text-2xl sm:text-3xl font-bold ${l}`,children:r?"Редактировать слот":"Добавить слот"}),n.jsx("p",{className:`${a==="dark"?"text-gray-400":"text-gray-600"} text-sm`,children:"Новая оболочка с акцентом на шаги: участники → даты → время → заметки."})]}),n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsxs("div",{className:`px-3 py-2 rounded-xl border text-xs sm:text-sm ${a==="dark"?"border-white/10 bg-white/5 text-gray-200":"border-slate-200 bg-slate-50 text-slate-700"}`,children:[r?"Редактирование":"Создание"," · ",b.length||0," интервал(ов)"]}),n.jsx("button",{onClick:e,className:`p-2.5 rounded-full border ${a==="dark"?"border-white/10 text-gray-200 hover:bg-white/5":"border-slate-200 text-slate-600 hover:bg-slate-100"} transition-colors touch-manipulation`,"aria-label":"Закрыть",children:n.jsx(Xt,{className:"w-4 h-4 sm:w-5 sm:h-5"})})]})]}),n.jsxs("div",{className:"mt-5 grid lg:grid-cols-[0.9fr_1.6fr] gap-4 lg:gap-6 flex-1 min-h-0",children:[n.jsxs("aside",{className:`rounded-2xl border ${a==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-white"} p-4 sm:p-5 space-y-4 sticky top-0 self-start max-h-full overflow-y-auto`,children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("p",{className:"text-sm font-semibold",children:"Навигация"}),n.jsx("span",{className:"text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold",children:"4 шага"})]}),n.jsx("div",{className:"space-y-2",children:[{label:"Участники",detail:kr||"Не выбрано",done:m.length>0||!!r},{label:"Даты",detail:$s.slice(0,2).map(z=>me(z,"dd.MM")).join(", ")||"Выберите дату",done:$s.length>0},{label:"Время",detail:va.slice(0,2).join(" · ")||"Добавьте интервал",done:b.length>0},{label:"Комментарий",detail:Y?"Заполнен":"Необязателен",done:!!Y}].map((z,oe)=>n.jsxs("div",{className:`flex items-start gap-3 rounded-xl border px-3 py-3 ${a==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`,children:[n.jsx("span",{className:`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${z.done?"bg-[#4E6E49] text-white":a==="dark"?"bg-slate-800 text-gray-300":"bg-slate-200 text-slate-700"}`,children:oe+1}),n.jsxs("div",{className:"flex-1",children:[n.jsx("p",{className:"text-sm font-semibold",children:z.label}),n.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 truncate",children:z.detail})]})]},z.label))}),n.jsxs("div",{className:`rounded-xl border px-3 py-3 space-y-2 ${a==="dark"?"border-emerald-900/50 bg-emerald-900/20":"border-emerald-100 bg-emerald-50"}`,children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-emerald-600 font-semibold",children:"Подсказка"}),n.jsx("p",{className:"text-sm text-emerald-700 dark:text-emerald-200",children:"Формы теперь разбиты на блоки: вы свободно переключаетесь между шагами, не теряя данных."})]})]}),n.jsxs("div",{className:"space-y-4 overflow-y-auto overscroll-contain pr-1 pb-6 flex-1 min-h-0",children:[Oe&&n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Участники"}),n.jsxs("div",{className:"space-y-3",children:[n.jsx("div",{className:"flex flex-wrap gap-2",children:Ne.map(z=>n.jsxs("label",{className:`px-3 py-1.5 rounded-full border cursor-pointer text-sm flex items-center gap-2 ${m.includes(z.id)?"bg-[#4E6E49] border-[#4E6E49] text-white":a==="dark"?"bg-gray-700 border-gray-800 text-gray-200":"bg-gray-100 border-gray-300 text-gray-700"}`,children:[n.jsx("input",{type:"checkbox",checked:m.includes(z.id),onChange:()=>fe(z.id),className:"hidden"}),z.name]},z.id))}),n.jsx("button",{type:"button",onClick:Ge,className:"text-sm text-[#4E6E49] hover:text-[#4E6E49]",children:m.length===Ne.length?"Снять выделение":"Выбрать всех"})]})]}),Oe&&n.jsxs("div",{children:[n.jsx("p",{className:`text-xs sm:text-sm font-medium mb-2 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Формат выбора дат"}),n.jsx("div",{className:"flex flex-wrap gap-4",children:[{value:"single",label:"Один день"},{value:"range",label:"Диапазон дат"},{value:"multiple",label:"Конкретные даты"}].map(z=>n.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[n.jsx("input",{type:"radio",value:z.value,checked:ye===z.value,onChange:oe=>Ee(oe.target.value)}),n.jsx("span",{className:a==="dark"?"text-gray-200":"text-gray-700",children:z.label})]},z.value))})]}),(!Oe||ye==="single")&&n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Дата"}),n.jsx("input",{type:"date",value:d,onChange:z=>h(z.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),Oe&&ye==="range"&&n.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Начало диапазона"}),n.jsx("input",{type:"date",value:X,onChange:z=>R(z.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Конец диапазона"}),n.jsx("input",{type:"date",value:L,min:X,onChange:z=>ge(z.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]})]}),Oe&&ye==="multiple"&&n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Выбранные даты"}),n.jsxs("div",{className:"flex flex-col gap-3",children:[n.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[n.jsx("input",{type:"date",value:pe,onChange:z=>U(z.target.value),className:`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}),n.jsx("button",{type:"button",onClick:ut,className:"px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors",children:"Добавить"})]}),S.length>0?n.jsx("div",{className:"flex flex-wrap gap-2",children:S.map(z=>n.jsxs("span",{className:"inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm",children:[me(z,"dd.MM.yyyy"),n.jsx("button",{type:"button",onClick:()=>_r(z),className:"text-red-500 hover:text-red-600",children:"x"})]},z))}):n.jsx("p",{className:"text-sm text-gray-500",children:"Пока не выбрано ни одной даты"})]})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Временные слоты"}),n.jsxs("div",{className:"space-y-2 mb-2",children:[n.jsx("div",{className:"flex flex-col sm:flex-row gap-2",children:n.jsxs("div",{className:"flex gap-2 flex-1",children:[n.jsx("input",{type:"time",value:N,onChange:z=>T(z.target.value),className:`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Начало"}),n.jsx("span",{className:"mx-1 sm:mx-2 text-gray-500 text-sm sm:text-base flex items-center",children:"—"}),n.jsx("input",{type:"time",value:E,onChange:z=>P(z.target.value),className:`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Окончание"})]})}),n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("input",{type:"checkbox",id:"crossMidnight",checked:O,onChange:z=>{C(z.target.checked),z.target.checked||ee("")},className:`w-4 h-4 rounded border-2 ${a==="dark"?"border-gray-800 bg-gray-700 checked:bg-[#4E6E49] checked:border-[#4E6E49]":"border-gray-300 bg-white checked:bg-[#4E6E49] checked:border-[#4E6E49]"} focus:ring-2 focus:ring-[#4E6E49] cursor-pointer touch-manipulation`}),n.jsx("label",{htmlFor:"crossMidnight",className:`text-xs sm:text-sm font-medium cursor-pointer ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Переходит через полночь (на следующий день)"})]}),O&&n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-1 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Дата окончания (автоматически: следующий день после начала)"}),n.jsx("input",{type:"date",value:M,onChange:z=>ee(z.target.value),min:d,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}),M&&n.jsxs("p",{className:`mt-1 text-xs ${a==="dark"?"text-gray-400":"text-gray-500"}`,children:["Слот: ",d," ",N," → ",M," ",E]})]}),n.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[n.jsx("button",{onClick:F,className:"w-full px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors flex items-center justify-center gap-2",children:f!==null?n.jsxs(n.Fragment,{children:[n.jsx(zt,{className:"w-4 h-4"}),"Сохранить слот"]}):n.jsxs(n.Fragment,{children:[n.jsx(Un,{className:"w-4 h-4"}),"Добавить слот"]})}),f!==null&&n.jsx("button",{onClick:ne,className:`w-full sm:w-auto px-4 py-2 rounded-lg border ${a==="dark"?"border-gray-700 text-gray-200 hover:bg-gray-700":"border-gray-300 text-gray-800 hover:bg-gray-100"}`,children:"Отмена"})]})]}),n.jsx("div",{className:"space-y-3",children:b.map((z,oe)=>n.jsxs("div",{className:`flex flex-col gap-2 p-3 rounded-lg ${a==="dark"?"bg-gray-700":"bg-gray-100"}`,children:[n.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[n.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[n.jsxs("span",{className:l,children:[z.start," - ",z.end]}),z.endDate&&n.jsxs("span",{className:`text-xs px-2 py-0.5 rounded-full ${a==="dark"?"bg-blue-500/20 text-blue-400 border border-blue-500/30":"bg-blue-100 text-blue-700 border border-blue-300"}`,children:["до ",me(new Date(z.endDate),"dd.MM.yyyy")]})]}),n.jsxs("div",{className:"flex items-center gap-1",children:[n.jsx("button",{onClick:()=>ae(oe),className:"p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors flex-shrink-0",title:"Редактировать слот",children:n.jsx(zt,{className:"w-4 h-4"})}),n.jsx("button",{onClick:()=>He(oe),className:"p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-shrink-0",title:"Удалить слот",children:n.jsx(It,{className:"w-4 h-4"})})]})]}),z.breaks&&z.breaks.length>0&&n.jsxs("div",{className:"ml-4 space-y-1",children:[n.jsx("span",{className:`text-xs ${a==="dark"?"text-gray-400":"text-gray-600"}`,children:"Перерывы:"}),z.breaks.map((Te,De)=>$===oe&&se===De?null:n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsxs("span",{className:`text-sm ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:[Te.start," - ",Te.end]}),n.jsxs("div",{className:"flex gap-1",children:[n.jsx("button",{onClick:()=>Ye(oe,De),className:"p-1 text-blue-400 hover:bg-blue-400 hover:text-white rounded transition-colors",title:"Редактировать перерыв",children:n.jsx(zt,{className:"w-3 h-3"})}),n.jsx("button",{onClick:()=>yt(oe,De),className:"p-1 text-red-400 hover:bg-red-400 hover:text-white rounded transition-colors",title:"Удалить перерыв",children:n.jsx(Xt,{className:"w-3 h-3"})})]})]},De))]}),n.jsx("div",{className:"ml-4 space-y-2 border-t pt-2 border-gray-500 border-opacity-30",children:k===oe?n.jsxs("div",{className:"space-y-2",children:[n.jsxs("div",{className:"flex gap-2",children:[n.jsx("input",{type:"time",value:Z,onChange:Te=>j(Te.target.value),className:`flex-1 px-3 py-1.5 text-sm rounded-lg border ${a==="dark"?"bg-gray-600 border-gray-500 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Начало"}),n.jsx("input",{type:"time",value:y,onChange:Te=>v(Te.target.value),className:`flex-1 px-3 py-1.5 text-sm rounded-lg border ${a==="dark"?"bg-gray-600 border-gray-500 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Конец"})]}),n.jsxs("div",{className:"flex gap-2",children:[n.jsx("button",{onClick:()=>be(oe),className:"flex-1 px-3 py-1.5 text-sm bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors",children:$===oe&&se!==null?"Сохранить":"Добавить перерыв"}),n.jsx("button",{onClick:at,className:"px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors",children:"Отмена"})]})]}):n.jsxs("button",{onClick:()=>{p(oe),j(""),v(""),q(null),B(null),D("")},className:"w-full px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1",children:[n.jsx(Un,{className:"w-3 h-3"}),"Добавить перерыв"]})})]},oe))}),b.length>0&&n.jsxs("p",{className:`text-sm mt-2 ${a==="dark"?"text-gray-400":"text-gray-600"}`,children:["Всего часов: ",Gi(b).toFixed(1)]})]}),(!Oe||ye==="single")&&n.jsxs("div",{className:"space-y-3",children:[n.jsxs("label",{className:"flex items-center gap-2",children:[n.jsx("input",{type:"checkbox",checked:re,onChange:z=>{if(z.target.checked&&xe){D("Снимите галочку с другой функции");return}he(z.target.checked),D("")},className:"w-4 h-4"}),n.jsx("span",{className:`${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Добавить аналогичные слоты на месяц вперед"})]}),re&&n.jsxs("div",{className:"ml-6",children:[n.jsx("p",{className:`text-sm mb-2 ${a==="dark"?"text-gray-400":"text-gray-600"}`,children:"Выберите день недели:"}),n.jsx("div",{className:"flex gap-2 flex-wrap",children:Ue.map((z,oe)=>n.jsx("button",{onClick:()=>dt(oe),className:`px-3 py-1 rounded-lg transition-colors ${K.includes(oe)?"bg-[#4E6E49] text-white":a==="dark"?"bg-gray-700 text-gray-300":"bg-gray-200 text-gray-700"}`,children:z},oe))})]}),n.jsxs("label",{className:"flex items-center gap-2",children:[n.jsx("input",{type:"checkbox",checked:xe,onChange:z=>{if(z.target.checked&&re){D("Снимите галочку с другой функции");return}we(z.target.checked),D("")},className:"w-4 h-4"}),n.jsx("span",{className:`${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Установить время работы на все выбранные дни"})]}),xe&&n.jsxs("div",{className:"ml-6",children:[n.jsx("p",{className:`text-sm mb-2 ${a==="dark"?"text-gray-400":"text-gray-600"}`,children:"Выберите дни недели:"}),n.jsx("div",{className:"flex gap-2 flex-wrap",children:Ue.map((z,oe)=>n.jsx("button",{onClick:()=>Me(oe),className:`px-3 py-1 rounded-lg transition-colors ${H.includes(oe)?"bg-[#4E6E49] text-white":a==="dark"?"bg-gray-700 text-gray-300":"bg-gray-200 text-gray-700"}`,children:z},oe))})]})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:"Комментарий"}),n.jsx("textarea",{value:Y,onChange:z=>ce(z.target.value),rows:3,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation resize-y ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Добавьте комментарий (необязательно)"})]}),de&&n.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:de}),n.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2",children:[n.jsx("button",{onClick:z=>{console.log("Save button clicked!",{loading:ue,slotsCount:b.length,disabled:ue||b.length===0}),z.preventDefault(),_t()},disabled:ue||b.length===0,className:"flex-1 px-4 py-2.5 sm:py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100",children:ue?"Сохранение...":"Сохранить"}),n.jsx("button",{onClick:e,className:`px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 ${a==="dark"?"bg-gray-700 hover:bg-gray-600 active:bg-gray-500":"bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}`,children:"Отмена"})]})]})]})]})})})},fk=({type:r,status:e,onClose:t,onSave:s})=>{const{user:a}=At(),{theme:i}=Ze(),{isAdmin:l}=Vt(),c=i==="dark"?"text-white":"text-gray-900",d=(e==null?void 0:e.date)||me(new Date,"yyyy-MM-dd"),[h,m]=A.useState(e!=null&&e.userId?[e.userId]:a!=null&&a.id?[a.id]:[]),[x,b]=A.useState(d),[I,N]=A.useState((e==null?void 0:e.endDate)||d),[T,E]=A.useState(!!(e!=null&&e.endDate)),[P,O]=A.useState((e==null?void 0:e.comment)||""),[C,M]=A.useState(""),[ee,Z]=A.useState(!1),[j,y]=A.useState("single"),[v,f]=A.useState(d),[_,k]=A.useState(d),[p,$]=A.useState(d),[q,se]=A.useState([]),B=l&&!e;gn(),A.useEffect(()=>{T||N(x)},[T,x]),A.useEffect(()=>{B&&j!=="single"&&E(!1)},[B,j]);const Y=R=>{m(L=>L.includes(R)?L.filter(ge=>ge!==R):[...L,R])},ce=()=>{h.length===Ne.length?m([]):m(Ne.map(R=>R.id))},re=()=>{if(!p)return;const R=Ag([...q,p]);se(R),$("")},he=R=>{se(L=>L.filter(ge=>ge!==R))},K=()=>e?[e.userId]:B?h:l&&!a?h.length>0?h:[]:a!=null&&a.id?[a.id]:[],G=R=>{var L;return((L=Ne.find(ge=>ge.id===R))==null?void 0:L.name)||R},xe=()=>{if(B){if(j==="range")return r==="dayoff"?Sg(v,_).map(L=>({date:L})):v&&_?[{date:v,endDate:_}]:[];if(j==="multiple")return r==="dayoff"?q.map(L=>({date:L})):q.map(L=>({date:L,endDate:L}))}const R={date:x};return r!=="dayoff"&&(T||e!=null&&e.endDate)&&(R.endDate=I),[R]},we=async(R,L,ge)=>{if(!l&&!a)return"Пользователь не найден";const pe=new Date,U=new Date(L),S=new Date(ge||L);if(r==="dayoff"&&dk(U,pe))return"Нельзя установить выходной на сегодня. Выберите смену или возьмите больничный.";if(r==="sick"){const Q=new Date;Q.setHours(0,0,0,0);const de=new Date(Q);de.setDate(de.getDate()+2);const D=new Date(L);if(D.setHours(0,0,0,0),D<Q||D>de)return"Больничный можно взять только на актуальную дату и + 2 суток. Нельзя выбрать заранее.";const ue=Math.ceil((S.getTime()-U.getTime())/(1e3*60*60*24))+1;if(ue<1)return"Больничный должен быть минимум на 1 день";if(ue>14)return"Больничный может длиться не более 14 календарных дней в месяце";const je=new Date(U.getFullYear(),U.getMonth(),1),Ue=new Date(U.getFullYear(),U.getMonth()+1,0);if((await Rr(R)).filter(ae=>ae.type==="sick"&&ae.date>=me(je,"yyyy-MM-dd")&&ae.date<=me(Ue,"yyyy-MM-dd")).length+ue>14)return"Больничный ограничен 14 днями в месяц"}if(r==="vacation"){if(Math.ceil((S.getTime()-U.getTime())/864e5)+1>14)return"Отпуск не может быть больше 14 дней в месяце";const de=new Date(U.getFullYear(),0,1),D=new Date(U.getFullYear(),11,31);if((await Rr(R)).filter(Ue=>Ue.type==="vacation"&&Ue.date>=me(de,"yyyy-MM-dd")&&Ue.date<=me(D,"yyyy-MM-dd")).length>=6)return"Не более 6 отпусков в год"}if(r==="dayoff"){const Q=new Date(U);Q.setDate(Q.getDate()-Q.getDay()+1);const de=new Date(Q);de.setDate(Q.getDate()+6);let ue=(await Rr(R)).filter(F=>F.type==="dayoff"&&F.date>=me(Q,"yyyy-MM-dd")&&F.date<=me(de,"yyyy-MM-dd"));if(e&&(ue=ue.filter(F=>F.id!==e.id)),ue.length>=2)return"Выходные на неделе ограничены максимум 2 днями";const Ue=(await Rr()).filter(F=>F.type==="dayoff"&&F.date===L),Oe=new Set(Ue.map(F=>F.userId));if(e&&e.type==="dayoff"&&e.date===L&&Oe.delete(e.userId),Oe.size>=3)return"На этот день уже установлено максимальное количество выходных (3 человека). Выберите другую дату."}return null},H=async()=>{if(console.log("handleSave called (DayStatusForm)"),!l&&!a){console.log("No user found"),M("Пользователь не найден");return}if(e&&!l&&a&&e.userId!==a.id){M("Вы можете редактировать только свои статусы"),Z(!1);return}const R=K();if(R.length===0){M("Выберите хотя бы одного участника");return}const L=xe();if(L.length===0){M("Выберите даты");return}const ge=async(pe,U)=>{const S=await we(pe,U.date,U.endDate);if(S)throw new Error(`[${G(pe)} • ${me(U.date,"dd.MM.yyyy")}] ${S}`);const Q={userId:pe,date:U.date,type:r,...U.endDate&&{endDate:U.endDate},...P&&{comment:P}};e?await L1(e.id,Q):await V1(Q)};console.log("Starting save process..."),M(""),Z(!0);try{if(e){const pe={date:x};r!=="dayoff"&&(T||e.endDate)&&(pe.endDate=I),await ge(e.userId,pe),s();return}for(const pe of R)for(const U of L)await ge(pe,U);s()}catch(pe){console.error("Error saving day status:",pe);const U=pe.message||pe.code||"Ошибка при сохранении";M(U)}finally{Z(!1)}},_e={dayoff:"Выходной",sick:"Больничный",vacation:"Отпуск"},ye={dayoff:"bg-yellow-500",sick:"bg-purple-500",vacation:"bg-orange-500"},Ee=B&&j==="range"?[`${me(v,"dd.MM")}–${me(_,"dd.MM")}`]:B&&j==="multiple"?q.map(R=>me(R,"dd.MM")):[me(x,"dd.MM")],X=h.map(R=>G(R)).join(", ");return n.jsx("div",{className:"fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 touch-manipulation overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll",children:n.jsxs("div",{className:`w-full max-w-4xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${i==="dark"?"bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10":"bg-gradient-to-br from-white via-slate-50 to-white border-slate-200"} max-h-[85dvh] sm:max-h-[calc(100dvh-96px)] flex flex-col overflow-hidden`,children:[n.jsx("div",{className:"flex-shrink-0 p-4 sm:p-6 lg:p-7",children:n.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[n.jsxs("div",{className:"space-y-1",children:[n.jsxs("div",{className:"flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4E6E49] font-semibold",children:[n.jsx("span",{className:"inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30",children:_e[r]}),n.jsx("span",{className:`${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"расписание"})]}),n.jsxs("h3",{className:`text-2xl sm:text-3xl font-bold ${c}`,children:[e?"Редактировать":"Добавить"," ",_e[r]]}),n.jsx("p",{className:`${i==="dark"?"text-gray-400":"text-gray-600"} text-sm`,children:"Обновленная модалка: быстрый обзор выбранных людей, дат и комментария."})]}),n.jsx("button",{onClick:t,className:`p-2.5 rounded-full border flex-shrink-0 ${i==="dark"?"border-white/10 text-gray-200 hover:bg-white/5":"border-slate-200 text-slate-600 hover:bg-slate-100"}`,"aria-label":"Закрыть",children:n.jsx(Xt,{className:"w-5 h-5"})})]})}),n.jsx("div",{className:"flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll px-4 sm:px-6 lg:px-7",children:n.jsxs("div",{className:"mt-5 grid lg:grid-cols-[0.9fr_1.4fr] gap-4 lg:gap-6 min-w-0",children:[n.jsxs("aside",{className:`rounded-2xl border ${i==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-white"} p-4 sm:p-5 space-y-4 self-start`,children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("p",{className:"text-sm font-semibold",children:"Навигация"}),n.jsx("span",{className:"text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold",children:"3 шага"})]}),n.jsx("div",{className:"space-y-2",children:[{label:"Участники",detail:X||"Не выбрано",done:h.length>0||!!e},{label:"Даты",detail:Ee.slice(0,2).join(" · "),done:Ee.length>0},{label:"Комментарий",detail:P?"Заполнен":"Необязателен",done:!!P}].map((R,L)=>n.jsxs("div",{className:`flex items-start gap-3 rounded-xl border px-3 py-3 ${i==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`,children:[n.jsx("span",{className:`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${R.done?"bg-[#4E6E49] text-white":i==="dark"?"bg-slate-800 text-gray-300":"bg-slate-200 text-slate-700"}`,children:L+1}),n.jsxs("div",{className:"flex-1",children:[n.jsx("p",{className:"text-sm font-semibold",children:R.label}),n.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 truncate",children:R.detail||"—"})]})]},R.label))}),n.jsxs("div",{className:`rounded-xl border px-3 py-3 space-y-2 ${i==="dark"?"border-emerald-900/50 bg-emerald-900/20":"border-emerald-100 bg-emerald-50"}`,children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-emerald-600 font-semibold",children:"Подсказка"}),n.jsx("p",{className:"text-sm text-emerald-700 dark:text-emerald-200",children:"Визуальные блоки помогают не потеряться между диапазоном дат и выбором команды."})]})]}),n.jsxs("div",{className:"space-y-4 overflow-y-auto overscroll-contain pr-1 pb-6 flex-1 min-h-0",children:[B&&n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Участники"}),n.jsxs("div",{className:"space-y-3",children:[n.jsx("div",{className:"flex flex-wrap gap-2",children:Ne.map(R=>n.jsxs("label",{className:`px-3 py-1.5 rounded-full border cursor-pointer text-sm flex items-center gap-2 ${h.includes(R.id)?"bg-[#4E6E49] border-[#4E6E49] text-white":i==="dark"?"bg-gray-700 border-gray-800 text-gray-200":"bg-gray-100 border-gray-300 text-gray-700"}`,children:[n.jsx("input",{type:"checkbox",checked:h.includes(R.id),onChange:()=>Y(R.id),className:"hidden"}),R.name]},R.id))}),n.jsx("button",{type:"button",onClick:ce,className:"text-sm text-[#4E6E49] hover:text-[#4E6E49]",children:h.length===Ne.length?"Снять выделение":"Выбрать всех"})]})]}),B&&n.jsxs("div",{children:[n.jsx("p",{className:`text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Формат выбора дат"}),n.jsx("div",{className:"flex flex-wrap gap-4",children:[{value:"single",label:"Один день"},{value:"range",label:r==="dayoff"?"Диапазон (каждый день)":"Диапазон дат"},{value:"multiple",label:"Конкретные даты"}].map(R=>n.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[n.jsx("input",{type:"radio",value:R.value,checked:j===R.value,onChange:L=>y(L.target.value)}),n.jsx("span",{className:i==="dark"?"text-gray-200":"text-gray-700",children:R.label})]},R.value))})]}),(!B||j==="single")&&n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Дата начала"}),n.jsx("input",{type:"date",value:x,onChange:R=>b(R.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),B&&j==="range"&&n.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Начало"}),n.jsx("input",{type:"date",value:v,onChange:R=>f(R.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Конец"}),n.jsx("input",{type:"date",value:_,min:v,onChange:R=>k(R.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]})]}),B&&j==="multiple"&&n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Выбранные даты"}),n.jsxs("div",{className:"flex flex-col gap-3",children:[n.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[n.jsx("input",{type:"date",value:p,onChange:R=>$(R.target.value),className:`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}),n.jsx("button",{type:"button",onClick:re,className:"px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors",children:"Добавить"})]}),q.length>0?n.jsx("div",{className:"flex flex-wrap gap-2",children:q.map(R=>n.jsxs("span",{className:"inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm",children:[me(R,"dd.MM.yyyy"),n.jsx("button",{type:"button",onClick:()=>he(R),className:"text-red-500 hover:text-red-600",children:"x"})]},R))}):n.jsx("p",{className:"text-sm text-gray-500",children:"Пока не выбрано ни одной даты"})]})]}),(r==="sick"||r==="vacation")&&(!B||j==="single")&&n.jsxs("label",{className:"flex items-center gap-2",children:[n.jsx("input",{type:"checkbox",checked:T,onChange:R=>E(R.target.checked),className:"w-4 h-4"}),n.jsx("span",{className:`${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Несколько дней"})]}),T&&n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Дата окончания"}),n.jsx("input",{type:"date",value:I,onChange:R=>N(R.target.value),min:x,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Комментарий"}),n.jsx("textarea",{value:P,onChange:R=>O(R.target.value),rows:3,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation resize-y ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Добавьте комментарий (необязательно)"})]}),C&&n.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:C}),n.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2",children:[n.jsx("button",{onClick:H,disabled:ee,className:`flex-1 px-4 py-2.5 sm:py-2 ${ye[r]} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100`,children:ee?"Сохранение...":"Сохранить"}),n.jsx("button",{onClick:t,className:`px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 ${i==="dark"?"bg-gray-700 hover:bg-gray-600 active:bg-gray-500":"bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}`,children:"Отмена"})]})]})]})})]})})},xk=({onClose:r,onSave:e})=>{const{user:t}=At(),{theme:s}=Ze(),{isAdmin:a}=Vt(),i=s==="dark"?"text-white":"text-gray-900",[l,c]=A.useState(a?[]:t!=null&&t.id?[t.id]:[]),[d,h]=A.useState(!1),[m,x]=A.useState(!1),[b,I]=A.useState(!1),[N,T]=A.useState([]),[E,P]=A.useState([]),[O,C]=A.useState(""),[M,ee]=A.useState(""),[Z,j]=A.useState(""),[y,v]=A.useState(""),[f,_]=A.useState(!1);gn();const k=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],p=d?"По дню недели":m?"По датам":b?"Диапазон":"Не выбран",$=d?N.length>0?N.map(G=>k[G]).join(", "):"Дни недели":m?E[0]?`${me(E[0],"dd.MM")} +${Math.max(E.length-1,0)}`:"Добавьте даты":b?M&&Z?`${me(M,"dd.MM")}–${me(Z,"dd.MM")}`:"Укажите диапазон":"Выберите режим",q=l.map(G=>{var xe;return((xe=Ne.find(we=>we.id===G))==null?void 0:xe.name)||G}).join(", "),se=G=>{if(G){if(m||b){v("Снимите галочку с другой функции, чтобы активировать эту");return}h(!0),v("")}else h(!1),T([])},B=G=>{if(G){if(d||b){v("Снимите галочку с другой функции, чтобы активировать эту");return}x(!0),v("")}else x(!1),P([]),C("")},Y=G=>{if(G){if(d||m){v("Снимите галочку с другой функции, чтобы активировать эту");return}I(!0),v("")}else I(!1),ee(""),j("")},ce=G=>{l.includes(G)?c(l.filter(xe=>xe!==G)):c([...l,G])},re=()=>{if(!O){v("Выберите дату");return}if(E.includes(O)){v("Эта дата уже добавлена");return}P([...E,O].sort()),C(""),v("")},he=G=>{P(E.filter(xe=>xe!==G))},K=async()=>{var xe;if(!a&&!t){v("Пользователь не найден");return}const G=a?l:t?[t.id]:[];if(G.length===0){v("Выберите хотя бы одного участника");return}if(!d&&!m&&!b){v("Выберите способ удаления слотов");return}if(d&&N.length===0){v("Выберите день недели");return}if(m&&E.length===0){v("Добавьте хотя бы одну дату");return}if(b){if(!M||!Z){v("Укажите начальную и конечную дату диапазона");return}if(M>Z){v("Начальная дата должна быть раньше конечной");return}}v(""),_(!0);try{const we=G.map(L=>Fr(L)),_e=(await Promise.all(we)).flat();let ye=[];if(d?ye=_e.filter(L=>{const ge=new Date(L.date+"T00:00:00"),pe=ge.getDay()===0?6:ge.getDay()-1;return N.includes(pe)}).map(L=>L.id):m?ye=_e.filter(L=>E.includes(L.date)).map(L=>L.id):b&&(ye=_e.filter(L=>L.date>=M&&L.date<=Z).map(L=>L.id)),ye.length===0){v("Слоты для удаления не найдены"),_(!1);return}const Ee=G.length>1?`${G.length} участников`:((xe=Ne.find(L=>L.id===G[0]))==null?void 0:xe.name)||"участника",X=N.map(L=>k[L]).join(", "),R=d?`Удалить все слоты ${Ee} на ${X}? (${ye.length} слотов)`:b?`Удалить все слоты ${Ee} с ${me(M,"dd.MM.yyyy")} по ${me(Z,"dd.MM.yyyy")}? (${ye.length} слотов)`:`Удалить слоты ${Ee} на выбранные даты? (${ye.length} слотов)`;if(!confirm(R)){_(!1);return}await Promise.all(ye.map(L=>ec(L))),e()}catch(we){console.error("Error deleting slots:",we);const H=we.message||we.code||"Ошибка при удалении слотов";v(H)}finally{_(!1)}};return n.jsx("div",{className:"fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll",children:n.jsxs("div",{className:`w-full max-w-5xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${s==="dark"?"bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10":"bg-gradient-to-br from-white via-slate-50 to-white border-slate-200"} max-h-[85dvh] sm:max-h-[calc(100dvh-96px)] flex flex-col overflow-hidden`,children:[n.jsx("div",{className:"flex-shrink-0 p-5 sm:p-6 lg:p-7",children:n.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[n.jsxs("div",{className:"space-y-1",children:[n.jsxs("div",{className:"flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4E6E49] font-semibold",children:[n.jsx("span",{className:"inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30",children:"Очистка"}),n.jsx("span",{className:`${s==="dark"?"text-gray-400":"text-gray-500"}`,children:"расписание"})]}),n.jsx("h3",{className:`text-2xl sm:text-3xl font-bold ${i}`,children:"Удаление слотов"}),n.jsx("p",{className:`${s==="dark"?"text-gray-400":"text-gray-600"} text-sm`,children:"Новый обзор: режим удаления, выбранные люди и диапазон видны сразу."})]}),n.jsx("button",{onClick:r,className:`p-2.5 rounded-full border flex-shrink-0 ${s==="dark"?"border-white/10 text-gray-200 hover:bg-white/5":"border-slate-200 text-slate-600 hover:bg-slate-100"}`,"aria-label":"Закрыть",children:n.jsx(Xt,{className:"w-5 h-5"})})]})}),n.jsx("div",{className:"flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll px-5 sm:px-6 lg:px-7",children:n.jsxs("div",{className:"mt-5 grid lg:grid-cols-[0.95fr_1.45fr] gap-4 lg:gap-6 min-w-0",children:[n.jsxs("aside",{className:`rounded-2xl border ${s==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-white"} p-4 sm:p-5 space-y-4 self-start`,children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("p",{className:"text-sm font-semibold",children:"Навигация"}),n.jsx("span",{className:"text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold",children:"3 шага"})]}),n.jsx("div",{className:"space-y-2",children:[{label:"Участники",detail:q||"Не выбрано",done:l.length>0||!a},{label:"Режим",detail:p,done:p!=="Не выбран"},{label:"Параметры",detail:$,done:$!=="Выберите режим"}].map((G,xe)=>n.jsxs("div",{className:`flex items-start gap-3 rounded-xl border px-3 py-3 ${s==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`,children:[n.jsx("span",{className:`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${G.done?"bg-[#4E6E49] text-white":s==="dark"?"bg-slate-800 text-gray-300":"bg-slate-200 text-slate-700"}`,children:xe+1}),n.jsxs("div",{className:"flex-1",children:[n.jsx("p",{className:"text-sm font-semibold",children:G.label}),n.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 truncate",children:G.detail||"—"})]})]},G.label))}),n.jsxs("div",{className:`rounded-xl border px-3 py-3 space-y-2 ${s==="dark"?"border-emerald-900/50 bg-emerald-900/20":"border-emerald-100 bg-emerald-50"}`,children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-emerald-600 font-semibold",children:"Подсказка"}),n.jsx("p",{className:"text-sm text-emerald-700 dark:text-emerald-200",children:"Выберите только один способ удаления: по дню, по списку дат или по диапазону."})]})]}),n.jsxs("div",{className:"space-y-4 overflow-y-auto overscroll-contain pr-1 pb-6 flex-1 min-h-0",children:[a&&n.jsxs("div",{children:[n.jsxs("label",{className:`block text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:["Участники ",l.length>0&&`(${l.length} выбрано)`]}),n.jsx("div",{className:"flex flex-wrap gap-2",children:Ne.map(G=>{const xe=l.includes(G.id);return n.jsx("button",{onClick:()=>ce(G.id),className:`px-3 py-1.5 rounded-lg transition-colors ${xe?"bg-red-500 text-white":s==="dark"?"bg-gray-700 text-gray-300 hover:bg-gray-600":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,children:G.name},G.id)})})]}),n.jsxs("label",{className:"flex items-center gap-2",children:[n.jsx("input",{type:"checkbox",checked:d,onChange:G=>se(G.target.checked),className:"w-4 h-4"}),n.jsx("span",{className:`${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Удалить по дню недели"})]}),d&&n.jsxs("div",{className:"ml-6",children:[n.jsx("p",{className:`text-sm mb-2 ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:"Выберите дни недели:"}),n.jsx("div",{className:"flex gap-2 flex-wrap",children:k.map((G,xe)=>{const we=N.includes(xe);return n.jsx("button",{onClick:()=>{T(H=>H.includes(xe)?H.filter(_e=>_e!==xe):[...H,xe])},className:`px-3 py-1 rounded-lg transition-colors ${we?"bg-red-500 text-white":s==="dark"?"bg-gray-700 text-gray-300":"bg-gray-200 text-gray-700"}`,children:G},xe)})})]}),n.jsxs("label",{className:"flex items-center gap-2",children:[n.jsx("input",{type:"checkbox",checked:m,onChange:G=>B(G.target.checked),className:"w-4 h-4"}),n.jsx("span",{className:`${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Удалить по конкретным датам"})]}),m&&n.jsxs("div",{className:"ml-6 space-y-3",children:[n.jsxs("div",{className:"flex gap-2",children:[n.jsx("input",{type:"date",value:O,onChange:G=>C(G.target.value),className:`flex-1 px-4 py-2 rounded-lg border ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-red-500`}),n.jsx("button",{onClick:re,className:"px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors",children:"Добавить"})]}),E.length>0&&n.jsxs("div",{className:"space-y-2",children:[n.jsxs("p",{className:`text-sm ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:["Выбранные даты (",E.length,"):"]}),n.jsx("div",{className:"flex flex-wrap gap-2",children:E.map(G=>n.jsxs("div",{className:`flex items-center gap-2 px-3 py-1 rounded-lg ${s==="dark"?"bg-gray-700":"bg-gray-100"}`,children:[n.jsx("span",{className:i,children:me(G,"dd.MM.yyyy")}),n.jsx("button",{onClick:()=>he(G),className:"p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors",children:n.jsx(Xt,{className:"w-3 h-3"})})]},G))})]})]}),n.jsxs("label",{className:"flex items-center gap-2",children:[n.jsx("input",{type:"checkbox",checked:b,onChange:G=>Y(G.target.checked),className:"w-4 h-4"}),n.jsx("span",{className:`${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Удалить по диапазону дат"})]}),b&&n.jsxs("div",{className:"ml-6 space-y-3",children:[n.jsxs("div",{className:"flex gap-2",children:[n.jsxs("div",{className:"flex-1",children:[n.jsx("label",{className:`block text-xs mb-1 ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:"Начальная дата"}),n.jsx("input",{type:"date",value:M,onChange:G=>ee(G.target.value),className:`w-full px-4 py-2 rounded-lg border ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-red-500`})]}),n.jsxs("div",{className:"flex-1",children:[n.jsx("label",{className:`block text-xs mb-1 ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:"Конечная дата"}),n.jsx("input",{type:"date",value:Z,onChange:G=>j(G.target.value),min:M,className:`w-full px-4 py-2 rounded-lg border ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-red-500`})]})]}),M&&Z&&n.jsxs("p",{className:`text-sm ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:["Будет удалено: с ",me(M,"dd.MM.yyyy")," по ",me(Z,"dd.MM.yyyy")]})]}),y&&n.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:y}),n.jsxs("div",{className:"flex gap-3",children:[n.jsxs("button",{onClick:K,disabled:f||!d&&!m&&!b,className:"flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2",children:[n.jsx(It,{className:"w-4 h-4"}),f?"Удаление...":"Удалить слоты"]}),n.jsx("button",{onClick:r,className:`px-4 py-2 rounded-lg transition-colors ${s==="dark"?"bg-gray-700 hover:bg-gray-600":"bg-gray-200 hover:bg-gray-300"}`,children:"Отмена"})]})]})]})})]})})},yk=()=>{const{theme:r}=Ze(),[e,t]=A.useState("table"),[s,a]=A.useState("all"),[i,l]=A.useState(!1),[c,d]=A.useState(!1),[h,m]=A.useState(!1),[x,b]=A.useState(null),[I,N]=A.useState(null),[T,E]=A.useState(null),[P,O]=A.useState(null),[C,M]=A.useState("add-slot"),[ee,Z]=A.useState({slotsThisWeek:0,activeMembers:0,upcomingSlots:0,completedSlots:0,recommendedToAdd:0,topMembers:[]}),[j,y]=A.useState(!1);A.useEffect(()=>{_()},[]),A.useEffect(()=>{const K=window.matchMedia("(max-width: 1023px)"),G=we=>{y(we.matches)};G(K);const xe=we=>G(we);return K.addEventListener("change",xe),()=>K.removeEventListener("change",xe)},[]),A.useEffect(()=>{j&&e==="table"&&t("week")},[j,e]);const v=K=>{const G=new Date;G.setHours(0,0,0,0);const xe=new Date(K.date);if(xe.setHours(0,0,0,0),xe>G)return!0;if(xe.getTime()===G.getTime()){const H=new Date,_e=H.getHours()*60+H.getMinutes();return K.slots.some(ye=>{if(ye.endDate){const L=new Date(ye.endDate);if(L.setHours(0,0,0,0),L>G)return!0;if(L.getTime()===G.getTime()){const[ge,pe]=ye.end.split(":").map(Number);return ge*60+pe>_e}return!1}const[Ee,X]=ye.end.split(":").map(Number);return Ee*60+X>_e})}return K.slots.some(H=>{if(H.endDate){const _e=new Date(H.endDate);return _e.setHours(0,0,0,0),_e>=G}return!1})},f=K=>{var G;return((G=Ne.find(xe=>xe.id===K))==null?void 0:G.name)||K},_=async()=>{try{const K=rc(new Date),G=me(K[0],"yyyy-MM-dd"),xe=me(K[6],"yyyy-MM-dd"),[we,H]=await Promise.all([Fr(),Rr()]),_e=we.filter(pe=>pe.date>=G&&pe.date<=xe),ye=new Set([..._e.map(pe=>pe.userId),...H.map(pe=>pe.userId)]),Ee=_e.filter(v).length,X=_e.length-Ee,R=Math.max(0,10-_e.length),L={};_e.forEach(pe=>{L[pe.userId]=(L[pe.userId]||0)+1});const ge=Object.entries(L).sort((pe,U)=>U[1]-pe[1]).slice(0,3).map(([pe])=>f(pe));Z({slotsThisWeek:_e.length,activeMembers:ye.size,upcomingSlots:Ee,completedSlots:X,recommendedToAdd:R,topMembers:ge})}catch(K){console.error("Error loading stats:",K)}},k=()=>{E(null),l(!0)},p=K=>{E(K),l(!0)},$=K=>{b(K),O(null),m(!0)},q=K=>{O(K),b(K.type),m(!0)},se=()=>{d(!0)},B=()=>{l(!1),d(!1),m(!1),b(null),E(null),O(null),setTimeout(()=>{window.location.reload()},500)},Y=r==="dark"?"text-white":"text-gray-900",ce=r==="dark"?"text-gray-300":"text-gray-700",re=`rounded-xl sm:rounded-2xl p-4 sm:p-5 border ${r==="dark"?"bg-[#0A0A0A]/40 border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)]":"bg-white border-gray-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"}`,he=K=>{if(K==="table"&&j){alert("Этот вид недоступен на мобильных устройствах. Пожалуйста, воспользуйтесь ПК.");return}t(K)};return n.jsx(sr,{children:n.jsxs("div",{className:"space-y-5 sm:space-y-7",children:[n.jsxs("div",{className:`relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-7 border-2 shadow-2xl ${r==="dark"?"bg-gradient-to-br from-[#0b0f17] via-[#0f1b2d] to-[#0b0f17] border-[#4E6E49]/30":"bg-gradient-to-br from-white via-green-50/60 to-white border-green-200"}`,children:[n.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[n.jsx("div",{className:"absolute -top-32 -left-16 w-80 h-80 bg-gradient-to-br from-[#4E6E49]/24 via-transparent to-transparent blur-3xl"}),n.jsx("div",{className:"absolute top-0 right-0 w-[26rem] h-[26rem] bg-gradient-to-bl from-blue-500/18 via-purple-500/12 to-transparent blur-3xl"}),n.jsx("div",{className:"absolute bottom-[-140px] left-14 w-80 h-80 bg-gradient-to-tr from-amber-300/14 via-[#4E6E49]/12 to-transparent blur-3xl"})]}),n.jsx("div",{className:"relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] items-start",children:n.jsxs("div",{className:"flex flex-col gap-4",children:[n.jsxs("div",{className:"flex items-start gap-3",children:[n.jsx("div",{className:"p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg",children:n.jsx(zc,{className:"w-7 h-7 text-[#4E6E49]"})}),n.jsxs("div",{className:"space-y-2",children:[n.jsx("h1",{className:`text-3xl sm:text-4xl font-extrabold ${Y}`,children:"Расписание команды"}),n.jsx("p",{className:`${ce} text-sm sm:text-base leading-snug max-w-2xl`,children:"Здесь можно управлять слотами, сменами и статусами."})]})]}),n.jsx("div",{className:`rounded-2xl border p-4 sm:p-5 backdrop-blur ${r==="dark"?"border-white/10 bg-white/5":"border-green-100 bg-white/80"}`,children:n.jsxs("div",{className:"grid sm:grid-cols-3 gap-4",children:[n.jsxs("div",{className:"space-y-2",children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-[#4E6E49] font-semibold",children:"Рекомендуется добавить"}),n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsxs("span",{className:"p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-200 border border-emerald-500/30",children:["+",ee.recommendedToAdd]}),n.jsx("p",{className:`text-sm ${ce}`,children:"минимум 10 слотов в неделю"})]})]}),n.jsxs("div",{className:"space-y-2",children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-sky-500 font-semibold",children:"Завершено слотов"}),n.jsx("p",{className:"text-3xl font-black text-slate-900 dark:text-white",children:ee.completedSlots}),n.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400",children:"на этой неделе"})]}),n.jsxs("div",{className:"space-y-2",children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-purple-500 font-semibold",children:"Активные участники"}),n.jsx("div",{className:"flex flex-wrap gap-2",children:ee.topMembers.length>0?ee.topMembers.map(K=>n.jsx("span",{className:"px-3 py-1 rounded-full text-xs font-semibold border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200",children:K},K)):n.jsx("span",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Нет данных"})})]})]})})]})})]}),n.jsxs("div",{className:`rounded-2xl border ${r==="dark"?"border-gray-800 bg-[#0f1623]":"border-gray-200 bg-white"} shadow-xl p-4 sm:p-5 space-y-5`,children:[n.jsx("div",{className:"space-y-3",children:n.jsxs("div",{className:"flex flex-wrap items-center gap-3 lg:justify-between",children:[n.jsxs("div",{className:`flex items-center gap-2 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-900/70":"border-gray-200 bg-gray-50"} px-1.5 py-1 shrink-0`,children:[n.jsxs("button",{onClick:()=>he("table"),"aria-disabled":j,className:`px-3 sm:px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all rounded-lg ${e==="table"&&!j?"bg-[#4E6E49] text-white shadow-lg":j?"text-gray-400 cursor-not-allowed":r==="dark"?"text-gray-300 hover:bg-gray-800":"text-gray-700 hover:bg-white"}`,children:[n.jsx(ed,{className:"w-4 h-4"}),"Таблица"]}),n.jsxs("button",{onClick:()=>he("week"),className:`px-3 sm:px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all rounded-lg ${e==="week"?"bg-[#4E6E49] text-white shadow-lg":r==="dark"?"text-gray-300 hover:bg-gray-800":"text-gray-700 hover:bg-white"}`,children:[n.jsx(Pr,{className:"w-4 h-4"}),"Неделя"]})]}),n.jsx("div",{className:"flex flex-wrap gap-2 shrink",children:[{key:"all",label:"Все",icon:n.jsx(Pr,{className:"w-4 h-4"})},{key:"upcoming",label:"Предстоящие",icon:n.jsx(ea,{className:"w-4 h-4"})},{key:"completed",label:"Завершённые",icon:n.jsx(zc,{className:"w-4 h-4"})}].map(K=>n.jsxs("button",{onClick:()=>a(K.key),className:`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border ${s===K.key?"bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white border-transparent shadow-lg":r==="dark"?"border-gray-800 bg-gray-900/70 text-gray-200 hover:border-[#4E6E49]/40":"border-gray-200 bg-gray-50 text-gray-700 hover:border-[#4E6E49]/40"}`,children:[K.icon,K.label]},K.key))})]})}),n.jsxs("div",{className:`rounded-2xl border ${r==="dark"?"border-gray-800 bg-gray-900/70":"border-gray-100 bg-gray-50"} p-3 sm:p-4 space-y-3`,children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("p",{className:`text-sm font-semibold ${Y}`,children:"Действие"}),n.jsx("span",{className:"text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400",children:"выбор задачи"})]}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2",children:[{key:"add-slot",label:"Добавить слот",desc:"Разовое или серия",icon:n.jsx(Yu,{className:"w-5 h-5"}),tone:"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800",action:k},{key:"delete-slots",label:"Удалить слоты",desc:"Очистить интервалы",icon:n.jsx(It,{className:"w-5 h-5"}),tone:"bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:border-rose-800",action:se},{key:"dayoff",label:"Выходной",desc:"Отметить отдых",icon:n.jsx(nl,{className:"w-5 h-5"}),tone:"bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-100 dark:border-teal-800",action:()=>$("dayoff")},{key:"sick",label:"Больничный",desc:"Подтвердить отсутствие",icon:n.jsx(sf,{className:"w-5 h-5"}),tone:"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-700",action:()=>$("sick")},{key:"vacation",label:"Отпуск",desc:"Запланировать отпуск",icon:n.jsx(Qu,{className:"w-5 h-5"}),tone:"bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-100 dark:border-sky-800",action:()=>$("vacation")}].map(K=>n.jsxs("button",{onClick:()=>{M(K.key),K.action()},className:`text-left rounded-xl border px-3 py-3 transition-all shadow-sm flex items-start gap-3 h-full ${C===K.key?`${K.tone} ring-2 ring-[#4E6E49]/50 shadow-lg`:`${r==="dark"?"border-gray-800 bg-gray-950/60 text-gray-100":"border-gray-200 bg-white text-gray-900"} hover:-translate-y-0.5 hover:shadow-md`}`,children:[n.jsx("span",{className:`p-2 rounded-lg ${C===K.key?"bg-white/30":r==="dark"?"bg-gray-800":"bg-gray-100"}`,children:K.icon}),n.jsxs("span",{className:"flex flex-col whitespace-normal leading-snug gap-0.5 w-full",children:[n.jsx("span",{className:"text-[13px] sm:text-sm font-semibold break-words leading-tight",children:K.label}),n.jsx("span",{className:"text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 break-words leading-tight",children:K.desc})]})]},K.key))})]}),n.jsxs("div",{className:"flex flex-col gap-2",children:[n.jsx("p",{className:`text-sm font-semibold ${Y}`,children:"Участники"}),n.jsxs("div",{className:"flex gap-2 overflow-x-auto pb-1",children:[n.jsx("button",{onClick:()=>N(null),className:`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition ${I===null?"bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white border-transparent shadow-lg":r==="dark"?"bg-gray-900/70 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`,children:"Все участники"}),Ne.map(K=>n.jsxs("button",{onClick:()=>N(K.id),className:`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition flex items-center gap-2 ${I===K.id?"bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white border-transparent shadow-lg":r==="dark"?"bg-gray-900/70 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`,children:[n.jsx("span",{className:"inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#4E6E49]/30 to-blue-500/30 text-xs font-bold",children:K.name.charAt(0)}),K.name]},K.id))]})]})]}),n.jsxs("div",{className:re,children:[n.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2 mb-4 text-left",children:[n.jsxs("div",{className:"text-left",children:[n.jsx("p",{className:`text-sm sm:text-base font-semibold ${Y}`,children:"Расписание"}),n.jsx("p",{className:`text-xs sm:text-sm ${ce}`,children:"Слоты и статусы за выбранную неделю"})]}),j&&n.jsx("span",{className:"text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300",children:"Мобильный вид"})]}),e==="table"?j?n.jsx("div",{className:`rounded-lg border-2 border-dashed p-4 text-center ${r==="dark"?"bg-[#1a1a1a]/60 border-gray-800 text-gray-300":"bg-gray-50 border-gray-200 text-gray-600"}`,children:n.jsxs("div",{className:"flex flex-col items-center gap-2",children:[n.jsx(ed,{className:`w-8 h-8 ${r==="dark"?"text-gray-400":"text-gray-500"}`}),n.jsx("p",{className:"text-sm font-semibold",children:"Табличный вид недоступен на мобильных устройствах"}),n.jsx("p",{className:"text-xs",children:"Откройте ApeVault Panel на ПК, чтобы использовать таблицу."})]})}):n.jsx(mk,{selectedUserId:I,slotFilter:s,onEditSlot:p,onEditStatus:q}):n.jsx(gk,{selectedUserId:I,slotFilter:s,onEditSlot:p,onEditStatus:q})]}),i&&n.jsx(pk,{slot:T,onClose:B,onSave:B}),c&&n.jsx(xk,{onClose:B,onSave:B}),h&&x&&n.jsx(fk,{type:x,status:P,onClose:B,onSave:B})]})})},Tn=.45,bk=({onClose:r,onSave:e,editingEarning:t})=>{var Ee,X;const{user:s}=At(),{isAdmin:a}=Vt(),{theme:i}=Ze(),l=i==="dark"?"text-white":"text-gray-900",c=!!t,[d,h]=A.useState((t==null?void 0:t.date)||me(new Date,"yyyy-MM-dd")),[m,x]=A.useState((t==null?void 0:t.slotId)||""),[b,I]=A.useState((t==null?void 0:t.amount.toString())||""),[N,T]=A.useState(((Ee=t==null?void 0:t.extraWalletsCount)==null?void 0:Ee.toString())||""),[E,P]=A.useState(((X=t==null?void 0:t.extraWalletsAmount)==null?void 0:X.toString())||""),[O,C]=A.useState((t==null?void 0:t.category)||"memecoins"),[M,ee]=A.useState(t?t.participants.length>1:!1),[Z,j]=A.useState(t?t.participants.filter(R=>R!==t.userId):[]),[y,v]=A.useState([]),[f,_]=A.useState([]),[k,p]=A.useState(""),[$,q]=A.useState(!1);gn();const se=(R,L="w-4 h-4")=>{switch(R){case"memecoins":return n.jsx(aa,{className:L});case"futures":return n.jsx(na,{className:L});case"nft":return n.jsx(sa,{className:L});case"spot":return n.jsx(ta,{className:L});case"polymarket":return n.jsx(Ei,{className:L});case"staking":return n.jsx(al,{className:L});default:return n.jsx(Bt,{className:L})}},B=()=>{var R;return c&&t?(R=t.participants)!=null&&R.length?t.participants:[t.userId]:a&&!s?Z:s?M?Array.from(new Set([s.id,...Z])):[s.id]:[]},Y=B(),ce=Y.length,re=ce||1,he=R=>{const L=parseFloat(R.replace(",","."));return Number.isFinite(L)?L:0},K=A.useMemo(()=>{const R=he(b),L=he(E),ge=Math.max(R+L,0),pe=ge>0?parseFloat((ge*Tn).toFixed(2)):0,U=Math.max(ge-pe,0),S=re>0?parseFloat((U/re).toFixed(2)):0;return{gross:ge,pool:pe,net:U,share:S}},[b,E,re]);A.useEffect(()=>{G()},[d,s,c]);const G=async()=>{if(!(!a&&!s&&!c))try{const R=c||a?await Fr(void 0,d):await Fr(s.id,d),L=Zo(),ge=me(L,"yyyy-MM-dd"),pe=c?R:R.filter(U=>{if(d!==ge)return a;const S=U.slots[U.slots.length-1];return Cu(S.end,L)||a});v(pe)}catch(R){console.error("Error loading slots:",R)}},xe=R=>{Z.includes(R)?j(Z.filter(L=>L!==R)):j([...Z,R])},we=()=>{const R=he(b),L=he(E),ge=parseInt(N||"0",10);if(!R&&!L)return p("Укажите сумму заработка (основную или по доп. кошелькам)"),null;if(R<0||L<0)return p("Суммы не могут быть отрицательными"),null;if(!O)return p("Выберите сферу заработка"),null;const pe=B();if(pe.length===0)return p("Выберите хотя бы одного участника"),null;const U=R+L;return{id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,category:O,amount:U,extraWalletsAmount:L,extraWalletsCount:Number.isFinite(ge)?ge:0,participants:pe}},H=()=>{p("");const R=we();R&&(_([...f,R]),I(""),P(""),T(""),j([]),ee(!1))},_e=R=>{_(L=>L.filter(ge=>ge.id!==R))},ye=async()=>{if(!a&&!s&&!c){p("Пользователь не найден");return}p(""),q(!0);try{if(!m){p("Выберите слот"),q(!1);return}const R=y.find(L=>L.id===m);if(!R&&!c){p("Выбранный слот не найден"),q(!1);return}if(!a&&!c){const L=Zo(),ge=me(L,"yyyy-MM-dd");if(d!==ge){p("Можно добавить заработок только за сегодня"),q(!1);return}if(R){const pe=R.slots[R.slots.length-1];if(!Cu(pe.end,L)){p("Слот еще идет или еще не начат. Можно добавить заработок после 21:00 МСК или после окончания слота"),q(!1);return}}}if(c&&t){const L=we();if(!L){q(!1);return}await U1(t.id,{date:d,amount:L.amount,poolAmount:parseFloat((L.amount*Tn).toFixed(2)),slotId:m,category:L.category,participants:L.participants,extraWalletsAmount:L.extraWalletsAmount,extraWalletsCount:L.extraWalletsCount})}else{let L=f;if(L.length===0){const ge=we();if(!ge){q(!1);return}L=[ge]}for(const ge of L)await F1({userId:ge.participants[0],date:d,amount:ge.amount,poolAmount:parseFloat((ge.amount*Tn).toFixed(2)),slotId:m,category:ge.category,participants:ge.participants,extraWalletsAmount:ge.extraWalletsAmount,extraWalletsCount:ge.extraWalletsCount})}e()}catch(R){console.error("Error saving earnings:",R);const L=R.message||R.code||"Ошибка при сохранении";p(L)}finally{q(!1)}};return n.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 touch-manipulation overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll",children:n.jsxs("div",{className:`w-full max-w-[540px] sm:max-w-3xl rounded-2xl sm:rounded-3xl shadow-xl ${i==="dark"?"bg-[#1a1a1a]":"bg-white"} max-h-[85dvh] sm:max-h-[calc(100dvh-96px)] flex flex-col overflow-hidden`,children:[n.jsx("div",{className:"flex-shrink-0 p-4 sm:p-6",children:n.jsxs("div",{className:"flex items-center justify-between mb-4 sm:mb-6",children:[n.jsx("h3",{className:`text-lg sm:text-xl font-bold ${l} pr-2`,children:c?"Редактировать заработок":"Добавить заработок"}),n.jsx("button",{onClick:r,className:`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${i==="dark"?"hover:bg-gray-700 active:bg-gray-600 text-gray-200":"hover:bg-gray-100 active:bg-gray-200 text-gray-700"} transition-colors touch-manipulation`,"aria-label":"Закрыть",children:n.jsx(Xt,{className:"w-4 h-4 sm:w-5 sm:h-5"})})]})}),n.jsx("div",{className:"flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll px-4 sm:px-6",children:n.jsxs("div",{className:"space-y-3 sm:space-y-4 pb-8 min-w-0",children:[n.jsxs("div",{children:[n.jsxs("label",{className:`flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm font-medium mb-2 gap-1 sm:gap-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx("span",{children:"Дата"}),!a&&!c&&n.jsx("span",{className:"text-[10px] sm:text-xs text-gray-400 whitespace-nowrap",children:"Доступна только текущая дата"})]}),n.jsx("input",{type:"date",value:d,onChange:R=>h(R.target.value),disabled:!a&&!c,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] disabled:opacity-50 disabled:cursor-not-allowed`}),c&&!a&&n.jsx("p",{className:`mt-1 text-xs ${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"Только администратор может изменить дату"})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Слот"}),n.jsxs("select",{value:m,onChange:R=>x(R.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,children:[n.jsx("option",{value:"",children:"Выберите слот"}),y.map(R=>n.jsx("option",{value:R.id,children:R.slots.map(L=>`${L.start}-${L.end}`).join(", ")},R.id)),c&&t&&!y.find(R=>R.id===t.slotId)&&n.jsx("option",{value:t.slotId,disabled:!0,children:"[Текущий слот - не найден]"})]}),c&&t&&!y.find(R=>R.id===t.slotId)&&n.jsx("p",{className:`mt-1 text-xs ${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"Текущий слот не найден в списке. Выберите другой слот или оставьте текущий."})]}),n.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Сумма заработка (руб.)"}),n.jsx("input",{type:"number",value:b,onChange:R=>I(R.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"0",min:"0",step:"100"})]}),n.jsxs("div",{className:"space-y-2",children:[n.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Кол-во доп. кошельков"}),n.jsx("input",{type:"number",value:N,onChange:R=>T(R.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"0",min:"0",step:"1"})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Доп. кошельки (руб.)"}),n.jsx("input",{type:"number",value:E,onChange:R=>P(R.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"0",min:"0",step:"100"})]})]}),n.jsx("div",{className:"space-y-1 text-[11px] text-gray-500",children:n.jsx("p",{children:"Общая сумма = основная + доп. кошельки. Пул 45% считается с общей суммы."})})]})]}),n.jsxs("div",{className:"space-y-2",children:[n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("label",{className:`text-xs sm:text-sm font-medium ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Сфера заработка"}),n.jsx("span",{className:"text-[10px] sm:text-xs text-gray-400",children:"Влияет на статистику"})]}),n.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:Object.entries(xs).map(([R,L])=>n.jsxs("button",{type:"button",onClick:()=>C(R),className:`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${O===R?"border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49]":i==="dark"?"border-gray-800 bg-gray-800/60 text-gray-200 hover:border-[#4E6E49]/40":"border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/40"}`,children:[n.jsx("span",{className:"p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800/80",children:se(R,"w-4 h-4")}),n.jsxs("div",{className:"flex flex-col leading-tight",children:[n.jsx("span",{className:"text-sm font-semibold",children:L.label}),n.jsx("span",{className:"text-[11px] text-gray-500",children:"45% пул / 55% чистыми"})]})]},R))})]}),n.jsxs(n.Fragment,{children:[n.jsxs("label",{className:"flex items-center gap-2",children:[n.jsx("input",{type:"checkbox",checked:M,onChange:R=>ee(R.target.checked),className:"w-4 h-4"}),n.jsx("span",{className:`${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Отметить несколько участников"})]}),(M||a&&!s)&&n.jsx("div",{className:"ml-0 sm:ml-2 grid grid-cols-2 sm:grid-cols-3 gap-2",children:Ne.filter(R=>!s||R.id!==s.id).map(R=>n.jsxs("label",{className:"flex items-center gap-2 rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-800",children:[n.jsx("input",{type:"checkbox",checked:Z.includes(R.id),onChange:()=>xe(R.id),className:"w-4 h-4"}),n.jsx("span",{className:i==="dark"?"text-gray-300":"text-gray-700",children:R.name})]},R.id))})]}),n.jsxs("div",{className:`p-4 rounded-xl border ${i==="dark"?"border-gray-800 bg-gray-900/60":"border-gray-200 bg-gray-50"}`,children:[n.jsxs("div",{className:"flex items-center justify-between gap-2 mb-3",children:[n.jsxs("div",{children:[n.jsx("p",{className:`text-xs font-semibold ${i==="dark"?"text-gray-200":"text-gray-800"}`,children:"Авторасчет"}),n.jsx("p",{className:"text-[11px] text-gray-500",children:"Пул 45% + деление между участниками"})]}),n.jsxs("span",{className:"text-[11px] px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] font-semibold",children:[ce||0," участн."]})]}),n.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3",children:[n.jsxs("div",{className:`p-3 rounded-lg ${i==="dark"?"bg-gray-800/70":"bg-white"}`,children:[n.jsx("p",{className:"text-[11px] text-gray-500",children:"Пул (45%)"}),n.jsxs("p",{className:"text-lg font-bold text-purple-500",children:[K.pool.toFixed(2)," ₽"]})]}),n.jsxs("div",{className:`p-3 rounded-lg ${i==="dark"?"bg-gray-800/70":"bg-white"}`,children:[n.jsx("p",{className:"text-[11px] text-gray-500",children:"Чистыми после пула"}),n.jsxs("p",{className:"text-lg font-bold text-emerald-500",children:[K.net.toFixed(2)," ₽"]})]}),n.jsxs("div",{className:`p-3 rounded-lg ${i==="dark"?"bg-gray-800/70":"bg-white"}`,children:[n.jsx("p",{className:"text-[11px] text-gray-500",children:"На каждого"}),n.jsxs("p",{className:"text-lg font-bold text-[#4E6E49]",children:[K.share.toFixed(2)," ₽"]})]})]}),n.jsxs("div",{className:`text-xs ${i==="dark"?"text-gray-400":"text-gray-600"} mb-1`,children:["Отмеченные участники получат по ",K.share.toFixed(2)," ₽"]}),n.jsx("div",{className:"flex flex-wrap gap-2",children:Y.length===0?n.jsx("span",{className:"text-xs text-gray-400",children:"Нет выбранных участников"}):Y.map(R=>{var L;return n.jsx("span",{className:`px-2.5 py-1 rounded-full text-xs font-semibold border ${i==="dark"?"border-gray-800 bg-gray-800/70 text-gray-100":"border-gray-200 bg-white text-gray-800"}`,children:((L=Ne.find(ge=>ge.id===R))==null?void 0:L.name)||R},R)})})]}),!c&&f.length>0&&n.jsxs("div",{className:`rounded-xl border ${i==="dark"?"border-gray-800 bg-gray-900/70":"border-gray-200 bg-gray-50"} p-3 sm:p-4 space-y-3`,children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("p",{className:`text-sm font-semibold ${i==="dark"?"text-gray-200":"text-gray-800"}`,children:"Добавленные записи"}),n.jsxs("span",{className:"text-xs text-gray-500",children:[f.length," шт."]})]}),n.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto pr-1",children:f.map(R=>n.jsxs("div",{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border ${i==="dark"?"border-gray-800 bg-gray-800/60":"border-gray-200 bg-white"}`,children:[n.jsxs("div",{className:"flex items-center gap-3 min-w-0",children:[n.jsx("div",{className:"p-2 rounded-lg bg-gray-100 dark:bg-gray-900/70",children:se(R.category,"w-4 h-4")}),n.jsxs("div",{className:"min-w-0",children:[n.jsxs("p",{className:"text-sm font-semibold flex items-center gap-2",children:[xs[R.category].label,n.jsxs("span",{className:"text-[11px] text-gray-500",children:["(",R.participants.length," уч.)"]})]}),n.jsxs("p",{className:"text-xs text-gray-500 whitespace-normal break-words",children:["Гросс ",R.amount.toFixed(0)," ₽ • Пул ",(R.amount*Tn).toFixed(0)," ₽ • Чистыми ",(R.amount-R.amount*Tn).toFixed(0)," ₽"]}),R.extraWalletsAmount>0&&n.jsxs("p",{className:"text-[11px] text-gray-500",children:["Доп. кошельки: ",R.extraWalletsCount," на ",R.extraWalletsAmount.toFixed(0)," ₽"]})]})]}),n.jsx("button",{type:"button",onClick:()=>_e(R.id),className:`self-start sm:self-center p-2 rounded-lg ${i==="dark"?"hover:bg-gray-700 text-red-400":"hover:bg-gray-100 text-red-600"}`,"aria-label":"Удалить запись",children:n.jsx(It,{className:"w-4 h-4"})})]},R.id))})]}),k&&n.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:k}),n.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2",children:[!c&&n.jsxs("button",{type:"button",onClick:H,disabled:$,className:"flex-1 sm:flex-none sm:px-4 px-4 py-2.5 sm:py-2 border border-[#4E6E49] text-[#4E6E49] rounded-lg sm:rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#4E6E49]/10 active:scale-95 transition-colors",children:[n.jsx(Yu,{className:"w-4 h-4"}),"Добавить в список"]}),n.jsx("button",{onClick:ye,disabled:$,className:"flex-1 px-4 py-2.5 sm:py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100",children:$?"Сохранение...":c?"Сохранить":"Сохранить все"}),n.jsx("button",{type:"button",onClick:r,className:`flex-1 px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl border text-sm sm:text-base font-medium transition-colors touch-manipulation active:scale-95 ${i==="dark"?"border-gray-700 text-gray-200 hover:bg-gray-800":"border-gray-300 text-gray-800 hover:bg-gray-100"}`,children:"Отмена"})]})]})})]})})},vk=({earnings:r})=>{const{theme:e}=Ze(),t=.45,s=ba(),a=me(s.start,"yyyy-MM-dd"),i=me(s.end,"yyyy-MM-dd"),l=me(new Date(new Date().getFullYear(),new Date().getMonth(),1),"yyyy-MM-dd"),c=me(new Date(new Date().getFullYear(),new Date().getMonth()+1,0),"yyyy-MM-dd"),d=(I,N,T)=>{const E=r.filter(C=>(C.participants&&C.participants.length>0?[...C.participants,C.userId]:[C.userId]).includes(I)&&C.date>=N&&C.date<=T),P=E.reduce((C,M)=>{const ee=M.participants&&M.participants.length>0?M.participants.length:1,Z=M.poolAmount||M.amount*t,j=Math.max(M.amount-Z,0);return C+j/ee},0),O=E.reduce((C,M)=>{const ee=M.participants&&M.participants.length>0?M.participants.length:1,Z=M.poolAmount||M.amount*t;return C+Z/ee},0);return{totalEarnings:P,totalPool:O,count:E.length}},h=Ne.reduce((I,N)=>{const T=d(N.id,a,i);return I+T.totalEarnings},0),m=Ne.reduce((I,N)=>{const T=d(N.id,a,i);return I+T.totalPool},0),x=Ne.reduce((I,N)=>{const T=d(N.id,l,c);return I+T.totalEarnings},0),b=Ne.reduce((I,N)=>{const T=d(N.id,l,c);return I+T.totalPool},0);return n.jsx("div",{className:`rounded-2xl ${e==="dark"?"bg-[#1a1a1a]":"bg-white"} shadow-lg border-2 ${e==="dark"?"border-gray-800":"border-gray-200"} overflow-hidden`,children:n.jsxs("div",{className:"p-6",children:[n.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[n.jsx("div",{className:`p-2 rounded-lg ${e==="dark"?"bg-blue-500/20":"bg-blue-100"}`,children:n.jsx(ws,{className:`w-5 h-5 ${e==="dark"?"text-blue-400":"text-blue-600"}`})}),n.jsx("h3",{className:`text-xl font-bold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Статистика заработка"})]}),n.jsxs("div",{className:"mb-6",children:[n.jsx("h4",{className:`text-lg font-semibold mb-4 px-2 ${e==="dark"?"text-white":"text-gray-900"}`,children:"За неделю"}),n.jsx("div",{className:"overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800",children:n.jsxs("table",{className:"w-full",children:[n.jsx("thead",{children:n.jsxs("tr",{className:`${e==="dark"?"bg-gray-700/50":"bg-gray-100"}`,children:[n.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Участник"}),n.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Чистыми"}),n.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Пул 45%"})]})}),n.jsxs("tbody",{children:[Ne.map(I=>{const N=d(I.id,a,i);return n.jsxs("tr",{className:`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${e==="dark"?"hover:bg-gray-700/30":"hover:bg-gray-50"}`,children:[n.jsx("td",{className:`px-4 py-3 font-medium ${e==="dark"?"text-white":"text-gray-900"}`,children:I.name}),n.jsxs("td",{className:"px-4 py-3 text-right font-semibold text-[#4E6E49]",children:[N.totalEarnings.toFixed(2)," ₽"]}),n.jsxs("td",{className:`px-4 py-3 text-right font-semibold ${e==="dark"?"text-purple-400":"text-purple-600"}`,children:[N.totalPool.toFixed(2)," ₽"]})]},I.id)}),n.jsxs("tr",{className:`${e==="dark"?"bg-gray-700/70":"bg-gray-100"} font-bold border-t-2 border-gray-800/50 dark:border-gray-800`,children:[n.jsx("td",{className:`px-4 py-3 ${e==="dark"?"text-white":"text-gray-900"}`,children:"Итого команды"}),n.jsxs("td",{className:"px-4 py-3 text-right text-[#4E6E49]",children:[h.toFixed(2)," ₽"]}),n.jsxs("td",{className:`px-4 py-3 text-right ${e==="dark"?"text-purple-400":"text-purple-600"}`,children:[m.toFixed(2)," ₽"]})]})]})]})})]}),n.jsxs("div",{children:[n.jsx("h4",{className:`text-lg font-semibold mb-4 px-2 ${e==="dark"?"text-white":"text-gray-900"}`,children:"За месяц"}),n.jsx("div",{className:"overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800",children:n.jsxs("table",{className:"w-full",children:[n.jsx("thead",{children:n.jsxs("tr",{className:`${e==="dark"?"bg-gray-700/50":"bg-gray-100"}`,children:[n.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Участник"}),n.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Чистыми"}),n.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Пул 45%"})]})}),n.jsxs("tbody",{children:[Ne.map(I=>{const N=d(I.id,l,c);return n.jsxs("tr",{className:`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${e==="dark"?"hover:bg-gray-700/30":"hover:bg-gray-50"}`,children:[n.jsx("td",{className:`px-4 py-3 font-medium ${e==="dark"?"text-white":"text-gray-900"}`,children:I.name}),n.jsxs("td",{className:"px-4 py-3 text-right font-semibold text-[#4E6E49]",children:[N.totalEarnings.toFixed(2)," ₽"]}),n.jsxs("td",{className:`px-4 py-3 text-right font-semibold ${e==="dark"?"text-purple-400":"text-purple-600"}`,children:[N.totalPool.toFixed(2)," ₽"]})]},I.id)}),n.jsxs("tr",{className:`${e==="dark"?"bg-gray-700/70":"bg-gray-100"} font-bold border-t-2 border-gray-800/50 dark:border-gray-800`,children:[n.jsx("td",{className:`px-4 py-3 ${e==="dark"?"text-white":"text-gray-900"}`,children:"Итого команды"}),n.jsxs("td",{className:"px-4 py-3 text-right text-[#4E6E49]",children:[x.toFixed(2)," ₽"]}),n.jsxs("td",{className:`px-4 py-3 text-right ${e==="dark"?"text-purple-400":"text-purple-600"}`,children:[b.toFixed(2)," ₽"]})]})]})]})})]})]})})},wk=({earnings:r,onEdit:e,onDelete:t})=>{const{theme:s}=Ze(),{user:a}=At(),{isAdmin:i}=Vt(),[l,c]=A.useState(null),d=.45,h=(C,M="w-4 h-4")=>{switch(C){case"memecoins":return n.jsx(aa,{className:M});case"futures":return n.jsx(na,{className:M});case"nft":return n.jsx(sa,{className:M});case"spot":return n.jsx(ta,{className:M});case"polymarket":return n.jsx(Ei,{className:M});case"staking":return n.jsx(al,{className:M});default:return n.jsx(Bt,{className:M})}},m=async C=>{if(confirm("Вы уверены, что хотите удалить эту запись о заработке?")){c(C);try{await B1(C),t()}catch(M){console.error("Error deleting earnings:",M),alert("Ошибка при удалении записи")}finally{c(null)}}},x=C=>C.participants&&C.participants.length>0?C.participants:[C.userId],b=C=>C.poolAmount||C.amount*d,I=C=>Math.max(C.amount-b(C),0),N=C=>{const M=x(C);return M.length?I(C)/M.length:I(C)},T=C=>xs[C]||xs.other,E=C=>{var M;return((M=Ne.find(ee=>ee.id===C))==null?void 0:M.name)||C},P=C=>i||C.userId===(a==null?void 0:a.id),O=[...r].sort((C,M)=>M.date.localeCompare(C.date));return O.length===0?n.jsxs("div",{className:`rounded-2xl p-8 text-center border-2 ${s==="dark"?"bg-[#1a1a1a] border-gray-800":"bg-white border-gray-200"} shadow-md`,children:[n.jsx("p",{className:`${s==="dark"?"text-gray-400":"text-gray-600"} text-lg`,children:"Пока нет записей о заработке"}),n.jsx("p",{className:"text-gray-500 text-sm mt-2",children:"Добавьте первую запись, чтобы начать отслеживать доходы команды"})]}):n.jsx("div",{className:`rounded-2xl ${s==="dark"?"bg-[#1a1a1a]":"bg-white"} shadow-lg border-2 ${s==="dark"?"border-gray-800":"border-gray-200"} overflow-hidden`,children:n.jsxs("div",{className:"p-6",children:[n.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[n.jsx("div",{className:`p-2 rounded-lg ${s==="dark"?"bg-blue-500/20":"bg-blue-100"}`,children:n.jsx(Yc,{className:`w-5 h-5 ${s==="dark"?"text-blue-400":"text-blue-600"}`})}),n.jsx("h3",{className:`text-xl font-bold ${s==="dark"?"text-white":"text-gray-900"}`,children:"Все записи о заработке"})]}),n.jsx("div",{className:"overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800",children:n.jsxs("table",{className:"w-full",children:[n.jsx("thead",{children:n.jsxs("tr",{className:`${s==="dark"?"bg-gray-700/50":"bg-gray-100"}`,children:[n.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${s==="dark"?"text-white":"text-gray-900"}`,children:"Дата"}),n.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${s==="dark"?"text-white":"text-gray-900"}`,children:"Сфера"}),n.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${s==="dark"?"text-white":"text-gray-900"}`,children:"Участники"}),n.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${s==="dark"?"text-white":"text-gray-900"}`,children:"Чистыми"}),n.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${s==="dark"?"text-white":"text-gray-900"}`,children:"Пул 45%"}),n.jsx("th",{className:`px-4 py-3 text-center text-sm font-semibold ${s==="dark"?"text-white":"text-gray-900"}`,children:"Действия"})]})}),n.jsx("tbody",{children:O.map(C=>{const M=x(C),ee=T(C.category),Z=I(C),j=N(C),y=P(C);return n.jsxs("tr",{className:`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${s==="dark"?"hover:bg-gray-700/30":"hover:bg-gray-50"}`,children:[n.jsx("td",{className:`px-4 py-3 font-medium ${s==="dark"?"text-white":"text-gray-900"}`,children:me(new Date(C.date+"T00:00:00"),"dd.MM.yyyy")}),n.jsx("td",{className:"px-4 py-3",children:n.jsxs("span",{className:`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${s==="dark"?"bg-gray-800 text-gray-100":"bg-gray-100 text-gray-900"}`,children:[h(C.category,"w-4 h-4"),ee.label]})}),n.jsx("td",{className:"px-4 py-3",children:n.jsx("div",{className:"flex flex-wrap gap-2",children:M.map(v=>n.jsx("span",{className:`px-2.5 py-1 rounded-full text-xs font-semibold border ${s==="dark"?"border-gray-800 bg-gray-800/70 text-gray-100":"border-gray-200 bg-white text-gray-800"}`,children:E(v)},v))})}),n.jsxs("td",{className:"px-4 py-3 text-right font-semibold text-[#4E6E49]",children:[n.jsxs("div",{children:[Z.toFixed(2)," ₽"]}),n.jsxs("div",{className:"text-xs text-gray-500",children:["по ",j.toFixed(2)," ₽"]}),C.extraWalletsAmount?n.jsxs("div",{className:"text-[11px] text-gray-500 flex items-center gap-1 mt-1",children:[n.jsx(bf,{className:"w-3 h-3"}),C.extraWalletsCount||0," / ",C.extraWalletsAmount.toFixed(0)," ₽"]}):null]}),n.jsxs("td",{className:`px-4 py-3 text-right font-semibold ${s==="dark"?"text-purple-400":"text-purple-600"}`,children:[b(C).toFixed(2)," ₽"]}),n.jsx("td",{className:"px-4 py-3 text-center",children:y?n.jsxs("div",{className:"flex items-center justify-center gap-2",children:[n.jsx("button",{onClick:()=>e(C),className:`p-2 rounded-lg transition-colors ${s==="dark"?"hover:bg-gray-600 text-blue-400":"hover:bg-gray-200 text-blue-600"}`,title:"Редактировать",children:n.jsx(Yc,{className:"w-4 h-4"})}),n.jsx("button",{onClick:()=>m(C.id),disabled:l===C.id,className:`p-2 rounded-lg transition-colors ${s==="dark"?"hover:bg-gray-600 text-red-400":"hover:bg-gray-200 text-red-600"} disabled:opacity-50 disabled:cursor-not-allowed`,title:"Удалить",children:n.jsx(It,{className:"w-4 h-4"})})]}):n.jsx("span",{className:`text-sm ${s==="dark"?"text-gray-500":"text-gray-400"}`,children:"—"})})]},C.id)})})]})})]})})},_k=()=>{const{theme:r}=Ze(),[e,t]=A.useState(!1),[s,a]=A.useState(null),[i,l]=A.useState([]),[c,d]=A.useState(!0),[h,m]=A.useState({weekTotal:0,weekPool:0,weekNet:0,monthTotal:0,monthPool:0,monthNet:0}),x=.45,b=Object.keys(xs),I=r==="dark"?"text-white":"text-gray-900",N=r==="dark"?"bg-[#1a1a1a]":"bg-white",T=p=>p.poolAmount||p.amount*x,E=p=>Math.max(p.amount-T(p),0),P=p=>{var $;return($=p.participants)!=null&&$.length?p.participants:[p.userId]},O=p=>{var $;return(($=Ne.find(q=>q.id===p))==null?void 0:$.name)||p},C=(p,$="w-4 h-4")=>{switch(p){case"memecoins":return n.jsx(aa,{className:$});case"futures":return n.jsx(na,{className:$});case"nft":return n.jsx(sa,{className:$});case"spot":return n.jsx(ta,{className:$});case"polymarket":return n.jsx(Ei,{className:$});case"staking":return n.jsx(al,{className:$});default:return n.jsx(Bt,{className:$})}},M=()=>{const p=ba(),$=me(p.start,"yyyy-MM-dd"),q=me(p.end,"yyyy-MM-dd"),se=me(new Date(new Date().getFullYear(),new Date().getMonth(),1),"yyyy-MM-dd"),B=me(new Date(new Date().getFullYear(),new Date().getMonth()+1,0),"yyyy-MM-dd"),Y=i.filter(re=>re.date>=$&&re.date<=q),ce=i.filter(re=>re.date>=se&&re.date<=B);m({weekTotal:Y.reduce((re,he)=>re+he.amount,0),weekPool:Y.reduce((re,he)=>re+T(he),0),weekNet:Y.reduce((re,he)=>re+E(he),0),monthTotal:ce.reduce((re,he)=>re+he.amount,0),monthPool:ce.reduce((re,he)=>re+T(he),0),monthNet:ce.reduce((re,he)=>re+E(he),0)})};A.useEffect(()=>{ee()},[]),A.useEffect(()=>{M()},[i]);const ee=async()=>{d(!0);try{const p=await Jn();l(p)}catch(p){console.error("Error loading earnings:",p)}finally{d(!1)}},Z=p=>{a(p),t(!0)},j=()=>{t(!1),a(null)},y=()=>{t(!1),a(null),ee()},v=b.map(p=>{const $=i.filter(re=>re.category===p),q=$.reduce((re,he)=>re+he.amount,0),se=$.reduce((re,he)=>re+T(he),0),B=$.reduce((re,he)=>re+E(he),0),Y=new Map;$.forEach(re=>{const he=P(re),K=E(re)/Math.max(he.length,1);he.forEach(G=>{Y.set(G,(Y.get(G)||0)+K)})});const ce=Array.from(Y.entries()).sort((re,he)=>he[1]-re[1]).slice(0,2);return{key:p,gross:q,pool:se,net:B,count:$.length,topParticipants:ce}}),f=Ne.map(p=>{const $=i.filter(B=>P(B).includes(p.id)),q=$.reduce((B,Y)=>{const ce=E(Y)/Math.max(P(Y).length,1);return B+ce},0),se=$.reduce((B,Y)=>{const ce=T(Y)/Math.max(P(Y).length,1);return B+ce},0);return{...p,net:q,poolShare:se}}).sort((p,$)=>$.net-p.net),_=[...v].sort((p,$)=>$.net-p.net)[0],k=f[0];return n.jsx(sr,{children:n.jsxs("div",{className:"space-y-6",children:[n.jsxs("div",{className:`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${N} shadow-xl border-2 ${r==="dark"?"border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]":"border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white"} relative overflow-hidden`,children:[n.jsx("div",{className:"absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"}),n.jsx("div",{className:"absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"}),n.jsx("div",{className:"relative z-10",children:n.jsxs("div",{className:"flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6",children:[n.jsxs("div",{className:"flex-1 min-w-0 space-y-3 sm:space-y-4",children:[n.jsxs("div",{className:"flex items-center gap-3 sm:gap-4",children:[n.jsx("div",{className:"p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0 bg-gradient-to-br from-[#4E6E49] to-emerald-700 text-white transform transition-transform active:scale-95 sm:hover:scale-110",children:n.jsx(ra,{className:"w-5 h-5 sm:w-7 sm:h-7"})}),n.jsx("div",{className:"flex-1 min-w-0",children:n.jsxs("h1",{className:`text-2xl sm:text-3xl md:text-4xl font-extrabold ${I} flex items-center gap-2 sm:gap-3`,children:[n.jsx("span",{className:"bg-gradient-to-r from-[#4E6E49] via-emerald-700 to-yellow-600 text-transparent bg-clip-text",children:"Заработок команды"}),n.jsx(Bt,{className:`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${r==="dark"?"text-yellow-400":"text-yellow-500"} animate-pulse`})]})})]}),n.jsx("p",{className:`text-sm sm:text-base font-medium ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Отслеживайте доходы и вклад каждого участника в общий успех"}),n.jsx("div",{className:"flex flex-wrap gap-2",children:[{href:"#earn-stats",label:"Обзор"},{href:"#earn-history",label:"История"},{href:"#earn-insights",label:"Инсайты"}].map(p=>n.jsx("a",{href:p.href,className:`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${r==="dark"?"border-white/10 bg-white/5 text-white hover:border-[#4E6E49]/50":"border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:p.label},p.href))})]}),n.jsxs("button",{onClick:()=>t(!0),className:"w-full lg:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 transform touch-manipulation",children:[n.jsx(Un,{className:"w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"}),n.jsx("span",{className:"whitespace-nowrap",children:"Добавить заработок"})]})]})}),n.jsxs("div",{id:"earn-stats",className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",children:[n.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-blue-500/10 border-blue-500/30":"bg-blue-50 border-blue-200"}`,children:[n.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[n.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-blue-500/20":"bg-blue-100"}`,children:n.jsx(ws,{className:`w-5 h-5 ${r==="dark"?"text-blue-400":"text-blue-600"}`})}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Неделя (чистыми)"})]}),n.jsxs("p",{className:`text-2xl font-bold ${r==="dark"?"text-blue-400":"text-blue-600"}`,children:[h.weekNet.toFixed(2)," ₽"]}),n.jsxs("p",{className:"text-[11px] text-gray-500 mt-1",children:["Гросс: ",h.weekTotal.toFixed(2)," ₽"]})]}),n.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-purple-500/10 border-purple-500/30":"bg-purple-50 border-purple-200"}`,children:[n.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[n.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-purple-500/20":"bg-purple-100"}`,children:n.jsx(Xc,{className:`w-5 h-5 ${r==="dark"?"text-purple-400":"text-purple-600"}`})}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Пул за неделю"})]}),n.jsxs("p",{className:`text-2xl font-bold ${r==="dark"?"text-purple-400":"text-purple-600"}`,children:[h.weekPool.toFixed(2)," ₽"]})]}),n.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-[#4E6E49]/10 border-[#4E6E49]/30":"bg-green-50 border-green-200"}`,children:[n.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[n.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-[#4E6E49]/20":"bg-green-100"}`,children:n.jsx(vf,{className:"w-5 h-5 text-[#4E6E49]"})}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Месяц (чистыми)"})]}),n.jsxs("p",{className:"text-2xl font-bold text-[#4E6E49]",children:[h.monthNet.toFixed(2)," ₽"]}),n.jsxs("p",{className:"text-[11px] text-gray-500 mt-1",children:["Гросс: ",h.monthTotal.toFixed(2)," ₽"]})]}),n.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-orange-500/10 border-orange-500/30":"bg-orange-50 border-orange-200"}`,children:[n.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[n.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-orange-500/20":"bg-orange-100"}`,children:n.jsx(Xc,{className:`w-5 h-5 ${r==="dark"?"text-orange-400":"text-orange-600"}`})}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Пул за месяц"})]}),n.jsxs("p",{className:`text-2xl font-bold ${r==="dark"?"text-orange-400":"text-orange-600"}`,children:[h.monthPool.toFixed(2)," ₽"]})]})]}),n.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4",children:[n.jsxs("div",{className:`lg:col-span-2 rounded-2xl p-5 ${N} border ${r==="dark"?"border-white/10":"border-gray-200"} shadow-lg`,children:[n.jsx("div",{className:"flex items-center justify-between mb-4",children:n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-[#4E6E49]/20":"bg-green-100"}`,children:n.jsx(Ku,{className:"w-5 h-5 text-[#4E6E49]"})}),n.jsxs("div",{children:[n.jsx("p",{className:`text-sm font-semibold ${r==="dark"?"text-gray-200":"text-gray-800"}`,children:"Сферы заработка"}),n.jsx("p",{className:"text-xs text-gray-500",children:"Сколько приносит каждый поток"})]})]})}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",children:v.map(p=>{const $=xs[p.key];return n.jsxs("div",{className:`p-3 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-900/70":"border-gray-200 bg-white"} shadow-sm`,children:[n.jsxs("div",{className:"flex items-start justify-between gap-2",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("span",{className:"p-2 rounded-lg bg-gray-100 dark:bg-gray-800/80 flex items-center justify-center",children:C(p.key,"w-4 h-4")}),n.jsxs("div",{children:[n.jsx("p",{className:"text-sm font-semibold",children:$.label}),n.jsxs("p",{className:"text-[11px] text-gray-500",children:[p.count," записей"]})]})]}),n.jsxs("span",{className:"text-sm font-bold text-[#4E6E49]",children:[p.net.toFixed(0)," ₽"]})]}),n.jsxs("div",{className:"grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500",children:[n.jsxs("div",{children:["Пул: ",p.pool.toFixed(0)," ₽"]}),n.jsxs("div",{children:["Гросс: ",p.gross.toFixed(0)," ₽"]})]}),n.jsxs("div",{className:"mt-2",children:[n.jsx("p",{className:"text-[11px] uppercase tracking-wide text-gray-500 mb-1",children:"Топ участники"}),n.jsx("div",{className:"flex flex-wrap gap-1.5",children:p.topParticipants.length===0?n.jsx("span",{className:"text-[11px] text-gray-500",children:"Нет записей"}):p.topParticipants.map(([q,se])=>n.jsxs("span",{className:`px-2 py-1 rounded-full text-[11px] font-semibold ${r==="dark"?"bg-gray-800 text-gray-100":"bg-gray-100 text-gray-800"}`,children:[O(q)," · ",se.toFixed(0)," ₽"]},q))})]})]},p.key)})})]}),n.jsxs("div",{className:`rounded-2xl p-5 ${N} border ${r==="dark"?"border-white/10":"border-gray-200"} shadow-lg`,children:[n.jsx("div",{className:"flex items-center justify-between mb-4",children:n.jsxs("div",{children:[n.jsx("p",{className:`text-sm font-semibold ${r==="dark"?"text-gray-200":"text-gray-800"}`,children:"Лидеры по доходу"}),n.jsx("p",{className:"text-xs text-gray-500",children:"Кто приносит больше всего чистыми"})]})}),n.jsxs("div",{className:"space-y-3",children:[f.slice(0,3).map((p,$)=>n.jsxs("div",{className:`flex items-center justify-between p-3 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-900/70":"border-gray-200 bg-white"}`,children:[n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx("span",{className:`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${r==="dark"?"bg-gray-800 text-gray-100":"bg-gray-100 text-gray-800"}`,children:$+1}),n.jsxs("div",{children:[n.jsx("p",{className:"text-sm font-semibold",children:p.name}),n.jsxs("p",{className:"text-[11px] text-gray-500",children:["Пул: ",p.poolShare.toFixed(0)," ₽"]})]})]}),n.jsxs("div",{className:"text-right",children:[n.jsxs("p",{className:"text-base font-bold text-[#4E6E49]",children:[p.net.toFixed(0)," ₽"]}),n.jsx("p",{className:"text-[11px] text-gray-500",children:"чистыми"})]})]},p.id)),f.length===0&&n.jsx("p",{className:"text-sm text-gray-500",children:"Нет данных по заработку"})]})]})]}),n.jsx("div",{className:"hidden sm:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-800/50 dark:border-gray-800",children:n.jsx("h2",{className:`text-base sm:text-lg md:text-xl font-semibold ${r==="dark"?"text-white":"text-gray-900"}`,children:"Управление заработком"})})]}),c?n.jsx("div",{className:`rounded-xl p-8 text-center border-2 ${r==="dark"?"bg-[#1a1a1a] border-gray-800":"bg-white border-gray-200"} shadow-md`,children:n.jsxs("div",{className:"flex flex-col items-center gap-3",children:[n.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-[#4E6E49]"}),n.jsx("p",{className:r==="dark"?"text-gray-400":"text-gray-600",children:"Загрузка данных..."})]})}):n.jsxs(n.Fragment,{children:[n.jsxs("div",{id:"earn-history",className:"space-y-6",children:[n.jsx(vk,{earnings:i}),n.jsx(wk,{earnings:i,onEdit:Z,onDelete:ee})]}),n.jsxs("div",{id:"earn-insights",className:`rounded-2xl p-6 ${N} border ${r==="dark"?"border-white/10":"border-gray-200"} shadow-lg space-y-4`,children:[n.jsx("div",{className:"flex items-center justify-between",children:n.jsxs("div",{children:[n.jsx("p",{className:`text-sm font-semibold ${r==="dark"?"text-gray-300":"text-gray-700"}`,children:"Инсайты"}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Где мы зарабатываем больше всего"})]})}),n.jsx("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-3",children:[{label:"Топ категория",value:_?`${xs[_.key].label} · ${_.net.toFixed(0)} ₽`:"Нет данных",tone:"bg-blue-500/10 text-blue-600 dark:text-blue-200"},{label:"Лидер команды",value:k?`${k.name} · ${k.net.toFixed(0)} ₽`:"Нет данных",tone:"bg-purple-500/10 text-purple-600 dark:text-purple-200"},{label:"Доля пула (мес.)",value:h.monthTotal?`${Math.round(h.monthPool/h.monthTotal*100)}%`:"45%",tone:"bg-emerald-500/10 text-emerald-600 dark:text-emerald-200"},{label:"Средняя выплата",value:i.length?`${(i.reduce((p,$)=>p+E($),0)/i.length).toFixed(0)} ₽`:"0 ₽",tone:"bg-orange-500/10 text-orange-600 dark:text-orange-200"}].map(p=>n.jsxs("div",{className:`p-3 rounded-xl ${p.tone} border ${r==="dark"?"border-white/10":"border-transparent"} shadow-sm`,children:[n.jsx("p",{className:"text-[11px] uppercase tracking-wide opacity-70",children:p.label}),n.jsx("p",{className:"text-xl font-extrabold",children:p.value})]},p.label))})]})]}),e&&n.jsx(bk,{onClose:j,onSave:y,editingEarning:s})]})})},Cg=(r,e=0,t=0,s=0)=>{let a=0;(r.daysOff===0||r.daysOff<=2)&&(a+=10),r.sickDays<=7&&(a+=10),r.vacationDays<=7&&(a+=10),e>=20?a+=25:e>=15&&(a+=15),t>=6e3?a+=30:t>=3e3&&(a+=15);const i=Math.min(r.referrals*5,30);return a+=i,s>50&&(a+=15),Math.min(a,100)},Rg=(r,e=0,t=0,s=0)=>{const a=r.daysOff===0||r.daysOff<=2?10:0,i=r.sickDays<=7?10:0,l=r.vacationDays<=7?10:0;let c=0;e>=20?c=25:e>=15&&(c=15);let d=0;t>=6e3?d=30:t>=3e3&&(d=15);const h=Math.min(r.referrals*5,30),m=s>50?15:0,x=Math.min(a+i+l+c+d+h+m,100);return{daysOff:r.daysOff,daysOffPoints:a,sickDays:r.sickDays,sickDaysPoints:i,vacationDays:r.vacationDays,vacationDaysPoints:l,weeklyHours:e,weeklyHoursPoints:c,weeklyEarnings:t,weeklyEarningsPoints:d,referrals:r.referrals,referralsPoints:h,weeklyMessages:s,weeklyMessagesPoints:m,totalRating:x}},kk=r=>r>=1&&r<=10?"#ef4444":r>=11&&r<=30?"#f97316":r>=31&&r<=59?"#eab308":r>=60&&r<=80?"#3b82f6":r>=81&&r<=100?"#10b981":"#6b7280",Nk=({rating:r})=>{const{theme:e}=Ze(),[t,s]=A.useState(null),a=Ne.find(P=>P.id===r.userId),i=kk(r.rating),l=e==="dark"?"text-white":"text-gray-900",c=e==="dark"?"text-gray-400":"text-gray-600",d=e==="dark"?"bg-[#0f0f0f]":"bg-white",h=e==="dark"?"border-white/10":"border-gray-200",m=e==="dark"?"hover:bg-white/5":"hover:bg-gray-50",x=e==="dark"?"bg-white/5":"bg-gray-50",b=r.rating<=0?"4%":`${Math.min(r.rating,100)}%`,I=r.lastUpdated?new Date(r.lastUpdated):null,N=P=>P>=81?"🏆":P>=60?"⭐":P>=31?"📊":P>=11?"📈":P>=1?"⚠️":"❌",T=r.breakdown?[{icon:n.jsx(Pr,{className:"w-5 h-5"}),label:"Выходные",value:`${r.breakdown.daysOff} день`,points:r.breakdown.daysOffPoints,maxPoints:10,explanation:"0-2 выходных в неделю = 10% к рейтингу. Более 2 выходных = 0%. Показывает стабильность присутствия.",threshold:"0-2 дня",color:"bg-amber-200 text-amber-900"},{icon:n.jsx(nf,{className:"w-5 h-5"}),label:"Больничные",value:`${r.breakdown.sickDays} дней`,points:r.breakdown.sickDaysPoints,maxPoints:10,explanation:"До 7 дней больничного в месяц = 10% к рейтингу. Более 7 дней = 0%. Учитывается за последние 30 дней.",threshold:"≤7 дней",color:"bg-purple-200 text-purple-900"},{icon:n.jsx(Qu,{className:"w-5 h-5"}),label:"Отпуск",value:`${r.breakdown.vacationDays} дней`,points:r.breakdown.vacationDaysPoints,maxPoints:10,explanation:"До 7 дней отпуска в месяц = 10% к рейтингу. Более 7 дней = 0%. Учитывается за последние 30 дней.",threshold:"≤7 дней",color:"bg-orange-200 text-orange-900"},{icon:n.jsx(ea,{className:"w-5 h-5"}),label:"Часы работы",value:hk(r.breakdown.weeklyHours),points:r.breakdown.weeklyHoursPoints,maxPoints:25,explanation:"20+ часов в неделю = 25% к рейтингу. 15-19 часов = 15%. Менее 15 часов = 0%. Показывает объем работы за неделю.",threshold:"≥20ч: 25% | ≥15ч: 15%",color:"bg-blue-200 text-blue-900"},{icon:n.jsx(ra,{className:"w-5 h-5"}),label:"Заработок",value:`${r.breakdown.weeklyEarnings.toFixed(2)} ₽`,points:r.breakdown.weeklyEarningsPoints,maxPoints:30,explanation:"6000+ ₽ в неделю = 30% к рейтингу. 3000-5999 ₽ = 15%. Менее 3000 ₽ = 0%. Основной показатель эффективности.",threshold:"≥6000₽: 30% | ≥3000₽: 15%",color:"bg-emerald-200 text-emerald-900"},{icon:n.jsx(ln,{className:"w-5 h-5"}),label:"Рефералы",value:`${r.breakdown.referrals} чел.`,points:r.breakdown.referralsPoints,maxPoints:30,explanation:"5% к рейтингу за каждого реферала. Максимум 30% (6 рефералов). Учитываются за последние 30 дней. Показывает активность по привлечению новых участников.",threshold:"5% за каждого (макс 30%)",color:"bg-pink-200 text-pink-900"},{icon:n.jsx(Gu,{className:"w-5 h-5"}),label:"Сообщения",value:`${r.breakdown.weeklyMessages} сообщений`,points:r.breakdown.weeklyMessagesPoints,maxPoints:15,explanation:"Более 50 сообщений в неделю в группе = 15% к рейтингу. Менее 50 = 0%. Учитываются все типы сообщений (текст, фото, стикеры и т.д.). Показывает активность в общении.",threshold:">50 сообщений",color:"bg-indigo-200 text-indigo-900"}]:[],E=T.reduce((P,O)=>P+O.points,0);return n.jsxs("div",{className:`rounded-2xl p-6 ${d} shadow-md border ${h} transition-colors`,children:[n.jsxs("div",{className:"mb-5 flex flex-col gap-3",children:[n.jsxs("div",{className:"flex items-start justify-between gap-3",children:[n.jsxs("div",{className:"min-w-0",children:[n.jsx("p",{className:`text-[11px] uppercase tracking-[0.12em] ${c}`,children:"Участник"}),n.jsx("h3",{className:`text-2xl font-bold ${l} truncate`,children:(a==null?void 0:a.name)||"Неизвестно"}),n.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[n.jsxs("span",{className:"text-lg font-bold",style:{color:i},children:[r.rating.toFixed(1),"%"]}),n.jsx("span",{className:"text-xl",children:N(r.rating)})]})]}),n.jsxs("div",{className:`px-3 py-2 rounded-lg text-xs font-semibold ${x} border ${h}`,children:["Последнее обновление",n.jsx("br",{}),n.jsx("span",{className:`${c}`,children:I?I.toLocaleDateString("ru-RU"):"—"})]})]}),n.jsxs("div",{children:[n.jsx("div",{className:"w-full bg-gray-200 dark:bg-gray-800 rounded-full h-6 overflow-hidden shadow-inner",children:n.jsx("div",{className:"h-full transition-all duration-500 flex items-center justify-center text-sm font-semibold text-white",style:{width:b,backgroundColor:i,minWidth:r.rating<=0?"40px":void 0},children:r.rating>=8&&n.jsxs("span",{children:[r.rating.toFixed(0),"%"]})})}),n.jsxs("div",{className:"flex justify-between mt-1",children:[n.jsx("span",{className:`text-xs ${c}`,children:"Общий рейтинг"}),n.jsxs("span",{className:`text-xs font-semibold ${c}`,children:[E,"/100 баллов"]})]})]})]}),r.breakdown&&n.jsxs("div",{className:"space-y-3 mb-6",children:[n.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[n.jsx(ws,{className:`w-5 h-5 ${c}`}),n.jsx("h4",{className:`text-lg font-semibold ${l}`,children:"Детальный разбор рейтинга"})]}),T.map((P,O)=>{const C=P.maxPoints>0?P.points/P.maxPoints*100:0,M=t===O;return n.jsxs("div",{className:`rounded-lg border ${h} overflow-hidden transition-all ${M?"shadow-md":""}`,children:[n.jsx("button",{onClick:()=>s(M?null:O),className:`w-full p-4 flex items-center justify-between ${m} transition-colors`,children:n.jsxs("div",{className:"flex items-center gap-3 flex-1 min-w-0",children:[n.jsx("div",{className:`p-2 rounded-lg ${P.color} flex-shrink-0`,children:P.icon}),n.jsxs("div",{className:"flex-1 min-w-0",children:[n.jsxs("div",{className:"flex items-center justify-between mb-1",children:[n.jsx("span",{className:`font-semibold ${l} truncate`,children:P.label}),n.jsxs("span",{className:`font-bold ml-2 ${P.points>0?"text-[#4E6E49]":"text-red-500"}`,children:[P.points,"/",P.maxPoints]})]}),n.jsx("div",{className:"w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden",children:n.jsx("div",{className:`h-full transition-all duration-300 ${P.color}`,style:{width:`${C}%`}})}),n.jsxs("div",{className:"flex items-center justify-between mt-1",children:[n.jsx("span",{className:`text-xs ${c} truncate mr-2`,children:P.value}),n.jsx("span",{className:`text-xs ${c} whitespace-nowrap`,children:P.threshold})]})]}),n.jsx(ur,{className:`w-4 h-4 flex-shrink-0 ml-2 ${c} transition-transform ${M?"rotate-180":""}`})]})}),M&&n.jsx("div",{className:`px-4 pb-4 pt-2 border-t ${h} ${x}`,children:n.jsx("p",{className:`text-sm ${c} leading-relaxed`,children:P.explanation})})]},O)})]}),n.jsxs("div",{className:`pt-4 border-t ${h}`,children:[n.jsx("h4",{className:`text-sm font-semibold mb-3 ${l}`,children:"Дополнительная статистика"}),n.jsxs("div",{className:"grid grid-cols-2 gap-3 text-sm",children:[n.jsxs("div",{className:`p-3 rounded-lg ${x}`,children:[n.jsx("div",{className:`text-xs ${c} mb-1`,children:"Заработок (месяц)"}),n.jsxs("div",{className:`text-lg font-bold ${l}`,children:[r.earnings.toFixed(0)," ₽"]})]}),n.jsxs("div",{className:`p-3 rounded-lg ${x}`,children:[n.jsx("div",{className:`text-xs ${c} mb-1`,children:"В пул"}),n.jsxs("div",{className:`text-lg font-bold ${l}`,children:[r.poolAmount.toFixed(0)," ₽"]})]})]})]})]})},_o=()=>`REF-${Math.random().toString(36).slice(2,8).toUpperCase()}`,Ek=({referral:r,onClose:e,onSave:t})=>{const{user:s}=At(),{theme:a}=Ze(),[i,l]=A.useState(""),[c,d]=A.useState(""),[h,m]=A.useState(""),[x,b]=A.useState(_o()),[I,N]=A.useState(""),[T,E]=A.useState(!1),[P,O]=A.useState(!1);A.useEffect(()=>{r?(l(r.name),d(String(r.age)),b(r.referralId),m(r.comment||"")):(l(""),d(""),m(""),b(_o()))},[r]);const C=!!r,M=C?"Редактировать реферала":"Добавить реферала",ee=a==="dark"?"bg-gray-700 hover:bg-gray-600 text-white":"bg-gray-200 hover:bg-gray-300 text-gray-900",Z=a==="dark"?"text-gray-300":"text-gray-700",j=a==="dark"?"text-white":"text-gray-900",y=async()=>{if(!r){if(!s){N("Пользователь не найден. Для добавления реферала необходимо войти как участник.");return}}if(!i.trim()||!c.trim()){N("Заполните имя и возраст");return}const f=Number(c);if(Number.isNaN(f)||f<16){N("Возраст должен быть числом не меньше 16");return}E(!0),N("");const _={referralId:x,ownerId:(r==null?void 0:r.ownerId)||s.id,name:i.trim(),age:f,createdAt:(r==null?void 0:r.createdAt)||new Date().toISOString(),...h.trim()&&{comment:h.trim()}};try{r?await W1(r.id,_):await q1(_),t()}catch(k){console.error("Error saving referral:",k);const p=k.message||k.code||"Не удалось сохранить реферала";N(p)}finally{E(!1)}},v=async()=>{if(r&&confirm(`Удалить реферала ${r.name}?`)){O(!0);try{await z1(r.id),t()}catch(f){console.error("Error deleting referral:",f);const _=f.message||f.code||"Не удалось удалить реферала";N(_)}finally{O(!1)}}};return n.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-[70] p-4 sm:py-0 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll",children:n.jsxs("div",{className:`w-full max-w-md rounded-lg shadow-xl ${a==="dark"?"bg-[#1a1a1a]":"bg-white"} max-h-[90vh] flex flex-col overflow-hidden`,children:[n.jsx("div",{className:"flex-shrink-0 p-6 pb-4",children:n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("h3",{className:`text-xl font-bold ${j}`,children:M}),n.jsx("button",{onClick:e,className:`p-2 rounded-lg flex-shrink-0 ${ee}`,"aria-label":"Закрыть",children:n.jsx(Xt,{className:"w-5 h-5"})})]})}),n.jsx("div",{className:"flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll px-6 pb-6",children:n.jsxs("div",{className:"space-y-4 min-w-0",children:[n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-medium mb-2 ${Z}`,children:"Имя"}),n.jsx("input",{type:"text",value:i,onChange:f=>l(f.target.value),className:`w-full px-4 py-2 rounded-lg border ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Введите имя"})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-medium mb-2 ${Z}`,children:"Возраст"}),n.jsx("input",{type:"number",value:c,onChange:f=>d(f.target.value),className:`w-full px-4 py-2 rounded-lg border ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"18",min:16})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-medium mb-2 ${Z}`,children:"Комментарий"}),n.jsx("textarea",{value:h,onChange:f=>m(f.target.value),rows:3,className:`w-full px-4 py-2 rounded-lg border ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Например, источник лида или статус"})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-medium mb-2 ${Z}`,children:"ID реферала"}),n.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[n.jsx("input",{type:"text",value:x,readOnly:C,onChange:f=>b(f.target.value),className:`flex-1 px-4 py-2 rounded-lg border ${a==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] ${C?"opacity-80 cursor-not-allowed":""}`}),!C&&n.jsxs("button",{type:"button",onClick:()=>b(_o()),className:"px-3 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors flex items-center justify-center gap-1 text-sm",children:[n.jsx(gf,{className:"w-4 h-4"}),"Новый"]})]}),n.jsx("p",{className:`text-xs mt-1 ${a==="dark"?"text-gray-400":"text-gray-500"}`,children:"ID генерируется автоматически и используется для учета."})]}),I&&n.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:I}),n.jsxs("div",{className:"flex flex-col sm:flex-row gap-3",children:[C&&n.jsxs("button",{onClick:v,disabled:P,className:"flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition-colors flex items-center justify-center gap-2",children:[n.jsx(It,{className:"w-4 h-4"}),P?"Удаление...":"Удалить"]}),n.jsx("button",{onClick:y,disabled:T,className:"flex-1 px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors",children:T?"Сохранение...":"Сохранить"}),n.jsx("button",{onClick:e,className:`px-4 py-2 rounded-lg transition-colors ${ee}`,children:"Отмена"})]})]})})]})})},jk=()=>{var j;const{theme:r}=Ze(),[e,t]=A.useState([]),[s,a]=A.useState(!0),[i,l]=A.useState([]),[c,d]=A.useState(!1),[h,m]=A.useState(null);A.useEffect(()=>{x()},[]);const x=async()=>{a(!0);try{const y=ba(),v=me(y.start,"yyyy-MM-dd"),f=me(y.end,"yyyy-MM-dd"),_=Tg(30),k=me(_.start,"yyyy-MM-dd"),p=me(_.end,"yyyy-MM-dd"),$=_.start.toISOString(),q=_.end.toISOString(),se=await xg(void 0,$,q);l(se);const B=[];for(const Y of Ne){const re=(await Jn(Y.id,v,f)).reduce((D,ue)=>{const je=ue.participants&&ue.participants.length>0?ue.participants.length:1;return D+ue.amount/je},0),he=await Jn(Y.id,k,p),K=he.reduce((D,ue)=>{const je=ue.participants&&ue.participants.length>0?ue.participants.length:1;return D+ue.amount/je},0),G=he.reduce((D,ue)=>{const je=ue.participants&&ue.participants.length>0?ue.participants.length:1;return D+ue.poolAmount/je},0),we=(await Rr(Y.id)).filter(D=>{const ue=D.date,je=D.endDate||D.date;return ue<=p&&je>=k}),H=we.filter(D=>D.type==="dayoff").reduce((D,ue)=>D+Qs(ue.date,ue.endDate,k,p),0),_e=we.filter(D=>D.type==="sick").reduce((D,ue)=>D+Qs(ue.date,ue.endDate,k,p),0),ye=we.filter(D=>D.type==="vacation").reduce((D,ue)=>D+Qs(ue.date,ue.endDate,k,p),0),R=(await Fr(Y.id)).filter(D=>D.date>=v&&D.date<=f).reduce((D,ue)=>D+Gi(ue.slots),0),L=await fg(Y.id,v,f),pe=(await pg(Y.id))[0]||{userId:Y.id,earnings:0,messages:0,initiatives:0,signals:0,profitableSignals:0,referrals:0,daysOff:0,sickDays:0,vacationDays:0,poolAmount:0,rating:0,lastUpdated:new Date().toISOString()},U=se.filter(D=>D.ownerId===Y.id).length,S={userId:Y.id,earnings:K,messages:pe.messages||0,initiatives:pe.initiatives||0,signals:pe.signals||0,profitableSignals:pe.profitableSignals||0,referrals:U,daysOff:H,sickDays:_e,vacationDays:ye,poolAmount:G,lastUpdated:new Date().toISOString()},Q=Cg(S,R,re,L),de=Rg(S,R,re,L);B.push({...S,rating:Q,breakdown:de})}B.sort((Y,ce)=>ce.rating-Y.rating),t(B)}catch(y){console.error("Error loading ratings:",y)}finally{a(!1)}},b=e.reduce((y,v)=>y+v.rating,0)/(e.length||1),I=r==="dark"?"text-white":"text-gray-900",N=r==="dark"?"text-gray-400":"text-gray-600",T=r==="dark"?"bg-[#111]":"bg-white",E=r==="dark"?"border-white/10":"border-gray-200",P=[{href:"#rating-team",label:"Команда",icon:"🌿"},{href:"#rating-ref",label:"Рефералы",icon:"🧲"},{href:"#rating-method",label:"Карточки",icon:"📇"}],O=[{label:"80-100%",title:"Эталон",desc:"Стабильный вклад, примеры для команды",tone:"text-emerald-700 dark:text-emerald-100",bg:"bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200/60 dark:border-emerald-700/60"},{label:"60-79%",title:"Уверенно",desc:"Держат темп, есть потенциал роста",tone:"text-blue-700 dark:text-blue-100",bg:"bg-blue-50 dark:bg-blue-900/40 border-blue-200/60 dark:border-blue-700/60"},{label:"40-59%",title:"В пути",desc:"Нужна точечная поддержка и фокус",tone:"text-amber-700 dark:text-amber-100",bg:"bg-amber-50 dark:bg-amber-900/40 border-amber-200/60 dark:border-amber-700/60"},{label:"0-39%",title:"Зона роста",desc:"Запускаем план восстановления",tone:"text-rose-700 dark:text-rose-100",bg:"bg-rose-50 dark:bg-rose-900/40 border-rose-200/60 dark:border-rose-700/60"}],C=A.useMemo(()=>[...e].sort((y,v)=>v.rating-y.rating),[e]),M=A.useMemo(()=>{var k,p;if(!e.length)return{top:0,median:0,count:0,high:0};const y=[...e].sort(($,q)=>q.rating-$.rating),v=((k=y[0])==null?void 0:k.rating)||0,f=((p=y[Math.floor((y.length-1)/2)])==null?void 0:p.rating)||v,_=y.filter($=>$.rating>=80).length;return{top:v,median:f,count:y.length,high:_}},[e]),ee=()=>{m(null),d(!0)},Z=y=>{m(y),d(!0)};return n.jsxs(sr,{children:[n.jsxs("div",{className:"space-y-6",children:[n.jsxs("div",{className:`rounded-2xl p-6 sm:p-8 ${T} shadow-xl border ${E} relative overflow-hidden`,children:[n.jsxs("div",{className:"absolute inset-0 opacity-60 pointer-events-none",children:[n.jsx("div",{className:"absolute -right-24 -top-24 h-72 w-72 bg-gradient-to-br from-emerald-400/10 via-blue-300/10 to-purple-300/10 blur-3xl"}),n.jsx("div",{className:"absolute -left-24 -bottom-24 h-64 w-64 bg-gradient-to-tr from-emerald-500/10 to-yellow-300/10 blur-3xl"})]}),n.jsxs("div",{className:"relative z-10 space-y-6",children:[n.jsxs("div",{className:"flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",children:[n.jsxs("div",{className:"space-y-3 max-w-3xl",children:[n.jsxs("div",{className:"flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-300",children:[n.jsx("span",{className:"h-2 w-2 rounded-full bg-emerald-500 animate-pulse"}),"Рейтинг команды"]}),n.jsx("h1",{className:`text-3xl sm:text-4xl font-extrabold ${I}`,children:"Обзор эффективности команды ApeVault Black OPS"}),n.jsx("p",{className:`text-sm sm:text-base leading-relaxed ${N}`,children:"7 ключевых метрик отражают вовлеченность, стабильность и вклад каждого. Все показатели обновляются автоматически, кроме добавления и удаления рефералов."})]}),n.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto",children:[{label:"Топ-1",value:`${M.top.toFixed(1)}%`,note:"лидер недели"},{label:"Медиана",value:`${M.median.toFixed(1)}%`,note:"ровный темп"},{label:"80%+",value:M.high,note:"устойчивые лидеры"}].map(y=>n.jsxs("div",{className:`rounded-xl border ${E} ${r==="dark"?"bg-white/5":"bg-gray-50"} p-3 flex flex-col gap-1`,children:[n.jsx("span",{className:`text-[11px] uppercase tracking-wide ${N}`,children:y.label}),n.jsx("span",{className:`text-2xl font-extrabold ${I}`,children:y.value}),n.jsx("span",{className:`text-xs ${N}`,children:y.note})]},y.label))})]}),n.jsx("div",{className:"flex flex-wrap gap-2",children:P.map(y=>n.jsxs("a",{href:y.href,className:`px-3 py-2 rounded-full text-sm font-semibold border ${E} transition flex items-center gap-2 ${r==="dark"?"bg-white/5 hover:bg-white/10 text-white":"bg-white hover:bg-gray-50 text-gray-800"}`,children:[n.jsx("span",{children:y.icon}),y.label]},y.href))}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3",children:O.map(y=>n.jsxs("div",{className:`rounded-xl border ${y.bg} p-3 transition`,children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("span",{className:`text-xs font-semibold ${N}`,children:y.label}),n.jsx("span",{className:"text-lg",children:"•"})]}),n.jsx("p",{className:`text-base font-semibold ${y.tone}`,children:y.title}),n.jsx("p",{className:`text-sm ${N}`,children:y.desc})]},y.label))}),n.jsxs("div",{className:"flex flex-col md:flex-row gap-3 md:items-center md:justify-between",children:[n.jsx("div",{className:`flex flex-wrap gap-2 text-xs ${N}`,children:["Выходные","Больничные","Отпуск","Часы","Заработок","Рефералы","Сообщения"].map(y=>n.jsx("span",{className:`px-3 py-1 rounded-full border ${E} ${r==="dark"?"bg-white/5":"bg-gray-50"}`,children:y},y))}),n.jsxs("button",{onClick:ee,className:"px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md w-full md:w-auto",children:[n.jsx("span",{className:"text-xl",children:"➕"}),n.jsx("span",{children:"Добавить реферала"})]})]})]})]}),n.jsxs("div",{id:"rating-team",className:`rounded-2xl p-6 sm:p-7 ${T} shadow-lg border ${E}`,children:[n.jsxs("div",{className:"flex flex-col gap-6 md:flex-row md:items-center md:justify-between",children:[n.jsxs("div",{className:"space-y-2",children:[n.jsx("p",{className:`text-xs uppercase tracking-[0.12em] ${N}`,children:"Команда"}),n.jsx("h3",{className:`text-2xl font-bold ${I}`,children:"Средний КПД за неделю"}),n.jsx("p",{className:`text-sm ${N}`,children:"Плавный прогресс-бар показывает динамику всей команды."})]}),n.jsxs("div",{className:"text-right",children:[n.jsxs("div",{className:"text-5xl font-extrabold text-emerald-600 dark:text-emerald-300",children:[b.toFixed(1),"%"]}),n.jsx("p",{className:`text-xs ${N}`,children:"из 100%"})]})]}),n.jsx("div",{className:"mt-6",children:n.jsx("div",{className:"w-full bg-gray-200 dark:bg-gray-800 rounded-full h-10 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner",children:n.jsx("div",{className:`h-full transition-all duration-500 flex items-center px-3 text-sm font-semibold text-white ${b>=80?"bg-emerald-600":b>=50?"bg-amber-500":"bg-blue-500"}`,style:{width:`${Math.min(b,100)}%`},children:b>=5&&n.jsxs("span",{children:[b.toFixed(1),"%"]})})})})]}),n.jsxs("div",{id:"rating-ref",className:`rounded-2xl p-6 sm:p-7 ${T} shadow-lg border ${E}`,children:[n.jsx("div",{className:"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4",children:n.jsxs("div",{className:"space-y-1",children:[n.jsx("p",{className:`text-xs uppercase tracking-[0.12em] ${N}`,children:"Рефералы · 30 дней"}),n.jsx("h3",{className:`text-2xl font-bold ${I}`,children:"Привлеченные участники"}),n.jsxs("p",{className:`text-sm ${N}`,children:["Всего добавлено: ",n.jsx("span",{className:"font-semibold",children:i.length})]})]})}),n.jsx("div",{className:"grid gap-3 md:grid-cols-2",children:Ne.map(y=>{const v=i.filter(f=>f.ownerId===y.id);return n.jsxs("div",{className:`p-4 rounded-xl border ${E} ${r==="dark"?"bg-white/5":"bg-gray-50"}`,children:[n.jsxs("div",{className:"flex items-center justify-between mb-3",children:[n.jsx("span",{className:`${I} font-semibold`,children:y.name}),n.jsxs("span",{className:`px-3 py-1 rounded-full text-sm font-bold ${v.length>0?r==="dark"?"bg-emerald-600/70 text-white":"bg-emerald-100 text-emerald-800":r==="dark"?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-600"}`,children:[v.length," ",v.length===1?"реферал":v.length<5?"реферала":"рефералов"]})]}),v.length>0&&n.jsx("div",{className:"space-y-2",children:v.map(f=>n.jsxs("div",{className:`rounded-lg border ${E} ${r==="dark"?"bg-[#0f0f0f]":"bg-white"} p-3 flex flex-col gap-2 transition-all hover:shadow-sm`,children:[n.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2",children:[n.jsxs("div",{className:"flex-1 min-w-0",children:[n.jsx("p",{className:`text-sm font-semibold ${I} truncate`,children:f.name}),n.jsxs("div",{className:"flex flex-wrap gap-2 text-xs",children:[n.jsxs("span",{className:`px-2 py-1 rounded ${r==="dark"?"bg-white/5":"bg-gray-100"} ${N}`,children:["ID: ",f.referralId]}),f.age&&n.jsxs("span",{className:`px-2 py-1 rounded ${r==="dark"?"bg-white/5":"bg-gray-100"} ${N}`,children:[f.age," лет"]}),n.jsx("span",{className:`px-2 py-1 rounded ${r==="dark"?"bg-white/5":"bg-gray-100"} ${N}`,children:new Date(f.createdAt).toLocaleDateString("ru-RU")})]})]}),n.jsx("button",{onClick:()=>Z(f),className:"self-start sm:self-auto px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-semibold",children:"Редактировать"})]}),f.comment&&n.jsx("div",{className:`mt-1 pt-2 border-t ${E}`,children:n.jsxs("p",{className:`text-xs ${N} italic`,children:["💬 ",f.comment]})})]},f.id))})]},y.id)})})]}),n.jsxs("div",{id:"rating-method",className:`rounded-2xl p-6 sm:p-7 ${T} shadow-lg border ${E}`,children:[n.jsx("div",{className:"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4",children:n.jsxs("div",{className:"space-y-1",children:[n.jsx("p",{className:`text-xs uppercase tracking-[0.12em] ${N}`,children:"Карточки участников"}),n.jsx("h3",{className:`text-2xl font-bold ${I}`,children:"Детальная статистика"})]})}),s?n.jsxs("div",{className:`rounded-xl p-12 text-center ${r==="dark"?"bg-white/5":"bg-gray-50"} border ${E}`,children:[n.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"}),n.jsx("p",{className:`text-lg font-semibold ${I}`,children:"Загрузка рейтинга..."}),n.jsx("p",{className:`text-sm ${N} mt-2`,children:"Подождите, собираем статистику"})]}):n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6",children:[{label:"Топ-1",value:(j=C[0])!=null&&j.rating?`${C[0].rating.toFixed(1)}%`:"—"},{label:"Средний рейтинг",value:`${b.toFixed(1)}%`},{label:"Медиана",value:`${M.median.toFixed(1)}%`},{label:"Участников",value:C.length}].map(y=>n.jsxs("div",{className:`rounded-xl border ${E} ${r==="dark"?"bg-white/5":"bg-gray-50"} px-4 py-3`,children:[n.jsx("p",{className:`text-[11px] uppercase tracking-wide ${N}`,children:y.label}),n.jsx("p",{className:`text-2xl font-extrabold ${I}`,children:y.value})]},y.label))}),n.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5",children:C.map((y,v)=>n.jsxs("div",{className:"relative",children:[v<=2&&n.jsx("div",{className:"absolute -top-3 -right-3",children:n.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-bold border ${E} ${v===0?"bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100":v===1?"bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-100":"bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100"}`,children:v===0?"1 место":v===1?"2 место":"3 место"})}),n.jsx(Nk,{rating:y})]},y.userId))})]})]})]}),c&&n.jsx(Ek,{referral:h,onClose:()=>{d(!1),m(null)},onSave:()=>{d(!1),m(null),x()}})]})},Ki={trading:Yp,learning:Io,technical:Jp,stream:Xu,research:tf,organization:Xp},Ik=({onClose:r,onSave:e,editingTask:t})=>{var Oe;const{user:s}=At(),{isAdmin:a}=Vt(),{theme:i}=Ze(),l=!!t,c=i==="dark"?"text-white":"text-gray-900",d=i==="dark"?"bg-[#1a1a1a]":"bg-white",h=i==="dark"?"bg-gray-700":"bg-gray-50",m=i==="dark"?"border-gray-800":"border-gray-300",[x,b]=A.useState((t==null?void 0:t.title)||""),[I,N]=A.useState((t==null?void 0:t.description)||""),[T,E]=A.useState((t==null?void 0:t.category)||"trading"),[P,O]=A.useState((t==null?void 0:t.priority)||"medium"),[C,M]=A.useState((t==null?void 0:t.dueDate)||me(new Date,"yyyy-MM-dd")),[ee,Z]=A.useState((t==null?void 0:t.dueTime)||"12:00"),[j,y]=A.useState((t==null?void 0:t.startTime)||"09:00"),[v,f]=A.useState((t==null?void 0:t.mainExecutor)||""),[_,k]=A.useState((t==null?void 0:t.deputies)||[]),[p,$]=A.useState((t==null?void 0:t.executors)||[]),[q,se]=A.useState((t==null?void 0:t.curators)||[]),[B,Y]=A.useState((t==null?void 0:t.leads)||[]),ce={id:"stage-1",name:"Этап 1",responsible:"all",approvals:(t==null?void 0:t.approvals)||[],status:"pending"},[re,he]=A.useState(t!=null&&t.stages&&t.stages.length>0?t.stages:[ce]),[K,G]=A.useState((t==null?void 0:t.currentStageId)||((Oe=re[0])==null?void 0:Oe.id)||"stage-1"),xe=t&&t.assignees&&t.assignees.length>0?t.assignees:t?t.assignedTo.map(F=>({userId:F,priority:"medium"})):[],[we,H]=A.useState(xe),[_e,ye]=A.useState(""),[Ee,X]=A.useState(!1);gn();const R=[{value:"high",label:"Высокий",desc:"Нужен приоритет и быстрый старт",tone:i==="dark"?"bg-red-500/15 border-red-500/40 text-red-100":"bg-red-50 border-red-200 text-red-700"},{value:"medium",label:"Средний",desc:"Стандартный приоритет, плановый слот",tone:i==="dark"?"bg-amber-500/15 border-amber-500/40 text-amber-100":"bg-amber-50 border-amber-200 text-amber-700"},{value:"low",label:"Низкий",desc:"Можно параллельно с другими задачами",tone:i==="dark"?"bg-gray-500/15 border-gray-500/40 text-gray-100":"bg-gray-50 border-gray-200 text-gray-700"}],L=F=>{we.find(ae=>ae.userId===F)?H(ae=>ae.filter(ne=>ne.userId!==F)):H(ae=>[...ae,{userId:F,priority:"medium"}])},ge=()=>{we.length===Ne.length?H([]):H(Ne.map(F=>({userId:F.id,priority:"medium"})))},pe=(F,ae)=>{H(ne=>ne.map(be=>be.userId===F?{...be,priority:ae}:be))},U=(F,ae)=>{H(ne=>ne.map(be=>be.userId===F?{...be,comment:ae}:be))},S=(F,ae,ne)=>{ae.includes(F)?ne(ae.filter(be=>be!==F)):ne([...ae,F])},Q=(F,ae)=>{k(ne=>ne.map(be=>be.userId===F?{...be,responsibility:ae}:be))},de=(F,ae)=>{he(ne=>ne.map(be=>be.id===F?{...be,...ae}:be))},D=(F,ae)=>{he(ne=>ne.map(be=>{if(be.id!==F||be.responsible==="all")return be;const Ye=be.responsible||[],at=Ye.includes(ae)?Ye.filter(yt=>yt!==ae):[...Ye,ae];return{...be,responsible:at}}))},ue=()=>{const F={id:`stage-${Date.now()}`,name:`Этап ${re.length+1}`,responsible:"all",approvals:[],status:"pending"};he(ae=>[...ae,F]),K||G(F.id)},je=F=>{var ne;if(re.length===1)return;const ae=re.filter(be=>be.id!==F);he(ae),K===F&&G(((ne=ae[0])==null?void 0:ne.id)||"")},Ue=async()=>{if(!a&&!s){ye("Пользователь не найден");return}ye(""),X(!0);try{if(!x.trim()){ye("Введите название задачи"),X(!1);return}if(we.length===0&&!v){ye("Выберите хотя бы одного участника"),X(!1);return}if(!C){ye("Укажите дату дедлайна"),X(!1);return}if(!j){ye("Укажите время начала"),X(!1);return}if(!ee){ye("Укажите время дедлайна"),X(!1);return}if(!v){ye("Выберите главного исполнителя"),X(!1);return}const F=new Date().toISOString(),ae=(s==null?void 0:s.id)||"admin",ne=Array.from(new Set([...we.map(He=>He.userId),...v?[v]:[],..._.map(He=>He.userId),...p,...q,...B])),be=He=>{const Me=(He.responsible==="all"?ne:He.responsible).map(fe=>{var ut;return((ut=He.approvals)==null?void 0:ut.find(_r=>_r.userId===fe))||{userId:fe,status:"pending",updatedAt:F}});return{...He,approvals:Me,status:He.status||"pending"}},Ye=re.map(be),at=Ye[0],yt=K||(at==null?void 0:at.id)||"stage-1";if(l&&t){const He={title:x.trim(),description:I.trim()||void 0,category:T,priority:P,assignedTo:ne,assignees:we,approvals:at?at.approvals:[],stages:Ye,currentStageId:yt,mainExecutor:v||void 0,deputies:_,executors:p,curators:q,leads:B,dueDate:C,dueTime:ee,startTime:j,updatedAt:F};await Tr(t.id,He)}else{const He={title:x.trim(),description:I.trim()||void 0,category:T,status:"pending",createdBy:ae,assignedTo:ne,assignees:we,approvals:at?at.approvals:[],stages:Ye,currentStageId:yt,mainExecutor:v||void 0,deputies:_,executors:p,curators:q,leads:B,createdAt:F,updatedAt:F,priority:P,dueDate:C,dueTime:ee,startTime:j};await Y1(He)}e()}catch(F){console.error("Error saving task:",F),ye("Ошибка при сохранении задачи"),X(!1)}};return n.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto overscroll-contain modal-scroll",children:n.jsx("div",{className:`${d} rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100dvh-96px)] sm:max-h-[calc(100dvh-96px)] overflow-hidden border-2 ${i==="dark"?"border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]":"border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white"} relative`,children:n.jsxs("div",{className:"flex flex-col h-full min-h-0",children:[n.jsxs("div",{className:`sticky top-0 ${d} border-b ${m} p-4 sm:p-6 flex items-center justify-between z-10`,children:[n.jsxs("h2",{className:`text-xl sm:text-2xl font-bold ${c} flex items-center gap-2`,children:[n.jsx(Wu,{className:"w-5 h-5 sm:w-6 sm:h-6"}),l?"Редактировать задачу":"Новая задача"]}),n.jsx("button",{onClick:r,className:`p-2 rounded-lg transition-colors ${i==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"}`,children:n.jsx(Xt,{className:"w-5 h-5"})})]}),n.jsxs("div",{className:"p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 min-h-0 overflow-y-auto overscroll-contain modal-scroll pb-10",children:[_e&&n.jsxs("div",{className:"p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-500",children:[n.jsx(sl,{className:"w-5 h-5 flex-shrink-0"}),n.jsx("span",{className:"text-sm",children:_e})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-medium mb-2 ${c}`,children:"Название задачи *"}),n.jsx("input",{type:"text",value:x,onChange:F=>b(F.target.value),className:`w-full px-4 py-2.5 rounded-lg border ${m} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`,placeholder:"Введите название задачи"})]}),we.length>0&&n.jsxs("div",{className:"space-y-3",children:[n.jsx("label",{className:`block text-sm font-medium ${c}`,children:"Приоритеты и комментарии"}),n.jsx("div",{className:"space-y-3",children:we.map(F=>{const ae=Ne.find(ne=>ne.id===F.userId);return n.jsxs("div",{className:`p-3 rounded-lg border ${m} ${h} space-y-2`,children:[n.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2",children:[n.jsxs("div",{className:"text-sm font-medium",children:[(ae==null?void 0:ae.name)||"Участник"," ",n.jsxs("span",{className:"text-xs text-gray-500",children:["(",(ae==null?void 0:ae.login)||(ae==null?void 0:ae.id)||"—",")"]})]}),n.jsxs("select",{value:F.priority,onChange:ne=>pe(F.userId,ne.target.value),className:`px-3 py-1.5 rounded-lg border ${m} ${i==="dark"?"bg-[#1a1a1a] text-gray-100":"bg-white text-gray-700"}`,children:[n.jsx("option",{value:"low",children:"Низкий приоритет"}),n.jsx("option",{value:"medium",children:"Средний приоритет"}),n.jsx("option",{value:"high",children:"Высокий приоритет"})]})]}),n.jsx("textarea",{value:F.comment||"",onChange:ne=>U(F.userId,ne.target.value),rows:2,className:`w-full px-3 py-2 rounded-lg border ${m} ${i==="dark"?"bg-[#1a1a1a] text-gray-100":"bg-white text-gray-700"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`,placeholder:"Комментарий для исполнителя (необязательно)"})]},F.userId)})})]}),n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-medium mb-2 ${c}`,children:"Описание"}),n.jsx("textarea",{value:I,onChange:F=>N(F.target.value),rows:4,className:`w-full px-4 py-2.5 rounded-lg border ${m} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all resize-none`,placeholder:"Добавьте описание задачи (необязательно)"})]}),n.jsxs("div",{className:"grid grid-cols-1 gap-4 sm:gap-6",children:[n.jsxs("div",{className:"space-y-3",children:[n.jsx("div",{className:"flex items-center justify-between",children:n.jsxs("label",{className:`block text-sm font-medium ${c} flex items-center gap-2`,children:[n.jsx(yf,{className:"w-4 h-4"}),"Категория"]})}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3",children:Object.entries(ei).map(([F,{label:ae}])=>{const ne=Ki[F],be=T===F;return n.jsx("button",{type:"button",onClick:()=>E(F),className:`p-3 rounded-lg border-2 text-sm font-semibold transition-all text-center leading-tight whitespace-normal ${be?i==="dark"?"border-[#4E6E49] bg-[#4E6E49]/15 text-[#4E6E49]":"border-[#4E6E49] bg-green-50 text-[#4E6E49]":i==="dark"?"border-gray-800 bg-gray-900 text-gray-200 hover:border-[#4E6E49]/40":"border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/40"} flex flex-col items-center gap-2`,children:n.jsxs("span",{className:"flex items-center gap-2 justify-center",children:[n.jsx(ne,{className:"w-4 h-4"}),n.jsx("span",{className:"break-words",children:ae})]})},F)})})]}),n.jsxs("div",{className:"space-y-3",children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsxs("label",{className:`block text-sm font-medium ${c} flex items-center gap-2`,children:[n.jsx(Bt,{className:"w-4 h-4"}),"Приоритет"]}),n.jsx("span",{className:`text-[11px] ${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"Влияет на порядок в списке и уведомления"})]}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3",children:R.map(F=>n.jsxs("button",{type:"button",onClick:()=>O(F.value),className:`p-3 rounded-lg border-2 text-left transition-all ${F.tone} ${P===F.value?"ring-2 ring-offset-2 ring-[#4E6E49] dark:ring-offset-[#1a1a1a]":""}`,children:[n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("span",{className:"font-semibold text-sm",children:F.label}),P===F.value&&n.jsx("span",{className:"text-xs font-semibold",children:"выбрано"})]}),n.jsx("p",{className:"text-xs mt-1 leading-snug opacity-80",children:F.desc})]},F.value))})]})]}),n.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:[n.jsxs("div",{className:"p-3 rounded-lg border-2 flex flex-col gap-2 transition-all shadow-sm bg-white/60 dark:bg-[#1a1a1a]/60",style:{borderColor:i==="dark"?"#2f2f2f":"#e5e7eb"},children:[n.jsxs("label",{className:`text-sm font-medium ${c} flex items-center gap-2`,children:[n.jsx(rl,{className:"w-4 h-4"}),"Время начала *"]}),n.jsx("input",{type:"time",value:j,onChange:F=>y(F.target.value),required:!0,className:`w-full px-4 py-2.5 rounded-lg border ${m} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}),n.jsx("p",{className:`text-[11px] leading-snug ${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"Помогает планировать последовательность задач и уведомлений."})]}),n.jsxs("div",{className:"p-3 rounded-lg border-2 flex flex-col gap-2 transition-all shadow-sm bg-white/60 dark:bg-[#1a1a1a]/60",style:{borderColor:i==="dark"?"#2f2f2f":"#e5e7eb"},children:[n.jsxs("label",{className:`text-sm font-medium ${c} flex items-center gap-2`,children:[n.jsx(Pr,{className:"w-4 h-4"}),"Дата дедлайна *"]}),n.jsx("input",{type:"date",value:C,onChange:F=>M(F.target.value),min:me(new Date,"yyyy-MM-dd"),required:!0,className:`w-full px-4 py-2.5 rounded-lg border ${m} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}),n.jsx("p",{className:`text-[11px] leading-snug ${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"Ограничение по датам учитывает сегодняшнюю дату автоматически."})]}),n.jsxs("div",{className:"p-3 rounded-lg border-2 flex flex-col gap-2 transition-all shadow-sm bg-white/60 dark:bg-[#1a1a1a]/60",style:{borderColor:i==="dark"?"#2f2f2f":"#e5e7eb"},children:[n.jsxs("label",{className:`text-sm font-medium ${c} flex items-center gap-2`,children:[n.jsx(ea,{className:"w-4 h-4"}),"Время дедлайна *"]}),n.jsx("input",{type:"time",value:ee,onChange:F=>Z(F.target.value),required:!0,className:`w-full px-4 py-2.5 rounded-lg border ${m} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}),n.jsx("p",{className:`text-[11px] leading-snug ${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"Добавьте время, чтобы вся команда понимала, когда итог должен быть готов."})]})]}),n.jsxs("div",{className:"space-y-4",children:[n.jsxs("div",{children:[n.jsx("label",{className:`block text-sm font-medium mb-2 ${c}`,children:"Главный исполнитель *"}),n.jsxs("select",{value:v,onChange:F=>f(F.target.value),className:`w-full px-4 py-2.5 rounded-lg border ${m} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`,children:[n.jsx("option",{value:"",children:"Выберите главного"}),Ne.map(F=>n.jsxs("option",{value:F.id,children:[F.name," (",F.login,")"]},F.id))]})]}),n.jsxs("div",{className:"space-y-3",children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("label",{className:`block text-sm font-medium ${c}`,children:"Замы (несколько)"}),n.jsx("span",{className:"text-xs text-gray-500",children:"Добавьте зоны ответственности"})]}),n.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3",children:Ne.map(F=>{var ne;const ae=_.some(be=>be.userId===F.id);return n.jsxs("button",{type:"button",onClick:()=>{k(ae?be=>be.filter(Ye=>Ye.userId!==F.id):be=>[...be,{userId:F.id,responsibility:""}])},className:`p-3 rounded-lg border-2 transition-all text-left ${ae?i==="dark"?"border-[#4E6E49] bg-[#4E6E49]/20":"border-[#4E6E49] bg-green-50":`${m} ${h}`}`,children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("div",{className:`w-2 h-2 rounded-full ${ae?"bg-[#4E6E49]":"bg-gray-400"}`}),n.jsx("span",{className:`text-sm font-medium ${ae?"text-[#4E6E49]":c}`,children:F.name})]}),ae&&n.jsx("input",{value:((ne=_.find(be=>be.userId===F.id))==null?void 0:ne.responsibility)||"",onChange:be=>Q(F.id,be.target.value),className:`mt-2 w-full px-2 py-1.5 rounded border ${m} ${i==="dark"?"bg-[#1a1a1a] text-gray-100":"bg-white text-gray-700"}`,placeholder:"Зона ответственности"})]},F.id)})})]}),n.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[{label:"Исполнители",list:p,setter:$},{label:"Кураторы",list:q,setter:se},{label:"Ведущие",list:B,setter:Y}].map(F=>n.jsxs("div",{className:"space-y-2",children:[n.jsx("div",{className:"flex items-center justify-between",children:n.jsx("label",{className:`text-sm font-medium ${c}`,children:F.label})}),n.jsx("div",{className:"grid grid-cols-2 gap-2",children:Ne.map(ae=>{const ne=F.list.includes(ae.id);return n.jsx("button",{type:"button",onClick:()=>S(ae.id,F.list,F.setter),className:`p-2 rounded-lg border text-left text-sm transition-all ${ne?i==="dark"?"border-[#4E6E49] bg-[#4E6E49]/20":"border-[#4E6E49] bg-green-50":`${m} ${h}`}`,children:n.jsx("span",{className:ne?"text-[#4E6E49]":c,children:ae.name})},ae.id)})})]},F.label))})]}),n.jsxs("div",{children:[n.jsxs("div",{className:"flex items-center justify-between mb-2",children:[n.jsxs("label",{className:`block text-sm font-medium ${c} flex items-center gap-2`,children:[n.jsx(ln,{className:"w-4 h-4"}),"Участники *"]}),n.jsx("button",{type:"button",onClick:ge,className:`text-xs sm:text-sm px-3 py-1 rounded-lg transition-colors ${i==="dark"?"bg-gray-700 hover:bg-gray-600 text-gray-300":"bg-gray-200 hover:bg-gray-300 text-gray-700"}`,children:we.length===Ne.length?"Снять выделение":"Выбрать всех"})]}),n.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3",children:Ne.map(F=>{const ae=we.some(ne=>ne.userId===F.id);return n.jsx("button",{type:"button",onClick:()=>L(F.id),className:`p-3 rounded-lg border-2 transition-all text-left ${ae?i==="dark"?"border-[#4E6E49] bg-[#4E6E49]/20":"border-[#4E6E49] bg-green-50":`${m} ${h}`}`,children:n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("div",{className:`w-2 h-2 rounded-full ${ae?"bg-[#4E6E49]":"bg-gray-400"}`}),n.jsx("span",{className:`text-sm font-medium ${ae?"text-[#4E6E49]":c}`,children:F.name})]})},F.id)})})]}),n.jsxs("div",{className:"space-y-3",children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("label",{className:`block text-sm font-medium ${c}`,children:"Этапы согласования"}),n.jsx("button",{type:"button",onClick:ue,className:`px-3 py-1.5 rounded-lg text-xs font-semibold ${i==="dark"?"bg-gray-700 hover:bg-gray-600 text-gray-200":"bg-gray-200 hover:bg-gray-300 text-gray-800"}`,children:"Добавить этап"})]}),n.jsx("div",{className:"space-y-3",children:re.map((F,ae)=>n.jsxs("div",{className:`p-3 rounded-lg border-2 ${m} ${h}`,children:[n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("input",{value:F.name,onChange:ne=>de(F.id,{name:ne.target.value}),className:`flex-1 px-3 py-2 rounded-lg border ${m} ${i==="dark"?"bg-[#1a1a1a] text-gray-100":"bg-white text-gray-700"}`,placeholder:`Этап ${ae+1}`}),re.length>1&&n.jsx("button",{type:"button",onClick:()=>je(F.id),className:`px-2 py-1 text-xs rounded-lg ${i==="dark"?"bg-red-500/20 text-red-300 hover:bg-red-500/30":"bg-red-100 text-red-700 hover:bg-red-200"}`,children:"Удалить"})]}),n.jsx("textarea",{value:F.description||"",onChange:ne=>de(F.id,{description:ne.target.value}),rows:2,className:`mt-2 w-full px-3 py-2 rounded-lg border ${m} ${i==="dark"?"bg-[#1a1a1a] text-gray-100":"bg-white text-gray-700"}`,placeholder:"Описание этапа (опционально)"}),n.jsxs("div",{className:"mt-2 space-y-2",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("label",{className:`text-sm font-medium ${c}`,children:"Ответственные:"}),n.jsxs("label",{className:"inline-flex items-center gap-2 text-xs",children:[n.jsx("input",{type:"checkbox",checked:F.responsible==="all",onChange:ne=>de(F.id,{responsible:ne.target.checked?"all":[]})}),"Все участники"]})]}),F.responsible!=="all"&&n.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:Ne.map(ne=>{const Ye=(Array.isArray(F.responsible)?F.responsible:[]).includes(ne.id);return n.jsx("button",{type:"button",onClick:()=>D(F.id,ne.id),className:`p-2 rounded-lg border text-left text-sm transition-all ${Ye?i==="dark"?"border-[#4E6E49] bg-[#4E6E49]/20":"border-[#4E6E49] bg-green-50":`${m} ${h}`}`,children:n.jsx("span",{className:Ye?"text-[#4E6E49]":c,children:ne.name})},ne.id)})})]})]},F.id))})]}),n.jsxs("div",{className:`flex flex-col sm:flex-row gap-3 pt-4 border-t ${m}`,children:[n.jsx("button",{onClick:Ue,disabled:Ee,className:`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${Ee?"bg-gray-400 cursor-not-allowed":"bg-gradient-to-r from-[#4E6E49] to-emerald-700 hover:from-[#4E6E49] hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"}`,children:Ee?"Сохранение...":l?"Сохранить изменения":"Создать задачу"}),n.jsx("button",{onClick:r,className:`px-6 py-3 rounded-lg font-semibold transition-colors ${i==="dark"?"bg-gray-700 hover:bg-gray-600 text-gray-300":"bg-gray-200 hover:bg-gray-300 text-gray-700"}`,children:"Отмена"})]})]})]})})})},sc=60*1e3,Zn=60*sc,Ru=24*Zn,Tk=r=>{if(r<=0)return"Просрочено";const e=Math.floor(r/Ru),t=Math.floor(r%Ru/Zn),s=Math.floor(r%Zn/sc);return e>0?`${e}д ${t}ч`:t>0?`${t}ч ${s}м`:`${Math.max(s,1)}м`},Sk=r=>r<=0?"overdue":r<=Zn?"urgent":r<=6*Zn?"soon":"on_track",ko=(r,e)=>{if(!r||!e)return{label:"—",status:"unknown",isOverdue:!1};const s=new Date(`${r}T${e}`).getTime()-Date.now();if(Number.isNaN(s))return{label:"—",status:"unknown",isOverdue:!1};const a=Sk(s);return{label:Tk(s),status:a,isOverdue:a==="overdue"}},Ak=(r,e)=>{const t=A.useMemo(()=>ko(r,e),[r,e]),[s,a]=A.useState(t);return A.useEffect(()=>{a(ko(r,e));const i=setInterval(()=>{a(ko(r,e))},sc);return()=>clearInterval(i)},[r,e]),s},Ck=(r,e)=>e==="dark"?{overdue:"bg-red-500/10 border-red-500/40 text-red-300",urgent:"bg-orange-500/10 border-orange-500/40 text-orange-200",soon:"bg-yellow-500/10 border-yellow-500/40 text-yellow-200",on_track:"bg-[#4E6E49]/10 border-[#4E6E49]/40 text-green-200",unknown:"bg-gray-600/30 border-gray-500/40 text-gray-200"}[r]:{overdue:"bg-red-50 border-red-200 text-red-600",urgent:"bg-orange-50 border-orange-200 text-orange-600",soon:"bg-yellow-50 border-yellow-200 text-yellow-700",on_track:"bg-green-50 border-green-200 text-[#4E6E49]",unknown:"bg-gray-100 border-gray-200 text-gray-600"}[r],Dg=({dueDate:r,dueTime:e,theme:t,size:s="default"})=>{const{label:a,status:i}=Ak(r,e),l=Ck(i,t),c=s==="compact"?"px-2 py-0.5 text-[11px]":"px-2.5 py-1 text-xs sm:text-sm",d=s==="compact"?"w-3 h-3":"w-4 h-4";return n.jsxs("span",{className:`inline-flex items-center gap-1 rounded-full border font-medium ${c} ${l}`,children:[n.jsx(ea,{className:d}),a]})},Rk=({task:r,onEdit:e,onDelete:t,onUpdate:s})=>{const{user:a}=At(),{isAdmin:i}=Vt(),{theme:l}=Ze(),[c,d]=A.useState(!1),[h,m]=A.useState(!1),[x,b]=A.useState(""),[I,N]=A.useState(""),[T,E]=A.useState("stage"),P=l==="dark"?"text-white":"text-gray-900",O=l==="dark"?"bg-[#1a1a1a]":"bg-white",C=l==="dark"?"border-gray-800":"border-gray-300",M=ei[r.category],ee=Fn[r.status],Z=Ki[r.category],j=Ne.find(X=>X.id===r.createdBy),y=r.assignees&&r.assignees.length>0?r.assignees:r.assignedTo.map(X=>({userId:X,priority:"medium"})),v=y.map(X=>X.userId),f=y.map(X=>{const R=Ne.find(L=>L.id===X.userId);return R?{...X,member:R}:null}).filter(Boolean),_=i||(a==null?void 0:a.id)===r.createdBy,k=()=>{var R;const X=[r.mainExecutor,...((R=r.deputies)==null?void 0:R.map(L=>L.userId))||[],...r.executors||[],...r.curators||[],...r.leads||[]].filter(Boolean);return Array.from(new Set([...r.assignedTo||[],...X]))},$=(()=>{if(r.stages&&r.stages.length>0){const X=r.currentStageId||r.stages[0].id;return r.stages.find(R=>R.id===X)||r.stages[0]}return{id:"legacy-stage",name:"Этап",responsible:"all",approvals:r.approvals||[],status:r.status==="rejected"?"rejected":"pending"}})(),q=$.approvals||[],se=q.filter(X=>X.status==="approved").length,B=q.length,Y=r.status!=="closed"&&r.status!=="completed"&&!!a&&($.responsible==="all"?k():$.responsible).includes(a.id),ce=q.find(X=>X.userId===(a==null?void 0:a.id)),re=!!a&&(a.id===r.mainExecutor||a.id===r.createdBy||i),he=()=>!r.stages||r.stages.length===0?q.every(X=>X.status==="approved"):r.stages.every(X=>X.status==="approved"),K=he(),G=async X=>{if(!(!a&&!i)){d(!0);try{const R=new Date().toISOString(),L={status:X,updatedAt:R};if(X==="completed")L.completedAt=R,L.completedBy=(a==null?void 0:a.id)||"admin";else if(X==="closed")L.closedAt=R;else if(X==="in_progress"&&!he()){d(!1);return}await Tr(r.id,L),s()}catch(R){console.error("Error updating task status:",R)}finally{d(!1)}}},xe=async(X,R)=>{if(a){d(!0);try{const L=new Date().toISOString(),ge=X==="approve"?"approved":"rejected",pe=X==="reject"?(x||"").trim():"",U=k(),S=$.responsible==="all"?U:$.responsible,Q=q,de=R?S.map(F=>({...Q.find(be=>be.userId===F)||{userId:F,status:"pending",updatedAt:L},status:ge,updatedAt:L,forAll:!0,...pe?{comment:pe}:{}})):Q.map(F=>F.userId===a.id?{...F,status:ge,updatedAt:L,...pe?{comment:pe}:{comment:F.comment}}:F);if(!R&&!Q.find(F=>F.userId===a.id)){const F={userId:a.id,status:ge,updatedAt:L};de.push(pe?{...F,comment:pe}:F)}let D=r.stages||[];D.length>0&&(D=D.map(F=>F.id===$.id?{...F,approvals:de,status:de.some(ae=>ae.status==="rejected")?"rejected":de.every(ae=>ae.status==="approved")?"approved":"pending"}:F));const ue=de.every(F=>F.status==="approved"),je=de.some(F=>F.status==="rejected");let Ue=r.currentStageId;if(ue&&!je&&D.length>0){const F=D.findIndex(ne=>ne.id===$.id);if(F>=0&&F<D.length-1){const ne=D[F+1],be=ne.responsible==="all"?U:ne.responsible;D[F+1]={...ne,approvals:be.map(Ye=>({userId:Ye,status:"pending",updatedAt:L})),status:"pending"},Ue=ne.id}}const Oe={approvals:de,stages:D.length>0?D:void 0,currentStageId:Ue,updatedAt:L};X==="reject"||je?Oe.status="rejected":X==="approve"&&he()&&(Oe.status="in_progress"),await Tr(r.id,Oe),X==="reject"&&(m(!1),b("")),s()}catch(L){console.error("Error approving task:",L)}finally{d(!1)}}},we=async()=>{if(a&&I.trim()){d(!0);try{const X=new Date().toISOString(),R={id:`c-${Date.now()}`,userId:a.id,text:I.trim(),createdAt:X,stageId:T==="stage"?$.id:void 0},L={comments:[...r.comments||[],R],updatedAt:X};R.stageId&&r.stages&&r.stages.length>0&&(L.stages=r.stages.map(ge=>ge.id===R.stageId?{...ge,comments:[...ge.comments||[],R]}:ge)),await Tr(r.id,L),N(""),s()}catch(X){console.error("Error adding comment:",X)}finally{d(!1)}}},H=()=>{switch(r.priority){case"high":return l==="dark"?"text-red-400":"text-red-600";case"medium":return l==="dark"?"text-yellow-400":"text-yellow-600";case"low":return l==="dark"?"text-gray-400":"text-gray-600"}},_e=X=>({high:{label:"Высокий",classes:l==="dark"?"bg-red-500/20 text-red-300 border-red-500/40":"bg-red-50 text-red-600 border-red-200"},medium:{label:"Средний",classes:l==="dark"?"bg-yellow-500/20 text-yellow-300 border-yellow-500/40":"bg-yellow-50 text-yellow-700 border-yellow-200"},low:{label:"Низкий",classes:l==="dark"?"bg-gray-500/20 text-gray-300 border-gray-500/40":"bg-gray-50 text-gray-700 border-gray-200"}})[X],ye=()=>({pending:l==="dark"?"bg-yellow-500/20 border-yellow-500/50 text-yellow-400":"bg-yellow-50 border-yellow-200 text-yellow-700",in_progress:l==="dark"?"bg-blue-500/20 border-blue-500/50 text-blue-400":"bg-blue-50 border-blue-200 text-blue-700",completed:l==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49]/50 text-[#4E6E49]":"bg-green-50 border-green-200 text-[#4E6E49]",closed:l==="dark"?"bg-gray-500/20 border-gray-500/50 text-gray-400":"bg-gray-50 border-gray-200 text-gray-700",rejected:l==="dark"?"bg-red-500/20 border-red-500/50 text-red-400":"bg-red-50 border-red-200 text-red-700"})[r.status],Ee=()=>{const X={green:{bg:l==="dark"?"bg-[#4E6E49]/20":"bg-green-50",text:"text-[#4E6E49]"},blue:{bg:l==="dark"?"bg-blue-500/20":"bg-blue-50",text:l==="dark"?"text-blue-400":"text-blue-700"},purple:{bg:l==="dark"?"bg-purple-500/20":"bg-purple-50",text:l==="dark"?"text-purple-400":"text-purple-700"},red:{bg:l==="dark"?"bg-red-500/20":"bg-red-50",text:l==="dark"?"text-red-400":"text-red-700"},yellow:{bg:l==="dark"?"bg-yellow-500/20":"bg-yellow-50",text:l==="dark"?"text-yellow-400":"text-yellow-700"},indigo:{bg:l==="dark"?"bg-indigo-500/20":"bg-indigo-50",text:l==="dark"?"text-indigo-400":"text-indigo-700"}};return X[M.color]||X.green};return n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:`${O} rounded-xl border-2 ${C} p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all ${l==="dark"?"hover:border-[#4E6E49]/50":"hover:border-[#4E6E49]"}`,children:[n.jsxs("div",{className:"flex items-start justify-between gap-3 mb-3",children:[n.jsxs("div",{className:"flex-1 min-w-0",children:[n.jsx("div",{className:"flex items-center gap-2 mb-2",children:n.jsx("h3",{className:`text-lg sm:text-xl font-bold ${P} truncate`,children:r.title})}),n.jsxs("div",{className:"flex flex-wrap items-center gap-2 sm:gap-3",children:[n.jsxs("span",{className:`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium ${Ee().bg} ${Ee().text} inline-flex items-center gap-1.5`,children:[n.jsx(Z,{className:"w-4 h-4"}),M.label]}),n.jsx("span",{className:`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium border ${ye()}`,children:ee.label}),n.jsxs("span",{className:`text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 ${H()}`,children:[r.priority==="high"?n.jsx(Hu,{className:"w-4 h-4"}):r.priority==="medium"?n.jsx(Xu,{className:"w-4 h-4"}):n.jsx(ef,{className:"w-4 h-4"}),r.priority==="high"?"Высокий":r.priority==="medium"?"Средний":"Низкий"]})]})]}),_&&n.jsxs("div",{className:"flex items-center gap-2 flex-shrink-0",children:[n.jsx("button",{onClick:()=>e(r),className:`p-2 rounded-lg transition-colors ${l==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"}`,title:"Редактировать",children:n.jsx(zt,{className:"w-4 h-4"})}),n.jsx("button",{onClick:()=>t(r.id),className:`p-2 rounded-lg transition-colors ${l==="dark"?"hover:bg-red-500/20 text-red-400":"hover:bg-red-50 text-red-600"}`,title:"Удалить",children:n.jsx(It,{className:"w-4 h-4"})})]})]}),r.description&&n.jsx("p",{className:`text-sm ${l==="dark"?"text-gray-300":"text-gray-600"} mb-4 line-clamp-2`,children:r.description}),n.jsxs("div",{className:"space-y-2 mb-4",children:[n.jsxs("div",{className:"flex flex-col gap-3",children:[n.jsxs("div",{className:"flex items-center gap-2 text-xs sm:text-sm",children:[n.jsx(Xs,{className:`w-4 h-4 ${l==="dark"?"text-blue-400":"text-blue-600"}`}),n.jsx("span",{className:`font-medium ${l==="dark"?"text-gray-300":"text-gray-700"}`,children:"Автор:"}),n.jsx("span",{className:l==="dark"?"text-gray-400":"text-gray-600",children:(j==null?void 0:j.name)||"Неизвестно"})]}),n.jsxs("div",{children:[n.jsxs("div",{className:"flex items-center gap-2 text-xs sm:text-sm",children:[n.jsx(ln,{className:"w-4 h-4 text-[#4E6E49]"}),n.jsx("span",{className:`font-medium ${l==="dark"?"text-gray-300":"text-gray-700"}`,children:"Исполнители:"})]}),f.length>0?n.jsx("div",{className:"mt-2 space-y-2",children:f.map(X=>{const R=_e(X.priority);return n.jsxs("div",{className:`p-3 rounded-lg border ${C} ${l==="dark"?"bg-[#1a1a1a]/70":"bg-gray-50"}`,children:[n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("span",{className:`text-sm font-medium ${l==="dark"?"text-gray-100":"text-gray-800"}`,children:X.member.name}),n.jsx("span",{className:`text-[11px] px-2 py-0.5 rounded-full border ${R.classes}`,children:R.label})]}),X.comment&&n.jsx("p",{className:`text-xs mt-1 ${l==="dark"?"text-gray-400":"text-gray-600"}`,children:X.comment})]},X.member.id)})}):n.jsx("span",{className:"text-gray-500",children:"Не назначены"})]})]}),n.jsxs("div",{className:"flex items-center gap-3 flex-wrap text-xs sm:text-sm",children:[n.jsxs("span",{className:"inline-flex items-center gap-1",children:[n.jsx(rl,{className:`w-4 h-4 ${l==="dark"?"text-gray-400":"text-gray-500"}`}),n.jsxs("span",{className:l==="dark"?"text-gray-300":"text-gray-700",children:["Старт: ",r.startTime||"—"]})]}),n.jsxs("span",{className:"inline-flex items-center gap-1",children:[n.jsx(Pr,{className:`w-4 h-4 ${l==="dark"?"text-gray-400":"text-gray-500"}`}),n.jsxs("span",{className:l==="dark"?"text-gray-400":"text-gray-600",children:["Дедлайн: ",me(new Date(r.dueDate),"dd.MM.yyyy")," ",r.dueTime]})]}),n.jsx(Dg,{dueDate:r.dueDate,dueTime:r.dueTime,theme:l})]}),r.status==="pending"&&r.approvals.length>0&&n.jsxs("div",{className:"flex items-center gap-2 text-xs sm:text-sm",children:[n.jsx(sl,{className:`w-4 h-4 ${l==="dark"?"text-yellow-400":"text-yellow-600"}`}),n.jsxs("span",{className:l==="dark"?"text-yellow-400":"text-yellow-600",children:["Согласований: ",r.approvals.filter(X=>X.status==="approved").length,"/",r.approvals.length]})]})]}),n.jsxs("div",{className:`mt-4 p-3 rounded-lg border ${C} ${l==="dark"?"bg-[#1a1a1a]/70":"bg-gray-50"}`,children:[n.jsxs("div",{className:"flex items-center justify-between mb-2",children:[n.jsxs("span",{className:"text-sm font-semibold",children:["Этап: ",$.name]}),n.jsxs("span",{className:"text-xs text-gray-500",children:[se,"/",B," согласований"]})]}),q.length>0&&n.jsx("div",{className:"space-y-1 text-xs",children:q.map(X=>{const R=Ne.find(L=>L.id===X.userId);return n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsxs("span",{className:"flex items-center gap-1",children:[n.jsx("span",{className:"font-medium",children:(R==null?void 0:R.name)||X.userId}),n.jsxs("span",{className:"text-gray-500",children:["(",X.status==="approved"?"ok":X.status==="rejected"?"отклонено":"ожидание",")"]})]}),X.comment&&n.jsx("span",{className:"text-gray-500 truncate max-w-[140px]",children:X.comment})]},X.userId)})}),a&&n.jsxs("div",{className:"mt-3 space-y-2",children:[n.jsx("textarea",{value:I,onChange:X=>N(X.target.value),rows:2,className:`w-full px-3 py-2 rounded-lg border ${C} ${l==="dark"?"bg-[#0f0f0f] text-gray-100":"bg-white text-gray-700"}`,placeholder:"Комментарий к задаче или этапу"}),n.jsxs("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsxs("label",{className:"inline-flex items-center gap-1",children:[n.jsx("input",{type:"radio",checked:T==="stage",onChange:()=>E("stage")}),"Этап"]}),n.jsxs("label",{className:"inline-flex items-center gap-1",children:[n.jsx("input",{type:"radio",checked:T==="task",onChange:()=>E("task")}),"Задача"]})]}),n.jsx("button",{onClick:we,disabled:c||!I.trim(),className:`px-3 py-1 rounded-lg font-semibold ${l==="dark"?"bg-[#4E6E49] text-white hover:bg-[#4E6E49]/80":"bg-[#4E6E49] text-white hover:bg-emerald-700"} disabled:opacity-50`,children:"Добавить"})]})]})]}),n.jsxs("div",{className:`flex flex-wrap gap-2 pt-4 border-t ${C}`,children:[Y&&(!ce||ce.status==="pending")&&n.jsxs("button",{onClick:()=>xe("approve"),className:"flex-1 sm:flex-none px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",children:[n.jsx(vs,{className:"w-4 h-4"}),"Согласовать"]}),Y&&(!ce||ce.status==="pending")&&n.jsxs("button",{onClick:()=>m(!0),className:"flex-1 sm:flex-none px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",children:[n.jsx(Xt,{className:"w-4 h-4"}),"Отклонить"]}),re&&n.jsxs("button",{onClick:()=>xe("approve",!0),disabled:c,className:"flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50",children:[n.jsx(vs,{className:"w-4 h-4"}),"Согласовать за всех"]}),r.status==="pending"&&K&&(_||Y)&&n.jsxs("button",{onClick:()=>G("in_progress"),disabled:c,className:"flex-1 sm:flex-none px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50",children:[n.jsx(ea,{className:"w-4 h-4"}),"В работу"]}),r.status==="in_progress"&&(_||v.includes((a==null?void 0:a.id)||""))&&n.jsxs("button",{onClick:()=>G("completed"),disabled:c,className:"flex-1 sm:flex-none px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50",children:[n.jsx(ji,{className:"w-4 h-4"}),"Выполнена"]}),r.status==="completed"&&_&&n.jsxs("button",{onClick:()=>G("closed"),disabled:c,className:"flex-1 sm:flex-none px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50",children:[n.jsx(eh,{className:"w-4 h-4"}),"Закрыть"]})]})]}),h&&n.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto overscroll-contain modal-scroll",children:n.jsxs("div",{className:`${O} rounded-xl p-6 max-w-md w-full border-2 ${C}`,children:[n.jsx("h3",{className:`text-lg font-bold mb-4 ${P}`,children:"Отклонить задачу"}),n.jsx("textarea",{value:x,onChange:X=>b(X.target.value),placeholder:"Укажите причину отклонения",rows:3,className:`w-full px-4 py-2 rounded-lg border ${C} ${l==="dark"?"bg-gray-700":"bg-gray-50"} ${P} mb-4 focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}),n.jsxs("div",{className:"flex gap-3",children:[n.jsx("button",{onClick:()=>xe("reject"),disabled:c||!x.trim(),className:"flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50",children:"Отклонить"}),n.jsx("button",{onClick:()=>{m(!1),b("")},className:`px-4 py-2 rounded-lg font-medium transition-colors ${l==="dark"?"bg-gray-700 hover:bg-gray-600":"bg-gray-200 hover:bg-gray-300"}`,children:"Отмена"})]})]})})]})},Dk=({selectedCategory:r,selectedStatus:e,selectedUsers:t,onCategoryChange:s,onStatusChange:a,onUsersChange:i,onClear:l})=>{const{theme:c}=Ze(),d=c==="dark"?"text-white":"text-gray-900",h=c==="dark"?"bg-[#1a1a1a]":"bg-white",m=c==="dark"?"border-gray-800":"border-gray-300",x=r!=="all"||e!=="all"||t.length>0,b=Ne.filter(T=>t.includes(T.id)).map(T=>T.name),I=[{href:"#filter-status",label:"Статусы"},{href:"#filter-category",label:"Категории"},{href:"#filter-people",label:"Исполнители"}],N={pending:n.jsx(Hc,{className:"w-4 h-4"}),in_progress:n.jsx(Bu,{className:"w-4 h-4"}),completed:n.jsx(ji,{className:"w-4 h-4"}),closed:n.jsx(Kp,{className:"w-4 h-4"}),rejected:n.jsx(eh,{className:"w-4 h-4"})};return n.jsxs("div",{className:`${h} rounded-xl border-2 ${m} p-4 sm:p-6 shadow-lg sticky top-4 space-y-4`,children:[n.jsxs("div",{className:"flex items-start justify-between gap-3",children:[n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx("div",{className:`p-2 rounded-lg ${c==="dark"?"bg-[#4E6E49]/20":"bg-green-50"}`,children:n.jsx(zu,{className:"w-5 h-5 text-[#4E6E49]"})}),n.jsxs("div",{children:[n.jsx("h3",{className:`text-lg font-bold ${d}`,children:"Фильтры"}),n.jsx("p",{className:`text-xs ${c==="dark"?"text-gray-400":"text-gray-500"}`,children:"Быстрая навигация по статусам, категориям и участникам"})]})]}),x&&n.jsxs("button",{onClick:l,className:`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${c==="dark"?"bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50":"bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"}`,children:[n.jsx(Xt,{className:"w-4 h-4"}),n.jsx("span",{className:"hidden sm:inline",children:"Сбросить всё"})]})]}),n.jsx("div",{className:"flex flex-wrap gap-2",children:I.map(T=>n.jsxs("a",{href:T.href,className:`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-2 ${c==="dark"?"border-white/10 bg-white/5 text-gray-100 hover:border-[#4E6E49]/50":"border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:[n.jsx(Zc,{className:"w-4 h-4"}),T.label]},T.href))}),n.jsxs("div",{className:`rounded-lg border ${m} ${c==="dark"?"bg-[#1f1f1f]":"bg-gray-50"} p-3 space-y-2`,children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx(mf,{className:"w-4 h-4 text-[#4E6E49]"}),n.jsx("p",{className:`text-sm font-semibold ${d}`,children:"Текущая подборка"})]}),n.jsx("div",{className:"flex flex-wrap gap-2",children:x?n.jsxs(n.Fragment,{children:[r!=="all"&&n.jsx("span",{className:"px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border border-emerald-500/30",children:ei[r].label}),e!=="all"&&n.jsx("span",{className:"px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-200 border border-sky-500/30",children:Fn[e].label}),t.length>0&&n.jsx("span",{className:"px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-200 border border-purple-500/30",children:b.join(", ")})]}):n.jsx("span",{className:`text-xs ${c==="dark"?"text-gray-400":"text-gray-500"}`,children:"Фильтры не заданы"})})]}),n.jsxs("div",{className:"space-y-6",children:[n.jsxs("div",{id:"filter-status",className:"space-y-3",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx(of,{className:"w-4 h-4 text-yellow-500"}),n.jsx("label",{className:`block text-sm font-semibold ${d}`,children:"Статусы"})]}),n.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[n.jsxs("button",{onClick:()=>a("all"),className:`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${e==="all"?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-800 border-gray-800 text-gray-200 hover:bg-gray-700":"bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`} flex items-center gap-2 justify-start text-left w-full`,children:[n.jsx(rf,{className:"w-4 h-4"}),"Целиком"]}),Object.entries(Fn).map(([T,{label:E,color:P}])=>{const O={yellow:c==="dark"?"bg-yellow-500/10 border-yellow-500/50 text-yellow-300":"bg-yellow-50 border-yellow-500/40 text-yellow-700",blue:c==="dark"?"bg-blue-500/10 border-blue-500/50 text-blue-300":"bg-blue-50 border-blue-500/40 text-blue-700",green:c==="dark"?"bg-emerald-500/10 border-emerald-500/50 text-emerald-200":"bg-emerald-50 border-emerald-500/40 text-emerald-700",gray:c==="dark"?"bg-gray-500/10 border-gray-500/50 text-gray-300":"bg-gray-50 border-gray-400/60 text-gray-700",red:c==="dark"?"bg-red-500/10 border-red-500/50 text-red-300":"bg-red-50 border-red-500/40 text-red-700"},C=O[P]||O.gray,M=N[T];return n.jsx("button",{onClick:()=>a(T),className:`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 flex items-center justify-start gap-3 text-left ${e===T?C:c==="dark"?"bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`,children:n.jsxs("span",{className:"flex items-center gap-2",children:[M,E]})},T)})]})]}),n.jsxs("div",{id:"filter-category",className:"space-y-3",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx(Bt,{className:"w-4 h-4 text-purple-500"}),n.jsx("label",{className:`block text-sm font-semibold ${d}`,children:"Категории"})]}),n.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:[n.jsxs("button",{onClick:()=>s("all"),className:`px-3 py-3 rounded-lg text-sm font-semibold transition-all border-2 flex items-center gap-2 justify-center text-center ${r==="all"?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`}`,children:[n.jsx(Zc,{className:"w-4 h-4"}),"Всё"]}),Object.entries(ei).map(([T,{label:E}])=>{const P=Ki[T],O=r===T;return n.jsx("button",{onClick:()=>s(T),className:`px-3 py-3 rounded-lg text-sm font-semibold transition-all border-2 flex flex-col items-center gap-2 text-center leading-tight whitespace-normal ${O?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`}`,children:n.jsxs("span",{className:"flex items-center gap-2 justify-center",children:[n.jsx(P,{className:"w-4 h-4"}),n.jsx("span",{className:"break-words",children:E})]})},T)})]})]}),n.jsxs("div",{id:"filter-people",className:"space-y-3",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx(ln,{className:"w-4 h-4 text-sky-500"}),n.jsx("label",{className:`block text-sm font-semibold ${d}`,children:"Исполнители"})]}),n.jsxs("div",{className:"flex flex-wrap gap-2",children:[n.jsx("button",{onClick:()=>i([]),className:`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${t.length===0?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`}`,children:"Все"}),Ne.map(T=>{const E=t.includes(T.id);return n.jsxs("button",{onClick:()=>{i(E?t.filter(P=>P!==T.id):[...t,T.id])},className:`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 flex items-center gap-2 ${E?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`}`,children:[n.jsx(Hc,{className:`w-3 h-3 ${E?"text-[#4E6E49]":"text-gray-400"}`}),T.name]},T.id)})]})]})]})]})},Pk=({tasks:r,onUpdate:e,onEdit:t,onDelete:s})=>{const{theme:a}=Ze(),{user:i}=At(),{isAdmin:l}=Vt(),[c,d]=A.useState(null),[h,m]=A.useState(null),[x,b]=A.useState(null),[I,N]=A.useState(""),[T,E]=A.useState(null),[P,O]=A.useState(null),[C,M]=A.useState(null),[ee,Z]=A.useState({}),[j,y]=A.useState({}),v=a==="dark"?"text-white":"text-gray-900",f=a==="dark"?"bg-[#1a1a1a]":"bg-white",_=a==="dark"?"border-gray-800":"border-gray-300",k=a==="dark"?"bg-gray-800":"bg-white",p=["pending","in_progress","completed","closed","rejected"],$=S=>S.assignees&&S.assignees.length>0?S.assignees:S.assignedTo.map(Q=>({userId:Q,priority:"medium"})),q=S=>$(S).map(Q=>Q.userId),se=S=>{var de;const Q=[S.mainExecutor,...((de=S.deputies)==null?void 0:de.map(D=>D.userId))||[],...S.executors||[],...S.curators||[],...S.leads||[]].filter(Boolean);return Array.from(new Set([...S.assignedTo||[],...Q]))},B=S=>{if(S.stages&&S.stages.length>0){const Q=S.currentStageId||S.stages[0].id;return S.stages.find(de=>de.id===Q)||S.stages[0]}return{id:"legacy-stage",name:"Этап",responsible:"all",approvals:S.approvals||[],status:S.status==="rejected"?"rejected":"pending",comments:[]}},Y=S=>r.filter(Q=>Q.status===S),ce=(S,Q)=>{if(T){S.preventDefault();return}d(Q),S.dataTransfer.effectAllowed="move",S.dataTransfer.setData("text/plain",Q.id)},re=S=>{S.preventDefault(),S.dataTransfer.dropEffect="move"},he=()=>{d(null)},K=(S,Q)=>{if(T||Q.status==="rejected")return;const de=S.touches[0];O({x:de.clientX,y:de.clientY,task:Q})},G=S=>{if(!P)return;S.preventDefault();const Q=S.touches[0],de=document.elementFromPoint(Q.clientX,Q.clientY);if(de){const D=de.closest("[data-status]");if(D){const ue=D.getAttribute("data-status");ue&&M(ue)}}},xe=async(S,Q)=>{if(!P)return;const de=S.changedTouches[0],D=document.elementFromPoint(de.clientX,de.clientY);if(D){const ue=D.closest("[data-status]");if(ue){const je=ue.getAttribute("data-status");je&&je!==Q&&P.task.status!=="rejected"&&await _e(P.task,je)}}O(null),M(null)},we=S=>!S.stages||S.stages.length===0?S.approvals.every(Q=>Q.status==="approved"):S.stages.every(Q=>Q.status==="approved"),H=async(S,Q)=>{if(S.preventDefault(),S.stopPropagation(),!c||c.status===Q||T){d(null);return}if(c.status==="rejected"&&Q!=="pending"){d(null);return}if(Q==="rejected"){d(null);return}E(c.id);try{const de=new Date().toISOString(),D={status:Q,updatedAt:de};if(Q==="completed")D.completedAt=de,D.completedBy=(i==null?void 0:i.id)||"admin";else if(Q==="closed")D.closedAt=de;else if(Q==="in_progress"){if(!we(c)){E(null),d(null);return}}else Q==="pending"&&c.status==="rejected"&&(D.approvals=q(c).map(ue=>({userId:ue,status:"pending",updatedAt:de})));await Tr(c.id,D),e()}catch(de){console.error("Error updating task status:",de)}finally{E(null),d(null)}},_e=async(S,Q)=>{if(S.status===Q||T===S.id){m(null);return}E(S.id);try{const de=new Date().toISOString(),D={status:Q,updatedAt:de};if(Q==="completed")D.completedAt=de,D.completedBy=(i==null?void 0:i.id)||"admin";else if(Q==="closed")D.closedAt=de;else if(Q==="in_progress"){if(!we(S)){E(null),m(null);return}}else Q==="pending"&&S.status==="rejected"&&(D.approvals=q(S).map(ue=>({userId:ue,status:"pending",updatedAt:de})));await Tr(S.id,D),e(),m(null)}catch(de){console.error("Error updating task status:",de)}finally{E(null)}},ye=async(S,Q,de)=>{if(i){E(S.id);try{const D=new Date().toISOString(),ue=Q==="approve"?"approved":"rejected",je=Q==="reject"?(I||"").trim():"",Ue=B(S),Oe=Ue.responsible==="all"?se(S):Ue.responsible,F=Ue.approvals||[],ae=Me=>{const fe={...Me,status:ue,updatedAt:D,forAll:de?!0:void 0};if(je)return{...fe,comment:je};const{comment:Ge,...ut}=fe;return ut},ne=de?Oe.map(Me=>({...F.find(ut=>ut.userId===Me)||{userId:Me,status:"pending",updatedAt:D},status:ue,updatedAt:D,forAll:!0,...je?{comment:je}:{}})):F.map(Me=>Me.userId===i.id?ae(Me):Me);if(!de&&!F.find(Me=>Me.userId===i.id)){const Me={userId:i.id,status:ue,updatedAt:D};ne.push(je?{...Me,comment:je}:Me)}const be=(S.stages||[]).map(Me=>Me.id===Ue.id?{...Me,approvals:ne}:Me),Ye=ne.length>0&&ne.every(Me=>Me.status==="approved"),at=ne.some(Me=>Me.status==="rejected");let yt=S.currentStageId,He=be;if(S.stages&&S.stages.length>0&&(He=be.map(Me=>Me.id!==Ue.id?Me:{...Me,status:at?"rejected":Ye?"approved":"pending"}),Ye&&!at)){const Me=He.findIndex(Ge=>Ge.id===Ue.id);if(Me>=0&&Me<He.length-1){yt=He[Me+1].id;const Ge=He[Me+1],ut=Ge.responsible==="all"?se(S):Ge.responsible;He[Me+1]={...Ge,approvals:ut.map(_r=>({userId:_r,status:"pending",updatedAt:D}))}}}const dt={approvals:ne,stages:He,currentStageId:yt,updatedAt:D};Q==="reject"||at?dt.status="rejected":Q==="approve"&&(He.length>0?He.every(fe=>fe.status==="approved"):ne.every(fe=>fe.status==="approved"))&&S.status==="pending"&&(dt.status="in_progress"),await Tr(S.id,dt),e(),Q==="reject"&&(b(null),N(""))}catch(D){console.error("Error approving task:",D)}finally{E(null)}}},Ee=async S=>{var Q,de;if(!(!i||S.createdBy!==i.id)){E(S.id);try{const D=new Date().toISOString(),ue=se(S);let je=S.stages||[];je.length===0&&(je=[{id:"stage-1",name:"Этап",responsible:"all",approvals:[],status:"pending"}]);const Ue=je.map(Oe=>{const F=Oe.responsible==="all"?ue:Oe.responsible;return{...Oe,approvals:F.map(ae=>({userId:ae,status:"pending",updatedAt:D})),status:"pending"}});await Tr(S.id,{status:"pending",approvals:((Q=Ue[0])==null?void 0:Q.approvals)||[],stages:Ue,currentStageId:(de=Ue[0])==null?void 0:de.id,updatedAt:D}),e()}catch(D){console.error("Error resubmitting task:",D)}finally{E(null)}}},X=async S=>{if(!i)return;const Q=ee[S.id]||"";if(Q.trim()){E(S.id);try{const de=new Date().toISOString(),D={id:`c-${Date.now()}`,userId:i.id,text:Q.trim(),createdAt:de,stageId:(j[S.id]||"stage")==="stage"?B(S).id:void 0},ue={comments:[...S.comments||[],D],updatedAt:de};D.stageId&&S.stages&&S.stages.length>0&&(ue.stages=S.stages.map(je=>je.id===D.stageId?{...je,comments:[...je.comments||[],D]}:je)),await Tr(S.id,ue),Z(je=>({...je,[S.id]:""})),e()}catch(de){console.error("Error adding comment:",de)}finally{E(null)}}},R=S=>({pending:a==="dark"?"bg-yellow-500/20 border-yellow-500/50":"bg-yellow-50 border-yellow-200",in_progress:a==="dark"?"bg-blue-500/20 border-blue-500/50":"bg-blue-50 border-blue-200",completed:a==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49]/50":"bg-green-50 border-green-200",closed:a==="dark"?"bg-gray-500/20 border-gray-500/50":"bg-gray-50 border-gray-200",rejected:a==="dark"?"bg-red-500/20 border-red-500/50":"bg-red-50 border-red-200"})[S],L=S=>({pending:a==="dark"?"text-yellow-400":"text-yellow-700",in_progress:a==="dark"?"text-blue-400":"text-blue-700",completed:"text-[#4E6E49]",closed:a==="dark"?"text-gray-400":"text-gray-700",rejected:a==="dark"?"text-red-400":"text-red-700"})[S],ge=S=>{const Q=new Date;return new Date(`${S.dueDate}T${S.dueTime}`)<Q&&S.status!=="completed"&&S.status!=="closed"&&S.status!=="rejected"},pe=S=>{if(S.status==="closed"||S.status==="completed"||!i)return!1;const Q=B(S);if(!(Q.responsible==="all"?se(S):Q.responsible).includes(i.id))return!1;const D=(Q.approvals||[]).find(ue=>ue.userId===i.id);return!D||D.status==="pending"},U=S=>S.status!=="rejected"||!i?!1:S.createdBy===i.id||l;return n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"overflow-x-auto pb-4 -mx-4 px-4",children:n.jsx("div",{className:"flex gap-3 sm:gap-4 min-w-max",children:p.map(S=>{const Q=Y(S),de=Fn[S];return n.jsxs("div",{"data-status":S,className:`flex-shrink-0 w-[280px] sm:w-80 ${f} rounded-xl border-2 ${_} p-3 sm:p-4 ${C===S?"border-[#4E6E49]":""}`,onDragOver:re,onDrop:D=>H(D,S),onTouchMove:G,children:[n.jsx("div",{className:`mb-3 sm:mb-4 pb-2 sm:pb-3 border-b ${_}`,children:n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("h3",{className:`text-base sm:text-lg font-bold ${L(S)}`,children:de.label}),n.jsx("span",{className:`px-2 py-1 rounded-lg text-xs sm:text-sm font-medium ${R(S)} ${L(S)}`,children:Q.length})]})}),n.jsxs("div",{className:"space-y-2 sm:space-y-3 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto",children:[Q.map(D=>{var He,dt,Me;const ue=ge(D),je=l||(i==null?void 0:i.id)===D.createdBy,Ue=pe(D),Oe=U(D),F=B(D),ae=F.approvals||[],ne=ae.filter(fe=>fe.status==="approved").length,be=ae.length,Ye=!!i&&(i.id===D.mainExecutor||i.id===D.createdBy||l),yt=$(D).map(fe=>{const Ge=Ne.find(ut=>ut.id===fe.userId);return Ge?{...fe,member:Ge}:null}).filter(Boolean);return n.jsxs("div",{draggable:!T&&D.status!=="rejected",onDragStart:fe=>ce(fe,D),onDragEnd:he,onTouchStart:fe=>K(fe,D),onTouchEnd:fe=>xe(fe,S),className:`${f} rounded-lg border-2 ${_} p-2.5 sm:p-3 cursor-move hover:shadow-lg transition-all ${(c==null?void 0:c.id)===D.id||(P==null?void 0:P.task.id)===D.id?"opacity-50":""} ${ue?"border-red-500":""} ${T===D.id?"opacity-50 pointer-events-none":""} ${D.status==="rejected"?"opacity-75":""}`,children:[n.jsxs("div",{className:"flex items-start justify-between gap-2 mb-2",children:[n.jsx("h4",{className:`font-semibold text-xs sm:text-sm ${v} flex-1`,children:D.title}),n.jsx("div",{className:"flex items-center gap-1 flex-shrink-0",children:n.jsxs("div",{className:"relative lg:hidden",children:[n.jsx("button",{onClick:()=>m((h==null?void 0:h.id)===D.id?null:D),className:`p-1 rounded ${a==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"}`,children:n.jsx(hf,{className:"w-4 h-4"})}),(h==null?void 0:h.id)===D.id&&n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>m(null)}),n.jsx("div",{className:`absolute right-0 top-8 z-50 ${f} rounded-lg shadow-xl border-2 ${_} min-w-[200px]`,children:n.jsxs("div",{className:"p-2",children:[n.jsx("div",{className:`text-xs font-medium mb-2 px-2 py-1 ${a==="dark"?"text-gray-400":"text-gray-600"}`,children:"Изменить статус:"}),p.filter(fe=>fe!=="rejected"||D.status==="rejected").map(fe=>n.jsx("button",{onClick:()=>_e(D,fe),disabled:D.status===fe||T===D.id,className:`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${D.status===fe?R(fe):a==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"} ${D.status===fe?L(fe):v} disabled:opacity-50`,children:Fn[fe].label},fe)),je&&n.jsxs(n.Fragment,{children:[n.jsx("div",{className:`border-t ${_} my-2`}),n.jsx("button",{onClick:()=>{m(null),t(D)},className:`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${a==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"} ${v}`,children:"Редактировать"}),n.jsx("button",{onClick:()=>{m(null),s(D.id)},className:`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${a==="dark"?"hover:bg-red-500/20 text-red-400":"hover:bg-red-50 text-red-600"}`,children:"Удалить"})]})]})})]})]})})]}),n.jsxs("div",{className:"space-y-1.5 text-xs mb-2",children:[n.jsxs("div",{className:"space-y-1",children:[n.jsxs("div",{className:`flex items-center gap-1 ${a==="dark"?"text-blue-400":"text-blue-600"}`,children:[n.jsx("span",{className:"font-medium",children:"Автор:"}),n.jsx("span",{className:a==="dark"?"text-gray-400":"text-gray-600",children:((He=Ne.find(fe=>fe.id===D.createdBy))==null?void 0:He.name)||"Неизвестно"})]}),n.jsxs("div",{className:"flex flex-col gap-1",children:[n.jsx("div",{className:"flex items-center gap-1 text-[#4E6E49]",children:n.jsx("span",{className:"font-medium",children:"Исполнители:"})}),yt.length>0?yt.map(fe=>n.jsxs("div",{className:`text-[11px] sm:text-xs ${a==="dark"?"text-gray-300":"text-gray-700"} flex flex-wrap gap-1`,children:[n.jsx("span",{className:"font-medium",children:fe.member.name}),n.jsx("span",{children:"•"}),n.jsx("span",{children:fe.priority==="high"?"Высокий":fe.priority==="medium"?"Средний":"Низкий"}),fe.comment&&n.jsxs(n.Fragment,{children:[n.jsx("span",{children:"•"}),n.jsx("span",{className:"truncate max-w-[140px] sm:max-w-[180px]",children:fe.comment})]})]},fe.member.id)):n.jsx("span",{className:"text-gray-500",children:"Не назначены"})]})]}),n.jsxs("div",{className:`flex items-center gap-2 flex-wrap ${a==="dark"?"text-gray-400":"text-gray-600"}`,children:[D.startTime&&n.jsxs("span",{className:"inline-flex items-center gap-1",children:[n.jsx(rl,{className:"w-3.5 h-3.5"}),D.startTime]}),n.jsxs("span",{className:"inline-flex items-center gap-1",children:[n.jsx(Qp,{className:"w-3.5 h-3.5"}),me(new Date(D.dueDate),"dd.MM.yyyy")]}),n.jsxs("span",{className:"inline-flex items-center gap-1",children:[n.jsx(Bu,{className:"w-3.5 h-3.5"}),D.dueTime]}),n.jsx(Dg,{dueDate:D.dueDate,dueTime:D.dueTime,theme:a,size:"compact"})]}),be>0&&n.jsxs("div",{className:`flex items-center justify-between gap-2 ${a==="dark"?"text-yellow-300":"text-yellow-700"}`,children:[n.jsxs("span",{className:"inline-flex items-center gap-1",children:[n.jsx(sl,{className:"w-3 h-3"}),"Этап: ",F.name]}),n.jsxs("span",{className:"text-[11px] font-semibold",children:[ne,"/",be]})]}),D.description&&n.jsx("p",{className:`line-clamp-2 ${a==="dark"?"text-gray-300":"text-gray-600"}`,children:D.description}),ae.length>0&&n.jsx("div",{className:`mt-1 space-y-1 ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:ae.map(fe=>{const Ge=Ne.find(ut=>ut.id===fe.userId);return n.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:[n.jsxs("span",{className:"flex items-center gap-1",children:[n.jsx("span",{className:"font-medium",children:(Ge==null?void 0:Ge.name)||fe.userId}),n.jsxs("span",{className:"text-gray-500",children:["(",fe.status==="approved"?"ok":fe.status==="rejected"?"отклонено":"ожидание",")"]})]}),fe.comment&&n.jsx("span",{className:"truncate max-w-[140px] text-gray-500",children:fe.comment})]},fe.userId)})}),(((dt=D.comments)==null?void 0:dt.length)||((Me=F.comments)==null?void 0:Me.length))&&n.jsx("div",{className:"mt-2 space-y-1",children:[...D.comments||[],...F.comments||[]].map(fe=>{const Ge=Ne.find(ut=>ut.id===fe.userId);return n.jsxs("div",{className:`text-[11px] ${a==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx("span",{className:"font-semibold",children:(Ge==null?void 0:Ge.name)||fe.userId})," ",n.jsx("span",{className:"text-gray-500",children:fe.stageId?"(этап)":"(задача)"}),": ",fe.text]},fe.id)})}),i&&n.jsxs("div",{className:`mt-2 p-2 rounded-lg border ${_} ${k}`,children:[n.jsx("textarea",{value:ee[D.id]||"",onChange:fe=>Z(Ge=>({...Ge,[D.id]:fe.target.value})),rows:2,className:`w-full px-2 py-1 rounded border ${_} ${a==="dark"?"bg-[#1a1a1a] text-gray-100":"bg-white text-gray-700"}`,placeholder:"Комментарий к задаче или этапу"}),n.jsxs("div",{className:"flex items-center justify-between mt-2 gap-2",children:[n.jsxs("div",{className:"flex items-center gap-2 text-[11px]",children:[n.jsxs("label",{className:"inline-flex items-center gap-1",children:[n.jsx("input",{type:"radio",name:`comment-target-${D.id}`,checked:(j[D.id]||"stage")==="stage",onChange:()=>y(fe=>({...fe,[D.id]:"stage"}))}),"Этап"]}),n.jsxs("label",{className:"inline-flex items-center gap-1",children:[n.jsx("input",{type:"radio",name:`comment-target-${D.id}`,checked:j[D.id]==="task",onChange:()=>y(fe=>({...fe,[D.id]:"task"}))}),"Задача"]})]}),n.jsx("button",{onClick:()=>X(D),disabled:T===D.id||!(ee[D.id]||"").trim(),className:`px-3 py-1 text-xs rounded-lg font-medium ${a==="dark"?"bg-[#4E6E49] text-white hover:bg-[#4E6E49]/80":"bg-[#4E6E49] text-white hover:bg-emerald-700"} disabled:opacity-50`,children:"Добавить"})]})]}),n.jsx("div",{className:"flex items-center gap-2 flex-wrap",children:n.jsx("span",{className:`px-1.5 py-0.5 rounded text-xs inline-flex items-center gap-1 ${R(S)} ${L(S)}`,children:(()=>{const fe=Ki[D.category];return n.jsx(fe,{className:"w-3.5 h-3.5"})})()})})]}),(Ue||Ye)&&n.jsxs("div",{className:`flex flex-col gap-2 mt-2 pt-2 border-t ${_}`,children:[n.jsxs("div",{className:"flex gap-2",children:[Ue&&n.jsxs("button",{onClick:()=>ye(D,"approve"),className:"flex-1 px-2 py-1.5 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",children:[n.jsx(vs,{className:"w-3 h-3"}),"Согласовать"]}),n.jsxs("button",{onClick:()=>{b({task:D}),N("")},className:"flex-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",children:[n.jsx(Xt,{className:"w-3 h-3"}),"Отклонить"]})]}),Ye&&n.jsxs("button",{onClick:()=>ye(D,"approve",!0),className:"px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",children:[n.jsx(vs,{className:"w-3 h-3"}),"Согласовать за всех этап"]})]}),Oe&&n.jsx("div",{className:`mt-2 pt-2 border-t ${_}`,children:n.jsxs("button",{onClick:()=>Ee(D),disabled:T===D.id,className:"w-full px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50",children:[n.jsx(pf,{className:"w-3 h-3"}),"Отправить на согласование"]})})]},D.id)}),Q.length===0&&n.jsxs("div",{className:`text-center py-6 sm:py-8 ${a==="dark"?"text-gray-500":"text-gray-400"}`,children:[n.jsx(Dr,{className:"w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50"}),n.jsx("p",{className:"text-xs sm:text-sm",children:"Нет задач"})]})]})]},S)})})}),x&&n.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto overscroll-contain modal-scroll",children:n.jsxs("div",{className:`${f} rounded-xl p-6 max-w-md w-full border-2 ${_}`,children:[n.jsx("h3",{className:`text-lg font-bold mb-4 ${v}`,children:"Отклонить задачу"}),n.jsx("textarea",{value:I,onChange:S=>N(S.target.value),placeholder:"Укажите причину отклонения",rows:3,className:`w-full px-4 py-2 rounded-lg border ${_} ${a==="dark"?"bg-gray-700":"bg-gray-50"} ${v} mb-4 focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}),n.jsxs("div",{className:"flex gap-3",children:[n.jsx("button",{onClick:()=>x.task&&ye(x.task,"reject"),disabled:T===x.task.id||!I.trim(),className:"flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50",children:"Отклонить"}),n.jsx("button",{onClick:()=>{b(null),N("")},className:`px-4 py-2 rounded-lg font-medium transition-colors ${a==="dark"?"bg-gray-700 hover:bg-gray-600":"bg-gray-200 hover:bg-gray-300"}`,children:"Отмена"})]})]})})]})},$k=()=>{const{theme:r}=Ze(),{user:e}=At(),[t,s]=A.useState(!1),[a,i]=A.useState(null),[l,c]=A.useState([]),[d,h]=A.useState(!0),[m,x]=A.useState("all"),[b,I]=A.useState("all"),[N,T]=A.useState([]),[E,P]=A.useState("kanban"),O=r==="dark"?"text-white":"text-gray-900",C=r==="dark"?"bg-[#1a1a1a]":"bg-white";A.useEffect(()=>{M()},[e]),A.useEffect(()=>{M()},[m,b,N]);const M=async()=>{h(!0);try{const B={};m!=="all"&&(B.category=m),b!=="all"&&(B.status=b),N.length>0&&(B.assignedTo=N);const Y=await yg(B);c(Y)}catch(B){console.error("Error loading tasks:",B)}finally{h(!1)}},ee=B=>{i(B),s(!0)},Z=async B=>{if(confirm("Вы уверены, что хотите удалить эту задачу?"))try{await bg(B),M()}catch(Y){console.error("Error deleting task:",Y)}},j=()=>{s(!1),i(null)},y=()=>{s(!1),i(null),M()},v=()=>{x("all"),I("all"),T([])},f=l.filter(B=>!(m!=="all"&&B.category!==m||b!=="all"&&B.status!==b||N.length>0&&!N.some(Y=>B.assignedTo.includes(Y)))),_={pending:l.filter(B=>B.status==="pending").length,inProgress:l.filter(B=>B.status==="in_progress").length,completed:l.filter(B=>B.status==="completed").length,closed:l.filter(B=>B.status==="closed").length},k=e?l.filter(B=>{var Y;return(Y=B.assignedTo)==null?void 0:Y.includes(e.id)}).length:0,p=l.length,$=p?Math.round((_.completed+_.closed)/p*100):0,q=p?Math.round(_.inProgress/p*100):0,se=p?Math.round(_.pending/p*100):0;return n.jsx(sr,{children:n.jsxs("div",{className:"space-y-6",children:[n.jsxs("div",{className:`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${C} shadow-xl border-2 ${r==="dark"?"border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]":"border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white"} relative overflow-hidden`,children:[n.jsx("div",{className:"absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"}),n.jsx("div",{className:"absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"}),n.jsxs("div",{className:"relative z-10",children:[n.jsx("div",{className:"flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6",children:n.jsxs("div",{className:"flex-1",children:[n.jsxs("div",{className:"flex items-center gap-2 sm:gap-3 mb-2",children:[n.jsx(Dr,{className:"w-6 h-6 sm:w-8 sm:h-8 text-[#4E6E49]"}),n.jsxs("h1",{className:`text-2xl sm:text-3xl md:text-4xl font-extrabold ${O} flex items-center gap-2`,children:["Задачи",n.jsx(Bt,{className:`w-5 h-5 sm:w-6 sm:h-6 ${r==="dark"?"text-yellow-400":"text-yellow-600"}`})]})]}),n.jsx("p",{className:`text-sm sm:text-base ${r==="dark"?"text-gray-300":"text-gray-600"}`,children:"Управление задачами и заданиями команды"}),n.jsx("div",{className:"flex flex-wrap gap-2 mt-2",children:[{href:"#tasks-stats",label:"Обзор"},{href:"#tasks-board",label:"Доска"},{href:"#tasks-filters",label:"Фильтры"}].map(B=>n.jsx("a",{href:B.href,className:`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${r==="dark"?"border-white/10 bg-white/5 text-white hover:border-[#4E6E49]/50":"border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:B.label},B.href))})]})}),n.jsxs("div",{id:"tasks-stats",className:"grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 sm:gap-5",children:[n.jsxs("div",{className:`rounded-xl border-2 p-4 sm:p-5 ${r==="dark"?"border-white/10 bg-white/5":"border-green-100 bg-white/80"} backdrop-blur`,children:[n.jsxs("div",{className:"flex items-center justify-between mb-4",children:[n.jsxs("div",{children:[n.jsx("p",{className:`text-xs uppercase tracking-wide font-semibold ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Состояние пайплайна"}),n.jsxs("p",{className:`text-2xl sm:text-3xl font-extrabold ${O}`,children:[$,"% завершено"]})]}),n.jsx("div",{className:`p-3 rounded-lg ${r==="dark"?"bg-emerald-500/10 border border-emerald-500/40":"bg-emerald-50 border border-emerald-200"}`,children:n.jsx(Ku,{className:`w-6 h-6 ${r==="dark"?"text-emerald-200":"text-emerald-700"}`})})]}),n.jsx("div",{className:"space-y-3",children:[{label:"Проверка",value:_.pending,rate:se,color:"bg-amber-500",tint:"bg-amber-500/15"},{label:"В работе",value:_.inProgress,rate:q,color:"bg-sky-500",tint:"bg-sky-500/15"},{label:"Выполнена",value:_.completed,rate:$,color:"bg-emerald-500",tint:"bg-emerald-500/15"}].map(B=>n.jsxs("div",{className:"space-y-1",children:[n.jsxs("div",{className:"flex items-center justify-between text-sm font-semibold",children:[n.jsx("span",{className:O,children:B.label}),n.jsxs("span",{className:r==="dark"?"text-gray-400":"text-gray-600",children:[B.value," · ",B.rate,"%"]})]}),n.jsx("div",{className:`h-2 rounded-full ${B.tint}`,children:n.jsx("div",{className:`h-full rounded-full ${B.color}`,style:{width:`${Math.min(B.rate,100)}%`}})})]},B.label))})]}),n.jsx("div",{className:"grid grid-cols-2 gap-3 sm:gap-4",children:[{label:"Всего задач",value:p,icon:n.jsx(Ei,{className:"w-5 h-5"}),tone:"emerald"},{label:"В работе",value:_.inProgress,icon:n.jsx(Gc,{className:"w-5 h-5"}),tone:"sky"},{label:"Проверка",value:_.pending,icon:n.jsx(Bt,{className:"w-5 h-5"}),tone:"amber"},{label:"Закрыта",value:_.closed,icon:n.jsx(Dr,{className:"w-5 h-5"}),tone:"slate"}].map(B=>{const ce={emerald:{bg:r==="dark"?"bg-emerald-500/10":"bg-emerald-50",text:r==="dark"?"text-emerald-200":"text-emerald-700",border:r==="dark"?"border-emerald-500/30":"border-emerald-200"},sky:{bg:r==="dark"?"bg-sky-500/10":"bg-sky-50",text:r==="dark"?"text-sky-200":"text-sky-700",border:r==="dark"?"border-sky-500/30":"border-sky-200"},amber:{bg:r==="dark"?"bg-amber-500/10":"bg-amber-50",text:r==="dark"?"text-amber-200":"text-amber-700",border:r==="dark"?"border-amber-500/30":"border-amber-200"},slate:{bg:r==="dark"?"bg-gray-500/10":"bg-gray-50",text:r==="dark"?"text-gray-200":"text-gray-700",border:r==="dark"?"border-gray-500/30":"border-gray-200"}}[B.tone];return n.jsxs("div",{className:`p-3 sm:p-4 rounded-xl border ${ce.border} ${ce.bg} space-y-2`,children:[n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsx("span",{className:`text-xs font-semibold uppercase ${ce.text}`,children:B.label}),n.jsx("span",{className:ce.text,children:B.icon})]}),n.jsx("p",{className:`text-2xl font-extrabold ${O}`,children:B.value})]},B.label)})})]}),e&&n.jsxs("div",{className:"mt-4 flex flex-wrap gap-2",children:[n.jsxs("div",{className:`px-3 py-2 rounded-lg text-xs font-semibold border ${r==="dark"?"border-white/10 text-white bg-white/5":"border-gray-200 text-gray-800 bg-white"}`,children:["Мои задачи: ",k]}),n.jsx(or,{to:"/profile",className:`px-3 py-2 rounded-lg text-xs font-semibold border ${r==="dark"?"border-white/10 text-white bg-white/5 hover:border-[#4E6E49]/50":"border-gray-200 text-gray-800 bg-white hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:"Перейти в ЛК"})]})]})]}),n.jsxs("div",{className:"flex flex-col lg:flex-row gap-4 sm:gap-6",id:"tasks-board",children:[n.jsx("div",{className:"lg:w-80 flex-shrink-0",children:n.jsx(Dk,{selectedCategory:m,selectedStatus:b,selectedUsers:N,onCategoryChange:x,onStatusChange:I,onUsersChange:T,onClear:v})}),n.jsxs("div",{className:"flex-1",children:[n.jsxs("div",{className:"flex items-center justify-between mb-4 gap-3",children:[n.jsxs("h2",{className:`text-xl font-bold ${O}`,children:["Задачи (",f.length,")"]}),n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsxs("div",{className:`flex rounded-lg border-2 ${r==="dark"?"border-gray-800":"border-gray-300"} overflow-hidden`,children:[n.jsx("button",{onClick:()=>P("kanban"),className:`px-3 py-2 transition-colors ${E==="kanban"?"bg-[#4E6E49] text-white":r==="dark"?"bg-[#1a1a1a] text-gray-300 hover:bg-gray-700":"bg-white text-gray-700 hover:bg-gray-50"}`,title:"Kanban доска",children:n.jsx(lf,{className:"w-4 h-4"})}),n.jsx("button",{onClick:()=>P("list"),className:`px-3 py-2 transition-colors ${E==="list"?"bg-[#4E6E49] text-white":r==="dark"?"bg-[#1a1a1a] text-gray-300 hover:bg-gray-700":"bg-white text-gray-700 hover:bg-gray-50"}`,title:"Список",children:n.jsx(Gc,{className:"w-4 h-4"})})]}),n.jsxs("button",{onClick:()=>s(!0),className:"px-4 py-2 bg-gradient-to-r from-[#4E6E49] to-emerald-700 hover:from-[#4E6E49] hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2",children:[n.jsx(Un,{className:"w-5 h-5"}),n.jsx("span",{className:"hidden sm:inline",children:"Новая задача"}),n.jsx("span",{className:"sm:hidden",children:"Добавить"})]})]})]}),d?n.jsx("div",{className:`${C} rounded-xl p-8 text-center ${O}`,children:n.jsx("div",{className:"animate-pulse",children:"Загрузка..."})}):f.length===0?n.jsxs("div",{className:`${C} rounded-xl p-8 text-center border-2 ${r==="dark"?"border-gray-800":"border-gray-300"}`,children:[n.jsx(Dr,{className:`w-12 h-12 mx-auto mb-4 ${r==="dark"?"text-gray-600":"text-gray-400"}`}),n.jsx("p",{className:`text-lg font-medium ${O} mb-2`,children:"Нет задач"}),n.jsx("p",{className:`text-sm ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:m!=="all"||b!=="all"||N.length>0?"Попробуйте изменить фильтры":"Создайте первую задачу"})]}):E==="kanban"?n.jsx(Pk,{tasks:f,onUpdate:M,onEdit:ee,onDelete:Z}):n.jsx("div",{className:"grid grid-cols-1 gap-4 sm:gap-6",children:f.map(B=>n.jsx(Rk,{task:B,onEdit:ee,onDelete:Z,onUpdate:M},B.id))})]})]}),t&&n.jsx(Ik,{onClose:j,onSave:y,editingTask:a})]})})},No=[{id:"all",name:"Все вопросы",icon:n.jsx(Ii,{className:"w-5 h-5"}),color:"text-blue-600",darkColor:"text-blue-400"},{id:"auth",name:"Авторизация",icon:n.jsx(cf,{className:"w-5 h-5"}),color:"text-purple-600",darkColor:"text-purple-400"},{id:"slots",name:"Рабочие слоты",icon:n.jsx(Pr,{className:"w-5 h-5"}),color:"text-[#4E6E49]",darkColor:"text-[#4E6E49]"},{id:"status",name:"Статусы",icon:n.jsx(Wu,{className:"w-5 h-5"}),color:"text-orange-600",darkColor:"text-orange-400"},{id:"rating",name:"Рейтинг",icon:n.jsx(ws,{className:"w-5 h-5"}),color:"text-red-600",darkColor:"text-red-400"},{id:"earnings",name:"Заработок",icon:n.jsx(ra,{className:"w-5 h-5"}),color:"text-yellow-600",darkColor:"text-yellow-400"},{id:"calls",name:"Торговые сигналы",icon:n.jsx(ti,{className:"w-5 h-5"}),color:"text-emerald-700",darkColor:"text-emerald-500"},{id:"tasks",name:"Задачи",icon:n.jsx(Dr,{className:"w-5 h-5"}),color:"text-lime-600",darkColor:"text-lime-400"},{id:"admin",name:"Администратор",icon:n.jsx(Kt,{className:"w-5 h-5"}),color:"text-indigo-600",darkColor:"text-indigo-400"},{id:"messages",name:"Сообщения",icon:n.jsx(Gu,{className:"w-5 h-5"}),color:"text-cyan-600",darkColor:"text-cyan-400"},{id:"referrals",name:"Рефералы",icon:n.jsx(ln,{className:"w-5 h-5"}),color:"text-pink-600",darkColor:"text-pink-400"},{id:"edit",name:"Редактирование",icon:n.jsx(zt,{className:"w-5 h-5"}),color:"text-teal-600",darkColor:"text-teal-400"},{id:"interface",name:"Интерфейс сайта",icon:n.jsx(qu,{className:"w-5 h-5"}),color:"text-violet-600",darkColor:"text-violet-400"}],Wa=[{question:"Как начать работу с системой?",answer:`🚀 БЫСТРЫЙ СТАРТ:

1️⃣ АВТОРИЗАЦИЯ В БОТЕ:
   • Отправьте команду /start
   • Введите логин и пароль в формате: "логин : пароль"
   • После успешной авторизации получите ваши данные доступа
   • Используйте /menu для доступа к основным разделам

2️⃣ РАБОТА НА САЙТЕ:
   • Откройте сайт и войдите, используя те же логин и пароль
   • Выберите тему оформления (светлая/темная)
   • Ознакомьтесь с интерфейсом и разделами

3️⃣ ОЗНАКОМЛЕНИЕ:
   • Изучите правила сообщества по ссылке, которая придет после авторизации
   • Просмотрите раздел FAQ для ответов на частые вопросы
   • Начните с добавления рабочего слота или просмотра расписания

💡 СОВЕТ:
   • Сохраните логин и пароль в безопасном месте
   • Используйте сайт для удобной работы с данными
   • Бот удобен для быстрых команд и уведомлений`,category:"auth"},{question:"Как работает авторизация?",answer:`🔐 ПЕРВЫЙ ВХОД В БОТА:

1. Отправьте команду /start
2. Бот попросит ввести логин и пароль
3. Введите в формате: "логин : пароль" (например: mylogin : mypassword)
4. После успешной авторизации вы получите:
   ✨ Ваше имя
   🔑 Ваш логин
   🔒 Ваш пароль
   📖 Ссылку на правила сообщества

🌐 ВХОД НА САЙТ:

1. Откройте сайт
2. На странице входа выберите тип пользователя:
   👤 "Участник" - для обычного доступа
   🛡️ "Админ" - для административного режима

3. Если выбрали "Участник":
   • Введите логин
   • Введите пароль

4. Если выбрали "Админ":
   • Введите только пароль администратора

5. Выберите тему оформления:
   ☀️ Светлая тема - для работы днем
   🌙 Темная тема - для работы вечером/ночью

6. Нажмите "Войти"
7. При первом входе система запомнит ваши данные

🚪 ВЫХОД:

• В боте: команда /logout
• На сайте: кнопка выхода в правом верхнем углу или в личном кабинете

⚠️ ВАЖНО:

• Не передавайте свои данные доступа третьим лицам
• Храните логин и пароль в безопасном месте
• После выхода для доступа снова используйте /start в боте или войдите на сайте
• Тема оформления сохраняется и применяется ко всему сайту
• Режим администратора активируется автоматически при входе с паролем админа

❓ ПРОБЛЕМЫ С ВХОДОМ:

• Проверьте правильность формата (логин : пароль с пробелами вокруг двоеточия)
• Убедитесь, что используете правильные логин и пароль
• Если не помогло, обратитесь к администратору: @artyommedoed`,category:"auth"},{question:"Как войти в режим администратора на сайте?",answer:`АКТИВАЦИЯ РЕЖИМА АДМИНИСТРАТОРА НА САЙТЕ:
1. Откройте страницу входа на сайте
2. Выберите тип пользователя "Админ" (кнопка справа)
3. Введите пароль администратора
4. Нажмите "Войти"
5. После успешного входа режим администратора будет активен

ОТЛИЧИЯ ОТ ВХОДА УЧАСТНИКА:
• При входе как "Админ" не нужно вводить логин - только пароль
• Режим администратора активируется автоматически
• Все административные функции становятся доступными

ЧТО МОЖЕТ АДМИНИСТРАТОР:
• Управлять слотами и статусами всех участников
• Массовое создание/удаление слотов
• Добавлять заработок за любую дату
• Удалять сообщения из подсчета
• Просматривать и редактировать данные всех участников

ДЕАКТИВАЦИЯ:
• Выйдите из системы (кнопка выхода в правом верхнем углу)
• При следующем входе выберите "Участник" для обычного доступа

ВАЖНО:
• Пароль администратора не передавайте третьим лицам
• Режим администратора дает полный доступ к системе`,category:"admin"},{question:"Как добавить торговый сигнал?",answer:`📱 В БОТЕ:

1. Используйте команду /add_call
2. Следуйте инструкциям бота для пошагового ввода:

📋 ШАГ 1 - СЕТЬ:
   • Выберите сеть из списка:
     🔹 Solana
     🔹 BSC
     🔹 Ethereum
     🔹 Base
     🔹 Ton
     🔹 Tron
     🔹 SUI
     🔹 CEX биржа
   • Нажмите на соответствующую кнопку

🏷️ ШАГ 2 - ТИКЕР ТОКЕНА:
   • Введите тикер токена (например: PEPE, DOGE, BONK)
   • Бот покажет его с символом № (например: №PEPE)

💱 ШАГ 3 - ПАРА ТОКЕНА:
   • Введите торговую пару (например: PEPE/USDT)

📍 ШАГ 4 - ТОЧКА ВХОДА:
   • Введите точку входа или диапазон в формате капитализации
   • Можно указать одно значение или диапазон
   • Пример: 1000000 или 1000000-1500000

🎯 ШАГ 5 - ЦЕЛЬ:
   • Введите цели по прибыли в формате капитализации
   • Можно указать несколько целей через запятую
   • Пример: 2000000, 3000000, 5000000

📊 ШАГ 6 - СТРАТЕГИЯ:
   • Выберите стратегию:
     ⚡ Флип - краткосрочная торговля
     📈 Среднесрок - среднесрочная торговля
     🎯 Долгосрок - долгосрочная торговля

⚠️ ШАГ 7 - РИСКИ:
   • Опишите риски, связанные с этим сигналом

🔄 ШАГ 8 - УСЛОВИЯ ОТМЕНЫ:
   • Укажите условия отмены или пересмотра сигнала
   • Или отправьте "-" для пропуска

💬 ШАГ 9 - КОММЕНТАРИЙ:
   • Добавьте дополнительный комментарий
   • Или отправьте "-" для пропуска

🌐 НА САЙТЕ:

1. Перейдите в раздел "Call"
2. Нажмите кнопку "Создать сигнал"
3. Заполните удобную форму со всеми параметрами
4. Нажмите "Сохранить"

✨ ПРЕИМУЩЕСТВА САЙТА:
   • Удобная форма с подсказками
   • Визуальное отображение всех параметров
   • Возможность редактирования после создания

👀 ПРОСМОТР СИГНАЛОВ:
   • /my_calls - ваши сигналы в боте
   • /all_calls - все активные сигналы команды в боте
   • Раздел "Call" на сайте - все сигналы с фильтрацией и поиском`,category:"calls"},{question:"Как просмотреть торговые сигналы?",answer:`В БОТЕ:

МОИ СИГНАЛЫ:
• /my_calls - показывает все ваши торговые сигналы
• Отображается список с:
  - Символом № перед тикером
  - Сетью и парой
  - Точкой входа (капитализация)
  - Целью (капитализация)
  - Стратегией
  - Статусом (Активен/Завершен/Отменен)
  - Датой создания

ВСЕ СИГНАЛЫ:
• /all_calls - показывает все активные сигналы команды
• Фильтрует только активные сигналы
• Отображает информацию о трейдере

НА САЙТЕ:
1. Перейдите в раздел "Call"
2. На странице отображаются:
   • Все сигналы команды
   • Поиск по тикеру, паре или сети
   • Фильтрация по статусу
   • Статистика по сигналам

АНАЛИТИКА:
• Раздел "Call" на сайте показывает:
  - Общую статистику команды
  - Статистику каждого трейдера
  - Средний PNL
  - Количество активных/завершенных/отмененных сигналов
  - Максимальную прибыль

РЕДАКТИРОВАНИЕ И УДАЛЕНИЕ:
• На сайте: кнопки редактирования и удаления для ваших сигналов
• Только автор сигнала или администратор могут редактировать/удалять`,category:"calls"},{question:"Что означают параметры торгового сигнала?",answer:`ПОЛНЫЙ СПИСОК ПАРАМЕТРОВ:

1. СЕТЬ:
• Solana, BSC, Ethereum, Base, Ton, Tron, SUI или CEX биржа
• Определяет блокчейн, на котором торгуется токен

2. ТИКЕР ТОКЕНА (№ТИКЕР):
• Идентификатор токена (например: №PEPE)
• Символ № указывает, что это тикер
• Можно скопировать для поиска на биржах

3. ПАРА ТОКЕНА:
• Торговая пара (например: PEPE/USDT)
• Показывает, с какой валютой торгуется токен

4. ТОЧКА ВХОДА:
• Указывается в формате КАПИТАЛИЗАЦИИ (не цены)
• Может быть одно значение или диапазон
• Пример: 1000000 или 1000000-1500000

5. ЦЕЛЬ:
• Цели по прибыли в формате КАПИТАЛИЗАЦИИ
• Можно указать несколько целей через запятую
• Пример: 2000000, 3000000, 5000000

6. СТРАТЕГИЯ:
• Флип - краткосрочная торговля (часы-дни)
• Среднесрок - среднесрочная торговля (дни-недели)
• Долгосрок - долгосрочная торговля (недели-месяцы)

7. РИСКИ:
• Описание рисков, связанных с торговлей этим токеном
• Важно для понимания потенциальных потерь

8. УСЛОВИЯ ОТМЕНЫ:
• При каких условиях сигнал должен быть отменен
• Может быть изменен или пересмотрен

9. КОММЕНТАРИЙ:
• Дополнительная информация о сигнале
• Аналитика или особенности токена

ВАЖНО:
• Точка входа и цель указываются в КАПИТАЛИЗАЦИИ, а не в цене
• Это помогает учитывать изменения ликвидности и общую оценку проекта`,category:"calls"},{question:"Как работает раздел Management на сайте?",answer:`ОСНОВНЫЕ ВОЗМОЖНОСТИ:

ПРЕДСТАВЛЕНИЯ:
1. ТАБЛИЦА:
   • Отображает участников в строках, дни недели - в колонках
   • Компактный вид для быстрого обзора
   • Аватары участников в первом столбце
   • Подсветка строк при наведении
   • Чередующаяся подсветка для лучшей читаемости

2. НЕДЕЛЯ:
   • Отображает каждый день недели отдельно
   • Карточки со слотами и статусами
   • Визуальное разделение по участникам
   • Удобно для просмотра расписания по дням

ФИЛЬТРЫ СЛОТОВ:
• Все - показывает все слоты
• Предстоящие - только будущие и текущие активные слоты
• Завершенные - только прошедшие слоты

ВИЗУАЛЬНОЕ РАЗДЕЛЕНИЕ:
• Предстоящие слоты: синий градиент с иконкой календаря
• Завершенные слоты: серый градиент с иконкой галочки
• Перерывы: белый фон (светлая тема) или темно-серый (темная тема)
• Аватары участников для быстрой идентификации

СТАТИСТИКА:
• Общее количество слотов за неделю
• Количество предстоящих и завершенных слотов
• Количество активных участников

НАВИГАЦИЯ:
• Кнопки "Предыдущая неделя" и "Следующая неделя"
• Автоматическое отображение текущей недели

БЫСТРЫЕ ДЕЙСТВИЯ:
• Добавление слотов, выходных, больничных, отпуска
• Массовое управление (для администраторов)
• Фильтрация по участникам`,category:"interface"},{question:"Как работают аватары участников?",answer:`ЧТО ТАКОЕ АВАТАРЫ:
• Фотографии участников команды, отображаемые вместо букв
• Круглые изображения для визуальной идентификации
• Помогают быстро найти нужного участника

ГДЕ ОТОБРАЖАЮТСЯ:
• Раздел Management (таблица и неделя)
• Первая колонка в таблице
• Карточки участников в недельном виде
• Рейтинг участников

КАК ДОБАВИТЬ ФОТО:
1. Поместите фотографии в папку public/avatars/
2. Назовите файлы по имени участника:
   • artyom.jpg - для Артёма
   • adel.jpg - для Адели
   • kseniya.jpg - для Ксении
   • olga.jpg - для Ольги
   • anastasia.jpg - для Анастасии

ТРЕБОВАНИЯ К ФОТО:
• Формат: JPG, PNG или другой веб-формат
• Рекомендуемый размер: 200x200 пикселей или больше
• Изображение автоматически обрезается до круга
• Оптимальное соотношение сторон: 1:1 (квадрат)

FALLBACK:
• Если фотография не загружена или не найдена:
  - Отображается первая буква имени
  - Круглая иконка с градиентным фоном
  - Автоматическое переключение при ошибке загрузки

ПРОБЛЕМЫ:
• Проверьте путь к файлу (public/avatars/)
• Убедитесь, что имя файла совпадает с настройками
• Перезагрузите страницу после добавления фото`,category:"interface"},{question:"Как выбрать тему оформления?",answer:`ВЫБОР ТЕМЫ:

НА СТРАНИЦЕ ВХОДА:
1. Откройте сайт
2. На странице входа найдите кнопку переключения темы в правом верхнем углу
3. Нажмите на кнопку:
   • 🌙 (Луна) - включить темную тему
   • ☀️ (Солнце) - включить светлую тему
4. Тема сохранится и будет применяться ко всему сайту после входа

ПОСЛЕ ВХОДА:
• Кнопка переключения темы в правом верхнем углу навигации
• Тема переключается мгновенно
• Сохраняется в браузере между сессиями

ЧТО МЕНЯЕТСЯ:

СВЕТЛАЯ ТЕМА:
• Светлый фон страниц
• Темный текст
• Яркие цвета элементов
• Оптимизирована для работы днем

ТЕМНАЯ ТЕМА:
• Темный фон страниц
• Светлый текст
• Приглушенные цвета элементов
• Оптимизирована для работы вечером/ночью
• Меньше нагрузки на глаза

СОХРАНЕНИЕ:
• Тема сохраняется автоматически в браузере
• При следующем входе тема будет автоматически применена
• Можно изменить в любой момент`,category:"interface"},{question:"Как отличаются предстоящие и завершенные слоты?",answer:`ВИЗУАЛЬНОЕ РАЗДЕЛЕНИЕ:

ПРЕДСТОЯЩИЕ СЛОТЫ:
• Синий градиентный фон (от blue-500 до blue-600)
• Иконка календаря 📅
• Белый текст
• Отображаются для:
  - Будущих дат
  - Текущего дня, если время окончания еще не прошло

ЗАВЕРШЕННЫЕ СЛОТЫ:
• Серый градиентный фон (от gray-500 до gray-600)
• Иконка галочки ✓
• Белый текст
• Отображаются для:
  - Прошедших дат
  - Текущего дня, если время окончания уже прошло

ПЕРЕРЫВЫ:
• Белый фон в светлой теме
• Темно-серый фон (gray-700) в темной теме
• Рамка с оранжевым цветом
• Отображаются под основным слотом

ФИЛЬТРЫ:
• "Все" - показывает все слоты
• "Предстоящие" - только будущие и активные
• "Завершенные" - только прошедшие

ЗАЧЕМ ЭТО НУЖНО:
• Быстро увидеть, какие слоты еще предстоят
• Отличить актуальные слоты от прошлых
• Планировать дальнейшую работу
• Анализировать выполненную работу`,category:"slots"},{question:"Как добавить рабочий слот?",answer:`📱 В БОТЕ:

1. Используйте команду /add_slot
2. Введите дату в формате ДД.ММ.ГГГГ (например: 25.12.2024)
3. Введите время начала в формате ЧЧ:ММ (например: 10:00)
4. Введите время окончания (например: 14:00)
5. При необходимости добавьте перерывы:
   • Отправьте время начала перерыва
   • Или отправьте "-" для пропуска
6. Добавьте комментарий (опционально)

🌐 НА САЙТЕ:

1. Перейдите в раздел "Расписание" (Management)
2. Нажмите кнопку "Добавить слот"
3. Заполните удобную форму:
   👤 Выберите участника (для администратора)
   📅 Выберите дату или несколько дат
   ⏰ Добавьте временные интервалы
   ☕ Укажите перерывы (если нужны)
   💬 Добавьте комментарий
4. Нажмите "Сохранить"

✨ ПРЕИМУЩЕСТВА САЙТА:
   • Удобный интерфейс с визуальным отображением
   • Возможность добавления нескольких интервалов
   • Навигация по шагам с подсказками
   • Предпросмотр выбранных параметров

👑 ДЛЯ АДМИНИСТРАТОРОВ:
   • Массовая установка слотов на несколько участников
   • Установка слотов на несколько дат одновременно
   • Удобное управление расписанием команды`,category:"slots"},{question:"Как работают перекрытия слотов?",answer:`Система разрешает перекрытие слотов при определенных условиях:

✅ РАЗРЕШЕНО:
- Если новый слот начинается после начала существующего. Например, если есть слот 19:00-21:00, можно создать слот 20:00-22:00
- Перекрытие может быть частичным или полным, если начало нового слота совпадает с началом или происходит после начала существующего

❌ ЗАПРЕЩЕНО:
- Если новый слот начинается до начала существующего и перекрывается с ним
- Максимум 3 участника могут иметь перекрывающиеся слоты одновременно

Примеры:
• Слот 19:00-21:00 и слот 20:00-22:00 ✅ РАЗРЕШЕНО
• Слот 19:00-21:00 и слот 18:00-20:00 ❌ ЗАПРЕЩЕНО
• Слот 19:00-21:00 и слот 21:30-23:00 ✅ РАЗРЕШЕНО`,category:"slots"},{question:"Как посмотреть расписание?",answer:`В боте:
1. Используйте команду /schedule
2. Бот покажет расписание на текущую неделю
3. Используйте кнопки "◀️ Предыдущая" и "Следующая ▶️" для навигации между неделями

Что показывает расписание:
• Все рабочие слоты участников (с временем и ID)
• Выходные, больничные и отпуск всех участников
• Комментарии к слотам и статусам
• ID каждого слота для редактирования/удаления

На сайте:
1. Перейдите в раздел Management
2. На странице автоматически отображается расписание на текущую неделю
3. Используйте навигацию для просмотра других недель
4. Можно фильтровать по участникам

Формат отображения:
• 🟢 Рабочие слоты
• 🟡 Выходные
• 🟣 Больничные
• 🟠 Отпуск`,category:"slots"},{question:"Как добавить выходной?",answer:`В боте:
1. Используйте команду /dayoff
2. Введите дату выходного в формате ДД.ММ.ГГГГ
3. Добавьте комментарий (опционально, отправьте "-" для пропуска)

Важные ограничения:
• Максимально 2 выходных в неделю
• Не более 3 человек могут быть в выходном на одну дату
• Нельзя установить выходной на сегодняшний день (используйте больничный или смену)

На сайте:
1. Перейдите в раздел Management
2. Нажмите кнопку "Добавить выходной"
3. Выберите дату и участника (для админа)
4. Добавьте комментарий (опционально)
5. Нажмите "Сохранить"

Для администраторов доступна массовая установка выходных на несколько участников и дат.`,category:"status"},{question:"Как добавить больничный?",answer:`В боте:
1. Используйте команду /sick
2. Введите дату больничного в формате ДД.ММ.ГГГГ
3. При необходимости укажите несколько дней (система предложит ввести дату окончания)
4. Добавьте комментарий (опционально)

Важные ограничения:
• Обычные пользователи могут добавить больничный только на сегодня + 2 дня вперед
• Администраторы могут добавлять больничные на любые даты
• Максимально 14 дней больничного в месяц
• Больничный должен быть минимум на 1 день

На сайте:
1. Перейдите в раздел Management
2. Нажмите кнопку "Добавить больничный"
3. Выберите дату (и дату окончания для нескольких дней)
4. Добавьте комментарий и сохраните`,category:"status"},{question:"Как добавить отпуск?",answer:`В боте:
1. Используйте команду /vacation
2. Введите дату начала отпуска в формате ДД.ММ.ГГГГ
3. Введите дату окончания отпуска
4. Добавьте комментарий (опционально)

Важные ограничения:
• Максимально 14 дней отпуска в месяц
• Не более 6 отпусков в год
• Отпуск автоматически создается для всех дней в указанном диапазоне включительно

На сайте:
1. Перейдите в раздел Management
2. Нажмите кнопку "Добавить отпуск"
3. Выберите дату начала и окончания
4. Добавьте комментарий и сохраните`,category:"status"},{question:"Как работает система рейтинга?",answer:`📊 СИСТЕМА РЕЙТИНГА:

Рейтинг рассчитывается в процентах (максимум 100%) на основе 7 параметров за неделю:

1️⃣ ВЫХОДНЫЕ (10%)
   ✅ 0-2 выходных в неделю = 10%
   ❌ Более 2 выходных = 0%

2️⃣ БОЛЬНИЧНЫЕ (10%)
   ✅ До 7 дней за месяц = 10%
   ❌ Более 7 дней = 0%

3️⃣ ОТПУСК (10%)
   ✅ До 7 дней за месяц = 10%
   ❌ Более 7 дней = 0%

4️⃣ ЧАСЫ РАБОТЫ (до 25%)
   🟢 20+ часов в неделю = 25%
   🟡 15-19 часов = 15%
   🔴 Менее 15 часов = 0%

5️⃣ ЗАРАБОТОК (до 30%)
   🟢 6000+ ₽ в неделю = 30%
   🟡 3000-5999 ₽ = 15%
   🔴 Менее 3000 ₽ = 0%

6️⃣ РЕФЕРАЛЫ (до 30%)
   • 5% за каждого реферала
   • Максимум 30% (6 рефералов)
   • Учитываются за последние 30 дней

7️⃣ СООБЩЕНИЯ В ГРУППЕ (15%)
   ✅ Более 50 сообщений в неделю = 15%
   ❌ 50 и менее = 0%

👀 ПРОСМОТР РЕЙТИНГА:

📱 В БОТЕ:
   • /my_stats - ваша статистика и разбор рейтинга
   • /team_kpd - средний рейтинг команды

🌐 НА САЙТЕ:
   • Раздел "Рейтинг" - детальная статистика с визуализацией
   • Карточки участников с разбором по параметрам
   • Визуальные индикаторы прогресса
   • Средний рейтинг команды

💡 СОВЕТЫ:
   • Стремитесь к 20+ часам в неделю для максимальных баллов
   • Поддерживайте активность в группе (более 50 сообщений)
   • Привлекайте рефералов для дополнительных баллов`,category:"rating"},{question:"Какие есть ограничения и правила?",answer:`ОСНОВНЫЕ ОГРАНИЧЕНИЯ:

📅 ВЫХОДНЫЕ:
• Максимум 2 выходных в неделю
• Не более 3 человек одновременно на одну дату
• Нельзя установить выходной на сегодня

🏥 БОЛЬНИЧНЫЕ:
• Обычные пользователи: только сегодня + 2 дня вперед
• Максимум 14 дней в месяц
• Администраторы могут добавлять на любые даты

🏖️ ОТПУСК:
• Максимум 14 дней в месяц
• Не более 6 отпусков в год

⏰ СЛОТЫ:
• Можно перекрывать, если новый слот начинается после начала существующего
• Максимум 3 участника на перекрывающиеся слоты

💰 ЗАРАБОТОК:
• Обычные пользователи: только за сегодня
• Администраторы: за любую дату

📊 РЕЙТИНГ:
• Минимум 15 часов в неделю для получения баллов (15%)
• 20+ часов в неделю для максимальных баллов (25%)
• Минимум 50 сообщений в неделю для получения баллов (15%)
• Минимум 3000₽ в неделю для получения баллов (15%)

📖 ПОЛНЫЕ ПРАВИЛА:
Ознакомьтесь с регламентом торговых сессий по ссылке, которая отправляется после авторизации.`,category:"rating"},{question:"Как добавить заработок?",answer:`В боте:
1. Используйте команду /add_earning
2. Введите дату в формате ДД.ММ.ГГГГ или "сегодня"
3. Введите сумму заработка (только число, например: 5000)
4. Введите сумму пула (только число, например: 1000)

Важно:
• Обычные пользователи могут добавлять заработок только за сегодня
• Администраторы могут добавлять заработок за любую дату

На сайте:
1. Перейдите в раздел Earnings
2. Нажмите кнопку "Добавить заработок"
3. Выберите дату (или введите "сегодня")
4. Укажите сумму заработка и сумму пула
5. При необходимости выберите участников (для распределенного заработка)
6. Нажмите "Сохранить"

Просмотр статистики:
• /earnings_day - статистика за день
• /earnings_week - статистика за неделю`,category:"earnings"},{question:"Как добавить в пул команды?",answer:`В боте:
1. Используйте команду /add_pool
2. Бот покажет список ваших завершенных слотов
3. Выберите слот, скопировав его ID
4. Введите ID слота
5. Введите сумму для добавления в пул (только число)

Важно:
• Можно добавить в пул только для завершенных слотов (слот должен закончиться)
• Слот должен принадлежать вам или вы должны быть его участником
• Пул добавляется на сегодняшнюю дату

На сайте:
1. Перейдите в раздел Earnings
2. Нажмите кнопку "Добавить в пул"
3. Выберите завершенный слот из списка
4. Укажите сумму пула
5. Нажмите "Сохранить"

Пул команды - это общий фонд для поддержки команды и распределения дополнительных бонусов.`,category:"earnings"},{question:"Как работает режим администратора?",answer:`АКТИВАЦИЯ В БОТЕ:
1. Используйте команду /admin
2. Введите пароль администратора
3. После успешной активации вы увидите подтверждение

АКТИВАЦИЯ НА САЙТЕ:
1. На странице входа выберите тип пользователя "Админ"
2. Введите пароль администратора
3. Режим активируется автоматически при входе

ВОЗМОЖНОСТИ АДМИНИСТРАТОРА:

📅 УПРАВЛЕНИЕ СЛОТАМИ:
• Создавать слоты для любого участника
• Массовое создание слотов для нескольких участников одновременно
• Удалять слоты любого участника
• Массовое удаление слотов (по дню недели, датам, диапазону дат)
• Редактировать слоты любого участника

📋 УПРАВЛЕНИЕ СТАТУСАМИ:
• Устанавливать выходные, больничные и отпуск для любого участника
• Массовое управление статусами
• Удалять статусы любого участника
• Редактировать статусы любого участника

💰 УПРАВЛЕНИЕ ЗАРАБОТКОМ:
• Добавлять заработок за любую дату (не только сегодня)
• Редактировать и удалять записи о заработке любого участника
• Добавлять в пул команды

📊 УПРАВЛЕНИЕ СИГНАЛАМИ:
• Редактировать и удалять любые торговые сигналы
• Просматривать всю аналитику команды

📊 ДОПОЛНИТЕЛЬНО:
• Удалять сообщения из подсчета (/remove_message)
• Добавлять больничные на любые даты
• Полный доступ ко всем функциям системы
• Видеть индикатор "Админ" в интерфейсе

ДЕАКТИВАЦИЯ:
• В боте: /logout - выход из системы
• На сайте: кнопка выхода в правом верхнем углу
• При следующем входе выберите "Участник" для обычного режима

БЕЗОПАСНОСТЬ:
• Пароль администратора храните в секрете
• Не передавайте пароль третьим лицам
• Режим администратора дает полный доступ ко всем данным`,category:"admin"},{question:"Как редактировать и удалять торговые сигналы?",answer:`РЕДАКТИРОВАНИЕ:

НА САЙТЕ:
1. Перейдите в раздел "Call"
2. Найдите нужный сигнал в списке
3. Нажмите кнопку редактирования (иконка карандаша)
4. Внесите изменения в форме
5. Нажмите "Сохранить"

УДАЛЕНИЕ:

НА САЙТЕ:
1. Перейдите в раздел "Call"
2. Найдите нужный сигнал
3. Нажмите кнопку удаления (иконка корзины)
4. Подтвердите удаление

ПРАВА ДОСТУПА:
• Обычные пользователи могут редактировать/удалять только свои сигналы
• Администраторы могут редактировать/удалять любые сигналы
• При попытке редактировать чужой сигнал кнопки будут неактивны

ЧТО МОЖНО ИЗМЕНИТЬ:
• Все параметры сигнала:
  - Сеть
  - Тикер токена
  - Пару
  - Точку входа
  - Цель
  - Стратегию
  - Риски
  - Условия отмены
  - Комментарий
  - Статус (Активен/Завершен/Отменен)

ВАЖНО:
• После редактирования изменения сохраняются сразу
• Статус сигнала влияет на отображение в списках
• Завершенные и отмененные сигналы не показываются в "активных"`,category:"calls"},{question:"Как работает аналитика в разделе Call?",answer:`ОБЩАЯ СТАТИСТИКА КОМАНДЫ:
• Общее количество сигналов
• Количество активных сигналов
• Количество завершенных сигналов
• Количество отмененных сигналов
• Средний PNL всех сигналов
• Лучший сигнал по максимальной прибыли

СТАТИСТИКА ПО ТРЕЙДЕРАМ:
• Количество сигналов каждого трейдера
• Активные/завершенные/отмененные сигналы
• Средний PNL трейдера
• Общий PNL трейдера
• Максимальная прибыль по сигналу

ОТОБРАЖЕНИЕ:
• Статистика обновляется автоматически при изменении сигналов
• Показывается только для участников команды
• Данные для MAX прибыли, PNL и капитализации загружаются из аналитических сервисов
• Обновление данных происходит в реальном времени

ИСПОЛЬЗОВАНИЕ:
• Оценить эффективность работы команды
• Сравнить результаты разных трейдеров
• Найти лучшие торговые стратегии
• Отследить динамику сигналов`,category:"calls"},{question:"Как работает подсчет сообщений?",answer:`Система автоматически считает сообщения в группе:

✅ УЧИТЫВАЮТСЯ:
• Все типы сообщений в группе (текст, фото, стикеры, видео, голосовые и т.д.)
• Сообщения авторизованных пользователей
• Сообщения за неделю (для расчета рейтинга)

❌ НЕ УЧИТЫВАЮТСЯ:
• Команды бота (начинающиеся с /)
• Сообщения неавторизованных пользователей
• Сообщения в личных чатах (только групповые)

Важно:
• Для учета в рейтинге нужно отправить более 50 сообщений в неделю (это дает 15% к рейтингу)
• Сообщения считаются автоматически, ничего делать не нужно
• Если сообщение удалено из группы, администратор может удалить его из подсчета командой /remove_message (ответить reply на сообщение)

Проверка количества сообщений:
• /my_stats - показывает количество сообщений за неделю
• Раздел "Рейтинг" на сайте - детальная статистика`,category:"messages"},{question:"Что делать, если сообщение удалено из группы?",answer:`Если сообщение было удалено из группы, оно все еще учитывается в подсчете. Чтобы убрать его из подсчета:

Для администратора:
1. Используйте команду /remove_message
2. Ответьте (reply) на удаленное сообщение (если оно видно в истории) ИЛИ введите ID сообщения
3. Система удалит сообщение из подсчета и уменьшит счетчик

Формат:
• /remove_message (с reply на сообщение) - автоматически определит ID
• /remove_message [messageId] - указать ID вручную

Что происходит:
• Сообщение удаляется из коллекции messages
• Счетчик в ratings уменьшается на 1
• При расчете рейтинга за неделю это сообщение не учитывается

Важно:
• Только администраторы могут удалять сообщения из подсчета
• Обычные пользователи не имеют доступа к этой функции
• Если сообщение удалено из группы, его ID можно узнать из истории чата или через другие методы`,category:"messages"},{question:"Как работают рефералы?",answer:`Система рефералов позволяет получить дополнительный рейтинг за привлечение новых участников:

Как добавить реферала:
В боте:
1. Используйте команду /add_referral
2. Введите имя реферала
3. Введите ID реферала (username или номер)
4. Укажите возраст (опционально, отправьте "-" для пропуска)
5. Добавьте комментарий (опционально)

На сайте:
1. Перейдите в раздел Rating
2. Нажмите "Добавить реферала"
3. Заполните форму

Система начисления:
• 5% к рейтингу за каждого реферала
• Максимум 30% (6 рефералов)
• Рефералы учитываются за последние 30 дней

Управление рефералами:
• /my_referrals - список ваших рефералов
• /edit_referral [ID] - редактировать реферала
• /delete_referral [ID] - удалить реферала

На сайте доступны те же функции в разделе Rating.`,category:"referrals"},{question:"Как редактировать и удалять записи?",answer:`УДАЛЕНИЕ:

В боте (для своих записей):
• /delete_slot [ID] - удалить слот
• /delete_dayoff [ID] - удалить выходной
• /delete_sick [ID] - удалить больничный
• /delete_vacation [ID] - удалить отпуск
• /delete_earning [ID] - удалить заработок
• /delete_referral [ID] - удалить реферала

Массовое удаление слотов:
• /bulk_delete_slots - доступны варианты:
  - По дню недели (удалить все слоты на определенный день недели)
  - По датам (удалить слоты на конкретные даты)
  - По диапазону дат (удалить слоты за период)

На сайте:
• Перейдите в соответствующий раздел
• Найдите нужную запись
• Нажмите кнопку удаления (иконка корзины)
• Подтвердите удаление

РЕДАКТИРОВАНИЕ:

В боте:
• Редактирование доступно только на сайте
• Используйте команды вида /edit_slot [ID], чтобы получить информацию
• В боте появится сообщение о том, что редактирование доступно на сайте

На сайте:
• Перейдите в соответствующий раздел
• Найдите нужную запись
• Нажмите кнопку редактирования (иконка карандаша)
• Внесите изменения и сохраните

ЧТО МОЖНО РЕДАКТИРОВАТЬ:
• Рабочие слоты: время, перерывы, комментарий, участники
• Статусы: даты, комментарий
• Заработок: дата, сумма, пул, участники
• Торговые сигналы: все параметры и статус
• Рефералы: имя, возраст, комментарий

Важно:
• Обычные пользователи могут редактировать/удалять только свои записи
• Администраторы могут управлять записями всех участников
• При попытке редактировать чужую запись кнопки будут неактивны`,category:"edit"},{question:"Как использовать фильтры и поиск на сайте?",answer:`ФИЛЬТРЫ В РАЗДЕЛЕ MANAGEMENT:

ФИЛЬТР СЛОТОВ:
• "Все" - показывает все слоты независимо от статуса
• "Предстоящие" - только будущие и активные слоты
• "Завершенные" - только прошедшие слоты

ФИЛЬТР ПО УЧАСТНИКАМ:
• Выберите конкретного участника из списка
• "Все участники команды" - показывает всех
• Применяется к обоим представлениям (таблица и неделя)

ПРЕДСТАВЛЕНИЯ:
• "Таблица" - компактный вид с участниками в строках
• "Неделя" - детальный вид по дням недели
• Переключение кнопками в верхней части страницы

ПОИСК В РАЗДЕЛЕ CALL:
• Поле поиска в верхней части страницы
• Поиск по:
  - Тикеру токена (например: PEPE)
  - Паре токена (например: PEPE/USDT)
  - Сети (например: Solana)
• Поиск работает в реальном времени
• Автоматически фильтрует список сигналов

КАК ИСПОЛЬЗОВАТЬ:
1. Выберите нужный фильтр
2. Результаты обновятся автоматически
3. Несколько фильтров можно применять одновременно
4. Для сброса выберите "Все" или очистите поле поиска`,category:"interface"},{question:"Как работает статистика на сайте?",answer:`РАЗДЕЛ MANAGEMENT:

СТАТИСТИКА СЛОТОВ:
• Общее количество слотов за неделю
• Количество предстоящих слотов (синий индикатор)
• Количество завершенных слотов (серый индикатор)
• Количество активных участников за неделю

СТАТИСТИКА ПО УЧАСТНИКУ:
• Количество слотов участника
• Общее количество часов работы
• Отображается в последней колонке таблицы

РАЗДЕЛ EARNINGS:

СТАТИСТИКА ЗАРАБОТКА:
• Заработок за неделю
• Пул команды за неделю
• Заработок за месяц
• Пул команды за месяц

РАЗДЕЛ RATING:

РЕЙТИНГ УЧАСТНИКОВ:
• Процент эффективности каждого участника
• Детальный разбор по параметрам:
  - Выходные (10%)
  - Больничные (10%)
  - Отпуск (10%)
  - Часы работы (до 25%)
  - Заработок (до 30%)
  - Рефералы (до 30%)
  - Сообщения (15%)

СРЕДНИЙ РЕЙТИНГ КОМАНДЫ:
• Общий процент эффективности команды
• Визуальный индикатор с цветовыми зонами:
  - Зеленая: 70%+
  - Желтая: 50-70%
  - Синяя: менее 50%

РАЗДЕЛ CALL:

СТАТИСТИКА СИГНАЛОВ:
• Общее количество сигналов
• Активные/завершенные/отмененные
• Средний PNL команды
• Лучший сигнал по прибыли
• Статистика по каждому трейдеру

ОБНОВЛЕНИЕ:
• Статистика обновляется автоматически
• При изменении данных статистика пересчитывается
• Данные загружаются из базы данных в реальном времени`,category:"interface"},{question:"Как работает навигация на сайте?",answer:`СТРУКТУРА МЕНЮ:

НА ПК (верхнее меню):
• Call - управление торговыми сигналами
• Функционал - выпадающее меню с подразделами:
  - Расписание (Management)
  - Заработок (Earnings)
  - Задачи (Tasks)
  - Рейтинг (Rating)
• О сообществе - информация о команде
• FAQ - часто задаваемые вопросы
• ЛК - личный кабинет
• Админ - только для администраторов

НА МОБИЛЬНЫХ (нижнее меню):
• Фиксированное меню внизу экрана для удобной навигации
• Те же разделы, что и на ПК
• Подменю "Функционал" открывается вверх от кнопки
• Иконки и подписи для быстрого доступа

ОСНОВНЫЕ РАЗДЕЛЫ:

CALL:
• Управление торговыми сигналами
• Создание, редактирование, удаление сигналов
• Аналитика по сигналам и трейдерам
• Поиск и фильтрация сигналов

ФУНКЦИОНАЛ:

Расписание (Management):
• Управление рабочими слотами
• Установка выходных, больничных, отпуска
• Просмотр расписания команды
• Два представления: таблица и неделя
• Фильтры по статусу и участникам

Заработок (Earnings):
• Добавление заработка
• Добавление в пул команды
• Статистика заработка (неделя/месяц)
• Просмотр истории заработка

Задачи (Tasks):
• Управление задачами и заданиями команды
• Kanban доска с drag & drop
• Список задач
• Система согласования задач
• Фильтрация по категориям, статусам и участникам
• Уведомления о новых задачах и изменениях

Рейтинг (Rating):
• Рейтинг всех участников
• Детальный разбор по параметрам
• Средний рейтинг команды
• Управление рефералами

О СООБЩЕСТВЕ:
• Информация о команде ApeVault
• Возможности и принципы работы
• Ссылка на правила сообщества
• Контактная информация

FAQ:
• Ответы на частые вопросы
• Инструкции по работе с системой
• Категории для удобной навигации

ЛК (ЛИЧНЫЙ КАБИНЕТ):
• Личные данные: имя, логин, пароль
• Рейтинг и эффективность
• Статистика задач
• Уведомления
• Выход из аккаунта

АДМИН (только для администраторов):
• Информация о режиме администратора
• Список возможностей
• Доступен только при активном режиме админа`,category:"interface"},{question:"Что такое личный кабинет (ЛК)?",answer:`ЛИЧНЫЙ КАБИНЕТ - это раздел с вашими персональными данными и статистикой:

ЛИЧНЫЕ ДАННЫЕ:
• Имя - ваше имя в системе
• Логин - ваш логин для входа
• Пароль - ваш пароль (с возможностью показать/скрыть и копировать)

РЕЙТИНГ:
• Процент эффективности (максимум 100%)
• Детальный разбор по параметрам:
  - Выходные (10%)
  - Больничные (10%)
  - Отпуск (10%)
  - Часы работы (до 25%)
  - Заработок (до 30%)
  - Рефералы (до 30%)
  - Сообщения (15%)
• Цветовая индикация:
  - Зеленая: 70%+
  - Желтая: 50-70%
  - Синяя: менее 50%

МОИ ЗАДАЧИ:
• Статистика по статусам:
  - Проверка
  - В работе
  - Выполнена
  - Всего задач
• Кнопка перехода к задачам

УВЕДОМЛЕНИЯ:
• Количество непрочитанных уведомлений
• Общее количество уведомлений
• Кнопка перехода к уведомлениям

ВЫХОД ИЗ АККАУНТА:
• Кнопка "Выйти из аккаунта" внизу страницы
• При выходе:
  - Деактивируется режим администратора (если был активен)
  - Выполняется выход из системы
  - Перенаправление на страницу входа

КАК ОТКРЫТЬ:
• Нажмите "ЛК" в меню навигации
• Или перейдите по адресу /profile

ВАЖНО:
• Все данные обновляются автоматически
• Рейтинг рассчитывается на основе последних данных
• Задачи и уведомления загружаются в реальном времени`,category:"interface"},{question:"Как работает раздел Tasks (Задачи)?",answer:`РАЗДЕЛ ЗАДАЧ - это система управления заданиями для команды:

ОСНОВНЫЕ ВОЗМОЖНОСТИ:

СОЗДАНИЕ ЗАДАЧ:
1. Нажмите кнопку "Новая задача"
2. Заполните форму:
   • Название задачи (обязательно)
   • Описание (необязательно)
   • Категория: торговля, обучение, техническая часть, стрим, изучение нового, поиск и систематизация информации
   • Приоритет: низкий, средний, высокий
   • Срок выполнения (необязательно)
   • Участники (выберите одного или нескольких)
3. Нажмите "Создать задачу"

СТАТУСЫ ЗАДАЧ:

1. РАССМОТРЕНИЕ:
   • Все новые задачи начинаются с этого статуса
   • Все назначенные участники должны согласовать задачу
   • Участники могут одобрить или отклонить с комментарием
   • После согласования всеми участниками задача автоматически переходит в "В работе"

2. В РАБОТЕ:
   • Задача выполняется участниками
   • Можно переместить в "Выполнена" когда работа завершена

3. ВЫПОЛНЕНА:
   • Задача завершена
   • Если в задаче несколько участников, они получают уведомление для подтверждения
   • Создатель задачи может закрыть задачу

4. ЗАКРЫТА:
   • Задача окончательно закрыта
   • Не участвует в активной работе

ФИЛЬТРЫ:
• По категориям: торговля, обучение, техническая часть, стрим, изучение нового, поиск и систематизация информации
• По статусам: на рассмотрении, в работе, выполнена, закрыта
• По участникам: фильтр по конкретному участнику или все

УВЕДОМЛЕНИЯ:
• При создании задачи все назначенные участники получают уведомление
• При изменении статуса задачи (если несколько участников) отправляются уведомления
• При завершении задачи участники получают запрос на подтверждение
• Индикатор непрочитанных уведомлений на карточке задачи
• Кнопка "Отметить все прочитанными" для быстрой очистки

СТАТИСТИКА:
• Количество задач по каждому статусу
• Общее количество задач
• Быстрый обзор активности команды

УПРАВЛЕНИЕ:
• Редактирование задач (только создатель или администратор)
• Удаление задач (только создатель или администратор)
• Изменение статуса задач
• Согласование/отклонение задач`,category:"tasks"},{question:"Как создать задачу и назначить участников?",answer:`СОЗДАНИЕ ЗАДАЧИ:

1. Перейдите в раздел "Задачи"
2. Нажмите кнопку "Новая задача"
3. Заполните форму:

ОБЯЗАТЕЛЬНЫЕ ПОЛЯ:
• Название задачи - краткое описание задания
• Участники - выберите одного или нескольких участников команды

НЕОБЯЗАТЕЛЬНЫЕ ПОЛЯ:
• Описание - детальное описание задачи
• Категория - выберите из списка:
  📈 Торговля
  📚 Обучение
  ⚙️ Техническая часть
  📺 Стрим
  🔬 Изучение нового
  📋 Поиск и систематизация информации
• Приоритет - низкий, средний или высокий
• Срок выполнения - выберите дату (необязательно)

ВЫБОР УЧАСТНИКОВ:
• Нажмите на карточку участника для выбора
• Можно выбрать нескольких участников
• Кнопка "Выбрать всех" для массового выбора
• Кнопка "Снять выделение" для сброса

СОЗДАНИЕ:
• После заполнения нажмите "Создать задачу"
• Задача будет создана со статусом "Проверка"
• Все назначенные участники получат уведомление

ВАЖНО:
• Задача должна иметь хотя бы одного участника
• После создания задачи все участники должны согласовать ее
• Только после согласования всеми участниками задача перейдет в "В работе"`,category:"tasks"},{question:"Как работает система согласования задач?",answer:`СОГЛАСОВАНИЕ ЗАДАЧ:

КОГДА НУЖНО СОГЛАСОВАТЬ:
• Все новые задачи начинаются со статуса "Проверка"
• Все назначенные участники должны согласовать задачу
• Пока не все согласовали, задача остается в статусе "Проверка"

КАК СОГЛАСОВАТЬ:
1. Найдите задачу со статусом "Проверка"
2. Если вы назначены участником, увидите кнопки "Согласовать" и "Отклонить"
3. Нажмите "Согласовать"
4. При необходимости добавьте комментарий
5. Нажмите "Согласовать" в диалоге

КАК ОТКЛОНИТЬ:
1. Нажмите кнопку "Отклонить"
2. Обязательно укажите причину отклонения в комментарии
3. Нажмите "Отклонить"

ЧТО ПРОИСХОДИТ ПОСЛЕ СОГЛАСОВАНИЯ:
• Ваше согласование сохраняется
• Отображается количество согласований (например: "Согласований: 2/3")
• Когда все участники согласуют, задача автоматически переходит в статус "В работе"
• Кнопка "В работу" появляется только после согласования всеми

ПРОСМОТР СТАТУСА:
• На карточке задачи отображается количество согласований
• Видно, кто уже согласовал, а кто еще нет
• Если вы еще не согласовали, кнопки будут активны

ВАЖНО:
• Комментарий при отклонении обязателен
• После согласования всеми участниками задача автоматически переходит в работу
• Если хотя бы один участник отклонил, задача остается на рассмотрении`,category:"tasks"},{question:"Как работают уведомления в задачах?",answer:`СИСТЕМА УВЕДОМЛЕНИЙ:

КОГДА ПОЯВЛЯЮТСЯ УВЕДОМЛЕНИЯ:

1. ПРИ СОЗДАНИИ ЗАДАЧИ:
   • Все назначенные участники получают уведомление
   • Текст: "Новая задача [название] добавлена. Просмотрите и согласуйте."
   • Появляется индикатор на карточке задачи

2. ПРИ ИЗМЕНЕНИИ СТАТУСА:
   • Если в задаче несколько участников, все остальные получают уведомление
   • При перемещении в "В работе": "Задача [название] перемещена в работу пользователем [имя]"
   • При перемещении в "Закрыта": "Задача [название] закрыта пользователем [имя]"

3. ПРИ ЗАВЕРШЕНИИ ЗАДАЧИ:
   • Если в задаче несколько участников, они получают уведомление
   • Текст: "Задача [название] выполнена. Подтвердите выполнение."
   • Участники могут подтвердить выполнение

ИНДИКАТОРЫ:
• Значок колокольчика на карточке задачи
• Красный бейдж с количеством непрочитанных уведомлений
• Отображается только если есть непрочитанные уведомления

УПРАВЛЕНИЕ УВЕДОМЛЕНИЯМИ:
• Кнопка "Отметить все прочитанными" в верхней части страницы
• Показывает количество непрочитанных уведомлений
• После нажатия все уведомления помечаются как прочитанные

ВАЖНО:
• Уведомления появляются только для задач с несколькими участниками
• Если в задаче один участник, уведомления не создаются
• Уведомления помогают отслеживать изменения в задачах`,category:"tasks"},{question:"Как фильтровать задачи?",answer:`ФИЛЬТРАЦИЯ ЗАДАЧ:

ФИЛЬТР ПО КАТЕГОРИЯМ:
• Все - показывает задачи всех категорий
• Торговля 📈
• Обучение 📚
• Техническая часть ⚙️
• Стрим 📺
• Изучение нового 🔬
• Поиск и систематизация информации 📋

ФИЛЬТР ПО СТАТУСАМ:
• Все - показывает задачи всех статусов
• Проверка - задачи, ожидающие согласования
• В работе - активные задачи
• Выполнена - завершенные задачи
• Закрыта - окончательно закрытые задачи

ФИЛЬТР ПО УЧАСТНИКАМ:
• Все - показывает задачи всех участников
• Конкретный участник - фильтрует задачи, где участник назначен

КАК ИСПОЛЬЗОВАТЬ:
1. В левой части страницы находится панель фильтров
2. Выберите нужные фильтры
3. Список задач автоматически обновится
4. Можно применять несколько фильтров одновременно
5. Кнопка "Сбросить" для очистки всех фильтров

СТАТИСТИКА:
• В верхней части страницы отображается статистика по статусам
• Показывает количество задач в каждом статусе
• Обновляется автоматически при изменении фильтров`,category:"tasks"}],Mk=()=>{const{theme:r}=Ze(),[e,t]=A.useState("all"),[s,a]=A.useState(new Set),i=r==="dark"?"text-white":"text-gray-900",l=r==="dark"?"text-gray-400":"text-gray-600",c=r==="dark"?"text-gray-300":"text-gray-700",d=r==="dark"?"bg-[#1a1a1a]":"bg-white",h=r==="dark"?"border-gray-800":"border-gray-200",m=r==="dark"?"hover:bg-gray-700":"hover:bg-gray-50",x=e==="all"?Wa:Wa.filter(T=>T.category===e),b=No.find(T=>T.id===e),I=T=>{const E=new Set(s),P=Wa.indexOf(T);E.has(P)?E.delete(P):E.add(P),a(E)},N=T=>T.split(`
`).map((P,O)=>{const C=P.trim();return C.match(/^[А-Я\s]+:$/)||C.match(/^\d+\.\s+[А-Я]/)?n.jsx("h4",{className:`font-bold text-base mt-4 mb-2 ${r==="dark"?"text-white":"text-gray-900"}`,children:C},O):C.startsWith("✅")||C.startsWith("❌")?n.jsxs("div",{className:`flex items-start gap-2 my-2 ${C.startsWith("✅")?"text-[#4E6E49]":r==="dark"?"text-red-400":"text-red-600"}`,children:[n.jsx("span",{className:"text-xl",children:C.startsWith("✅")?"✅":"❌"}),n.jsx("span",{className:"flex-1",children:C.substring(2).trim()})]},O):C.startsWith("•")?n.jsxs("div",{className:"flex items-start gap-2 my-1.5 ml-4",children:[n.jsx("span",{className:`${r==="dark"?"text-blue-400":"text-blue-600"} mt-1`,children:"•"}),n.jsx("span",{className:"flex-1",children:C.substring(1).trim()})]},O):C.match(/^[📅🏥🏖️⏰💰📊📖]\s+[А-Я]/)?n.jsx("div",{className:`font-semibold text-base mt-3 mb-1 ${r==="dark"?"text-gray-200":"text-gray-800"}`,children:C},O):C?n.jsx("p",{className:"my-2 leading-relaxed",children:C},O):n.jsx("br",{},O)});return n.jsx(sr,{children:n.jsxs("div",{className:"space-y-6",children:[n.jsxs("div",{className:"section-card rounded-2xl p-5 sm:p-6 md:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden mb-4 sm:mb-6",children:[n.jsx("div",{className:"absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"}),n.jsx("div",{className:"absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-[#4E6E49]/10 to-yellow-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"}),n.jsxs("div",{className:"relative z-10 text-center space-y-3 sm:space-y-4",children:[n.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4",children:[n.jsx("div",{className:`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0 ${r==="dark"?"bg-gradient-to-br from-blue-600 to-purple-600":"bg-gradient-to-br from-blue-500 to-purple-500"} text-white transform transition-transform active:scale-95 sm:hover:scale-110`,children:n.jsx(Ii,{className:"w-5 h-5 sm:w-7 sm:h-7"})}),n.jsx("div",{className:"flex-1 min-w-0",children:n.jsxs("h1",{className:`text-2xl sm:text-3xl md:text-4xl font-extrabold ${i} flex flex-wrap items-center justify-center gap-2 sm:gap-3`,children:[n.jsx("span",{className:"bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text",children:"FAQ ApeVault Black Ops"}),n.jsx(Bt,{className:`hidden sm:inline-flex w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${r==="dark"?"text-yellow-400":"text-yellow-500"} animate-pulse`})]})})]}),n.jsx("p",{className:`text-sm sm:text-base font-medium ${l}`,children:"Найдите ответы на популярные вопросы о работе системы"})]})]}),n.jsx("div",{className:"mb-6 section-card rounded-2xl p-4 sm:p-5 border border-white/60 dark:border-white/10 shadow",children:n.jsx("div",{className:"flex flex-wrap gap-2 justify-center",children:No.map(T=>n.jsxs("button",{onClick:()=>{t(T.id),a(new Set)},className:`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${e===T.id?r==="dark"?"bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105":"bg-blue-600 text-white shadow-lg scale-105":r==="dark"?"bg-[#1a1a1a] text-gray-300 border border-gray-800 hover:bg-gray-700 hover:border-gray-800":"bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"}`,children:[n.jsx("span",{className:e===T.id?"text-white":r==="dark"?T.darkColor:T.color,children:T.icon}),n.jsx("span",{children:T.name})]},T.id))})}),b&&e!=="all"&&n.jsx("div",{className:`${d} rounded-xl p-4 border-2 ${r==="dark"?"border-blue-500/30 bg-blue-500/5":"border-blue-200 bg-blue-50"} mb-6`,children:n.jsxs("div",{className:`flex items-center gap-3 ${r==="dark"?b.darkColor:b.color}`,children:[b.icon,n.jsxs("div",{children:[n.jsx("h3",{className:"font-bold text-lg",children:b.name}),n.jsxs("p",{className:`text-sm ${c}`,children:[x.length," ",x.length===1?"вопрос":x.length<5?"вопроса":"вопросов"]})]})]})}),n.jsx("div",{className:"space-y-4",children:x.length===0?n.jsx("div",{className:`${d} rounded-xl p-8 text-center border ${h}`,children:n.jsx("p",{className:c,children:"В этой категории пока нет вопросов"})}):x.map(T=>{const E=Wa.indexOf(T),P=s.has(E),O=No.find(M=>M.id===T.category),C=O?r==="dark"?O.darkColor:O.color:r==="dark"?"text-gray-300":"text-gray-600";return n.jsxs("div",{className:"section-card rounded-2xl shadow-lg border border-white/60 dark:border-white/10 overflow-hidden transition-all duration-300",children:[n.jsxs("button",{onClick:()=>I(T),className:`w-full p-5 sm:p-6 flex flex-col gap-3 text-left ${m} transition-colors group`,children:[n.jsxs("div",{className:"flex items-center justify-between gap-3",children:[n.jsxs("div",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border ${r==="dark"?"bg-[#1a1a1a]/80 border-gray-800":"bg-gray-100 border-gray-200"} ${C}`,children:[O&&n.jsx("span",{className:"flex items-center gap-1 text-sm",children:O.icon}),n.jsx("span",{className:"uppercase tracking-wide",children:O?O.name:"Общее"})]}),n.jsx("div",{className:`flex-shrink-0 p-2 rounded-lg transition-all ${P?r==="dark"?"bg-blue-500/20 text-blue-400 rotate-180":"bg-blue-100 text-blue-600 rotate-180":r==="dark"?"text-gray-400 group-hover:text-gray-300":"text-gray-400 group-hover:text-gray-600"}`,children:n.jsx(Sn,{className:"w-5 h-5"})})]}),n.jsx("h3",{className:`text-lg sm:text-xl font-bold ${i} group-hover:${r==="dark"?"text-blue-400":"text-blue-600"} transition-colors`,children:T.question})]}),P&&n.jsx("div",{className:`px-5 sm:px-6 pb-5 sm:pb-6 border-t ${h} pt-4 animate-fade-in`,children:n.jsx("div",{className:`rounded-lg p-4 text-sm leading-relaxed ${r==="dark"?"bg-[#1a1a1a]/70 text-gray-200":"bg-blue-50/80 text-gray-800"}`,children:N(T.answer)})})]},E)})}),n.jsxs("div",{className:`${d} rounded-lg shadow-lg p-6 border ${h}`,children:[n.jsx("h2",{className:`text-xl font-semibold mb-4 ${i}`,children:"Нужна дополнительная помощь?"}),n.jsx("p",{className:`${c} mb-4`,children:"Если вы не нашли ответ на свой вопрос, обратитесь к администратору или ознакомьтесь с правилами сообщества."}),n.jsxs("div",{className:"flex flex-wrap gap-4",children:[n.jsx("a",{href:"https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20",target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors",children:"📖 Правила сообщества"}),n.jsx("div",{className:`inline-flex items-center px-4 py-2 rounded-lg ${r==="dark"?"bg-gray-700":"bg-gray-200"}`,children:n.jsxs("span",{className:c,children:["Администратор: ",n.jsx("span",{className:"font-semibold",children:"@artyommedoed"})]})})]})]})]})})},Ok=()=>{const{theme:r}=Ze(),{isAdmin:e}=Vt(),t=r==="dark"?"text-white":"text-gray-900",s=r==="dark"?"text-gray-300":"text-gray-700",a=r==="dark"?"bg-[#1a1a1a]":"bg-white";return e?n.jsx(sr,{children:n.jsxs("div",{className:"space-y-6",children:[n.jsxs("div",{className:`rounded-2xl p-6 ${a} shadow-lg border-2 ${r==="dark"?"border-purple-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#1a1a1a]/90":"border-purple-200 bg-gradient-to-br from-white to-purple-50/30"}`,children:[n.jsxs("div",{className:"flex items-start gap-4 mb-6",children:[n.jsx("div",{className:`p-3 rounded-xl ${r==="dark"?"bg-purple-500/20":"bg-purple-100"}`,children:n.jsx(Kt,{className:`w-8 h-8 ${r==="dark"?"text-purple-400":"text-purple-600"}`})}),n.jsxs("div",{className:"flex-1",children:[n.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[n.jsx("h1",{className:`text-3xl font-bold bg-gradient-to-r ${r==="dark"?"from-purple-400 to-pink-400 text-transparent bg-clip-text":"from-purple-600 to-pink-600 text-transparent bg-clip-text"}`,children:"Панель администратора"}),n.jsx(Bt,{className:`w-5 h-5 ${r==="dark"?"text-yellow-400":"text-yellow-500"} animate-pulse`})]}),n.jsxs("p",{className:`${s} text-sm flex items-center gap-2`,children:[n.jsx(Kc,{className:"w-4 h-4"}),"Управление системой и командой ApeVault"]})]})]}),n.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",children:[n.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-blue-500/10 border-blue-500/30":"bg-blue-50 border-blue-200"}`,children:[n.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[n.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-blue-500/20":"bg-blue-100"}`,children:n.jsx(Kt,{className:`w-5 h-5 ${r==="dark"?"text-blue-400":"text-blue-600"}`})}),n.jsx("h3",{className:`font-semibold ${t}`,children:"Доступ к функциям"})]}),n.jsx("p",{className:`text-sm ${s}`,children:"В режиме администратора вы можете управлять слотами, статусами и заработком всех участников команды"})]}),n.jsxs("div",{className:"p-4 rounded-xl border-2 bg-[#4E6E49]/10 border-[#4E6E49]/30",children:[n.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[n.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-[#4E6E49]/20":"bg-green-100"}`,children:n.jsx(af,{className:"w-5 h-5 text-[#4E6E49]"})}),n.jsx("h3",{className:`font-semibold ${t}`,children:"Безопасность"})]}),n.jsx("p",{className:`text-sm ${s}`,children:"Режим администратора требует ввода пароля. Не делитесь паролем с другими участниками"})]})]}),n.jsx("div",{className:`pt-4 border-t ${r==="dark"?"border-gray-800":"border-gray-200"}`,children:n.jsxs("div",{className:`flex items-center gap-3 p-4 rounded-xl ${r==="dark"?"bg-[#4E6E49]/20 border-2 border-[#4E6E49]/50":"bg-green-50 border-2 border-green-200"}`,children:[n.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-[#4E6E49]/30":"bg-green-100"}`,children:n.jsx(Kt,{className:"w-6 h-6 text-[#4E6E49]"})}),n.jsxs("div",{children:[n.jsx("h3",{className:`font-semibold mb-1 ${t}`,children:"Режим администратора активен"}),n.jsx("p",{className:`text-sm ${s}`,children:"Вы вошли в систему как администратор. Все административные функции доступны."})]})]})})]}),n.jsxs("div",{className:`rounded-2xl p-6 ${a} shadow-lg border-2 ${r==="dark"?"border-gray-800":"border-gray-200"}`,children:[n.jsx("h2",{className:`text-xl font-semibold mb-4 ${t}`,children:"Возможности администратора"}),n.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-700/30":"border-gray-200 bg-gray-50"}`,children:[n.jsx("h3",{className:`font-semibold mb-2 ${t}`,children:"📅 Управление слотами"}),n.jsxs("ul",{className:`text-sm space-y-1 ${s} list-disc list-inside`,children:[n.jsx("li",{children:"Создание слотов для любого участника"}),n.jsx("li",{children:"Массовое создание слотов"}),n.jsx("li",{children:"Удаление слотов любого участника"}),n.jsx("li",{children:"Массовое удаление слотов"})]})]}),n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-700/30":"border-gray-200 bg-gray-50"}`,children:[n.jsx("h3",{className:`font-semibold mb-2 ${t}`,children:"📋 Управление статусами"}),n.jsxs("ul",{className:`text-sm space-y-1 ${s} list-disc list-inside`,children:[n.jsx("li",{children:"Установка выходных, больничных и отпуск"}),n.jsx("li",{children:"Массовое управление статусами"}),n.jsx("li",{children:"Удаление статусов любого участника"})]})]}),n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-700/30":"border-gray-200 bg-gray-50"}`,children:[n.jsx("h3",{className:`font-semibold mb-2 ${t}`,children:"💰 Управление заработком"}),n.jsxs("ul",{className:`text-sm space-y-1 ${s} list-disc list-inside`,children:[n.jsx("li",{children:"Добавление заработка за любую дату"}),n.jsx("li",{children:"Редактирование записей о заработке"}),n.jsx("li",{children:"Удаление записей о заработке"})]})]}),n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-700/30":"border-gray-200 bg-gray-50"}`,children:[n.jsx("h3",{className:`font-semibold mb-2 ${t}`,children:"📊 Дополнительно"}),n.jsxs("ul",{className:`text-sm space-y-1 ${s} list-disc list-inside`,children:[n.jsx("li",{children:"Удаление сообщений из подсчета"}),n.jsx("li",{children:"Полный доступ ко всем функциям"}),n.jsx("li",{children:"Просмотр и управление данными команды"})]})]})]})]})]})}):n.jsx(sr,{children:n.jsx("div",{className:`rounded-2xl p-8 ${a} shadow-xl border-2 ${r==="dark"?"border-red-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]":"border-red-200 bg-gradient-to-br from-white to-red-50/20"} relative overflow-hidden`,children:n.jsxs("div",{className:"text-center",children:[n.jsx("div",{className:`inline-flex p-4 rounded-2xl mb-4 ${r==="dark"?"bg-red-500/20":"bg-red-100"}`,children:n.jsx(Kc,{className:`w-12 h-12 ${r==="dark"?"text-red-400":"text-red-600"}`})}),n.jsx("h2",{className:`text-2xl font-bold mb-2 ${t}`,children:"Доступ запрещен"}),n.jsx("p",{className:s,children:'Эта страница доступна только администраторам. Для входа используйте режим "Админ" на странице входа.'})]})})})},Vk=()=>{var we;const{theme:r}=Ze(),{user:e,logout:t}=At(),{isAdmin:s,deactivateAdmin:a}=Vt(),i=Pu(),[l,c]=A.useState(!1),[d,h]=A.useState(!1),[m,x]=A.useState([]),[b,I]=A.useState(null),[N,T]=A.useState(null),[E,P]=A.useState(null),[O,C]=A.useState([]),[M,ee]=A.useState({id:"",userId:"",title:"",text:"",priority:"medium",createdAt:"",updatedAt:""}),[Z,j]=A.useState(!0),[y,v]=A.useState(!1),f=e||(s?{name:"Администратор",login:"admin",password:"admin"}:null),_=e!=null&&e.id?(we=Ne.find(H=>H.id===e.id))==null?void 0:we.avatar:void 0,k=f!=null&&f.name?f.name.charAt(0).toUpperCase():"A",p=r==="dark"?"text-white":"text-gray-900";A.useEffect(()=>{(e||s)&&$()},[e,s]);const $=async()=>{if(!(!e&&!s)){j(!0);try{const H=(e==null?void 0:e.id)||"admin",_e=await yg({assignedTo:H});if(x(_e),e){const ye=ba(),Ee=me(ye.start,"yyyy-MM-dd"),X=me(ye.end,"yyyy-MM-dd"),R=Tg(30),L=me(R.start,"yyyy-MM-dd"),ge=me(R.end,"yyyy-MM-dd"),pe=R.start.toISOString(),U=R.end.toISOString(),S=await Jn(H,Ee,X),Q=S.reduce((Ae,Se)=>{const _t=Se.participants&&Se.participants.length>0?Se.participants.length:1;return Ae+Se.amount/_t},0),de=S.reduce((Ae,Se)=>{const _t=Se.participants&&Se.participants.length>0?Se.participants.length:1;return Ae+Se.poolAmount/_t},0),D=await Jn(H,L,ge),ue=D.reduce((Ae,Se)=>{const _t=Se.participants&&Se.participants.length>0?Se.participants.length:1;return Ae+Se.amount/_t},0),je=D.reduce((Ae,Se)=>{const _t=Se.participants&&Se.participants.length>0?Se.participants.length:1;return Ae+Se.poolAmount/_t},0),Oe=(await Rr(H)).filter(Ae=>{const Se=Ae.date,_t=Ae.endDate||Ae.date;return Se<=ge&&_t>=L}),F=Oe.filter(Ae=>Ae.type==="dayoff").reduce((Ae,Se)=>Ae+Qs(Se.date,Se.endDate,L,ge),0),ae=Oe.filter(Ae=>Ae.type==="sick").reduce((Ae,Se)=>Ae+Qs(Se.date,Se.endDate,L,ge),0),ne=Oe.filter(Ae=>Ae.type==="vacation").reduce((Ae,Se)=>Ae+Qs(Se.date,Se.endDate,L,ge),0),at=(await Fr(H)).filter(Ae=>Ae.date>=Ee&&Ae.date<=X).reduce((Ae,Se)=>Ae+Gi(Se.slots),0),yt=await fg(H,Ee,X),dt=(await pg(H))[0]||{userId:H,earnings:0,messages:0,initiatives:0,signals:0,profitableSignals:0,referrals:0,daysOff:0,sickDays:0,vacationDays:0,poolAmount:0,rating:0,lastUpdated:new Date().toISOString()},fe=(await xg(void 0,pe,U)).filter(Ae=>Ae.ownerId===H).length,Ge={userId:H,earnings:ue,messages:dt.messages||0,initiatives:dt.initiatives||0,signals:dt.signals||0,profitableSignals:dt.profitableSignals||0,referrals:fe,daysOff:F,sickDays:ae,vacationDays:ne,poolAmount:je,lastUpdated:new Date().toISOString()},ut=Cg(Ge,at,Q,yt),_r=Rg(Ge,at,Q,yt);I({...Ge,rating:ut}),T(_r),P({total:ue,pool:je,net:Math.max(0,ue-je),weekly:{gross:Q,pool:de,net:Math.max(0,Q-de)}});const Jt=e!=null&&e.id?`notes-cache-${e.id}`:null,cs=Ae=>{if(Jt)try{localStorage.setItem(Jt,JSON.stringify(Ae))}catch(Se){console.error("Error caching notes locally",Se)}};try{if(e){const Ae=await vu(e.id,s);C(Ae),cs(Ae)}else if(s){const Ae=await vu(void 0,!0);C(Ae),cs(Ae)}}catch(Ae){if(console.error("Error loading notes",Ae),Jt)try{const Se=localStorage.getItem(Jt);if(Se){const _t=JSON.parse(Se);C(_t)}}catch(Se){console.error("Error loading cached notes",Se)}}}}catch(H){console.error("Error loading profile data:",H)}finally{j(!1)}}},q=async()=>{if(!(e!=null&&e.id)||!M.title.trim()&&!M.text.trim())return;const H=e!=null&&e.id?`notes-cache-${e.id}`:null,_e=ye=>{if(H)try{localStorage.setItem(H,JSON.stringify(ye))}catch(Ee){console.error("Error caching notes locally",Ee)}};try{if(M.id){await J1(M.id,{title:M.title,text:M.text,priority:M.priority});const ye=O.map(Ee=>Ee.id===M.id?{...Ee,title:M.title,text:M.text,priority:M.priority,updatedAt:new Date().toISOString()}:Ee);C(ye),_e(ye)}else{const ye=await X1({userId:e.id,title:M.title,text:M.text,priority:M.priority}),Ee=new Date().toISOString(),X=[{id:ye,userId:e.id,title:M.title,text:M.text,priority:M.priority,createdAt:Ee,updatedAt:Ee},...O];C(X),_e(X)}}catch(ye){console.error("Error saving note",ye)}finally{ee({id:"",userId:"",title:"",text:"",priority:"medium",createdAt:"",updatedAt:""})}},se=H=>{const _e=O.find(ye=>ye.id===H);_e&&ee(_e)},B=async H=>{const _e=e!=null&&e.id?`notes-cache-${e.id}`:null,ye=Ee=>{if(_e)try{localStorage.setItem(_e,JSON.stringify(Ee))}catch(X){console.error("Error caching notes locally",X)}};try{await Z1(H);const Ee=O.filter(X=>X.id!==H);C(Ee),ye(Ee),M.id===H&&ee({id:"",userId:"",title:"",text:"",priority:"medium",createdAt:"",updatedAt:""})}catch(Ee){console.error("Error deleting note",Ee)}},Y=()=>{s&&a(),t(),i("/login")},ce=()=>{e!=null&&e.password&&(navigator.clipboard.writeText(e.password),h(!0),setTimeout(()=>h(!1),2e3))},re=()=>{f!=null&&f.login&&(navigator.clipboard.writeText(f.login),v(!0),setTimeout(()=>v(!1),2e3))},he=m.filter(H=>H.status==="pending").length,K=m.filter(H=>H.status==="in_progress").length,G=m.filter(H=>H.status==="completed").length,xe={pending:{label:"Проверка",classes:r==="dark"?"bg-amber-500/15 text-amber-100 border-amber-500/30":"bg-amber-50 text-amber-900 border-amber-200"},in_progress:{label:"В работе",classes:r==="dark"?"bg-blue-500/15 text-blue-100 border-blue-500/30":"bg-blue-50 text-blue-900 border-blue-200"},completed:{label:"Выполнена",classes:r==="dark"?"bg-emerald-500/15 text-emerald-50 border-emerald-500/30":"bg-emerald-50 text-emerald-900 border-emerald-200"},closed:{label:"Закрыта",classes:r==="dark"?"bg-gray-600/20 text-gray-100 border-gray-500/40":"bg-gray-50 text-gray-800 border-gray-200"},rejected:{label:"Отклонена",classes:r==="dark"?"bg-red-500/20 text-red-100 border-red-500/40":"bg-red-50 text-red-800 border-red-200"}};return f?n.jsx(sr,{children:n.jsxs("div",{className:"space-y-6",children:[n.jsx("div",{className:`rounded-2xl p-6 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow-lg`,children:n.jsxs("div",{className:"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",children:[n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx("div",{className:"relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/50 dark:border-white/10 bg-gradient-to-br from-[#4E6E49]/15 to-emerald-200/40 flex items-center justify-center",children:_?n.jsx("img",{src:_,alt:f.name,className:"w-full h-full object-cover",onError:H=>{const _e=H.target;_e.style.display="none"}}):n.jsx("span",{className:"text-lg font-extrabold text-[#4E6E49]",children:k})}),n.jsxs("div",{children:[n.jsx("p",{className:`text-xs uppercase tracking-[0.14em] ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"ApeVault Black Ops"}),n.jsx("h1",{className:`text-2xl sm:text-3xl font-extrabold ${p}`,children:"Личный кабинет"}),n.jsx("p",{className:`text-sm ${r==="dark"?"text-gray-300":"text-gray-600"}`,children:"Закрытый контур. Ваши данные и показатели."})]})]}),n.jsxs("div",{className:"flex flex-wrap gap-2",children:[n.jsxs("div",{className:"pill","data-active":"true",children:[n.jsx(Xs,{className:"w-4 h-4"}),n.jsx("span",{children:f.name})]}),s&&n.jsxs("div",{className:"pill","data-active":"true",children:[n.jsx(Kt,{className:"w-4 h-4"}),n.jsx("span",{children:"Администратор"})]}),n.jsxs("div",{className:"pill","data-active":"false",children:[n.jsx(Dr,{className:"w-4 h-4"}),n.jsxs("span",{children:[m.length," задач"]})]}),b&&n.jsxs("div",{className:"pill","data-active":"false",children:[n.jsx(ws,{className:"w-4 h-4"}),n.jsxs("span",{children:[b.rating.toFixed(1),"%"]})]})]})]})}),Z?n.jsx("div",{className:`rounded-xl p-8 text-center ${r==="dark"?"bg-white/5 text-white":"bg-white text-gray-800"} shadow`,children:"Загрузка..."}):n.jsxs("div",{className:"space-y-5",children:[n.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4 items-stretch",children:[n.jsxs("div",{className:"space-y-4 flex flex-col",children:[n.jsxs("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow flex-1`,children:[n.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[n.jsx("div",{className:`p-2.5 rounded-xl ${r==="dark"?"bg-blue-500/15 text-blue-200":"bg-blue-50 text-blue-700"}`,children:n.jsx(Xs,{className:"w-5 h-5"})}),n.jsxs("div",{children:[n.jsx("h2",{className:`text-lg font-bold ${p}`,children:"Профиль"}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Доступ и учетные данные"})]})]}),n.jsxs("div",{className:"grid sm:grid-cols-2 gap-3",children:[n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow-sm`,children:[n.jsx("p",{className:`text-xs font-semibold uppercase tracking-wide ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Имя"}),n.jsx("p",{className:`mt-1 text-lg font-bold ${p}`,children:f.name})]}),n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow-sm`,children:[n.jsx("p",{className:`text-xs font-semibold uppercase tracking-wide ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Логин"}),n.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[n.jsx("p",{className:`text-lg font-bold ${p}`,children:f.login}),n.jsx("button",{onClick:re,className:`p-2 rounded-lg border transition ${y?"bg-[#4E6E49] text-white border-[#4E6E49]":r==="dark"?"border-white/10 bg-white/5 hover:border-white/30":"border-gray-200 bg-white hover:border-gray-300"}`,title:"Скопировать логин",children:y?n.jsx(vs,{className:"w-4 h-4"}):n.jsx(To,{className:"w-4 h-4"})})]})]})]}),n.jsxs("div",{className:"mt-4 space-y-2",children:[n.jsx("label",{className:`text-sm font-semibold ${r==="dark"?"text-gray-300":"text-gray-700"} block`,children:"Пароль"}),n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("div",{className:`flex-1 px-4 py-3 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"} font-mono text-sm`,children:l?f.password:"•".repeat(f.password.length)}),n.jsx("button",{onClick:()=>c(!l),className:`p-3 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5 hover:border-white/30":"border-gray-200 bg-white hover:border-gray-300"} transition`,title:l?"Скрыть пароль":"Показать пароль",children:l?n.jsx(Zp,{className:"w-5 h-5"}):n.jsx(qu,{className:"w-5 h-5"})}),n.jsx("button",{onClick:ce,className:`p-3 rounded-lg border transition ${d?"bg-[#4E6E49] text-white border-[#4E6E49]":r==="dark"?"border-white/10 bg-white/5 hover:border-white/30":"border-gray-200 bg-white hover:border-gray-300"}`,title:"Скопировать пароль",children:d?n.jsx(vs,{className:"w-5 h-5"}):n.jsx(To,{className:"w-5 h-5"})})]})]}),n.jsx("div",{className:"mt-4 grid gap-3 sm:grid-cols-1",children:n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow-sm`,children:[n.jsx("p",{className:`text-xs font-semibold uppercase tracking-wide ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Учебная панель (преподаватель)"}),n.jsxs("div",{className:"mt-2 space-y-2 text-sm",children:[n.jsxs("div",{className:`${r==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx("span",{className:"font-semibold",children:"Имя: "}),n.jsx("span",{className:"font-medium",children:"в разработке"})]}),n.jsxs("div",{className:`${r==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx("span",{className:"font-semibold",children:"Логин: "}),n.jsx("span",{className:"font-medium",children:"в разработке"})]}),n.jsxs("div",{className:`${r==="dark"?"text-gray-300":"text-gray-700"}`,children:[n.jsx("span",{className:"font-semibold",children:"Пароль: "}),n.jsx("span",{className:"font-medium",children:"в разработке"})]})]})]})})]}),n.jsxs("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow flex-1`,children:[n.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[n.jsx("div",{className:`p-2.5 rounded-xl ${r==="dark"?"bg-green-500/15 text-green-200":"bg-green-50 text-[#4E6E49]"}`,children:n.jsx(Dr,{className:"w-5 h-5"})}),n.jsxs("div",{children:[n.jsx("h2",{className:`text-lg font-bold ${p}`,children:"Мои задачи"}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Сводка по статусам"})]})]}),n.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4",children:[{label:"Проверка",value:he,classes:r==="dark"?"bg-amber-500/15 border-amber-500/30 text-amber-100":"bg-amber-50 border-amber-200 text-amber-900"},{label:"В работе",value:K,classes:r==="dark"?"bg-blue-500/15 border-blue-500/30 text-blue-100":"bg-blue-50 border-blue-200 text-blue-900"},{label:"Выполнена",value:G,classes:r==="dark"?"bg-emerald-500/15 border-emerald-500/30 text-emerald-50":"bg-emerald-50 border-emerald-200 text-emerald-900"},{label:"Всего",value:m.length,classes:r==="dark"?"bg-gray-600/20 border-gray-500/40 text-gray-100":"bg-gray-50 border-gray-200 text-gray-800"}].map(({label:H,value:_e,classes:ye})=>n.jsxs("div",{className:`p-4 rounded-xl border shadow-sm transition-all hover:translate-y-[-2px] ${ye}`,children:[n.jsx("div",{className:"text-xs font-semibold mb-2 opacity-80",children:H}),n.jsx("div",{className:`text-3xl font-extrabold ${p}`,children:_e})]},H))}),m.length>0&&n.jsxs("div",{className:"space-y-2 mb-4",children:[n.jsx("p",{className:`text-sm font-semibold ${r==="dark"?"text-gray-200":"text-gray-800"}`,children:"Активные задачи"}),n.jsx("div",{className:"space-y-2",children:m.slice(0,3).map(H=>n.jsxs("div",{className:`p-3 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-gray-50"} shadow-sm`,children:[n.jsxs("div",{className:"flex items-start justify-between gap-2",children:[n.jsxs("div",{className:"min-w-0",children:[n.jsx("p",{className:`text-sm font-semibold ${p} truncate`,children:H.title}),n.jsxs("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:["Дедлайн: ",H.dueDate?me(new Date(H.dueDate),"dd.MM.yyyy"):"—"," ",H.dueTime||""]})]}),n.jsx("span",{className:`text-[11px] px-2 py-1 rounded-full border ${xe[H.status].classes}`,children:xe[H.status].label})]}),H.description&&n.jsx("p",{className:`text-xs mt-2 ${r==="dark"?"text-gray-300":"text-gray-600"} line-clamp-2`,children:H.description})]},H.id))})]}),n.jsxs("div",{className:"mt-4 space-y-3",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx(xf,{className:"w-4 h-4 text-[#4E6E49]"}),n.jsx("p",{className:`text-sm font-semibold ${p}`,children:"Мои заметки"})]}),n.jsxs("div",{className:"grid gap-2 sm:grid-cols-2",children:[n.jsx("input",{type:"text",value:M.title,onChange:H=>ee({...M,title:H.target.value}),placeholder:"Заголовок",className:`px-3 py-2 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"} text-sm`}),n.jsx("div",{className:"flex gap-2",children:["low","medium","high"].map(H=>n.jsx("button",{onClick:()=>ee({...M,priority:H}),className:`px-3 py-2 rounded-lg border text-sm flex-1 ${M.priority===H?"border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49]":r==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-800"}`,children:H==="low"?"Низкий":H==="medium"?"Средний":"Высокий"},H))})]}),n.jsx("textarea",{value:M.text,onChange:H=>ee({...M,text:H.target.value}),rows:3,placeholder:"Текст заметки",className:`w-full px-3 py-2 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"} text-sm`}),n.jsxs("div",{className:"flex gap-2",children:[n.jsxs("button",{onClick:q,className:`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${e!=null&&e.id?r==="dark"?"bg-[#4E6E49]/20 text-[#4E6E49] border border-[#4E6E49]/40":"bg-gradient-to-r from-[#4E6E49] to-emerald-500 text-white":"bg-gray-300 text-gray-600 cursor-not-allowed"}`,disabled:!(e!=null&&e.id),children:[n.jsx(Qc,{className:"w-4 h-4"}),M.id?"Сохранить":"Добавить"]}),M.id&&n.jsx("button",{onClick:()=>ee({id:"",userId:"",title:"",text:"",priority:"medium",createdAt:"",updatedAt:""}),className:`px-4 py-2 rounded-lg font-semibold border ${r==="dark"?"border-white/15 text-gray-200":"border-gray-200 text-gray-700"}`,children:"Отмена"})]}),O.length>0&&n.jsx("div",{className:"space-y-2",children:O.map(H=>n.jsx("div",{className:`p-3 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-gray-50"} flex flex-col gap-1`,children:n.jsxs("div",{className:"flex items-start justify-between gap-2",children:[n.jsxs("div",{className:"min-w-0",children:[n.jsx("p",{className:`text-sm font-semibold ${p} truncate`,children:H.title||"Без названия"}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"} whitespace-pre-line`,children:H.text})]}),n.jsxs("div",{className:"flex items-center gap-1",children:[n.jsx("span",{className:`text-[11px] px-2 py-1 rounded-full border ${H.priority==="high"?"border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-50":H.priority==="medium"?"border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-50":"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-50"}`,children:H.priority==="high"?"Высокий":H.priority==="medium"?"Средний":"Низкий"}),n.jsx("button",{onClick:()=>se(H.id),className:`p-1 rounded border ${r==="dark"?"border-white/10 text-gray-200":"border-gray-200 text-gray-700"}`,title:"Редактировать",children:n.jsx(Qc,{className:"w-4 h-4"})}),n.jsx("button",{onClick:()=>B(H.id),className:`p-1 rounded border ${r==="dark"?"border-white/10 text-red-200":"border-gray-200 text-red-600"}`,title:"Удалить",children:n.jsx(It,{className:"w-4 h-4"})})]})]})},H.id))})]}),n.jsx("div",{className:"mt-4",children:n.jsxs("button",{onClick:()=>i("/tasks"),className:`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${r==="dark"?"bg-gradient-to-r from-[#4E6E49]/20 to-emerald-700/20 text-[#4E6E49] border border-[#4E6E49]/40":"bg-gradient-to-r from-green-50 to-emerald-50 text-[#4E6E49] border border-green-200"}`,children:[n.jsx(Dr,{className:"w-4 h-4"}),"Перейти к задачам"]})})]})]}),n.jsxs("div",{className:"space-y-4 flex flex-col",children:[E&&n.jsxs("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow flex-1`,children:[n.jsxs("div",{className:"flex items-center justify-between mb-4",children:[n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx("div",{className:`p-2.5 rounded-xl ${r==="dark"?"bg-emerald-500/20 text-emerald-200":"bg-emerald-50 text-emerald-700"}`,children:n.jsx(ra,{className:"w-5 h-5"})}),n.jsxs("div",{children:[n.jsx("h2",{className:`text-lg font-bold ${p}`,children:"Мой заработок"}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Суммы с учётом долей"})]})]}),n.jsx("div",{className:`px-3 py-1.5 rounded-full text-xs font-semibold border ${E.weekly.net>=1e4?"border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-100":"border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-100"}`,children:E.weekly.net>=1e4?"Вывод доступен":"Минимум 10 000 для вывода"})]}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4",children:[{label:"Всего заработано",value:E.total},{label:"Отправлено в пул",value:E.pool},{label:"Чистыми",value:E.net}].map(H=>n.jsxs("div",{className:`p-4 rounded-xl border shadow-sm ${r==="dark"?"border-white/10 bg-white/5":"border-gray-100 bg-gray-50"}`,children:[n.jsx("p",{className:"text-xs uppercase tracking-wide opacity-70",children:H.label}),n.jsxs("p",{className:`text-2xl font-extrabold ${p}`,children:[Math.round(H.value).toLocaleString("ru-RU")," ₽"]})]},H.label))}),n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-emerald-50 bg-emerald-50/70"} flex flex-col gap-2`,children:[n.jsxs("div",{className:"flex items-center justify-between gap-2 flex-wrap",children:[n.jsxs("div",{children:[n.jsx("p",{className:`text-sm font-semibold ${p}`,children:"Активная неделя"}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Понедельник, среда, пятница, суббота — дни вывода"})]}),n.jsx("span",{className:`text-xs px-3 py-1 rounded-full border ${E.weekly.net>=1e4?"border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-50":"border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-50"}`,children:E.weekly.net>=1e4?"Доступно к выводу":"Перенос на следующую неделю"})]}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[{label:"Заработано за неделю",value:E.weekly.gross},{label:"В пул за неделю",value:E.weekly.pool},{label:"Чистыми за неделю",value:E.weekly.net}].map(H=>n.jsxs("div",{className:`p-3 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5":"border-white/80 bg-white/80"} shadow-sm`,children:[n.jsx("p",{className:"text-[11px] uppercase tracking-wide opacity-70",children:H.label}),n.jsxs("p",{className:`text-lg font-bold ${p}`,children:[Math.round(H.value).toLocaleString("ru-RU")," ₽"]})]},H.label))}),E.weekly.net<1e4&&n.jsx("p",{className:`text-xs ${r==="dark"?"text-amber-200":"text-amber-700"}`,children:"Менее 10 000 ₽ чистыми за активную неделю — вывод недоступен, сумма переносится на следующую неделю."})]})]}),b&&N&&n.jsxs("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow flex-1`,children:[n.jsxs("div",{className:"flex items-center justify-between mb-4",children:[n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx("div",{className:`p-2.5 rounded-xl ${r==="dark"?"bg-purple-500/20 text-purple-200":"bg-purple-50 text-purple-700"}`,children:n.jsx(ws,{className:"w-5 h-5"})}),n.jsxs("div",{children:[n.jsx("h2",{className:`text-lg font-bold ${p}`,children:"Рейтинг"}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Еженедельная оценка"})]})]}),n.jsx("div",{className:"pill","data-active":"true",children:n.jsxs("span",{className:"font-bold",children:[b.rating.toFixed(1),"%"]})})]}),n.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-100 bg-gray-50"} mb-4`,children:[n.jsxs("div",{className:`text-4xl font-extrabold ${p}`,children:[b.rating.toFixed(1),"%"]}),n.jsx("p",{className:`text-xs mt-1 ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:b.rating>=70?"Отличный результат":b.rating>=50?"Хороший темп":"Требуется усиление показателей"})]}),n.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[{label:"Выходные",value:`${b.daysOff} дн`,pts:N.daysOffPoints,classes:r==="dark"?"bg-slate-700/40 border-slate-600/60":"bg-slate-50 border-slate-200"},{label:"Больничные",value:`${b.sickDays} дн`,pts:N.sickDaysPoints,classes:r==="dark"?"bg-amber-500/15 border-amber-500/30":"bg-amber-50 border-amber-200"},{label:"Отпуск",value:`${b.vacationDays} дн`,pts:N.vacationDaysPoints,classes:r==="dark"?"bg-orange-500/15 border-orange-500/30":"bg-orange-50 border-orange-200"},{label:"Часы",value:`${N.weeklyHours.toFixed(1)} ч/нед`,pts:N.weeklyHoursPoints,classes:r==="dark"?"bg-blue-500/15 border-blue-500/30":"bg-blue-50 border-blue-200"},{label:"Заработок",value:`${N.weeklyEarnings.toFixed(0)} ₽/нед`,pts:N.weeklyEarningsPoints,classes:r==="dark"?"bg-emerald-500/15 border-emerald-500/30":"bg-emerald-50 border-emerald-200"},{label:"Рефералы",value:`${b.referrals}`,pts:N.referralsPoints,classes:r==="dark"?"bg-purple-500/15 border-purple-500/30":"bg-purple-50 border-purple-200"},{label:"Сообщения",value:`${N.weeklyMessages} сообщ/нед`,pts:N.weeklyMessagesPoints,classes:r==="dark"?"bg-pink-500/15 border-pink-500/30":"bg-pink-50 border-pink-200"}].map(H=>n.jsxs("div",{className:`p-3 rounded-xl border shadow-sm ${H.classes}`,children:[n.jsx("div",{className:"text-xs font-semibold uppercase opacity-80",children:H.label}),n.jsx("div",{className:`text-lg font-bold ${p}`,children:H.value}),n.jsxs("div",{className:`text-sm ${r==="dark"?"text-gray-100":"text-gray-800"}`,children:[H.pts.toFixed(1),"%"]})]},H.label))}),n.jsxs("div",{className:`mt-4 p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-100 bg-gray-50"}`,children:[n.jsxs("h3",{className:`text-sm font-bold ${p} mb-2 flex items-center gap-2`,children:[n.jsx(ur,{className:"w-4 h-4"}),"Как считается рейтинг"]}),n.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-300":"text-gray-700"}`,children:"7 параметров: выходные, больничные, отпуск (месяц), часы, доход, рефералы, сообщения (неделя). Максимум 100%."})]})]})]})]}),n.jsx("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow`,children:n.jsxs("button",{onClick:Y,className:`w-full px-6 py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${r==="dark"?"bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/50":"bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200"}`,children:[n.jsx(df,{className:"w-5 h-5"}),"Выйти из аккаунта"]})})]})]})}):n.jsx(sr,{children:n.jsx("div",{className:"text-center py-12",children:n.jsx("p",{className:p,children:"Необходима авторизация"})})})},Lk="/assets/image-779ddbd9-e512-4bda-8983-af1ab9237b7c-B_v6l7J0.png",Fk=()=>{const{theme:r}=Ze(),e=r==="dark"?"text-white":"text-gray-900",t=r==="dark"?"text-gray-400":"text-gray-600",s=[{title:"Финансовая грамотность",note:"Учимся управлять рисками, понимать токеномику и принимать решения на основе анализа, а не эмоций.",accent:"from-emerald-200 to-teal-200"},{title:"Приватность превыше всего",note:"Уважаем личные границы и используем инструменты, защищающие цифровую идентичность.",accent:"from-sky-200 to-blue-200"},{title:"Образование и развитие",note:"Учимся от основ блокчейна до продвинутых DeFi-стратегий и делимся знаниями.",accent:"from-amber-200 to-orange-200"},{title:"Честность и прозрачность",note:"Внутри клуба — открытость, честные сделки и уважение. Доверие строим действиями.",accent:"from-purple-200 to-indigo-200"},{title:"Инновации и эксперименты",note:"Тестируем новые протоколы, участвуем в DAO, не боимся быть первыми в трендах.",accent:"from-pink-200 to-rose-200"},{title:"Критическое мышление",note:"Не следуем слепо за хайпом: анализируем, проверяем источники и опираемся на здравый смысл.",accent:"from-cyan-200 to-teal-200"},{title:"Глобальное мышление",note:"Открыты к сотрудничеству с людьми из разных стран ради цифровой и финансовой свободы в рамках закона.",accent:"from-lime-200 to-green-200"},{title:"Свобода и ответственность",note:"Ценим свободу крипты и понимаем её цену: зрелость, самоконтроль и ответственность за решения.",accent:"from-gray-200 to-slate-200"}],a=[{label:"Что такое ApeVault?",value:"Клуб криптоэнтузиастов, где знания превращаются в действие."},{label:"Цель",value:"Объединить инвесторов и трейдеров ради роста дохода и безопасности входа в рынок."}];return n.jsx(sr,{children:n.jsxs("div",{className:"space-y-7 sm:space-y-8",children:[n.jsxs("div",{className:"section-card rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden",children:[n.jsx("div",{className:"accent-dots"}),n.jsx("div",{className:"absolute inset-y-0 right-0 w-1/3 pointer-events-none bg-gradient-to-l from-[#4E6E49]/10 to-transparent blur-2xl"}),n.jsxs("div",{className:"relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between",children:[n.jsxs("div",{className:"space-y-3 max-w-3xl",children:[n.jsxs("div",{className:"inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 text-xs font-semibold uppercase tracking-[0.16em]",children:[n.jsx(ur,{className:"w-4 h-4 text-[#4E6E49]"}),"ApeVault Community"]}),n.jsx("h1",{className:`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight ${e}`,children:"О нас и нашем сообществе"}),n.jsx("p",{className:`text-sm sm:text-base ${t} max-w-2xl`,children:"ApeVault — это пространство, где опытные криптоэнтузиасты объединяют знания и проверенные стратегии, чтобы безопасно заходить в рынок и расти вместе."}),n.jsx("div",{className:"flex flex-wrap gap-2",children:["Командные сессии","Проверенные стратегии","Прозрачные регламенты"].map(i=>n.jsx("span",{className:`px-3 py-1.5 rounded-full text-xs font-semibold border ${r==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"}`,children:i},i))})]}),n.jsx("div",{className:"grid grid-cols-2 gap-3 w-full max-w-xs lg:max-w-sm",children:[{label:"Участников",value:"50+"},{label:"Сессий / неделю",value:"10+"},{label:"Уроков",value:"100+"},{label:"Фокуса",value:"100% качество"}].map(i=>n.jsxs("div",{className:`rounded-2xl border p-3 sm:p-4 shadow-sm ${r==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"}`,children:[n.jsx("p",{className:"text-[11px] uppercase tracking-wide opacity-70",children:i.label}),n.jsx("p",{className:"text-xl font-extrabold leading-tight mt-1",children:i.value})]},i.label))})]})]}),n.jsxs("div",{className:"section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden",children:[n.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"}),n.jsxs("div",{className:"relative z-10 space-y-4",children:[n.jsxs("h2",{className:`text-2xl sm:text-3xl font-extrabold ${e} flex items-center gap-2`,children:[n.jsx(Bt,{className:"w-6 h-6 text-[#4E6E49]"}),"Что такое ApeVault?"]}),n.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:a.map(i=>n.jsxs("div",{className:`rounded-2xl border p-4 sm:p-5 flex gap-3 items-start ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"}`,children:[n.jsx("div",{className:"p-2 rounded-xl bg-gradient-to-br from-[#4E6E49] to-emerald-600 text-white shadow-lg",children:n.jsx(Nt,{className:"w-4 h-4"})}),n.jsxs("div",{className:"space-y-1",children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-[#4E6E49] font-semibold",children:i.label}),n.jsx("p",{className:`text-sm sm:text-base leading-relaxed ${e}`,children:i.value})]})]},i.label))})]})]}),n.jsxs("div",{className:"section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden",children:[n.jsx("div",{className:"absolute -left-10 top-0 w-52 h-52 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl"}),n.jsx("div",{className:"absolute -right-10 bottom-0 w-52 h-52 bg-gradient-to-br from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl"}),n.jsxs("div",{className:"relative z-10 space-y-5",children:[n.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3",children:[n.jsx("h2",{className:`text-2xl sm:text-3xl font-extrabold ${e}`,children:"Принципы, которые держат нас на вершине"}),n.jsxs("div",{className:"flex gap-2",children:[n.jsxs("a",{href:"#rules",className:"pill","data-active":"false",children:["Правила",n.jsx(Nt,{className:"w-4 h-4"})]}),n.jsxs("a",{href:"#contacts",className:"pill","data-active":"false",children:["Контакты",n.jsx(Nt,{className:"w-4 h-4"})]})]})]}),n.jsxs("div",{className:"grid lg:grid-cols-[1fr_420px_1fr] gap-6 items-center",children:[n.jsx("div",{className:"space-y-3",children:s.slice(0,4).map(i=>n.jsxs("div",{className:`rounded-2xl border px-4 py-3 flex items-start gap-3 ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white/90"}`,children:[n.jsx("div",{className:`p-2 rounded-xl text-gray-900 bg-gradient-to-br ${i.accent}`,children:n.jsx(Nt,{className:"w-4 h-4"})}),n.jsxs("div",{className:"space-y-1",children:[n.jsx("p",{className:`text-sm sm:text-base font-semibold ${e}`,children:i.title}),i.note&&n.jsx("p",{className:`text-xs ${t}`,children:i.note})]})]},i.title))}),n.jsxs("div",{className:`rounded-3xl border shadow-xl overflow-hidden relative ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white/95"}`,children:[n.jsx("img",{src:Lk,alt:"Принципы ApeVault",className:"w-full h-full object-contain"}),n.jsx("div",{className:"absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white/0"})]}),n.jsx("div",{className:"space-y-3",children:s.slice(4).map(i=>n.jsxs("div",{className:`rounded-2xl border px-4 py-3 flex items-start gap-3 ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white/90"}`,children:[n.jsx("div",{className:`p-2 rounded-xl text-gray-900 bg-gradient-to-br ${i.accent}`,children:n.jsx(Nt,{className:"w-4 h-4"})}),n.jsxs("div",{className:"space-y-1",children:[n.jsx("p",{className:`text-sm sm:text-base font-semibold ${e}`,children:i.title}),i.note&&n.jsx("p",{className:`text-xs ${t}`,children:i.note})]})]},i.title))})]})]})]}),n.jsxs("div",{id:"rules",className:"section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden",children:[n.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-white/40 to-purple-100/40 dark:from-indigo-900/30 dark:via-transparent dark:to-purple-900/20"}),n.jsxs("div",{className:"relative z-10 grid gap-5 sm:grid-cols-[1.15fr_0.85fr] items-center",children:[n.jsxs("div",{className:"space-y-3",children:[n.jsxs("div",{className:"inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/10 text-xs font-semibold tracking-wide text-indigo-700 dark:text-white",children:[n.jsx(Io,{className:"w-4 h-4"}),"Правила сообщества"]}),n.jsx("h2",{className:`text-2xl sm:text-3xl font-extrabold ${e}`,children:"Простой регламент, чтобы оставаться на одной волне"}),n.jsx("p",{className:`text-sm sm:text-base ${t}`,children:"Подробно описали процессы, безопасность и взаимодействие, чтобы каждый чувствовал прозрачность и поддержку."}),n.jsx("div",{className:"flex flex-wrap gap-2",children:["Безопасность","Честные сделки","Уважение","Прозрачность"].map(i=>n.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-semibold border ${r==="dark"?"border-white/10 bg-white/5 text-white":"border-indigo-100 bg-white text-indigo-900"}`,children:i},i))}),n.jsxs("a",{href:"https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20",target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all",children:[n.jsx(Io,{className:"w-5 h-5"}),n.jsx("span",{children:"Читать регламент"}),n.jsx(Nt,{className:"w-4 h-4"})]})]}),n.jsx("div",{className:`rounded-2xl border p-4 sm:p-5 shadow-lg ${r==="dark"?"border-white/10 bg-white/5":"border-white/80 bg-white/90"}`,children:n.jsx("div",{className:"space-y-3",children:["Короткие правила для быстрых решений","Фокус на безопасности и приватности","Прозрачные роли и ответственность","Действуем в рамках законодательства"].map(i=>n.jsxs("div",{className:"flex items-start gap-2",children:[n.jsx("div",{className:"w-2 h-2 rounded-full bg-indigo-500 mt-2"}),n.jsx("p",{className:`text-sm ${e}`,children:i})]},i))})})]})]}),n.jsxs("div",{id:"contacts",className:"section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden",children:[n.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-rose-100/50 via-white/40 to-amber-100/40 dark:from-rose-900/25 dark:via-transparent dark:to-amber-900/20"}),n.jsxs("div",{className:"relative z-10 grid gap-5 sm:grid-cols-[0.9fr_1.1fr] items-center",children:[n.jsxs("div",{className:`p-4 rounded-2xl shadow-lg inline-flex items-center gap-3 ${r==="dark"?"bg-gradient-to-br from-rose-600 to-amber-600 text-white":"bg-gradient-to-br from-rose-500 to-amber-500 text-white"}`,children:[n.jsx(uf,{className:"w-7 h-7"}),n.jsxs("div",{children:[n.jsx("p",{className:"text-xs uppercase tracking-wide",children:"Контакты клуба"}),n.jsx("p",{className:"text-base font-semibold",children:"Свяжитесь с нами"})]})]}),n.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[n.jsxs("div",{className:`rounded-2xl border p-4 shadow-md flex flex-col gap-2 ${r==="dark"?"border-white/10 bg-white/5":"border-white/80 bg-white/90"}`,children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-rose-600 dark:text-rose-200 font-semibold",children:"Администратор"}),n.jsx("p",{className:`text-lg font-extrabold ${e}`,children:"@artyommedoed"}),n.jsx("p",{className:`text-sm ${t}`,children:"По вопросам правил, доступов и регламентов."})]}),n.jsxs("div",{className:`rounded-2xl border p-4 shadow-md flex flex-col gap-2 ${r==="dark"?"border-white/10 bg-white/5":"border-white/80 bg-white/90"}`,children:[n.jsx("p",{className:"text-xs uppercase tracking-wide text-amber-600 dark:text-amber-200 font-semibold",children:"Обратная связь"}),n.jsx("p",{className:`text-lg font-extrabold ${e}`,children:"Командный чат"}),n.jsx("p",{className:`text-sm ${t}`,children:"Оперативные вопросы по продуктам и сессиям."}),n.jsxs("a",{href:"https://t.me/+vPZdPwPaaKI1MjAy",target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 text-sm font-semibold text-[#4E6E49] hover:text-emerald-600",children:["Присоединиться",n.jsx(Nt,{className:"w-4 h-4"})]})]})]})]})]})]})})},Hr=({children:r})=>{const{isAuthenticated:e}=At(),{isAdmin:t}=Vt();return!e&&!t?n.jsx(Eo,{to:"/login",replace:!0}):n.jsx(n.Fragment,{children:r})};function Uk(){const{isAuthenticated:r}=At(),{isAdmin:e}=Vt(),{theme:t}=Ze();return A.useEffect(()=>{document.body.classList.toggle("dark",t==="dark")},[t]),A.useEffect(()=>{mg().catch(s=>console.error("Cleanup failed",s))},[]),n.jsx(sp,{children:n.jsxs(np,{children:[n.jsx(er,{path:"/login",element:!r&&!e?n.jsx(_f,{}):n.jsx(Eo,{to:"/management",replace:!0})}),n.jsx(er,{path:"/call",element:n.jsx(Hr,{children:n.jsx(a_,{})})}),n.jsx(er,{path:"/management",element:n.jsx(Hr,{children:n.jsx(yk,{})})}),n.jsx(er,{path:"/earnings",element:n.jsx(Hr,{children:n.jsx(_k,{})})}),n.jsx(er,{path:"/rating",element:n.jsx(Hr,{children:n.jsx(jk,{})})}),n.jsx(er,{path:"/tasks",element:n.jsx(Hr,{children:n.jsx($k,{})})}),n.jsx(er,{path:"/about",element:n.jsx(Hr,{children:n.jsx(Fk,{})})}),n.jsx(er,{path:"/faq",element:n.jsx(Mk,{})}),n.jsx(er,{path:"/admin",element:n.jsx(Hr,{children:n.jsx(Ok,{})})}),n.jsx(er,{path:"/profile",element:n.jsx(Hr,{children:n.jsx(Vk,{})})}),n.jsx(er,{path:"/",element:n.jsx(Eo,{to:r||e?"/management":"/login",replace:!0})})]})})}jo.createRoot(document.getElementById("root")).render(n.jsx(Du.StrictMode,{children:n.jsx(Uk,{})}));
