function waitFor(testFx,onReady,timeOutMillis){var maxtimeOutMillis=timeOutMillis?timeOutMillis:10001,start=(new Date).getTime(),condition=!1,interval=setInterval(function(){(new Date).getTime()-start<maxtimeOutMillis&&!condition?condition="string"==typeof testFx?eval(testFx):testFx():condition?("string"==typeof onReady?eval(onReady):onReady(),clearInterval(interval)):(console.log("'waitFor()' timeout"),phantom.exit(1))},100)}function readFileLines(a){for(var b=fs.open(a,"r"),c=[];!b.atEnd();)c.push(b.readLine());return b.close(),c}var system=require("system");2!==system.args.length&&(console.log("Usage: run-qunit.js URL"),phantom.exit(1));var fs=require("fs"),page=require("webpage").create();page.onConsoleMessage=function(a){console.log(a)},page.onError=function(a,b){console.log(a),b.forEach(function(a){console.log("  ",a.file,":",a.line)})};var _openPath=phantom.args[0].replace(/^.*(\\|\/)/,""),openPath=_openPath,origdir="../js/",basedir="../instrumented/",coverageBase=fs.read("_coverage.html");if(fs.exists(basedir)){for(var script=/<script.*><\/script>/g,src=/src=(["'])(.*?)\1/,contents=fs.read(openPath),_contents=contents,srcs=[],s;script.exec(contents);)s=src.exec(RegExp.lastMatch)[2],s&&-1!=s.indexOf(origdir)&&(_contents=_contents.replace(s,s.replace(origdir,basedir)));_contents!=contents&&(openPath+=".cov.html",fs.write(openPath,_contents))}page.open(openPath,function(a){if("success"!==a)console.log("Unable to access network"),phantom.exit(1);else{if(fs.exists(basedir))for(var b=0;b<srcs.length;b++)page.includeJs(srcs[b]);waitFor(function(){return page.evaluate(function(){var a=document.getElementById("qunit-testresult");return a&&a.innerText.match("completed")?!0:!1})},function(){var a=JSON.parse(page.evaluate(function(){return JSON.stringify(getCoverageByLine())}));if(a.key){for(var b=a.lines,c=origdir+fs.separator+a.key,d=a.source,e=readFileLines(c),f="",g=0;g<b.length;g++){var h=b[g+1],i="";i="number"==typeof h?" "+(h>0?"hit":"miss"):" undef";var j=e[g];d||(j=j.replace("<","&lt;").replace(">","&gt;")),f+='<div class="code'+i+'">'+j+"</div>\n"}f=coverageBase.replace("COLORIZED_LINE_HTML",f),fs.write("coverage.html",f,"w"),console.log("Coverage for "+a.key+" in coverage.html")}_openPath!=openPath&&fs.remove(openPath);var k=page.evaluate(function(){var a=document.getElementById("qunit-testresult");console.log(a.innerText);try{return a.getElementsByClassName("failed")[0].innerHTML}catch(b){}return 1e4});phantom.exit(parseInt(k,10)>0?1:0)})}});