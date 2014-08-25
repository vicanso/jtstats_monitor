(function(){seajs.use(["jquery","underscore","Backbone","widget","debug","user"],function(a,b,c,d,e,f){var g,h,i;return e=e("view:add"),e("start run addView"),i=c.View.extend({initialize:function(){var c;return e("initialize TimeConfigView"),c=this.$el,this.intervalSelector=new d.Selector({el:c.find(".intervalSelector"),selectTips:"请选择时间间隔",placeholder:"请输入时间间隔(秒)",items:["1分钟","10分钟","30分钟","1小时","2小时","6小时","12小时","1天"]}),this.intervalSelector.on("change",function(){return this.$el.removeClass("notFilled")}),this.commonDateSelector=new d.Selector({el:c.find(".commonDateSelector"),selectTips:"常用日期间隔",items:["当天","7天","15天","30天","当月"]}),this.commonDateSelector.on("change",function(a){return function(){var d,e,f;return d={"当天":[0,0],"7天":[-6,0],"15天":[-14,0],"30天":[-29,0],"当月":["currentMonth",0]},(f=d[a.commonDateSelector.val()])?(e=c.find(".date input"),b.each(f,function(a,b){return e.eq(b).val(a)})):void 0}}(this)),c.find(".date").datepicker({autoclose:!0,format:"yyyy-mm-dd",todayBtn:"linked"}),c.find(".date input").focus(function(){return a(this).removeClass("notFilled")})},convertInterval:function(a){var b;return b={"1分钟":60,"10分钟":600,"30分钟":1800,"1小时":3600,"2小时":7200,"6小时":21600,"12小时":43200,"1天":86400},window.parseInt(b[a]||a)},getConfig:function(){var a,b,c,d,e;return a=this.$el,(d=this.intervalSelector.val())?(d=this.convertInterval(d),b=a.find(".date input"),(e=b.eq(0).val())?(c=b.eq(1).val(),c?{interval:d,start:e,end:c}:void b.eq(1).addClass("notFilled")):void b.eq(0).addClass("notFilled")):void a.find(".intervalSelector").addClass("notFilled")}}),h=c.View.extend({initialize:function(b){var c,e,f;return c=this.$el,e=new d.Selector({el:c.find(".statsSelector"),selectTips:"请选择统计类别",items:JT_GLOBAL.collections}),e.on("change",function(){return this.$el.removeClass("notFilled")}),f=new d.Selector({el:c.find(".categorySelector"),selectTips:"请选择分类",placeholder:"请输入分类",multi:!0}),f.on("change",function(){return this.$el.removeClass("notFilled")}),e.on("change",function(a){return function(){return a.selectCategory(e,f)}}(this)),c.find(".types").on("click",".btn",function(){var b;return b=a(this),b.hasClass("btn-success")?void 0:b.siblings(".btn-success").addBack().toggleClass("btn-success")}),this.categorySelector=e,this.keySelector=f,this.enableTypeSelect(b.statsType)},enableTypeSelect:function(a){var c;return c=this.$el.find(".types .btn"),c.removeClass("disabled btn-success"),~b.indexOf(["line","stack"],a)?(c.filter(":last").addClass("disabled"),c.eq(0).addClass("btn-success")):~b.indexOf(["barVertical","barHorizontal","stackBarVertical","stackBarHorizontal"],a)?(c.filter(":last").addClass("disabled"),c.eq(1).addClass("btn-success")):~b.indexOf(["pie","nestedPie"],a)?(c.filter(":not(:last)").addClass("disabled"),c.eq(2).addClass("btn-success")):c.addClass("disabled")},selectCategory:function(b,c){var d;return e("selectCategory"),d=b.val(),this._xhr&&this._xhr.abort(),this._xhr=a.getJSON("/collection/"+d+"/keys",function(a){return function(b){return a._xhr=null,c.options(b)}}(this)),this},getParams:function(){var a,c,d,e,f,g,h,i;return a=this.$el,d=this.categorySelector,(c=d.val())?(g=this.keySelector,h=g.val(),h.length?(e=function(a){return b.map(a,function(a){return"/"===a.charAt(0)?(a="/"===a.charAt(a.length-1)?a.substring(1,a.length-1):a.substring(1),{value:a,type:"reg"}):{value:a}})},f=a.find(".btn-group .btn-success").index(),i=["line","bar","pie"],{chart:i[f]||"line",category:c,keys:e(h)}):void g.$el.addClass("notFilled")):void d.$el.addClass("notFilled")}}),g=c.View.extend({events:{"click .typeList li":"selectType","click .result .preview":"preview","click .statsConfig .add":"add","click .statsConfig .remove":"remove","click .result .save":"save"},initialize:function(){var b;return e("initialize StatsConfigsView"),b=this.$el,this.statsConfigHtml=a("<div />").append(b.find(".statsConfig").parent().clone()).html(),this.timeConfigView=new i({el:b.find(".dateConfig")}),b.find(".result input").focus(function(){return a(this).removeClass("notFilled")}),this.statsParamsViewList=[],this.createStatsConfig(b.find(".statsConfig"))},selectType:function(c){var d;return d=a(c.currentTarget),d.hasClass("selected")?void 0:(d.siblings(".selected").addBack().toggleClass("selected"),b.each(this.statsParamsViewList,function(a){return a.enableTypeSelect(d.data("type"))}))},add:function(){var b;return b=a(this.statsConfigHtml),b.find(".add").addClass("hidden"),b.find(".remove").removeClass("hidden"),b.insertBefore(this.$el.find(".row").children(":last")),this.createStatsConfig(b.find(".statsConfig"))},remove:function(b){var c,d,e;return d=a(b.currentTarget).closest(".statsConfig"),c=this.$el.find(".statsConfig").index(d),e=this.statsParamsViewList.splice(c,1)[0],d.parent().remove(),e.remove()},createStatsConfig:function(a){var b,c;return e("createStatsConfig"),b=this.$el,c=new h({el:a,statsType:b.find(".typeList .selected").data("type")}),this.statsParamsViewList.push(c)},selectCategory:function(b,c){var d;return e("selectCategory"),d=b.val(),this._xhr&&this._xhr.abort(),this._xhr=a.getJSON("/collection/"+d+"/keys",function(a){return function(b){return a._xhr=null,c.options(b)}}(this)),this},getOptions:function(){var a,c,d,f,g,h,i,j;return a=this.$el,j=a.find(".typeList .selected").data("type"),i=this.timeConfigView.getConfig(),i&&(g=[],b.each(this.statsParamsViewList,function(a){var b;return b=a.getParams(),b?g.push(b):void 0}),g.length===this.statsParamsViewList.length)?(h=a.find(".statsName input"),f=h.val().trim(),d=a.find(".desc input").val().trim(),c={name:f,stats:g,point:{interval:i.interval},type:j,date:{start:i.start,end:i.end},desc:d},e("config %j",c),c):void 0},save:function(){var b,c,d,e;return(c=this.getOptions())?(b=this.$el,e=b.find(".statsName input"),c.name?f.get("anonymous")?void f.logIn():(d=b.find(".saveResult"),console.dir(c),a.ajax({url:"/config",type:"post",dataType:"json",contentType:"application/json",data:JSON.stringify(c)}).success(function(){return d.removeClass("hidden alert-danger").addClass("alert-success").html("已成功保证该统计配置！")}).error(function(){return d.removeClass("hidden alert-success").addClass("alert-danger").html("保存统计配置失败！")})):void e.addClass("notFilled")):void 0},preview:function(){var b,c;return(c=this.getOptions())?(this.chartView&&this.chartView.remove(),b=a('<div class="chartView" />'),b.attr("title",c.desc),b.appendTo(this.$el),seajs.use("ChartView",function(a){return function(d){var e;e=new d({el:b}),e.setOptions(c),e.show(),a.chartView=e}}(this))):void 0}}),new g({el:a(".StatsConfigs")}),"development"===CONFIG.env?seajs.emit("loadComplete"):void 0})}).call(this);