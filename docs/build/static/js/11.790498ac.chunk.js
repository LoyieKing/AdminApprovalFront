(this["webpackJsonpreact-adminv4"]=this["webpackJsonpreact-adminv4"]||[]).push([[11],{106:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return y}));var a,i,l=n(47),r=n(108),o=n(12),u=n.n(o),s=n(11),c=n(109),d=n(14),m=n(15),p=n(17),f=n(16),b=n(0),h=n.n(b),g=n(4),v=n(10),S=Object(v.a)({ajax:!0,modal:{title:function(e){return e.isEdit?"\u4fee\u6539\u7528\u6237":"\u6dfb\u52a0\u7528\u6237"}}})(a=function(e){Object(p.a)(n,e);var t=Object(f.a)(n);function n(){var e;Object(d.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).state={loading:!1,data:{}},e.fetchData=function(){if(!e.state.loading){var t=e.props.id;e.setState({loading:!0}),e.props.ajax.get("/mock/users/".concat(t)).then((function(t){e.setState({data:t}),e.form.setFieldsValue(t)})).finally((function(){return e.setState({loading:!1})}))}},e.handleSubmit=function(t){if(!e.state.loading){var n=e.props.isEdit,a=n?e.props.ajax.put:e.props.ajax.post,i=n?"\u4fee\u6539\u6210\u529f\uff01":"\u6dfb\u52a0\u6210\u529f\uff01";e.setState({loading:!0}),a("/mock/users",t,{successTip:i}).then((function(){var t=e.props.onOk;t&&t()})).finally((function(){return e.setState({loading:!1})}))}},e}return Object(m.a)(n,[{key:"componentDidMount",value:function(){this.props.isEdit&&this.fetchData()}},{key:"render",value:function(){var e=this,t=this.props.isEdit,n=this.state,a=n.loading,i=n.data,r={labelWidth:100};return h.a.createElement(g.i,{loading:a,okText:"\u4fdd\u5b58",cancelText:"\u91cd\u7f6e",onOk:function(){return e.form.submit()},onCancel:function(){return e.form.resetFields()}},h.a.createElement(l.default,{ref:function(t){return e.form=t},onFinish:this.handleSubmit,initialValues:i},t?h.a.createElement(g.a,Object.assign({},r,{type:"hidden",name:"id"})):null,h.a.createElement(g.a,Object.assign({},r,{label:"\u7528\u6237\u540d",name:"name",required:!0,noSpace:!0})),h.a.createElement(g.a,Object.assign({},r,{type:"number",label:"\u5e74\u9f84",name:"age",required:!0})),h.a.createElement(g.a,Object.assign({},r,{type:"select",label:"\u5de5\u4f5c",name:"job",options:[{value:0,label:"\u4ea7\u54c1\u7ecf\u7406"},{value:1,label:"\u524d\u7aef\u5f00\u53d1"},{value:2,label:"\u540e\u7aef\u5f00\u53d1"}]})),h.a.createElement(g.a,Object.assign({},r,{type:"select",label:"\u804c\u4f4d",name:"position",options:[{value:"1",label:"\u5458\u5de5"},{value:"2",label:"CEO"}]})),h.a.createElement(g.a,Object.assign({},r,{type:"select",mode:"multiple",showSearch:!0,optionFilterProp:"children",label:"\u89d2\u8272",name:"role",options:[{value:"1",label:"\u5458\u5de5"},{value:"2",label:"CEO"}]}))))}}]),n}(b.Component))||a,y=Object(v.a)({path:"/users",ajax:!0})(i=function(e){Object(p.a)(n,e);var t=Object(f.a)(n);function n(){var e;Object(d.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).state={loading:!1,dataSource:[],selectedRowKeys:[],total:0,pageNum:1,pageSize:20,deleting:!1,visible:!1,id:null},e.columns=[{title:"\u7528\u6237\u540d",dataIndex:"name",width:200},{title:"\u5e74\u9f84",dataIndex:"age",width:200},{title:"\u5de5\u4f5c",dataIndex:"job",width:200},{title:"\u804c\u4f4d",dataIndex:"position",width:200},{title:"\u64cd\u4f5c",dataIndex:"operator",width:140,render:function(t,n){var a=n.id,i=n.name,l=[{label:"\u8be6\u60c5",onClick:function(){return e.props.history.push("/users/detail/".concat(a))}},{label:"\u7f16\u8f91",onClick:function(){return e.setState({visible:!0,id:a})}},{label:"\u5220\u9664",color:"red",confirm:{title:'\u60a8\u786e\u5b9a\u5220\u9664"'.concat(i,'"?'),onConfirm:function(){return e.handleDelete(a)}}}];return h.a.createElement(g.j,{items:l})}}],e.handleSubmit=Object(c.a)(u.a.mark((function t(){var n,a,i,l,r;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e.state.loading){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,e.form.validateFields();case 4:n=t.sent,a=e.state,i=a.pageNum,l=a.pageSize,r=Object(s.a)(Object(s.a)({},n),{},{pageNum:i,pageSize:l}),e.setState({loading:!0}),e.props.ajax.get("/mock/users",r).then((function(t){var n=(null===t||void 0===t?void 0:t.list)||[],a=(null===t||void 0===t?void 0:t.total)||0;e.setState({dataSource:n,total:a})})).finally((function(){return e.setState({loading:!1})}));case 9:case"end":return t.stop()}}),t)}))),e.handleDelete=function(t){e.state.deleting||(e.setState({deleting:!0}),e.props.ajax.del("/mock/users/".concat(t),null,{successTip:"\u5220\u9664\u6210\u529f\uff01",errorTip:"\u5220\u9664\u5931\u8d25\uff01"}).then((function(){return e.handleSubmit()})).finally((function(){return e.setState({deleting:!1})})))},e.handleBatchDelete=function(){if(!e.state.deleting){var t=e.state.selectedRowKeys;Object(g.s)(t.length).then((function(){e.setState({deleting:!0}),e.props.ajax.del("/mock/users",{ids:t},{successTip:"\u5220\u9664\u6210\u529f\uff01",errorTip:"\u5220\u9664\u5931\u8d25\uff01"}).then((function(){e.setState({selectedRowKeys:[]}),e.handleSubmit()})).finally((function(){return e.setState({deleting:!1})}))}))}},e}return Object(m.a)(n,[{key:"componentDidMount",value:function(){this.handleSubmit()}},{key:"render",value:function(){var e=this,t=this.state,n=t.loading,a=t.deleting,i=t.dataSource,o=t.selectedRowKeys,u=t.total,s=t.pageNum,c=t.pageSize,d=t.visible,m=t.id;console.log("users render");var p={width:200},f=!(null!==o&&void 0!==o&&o.length);return h.a.createElement(g.l,null,h.a.createElement(g.o,null,h.a.createElement(l.default,{onFinish:function(){return e.setState({pageNum:1},(function(){return e.handleSubmit()}))},ref:function(t){return e.form=t}},h.a.createElement(g.b,null,h.a.createElement(g.a,Object.assign({},p,{label:"\u540d\u79f0",name:"name"})),h.a.createElement(g.a,Object.assign({},p,{type:"select",label:"\u804c\u4f4d",name:"job",options:[{value:1,label:1},{value:2,label:2}]})),h.a.createElement(g.a,{layout:!0},h.a.createElement(r.default,{type:"primary",htmlType:"submit"},"\u67e5\u8be2"),h.a.createElement(r.default,{onClick:function(){return e.form.resetFields()}},"\u91cd\u7f6e"),h.a.createElement(r.default,{type:"primary",onClick:function(){return e.setState({visible:!0,id:null})}},"\u6dfb\u52a0"),h.a.createElement(r.default,{danger:!0,loading:a,disabled:f,onClick:this.handleBatchDelete},"\u5220\u9664"))))),h.a.createElement(g.p,{rowSelection:{selectedRowKeys:o,onChange:function(t){return e.setState({selectedRowKeys:t})}},loading:n,columns:this.columns,dataSource:i,rowKey:"id",serialNumber:!0,pageNum:s,pageSize:c}),h.a.createElement(g.n,{total:u,pageNum:s,pageSize:c,onPageNumChange:function(t){return e.setState({pageNum:t},(function(){return e.handleSubmit()}))},onPageSizeChange:function(t){return e.setState({pageSize:t,pageNum:1},(function(){return e.handleSubmit()}))}}),h.a.createElement(S,{visible:d,id:m,isEdit:null!==m,onOk:function(){return e.setState({visible:!1},(function(){return e.handleSubmit()}))},onCancel:function(){return e.setState({visible:!1})}}))}}]),n}(b.Component))||i},108:function(e,t,n){e.exports=n(5)(59)},109:function(e,t,n){"use strict";function a(e,t,n,a,i,l,r){try{var o=e[l](r),u=o.value}catch(s){return void n(s)}o.done?t(u):Promise.resolve(u).then(a,i)}function i(e){return function(){var t=this,n=arguments;return new Promise((function(i,l){var r=e.apply(t,n);function o(e){a(r,i,l,o,u,"next",e)}function u(e){a(r,i,l,o,u,"throw",e)}o(void 0)}))}}n.d(t,"a",(function(){return i}))}}]);
//# sourceMappingURL=11.790498ac.chunk.js.map