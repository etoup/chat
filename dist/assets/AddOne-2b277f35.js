import{ak as N,dS as V,dT as u,dg as f,J as x,K as i,L as y,bj as F,M as K,t as U,R as Z,Q as $,U as D,p as W,_ as J,Z as c,a1 as Q,r as X,y as s,aP as q,aS as G,a5 as Y,a2 as ee,ai as oe,N as re,dU as ne,dV as te,dW as se,dX as le,br as ie,bs as S}from"./index-8d305a84.js";function ae(e){const{lineHeight:o,borderRadius:d,fontWeightStrong:b,baseColor:l,dividerColor:C,actionColor:P,textColor1:h,textColor2:t,closeColorHover:g,closeColorPressed:v,closeIconColor:m,closeIconColorHover:I,closeIconColorPressed:n,infoColor:r,successColor:p,warningColor:z,errorColor:k,fontSize:T}=e;return Object.assign(Object.assign({},V),{fontSize:T,lineHeight:o,titleFontWeight:b,borderRadius:d,border:`1px solid ${C}`,color:P,titleTextColor:h,iconColor:t,contentTextColor:t,closeBorderRadius:d,closeColorHover:g,closeColorPressed:v,closeIconColor:m,closeIconColorHover:I,closeIconColorPressed:n,borderInfo:`1px solid ${u(l,f(r,{alpha:.25}))}`,colorInfo:u(l,f(r,{alpha:.08})),titleTextColorInfo:h,iconColorInfo:r,contentTextColorInfo:t,closeColorHoverInfo:g,closeColorPressedInfo:v,closeIconColorInfo:m,closeIconColorHoverInfo:I,closeIconColorPressedInfo:n,borderSuccess:`1px solid ${u(l,f(p,{alpha:.25}))}`,colorSuccess:u(l,f(p,{alpha:.08})),titleTextColorSuccess:h,iconColorSuccess:p,contentTextColorSuccess:t,closeColorHoverSuccess:g,closeColorPressedSuccess:v,closeIconColorSuccess:m,closeIconColorHoverSuccess:I,closeIconColorPressedSuccess:n,borderWarning:`1px solid ${u(l,f(z,{alpha:.33}))}`,colorWarning:u(l,f(z,{alpha:.08})),titleTextColorWarning:h,iconColorWarning:z,contentTextColorWarning:t,closeColorHoverWarning:g,closeColorPressedWarning:v,closeIconColorWarning:m,closeIconColorHoverWarning:I,closeIconColorPressedWarning:n,borderError:`1px solid ${u(l,f(k,{alpha:.25}))}`,colorError:u(l,f(k,{alpha:.08})),titleTextColorError:h,iconColorError:k,contentTextColorError:t,closeColorHoverError:g,closeColorPressedError:v,closeIconColorError:m,closeIconColorHoverError:I,closeIconColorPressedError:n})}const ce={name:"Alert",common:N,self:ae},de=ce,he=x("alert",`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[i("border",`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),y("closable",[x("alert-body",[i("title",`
 padding-right: 24px;
 `)])]),i("icon",{color:"var(--n-icon-color)"}),x("alert-body",{padding:"var(--n-padding)"},[i("title",{color:"var(--n-title-text-color)"}),i("content",{color:"var(--n-content-text-color)"})]),F({originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.9)"}}),i("icon",`
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `),i("close",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),y("show-icon",[x("alert-body",{paddingLeft:"calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))"})]),y("right-adjust",[x("alert-body",{paddingRight:"calc(var(--n-close-size) + var(--n-padding) + 2px)"})]),x("alert-body",`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[i("title",`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[K("& +",[i("content",{marginTop:"9px"})])]),i("content",{transition:"color .3s var(--n-bezier)",fontSize:"var(--n-font-size)"})]),i("icon",{transition:"color .3s var(--n-bezier)"})]),ge=Object.assign(Object.assign({},$.props),{title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:"default"},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function}),fe=U({name:"Alert",inheritAttrs:!1,props:ge,slots:Object,setup(e){const{mergedClsPrefixRef:o,mergedBorderedRef:d,inlineThemeDisabled:b,mergedRtlRef:l}=Z(e),C=$("Alert","-alert",he,de,e,o),P=D("Alert",l,o),h=W(()=>{const{common:{cubicBezierEaseInOut:n},self:r}=C.value,{fontSize:p,borderRadius:z,titleFontWeight:k,lineHeight:T,iconSize:w,iconMargin:R,iconMarginRtl:E,closeIconSize:H,closeBorderRadius:L,closeSize:A,closeMargin:j,closeMarginRtl:B,padding:_}=r,{type:a}=e,{left:M,right:O}=J(R);return{"--n-bezier":n,"--n-color":r[c("color",a)],"--n-close-icon-size":H,"--n-close-border-radius":L,"--n-close-color-hover":r[c("closeColorHover",a)],"--n-close-color-pressed":r[c("closeColorPressed",a)],"--n-close-icon-color":r[c("closeIconColor",a)],"--n-close-icon-color-hover":r[c("closeIconColorHover",a)],"--n-close-icon-color-pressed":r[c("closeIconColorPressed",a)],"--n-icon-color":r[c("iconColor",a)],"--n-border":r[c("border",a)],"--n-title-text-color":r[c("titleTextColor",a)],"--n-content-text-color":r[c("contentTextColor",a)],"--n-line-height":T,"--n-border-radius":z,"--n-font-size":p,"--n-title-font-weight":k,"--n-icon-size":w,"--n-icon-margin":R,"--n-icon-margin-rtl":E,"--n-close-size":A,"--n-close-margin":j,"--n-close-margin-rtl":B,"--n-padding":_,"--n-icon-margin-left":M,"--n-icon-margin-right":O}}),t=b?Q("alert",W(()=>e.type[0]),h,e):void 0,g=X(!0),v=()=>{const{onAfterLeave:n,onAfterHide:r}=e;n&&n(),r&&r()};return{rtlEnabled:P,mergedClsPrefix:o,mergedBordered:d,visible:g,handleCloseClick:()=>{var n;Promise.resolve((n=e.onClose)===null||n===void 0?void 0:n.call(e)).then(r=>{r!==!1&&(g.value=!1)})},handleAfterLeave:()=>{v()},mergedTheme:C,cssVars:b?void 0:h,themeClass:t==null?void 0:t.themeClass,onRender:t==null?void 0:t.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),s(oe,{onAfterLeave:this.handleAfterLeave},{default:()=>{const{mergedClsPrefix:o,$slots:d}=this,b={class:[`${o}-alert`,this.themeClass,this.closable&&`${o}-alert--closable`,this.showIcon&&`${o}-alert--show-icon`,!this.title&&this.closable&&`${o}-alert--right-adjust`,this.rtlEnabled&&`${o}-alert--rtl`],style:this.cssVars,role:"alert"};return this.visible?s("div",Object.assign({},q(this.$attrs,b)),this.closable&&s(G,{clsPrefix:o,class:`${o}-alert__close`,onClick:this.handleCloseClick}),this.bordered&&s("div",{class:`${o}-alert__border`}),this.showIcon&&s("div",{class:`${o}-alert__icon`,"aria-hidden":"true"},Y(d.icon,()=>[s(re,{clsPrefix:o},{default:()=>{switch(this.type){case"success":return s(le,null);case"info":return s(se,null);case"warning":return s(te,null);case"error":return s(ne,null);default:return null}}})])),s("div",{class:[`${o}-alert-body`,this.mergedBordered&&`${o}-alert-body--bordered`]},ee(d.header,l=>{const C=l||this.title;return C?s("div",{class:`${o}-alert-body__title`},C):null}),d.default&&s("div",{class:`${o}-alert-body__content`},d))):null}})}}),Ce=ie("add-one",!1,function(e){return S("svg",{width:e.size,height:e.size,viewBox:"0 0 48 48",fill:"none"},[S("path",{d:"M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z",fill:e.colors[1],stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linejoin":e.strokeLinejoin},null),S("path",{d:"M24 16V32",stroke:e.colors[2],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap,"stroke-linejoin":e.strokeLinejoin},null),S("path",{d:"M16 24L32 24",stroke:e.colors[2],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap,"stroke-linejoin":e.strokeLinejoin},null)])});export{Ce as A,fe as N};
