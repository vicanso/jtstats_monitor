function selectColor(){return exports.colors[prevColor++%exports.colors.length]}function debug(a){function b(){}function c(){var a=c,b=+new Date,d=b-(prevTime||b);a.diff=d,a.prev=prevTime,a.curr=b,prevTime=b,null==a.useColors&&(a.useColors=exports.useColors()),null==a.color&&a.useColors&&(a.color=selectColor());var e=Array.prototype.slice.call(arguments);e[0]=exports.coerce(e[0]),"string"!=typeof e[0]&&(e=["%o"].concat(e));var f=0;e[0]=e[0].replace(/%([a-z%])/g,function(b,c){if("%%"===b)return b;f++;var d=exports.formatters[c];if("function"==typeof d){var g=e[f];b=d.call(a,g),e.splice(f,1),f--}return b}),"function"==typeof exports.formatArgs&&(e=exports.formatArgs.apply(a,e));var g=c.log||exports.log||console.log.bind(console);g.apply(a,e)}b.enabled=!1,c.enabled=!0;var d=exports.enabled(a)?c:b;return d.namespace=a,d}function enable(a){exports.save(a);for(var b=(a||"").split(/[\s,]+/),c=b.length,d=0;c>d;d++)b[d]&&(a=b[d].replace(/\*/g,".*?"),"-"===a[0]?exports.skips.push(new RegExp("^"+a.substr(1)+"$")):exports.names.push(new RegExp("^"+a+"$")))}function disable(){exports.enable("")}function enabled(a){var b,c;for(b=0,c=exports.skips.length;c>b;b++)if(exports.skips[b].test(a))return!1;for(b=0,c=exports.names.length;c>b;b++)if(exports.names[b].test(a))return!0;return!1}function coerce(a){return a instanceof Error?a.stack||a.message:a}exports=module.exports=debug,exports.coerce=coerce,exports.disable=disable,exports.enable=enable,exports.enabled=enabled,exports.humanize=require("ms"),exports.names=[],exports.skips=[],exports.formatters={};var prevColor=0,prevTime;