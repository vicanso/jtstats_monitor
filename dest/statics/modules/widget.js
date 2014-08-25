(function(){define("widget",["jquery","underscore","Backbone","debug"],function(a,b){var c,d,e,f,g;g=a("underscore"),c=a("jquery"),d=a("Backbone"),f=a("debug")("module:widget"),e=d.Model.extend({defaults:{edit:!1,placeholder:"",selectTips:"",multi:!1}}),b.Selector=d.View.extend({template:g.template('<div class="content"><span class="glyphicon glyphicon-plus"></span><a class="edit" href="javascript:;"><span class="glyphicon glyphicon-edit"></span></a><div class="userInput hidden"><input type="text" placeholder="<%= placeholder %>" /></div><span class="selectInput"><span class="placeholder"><%= selectTips %></span><span class="items"></span></span></div><ul class="selectList"><div class="arrowTop1"></div><div class="arrowTop2"></div><%= html %></ul>'),colors:["#0c92c9","#0cc99a","#ffd200","#ff7f02","#ff0202","#ff02af","#c20cff","#4c16ff","#1f63ff","#28fff7"],events:{"click .selectList li":"toggle","click .content .edit":"toggleEdit"},initialize:function(a){return a=g.omit(a,"el"),f("initialize selector %j",a),this.model=new e(a),this.listenTo(this.model,"change:edit",this.editModeChange),this.listenTo(this.model,"change:items",this.render),this.render(),this},toggleEdit:function(){return this.model.set("edit",!this.model.get("edit"))},editModeChange:function(a,b){var c,d,e;return c=this.$el,e=c.find(".content .userInput"),d=c.find(".content .selectInput"),c.find(".content .userInput, .content .selectInput").toggleClass("hidden"),b?c.addClass("editMode"):c.removeClass("editMode")},options:function(a){return a?this.model.set("items",a):this.model.get("items")},getSelectListHtml:function(){var a,b;return b=g.template('<li><span class="checkIcon"></span><span class="dot" style="background-color:<%= color %>;"></span><%= name %></li>'),a=g.map(this.model.get("items"),function(a){return function(c,d){var e;return e=a.colors[d%a.colors.length],b({name:c,color:e})}}(this)),a.join("")},toggle:function(a){var b,d,e,f,h;return e=c(a.currentTarget),this.model.get("multi")?e.hasClass("selected")?(e.removeClass("selected"),e.find(".checkIcon").removeClass("glyphicon glyphicon-ok")):(e.addClass("selected"),e.find(".checkIcon").addClass("glyphicon glyphicon-ok")):e.hasClass("selected")||(e.addClass("selected").find(".checkIcon").addClass("glyphicon glyphicon-ok"),e.siblings(".selected").removeClass("selected").find(".checkIcon").removeClass("glyphicon glyphicon-ok")),b=this.$el,h=this.$el.find(".selectList .selected"),d=g.map(h,function(a){return a=c(a),'<span class="item">'+a.html()+"</span>"}),f=b.find(".content .placeholder"),h.length?f.addClass("hidden"):f.removeClass("hidden"),b.find(".content .items").html(d.join("")),this.trigger("change")},render:function(){var a,b,c,d,e;return a=this.$el,c=this.getSelectListHtml(),d=this.model.get("placeholder"),e=this.model.get("selectTips"),b=this.model.toJSON(),b.html=c,a.addClass("uiSelector").html(this.template(b))},val:function(){var a;return a=this.model.get("edit")?[this.$el.find(".content .userInput input").val().trim()]:g.map(this.$el.find(".content .items .item"),function(a){return c(a).text()}),this.model.get("multi")?a:a[0]},reset:function(){return this.render()}})})}).call(this);