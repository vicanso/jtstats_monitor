(function(){define("user",["jquery","underscore","async","Backbone"],function(a,b){var c,d,e,f,g,h,i;c=a("jquery"),i=a("underscore"),f=a("async"),d=a("Backbone"),g=function(){},i.extend(b,d.Events),e=d.Model.extend({defaults:{anonymous:!0},url:function(){return"/user?cache=false"},initialize:function(){return this.fetch()}}),h=new e,h.on("change:anonymous",function(a,c){var d;return d="logged",c&&(d="unlogged"),"logged"===d&&h.set("id","vicanso"),b.trigger("status",d)}),b.isLogedIn=function(){return!h.get("anonymous")},b.logOut=function(){return h.destroy({success:function(a,b){return h.set("name",""),h.set("id",""),i.each(b,function(a,b){return h.set(b,a)})},error:function(){return console.dir("error")}})},b.logIn=function(){var a,b,d;return d=c('<div class="maskContainer" />').appendTo("body"),b='<div class="logInDialog"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><a href="javascript:;" class="glyphicon glyphicon-remove close"></a>登录</h3></div></div><div class="panel-body"><input type="text" class="form-control user" autofocus placeholder="用户名" /><input type="password" class="form-control password" autofocus placeholder="密码" /><div class="alert hidden"></div><div class="row"><div class="col-xs-6"><a href="javascript:;" class="btn btn-success register">注册</a></div><div class="col-xs-6"><a href="javascript:;" class="btn btn-primary logIn">登录</a></div></div></div></div>',a=c(b).appendTo("body"),a.on("click",".close, .logIn, .register",function(){var b,e,f,g,j,k,l;return e=c(this),e.hasClass("logIn")||e.hasClass("register")?(k=a.find("input.user"),(l=k.val().trim())?(g=a.find("input.password"),(f=g.val().trim())?(b=a.find(".alert"),b.removeClass("alert-warning hidden"),b.addClass("alert-info"),b.text("正在提交中，请稍候..."),j="logIn",e.hasClass("register")&&(j="register"),seajs.use("crypto",function(c){var e;return h.set("type",j),e=c.SHA1(f).toString(),"logIn"===j&&(e=c.SHA1(""+e+"_"+h.get("hash")).toString()),h.set("pwd",e),h.set("name",l),h.save({},{error:function(){return b.removeClass("alert-info").addClass("alert-warning"),b.text("register"===j?"注册失败！":"登录失败！")},success:function(b,c){return i.each(c,function(a,c){return b.set(c,a)}),a.remove(),d.remove()}})})):void g.focus()):void k.focus()):(a.remove(),d.remove())})},b.get=function(a){return h.get(a)}})}).call(this);
(function(){define("widget",["jquery","underscore","Backbone","debug"],function(a,b){var c,d,e,f,g;g=a("underscore"),c=a("jquery"),d=a("Backbone"),f=a("debug")("module:widget"),e=d.Model.extend({defaults:{edit:!1,placeholder:"",selectTips:"",multi:!1}}),b.Selector=d.View.extend({template:g.template('<div class="content"><span class="glyphicon glyphicon-plus"></span><a class="edit" href="javascript:;"><span class="glyphicon glyphicon-edit"></span></a><div class="userInput hidden"><input type="text" placeholder="<%= placeholder %>" /></div><span class="selectInput"><span class="placeholder"><%= selectTips %></span><span class="items"></span></span></div><ul class="selectList"><div class="arrowTop1"></div><div class="arrowTop2"></div><%= html %></ul>'),colors:["#0c92c9","#0cc99a","#ffd200","#ff7f02","#ff0202","#ff02af","#c20cff","#4c16ff","#1f63ff","#28fff7"],events:{"click .selectList li":"toggle","click .content .edit":"toggleEdit"},initialize:function(a){return a=g.omit(a,"el"),f("initialize selector %j",a),this.model=new e(a),this.listenTo(this.model,"change:edit",this.editModeChange),this.listenTo(this.model,"change:items",this.render),this.render(),this},toggleEdit:function(){return this.model.set("edit",!this.model.get("edit"))},editModeChange:function(a,b){var c,d,e;return c=this.$el,e=c.find(".content .userInput"),d=c.find(".content .selectInput"),c.find(".content .userInput, .content .selectInput").toggleClass("hidden"),b?c.addClass("editMode"):c.removeClass("editMode")},options:function(a){return a?this.model.set("items",a):this.model.get("items")},getSelectListHtml:function(){var a,b;return b=g.template('<li><span class="checkIcon"></span><span class="dot" style="background-color:<%= color %>;"></span><%= name %></li>'),a=g.map(this.model.get("items"),function(a){return function(c,d){var e;return e=a.colors[d%a.colors.length],b({name:c,color:e})}}(this)),a.join("")},toggle:function(a){var b,d,e,f,h;return e=c(a.currentTarget),this.model.get("multi")?e.hasClass("selected")?(e.removeClass("selected"),e.find(".checkIcon").removeClass("glyphicon glyphicon-ok")):(e.addClass("selected"),e.find(".checkIcon").addClass("glyphicon glyphicon-ok")):e.hasClass("selected")||(e.addClass("selected").find(".checkIcon").addClass("glyphicon glyphicon-ok"),e.siblings(".selected").removeClass("selected").find(".checkIcon").removeClass("glyphicon glyphicon-ok")),b=this.$el,h=this.$el.find(".selectList .selected"),d=g.map(h,function(a){return a=c(a),'<span class="item">'+a.html()+"</span>"}),f=b.find(".content .placeholder"),h.length?f.addClass("hidden"):f.removeClass("hidden"),b.find(".content .items").html(d.join("")),this.trigger("change")},render:function(){var a,b,c,d,e;return a=this.$el,c=this.getSelectListHtml(),d=this.model.get("placeholder"),e=this.model.get("selectTips"),b=this.model.toJSON(),b.html=c,a.addClass("uiSelector").html(this.template(b))},val:function(){var a;return a=this.model.get("edit")?[this.$el.find(".content .userInput input").val().trim()]:g.map(this.$el.find(".content .items .item"),function(a){return c(a).text()}),this.model.get("multi")?a:a[0]},reset:function(){return this.render()}})})}).call(this);
(function(){seajs.use(["jquery","underscore","async","user"],function(a,b,c,d){var e,f;return f=Backbone.View.extend({events:{"click .logIn":"logIn","click .logOut":"logOut"},initialize:function(){return this.listenTo(d,"status",this.changeStatus)},logIn:function(){return d.logIn()},logOut:function(){return d.logOut()},changeStatus:function(a){var b,c,d;return b=this.$el,c=b.find(".logIn"),d=b.find(".logOut"),"logged"!==a?(c.removeClass("hidden"),d.addClass("hidden")):(c.addClass("hidden"),d.removeClass("hidden"))}}),e=Backbone.View.extend({initialize:function(){return this.listenTo(d,"status",this.changeStatus)},changeStatus:function(){return this.$el.find(".name").text(d.get("name"))}}),new f({el:a(".menuContainer")}),new e({el:a(".headerContainer")}),b.delay(function(){return"development"===CONFIG.env?seajs.emit("loadComplete"):void 0},1e3)})}).call(this);
!function(a,b){function c(){return new Date(Date.UTC.apply(Date,arguments))}function d(){var a=new Date;return c(a.getFullYear(),a.getMonth(),a.getDate())}function e(a){return function(){return this[a].apply(this,arguments)}}function f(b,c){function d(a,b){return b.toLowerCase()}var e,f=a(b).data(),g={},h=new RegExp("^"+c.toLowerCase()+"([A-Z])");c=new RegExp("^"+c.toLowerCase());for(var i in f)c.test(i)&&(e=i.replace(h,d),g[e]=f[i]);return g}function g(b){var c={};if(o[b]||(b=b.split("-")[0],o[b])){var d=o[b];return a.each(n,function(a,b){b in d&&(c[b]=d[b])}),c}}var h=a(window),i=function(){var b={get:function(a){return this.slice(a)[0]},contains:function(a){for(var b=a&&a.valueOf(),c=0,d=this.length;d>c;c++)if(this[c].valueOf()===b)return c;return-1},remove:function(a){this.splice(a,1)},replace:function(b){b&&(a.isArray(b)||(b=[b]),this.clear(),this.push.apply(this,b))},clear:function(){this.splice(0)},copy:function(){var a=new i;return a.replace(this),a}};return function(){var c=[];return c.push.apply(c,arguments),a.extend(c,b),c}}(),j=function(b,c){this.dates=new i,this.viewDate=d(),this.focusDate=null,this._process_options(c),this.element=a(b),this.isInline=!1,this.isInput=this.element.is("input"),this.component=this.element.is(".date")?this.element.find(".add-on, .input-group-addon, .btn"):!1,this.hasInput=this.component&&this.element.find("input").length,this.component&&0===this.component.length&&(this.component=!1),this.picker=a(p.template),this._buildEvents(),this._attachEvents(),this.isInline?this.picker.addClass("datepicker-inline").appendTo(this.element):this.picker.addClass("datepicker-dropdown dropdown-menu"),this.o.rtl&&this.picker.addClass("datepicker-rtl"),this.viewMode=this.o.startView,this.o.calendarWeeks&&this.picker.find("tfoot th.today").attr("colspan",function(a,b){return parseInt(b)+1}),this._allow_update=!1,this.setStartDate(this._o.startDate),this.setEndDate(this._o.endDate),this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled),this.fillDow(),this.fillMonths(),this._allow_update=!0,this.update(),this.showMode(),this.isInline&&this.show()};j.prototype={constructor:j,_process_options:function(b){this._o=a.extend({},this._o,b);var c=this.o=a.extend({},this._o),d=c.language;switch(o[d]||(d=d.split("-")[0],o[d]||(d=m.language)),c.language=d,c.startView){case 2:case"decade":c.startView=2;break;case 1:case"year":c.startView=1;break;default:c.startView=0}switch(c.minViewMode){case 1:case"months":c.minViewMode=1;break;case 2:case"years":c.minViewMode=2;break;default:c.minViewMode=0}c.startView=Math.max(c.startView,c.minViewMode),c.multidate!==!0&&(c.multidate=Number(c.multidate)||!1,c.multidate=c.multidate!==!1?Math.max(0,c.multidate):1),c.multidateSeparator=String(c.multidateSeparator),c.weekStart%=7,c.weekEnd=(c.weekStart+6)%7;var e=p.parseFormat(c.format);c.startDate!==-1/0&&(c.startDate=c.startDate?c.startDate instanceof Date?this._local_to_utc(this._zero_time(c.startDate)):p.parseDate(c.startDate,e,c.language):-1/0),1/0!==c.endDate&&(c.endDate=c.endDate?c.endDate instanceof Date?this._local_to_utc(this._zero_time(c.endDate)):p.parseDate(c.endDate,e,c.language):1/0),c.daysOfWeekDisabled=c.daysOfWeekDisabled||[],a.isArray(c.daysOfWeekDisabled)||(c.daysOfWeekDisabled=c.daysOfWeekDisabled.split(/[,\s]*/)),c.daysOfWeekDisabled=a.map(c.daysOfWeekDisabled,function(a){return parseInt(a,10)});var f=String(c.orientation).toLowerCase().split(/\s+/g),g=c.orientation.toLowerCase();if(f=a.grep(f,function(a){return/^auto|left|right|top|bottom$/.test(a)}),c.orientation={x:"auto",y:"auto"},g&&"auto"!==g)if(1===f.length)switch(f[0]){case"top":case"bottom":c.orientation.y=f[0];break;case"left":case"right":c.orientation.x=f[0]}else g=a.grep(f,function(a){return/^left|right$/.test(a)}),c.orientation.x=g[0]||"auto",g=a.grep(f,function(a){return/^top|bottom$/.test(a)}),c.orientation.y=g[0]||"auto";else;},_events:[],_secondaryEvents:[],_applyEvents:function(a){for(var c,d,e,f=0;f<a.length;f++)c=a[f][0],2===a[f].length?(d=b,e=a[f][1]):3===a[f].length&&(d=a[f][1],e=a[f][2]),c.on(e,d)},_unapplyEvents:function(a){for(var c,d,e,f=0;f<a.length;f++)c=a[f][0],2===a[f].length?(e=b,d=a[f][1]):3===a[f].length&&(e=a[f][1],d=a[f][2]),c.off(d,e)},_buildEvents:function(){this.isInput?this._events=[[this.element,{focus:a.proxy(this.show,this),keyup:a.proxy(function(b){-1===a.inArray(b.keyCode,[27,37,39,38,40,32,13,9])&&this.update()},this),keydown:a.proxy(this.keydown,this)}]]:this.component&&this.hasInput?this._events=[[this.element.find("input"),{focus:a.proxy(this.show,this),keyup:a.proxy(function(b){-1===a.inArray(b.keyCode,[27,37,39,38,40,32,13,9])&&this.update()},this),keydown:a.proxy(this.keydown,this)}],[this.component,{click:a.proxy(this.show,this)}]]:this.element.is("div")?this.isInline=!0:this._events=[[this.element,{click:a.proxy(this.show,this)}]],this._events.push([this.element,"*",{blur:a.proxy(function(a){this._focused_from=a.target},this)}],[this.element,{blur:a.proxy(function(a){this._focused_from=a.target},this)}]),this._secondaryEvents=[[this.picker,{click:a.proxy(this.click,this)}],[a(window),{resize:a.proxy(this.place,this)}],[a(document),{"mousedown touchstart":a.proxy(function(a){this.element.is(a.target)||this.element.find(a.target).length||this.picker.is(a.target)||this.picker.find(a.target).length||this.hide()},this)}]]},_attachEvents:function(){this._detachEvents(),this._applyEvents(this._events)},_detachEvents:function(){this._unapplyEvents(this._events)},_attachSecondaryEvents:function(){this._detachSecondaryEvents(),this._applyEvents(this._secondaryEvents)},_detachSecondaryEvents:function(){this._unapplyEvents(this._secondaryEvents)},_trigger:function(b,c){var d=c||this.dates.get(-1),e=this._utc_to_local(d);this.element.trigger({type:b,date:e,dates:a.map(this.dates,this._utc_to_local),format:a.proxy(function(a,b){0===arguments.length?(a=this.dates.length-1,b=this.o.format):"string"==typeof a&&(b=a,a=this.dates.length-1),b=b||this.o.format;var c=this.dates.get(a);return p.formatDate(c,b,this.o.language)},this)})},show:function(){this.isInline||this.picker.appendTo("body"),this.picker.show(),this.place(),this._attachSecondaryEvents(),this._trigger("show")},hide:function(){this.isInline||this.picker.is(":visible")&&(this.focusDate=null,this.picker.hide().detach(),this._detachSecondaryEvents(),this.viewMode=this.o.startView,this.showMode(),this.o.forceParse&&(this.isInput&&this.element.val()||this.hasInput&&this.element.find("input").val())&&this.setValue(),this._trigger("hide"))},remove:function(){this.hide(),this._detachEvents(),this._detachSecondaryEvents(),this.picker.remove(),delete this.element.data().datepicker,this.isInput||delete this.element.data().date},_utc_to_local:function(a){return a&&new Date(a.getTime()+6e4*a.getTimezoneOffset())},_local_to_utc:function(a){return a&&new Date(a.getTime()-6e4*a.getTimezoneOffset())},_zero_time:function(a){return a&&new Date(a.getFullYear(),a.getMonth(),a.getDate())},_zero_utc_time:function(a){return a&&new Date(Date.UTC(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate()))},getDates:function(){return a.map(this.dates,this._utc_to_local)},getUTCDates:function(){return a.map(this.dates,function(a){return new Date(a)})},getDate:function(){return this._utc_to_local(this.getUTCDate())},getUTCDate:function(){return new Date(this.dates.get(-1))},setDates:function(){var b=a.isArray(arguments[0])?arguments[0]:arguments;this.update.apply(this,b),this._trigger("changeDate"),this.setValue()},setUTCDates:function(){var b=a.isArray(arguments[0])?arguments[0]:arguments;this.update.apply(this,a.map(b,this._utc_to_local)),this._trigger("changeDate"),this.setValue()},setDate:e("setDates"),setUTCDate:e("setUTCDates"),setValue:function(){var a=this.getFormattedDate();this.isInput?this.element.val(a).change():this.component&&this.element.find("input").val(a).change()},getFormattedDate:function(c){c===b&&(c=this.o.format);var d=this.o.language;return a.map(this.dates,function(a){return p.formatDate(a,c,d)}).join(this.o.multidateSeparator)},setStartDate:function(a){this._process_options({startDate:a}),this.update(),this.updateNavArrows()},setEndDate:function(a){this._process_options({endDate:a}),this.update(),this.updateNavArrows()},setDaysOfWeekDisabled:function(a){this._process_options({daysOfWeekDisabled:a}),this.update(),this.updateNavArrows()},place:function(){if(!this.isInline){var b=this.picker.outerWidth(),c=this.picker.outerHeight(),d=10,e=h.width(),f=h.height(),g=h.scrollTop(),i=parseInt(this.element.parents().filter(function(){return"auto"!==a(this).css("z-index")}).first().css("z-index"))+10,j=this.component?this.component.parent().offset():this.element.offset(),k=this.component?this.component.outerHeight(!0):this.element.outerHeight(!1),l=this.component?this.component.outerWidth(!0):this.element.outerWidth(!1),m=j.left,n=j.top;this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"),"auto"!==this.o.orientation.x?(this.picker.addClass("datepicker-orient-"+this.o.orientation.x),"right"===this.o.orientation.x&&(m-=b-l)):(this.picker.addClass("datepicker-orient-left"),j.left<0?m-=j.left-d:j.left+b>e&&(m=e-b-d));var o,p,q=this.o.orientation.y;"auto"===q&&(o=-g+j.top-c,p=g+f-(j.top+k+c),q=Math.max(o,p)===p?"top":"bottom"),this.picker.addClass("datepicker-orient-"+q),"top"===q?n+=k:n-=c+parseInt(this.picker.css("padding-top")),this.picker.css({top:n,left:m,zIndex:i})}},_allow_update:!0,update:function(){if(this._allow_update){var b=this.dates.copy(),c=[],d=!1;arguments.length?(a.each(arguments,a.proxy(function(a,b){b instanceof Date&&(b=this._local_to_utc(b)),c.push(b)},this)),d=!0):(c=this.isInput?this.element.val():this.element.data("date")||this.element.find("input").val(),c=c&&this.o.multidate?c.split(this.o.multidateSeparator):[c],delete this.element.data().date),c=a.map(c,a.proxy(function(a){return p.parseDate(a,this.o.format,this.o.language)},this)),c=a.grep(c,a.proxy(function(a){return a<this.o.startDate||a>this.o.endDate||!a},this),!0),this.dates.replace(c),this.dates.length?this.viewDate=new Date(this.dates.get(-1)):this.viewDate<this.o.startDate?this.viewDate=new Date(this.o.startDate):this.viewDate>this.o.endDate&&(this.viewDate=new Date(this.o.endDate)),d?this.setValue():c.length&&String(b)!==String(this.dates)&&this._trigger("changeDate"),!this.dates.length&&b.length&&this._trigger("clearDate"),this.fill()}},fillDow:function(){var a=this.o.weekStart,b="<tr>";if(this.o.calendarWeeks){var c='<th class="cw">&nbsp;</th>';b+=c,this.picker.find(".datepicker-days thead tr:first-child").prepend(c)}for(;a<this.o.weekStart+7;)b+='<th class="dow">'+o[this.o.language].daysMin[a++%7]+"</th>";b+="</tr>",this.picker.find(".datepicker-days thead").append(b)},fillMonths:function(){for(var a="",b=0;12>b;)a+='<span class="month">'+o[this.o.language].monthsShort[b++]+"</span>";this.picker.find(".datepicker-months td").html(a)},setRange:function(b){b&&b.length?this.range=a.map(b,function(a){return a.valueOf()}):delete this.range,this.fill()},getClassNames:function(b){var c=[],d=this.viewDate.getUTCFullYear(),e=this.viewDate.getUTCMonth(),f=new Date;return b.getUTCFullYear()<d||b.getUTCFullYear()===d&&b.getUTCMonth()<e?c.push("old"):(b.getUTCFullYear()>d||b.getUTCFullYear()===d&&b.getUTCMonth()>e)&&c.push("new"),this.focusDate&&b.valueOf()===this.focusDate.valueOf()&&c.push("focused"),this.o.todayHighlight&&b.getUTCFullYear()===f.getFullYear()&&b.getUTCMonth()===f.getMonth()&&b.getUTCDate()===f.getDate()&&c.push("today"),-1!==this.dates.contains(b)&&c.push("active"),(b.valueOf()<this.o.startDate||b.valueOf()>this.o.endDate||-1!==a.inArray(b.getUTCDay(),this.o.daysOfWeekDisabled))&&c.push("disabled"),this.range&&(b>this.range[0]&&b<this.range[this.range.length-1]&&c.push("range"),-1!==a.inArray(b.valueOf(),this.range)&&c.push("selected")),c},fill:function(){var d,e=new Date(this.viewDate),f=e.getUTCFullYear(),g=e.getUTCMonth(),h=this.o.startDate!==-1/0?this.o.startDate.getUTCFullYear():-1/0,i=this.o.startDate!==-1/0?this.o.startDate.getUTCMonth():-1/0,j=1/0!==this.o.endDate?this.o.endDate.getUTCFullYear():1/0,k=1/0!==this.o.endDate?this.o.endDate.getUTCMonth():1/0,l=o[this.o.language].today||o.en.today||"",m=o[this.o.language].clear||o.en.clear||"";this.picker.find(".datepicker-days thead th.datepicker-switch").text(o[this.o.language].months[g]+" "+f),this.picker.find("tfoot th.today").text(l).toggle(this.o.todayBtn!==!1),this.picker.find("tfoot th.clear").text(m).toggle(this.o.clearBtn!==!1),this.updateNavArrows(),this.fillMonths();var n=c(f,g-1,28),q=p.getDaysInMonth(n.getUTCFullYear(),n.getUTCMonth());n.setUTCDate(q),n.setUTCDate(q-(n.getUTCDay()-this.o.weekStart+7)%7);var r=new Date(n);r.setUTCDate(r.getUTCDate()+42),r=r.valueOf();for(var s,t=[];n.valueOf()<r;){if(n.getUTCDay()===this.o.weekStart&&(t.push("<tr>"),this.o.calendarWeeks)){var u=new Date(+n+(this.o.weekStart-n.getUTCDay()-7)%7*864e5),v=new Date(Number(u)+(11-u.getUTCDay())%7*864e5),w=new Date(Number(w=c(v.getUTCFullYear(),0,1))+(11-w.getUTCDay())%7*864e5),x=(v-w)/864e5/7+1;t.push('<td class="cw">'+x+"</td>")}if(s=this.getClassNames(n),s.push("day"),this.o.beforeShowDay!==a.noop){var y=this.o.beforeShowDay(this._utc_to_local(n));y===b?y={}:"boolean"==typeof y?y={enabled:y}:"string"==typeof y&&(y={classes:y}),y.enabled===!1&&s.push("disabled"),y.classes&&(s=s.concat(y.classes.split(/\s+/))),y.tooltip&&(d=y.tooltip)}s=a.unique(s),t.push('<td class="'+s.join(" ")+'"'+(d?' title="'+d+'"':"")+">"+n.getUTCDate()+"</td>"),n.getUTCDay()===this.o.weekEnd&&t.push("</tr>"),n.setUTCDate(n.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").empty().append(t.join(""));var z=this.picker.find(".datepicker-months").find("th:eq(1)").text(f).end().find("span").removeClass("active");a.each(this.dates,function(a,b){b.getUTCFullYear()===f&&z.eq(b.getUTCMonth()).addClass("active")}),(h>f||f>j)&&z.addClass("disabled"),f===h&&z.slice(0,i).addClass("disabled"),f===j&&z.slice(k+1).addClass("disabled"),t="",f=10*parseInt(f/10,10);var A=this.picker.find(".datepicker-years").find("th:eq(1)").text(f+"-"+(f+9)).end().find("td");f-=1;for(var B,C=a.map(this.dates,function(a){return a.getUTCFullYear()}),D=-1;11>D;D++)B=["year"],-1===D?B.push("old"):10===D&&B.push("new"),-1!==a.inArray(f,C)&&B.push("active"),(h>f||f>j)&&B.push("disabled"),t+='<span class="'+B.join(" ")+'">'+f+"</span>",f+=1;A.html(t)},updateNavArrows:function(){if(this._allow_update){var a=new Date(this.viewDate),b=a.getUTCFullYear(),c=a.getUTCMonth();switch(this.viewMode){case 0:this.picker.find(".prev").css(this.o.startDate!==-1/0&&b<=this.o.startDate.getUTCFullYear()&&c<=this.o.startDate.getUTCMonth()?{visibility:"hidden"}:{visibility:"visible"}),this.picker.find(".next").css(1/0!==this.o.endDate&&b>=this.o.endDate.getUTCFullYear()&&c>=this.o.endDate.getUTCMonth()?{visibility:"hidden"}:{visibility:"visible"});break;case 1:case 2:this.picker.find(".prev").css(this.o.startDate!==-1/0&&b<=this.o.startDate.getUTCFullYear()?{visibility:"hidden"}:{visibility:"visible"}),this.picker.find(".next").css(1/0!==this.o.endDate&&b>=this.o.endDate.getUTCFullYear()?{visibility:"hidden"}:{visibility:"visible"})}}},click:function(b){b.preventDefault();var d,e,f,g=a(b.target).closest("span, td, th");if(1===g.length)switch(g[0].nodeName.toLowerCase()){case"th":switch(g[0].className){case"datepicker-switch":this.showMode(1);break;case"prev":case"next":var h=p.modes[this.viewMode].navStep*("prev"===g[0].className?-1:1);switch(this.viewMode){case 0:this.viewDate=this.moveMonth(this.viewDate,h),this._trigger("changeMonth",this.viewDate);break;case 1:case 2:this.viewDate=this.moveYear(this.viewDate,h),1===this.viewMode&&this._trigger("changeYear",this.viewDate)}this.fill();break;case"today":var i=new Date;i=c(i.getFullYear(),i.getMonth(),i.getDate(),0,0,0),this.showMode(-2);var j="linked"===this.o.todayBtn?null:"view";this._setDate(i,j);break;case"clear":var k;this.isInput?k=this.element:this.component&&(k=this.element.find("input")),k&&k.val("").change(),this.update(),this._trigger("changeDate"),this.o.autoclose&&this.hide()}break;case"span":g.is(".disabled")||(this.viewDate.setUTCDate(1),g.is(".month")?(f=1,e=g.parent().find("span").index(g),d=this.viewDate.getUTCFullYear(),this.viewDate.setUTCMonth(e),this._trigger("changeMonth",this.viewDate),1===this.o.minViewMode&&this._setDate(c(d,e,f))):(f=1,e=0,d=parseInt(g.text(),10)||0,this.viewDate.setUTCFullYear(d),this._trigger("changeYear",this.viewDate),2===this.o.minViewMode&&this._setDate(c(d,e,f))),this.showMode(-1),this.fill());break;case"td":g.is(".day")&&!g.is(".disabled")&&(f=parseInt(g.text(),10)||1,d=this.viewDate.getUTCFullYear(),e=this.viewDate.getUTCMonth(),g.is(".old")?0===e?(e=11,d-=1):e-=1:g.is(".new")&&(11===e?(e=0,d+=1):e+=1),this._setDate(c(d,e,f)))}this.picker.is(":visible")&&this._focused_from&&a(this._focused_from).focus(),delete this._focused_from},_toggle_multidate:function(a){var b=this.dates.contains(a);if(a?-1!==b?this.dates.remove(b):this.dates.push(a):this.dates.clear(),"number"==typeof this.o.multidate)for(;this.dates.length>this.o.multidate;)this.dates.remove(0)},_setDate:function(a,b){b&&"date"!==b||this._toggle_multidate(a&&new Date(a)),b&&"view"!==b||(this.viewDate=a&&new Date(a)),this.fill(),this.setValue(),this._trigger("changeDate");var c;this.isInput?c=this.element:this.component&&(c=this.element.find("input")),c&&c.change(),!this.o.autoclose||b&&"date"!==b||this.hide()},moveMonth:function(a,c){if(!a)return b;if(!c)return a;var d,e,f=new Date(a.valueOf()),g=f.getUTCDate(),h=f.getUTCMonth(),i=Math.abs(c);if(c=c>0?1:-1,1===i)e=-1===c?function(){return f.getUTCMonth()===h}:function(){return f.getUTCMonth()!==d},d=h+c,f.setUTCMonth(d),(0>d||d>11)&&(d=(d+12)%12);else{for(var j=0;i>j;j++)f=this.moveMonth(f,c);d=f.getUTCMonth(),f.setUTCDate(g),e=function(){return d!==f.getUTCMonth()}}for(;e();)f.setUTCDate(--g),f.setUTCMonth(d);return f},moveYear:function(a,b){return this.moveMonth(a,12*b)},dateWithinRange:function(a){return a>=this.o.startDate&&a<=this.o.endDate},keydown:function(a){if(this.picker.is(":not(:visible)"))return void(27===a.keyCode&&this.show());var b,c,e,f=!1,g=this.focusDate||this.viewDate;switch(a.keyCode){case 27:this.focusDate?(this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill()):this.hide(),a.preventDefault();break;case 37:case 39:if(!this.o.keyboardNavigation)break;b=37===a.keyCode?-1:1,a.ctrlKey?(c=this.moveYear(this.dates.get(-1)||d(),b),e=this.moveYear(g,b),this._trigger("changeYear",this.viewDate)):a.shiftKey?(c=this.moveMonth(this.dates.get(-1)||d(),b),e=this.moveMonth(g,b),this._trigger("changeMonth",this.viewDate)):(c=new Date(this.dates.get(-1)||d()),c.setUTCDate(c.getUTCDate()+b),e=new Date(g),e.setUTCDate(g.getUTCDate()+b)),this.dateWithinRange(c)&&(this.focusDate=this.viewDate=e,this.setValue(),this.fill(),a.preventDefault());break;case 38:case 40:if(!this.o.keyboardNavigation)break;b=38===a.keyCode?-1:1,a.ctrlKey?(c=this.moveYear(this.dates.get(-1)||d(),b),e=this.moveYear(g,b),this._trigger("changeYear",this.viewDate)):a.shiftKey?(c=this.moveMonth(this.dates.get(-1)||d(),b),e=this.moveMonth(g,b),this._trigger("changeMonth",this.viewDate)):(c=new Date(this.dates.get(-1)||d()),c.setUTCDate(c.getUTCDate()+7*b),e=new Date(g),e.setUTCDate(g.getUTCDate()+7*b)),this.dateWithinRange(c)&&(this.focusDate=this.viewDate=e,this.setValue(),this.fill(),a.preventDefault());break;case 32:break;case 13:g=this.focusDate||this.dates.get(-1)||this.viewDate,this._toggle_multidate(g),f=!0,this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.setValue(),this.fill(),this.picker.is(":visible")&&(a.preventDefault(),this.o.autoclose&&this.hide());break;case 9:this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill(),this.hide()}if(f){this._trigger(this.dates.length?"changeDate":"clearDate");var h;this.isInput?h=this.element:this.component&&(h=this.element.find("input")),h&&h.change()}},showMode:function(a){a&&(this.viewMode=Math.max(this.o.minViewMode,Math.min(2,this.viewMode+a))),this.picker.find(">div").hide().filter(".datepicker-"+p.modes[this.viewMode].clsName).css("display","block"),this.updateNavArrows()}};var k=function(b,c){this.element=a(b),this.inputs=a.map(c.inputs,function(a){return a.jquery?a[0]:a}),delete c.inputs,a(this.inputs).datepicker(c).bind("changeDate",a.proxy(this.dateUpdated,this)),this.pickers=a.map(this.inputs,function(b){return a(b).data("datepicker")}),this.updateDates()};k.prototype={updateDates:function(){this.dates=a.map(this.pickers,function(a){return a.getUTCDate()}),this.updateRanges()},updateRanges:function(){var b=a.map(this.dates,function(a){return a.valueOf()});a.each(this.pickers,function(a,c){c.setRange(b)})},dateUpdated:function(b){if(!this.updating){this.updating=!0;var c=a(b.target).data("datepicker"),d=c.getUTCDate(),e=a.inArray(b.target,this.inputs),f=this.inputs.length;if(-1!==e){if(a.each(this.pickers,function(a,b){b.getUTCDate()||b.setUTCDate(d)}),d<this.dates[e])for(;e>=0&&d<this.dates[e];)this.pickers[e--].setUTCDate(d);else if(d>this.dates[e])for(;f>e&&d>this.dates[e];)this.pickers[e++].setUTCDate(d);this.updateDates(),delete this.updating}}},remove:function(){a.map(this.pickers,function(a){a.remove()}),delete this.element.data().datepicker}};var l=a.fn.datepicker;a.fn.datepicker=function(c){var d=Array.apply(null,arguments);d.shift();var e;return this.each(function(){var h=a(this),i=h.data("datepicker"),l="object"==typeof c&&c;if(!i){var n=f(this,"date"),o=a.extend({},m,n,l),p=g(o.language),q=a.extend({},m,p,n,l);if(h.is(".input-daterange")||q.inputs){var r={inputs:q.inputs||h.find("input").toArray()};h.data("datepicker",i=new k(this,a.extend(q,r)))}else h.data("datepicker",i=new j(this,q))}return"string"==typeof c&&"function"==typeof i[c]&&(e=i[c].apply(i,d),e!==b)?!1:void 0}),e!==b?e:this};var m=a.fn.datepicker.defaults={autoclose:!1,beforeShowDay:a.noop,calendarWeeks:!1,clearBtn:!1,daysOfWeekDisabled:[],endDate:1/0,forceParse:!0,format:"mm/dd/yyyy",keyboardNavigation:!0,language:"en",minViewMode:0,multidate:!1,multidateSeparator:",",orientation:"auto",rtl:!1,startDate:-1/0,startView:0,todayBtn:!1,todayHighlight:!1,weekStart:0},n=a.fn.datepicker.locale_opts=["format","rtl","weekStart"];a.fn.datepicker.Constructor=j;var o=a.fn.datepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear"}},p={modes:[{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(a){return a%4===0&&a%100!==0||a%400===0},getDaysInMonth:function(a,b){return[31,p.isLeapYear(a)?29:28,31,30,31,30,31,31,30,31,30,31][b]},validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,parseFormat:function(a){var b=a.replace(this.validParts,"\x00").split("\x00"),c=a.match(this.validParts);if(!b||!b.length||!c||0===c.length)throw new Error("Invalid date format.");return{separators:b,parts:c}},parseDate:function(d,e,f){function g(){var a=this.slice(0,m[k].length),b=m[k].slice(0,a.length);return a===b}if(!d)return b;if(d instanceof Date)return d;"string"==typeof e&&(e=p.parseFormat(e));var h,i,k,l=/([\-+]\d+)([dmwy])/,m=d.match(/([\-+]\d+)([dmwy])/g);if(/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(d)){for(d=new Date,k=0;k<m.length;k++)switch(h=l.exec(m[k]),i=parseInt(h[1]),h[2]){case"d":d.setUTCDate(d.getUTCDate()+i);break;case"m":d=j.prototype.moveMonth.call(j.prototype,d,i);break;case"w":d.setUTCDate(d.getUTCDate()+7*i);break;case"y":d=j.prototype.moveYear.call(j.prototype,d,i)}return c(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),0,0,0)}m=d&&d.match(this.nonpunctuation)||[],d=new Date;var n,q,r={},s=["yyyy","yy","M","MM","m","mm","d","dd"],t={yyyy:function(a,b){return a.setUTCFullYear(b)},yy:function(a,b){return a.setUTCFullYear(2e3+b)},m:function(a,b){if(isNaN(a))return a;for(b-=1;0>b;)b+=12;for(b%=12,a.setUTCMonth(b);a.getUTCMonth()!==b;)a.setUTCDate(a.getUTCDate()-1);return a},d:function(a,b){return a.setUTCDate(b)}};t.M=t.MM=t.mm=t.m,t.dd=t.d,d=c(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0);var u=e.parts.slice();if(m.length!==u.length&&(u=a(u).filter(function(b,c){return-1!==a.inArray(c,s)}).toArray()),m.length===u.length){var v;for(k=0,v=u.length;v>k;k++){if(n=parseInt(m[k],10),h=u[k],isNaN(n))switch(h){case"MM":q=a(o[f].months).filter(g),n=a.inArray(q[0],o[f].months)+1;break;case"M":q=a(o[f].monthsShort).filter(g),n=a.inArray(q[0],o[f].monthsShort)+1}r[h]=n}var w,x;for(k=0;k<s.length;k++)x=s[k],x in r&&!isNaN(r[x])&&(w=new Date(d),t[x](w,r[x]),isNaN(w)||(d=w))}return d},formatDate:function(b,c,d){if(!b)return"";"string"==typeof c&&(c=p.parseFormat(c));var e={d:b.getUTCDate(),D:o[d].daysShort[b.getUTCDay()],DD:o[d].days[b.getUTCDay()],m:b.getUTCMonth()+1,M:o[d].monthsShort[b.getUTCMonth()],MM:o[d].months[b.getUTCMonth()],yy:b.getUTCFullYear().toString().substring(2),yyyy:b.getUTCFullYear()};e.dd=(e.d<10?"0":"")+e.d,e.mm=(e.m<10?"0":"")+e.m,b=[];for(var f=a.extend([],c.separators),g=0,h=c.parts.length;h>=g;g++)f.length&&b.push(f.shift()),b.push(e[c.parts[g]]);return b.join("")},headTemplate:'<thead><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};p.template='<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">'+p.headTemplate+"<tbody></tbody>"+p.footTemplate+'</table></div><div class="datepicker-months"><table class="table-condensed">'+p.headTemplate+p.contTemplate+p.footTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+p.headTemplate+p.contTemplate+p.footTemplate+"</table></div></div>",a.fn.datepicker.DPGlobal=p,a.fn.datepicker.noConflict=function(){return a.fn.datepicker=l,this},a(document).on("focus.datepicker.data-api click.datepicker.data-api",'[data-provide="datepicker"]',function(b){var c=a(this);c.data("datepicker")||(b.preventDefault(),c.datepicker("show"))}),a(function(){a('[data-provide="datepicker-inline"]').datepicker()})}(window.jQuery);
(function(){seajs.use(["jquery","underscore","Backbone","widget","debug","user"],function(a,b,c,d,e,f){var g,h,i;return e=e("view:add"),e("start run addView"),i=c.View.extend({initialize:function(){var c;return e("initialize TimeConfigView"),c=this.$el,this.intervalSelector=new d.Selector({el:c.find(".intervalSelector"),selectTips:"请选择时间间隔",placeholder:"请输入时间间隔(秒)",items:["1分钟","10分钟","30分钟","1小时","2小时","6小时","12小时","1天"]}),this.intervalSelector.on("change",function(){return this.$el.removeClass("notFilled")}),this.commonDateSelector=new d.Selector({el:c.find(".commonDateSelector"),selectTips:"常用日期间隔",items:["当天","7天","15天","30天","当月"]}),this.commonDateSelector.on("change",function(a){return function(){var d,e,f;return d={"当天":[0,0],"7天":[-6,0],"15天":[-14,0],"30天":[-29,0],"当月":["currentMonth",0]},(f=d[a.commonDateSelector.val()])?(e=c.find(".date input"),b.each(f,function(a,b){return e.eq(b).val(a)})):void 0}}(this)),c.find(".date").datepicker({autoclose:!0,format:"yyyy-mm-dd",todayBtn:"linked"}),c.find(".date input").focus(function(){return a(this).removeClass("notFilled")})},convertInterval:function(a){var b;return b={"1分钟":60,"10分钟":600,"30分钟":1800,"1小时":3600,"2小时":7200,"6小时":21600,"12小时":43200,"1天":86400},window.parseInt(b[a]||a)},getConfig:function(){var a,b,c,d,e;return a=this.$el,(d=this.intervalSelector.val())?(d=this.convertInterval(d),b=a.find(".date input"),(e=b.eq(0).val())?(c=b.eq(1).val(),c?{interval:d,start:e,end:c}:void b.eq(1).addClass("notFilled")):void b.eq(0).addClass("notFilled")):void a.find(".intervalSelector").addClass("notFilled")}}),h=c.View.extend({initialize:function(b){var c,e,f;return c=this.$el,e=new d.Selector({el:c.find(".statsSelector"),selectTips:"请选择统计类别",items:JT_GLOBAL.collections}),e.on("change",function(){return this.$el.removeClass("notFilled")}),f=new d.Selector({el:c.find(".categorySelector"),selectTips:"请选择分类",placeholder:"请输入分类",multi:!0}),f.on("change",function(){return this.$el.removeClass("notFilled")}),e.on("change",function(a){return function(){return a.selectCategory(e,f)}}(this)),c.find(".types").on("click",".btn",function(){var b;return b=a(this),b.hasClass("btn-success")?void 0:b.siblings(".btn-success").addBack().toggleClass("btn-success")}),this.categorySelector=e,this.keySelector=f,this.enableTypeSelect(b.statsType)},enableTypeSelect:function(a){var c;return c=this.$el.find(".types .btn"),c.removeClass("disabled btn-success"),~b.indexOf(["line","stack"],a)?(c.filter(":last").addClass("disabled"),c.eq(0).addClass("btn-success")):~b.indexOf(["barVertical","barHorizontal","stackBarVertical","stackBarHorizontal"],a)?(c.filter(":last").addClass("disabled"),c.eq(1).addClass("btn-success")):~b.indexOf(["pie","nestedPie"],a)?(c.filter(":not(:last)").addClass("disabled"),c.eq(2).addClass("btn-success")):c.addClass("disabled")},selectCategory:function(b,c){var d;return e("selectCategory"),d=b.val(),this._xhr&&this._xhr.abort(),this._xhr=a.getJSON("/collection/"+d+"/keys",function(a){return function(b){return a._xhr=null,c.options(b)}}(this)),this},getParams:function(){var a,c,d,e,f,g,h,i;return a=this.$el,d=this.categorySelector,(c=d.val())?(g=this.keySelector,h=g.val(),h.length?(e=function(a){return b.map(a,function(a){return"/"===a.charAt(0)?(a="/"===a.charAt(a.length-1)?a.substring(1,a.length-1):a.substring(1),{value:a,type:"reg"}):{value:a}})},f=a.find(".btn-group .btn-success").index(),i=["line","bar","pie"],{chart:i[f]||"line",category:c,keys:e(h)}):void g.$el.addClass("notFilled")):void d.$el.addClass("notFilled")}}),new(g=c.View.extend({events:{"click .typeList li":"selectType","click .result .preview":"preview","click .statsConfig .add":"add","click .statsConfig .remove":"remove","click .result .save":"save"},initialize:function(){var b;return e("initialize StatsConfigsView"),b=this.$el,this.statsConfigHtml=a("<div />").append(b.find(".statsConfig").parent().clone()).html(),this.timeConfigView=new i({el:b.find(".dateConfig")}),b.find(".result input").focus(function(){return a(this).removeClass("notFilled")}),this.statsParamsViewList=[],this.createStatsConfig(b.find(".statsConfig"))},selectType:function(c){var d;return d=a(c.currentTarget),d.hasClass("selected")?void 0:(d.siblings(".selected").addBack().toggleClass("selected"),b.each(this.statsParamsViewList,function(a){return a.enableTypeSelect(d.data("type"))}))},add:function(){var b;return b=a(this.statsConfigHtml),b.find(".add").addClass("hidden"),b.find(".remove").removeClass("hidden"),b.insertBefore(this.$el.find(".row").children(":last")),this.createStatsConfig(b.find(".statsConfig"))},remove:function(b){var c,d,e;return d=a(b.currentTarget).closest(".statsConfig"),c=this.$el.find(".statsConfig").index(d),e=this.statsParamsViewList.splice(c,1)[0],d.parent().remove(),e.remove()},createStatsConfig:function(a){var b,c;return e("createStatsConfig"),b=this.$el,c=new h({el:a,statsType:b.find(".typeList .selected").data("type")}),this.statsParamsViewList.push(c)},selectCategory:function(b,c){var d;return e("selectCategory"),d=b.val(),this._xhr&&this._xhr.abort(),this._xhr=a.getJSON("/collection/"+d+"/keys",function(a){return function(b){return a._xhr=null,c.options(b)}}(this)),this},getOptions:function(){var a,c,d,f,g,h,i,j;return a=this.$el,j=a.find(".typeList .selected").data("type"),i=this.timeConfigView.getConfig(),i&&(g=[],b.each(this.statsParamsViewList,function(a){var b;return b=a.getParams(),b?g.push(b):void 0}),g.length===this.statsParamsViewList.length)?(h=a.find(".statsName input"),f=h.val().trim(),d=a.find(".desc input").val().trim(),c={name:f,stats:g,point:{interval:i.interval},type:j,date:{start:i.start,end:i.end},desc:d},e("config %j",c),c):void 0},save:function(){var b,c,d,e;return(c=this.getOptions())?(b=this.$el,e=b.find(".statsName input"),c.name?f.get("anonymous")?void f.logIn():(d=b.find(".saveResult"),console.dir(c),a.ajax({url:"/config",type:"post",dataType:"json",contentType:"application/json",data:JSON.stringify(c)}).success(function(){return d.removeClass("hidden alert-danger").addClass("alert-success").html("已成功保证该统计配置！")}).error(function(){return d.removeClass("hidden alert-success").addClass("alert-danger").html("保存统计配置失败！")})):void e.addClass("notFilled")):void 0},preview:function(){var b,c;return(c=this.getOptions())?(this.chartView&&this.chartView.remove(),b=a('<div class="chartView" />'),b.attr("title",c.desc),b.appendTo(this.$el),seajs.use("ChartView",function(a){return function(d){var e;e=new d({el:b}),e.setOptions(c),e.show(),a.chartView=e}}(this))):void 0}}))({el:a(".StatsConfigs")})})}).call(this);