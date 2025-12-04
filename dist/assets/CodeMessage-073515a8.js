import{F as O,ex as q,p as k,ak as K,M as w,J,L,K as U,t as H,R as Q,r as N,w as Z,C as _,V as M,Q as S,a1 as A,y as z,br as W,bs as o,bH as G,bI as X,bJ as Y,bK as v,bN as p,bL as j,aI as ee,D as ne,bM as te,c5 as oe,bR as le}from"./index-8d305a84.js";import{u as se}from"./useUtil-50c48c7c.js";function ie(e,n){const l=O(q,null);return k(()=>e.hljs||(l==null?void 0:l.mergedHljsRef.value))}function re(e){const{textColor2:n,fontSize:l,fontWeightStrong:c,textColor3:s}=e;return{textColor:n,fontSize:l,fontWeightStrong:c,"mono-3":"#a0a1a7","hue-1":"#0184bb","hue-2":"#4078f2","hue-3":"#a626a4","hue-4":"#50a14f","hue-5":"#e45649","hue-5-2":"#c91243","hue-6":"#986801","hue-6-2":"#c18401",lineNumberTextColor:s}}const ae={name:"Code",common:K,self:re},ce=ae,he=w([J("code",`
 font-size: var(--n-font-size);
 font-family: var(--n-font-family);
 `,[L("show-line-numbers",`
 display: flex;
 `),U("line-numbers",`
 user-select: none;
 padding-right: 12px;
 text-align: right;
 transition: color .3s var(--n-bezier);
 color: var(--n-line-number-text-color);
 `),L("word-wrap",[w("pre",`
 white-space: pre-wrap;
 word-break: break-all;
 `)]),w("pre",`
 margin: 0;
 line-height: inherit;
 font-size: inherit;
 font-family: inherit;
 `),w("[class^=hljs]",`
 color: var(--n-text-color);
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `)]),({props:e})=>{const n=`${e.bPrefix}code`;return[`${n} .hljs-comment,
 ${n} .hljs-quote {
 color: var(--n-mono-3);
 font-style: italic;
 }`,`${n} .hljs-doctag,
 ${n} .hljs-keyword,
 ${n} .hljs-formula {
 color: var(--n-hue-3);
 }`,`${n} .hljs-section,
 ${n} .hljs-name,
 ${n} .hljs-selector-tag,
 ${n} .hljs-deletion,
 ${n} .hljs-subst {
 color: var(--n-hue-5);
 }`,`${n} .hljs-literal {
 color: var(--n-hue-1);
 }`,`${n} .hljs-string,
 ${n} .hljs-regexp,
 ${n} .hljs-addition,
 ${n} .hljs-attribute,
 ${n} .hljs-meta-string {
 color: var(--n-hue-4);
 }`,`${n} .hljs-built_in,
 ${n} .hljs-class .hljs-title {
 color: var(--n-hue-6-2);
 }`,`${n} .hljs-attr,
 ${n} .hljs-variable,
 ${n} .hljs-template-variable,
 ${n} .hljs-type,
 ${n} .hljs-selector-class,
 ${n} .hljs-selector-attr,
 ${n} .hljs-selector-pseudo,
 ${n} .hljs-number {
 color: var(--n-hue-6);
 }`,`${n} .hljs-symbol,
 ${n} .hljs-bullet,
 ${n} .hljs-link,
 ${n} .hljs-meta,
 ${n} .hljs-selector-id,
 ${n} .hljs-title {
 color: var(--n-hue-2);
 }`,`${n} .hljs-emphasis {
 font-style: italic;
 }`,`${n} .hljs-strong {
 font-weight: var(--n-font-weight-strong);
 }`,`${n} .hljs-link {
 text-decoration: underline;
 }`]}]),ue=Object.assign(Object.assign({},S.props),{language:String,code:{type:String,default:""},trim:{type:Boolean,default:!0},hljs:Object,uri:Boolean,inline:Boolean,wordWrap:Boolean,showLineNumbers:Boolean,internalFontSize:Number,internalNoHighlight:Boolean}),de=H({name:"Code",props:ue,setup(e,{slots:n}){const{internalNoHighlight:l}=e,{mergedClsPrefixRef:c,inlineThemeDisabled:s}=Q(),u=N(null),d=l?{value:void 0}:ie(e),m=(t,r,i)=>{const{value:a}=d;return!a||!(t&&a.getLanguage(t))?null:a.highlight(i?r.trim():r,{language:t}).value},$=k(()=>e.inline||e.wordWrap?!1:e.showLineNumbers),f=()=>{if(n.default)return;const{value:t}=u;if(!t)return;const{language:r}=e,i=e.uri?window.decodeURIComponent(e.code):e.code;if(r){const h=m(r,i,e.trim);if(h!==null){if(e.inline)t.innerHTML=h;else{const C=t.querySelector(".__code__");C&&t.removeChild(C);const b=document.createElement("pre");b.className="__code__",b.innerHTML=h,t.appendChild(b)}return}}if(e.inline){t.textContent=i;return}const a=t.querySelector(".__code__");if(a)a.textContent=i;else{const h=document.createElement("pre");h.className="__code__",h.textContent=i,t.innerHTML="",t.appendChild(h)}};Z(f),_(M(e,"language"),f),_(M(e,"code"),f),l||_(d,f);const R=S("Code","-code",he,ce,e,c),x=k(()=>{const{common:{cubicBezierEaseInOut:t,fontFamilyMono:r},self:{textColor:i,fontSize:a,fontWeightStrong:h,lineNumberTextColor:C,"mono-3":b,"hue-1":V,"hue-2":B,"hue-3":P,"hue-4":E,"hue-5":I,"hue-5-2":T,"hue-6":F,"hue-6-2":D}}=R.value,{internalFontSize:y}=e;return{"--n-font-size":y?`${y}px`:a,"--n-font-family":r,"--n-font-weight-strong":h,"--n-bezier":t,"--n-text-color":i,"--n-mono-3":b,"--n-hue-1":V,"--n-hue-2":B,"--n-hue-3":P,"--n-hue-4":E,"--n-hue-5":I,"--n-hue-5-2":T,"--n-hue-6":F,"--n-hue-6-2":D,"--n-line-number-text-color":C}}),g=s?A("code",k(()=>`${e.internalFontSize||"a"}`),x,e):void 0;return{mergedClsPrefix:c,codeRef:u,mergedShowLineNumbers:$,lineNumbers:k(()=>{let t=1;const r=[];let i=!1;for(const a of e.code)a===`
`?(i=!0,r.push(t++)):i=!1;return i||r.push(t++),r.join(`
`)}),cssVars:s?void 0:x,themeClass:g==null?void 0:g.themeClass,onRender:g==null?void 0:g.onRender}},render(){var e,n;const{mergedClsPrefix:l,wordWrap:c,mergedShowLineNumbers:s,onRender:u}=this;return u==null||u(),z("code",{class:[`${l}-code`,this.themeClass,c&&`${l}-code--word-wrap`,s&&`${l}-code--show-line-numbers`],style:this.cssVars,ref:"codeRef"},s?z("pre",{class:`${l}-code__line-numbers`},this.lineNumbers):null,(n=(e=this.$slots).default)===null||n===void 0?void 0:n.call(e))}}),me=W("copy",!0,function(e){return o("svg",{width:e.size,height:e.size,viewBox:"0 0 48 48",fill:"none"},[o("path",{d:"M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163",stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap,"stroke-linejoin":e.strokeLinejoin},null),o("path",{d:"M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z",fill:e.colors[1],stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linejoin":e.strokeLinejoin},null)])}),fe=W("stretching",!0,function(e){return o("svg",{width:e.size,height:e.size,viewBox:"0 0 48 48",fill:"none"},[o("g",{"clip-path":"url(#"+e.id+"44a4c228)"},[o("path",{d:"M23.0005 5.99951H8.00049C6.89592 5.99951 6.00049 6.89494 6.00049 7.99951V39.9999C6.00049 41.1044 6.89592 41.9998 8.00049 41.9998H40.0005C41.1051 41.9998 42.0005 41.1044 42.0005 39.9998V24.9998",stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap,"stroke-linejoin":e.strokeLinejoin},null),o("path",{d:"M24.001 15.9998V23.9998",stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap},null),o("path",{d:"M42 5.99951V13.9995",stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap},null),o("path",{d:"M32.001 23.9998H24.001",stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap},null),o("path",{d:"M42 5.99951L24 23.9995",stroke:e.colors[0],"stroke-width":e.strokeWidth},null),o("path",{d:"M42.0005 5.99951H34.0005",stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap},null)]),o("defs",null,[o("clipPath",{id:e.id+"44a4c228"},[o("rect",{width:"48",height:"48",fill:e.colors[2]},null)])])])}),ge={class:"el-header tools"},be=["lineMumber"],ve=H({__name:"CodeMessage",props:{extra:{},data:{},maxWidth:{}},setup(e){const n=e,{useMessage:l}=se(),c=n.extra.code.trim().split(`
`).length,s=N(!1),u=()=>{oe(n.extra.code,()=>{l.success("复制成功")})};return(d,m)=>{const $=G("n-icon");return X(),Y("section",{class:te(["im-message-code el-container is-vertical",{maxwidth:d.maxWidth,full:s.value}])},[v("header",ge,[v("p",null,"# "+p(d.extra.lang),1),v("p",null,[o($,{class:"icon",component:j(fe),onClick:m[0]||(m[0]=f=>s.value=!s.value)},null,8,["component"]),o($,{class:"icon",component:j(me),onClick:u},null,8,["component"])])]),v("main",{class:"el-main me-scrollbar me-scrollbar-thumb",lineMumber:j(c)},[o(j(de),{language:d.extra.lang,code:d.extra.code,"show-line-numbers":""},null,8,["language","code"]),ee(v("div",{class:"el-footer mask pointer",onClick:m[1]||(m[1]=f=>s.value=!s.value)}," 查看更多 ",512),[[ne,j(c)>20]])],8,be)],2)}}});const $e=le(ve,[["__scopeId","data-v-7fa46bd9"]]);export{$e as default};
