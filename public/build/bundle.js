var app=function(){"use strict";function t(){}const n=t=>t;function e(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(e)}function c(t){return"function"==typeof t}function s(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function l(t,n,e){t.$$.on_destroy.push(function(t,n){const e=t.subscribe(n);return e.unsubscribe?()=>e.unsubscribe():e}(n,e))}const a="undefined"!=typeof window;let i=a?()=>window.performance.now():()=>Date.now(),u=a?t=>requestAnimationFrame(t):t;const f=new Set;function m(t){f.forEach(n=>{n.c(t)||(f.delete(n),n.f())}),0!==f.size&&u(m)}function d(t,n){t.appendChild(n)}function p(t,n,e){t.insertBefore(n,e||null)}function $(t){t.parentNode.removeChild(t)}function y(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function g(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function v(){return h(" ")}function b(){return h("")}function k(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function x(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function P(t){return""===t?void 0:+t}function w(t,n){n=""+n,t.data!==n&&(t.data=n)}function C(t,n){(null!=n||t.value)&&(t.value=n)}function _(t,n){const e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,n),e}let E,N,A=0,j={};function M(t,n,e,o,r,c,s,l=0){const a=16.666/o;let i="{\n";for(let t=0;t<=1;t+=a){const o=n+(e-n)*c(t);i+=100*t+`%{${s(o,1-o)}}\n`}const u=i+`100% {${s(e,1-e)}}\n}`,f=`__svelte_${function(t){let n=5381,e=t.length;for(;e--;)n=(n<<5)-n^t.charCodeAt(e);return n>>>0}(u)}_${l}`;if(!j[f]){if(!E){const t=g("style");document.head.appendChild(t),E=t.sheet}j[f]=!0,E.insertRule(`@keyframes ${f} ${u}`,E.cssRules.length)}const m=t.style.animation||"";return t.style.animation=`${m?`${m}, `:""}${f} ${o}ms linear ${r}ms 1 both`,A+=1,f}function z(t,n){t.style.animation=(t.style.animation||"").split(", ").filter(n?t=>t.indexOf(n)<0:t=>-1===t.indexOf("__svelte")).join(", "),n&&!--A&&u(()=>{if(A)return;let t=E.cssRules.length;for(;t--;)E.deleteRule(t);j={}})}function S(t){N=t}function H(){const t=function(){if(!N)throw new Error("Function called outside component initialization");return N}();return(n,e)=>{const o=t.$$.callbacks[n];if(o){const r=_(n,e);o.slice().forEach(n=>{n.call(t,r)})}}}function I(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach(t=>t(n))}const R=[],T=[],O=[],q=[],B=Promise.resolve();let F,K=!1;function L(t){O.push(t)}function U(){const t=new Set;do{for(;R.length;){const t=R.shift();S(t),D(t.$$)}for(;T.length;)T.pop()();for(let n=0;n<O.length;n+=1){const e=O[n];t.has(e)||(e(),t.add(e))}O.length=0}while(R.length);for(;q.length;)q.pop()();K=!1}function D(t){if(null!==t.fragment){t.update(),r(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(L)}}function G(t,n,e){t.dispatchEvent(_(`${n?"intro":"outro"}${e}`))}const W=new Set;let J;function Q(){J={r:0,c:[],p:J}}function V(){J.r||r(J.c),J=J.p}function X(t,n){t&&t.i&&(W.delete(t),t.i(n))}function Y(t,n,e,o){if(t&&t.o){if(W.has(t))return;W.add(t),J.c.push(()=>{W.delete(t),o&&(e&&t.d(1),o())}),t.o(n)}}const Z={duration:0};function tt(e,o,s,l){let a=o(e,s),d=l?0:1,p=null,$=null,y=null;function g(){y&&z(e,y)}function h(t,n){const e=t.b-d;return n*=Math.abs(e),{a:d,b:t.b,d:e,duration:n,start:t.start,end:t.start+n,group:t.group}}function v(o){const{delay:c=0,duration:s=300,easing:l=n,tick:v=t,css:b}=a||Z,k={start:i()+c,b:o};o||(k.group=J,J.r+=1),p?$=k:(b&&(g(),y=M(e,d,o,s,c,l,b)),o&&v(0,1),p=h(k,s),L(()=>G(e,o,"start")),function(t){let n;0===f.size&&u(m),new Promise(e=>{f.add(n={c:t,f:e})})}(t=>{if($&&t>$.start&&(p=h($,s),$=null,G(e,p.b,"start"),b&&(g(),y=M(e,d,p.b,p.duration,0,l,a.css))),p)if(t>=p.end)v(d=p.b,1-d),G(e,p.b,"end"),$||(p.b?g():--p.group.r||r(p.group.c)),p=null;else if(t>=p.start){const n=t-p.start;d=p.a+p.d*l(n/p.duration),v(d,1-d)}return!(!p&&!$)}))}return{run(t){c(a)?(F||(F=Promise.resolve(),F.then(()=>{F=null})),F).then(()=>{a=a(),v(t)}):v(t)},end(){g(),p=$=null}}}function nt(t,n){t.d(1),n.delete(t.key)}function et(t,n){Y(t,1,1,()=>{n.delete(t.key)})}function ot(t,n,e,o,r,c,s,l,a,i,u,f){let m=t.length,d=c.length,p=m;const $={};for(;p--;)$[t[p].key]=p;const y=[],g=new Map,h=new Map;for(p=d;p--;){const t=f(r,c,p),l=e(t);let a=s.get(l);a?o&&a.p(t,n):(a=i(l,t),a.c()),g.set(l,y[p]=a),l in $&&h.set(l,Math.abs(p-$[l]))}const v=new Set,b=new Set;function k(t){X(t,1),t.m(l,u),s.set(t.key,t),u=t.first,d--}for(;m&&d;){const n=y[d-1],e=t[m-1],o=n.key,r=e.key;n===e?(u=n.first,m--,d--):g.has(r)?!s.has(o)||v.has(o)?k(n):b.has(r)?m--:h.get(o)>h.get(r)?(b.add(o),k(n)):(v.add(r),m--):(a(e,s),m--)}for(;m--;){const n=t[m];g.has(n.key)||a(n,s)}for(;d;)k(y[d-1]);return y}function rt(t){t&&t.c()}function ct(t,n,o){const{fragment:s,on_mount:l,on_destroy:a,after_update:i}=t.$$;s&&s.m(n,o),L(()=>{const n=l.map(e).filter(c);a?a.push(...n):r(n),t.$$.on_mount=[]}),i.forEach(L)}function st(t,n){const e=t.$$;null!==e.fragment&&(r(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function lt(t,n){-1===t.$$.dirty[0]&&(R.push(t),K||(K=!0,B.then(U)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function at(n,e,c,s,l,a,i=[-1]){const u=N;S(n);const f=e.props||{},m=n.$$={fragment:null,ctx:null,props:a,update:t,not_equal:l,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:i};let d=!1;m.ctx=c?c(n,f,(t,e,o=e)=>(m.ctx&&l(m.ctx[t],m.ctx[t]=o)&&(m.bound[t]&&m.bound[t](o),d&&lt(n,t)),e)):[],m.update(),d=!0,r(m.before_update),m.fragment=!!s&&s(m.ctx),e.target&&(e.hydrate?m.fragment&&m.fragment.l(function(t){return Array.from(t.childNodes)}(e.target)):m.fragment&&m.fragment.c(),e.intro&&X(n.$$.fragment),ct(n,e.target,e.anchor),U()),S(u)}class it{$destroy(){st(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}function ut(n){let e,o;return{c(){e=g("div"),x(e,"id","black-drop"),x(e,"class","svelte-1ynnkgs"),o=k(e,"click",n[0])},m(t,n){p(t,e,n)},p:t,i:t,o:t,d(t){t&&$(e),o()}}}function ft(t){return[function(n){I(t,n)}]}class mt extends it{constructor(t){super(),at(this,t,ft,ut,s,{})}}const dt=[];function pt(n,e=t){let o;const r=[];function c(t){if(s(n,t)&&(n=t,o)){const t=!dt.length;for(let t=0;t<r.length;t+=1){const e=r[t];e[1](),dt.push(e,n)}if(t){for(let t=0;t<dt.length;t+=2)dt[t][0](dt[t+1]);dt.length=0}}}return{set:c,update:function(t){c(t(n))},subscribe:function(s,l=t){const a=[s,l];return r.push(a),1===r.length&&(o=e(c)||t),s(n),()=>{const t=r.indexOf(a);-1!==t&&r.splice(t,1),0===r.length&&(o(),o=null)}}}}const $t=pt([]),yt={subscribe:$t.subscribe,setPlayers:t=>{$t.set(t)},payPot:(t,n)=>{$t.update(e=>{const o=e.findIndex(n=>n.name===t),r=[...e],c={...e[o]};return c.money-=parseInt(n),r[o]=c,r.sort((t,n)=>t.money<n.money?1:-1)})},collectPot:(t,n)=>{$t.update(e=>{const o=e.findIndex(n=>n.name===t),r=[...e],c={...e[o]};return console.log(c),console.log(r),c.money+=parseInt(n),r[o]=c,r.sort((t,n)=>t.money<n.money?1:-1)})},payPlayer:(t,n,e)=>{$t.update(o=>{const r=[...o],c=o.findIndex(n=>n.name===t),s={...o[c]};if(s.money-=e,r[c]=s,"bank"!==n){const t=o.findIndex(t=>t.name===n),c={...o[t]};c.money+=e,r[t]=c}return r.sort((t,n)=>t.money<n.money?1:-1)})},bankrupt:t=>{$t.update(n=>{let e=[...n];return e=e.filter(n=>n.name!==t),e})}},gt=pt(150),ht={subscribe:gt.subscribe,collectPot:()=>{gt.update(t=>0)},payPot:t=>{gt.update(n=>n+t)}};function vt(t,n,e){const o=t.slice();return o[4]=n[e],o}function bt(t){let n,e=[],o=new Map,r=t[0];const c=t=>t[4].name;for(let n=0;n<r.length;n+=1){let s=vt(t,r,n),l=c(s);o.set(l,e[n]=kt(l,s))}return{c(){for(let t=0;t<e.length;t+=1)e[t].c();n=b()},m(t,o){for(let n=0;n<e.length;n+=1)e[n].m(t,o);p(t,n,o)},p(t,r){const s=t[0];e=ot(e,r,c,1,t,s,o,n.parentNode,nt,kt,n,vt)},d(t){for(let n=0;n<e.length;n+=1)e[n].d(t);t&&$(n)}}}function kt(t,n){let e,o,r,c,s,l,a=n[4].name+"";return{key:t,first:null,c(){e=g("button"),o=h(n[1]),r=v(),c=h(a),s=v(),l=k(e,"click",n[6]),this.first=e},m(t,n){p(t,e,n),d(e,o),d(e,r),d(e,c),d(e,s)},p(t,n){2&n&&w(o,t[1]),1&n&&a!==(a=t[4].name+"")&&w(c,a)},d(t){t&&$(e),l()}}}function xt(t){let n,e,o,r,c,s=t[0][0].name+"";return{c(){n=g("button"),e=h(t[1]),o=v(),r=h(s),c=k(n,"click",t[6])},m(t,c){p(t,n,c),d(n,e),d(n,o),d(n,r)},p(t,n){2&n&&w(e,t[1]),1&n&&s!==(s=t[0][0].name+"")&&w(r,s)},d(t){t&&$(n),c()}}}function Pt(t){let n,e,o,r;return{c(){n=g("button"),e=h(t[1]),o=h(" all"),r=k(n,"click",t[6])},m(t,r){p(t,n,r),d(n,e),d(n,o)},p(t,n){2&n&&w(e,t[1])},d(t){t&&$(n),r()}}}function wt(t){let n,e,o,c,s,l,a,i,u,f,m,y,b,P,_,E,N,A,j,M,z,S=!1;const H=new mt({});function I(){S=!0,t[10].call(s)}H.$on("click",t[8]);let R="Pay"===t[1]&&bt(t);function T(t,n){return t[0].length>1?Pt:"Collect"===t[1]?xt:void 0}let O=T(t),q=O&&O(t);return{c(){rt(H.$$.fragment),n=v(),e=g("div"),o=g("section"),c=g("label"),s=g("input"),l=v(),R&&R.c(),a=v(),q&&q.c(),i=v(),u=g("button"),f=h(t[1]),m=h(" bank"),y=v(),b=g("button"),P=h(t[1]),_=h(" Community Pot($"),E=h(t[3]),N=h(")"),A=v(),j=g("button"),j.textContent="Cancel",x(s,"type","number"),x(s,"placeholder",t[5]),x(s,"class","svelte-1jn8nfi"),x(j,"class","cancel-button svelte-1jn8nfi"),x(o,"class","svelte-1jn8nfi"),x(e,"class","container svelte-1jn8nfi"),z=[k(s,"input",I),k(u,"click",t[6]),k(b,"click",t[7]),k(j,"click",t[8])]},m(r,$){ct(H,r,$),p(r,n,$),p(r,e,$),d(e,o),d(o,c),d(c,s),C(s,t[2]),d(o,l),R&&R.m(o,null),d(o,a),q&&q.m(o,null),d(o,i),d(o,u),d(u,f),d(u,m),d(o,y),d(o,b),d(b,P),d(b,_),d(b,E),d(b,N),d(o,A),d(o,j),M=!0},p(t,[n]){!S&&4&n&&C(s,t[2]),S=!1,"Pay"===t[1]?R?R.p(t,n):(R=bt(t),R.c(),R.m(o,a)):R&&(R.d(1),R=null),O===(O=T(t))&&q?q.p(t,n):(q&&q.d(1),q=O&&O(t),q&&(q.c(),q.m(o,i))),(!M||2&n)&&w(f,t[1]),(!M||2&n)&&w(P,t[1]),(!M||8&n)&&w(E,t[3])},i(t){M||(X(H.$$.fragment,t),M=!0)},o(t){Y(H.$$.fragment,t),M=!1},d(t){st(H,t),t&&$(n),t&&$(e),R&&R.d(),q&&q.d(),r(z)}}}function Ct(t,n,e){let o;l(t,ht,t=>e(3,o=t));const r=H();let c,s,{players:a}=n,{action:i}=n,u=`Amount to ${i}`;return t.$set=t=>{"players"in t&&e(0,a=t.players),"action"in t&&e(1,i=t.action)},[a,i,s,o,c,u,function(t){let n=t.target.innerText;e(4,c=n.split(" ")[1]),r("transaction",{player:c,amount:s})},function(t){r("transaction-pot",{amount:s})},function(){r("close-modal")},r,function(){s=P(this.value),e(2,s)}]}class _t extends it{constructor(t){super(),at(this,t,Ct,wt,s,{players:0,action:1})}}function Et(t){let n,e,o,c,s,l,a,i,u,f,m,y,b;const P=new mt({});return P.$on("click",t[3]),{c(){rt(P.$$.fragment),n=v(),e=g("div"),o=g("div"),c=g("p"),s=h(t[0]),l=v(),a=g("input"),i=v(),u=g("button"),u.textContent="Confirm",f=v(),m=g("button"),m.textContent="Cancel",x(a,"type","text"),x(a,"name","confirm"),x(m,"class","cancel-button svelte-zljhsc"),x(o,"class","card svelte-zljhsc"),x(e,"class","container svelte-zljhsc"),b=[k(a,"input",t[6]),k(u,"click",t[2]),k(m,"click",t[3])]},m(r,$){ct(P,r,$),p(r,n,$),p(r,e,$),d(e,o),d(o,c),d(c,s),d(o,l),d(o,a),C(a,t[1]),d(o,i),d(o,u),d(o,f),d(o,m),y=!0},p(t,[n]){(!y||1&n)&&w(s,t[0]),2&n&&a.value!==t[1]&&C(a,t[1])},i(t){y||(X(P.$$.fragment,t),y=!0)},o(t){Y(P.$$.fragment,t),y=!1},d(t){st(P,t),t&&$(n),t&&$(e),r(b)}}}function Nt(t,n,e){const o=H();let r,{name:c}=n,{message:s=`To declare bankruptcy for ${c}, type 'BANKRUPT' in the field below`}=n;return t.$set=t=>{"name"in t&&e(4,c=t.name),"message"in t&&e(0,s=t.message)},[s,r,function(){"BANKRUPT"===r&&o("bankrupt-user")},function(){o("close-modal")},c,o,function(){r=this.value,e(1,r)}]}class At extends it{constructor(t){super(),at(this,t,Nt,Et,s,{name:4,message:0})}}function jt(t){let n,e;const o=new _t({props:{players:t[5],action:t[3].action}});return o.$on("transaction",(function(){c(t[3].transaction)&&t[3].transaction.apply(this,arguments)})),o.$on("transaction-pot",(function(){c(t[3].transactionPot)&&t[3].transactionPot.apply(this,arguments)})),o.$on("close-modal",t[20]),{c(){n=g("div"),rt(o.$$.fragment),x(n,"class","select-player svelte-1ycrfhv")},m(t,r){p(t,n,r),ct(o,n,null),e=!0},p(n,e){t=n;const r={};32&e&&(r.players=t[5]),8&e&&(r.action=t[3].action),o.$set(r)},i(t){e||(X(o.$$.fragment,t),e=!0)},o(t){Y(o.$$.fragment,t),e=!1},d(t){t&&$(n),st(o)}}}function Mt(t){let n;const e=new At({props:{name:t[2]}});return e.$on("bankrupt-user",t[7]),e.$on("close-modal",t[21]),{c(){rt(e.$$.fragment)},m(t,o){ct(e,t,o),n=!0},p(t,n){const o={};4&n&&(o.name=t[2]),e.$set(o)},i(t){n||(X(e.$$.fragment,t),n=!0)},o(t){Y(e.$$.fragment,t),n=!1},d(t){st(e,t)}}}function zt(t){let n,e,o,c,s,l,a,i,u,f,m,y,P,C,_,E,N,A,j,M,z,S,H,I,R,T,O,q=t[3]&&jt(t),B=t[4]&&Mt(t);return{c(){n=g("section"),e=g("div"),o=g("div"),c=g("h2"),s=h(t[2]),l=v(),a=g("h4"),i=h("$"),u=h(t[0]),f=v(),m=g("div"),y=g("div"),P=g("button"),P.textContent="Pay Player",C=v(),_=g("div"),E=g("button"),E.textContent="Collect Money",N=v(),A=g("button"),A.textContent="P",j=v(),M=g("div"),z=g("button"),z.textContent="C",H=v(),q&&q.c(),I=v(),B&&B.c(),R=b(),x(c,"class","svelte-1ycrfhv"),x(a,"class","svelte-1ycrfhv"),x(o,"class","svelte-1ycrfhv"),x(e,"class","headers svelte-1ycrfhv"),x(P,"class","normal-button svelte-1ycrfhv"),x(y,"class","svelte-1ycrfhv"),x(E,"class","normal-button svelte-1ycrfhv"),x(A,"class","small-button svelte-1ycrfhv"),x(_,"class","svelte-1ycrfhv"),x(z,"class","small-button svelte-1ycrfhv"),x(M,"class","svelte-1ycrfhv"),x(m,"class","buttons svelte-1ycrfhv"),x(n,"id",S="p"+t[1]),x(n,"class","svelte-1ycrfhv"),O=[k(a,"click",t[15]),k(P,"click",t[16]),k(E,"click",t[17]),k(A,"click",t[18]),k(z,"click",t[19])]},m(t,r){p(t,n,r),d(n,e),d(e,o),d(o,c),d(c,s),d(o,l),d(o,a),d(a,i),d(a,u),d(n,f),d(n,m),d(m,y),d(y,P),d(m,C),d(m,_),d(_,E),d(_,N),d(_,A),d(m,j),d(m,M),d(M,z),p(t,H,r),q&&q.m(t,r),p(t,I,r),B&&B.m(t,r),p(t,R,r),T=!0},p(t,[e]){(!T||4&e)&&w(s,t[2]),(!T||1&e)&&w(u,t[0]),(!T||2&e&&S!==(S="p"+t[1]))&&x(n,"id",S),t[3]?q?(q.p(t,e),X(q,1)):(q=jt(t),q.c(),X(q,1),q.m(I.parentNode,I)):q&&(Q(),Y(q,1,1,()=>{q=null}),V()),t[4]?B?(B.p(t,e),X(B,1)):(B=Mt(t),B.c(),X(B,1),B.m(R.parentNode,R)):B&&(Q(),Y(B,1,1,()=>{B=null}),V())},i(t){T||(X(q),X(B),T=!0)},o(t){Y(q),Y(B),T=!1},d(t){t&&$(n),t&&$(H),q&&q.d(t),t&&$(I),B&&B.d(t),t&&$(R),r(O)}}}function St(t,n,e){let o,r;l(t,yt,t=>e(8,o=t)),l(t,ht,t=>e(9,r=t));const c=H();let{id:s}=n,{name:a}=n,{money:i}=n;const u={payPrompt:{action:"Pay",transaction:d,transactionPot:$},collectPrompt:{action:"Collect",transaction:p,transactionPot:y}};let f=!1,m=!1;function d(t){const n=a,o=t.detail.player,r=t.detail.amount;if(!r)return c("error","Please enter an amount"),!1;if("all"===o){c("send-message",`${a} is paying all`);let t=r*g.length;if(i<t)return c("error",`${a} does not have enough money for this transaction - $${t}`),!1;for(const t of g)yt.payPlayer(n,t.name,r),c("send-message",`${a} paid ${t.name} $${r}`)}else{if(i<r)return c("error",`${a} does not have enough money for this transaction`),!1;yt.payPlayer(n,o,r),c("send-message",`${a} paid ${o} $${r}`)}e(3,f=!1)}function p(t){const n=t.detail.player,o=a,r=t.detail.amount;if(!r)return c("error","Please enter an amount"),!1;if("all"===n){c("send-message",`${a} is collecting from all`);for(const t of g)t.money<r?c("error",`${t.name} does not have enough money for this transaction`):(yt.payPlayer(t.name,o,r),c("send-message",`${a} collected $${r} from ${t.name}`))}else yt.payPlayer(n,o,r),c("send-message",`${a} collected $${r} from ${n}`);e(3,f=!1)}function $(t){const n=t.detail.amount;return n?i<n?(c("error",`${a} does not have enough money for this transaction`),!1):(e(0,i-=n),yt.payPot(a,n),ht.payPot(n),c("send-message",`${a} put $${n} into the Community Pot`),void e(3,f=!1)):(c("error","Please enter an amount"),!1)}function y(){yt.collectPot(a,r),c("send-message",`${a} collected $${r} from the Community Pot`),e(0,i+=r),ht.collectPot(),e(3,f=!1)}let g;return t.$set=t=>{"id"in t&&e(1,s=t.id),"name"in t&&e(2,a=t.name),"money"in t&&e(0,i=t.money)},t.$$.update=()=>{260&t.$$.dirty&&e(5,g=o.filter(t=>t.name!==a))},[i,s,a,f,m,g,u,function(){yt.bankrupt(a),c("send-message",`${a} has gone bankrupt!`)},o,r,c,d,p,$,y,()=>e(4,m=!0),()=>e(3,f=u.payPrompt),()=>e(3,f=u.collectPrompt),()=>e(3,f=u.payPrompt),()=>e(3,f=u.collectPrompt),()=>e(3,f=!1),()=>e(4,m=!1)]}class Ht extends it{constructor(t){super(),at(this,t,St,zt,s,{id:1,name:2,money:0})}}function It(n){let e,o,r,c;return{c(){e=g("div"),o=g("span"),r=h(n[0]),x(e,"class","svelte-1315r04"),c=k(e,"click",n[1])},m(t,n){p(t,e,n),d(e,o),d(o,r)},p(t,[n]){1&n&&w(r,t[0])},i:t,o:t,d(t){t&&$(e),c()}}}function Rt(t,n,e){let{message:o}=n;return t.$set=t=>{"message"in t&&e(0,o=t.message)},[o,function(n){I(t,n)}]}class Tt extends it{constructor(t){super(),at(this,t,Rt,It,s,{message:0})}}function Ot(t,n,e){const o=t.slice();return o[2]=n[e],o}function qt(t){let n,e=t[0],o=[];for(let n=0;n<e.length;n+=1)o[n]=Bt(Ot(t,e,n));return{c(){for(let t=0;t<o.length;t+=1)o[t].c();n=b()},m(t,e){for(let n=0;n<o.length;n+=1)o[n].m(t,e);p(t,n,e)},p(t,r){if(1&r){let c;for(e=t[0],c=0;c<e.length;c+=1){const s=Ot(t,e,c);o[c]?o[c].p(s,r):(o[c]=Bt(s),o[c].c(),o[c].m(n.parentNode,n))}for(;c<o.length;c+=1)o[c].d(1);o.length=e.length}},d(t){y(o,t),t&&$(n)}}}function Bt(t){let n,e,o,r,c=t[2]+"";return{c(){n=g("div"),e=g("li"),o=h(c),r=v(),x(n,"class","move svelte-cldokg")},m(t,c){p(t,n,c),d(n,e),d(e,o),d(n,r)},p(t,n){1&n&&c!==(c=t[2]+"")&&w(o,c)},d(t){t&&$(n)}}}function Ft(n){let e,o,r,c,s=n[0]&&qt(n);return{c(){e=g("div"),o=g("div"),r=g("ul"),s&&s.c(),x(o,"class","moves svelte-cldokg"),x(e,"class","container svelte-cldokg"),c=k(o,"click",n[1])},m(t,n){p(t,e,n),d(e,o),d(o,r),s&&s.m(r,null)},p(t,[n]){t[0]?s?s.p(t,n):(s=qt(t),s.c(),s.m(r,null)):s&&(s.d(1),s=null)},i:t,o:t,d(t){t&&$(e),s&&s.d(),c()}}}function Kt(t,n,e){let{moveHistory:o}=n;return t.$set=t=>{"moveHistory"in t&&e(0,o=t.moveHistory)},[o,function(n){I(t,n)}]}class Lt extends it{constructor(t){super(),at(this,t,Kt,Ft,s,{moveHistory:0})}}function Ut(t){const n=t-1;return n*n*n+1}function Dt(t,{delay:n=0,duration:e=400,easing:o=Ut,x:r=0,y:c=0,opacity:s=0}){const l=getComputedStyle(t),a=+l.opacity,i="none"===l.transform?"":l.transform,u=a*(1-s);return{delay:n,duration:e,easing:o,css:(t,n)=>`\n\t\t\ttransform: ${i} translate(${(1-t)*r}px, ${(1-t)*c}px);\n\t\t\topacity: ${a-u*n}`}}function Gt(t,n,e){const o=t.slice();return o[2]=n[e],o}function Wt(t){let n,e,o=[],r=new Map,c=t[0];const s=t=>t[2];for(let n=0;n<c.length;n+=1){let e=Gt(t,c,n),l=s(e);r.set(l,o[n]=Jt(l,e))}return{c(){n=g("div");for(let t=0;t<o.length;t+=1)o[t].c();x(n,"class","errors svelte-7ps83s")},m(t,r){p(t,n,r);for(let t=0;t<o.length;t+=1)o[t].m(n,null);e=!0},p(t,e){const c=t[0];Q(),o=ot(o,e,s,1,t,c,r,n,et,Jt,null,Gt),V()},i(t){if(!e){for(let t=0;t<c.length;t+=1)X(o[t]);e=!0}},o(t){for(let t=0;t<o.length;t+=1)Y(o[t]);e=!1},d(t){t&&$(n);for(let t=0;t<o.length;t+=1)o[t].d()}}}function Jt(t,n){let e,o,r,c,s,l,a=n[2]+"";return{key:t,first:null,c(){e=g("section"),o=h(a),r=v(),x(e,"class","svelte-7ps83s"),l=k(e,"click",n[1]),this.first=e},m(t,n){p(t,e,n),d(e,o),d(e,r),s=!0},p(t,n){(!s||1&n)&&a!==(a=t[2]+"")&&w(o,a)},i(t){s||(L(()=>{c||(c=tt(e,Dt,{x:900,duration:300},!0)),c.run(1)}),s=!0)},o(t){c||(c=tt(e,Dt,{x:900,duration:300},!1)),c.run(0),s=!1},d(t){t&&$(e),t&&c&&c.end(),l()}}}function Qt(t){let n,e,o=t[0]&&Wt(t);return{c(){o&&o.c(),n=b()},m(t,r){o&&o.m(t,r),p(t,n,r),e=!0},p(t,[e]){t[0]?o?(o.p(t,e),X(o,1)):(o=Wt(t),o.c(),X(o,1),o.m(n.parentNode,n)):o&&(Q(),Y(o,1,1,()=>{o=null}),V())},i(t){e||(X(o),e=!0)},o(t){Y(o),e=!1},d(t){o&&o.d(t),t&&$(n)}}}function Vt(t,n,e){let{messages:o=[]}=n;return t.$set=t=>{"messages"in t&&e(0,o=t.messages)},[o,function(n){I(t,n)}]}class Xt extends it{constructor(t){super(),at(this,t,Vt,Qt,s,{messages:0})}}function Yt(t,n,e){const o=t.slice();return o[7]=n[e],o[9]=e,o}function Zt(t){let n,e,o,r,c=Array(t[1]),s=[];for(let n=0;n<c.length;n+=1)s[n]=nn(Yt(t,c,n));return{c(){n=g("div");for(let t=0;t<s.length;t+=1)s[t].c();e=v(),o=g("button"),o.textContent="Start Game",x(n,"class","player-container svelte-7mk1c2"),x(o,"class","svelte-7mk1c2"),r=k(o,"click",t[2])},m(t,r){p(t,n,r);for(let t=0;t<s.length;t+=1)s[t].m(n,null);p(t,e,r),p(t,o,r)},p(t,e){if(3&e){let o;for(c=Array(t[1]),o=0;o<c.length;o+=1){const r=Yt(t,c,o);s[o]?s[o].p(r,e):(s[o]=nn(r),s[o].c(),s[o].m(n,null))}for(;o<s.length;o+=1)s[o].d(1);s.length=c.length}},d(t){t&&$(n),y(s,t),t&&$(e),t&&$(o),r()}}}function tn(n){let e;return{c(){e=g("p"),e.textContent="Please select a number of players between 2 and 8"},m(t,n){p(t,e,n)},p:t,d(t){t&&$(e)}}}function nn(t){let n,e,o,c,s,l,a,i,u,f,m,y,b,P,w=!1;function _(){t[5].call(l,t[9])}function E(){w=!0,t[6].call(y,t[9])}return{c(){n=g("article"),e=g("label"),o=h("Player Name "),c=g("br"),s=v(),l=g("input"),a=v(),i=g("label"),u=h("Starting Cash "),f=g("br"),m=v(),y=g("input"),b=v(),x(l,"type","text"),x(y,"type","number"),y.value="1500",x(n,"class","svelte-7mk1c2"),P=[k(l,"input",_),k(y,"input",E)]},m(r,$){p(r,n,$),d(n,e),d(e,o),d(e,c),d(e,s),d(e,l),C(l,t[0][t[9]].name),d(n,a),d(n,i),d(i,u),d(i,f),d(i,m),d(i,y),C(y,t[0][t[9]].money),d(n,b)},p(n,e){t=n,1&e&&l.value!==t[0][t[9]].name&&C(l,t[0][t[9]].name),!w&&1&e&&C(y,t[0][t[9]].money),w=!1},d(t){t&&$(n),r(P)}}}function en(n){let e,o,r,c,s,l,a,i,u,f,m,y,b=!1;function P(){b=!0,n[4].call(i)}function w(t,n){return t[1]<2||t[1]>8||!t[1]?tn:Zt}let _=w(n),E=_(n);return{c(){e=g("div"),o=g("h1"),o.textContent="Monopoly Bank",r=v(),c=g("label"),s=h("How many players? "),l=g("br"),a=v(),i=g("input"),u=v(),f=g("br"),m=v(),E.c(),x(i,"type","number"),x(e,"class","container svelte-7mk1c2"),y=k(i,"input",P)},m(t,$){p(t,e,$),d(e,o),d(e,r),d(e,c),d(c,s),d(c,l),d(c,a),d(c,i),C(i,n[1]),d(e,u),d(e,f),d(e,m),E.m(e,null)},p(t,[n]){!b&&2&n&&C(i,t[1]),b=!1,_===(_=w(t))&&E?E.p(t,n):(E.d(1),E=_(t),E&&(E.c(),E.m(e,null)))},i:t,o:t,d(t){t&&$(e),E.d(),y()}}}function on(t,n,e){const o=H();let r=[{id:1,name:"",money:1500},{id:2,name:"",money:1500},{id:3,name:"",money:1500},{id:4,name:"",money:1500},{id:5,name:"",money:1500},{id:6,name:"",money:1500},{id:7,name:"",money:1500},{id:8,name:"",money:1500}],c=2;return[r,c,function(){const t=r.filter(t=>{if(t.name&&"number"==typeof t.money&&t.money>1)return t.name});if(t.length!==c)return o("error","Wrong number of players"),!1;yt.setPlayers(t),o("initialize-game")},o,function(){c=P(this.value),e(1,c)},function(t){r[t].name=this.value,e(0,r)},function(t){r[t].money=P(this.value),e(0,r)}]}class rn extends it{constructor(t){super(),at(this,t,on,en,s,{})}}function cn(t,n,e){const o=t.slice();return o[12]=n[e],o}function sn(t){let n;const e=new Xt({props:{messages:t[3]}});return e.$on("click",t[8]),{c(){rt(e.$$.fragment)},m(t,o){ct(e,t,o),n=!0},p(t,n){const o={};8&n&&(o.messages=t[3]),e.$set(o)},i(t){n||(X(e.$$.fragment,t),n=!0)},o(t){Y(e.$$.fragment,t),n=!1},d(t){st(e,t)}}}function ln(t){let n,e,o,r,c,s,l=[],a=new Map;const i=new Tt({props:{message:t[2]}});i.$on("click",t[10]);let u=t[0]&&un(t),f=t[5];const m=t=>t[12].id;for(let n=0;n<f.length;n+=1){let e=cn(t,f,n),o=m(e);a.set(o,l[n]=fn(o,e))}return{c(){n=g("header"),rt(i.$$.fragment),e=v(),u&&u.c(),o=v(),r=g("main"),c=g("section");for(let t=0;t<l.length;t+=1)l[t].c();x(c,"class","svelte-83qfl3"),x(r,"class","svelte-83qfl3")},m(t,a){p(t,n,a),ct(i,n,null),p(t,e,a),u&&u.m(t,a),p(t,o,a),p(t,r,a),d(r,c);for(let t=0;t<l.length;t+=1)l[t].m(c,null);s=!0},p(t,n){const e={};4&n&&(e.message=t[2]),i.$set(e),t[0]?u?(u.p(t,n),X(u,1)):(u=un(t),u.c(),X(u,1),u.m(o.parentNode,o)):u&&(Q(),Y(u,1,1,()=>{u=null}),V());const r=t[5];Q(),l=ot(l,n,m,1,t,r,a,c,et,fn,null,cn),V()},i(t){if(!s){X(i.$$.fragment,t),X(u);for(let t=0;t<f.length;t+=1)X(l[t]);s=!0}},o(t){Y(i.$$.fragment,t),Y(u);for(let t=0;t<l.length;t+=1)Y(l[t]);s=!1},d(t){t&&$(n),st(i),t&&$(e),u&&u.d(t),t&&$(o),t&&$(r);for(let t=0;t<l.length;t+=1)l[t].d()}}}function an(n){let e;const o=new rn({});return o.$on("error",n[7]),o.$on("initialize-game",n[9]),{c(){rt(o.$$.fragment)},m(t,n){ct(o,t,n),e=!0},p:t,i(t){e||(X(o.$$.fragment,t),e=!0)},o(t){Y(o.$$.fragment,t),e=!1},d(t){st(o,t)}}}function un(t){let n;const e=new Lt({props:{moveHistory:t[1]}});return e.$on("click",t[11]),{c(){rt(e.$$.fragment)},m(t,o){ct(e,t,o),n=!0},p(t,n){const o={};2&n&&(o.moveHistory=t[1]),e.$set(o)},i(t){n||(X(e.$$.fragment,t),n=!0)},o(t){Y(e.$$.fragment,t),n=!1},d(t){st(e,t)}}}function fn(t,n){let e,o;const r=new Ht({props:{id:n[12].id,name:n[12].name,money:n[12].money}});return r.$on("send-message",n[6]),r.$on("error",n[7]),{key:t,first:null,c(){e=b(),rt(r.$$.fragment),this.first=e},m(t,n){p(t,e,n),ct(r,t,n),o=!0},p(t,n){const e={};32&n&&(e.id=t[12].id),32&n&&(e.name=t[12].name),32&n&&(e.money=t[12].money),r.$set(e)},i(t){o||(X(r.$$.fragment,t),o=!0)},o(t){Y(r.$$.fragment,t),o=!1},d(t){t&&$(e),st(r,t)}}}function mn(t){let n,e,o,r,c,s=t[3]&&sn(t);const l=[an,ln],a=[];function i(t,n){return t[4]?0:1}return e=i(t),o=a[e]=l[e](t),{c(){s&&s.c(),n=v(),o.c(),r=b()},m(t,o){s&&s.m(t,o),p(t,n,o),a[e].m(t,o),p(t,r,o),c=!0},p(t,[c]){t[3]?s?(s.p(t,c),X(s,1)):(s=sn(t),s.c(),X(s,1),s.m(n.parentNode,n)):s&&(Q(),Y(s,1,1,()=>{s=null}),V());let u=e;e=i(t),e===u?a[e].p(t,c):(Q(),Y(a[u],1,1,()=>{a[u]=null}),V(),o=a[e],o||(o=a[e]=l[e](t),o.c()),X(o,1),o.m(r.parentNode,r))},i(t){c||(X(s),X(o),c=!0)},o(t){Y(s),Y(o),c=!1},d(t){s&&s.d(t),t&&$(n),a[e].d(t),t&&$(r)}}}function dn(t,n,e){let o;l(t,yt,t=>e(5,o=t));let r=!1,c=[],s="Click a player's money to bankrupt them",a=[],i=!0;return[r,c,s,a,i,o,function(t){e(2,s=t.detail),e(1,c=[s,...c])},function(t){e(3,a=[...a,t.detail])},function(t){const n=t.target.innerText;e(3,a=a.filter(t=>t!==n))},()=>e(4,i=!1),()=>e(0,r=!r),()=>e(0,r=!1)]}return new class extends it{constructor(t){super(),at(this,t,dn,mn,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
