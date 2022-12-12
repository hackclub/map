import{html as p,render as m}from"https://unpkg.com/uhtml?module";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();const h=o=>o.composedPath()[0],y=(o,n)=>h(o).matches(n);function g(o){let{name:n,template:s,onConstruct:r,onConnected:e,onRender:t}=o;if(!n)throw"Component requires name.";s||(s=u=>p``),r||(r=null),e||(e=null),t||(t=null);class i extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),r!==null&&r(this),this.render()}on(l,a,c){this.shadowRoot.addEventListener(l,d=>{d.trigger=h(d),(a===""||y(d,a))&&c(d,this)})}useState(l,a=!1){for(const c in l){const d=l[c];f(c,d,a,this)}}useProp(l,a,c=!1){f(l,a,c,this)}setProp(l,a){if(l in this)this[l]=a,this.render();else throw"No prop with that name."}connectedCallback(){e!==null&&e(this)}render(){console.log("rendered"),t!==null&&t(this),m(this.shadowRoot,s(this))}}window.customElements.define(n,i)}function f(o,n,s,r){if(o in r)throw"Can't 'addProp' property name already in use.";let e=n,t="";s===!0&&(t=typeof n),Object.defineProperty(r,o,{get:()=>e,set:i=>{if(s&&typeof i!==t)throw`Attempted to assign wrong type to property '${o}', expected ${t} but received ${typeof i}.`;e=i,r.render()}})}const b=o=>{const n={};o.useState(n)},w=o=>{const n=o.shadowRoot.querySelector("#leaflet-map"),s=L.map(n,{drawControl:!0,zoomControl:!1}).setView([30.683,9.099],2);L.control.zoom({position:"topright"}).addTo(s),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(s),(async()=>(await fetch("https://api2.hackclub.com/v0.1/Club Applications/Clubs Dashboard").then(e=>e.json())).forEach(({fields:e})=>{if(!((e==null?void 0:e.Latitude)&&(e==null?void 0:e.Longitude)))return;const t=`
          transform-origin: left top;
          height: 20px;
          border-radius: 50%;
        `,i=new L.divIcon({html:`<img style="${t}" src="https://assets.hackclub.com/icon-rounded.png"/>`,className:"clear"});new L.marker([e.Latitude,e.Longitude],{icon:i}).addTo(s).bindPopup(`<b>${e==null?void 0:e.Venue}</b>`)}))()},C=p`
  <link rel="stylesheet" 
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""/>
  <style>
    #leaflet-map {
      width: 100%;
      height: 100vh;
    }
    .leaflet-container{
      font-family: 'Phantom Sans';
    }
    .leaflet-popup-close-button{
      display: none;
    }
  </style>
`,P=o=>p`
  ${C}
  <div id="leaflet-map"></div>
`;g({name:"club-map",template:P,onConstruct:b,onConnected:w});
