(this["webpackJsonpreact-adminv4"]=this["webpackJsonpreact-adminv4"]||[]).push([[8],{232:function(e,t,n){"use strict";n.r(t);var a=n(233),r=n.n(a),c=n(5),u=(n(22),n(26)),i=n(234),l=(n(68),n(35)),o=n(20),s=n(0),p=n.n(s),d=n(82),f=n(19),b=n(237),m=n(32),O=n(126),j=n(11),g=Object(f.a)({modal:function(e){return e.isEdit?"\u4fee\u6539\u7528\u6237":"\u6dfb\u52a0\u7528\u6237"}})((function(e){var t=Object(s.useState)({}),n=Object(o.a)(t,2),a=n[0],c=n[1],u=e.isEdit,d=e.id,f=e.onOk,b=l.default.useForm(),O=Object(o.a)(b,1)[0],g=Object(m.d)("/mock/users/:id"),h=Object(o.a)(g,2),v=h[0],E=h[1],k=Object(m.e)("/mock/users",{successTip:"\u6dfb\u52a0\u6210\u529f\uff01"}),x=Object(o.a)(k,2),y=x[0],w=x[1],S=Object(m.f)("/mock/users",{successTip:"\u6dfb\u52a0\u6210\u529f\uff01"}),C=Object(o.a)(S,2),N=C[0],F=C[1];function z(){return(z=Object(i.a)(r.a.mark((function e(){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!v){e.next=2;break}return e.abrupt("return");case 2:return console.log(d),e.next=5,E(d);case 5:t=e.sent,c(t||{}),O.setFieldsValue(t||{});case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function T(){return(T=Object(i.a)(r.a.mark((function e(t){var n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!y&&!N){e.next=2;break}return e.abrupt("return");case 2:return n=u?F:w,e.next=5,n(t);case 5:f&&f();case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}Object(s.useEffect)((function(){u&&function(){z.apply(this,arguments)}()}),[]);var P={labelWidth:100},I=v||y||N;return p.a.createElement(j.g,{loading:I,okText:"\u4fdd\u5b58",cancelText:"\u91cd\u7f6e",onOk:function(){return O.submit()},onCancel:function(){return O.resetFields()}},p.a.createElement(l.default,{form:O,onFinish:function(e){return T.apply(this,arguments)},initialValues:a},u?p.a.createElement(j.c,Object.assign({},P,{type:"hidden",name:"id"})):null,p.a.createElement(j.c,Object.assign({},P,{label:"\u7528\u6237\u540d",name:"name",required:!0,noSpace:!0})),p.a.createElement(j.c,Object.assign({},P,{type:"number",label:"\u5e74\u9f84",name:"age",required:!0})),p.a.createElement(j.c,Object.assign({},P,{type:"select",label:"\u5de5\u4f5c",name:"job",options:[{value:"1",label:"\u524d\u7aef\u5f00\u53d1"},{value:"2",label:"\u540e\u7aef\u5f00\u53d1"}]})),p.a.createElement(j.c,Object.assign({},P,{type:"select",label:"\u804c\u4f4d",name:"position",options:[{value:"1",label:"\u5458\u5de5"},{value:"2",label:"CEO"}]})),p.a.createElement(j.c,Object.assign({},P,{type:"select",mode:"multiple",showSearch:!0,optionFilterProp:"children",label:"\u89d2\u8272",name:"role",options:[{value:"1",label:"\u5458\u5de5"},{value:"2",label:"CEO"}]}))))}));t.default=Object(f.a)({path:"/hook/users",title:"\u7528\u6237\u7ba1\u7406(Hooks)"})((function(){var e=Object(s.useState)(1),t=Object(o.a)(e,2),n=t[0],a=t[1],f=Object(s.useState)(20),h=Object(o.a)(f,2),v=h[0],E=h[1],k=Object(s.useState)([]),x=Object(o.a)(k,2),y=x[0],w=x[1],S=Object(s.useState)([]),C=Object(o.a)(S,2),N=C[0],F=C[1],z=Object(s.useState)(0),T=Object(o.a)(z,2),P=T[0],I=T[1],V=Object(s.useState)(!1),q=Object(o.a)(V,2),J=q[0],K=q[1],H=Object(s.useState)(null),R=Object(o.a)(H,2),U=R[0],W=R[1],A=l.default.useForm(),B=Object(o.a)(A,1)[0],D=Object(m.d)("/mock/users"),G=Object(o.a)(D,2),L=G[0],M=G[1],Q=O.default.deleteUsers(),X=Object(o.a)(Q,2),Y=X[0],Z=X[1],$=Object(m.c)("/mock/users/:id",{successTip:"\u5220\u9664\u6210\u529f\uff01",errorTip:"\u5220\u9664\u5931\u8d25\uff01"}),_=Object(o.a)($,2),ee=_[0],te=_[1],ne=[{title:"\u7528\u6237\u540d",dataIndex:"name",width:200},{title:"\u5e74\u9f84",dataIndex:"age",width:200},{title:"\u5de5\u4f5c",dataIndex:"job",width:200},{title:"\u804c\u4f4d",dataIndex:"position",width:200},{title:"\u64cd\u4f5c",dataIndex:"operator",width:100,render:function(e,t){var n=t.id,a=t.name,r=[{label:"\u7f16\u8f91",onClick:function(){return K(!0)||W(n)}},{label:"\u5220\u9664",color:"red",confirm:{title:'\u60a8\u786e\u5b9a\u5220\u9664"'.concat(a,'"?'),onConfirm:function(){return function(e){return ce.apply(this,arguments)}(n)}}}];return p.a.createElement(j.h,{items:r})}}];function ae(){return re.apply(this,arguments)}function re(){return(re=Object(i.a)(r.a.mark((function e(){var t,u,i,l,o=arguments;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=o.length>0&&void 0!==o[0]?o[0]:{},!L){e.next=3;break}return e.abrupt("return");case 3:return u=B.getFieldsValue(),(i=Object(c.a)({},u)).pageNum=t.pageNum||n,i.pageSize=t.pageSize||v,console.log("params:",i),e.next=10,M(i);case 10:l=e.sent,console.log("res:",l),w((null===l||void 0===l?void 0:l.list)||[]),I((null===l||void 0===l?void 0:l.total)||0),a(i.pageNum),E(i.pageSize);case 16:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ce(){return(ce=Object(i.a)(r.a.mark((function e(t){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!ee){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,te(t);case 4:return e.next=6,ae();case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ue(){return(ue=Object(i.a)(r.a.mark((function e(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!Y){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,Object(b.a)(N.length);case 4:return e.next=6,Z({ids:N});case 6:return F([]),e.next=9,ae();case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}Object(s.useEffect)((function(){ae()}),[]);var ie={width:200},le=L||Y||ee,oe=!(null===N||void 0===N?void 0:N.length)||le;return console.log("render"),p.a.createElement(d.a,{loading:le},p.a.createElement(j.j,null,p.a.createElement(l.default,{form:B,onFinish:function(){return ae({pageNum:1})}},p.a.createElement(j.d,null,p.a.createElement(j.c,Object.assign({},ie,{label:"\u540d\u79f0",name:"name"})),p.a.createElement(j.c,Object.assign({},ie,{allowClear:!0,type:"select",label:"\u804c\u4f4d",name:"job",onChange:function(){return ae({pageNum:1})},options:[{value:1,label:1},{value:2,label:2}]})),p.a.createElement(j.c,{layout:!0},p.a.createElement(u.default,{type:"primary",htmlType:"submit"},"\u63d0\u4ea4"),p.a.createElement(u.default,{onClick:function(){return B.resetFields()}},"\u91cd\u7f6e"),p.a.createElement(u.default,{type:"primary",onClick:function(){return K(!0)||W(null)}},"\u6dfb\u52a0"),p.a.createElement(u.default,{danger:!0,disabled:oe,onClick:function(){return ue.apply(this,arguments)}},"\u5220\u9664"))))),p.a.createElement(j.k,{rowSelection:{selectedRowKeys:N,onChange:F},columns:ne,dataSource:y,rowKey:"id",serialNumber:!0,pageNum:n,pageSize:v}),p.a.createElement(j.i,{total:P,pageNum:n,pageSize:v,onPageNumChange:function(e){return ae({pageNum:e})},onPageSizeChange:function(e){return ae({pageNum:1,pageSize:e})}}),p.a.createElement(g,{visible:J,id:U,isEdit:null!==U,onOk:function(){return K(!1)||ae({pageNum:1})},onCancel:function(){return K(!1)}}))}))},233:function(e,t,n){e.exports=n(235)},234:function(e,t,n){"use strict";function a(e,t,n,a,r,c,u){try{var i=e[c](u),l=i.value}catch(o){return void n(o)}i.done?t(l):Promise.resolve(l).then(a,r)}function r(e){return function(){var t=this,n=arguments;return new Promise((function(r,c){var u=e.apply(t,n);function i(e){a(u,r,c,i,l,"next",e)}function l(e){a(u,r,c,i,l,"throw",e)}i(void 0)}))}}n.d(t,"a",(function(){return r}))},235:function(e,t,n){e.exports=n(6)(653)},237:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));n(119);var a=n(83),r=n(0),c=n.n(r),u=n(7);function i(e){var t=c.a.createElement("div",null,"\u60a8\u786e\u5b9a\u5220\u9664",c.a.createElement("span",{style:{padding:"0 5px",color:"red",fontSize:18}},e),"\u6761\u8bb0\u5f55\u5417\uff1f");return new Promise((function(e,n){a.default.confirm({title:"\u6e29\u99a8\u63d0\u793a",content:t,icon:c.a.createElement(u.ExclamationCircleOutlined,null),okType:"danger",onOk:function(){return e(!0)},onCancel:function(){return n("user cancel confirm")}})}))}}}]);
//# sourceMappingURL=8.f7c0e9a6.chunk.js.map