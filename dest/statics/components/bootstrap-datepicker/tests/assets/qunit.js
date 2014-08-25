!function(a){function b(){y.autorun=!0,y.currentModule&&p("moduleDone",x,{name:y.currentModule,failed:y.moduleStats.bad,passed:y.moduleStats.all-y.moduleStats.bad,total:y.moduleStats.all});var a=n("qunit-banner"),b=n("qunit-tests"),c=+new Date-y.started,d=y.stats.all-y.stats.bad,e=["Tests completed in ",c," milliseconds.<br/>",'<span class="passed">',d,'</span> tests of <span class="total">',y.stats.all,'</span> passed, <span class="failed">',y.stats.bad,"</span> failed."].join("");if(a&&(a.className=y.stats.bad?"qunit-fail":"qunit-pass"),b&&(n("qunit-testresult").innerHTML=e),y.altertitle&&"undefined"!=typeof document&&document.title&&(document.title=[y.stats.bad?"✖":"✔",document.title.replace(/^[\u2714\u2716] /i,"")].join(" ")),y.reorder&&s.sessionStorage&&0===y.stats.bad)for(var f,g=0;g<sessionStorage.length;g++)f=sessionStorage.key(g++),0===f.indexOf("qunit-test-")&&sessionStorage.removeItem(f);p("done",x,{failed:y.stats.bad,passed:d,total:y.stats.all,runtime:c})}function c(a){var b=y.filter,c=!1;if(!b)return!0;var d="!"===b.charAt(0);return d&&(b=b.slice(1)),-1!==a.indexOf(b)?!d:(d&&(c=!0),c)}function d(a,b){if(b=b||3,a.stacktrace)return a.stacktrace.split("\n")[b+3];if(a.stack){var c=a.stack.split("\n");return/^error$/i.test(c[0])&&c.shift(),c[b]}if(a.sourceURL){if(/qunit.js$/.test(a.sourceURL))return;return a.sourceURL+":"+a.line}}function e(a){try{throw new Error}catch(b){return d(b,a)}}function f(a){return a?(a+="",a.replace(/[\&<>]/g,function(a){switch(a){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";default:return a}})):""}function g(a,b){y.queue.push(a),y.autorun&&!y.blocking&&h(b)}function h(c){function d(){h(c)}var e=(new Date).getTime();for(y.depth=y.depth?y.depth+1:1;y.queue.length&&!y.blocking;){if(!(!s.setTimeout||y.updateRate<=0||(new Date).getTime()-e<y.updateRate)){a.setTimeout(d,13);break}y.queue.shift()()}y.depth--,!c||y.blocking||y.queue.length||0!==y.depth||b()}function i(){if(y.pollution=[],y.noglobals)for(var b in a)v.call(a,b)&&y.pollution.push(b)}function j(){var a=y.pollution;i();var b=k(y.pollution,a);b.length>0&&x.pushFailure("Introduced global variable(s): "+b.join(", "));var c=k(a,y.pollution);c.length>0&&x.pushFailure("Deleted global variable(s): "+c.join(", "))}function k(a,b){for(var c=a.slice(),d=0;d<c.length;d++)for(var e=0;e<b.length;e++)if(c[d]===b[e]){c.splice(d,1),d--;break}return c}function l(b,c){for(var d in c)void 0===c[d]?delete b[d]:("constructor"!==d||b!==a)&&(b[d]=c[d]);return b}function m(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent?a.attachEvent("on"+b,c):c()}function n(a){return!("undefined"==typeof document||!document||!document.getElementById)&&document.getElementById(a)}function o(a){return function(b){y[a].push(b)}}function p(a,b,c){var d;if(x.hasOwnProperty(a))x[a].call(b,c);else{d=y[a];for(var e=0;e<d.length;e++)d[e].call(b,c)}}function q(a){for(var b,c="",d=0;a[d];d++)b=a[d],3===b.nodeType||4===b.nodeType?c+=b.nodeValue:8!==b.nodeType&&(c+=q(b.childNodes));return c}function r(a,b){if(b.indexOf)return b.indexOf(a);for(var c=0,d=b.length;d>c;c++)if(b[c]===a)return c;return-1}var s={setTimeout:"undefined"!=typeof a.setTimeout,sessionStorage:function(){var a="qunit-test-string";try{return sessionStorage.setItem(a,a),sessionStorage.removeItem(a),!0}catch(b){return!1}}()},t=0,u=Object.prototype.toString,v=Object.prototype.hasOwnProperty,w=function(a,b,c,d,e){this.name=a,this.testName=b,this.expected=c,this.async=d,this.callback=e,this.assertions=[]};w.prototype={init:function(){var a=n("qunit-tests");if(a){var b=document.createElement("strong");b.innerHTML="Running "+this.name;var c=document.createElement("li");c.appendChild(b),c.className="running",c.id=this.id="test-output"+t++,a.appendChild(c)}},setup:function(){if(this.module!=y.previousModule?(y.previousModule&&p("moduleDone",x,{name:y.previousModule,failed:y.moduleStats.bad,passed:y.moduleStats.all-y.moduleStats.bad,total:y.moduleStats.all}),y.previousModule=this.module,y.moduleStats={all:0,bad:0},p("moduleStart",x,{name:this.module})):y.autorun&&p("moduleStart",x,{name:this.module}),y.current=this,this.testEnvironment=l({setup:function(){},teardown:function(){}},this.moduleTestEnvironment),p("testStart",x,{name:this.testName,module:this.module}),x.current_testEnvironment=this.testEnvironment,y.pollution||i(),y.notrycatch)return void this.testEnvironment.setup.call(this.testEnvironment);try{this.testEnvironment.setup.call(this.testEnvironment)}catch(a){x.pushFailure("Setup failed on "+this.testName+": "+a.message,d(a,1))}},run:function(){y.current=this;var a=n("qunit-testresult");if(a&&(a.innerHTML="Running: <br/>"+this.name),this.async&&x.stop(),y.notrycatch)return void this.callback.call(this.testEnvironment);try{this.callback.call(this.testEnvironment)}catch(b){x.pushFailure("Died on test #"+(this.assertions.length+1)+": "+b.message,d(b,1)),i(),y.blocking&&x.start()}},teardown:function(){if(y.current=this,y.notrycatch)return void this.testEnvironment.teardown.call(this.testEnvironment);try{this.testEnvironment.teardown.call(this.testEnvironment)}catch(a){x.pushFailure("Teardown failed on "+this.testName+": "+a.message,d(a,1))}j()},finish:function(){y.current=this,null!=this.expected&&this.expected!=this.assertions.length?x.pushFailure("Expected "+this.expected+" assertions, but "+this.assertions.length+" were run"):null!=this.expected||this.assertions.length||x.pushFailure("Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.");var b,c,d=0,e=0,f=n("qunit-tests");if(y.stats.all+=this.assertions.length,y.moduleStats.all+=this.assertions.length,f){var g=document.createElement("ol");for(c=0;c<this.assertions.length;c++){var h=this.assertions[c];b=document.createElement("li"),b.className=h.result?"pass":"fail",b.innerHTML=h.message||(h.result?"okay":"failed"),g.appendChild(b),h.result?d++:(e++,y.stats.bad++,y.moduleStats.bad++)}x.config.reorder&&s.sessionStorage&&(e?sessionStorage.setItem("qunit-test-"+this.module+"-"+this.testName,e):sessionStorage.removeItem("qunit-test-"+this.module+"-"+this.testName)),0===e&&(g.style.display="none");var i=document.createElement("strong");i.innerHTML=this.name+" <b class='counts'>(<b class='failed'>"+e+"</b>, <b class='passed'>"+d+"</b>, "+this.assertions.length+")</b>";var j=document.createElement("a");j.innerHTML="Rerun",j.href=x.url({filter:q([i]).replace(/\([^)]+\)$/,"").replace(/(^\s*|\s*$)/g,"")}),m(i,"click",function(){var a=i.nextSibling.nextSibling,b=a.style.display;a.style.display="none"===b?"block":"none"}),m(i,"dblclick",function(b){var c=b&&b.target?b.target:a.event.srcElement;("span"==c.nodeName.toLowerCase()||"b"==c.nodeName.toLowerCase())&&(c=c.parentNode),a.location&&"strong"===c.nodeName.toLowerCase()&&(a.location=x.url({filter:q([c]).replace(/\([^)]+\)$/,"").replace(/(^\s*|\s*$)/g,"")}))}),b=n(this.id),b.className=e?"fail":"pass",b.removeChild(b.firstChild),b.appendChild(i),b.appendChild(j),b.appendChild(g)}else for(c=0;c<this.assertions.length;c++)this.assertions[c].result||(e++,y.stats.bad++,y.moduleStats.bad++);x.reset(),p("testDone",x,{name:this.testName,module:this.module,failed:e,passed:this.assertions.length-e,total:this.assertions.length})},queue:function(){function a(){g(function(){b.setup()}),g(function(){b.run()}),g(function(){b.teardown()}),g(function(){b.finish()})}var b=this;g(function(){b.init()});var c=x.config.reorder&&s.sessionStorage&&+sessionStorage.getItem("qunit-test-"+this.module+"-"+this.testName);c?a():g(a,!0)}};var x={module:function(a,b){y.currentModule=a,y.currentModuleTestEnviroment=b},asyncTest:function(a,b,c){2===arguments.length&&(c=b,b=null),x.test(a,b,c,!0)},test:function(a,b,d,e){var g='<span class="test-name">'+f(a)+"</span>";if(2===arguments.length&&(d=b,b=null),y.currentModule&&(g='<span class="module-name">'+y.currentModule+"</span>: "+g),c(y.currentModule+": "+a)){var h=new w(g,a,b,e,d);h.module=y.currentModule,h.moduleTestEnvironment=y.currentModuleTestEnviroment,h.queue()}},expect:function(a){y.current.expected=a},ok:function(a,b){if(!y.current)throw new Error("ok() assertion outside test context, was "+e(2));a=!!a;var c={result:a,message:b};if(b=f(b||(a?"okay":"failed")),!a){var d=e(2);d&&(c.source=d,b+='<table><tr class="test-source"><th>Source: </th><td><pre>'+f(d)+"</pre></td></tr></table>")}p("log",x,c),y.current.assertions.push({result:a,message:b})},equal:function(a,b,c){x.push(b==a,a,b,c)},notEqual:function(a,b,c){x.push(b!=a,a,b,c)},deepEqual:function(a,b,c){x.push(x.equiv(a,b),a,b,c)},notDeepEqual:function(a,b,c){x.push(!x.equiv(a,b),a,b,c)},strictEqual:function(a,b,c){x.push(b===a,a,b,c)},notStrictEqual:function(a,b,c){x.push(b!==a,a,b,c)},raises:function(a,b,c){var d,e=!1;"string"==typeof b&&(c=b,b=null);try{a.call(y.current.testEnvironment)}catch(f){d=f}d&&(b?"regexp"===x.objectType(b)?e=b.test(d):d instanceof b?e=!0:b.call({},d)===!0&&(e=!0):e=!0),x.ok(e,c)},start:function(b){y.semaphore-=b||1,y.semaphore>0||(y.semaphore<0&&(y.semaphore=0),s.setTimeout?a.setTimeout(function(){y.semaphore>0||(y.timeout&&clearTimeout(y.timeout),y.blocking=!1,h(!0))},13):(y.blocking=!1,h(!0)))},stop:function(b){y.semaphore+=b||1,y.blocking=!0,y.testTimeout&&s.setTimeout&&(clearTimeout(y.timeout),y.timeout=a.setTimeout(function(){x.ok(!1,"Test timed out"),y.semaphore=1,x.start()},y.testTimeout))}};!function(){function a(){}a.prototype=x,x=new a,x.constructor=a}(),x.equals=function(){x.push(!1,!1,!1,"QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead")},x.same=function(){x.push(!1,!1,!1,"QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead")};var y={queue:[],blocking:!0,hidepassed:!1,reorder:!0,altertitle:!0,urlConfig:["noglobals","notrycatch"],begin:[],done:[],log:[],testStart:[],testDone:[],moduleStart:[],moduleDone:[]};!function(){var b,c=a.location||{search:"",protocol:"file:"},d=c.search.slice(1).split("&"),e=d.length,f={};if(d[0])for(var g=0;e>g;g++)b=d[g].split("="),b[0]=decodeURIComponent(b[0]),b[1]=b[1]?decodeURIComponent(b[1]):!0,f[b[0]]=b[1];x.urlParams=f,y.filter=f.filter,x.isLocal="file:"===c.protocol}(),("undefined"==typeof exports||"undefined"==typeof require)&&(l(a,x),a.QUnit=x),l(x,{config:y,init:function(){l(y,{stats:{all:0,bad:0},moduleStats:{all:0,bad:0},started:+new Date,updateRate:1e3,blocking:!1,autostart:!0,autorun:!1,filter:"",queue:[],semaphore:0});var a=n("qunit");a&&(a.innerHTML='<h1 id="qunit-header">'+f(document.title)+'</h1><h2 id="qunit-banner"></h2><div id="qunit-testrunner-toolbar"></div><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>');var b=n("qunit-tests"),c=n("qunit-banner"),d=n("qunit-testresult");b&&(b.innerHTML=""),c&&(c.className=""),d&&d.parentNode.removeChild(d),b&&(d=document.createElement("p"),d.id="qunit-testresult",d.className="result",b.parentNode.insertBefore(d,b),d.innerHTML="Running...<br/>&nbsp;")},reset:function(){if(a.jQuery)jQuery("#qunit-fixture").html(y.fixture);else{var b=n("qunit-fixture");b&&(b.innerHTML=y.fixture)}},triggerEvent:function(a,b,c){document.createEvent?(c=document.createEvent("MouseEvents"),c.initMouseEvent(b,!0,!0,a.ownerDocument.defaultView,0,0,0,0,0,!1,!1,!1,!1,0,null),a.dispatchEvent(c)):a.fireEvent&&a.fireEvent("on"+b)},is:function(a,b){return x.objectType(b)==a},objectType:function(a){if("undefined"==typeof a)return"undefined";if(null===a)return"null";var b=u.call(a).match(/^\[object\s(.*)\]$/)[1]||"";switch(b){case"Number":return isNaN(a)?"nan":"number";case"String":case"Boolean":case"Array":case"Date":case"RegExp":case"Function":return b.toLowerCase()}return"object"==typeof a?"object":void 0},push:function(a,b,c,d){if(!y.current)throw new Error("assertion outside test context, was "+e());var g={result:a,message:d,actual:b,expected:c};d=f(d)||(a?"okay":"failed"),d='<span class="test-message">'+d+"</span>";var h=d;if(!a){c=f(x.jsDump.parse(c)),b=f(x.jsDump.parse(b)),h+='<table><tr class="test-expected"><th>Expected: </th><td><pre>'+c+"</pre></td></tr>",b!=c&&(h+='<tr class="test-actual"><th>Result: </th><td><pre>'+b+"</pre></td></tr>",h+='<tr class="test-diff"><th>Diff: </th><td><pre>'+x.diff(c,b)+"</pre></td></tr>");var i=e();i&&(g.source=i,h+='<tr class="test-source"><th>Source: </th><td><pre>'+f(i)+"</pre></td></tr>"),h+="</table>"}p("log",x,g),y.current.assertions.push({result:!!a,message:h})},pushFailure:function(a,b){var c={result:!1,message:a},d=f(a);b&&(c.source=b,d+='<table><tr class="test-source"><th>Source: </th><td><pre>'+f(b)+"</pre></td></tr></table>"),p("log",x,c),y.current.assertions.push({result:!1,message:d})},url:function(b){b=l(l({},x.urlParams),b);var c,d="?";for(c in b)v.call(b,c)&&(d+=encodeURIComponent(c)+"="+encodeURIComponent(b[c])+"&");return a.location.pathname+d.slice(0,-1)},extend:l,id:n,addEvent:m}),l(x.constructor.prototype,{begin:o("begin"),done:o("done"),log:o("log"),testStart:o("testStart"),testDone:o("testDone"),moduleStart:o("moduleStart"),moduleDone:o("moduleDone")}),("undefined"==typeof document||"complete"===document.readyState)&&(y.autorun=!0),x.load=function(){p("begin",x,{});var b=l({},y);x.init(),l(y,b),y.blocking=!1;for(var c,d="",e=y.urlConfig.length,f=0;e>f;f++)c=y.urlConfig[f],y[c]=x.urlParams[c],d+='<label><input name="'+c+'" type="checkbox"'+(y[c]?' checked="checked"':"")+">"+c+"</label>";var g=n("qunit-userAgent");g&&(g.innerHTML=navigator.userAgent);var h=n("qunit-header");h&&(h.innerHTML='<a href="'+x.url({filter:void 0})+'"> '+h.innerHTML+"</a> "+d,m(h,"change",function(b){var c={};c[b.target.name]=b.target.checked?!0:void 0,a.location=x.url(c)}));var i=n("qunit-testrunner-toolbar");if(i){var j=document.createElement("input");if(j.type="checkbox",j.id="qunit-filter-pass",m(j,"click",function(){var a=document.getElementById("qunit-tests");if(j.checked)a.className=a.className+" hidepass";else{var b=" "+a.className.replace(/[\n\t\r]/g," ")+" ";a.className=b.replace(/ hidepass /," ")}s.sessionStorage&&(j.checked?sessionStorage.setItem("qunit-filter-passed-tests","true"):sessionStorage.removeItem("qunit-filter-passed-tests"))}),y.hidepassed||s.sessionStorage&&sessionStorage.getItem("qunit-filter-passed-tests")){j.checked=!0;var k=document.getElementById("qunit-tests");k.className=k.className+" hidepass"}i.appendChild(j);var o=document.createElement("label");o.setAttribute("for","qunit-filter-pass"),o.innerHTML="Hide passed tests",i.appendChild(o)}var q=n("qunit-fixture");q&&(y.fixture=q.innerHTML),y.autostart&&x.start()},m(a,"load",x.load),a.onerror=function(a,b,c){x.config.current?x.pushFailure(a,b+":"+c):x.test("global failure",function(){x.pushFailure(a,b+":"+c)})},x.equiv=function(){function a(a,b,c){var d=x.objectType(a);return d?"function"===x.objectType(b[d])?b[d].apply(b,c):b[d]:void 0}var b,c=[],d=[],e=Object.getPrototypeOf||function(a){return a.__proto__},f=function(){function a(a,b){return a instanceof b.constructor||b instanceof a.constructor?b==a:b===a}return{string:a,"boolean":a,number:a,"null":a,undefined:a,nan:function(a){return isNaN(a)},date:function(a,b){return"date"===x.objectType(a)&&b.valueOf()===a.valueOf()},regexp:function(a,b){return"regexp"===x.objectType(a)&&b.source===a.source&&b.global===a.global&&b.ignoreCase===a.ignoreCase&&b.multiline===a.multiline},"function":function(){var a=c[c.length-1];return a!==Object&&"undefined"!=typeof a},array:function(a,c){var e,f,g,h;if("array"!==x.objectType(a))return!1;if(h=c.length,h!==a.length)return!1;for(d.push(c),e=0;h>e;e++){for(g=!1,f=0;f<d.length;f++)d[f]===c[e]&&(g=!0);if(!g&&!b(c[e],a[e]))return d.pop(),!1}return d.pop(),!0},object:function(a,f){var g,h,i,j=!0,k=[],l=[];if(f.constructor!==a.constructor&&!(null===e(f)&&e(a)===Object.prototype||null===e(a)&&e(f)===Object.prototype))return!1;c.push(f.constructor),d.push(f);for(g in f){for(i=!1,h=0;h<d.length;h++)d[h]===f[g]&&(i=!0);if(k.push(g),!i&&!b(f[g],a[g])){j=!1;break}}c.pop(),d.pop();for(g in a)l.push(g);return j&&b(k.sort(),l.sort())}}}();return b=function(){var b=Array.prototype.slice.apply(arguments);return b.length<2?!0:function(b,c){return b===c?!0:null===b||null===c||"undefined"==typeof b||"undefined"==typeof c||x.objectType(b)!==x.objectType(c)?!1:a(b,f,[c,b])}(b[0],b[1])&&arguments.callee.apply(this,b.splice(1,b.length-1))}}(),x.jsDump=function(){function a(a){return'"'+a.toString().replace(/"/g,'\\"')+'"'}function b(a){return a+""}function c(a,b,c){var d=f.separator(),e=f.indent(),g=f.indent(1);return b.join&&(b=b.join(","+d+g)),b?[a,g+b,e+c].join(d):a+c}function d(a,b){var d=a.length,e=new Array(d);for(this.up();d--;)e[d]=this.parse(a[d],void 0,b);return this.down(),c("[",e,"]")}var e=/^function (\w+)/,f={parse:function(a,b,c){c=c||[];var d=this.parsers[b||this.typeOf(a)];b=typeof d;var e=r(a,c);if(-1!=e)return"recursion("+(e-c.length)+")";if("function"==b){c.push(a);var f=d.call(this,a,c);return c.pop(),f}return"string"==b?d:this.parsers.error},typeOf:function(a){var b;return b=null===a?"null":"undefined"==typeof a?"undefined":x.is("RegExp",a)?"regexp":x.is("Date",a)?"date":x.is("Function",a)?"function":void 0!==typeof a.setInterval&&"undefined"!=typeof a.document&&"undefined"==typeof a.nodeType?"window":9===a.nodeType?"document":a.nodeType?"node":"[object Array]"===u.call(a)||"number"==typeof a.length&&"undefined"!=typeof a.item&&(a.length?a.item(0)===a[0]:null===a.item(0)&&"undefined"==typeof a[0])?"array":typeof a},separator:function(){return this.multiline?this.HTML?"<br />":"\n":this.HTML?"&nbsp;":" "},indent:function(a){if(!this.multiline)return"";var b=this.indentChar;return this.HTML&&(b=b.replace(/\t/g,"   ").replace(/ /g,"&nbsp;")),new Array(this._depth_+(a||0)).join(b)},up:function(a){this._depth_+=a||1},down:function(a){this._depth_-=a||1},setParser:function(a,b){this.parsers[a]=b},quote:a,literal:b,join:c,_depth_:1,parsers:{window:"[Window]",document:"[Document]",error:"[ERROR]",unknown:"[Unknown]","null":"null",undefined:"undefined","function":function(a){var b="function",d="name"in a?a.name:(e.exec(a)||[])[1];return d&&(b+=" "+d),b+="(",b=[b,x.jsDump.parse(a,"functionArgs"),"){"].join(""),c(b,x.jsDump.parse(a,"functionCode"),"}")},array:d,nodelist:d,arguments:d,object:function(a,b){var d,e,f,g,h=[];if(x.jsDump.up(),Object.keys)d=Object.keys(a);else{d=[];for(e in a)d.push(e)}for(d.sort(),g=0;g<d.length;g++)e=d[g],f=a[e],h.push(x.jsDump.parse(e,"key")+": "+x.jsDump.parse(f,void 0,b));return x.jsDump.down(),c("{",h,"}")},node:function(a){var b=x.jsDump.HTML?"&lt;":"<",c=x.jsDump.HTML?"&gt;":">",d=a.nodeName.toLowerCase(),e=b+d;for(var f in x.jsDump.DOMAttrs){var g=a[x.jsDump.DOMAttrs[f]];g&&(e+=" "+f+"="+x.jsDump.parse(g,"attribute"))}return e+c+b+"/"+d+c},functionArgs:function(a){var b=a.length;if(!b)return"";for(var c=new Array(b);b--;)c[b]=String.fromCharCode(97+b);return" "+c.join(", ")+" "},key:a,functionCode:"[code]",attribute:a,string:a,date:a,regexp:b,number:b,"boolean":b},DOMAttrs:{id:"id",name:"name","class":"className"},HTML:!1,indentChar:"  ",multiline:!0};return f}(),x.diff=function(){function a(a,b){var c,d={},e={};for(c=0;c<b.length;c++)null==d[b[c]]&&(d[b[c]]={rows:[],o:null}),d[b[c]].rows.push(c);for(c=0;c<a.length;c++)null==e[a[c]]&&(e[a[c]]={rows:[],n:null}),e[a[c]].rows.push(c);for(c in d)v.call(d,c)&&1==d[c].rows.length&&"undefined"!=typeof e[c]&&1==e[c].rows.length&&(b[d[c].rows[0]]={text:b[d[c].rows[0]],row:e[c].rows[0]},a[e[c].rows[0]]={text:a[e[c].rows[0]],row:d[c].rows[0]});for(c=0;c<b.length-1;c++)null!=b[c].text&&null==b[c+1].text&&b[c].row+1<a.length&&null==a[b[c].row+1].text&&b[c+1]==a[b[c].row+1]&&(b[c+1]={text:b[c+1],row:b[c].row+1},a[b[c].row+1]={text:a[b[c].row+1],row:c+1});for(c=b.length-1;c>0;c--)null!=b[c].text&&null==b[c-1].text&&b[c].row>0&&null==a[b[c].row-1].text&&b[c-1]==a[b[c].row-1]&&(b[c-1]={text:b[c-1],row:b[c].row-1},a[b[c].row-1]={text:a[b[c].row-1],row:c-1});return{o:a,n:b}}return function(b,c){b=b.replace(/\s+$/,""),c=c.replace(/\s+$/,"");var d,e=a(""===b?[]:b.split(/\s+/),""===c?[]:c.split(/\s+/)),f="",g=b.match(/\s+/g);null==g?g=[" "]:g.push(" ");var h=c.match(/\s+/g);if(null==h?h=[" "]:h.push(" "),0===e.n.length)for(d=0;d<e.o.length;d++)f+="<del>"+e.o[d]+g[d]+"</del>";else{if(null==e.n[0].text)for(c=0;c<e.o.length&&null==e.o[c].text;c++)f+="<del>"+e.o[c]+g[c]+"</del>";for(d=0;d<e.n.length;d++)if(null==e.n[d].text)f+="<ins>"+e.n[d]+h[d]+"</ins>";else{var i="";for(c=e.n[d].row+1;c<e.o.length&&null==e.o[c].text;c++)i+="<del>"+e.o[c]+g[c]+"</del>";f+=" "+e.n[d].text+h[d]+i}}return f}}(),("undefined"!=typeof exports||"undefined"!=typeof require)&&l(exports,x)}(function(){return this}.call());