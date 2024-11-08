(this["webpackJsonpcloudreve-frontend"]=this["webpackJsonpcloudreve-frontend"]||[]).push([[12],{7074:function(e,a,t){"use strict";t.r(a),t.d(a,"default",(function(){return P}));var n=t(6),l=t(10),c=t(9),r=t(0),o=t.n(r),i=t(95),m=t(46),s=t(480),u=t(481),d=t(484),g=t(255),p=t(482),f=t(473),b=t(91),E=t(5),h=t(12),v=t(7037),O=t(7156),N=t(7138),x=t(7048),C=t(54),j=t(7035),y=t(7165),T=t(7151),S=t(30),k=t(2),D=t(100),F=t(293),H=Object(i.a)((function(e){return{contentFix:{padding:"10px 24px 0px 24px"},wrapper:{margin:e.spacing(1),position:"relative"},buttonProgress:{color:e.palette.secondary.light,position:"absolute",top:"50%",left:"50%",marginTop:-12,marginLeft:-12},content:{padding:0,marginTop:0},marginTop:{marginTop:e.spacing(2),display:"block"},textField:{marginTop:e.spacing(1)},scroll:{overflowX:"auto"},dialogContent:{marginTop:e.spacing(2)},pathSelect:{marginTop:e.spacing(2),display:"flex"}}})),w={Circle:o.a.createElement(S.e,null),CircleOutline:o.a.createElement(S.f,null),Heart:o.a.createElement(S.q,null),HeartOutline:o.a.createElement(S.r,null),Hexagon:o.a.createElement(S.s,null),HexagonOutline:o.a.createElement(S.t,null),Hexagram:o.a.createElement(S.u,null),HexagramOutline:o.a.createElement(S.v,null),Rhombus:o.a.createElement(S.I,null),RhombusOutline:o.a.createElement(S.J,null),Square:o.a.createElement(S.L,null),SquareOutline:o.a.createElement(S.M,null),Triangle:o.a.createElement(S.O,null)};function P(e){var a=Object(m.a)(),t=Object(D.a)().t,i=o.a.useState(0),P=Object(c.a)(i,2),W=P[0],L=P[1],q=o.a.useState(!1),z=Object(c.a)(q,2),J=z[0],R=z[1],I=o.a.useState("Circle"),K=Object(c.a)(I,2),M=K[0],X=K[1],A=o.a.useState(a.palette.text.secondary),B=Object(c.a)(A,2),G=B[0],Q=B[1],U=o.a.useState({filename:"",tagName:"",path:"/"}),V=Object(c.a)(U,2),Y=V[0],Z=V[1],$=o.a.useState(!1),_=Object(c.a)($,2),ee=_[0],ae=_[1],te=Object(r.useState)(""),ne=Object(c.a)(te,2),le=ne[0],ce=ne[1],re=Object(r.useState)(""),oe=Object(c.a)(re,2),ie=(oe[0],oe[1]),me=function(e){return function(a){Z(Object(l.a)(Object(l.a)({},Y),{},Object(n.a)({},e,a.target.value)))}},se=Object(E.d)(),ue=Object(r.useCallback)((function(e,a,t,n){return se(Object(k.S)(e,a,t,n))}),[se]),de=H();return o.a.createElement(s.a,{open:e.open,onClose:e.onClose,"aria-labelledby":"form-dialog-title",fullWidth:!0},o.a.createElement(s.a,{open:ee,onClose:function(){return ae(!1)},"aria-labelledby":"form-dialog-title"},o.a.createElement(u.a,{id:"form-dialog-title"},t("navbar.addTagDialog.selectFolder")),o.a.createElement(b.a,{presentPath:"/",selected:[],onSelect:function(e){var a="/"===e.path?e.path+e.name:e.path+"/"+e.name;ce(a),ie(e.name)}}),o.a.createElement(d.a,null,o.a.createElement(g.a,{onClick:function(){return ae(!1)}},t("common:cancel")),o.a.createElement(g.a,{onClick:function(){Z(Object(l.a)(Object(l.a)({},Y),{},{path:"//"===le?"/":le})),ae(!1)},color:"primary",disabled:""===le},t("common:ok")))),o.a.createElement(v.a,{position:"static"},o.a.createElement(O.a,{value:W,onChange:function(e,a){L(a)},variant:"fullWidth","aria-label":"full width tabs example"},o.a.createElement(N.a,{label:t("navbar.addTagDialog.fileSelector")}),o.a.createElement(N.a,{label:t("navbar.addTagDialog.folderLink")}))),0===W&&o.a.createElement(p.a,{className:de.dialogContent},o.a.createElement(x.a,{label:t("navbar.addTagDialog.tagName"),id:"filled-name",value:Y.tagName,onChange:me("tagName"),fullWidth:!0,className:de.textField}),o.a.createElement(x.a,{id:"filled-name",label:t("navbar.addTagDialog.matchPattern"),value:Y.filename,onChange:me("filename"),fullWidth:!0,multiline:!0,className:de.textField}),o.a.createElement(C.a,{variant:"caption",color:"textSecondary"},o.a.createElement(F.a,{i18nKey:"navbar.addTagDialog.matchPatternDescription"},[o.a.createElement("code",{key:0}),o.a.createElement("code",{key:1})])),o.a.createElement(j.a,{className:de.marginTop},t("navbar.addTagDialog.icon")),o.a.createElement("div",{className:de.scroll},o.a.createElement(y.a,{size:"small",value:M,exclusive:!0,onChange:function(e,a){a&&X(a)},className:de.textField},Object.keys(w).map((function(e,a){return o.a.createElement(T.a,{key:a,value:e},w[e])})))),o.a.createElement(j.a,{className:de.marginTop},t("navbar.addTagDialog.color")),o.a.createElement("div",{className:de.scroll},o.a.createElement(y.a,{size:"small",value:G,exclusive:!0,onChange:function(e,a){a&&Q(a)},className:de.textField},[a.palette.text.secondary,"#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b"].map((function(e,a){return o.a.createElement(T.a,{key:a,value:e},o.a.createElement(S.e,{style:{color:e}}))}))))),1===W&&o.a.createElement(p.a,{className:de.dialogContent},o.a.createElement(x.a,{label:t("navbar.addTagDialog.tagName"),id:"filled-name",value:Y.tagName,onChange:me("tagName"),fullWidth:!0,className:de.textField}),o.a.createElement("div",{className:de.pathSelect},o.a.createElement(x.a,{label:t("navbar.addTagDialog.folderPath"),id:"filled-name",value:Y.path,onChange:me("path"),fullWidth:!0,className:de.textField}),o.a.createElement(g.a,{onClick:function(){return ae(!0)},style:{marginLeft:a.spacing(1),alignSelf:"flex-end"},color:"primary",variant:"outlined"},t("common:select")))),o.a.createElement(d.a,null,o.a.createElement(g.a,{onClick:e.onClose},t("common:cancel")),o.a.createElement("div",{className:de.wrapper},o.a.createElement(g.a,{onClick:function(){0===W?(R(!0),h.c.post("/tag/filter",{expression:Y.filename,name:Y.tagName,color:G,icon:M}).then((function(a){R(!1),e.onClose(),e.onSuccess({type:0,name:Y.tagName,color:G,icon:M,id:a.data})})).catch((function(e){ue("top","right",e.message,"error")})).then((function(){R(!1)}))):(R(!0),h.c.post("/tag/link",{path:Y.path,name:Y.tagName}).then((function(t){R(!1),e.onClose(),e.onSuccess({type:1,name:Y.tagName,expression:Y.path,color:a.palette.text.secondary,icon:"FolderHeartOutline",id:t.data})})).catch((function(e){ue("top","right",e.message,"error")})).then((function(){R(!1)})))},color:"primary",disabled:J||0===W&&(""===Y.filename||""===Y.tagName)||1===W&&(""===Y.tagName||""===Y.path)},t("common:ok"),J&&o.a.createElement(f.a,{size:24,className:de.buttonProgress})))))}}}]);
//# sourceMappingURL=12.a292d8e1.chunk.js.map