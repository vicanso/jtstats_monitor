(function(){seajs.use(["jquery","underscore","Backbone","widget","debug","user","async"],function(a,b,c,d,e,f,g){return g.waterfall([function(a){return f.isLogedIn()?a(null,f.get("sets")):f.on("status",function(b){return b?a(null,f.get("sets")):a(new Error("user is not login"))})},function(b,c){return a.ajax({url:"/set/"+b[0],dataType:"json"}).success(function(a){return c(null,a)}).error(function(a){return c(a)})},function(c){return seajs.use("ChartView",function(d){var e;return e=a(".charListContainer"),b.each(c.configs,function(b){var c,f;return f=a("<div />"),f.addClass("chartView col-xs-"+b.width),f.appendTo(e),c=new d({el:f}),c.setOptions(b),c.show()})})}])})}).call(this);