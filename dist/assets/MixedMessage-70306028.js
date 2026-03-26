import{t as f}from"./emojis-0ead063f.js";import{t as g}from"./strings-8042df5b.js";import{g as u}from"./functions-9be2054c.js";import{u as b,bQ as s,bR as r,bS as d,c2 as n,ah as i,b$ as y,bT as o,ea as M,bz as k,bY as v,bU as w,bZ as N}from"./index-17a65d64.js";import{a as h}from"./Image-6e872bad.js";const I=["innerHTML"],L=b({__name:"MixedMessage",props:{extra:{},data:{},maxWidth:{}},setup(l){const p=l.data.float,m=(a,e=200)=>{const t=u(a);if(t.width==0||t.height==0)return{};if(t.width<e)return{width:`${t.width}px`,height:`${t.height}px`};let x=t.height/(t.width/e);return{width:e+"px",height:x+"px"}};return(a,e)=>(s(),r("div",{class:w(["im-message-mixed",{left:o(p)=="left",right:o(p)=="right",maxwidth:a.maxWidth}])},[d("pre",null,[e[8]||(e[8]=n("      ")),(s(!0),r(i,null,y(a.extra.items,t=>(s(),r(i,{key:t.id},[e[6]||(e[6]=n(`
   
        `)),t.type===1?(s(),r(i,{key:0},[e[0]||(e[0]=n(`
               `)),d("span",{innerHTML:o(f)(o(g)(t.content))},null,8,I),e[1]||(e[1]=n(`
        `))],64)):t.type===3?(s(),r(i,{key:1},[e[4]||(e[4]=n(`
          `)),d("div",{style:M([m(t.content,300),{display:"flex",margin:"5px 0","border-radius":"8px",overflow:"hidden"}])},[e[2]||(e[2]=n(`
            `)),k(o(h),{src:t.content},null,8,["src"]),e[3]||(e[3]=n(`
          `))],4),e[5]||(e[5]=n(`
        `))],64)):v("",!0),e[7]||(e[7]=n(`
      `))],64))),128)),e[9]||(e[9]=n(`
    `))])],2))}});const $=N(L,[["__scopeId","data-v-90737924"]]);export{$ as default};
