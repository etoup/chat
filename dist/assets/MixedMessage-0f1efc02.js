import{t as f}from"./emojis-0ead063f.js";import{t as g}from"./strings-8042df5b.js";import{g as u}from"./functions-9be2054c.js";import{t as b,bI as s,bJ as r,bK as d,bW as n,ae as a,bT as y,bL as o,d$ as M,bs as k,bQ as v,bM as w,bR as I}from"./index-8d305a84.js";import{a as L}from"./Image-503320aa.js";const N=["innerHTML"],T=b({__name:"MixedMessage",props:{extra:{},data:{},maxWidth:{}},setup(l){const p=l.data.float,m=(i,e=200)=>{const t=u(i);if(t.width==0||t.height==0)return{};if(t.width<e)return{width:`${t.width}px`,height:`${t.height}px`};let x=t.height/(t.width/e);return{width:e+"px",height:x+"px"}};return(i,e)=>(s(),r("div",{class:w(["im-message-mixed",{left:o(p)=="left",right:o(p)=="right",maxwidth:i.maxWidth}])},[d("pre",null,[e[8]||(e[8]=n("      ")),(s(!0),r(a,null,y(i.extra.items,t=>(s(),r(a,{key:t.id},[e[6]||(e[6]=n(`
   
        `)),t.type===1?(s(),r(a,{key:0},[e[0]||(e[0]=n(`
               `)),d("span",{innerHTML:o(f)(o(g)(t.content))},null,8,N),e[1]||(e[1]=n(`
        `))],64)):t.type===3?(s(),r(a,{key:1},[e[4]||(e[4]=n(`
          `)),d("div",{style:M([m(t.content,300),{display:"flex",margin:"5px 0","border-radius":"8px",overflow:"hidden"}])},[e[2]||(e[2]=n(`
            `)),k(o(L),{src:t.content},null,8,["src"]),e[3]||(e[3]=n(`
          `))],4),e[5]||(e[5]=n(`
        `))],64)):v("",!0),e[7]||(e[7]=n(`
      `))],64))),128)),e[9]||(e[9]=n(`
    `))])],2))}});const $=I(T,[["__scopeId","data-v-90737924"]]);export{$ as default};
