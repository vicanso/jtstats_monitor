(function(){define("chart",["jquery","underscore","echarts","moment","stats"],function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;p=a("underscore"),c=a("jquery"),j=a("echarts"),n=a("moment"),f=86400,g={tooltip:{trigger:"axis"},calculable:!0,toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0},magicType:{show:!0,type:["line","bar"]},restore:{show:!0},saveAsImage:{show:!0}}},yAxis:[{type:"value"}],animation:!1},h={tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0},restore:{show:!0},saveAsImage:{show:!0}},calculable:!0}},o=function(a){return p.reduce(a,function(a,b){return a+b},0)},d=function(a){var b;return b=o(a),Math.round(b/a.length)},m=function(a){var b,c;return c=p.map(a,function(a){return p.pluck(a.values,"t")}),b=c.shift(),p.each(c,function(a){return p.each(a,function(a){var c;return c=p.sortedIndex(b,a),b[c]!==a?b.splice(c,0,a):void 0})}),b},e=function(a,b){var c,d,e,f,g;for(e=p.pluck(a,"values"),d=[],c=f=0,g=e.length;g>=0?g>f:f>g;c=g>=0?++f:--f)d.push([]);return p.each(b,function(a){return p.each(e,function(b,c){var e,f;return(null!=(f=b[0])?f.t:void 0)===a?(e=b.shift(),d[c].push(e.v)):d[c].push(0)})}),d},k=function(a,b){var c;return c="YYYY-MM-DD HH:mm:ss",b&&(b%f===0?c="YYYY-MM-DD":b%3600===0?c="YYYY-MM-DD HH":b%60===0&&(c="YYYY-MM-DD HH:mm")),p.map(a,function(a){return n(1e3*a).format(c)})},l=function(a){var b;return b=50,a>b?{show:!0,realtime:!0,start:100-Math.floor(100*b/a),end:100}:null},b.line=function(a,b,c){var d,f,h,n,o;if(null!=b?b.length:void 0)return n=m(b),o=e(b,n),n=k(n,null!=c?c.interval:void 0),h=p.map(b,function(a,b){return{name:a.key,type:a.chart,data:o[b]}}),d=p.extend({},g,{legend:{data:p.pluck(b,"key")},dataZoom:l(n.length),xAxis:[{type:"category",boundaryGap:!1,data:n}],series:h},c),f=j.init(a,i),f.setOption(d,!0)},b.barVertical=b.line,b.stack=function(a,b,c){var d,f,h,n,o;if(null!=b?b.length:void 0)return n=m(b),o=e(b,n),n=k(n,null!=c?c.interval:void 0),h=p.map(b,function(a,b){return{name:a.key,type:a.chart,stack:"总量",data:o[b]}}),d=p.extend({},g,{legend:{data:p.pluck(b,"key")},dataZoom:l(n.length),xAxis:[{type:"category",boundaryGap:!1,data:n}],series:h},c),f=j.init(a,i),f.setOption(d,!0)},b.stackBarVertical=b.stack,b.barHorizontal=function(a,b,c,d){var f,h,n,o,q;return null==d&&(d=!1),(null!=b?b.length:void 0)?(o=m(b),q=e(b,o),o=k(o,null!=c?c.interval:void 0),n=p.map(b,function(a,b){var c;return c={name:a.key,type:a.chart,data:q[b]},d&&(c.stack="总量"),c}),f=p.extend({},g,{legend:{data:p.pluck(b,"key")},dataZoom:l(o.length),xAxis:[{type:"value",boundaryGap:[0,.01]}],yAxis:[{type:"category",data:o}],series:n},c),h=j.init(a,i),h.setOption(f,!0)):void 0},b.stackBarHorizontal=function(a,c,d){return b.barHorizontal(a,c,d,!0)},b.pie=function(a,b,c){var e,f;return b=p.map(b,function(a){var b,c;switch(c=p.pluck(a.values,"v"),a.type){case"counter":b=o(c);break;case"average":b=d(c);break;case"gauge":b=p.last(c)}return{name:a.key,value:b}}),c=p.extend({},h,{legend:{data:p.pluck(b,"name"),orient:"vertical",x:"left",y:"30px"},series:[{name:null!=c&&null!=(f=c.title)?f.text:void 0,type:"pie",data:b}],animation:!1},c),e=j.init(a,i),e.setOption(c,!0)},b.nestedPie=function(){},b.gauge=function(a,b,c){var d,e;return d=p.extend({toolbox:{show:!0,feature:{mark:{show:!0},restore:{show:!0},saveAsImage:{show:!0}}}},c),d.series=p.map(b,function(a){return{name:a.key,type:"gauge",detail:{formatter:"{value}"},data:[{value:a.values[0].v}]}}),e=j.init(a,i),e.setOption(d)},b.funnel=function(a,b,c){var e,f,g;return b=p.map(b,function(a){var b,c;switch(c=p.pluck(a.values,"v"),a.type){case"counter":b=o(c);break;case"average":b=d(c);break;case"gauge":b=p.last(c)}return{name:a.key,value:b}}),f=0,p.each(b,function(a){a.value>f&&(f=a.value)}),p.each(b,function(a){a.value=Math.floor(100*a.value/f)}),console.dir(b),e=p.extend({title:c.title,tooltip:{trigger:"item",formatter:"{b} : {c}%"},toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0,readOnly:!1},restore:{show:!0},saveAsImage:{show:!0}}},legend:{data:p.pluck(b,"name")},calculable:!0,series:[{type:"funnel",data:b}]}),g=j.init(a,i),g.setOption(e,!0)},b.columnFresh=function(a,b,d,e){var f,g,h;return f=p.extend({toolbox:{show:!0,feature:{mark:{show:!0},restore:{show:!0},saveAsImage:{show:!0}}},calculable:!1,yAxis:[{type:"value"}]},d),f.xAxis=[{type:"category",data:p.pluck(b,"key")}],b=p.map(b,function(a){return a.values[0].v}),f.series=[{type:"bar",data:b}],g=c(a).get(0),h=j.init(g,i),h.setOption(f,!0),e?setInterval(function(){return e(function(a,b){return b?(b=p.map(b,function(a){return a.values[0].v}),f.series[0].data=b,h.setOption(f,!0)):void 0})},1e4):void 0},i={color:["#2ec7c9","#b6a2de","#5ab1ef","#ffb980","#d87a80","#8d98b3","#e5cf0d","#97b552","#95706d","#dc69aa","#07a2a4","#9a7fd1","#588dd5","#f5994e","#c05050","#59678c","#c9ab00","#7eb00a","#6f5553","#c14089"],title:{itemGap:8,textStyle:{fontWeight:"normal",color:"#008acd"}},legend:{itemGap:8},dataRange:{itemWidth:15,color:["#2ec7c9","#b6a2de"]},toolbox:{color:["#1e90ff","#1e90ff","#1e90ff","#1e90ff"],effectiveColor:"#ff4500",itemGap:8},tooltip:{backgroundColor:"rgba(50,50,50,0.5)",axisPointer:{type:"line",lineStyle:{color:"#008acd"},crossStyle:{color:"#008acd"},shadowStyle:{color:"rgba(200,200,200,0.2)"}}},dataZoom:{dataBackgroundColor:"#efefff",fillerColor:"rgba(182,162,222,0.2)",handleColor:"#008acd"},grid:{borderColor:"#eee"},categoryAxis:{axisLine:{lineStyle:{color:"#008acd"}},splitLine:{lineStyle:{color:["#eee"]}}},valueAxis:{axisLine:{lineStyle:{color:"#008acd"}},splitArea:{show:!0,areaStyle:{color:["rgba(250,250,250,0.1)","rgba(200,200,200,0.1)"]}},splitLine:{lineStyle:{color:["#eee"]}}},polar:{axisLine:{lineStyle:{color:"#ddd"}},splitArea:{show:!0,areaStyle:{color:["rgba(250,250,250,0.2)","rgba(200,200,200,0.2)"]}},splitLine:{lineStyle:{color:"#ddd"}}},timeline:{lineStyle:{color:"#008acd"},controlStyle:{normal:{color:"#008acd"},emphasis:{color:"#008acd"}},symbol:"emptyCircle",symbolSize:3},bar:{itemStyle:{normal:{borderRadius:5},emphasis:{borderRadius:5}}},line:{smooth:!0,symbol:"emptyCircle",symbolSize:3},k:{itemStyle:{normal:{color:"#d87a80",color0:"#2ec7c9",lineStyle:{width:1,color:"#d87a80",color0:"#2ec7c9"}}}},scatter:{symbol:"circle",symbolSize:4},radar:{symbol:"emptyCircle",symbolSize:3},map:{itemStyle:{normal:{areaStyle:{color:"#ddd"},label:{textStyle:{color:"#d87a80"}}},emphasis:{areaStyle:{color:"#fe994e"},label:{textStyle:{color:"rgb(100,0,0)"}}}}},force:{itemStyle:{normal:{linkStyle:{strokeColor:"#1e90ff"}}}},chord:{padding:4,itemStyle:{normal:{lineStyle:{width:1,color:"rgba(128, 128, 128, 0.5)"},chordStyle:{lineStyle:{width:1,color:"rgba(128, 128, 128, 0.5)"}}},emphasis:{lineStyle:{width:1,color:"rgba(128, 128, 128, 0.5)"},chordStyle:{lineStyle:{width:1,color:"rgba(128, 128, 128, 0.5)"}}}}},gauge:{startAngle:225,endAngle:-45,axisLine:{show:!0,lineStyle:{color:[[.2,"#2ec7c9"],[.8,"#5ab1ef"],[1,"#d87a80"]],width:10}},axisTick:{splitNumber:10,length:15,lineStyle:{color:"auto"}},axisLabel:{textStyle:{color:"auto"}},splitLine:{length:22,lineStyle:{color:"auto"}},pointer:{width:5,color:"auto"},title:{textStyle:{color:"#333"}},detail:{textStyle:{color:"auto"}}},textStyle:{fontFamily:"微软雅黑, Arial, Verdana, sans-serif"}}})}).call(this);