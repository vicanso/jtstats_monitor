(function(){define("user",["jquery","underscore","async","Backbone"],function(a,b){var c,d,e,f,g,h,i;c=a("jquery"),i=a("underscore"),f=a("async"),d=a("Backbone"),g=function(){},i.extend(b,d.Events),e=d.Model.extend({defaults:{anonymous:""},url:function(){return"/user?cache=false"},initialize:function(){return this.fetch()}}),h=new e,h.on("change:anonymous",function(a,c){var d;return d="logged",c&&(d="unlogged"),"logged"===d&&h.set("id","vicanso"),b.trigger("status",d)}),b.isLogedIn=function(){return!h.get("anonymous")},b.logOut=function(){return h.destroy({success:function(a,b){return h.set("name",""),h.set("id",""),i.each(b,function(a,b){return h.set(b,a)})},error:function(){return console.dir("error")}})},b.logIn=function(){var a,b,d;return d=c('<div class="maskContainer" />').appendTo("body"),b='<div class="logInDialog"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><a href="javascript:;" class="glyphicon glyphicon-remove close"></a>登录</h3></div></div><div class="panel-body"><input type="text" class="form-control user" autofocus placeholder="用户名" /><input type="password" class="form-control password" autofocus placeholder="密码" /><div class="alert hidden"></div><div class="row"><div class="col-xs-6"><a href="javascript:;" class="btn btn-success register">注册</a></div><div class="col-xs-6"><a href="javascript:;" class="btn btn-primary logIn">登录</a></div></div></div></div>',a=c(b).appendTo("body"),a.on("click",".close, .logIn, .register",function(){var b,e,f,g,j,k,l;return e=c(this),e.hasClass("logIn")||e.hasClass("register")?(k=a.find("input.user"),(l=k.val().trim())?(g=a.find("input.password"),(f=g.val().trim())?(b=a.find(".alert"),b.removeClass("alert-warning hidden"),b.addClass("alert-info"),b.text("正在提交中，请稍候..."),j="logIn",e.hasClass("register")&&(j="register"),seajs.use("crypto",function(c){var e;return h.set("type",j),e=c.SHA1(f).toString(),"logIn"===j&&(e=c.SHA1(""+e+"_"+h.get("hash")).toString()),h.set("pwd",e),h.set("name",l),h.save({},{error:function(){return b.removeClass("alert-info").addClass("alert-warning"),b.text("register"===j?"注册失败！":"登录失败！")},success:function(b,c){return i.each(c,function(a,c){return b.set(c,a)}),a.remove(),d.remove()}})})):void g.focus()):void k.focus()):(a.remove(),d.remove())})},b.get=function(a){return h.get(a)}})}).call(this);
(function(){define("widget",["jquery","underscore","Backbone","debug"],function(a,b){var c,d,e,f,g;g=a("underscore"),c=a("jquery"),d=a("Backbone"),f=a("debug")("module:widget"),e=d.Model.extend({defaults:{edit:!1,placeholder:"",selectTips:"",multi:!1}}),b.Selector=d.View.extend({template:g.template('<div class="content"><span class="glyphicon glyphicon-plus"></span><a class="edit" href="javascript:;"><span class="glyphicon glyphicon-edit"></span></a><div class="userInput hidden"><input type="text" placeholder="<%= placeholder %>" /></div><span class="selectInput"><span class="placeholder"><%= selectTips %></span><span class="items"></span></span></div><ul class="selectList"><div class="arrowTop1"></div><div class="arrowTop2"></div><%= html %></ul>'),colors:["#0c92c9","#0cc99a","#ffd200","#ff7f02","#ff0202","#ff02af","#c20cff","#4c16ff","#1f63ff","#28fff7"],events:{"click .selectList li":"toggle","click .content .edit":"toggleEdit"},initialize:function(a){return a=g.omit(a,"el"),f("initialize selector %j",a),this.model=new e(a),this.listenTo(this.model,"change:edit",this.editModeChange),this.listenTo(this.model,"change:items",this.render),this.render(),this},toggleEdit:function(){return this.model.set("edit",!this.model.get("edit"))},editModeChange:function(a,b){var c,d,e;return c=this.$el,e=c.find(".content .userInput"),d=c.find(".content .selectInput"),c.find(".content .userInput, .content .selectInput").toggleClass("hidden"),b?c.addClass("editMode"):c.removeClass("editMode")},options:function(a){return a?this.model.set("items",a):this.model.get("items")},getSelectListHtml:function(){var a,b;return b=g.template('<li><span class="checkIcon"></span><span class="dot" style="background-color:<%= color %>;"></span><%= name %></li>'),a=g.map(this.model.get("items"),function(a){return function(c,d){var e;return e=a.colors[d%a.colors.length],b({name:c,color:e})}}(this)),a.join("")},toggle:function(a){var b,d,e,f,h;return e=c(a.currentTarget),this.model.get("multi")?e.hasClass("selected")?(e.removeClass("selected"),e.find(".checkIcon").removeClass("glyphicon glyphicon-ok")):(e.addClass("selected"),e.find(".checkIcon").addClass("glyphicon glyphicon-ok")):e.hasClass("selected")||(e.addClass("selected").find(".checkIcon").addClass("glyphicon glyphicon-ok"),e.siblings(".selected").removeClass("selected").find(".checkIcon").removeClass("glyphicon glyphicon-ok")),b=this.$el,h=this.$el.find(".selectList .selected"),d=g.map(h,function(a){return a=c(a),'<span class="item">'+a.html()+"</span>"}),f=b.find(".content .placeholder"),h.length?f.addClass("hidden"):f.removeClass("hidden"),b.find(".content .items").html(d.join("")),this.trigger("change")},render:function(){var a,b,c,d,e;return a=this.$el,c=this.getSelectListHtml(),d=this.model.get("placeholder"),e=this.model.get("selectTips"),b=this.model.toJSON(),b.html=c,a.addClass("uiSelector").html(this.template(b))},val:function(){var a;return a=this.model.get("edit")?[this.$el.find(".content .userInput input").val().trim()]:g.map(this.$el.find(".content .items .item"),function(a){return c(a).text()}),this.model.get("multi")?a:a[0]},reset:function(){return this.render()}})})}).call(this);
(function(){seajs.use(["jquery","underscore","async","user"],function(a,b,c,d){var e,f;return f=Backbone.View.extend({events:{"click .logIn":"logIn","click .logOut":"logOut"},initialize:function(){return this.listenTo(d,"status",this.changeStatus)},logIn:function(){return d.logIn()},logOut:function(){return d.logOut()},changeStatus:function(a){var b,c,d;return b=this.$el,c=b.find(".logIn"),d=b.find(".logOut"),"logged"!==a?(c.removeClass("hidden"),d.addClass("hidden")):(c.addClass("hidden"),d.removeClass("hidden"))}}),e=Backbone.View.extend({initialize:function(){return this.listenTo(d,"status",this.changeStatus)},changeStatus:function(){return this.$el.find(".name").text(d.get("name"))}}),new f({el:a(".menuContainer")}),new e({el:a(".headerContainer")}),b.delay(function(){return"development"===CONFIG.env?seajs.emit("loadComplete"):void 0},1e3)})}).call(this);
(function(){seajs.use(["jquery","underscore","widget"],function(a,b,c){return new c.Selector({el:a(".selector"),items:JT_GLOBAL.collections})})}).call(this);