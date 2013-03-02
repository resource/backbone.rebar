(function(){var t,e=this,i=e.Backbone,s=[],n=s.push,r=s.slice,a=s.splice;t="undefined"!=typeof exports?exports:e.Backbone={},t.VERSION="0.9.10";var h=e._;h||"undefined"==typeof require||(h=require("underscore")),t.$=e.jQuery||e.Zepto||e.ender,t.noConflict=function(){return e.Backbone=i,this},t.emulateHTTP=!1,t.emulateJSON=!1;var o=/\s+/,u=function(t,e,i,s){if(!i)return!0;if("object"==typeof i)for(var n in i)t[e].apply(t,[n,i[n]].concat(s));else{if(!o.test(i))return!0;for(var r=i.split(o),a=0,h=r.length;h>a;a++)t[e].apply(t,[r[a]].concat(s))}},c=function(t,e){var i,s=-1,n=t.length;switch(e.length){case 0:for(;n>++s;)(i=t[s]).callback.call(i.ctx);return;case 1:for(;n>++s;)(i=t[s]).callback.call(i.ctx,e[0]);return;case 2:for(;n>++s;)(i=t[s]).callback.call(i.ctx,e[0],e[1]);return;case 3:for(;n>++s;)(i=t[s]).callback.call(i.ctx,e[0],e[1],e[2]);return;default:for(;n>++s;)(i=t[s]).callback.apply(i.ctx,e)}},l=t.Events={on:function(t,e,i){if(!u(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var s=this._events[t]||(this._events[t]=[]);return s.push({callback:e,context:i,ctx:i||this}),this},once:function(t,e,i){if(!u(this,"once",t,[e,i])||!e)return this;var s=this,n=h.once(function(){s.off(t,n),e.apply(this,arguments)});return n._callback=e,this.on(t,n,i),this},off:function(t,e,i){var s,n,r,a,o,c,l,d;if(!this._events||!u(this,"off",t,[e,i]))return this;if(!t&&!e&&!i)return this._events={},this;for(a=t?[t]:h.keys(this._events),o=0,c=a.length;c>o;o++)if(t=a[o],s=this._events[t]){if(r=[],e||i)for(l=0,d=s.length;d>l;l++)n=s[l],(e&&e!==n.callback&&e!==n.callback._callback||i&&i!==n.context)&&r.push(n);this._events[t]=r}return this},trigger:function(t){if(!this._events)return this;var e=r.call(arguments,1);if(!u(this,"trigger",t,e))return this;var i=this._events[t],s=this._events.all;return i&&c(i,e),s&&c(s,arguments),this},listenTo:function(t,e,i){var s=this._listeners||(this._listeners={}),n=t._listenerId||(t._listenerId=h.uniqueId("l"));return s[n]=t,t.on(e,"object"==typeof e?this:i,this),this},stopListening:function(t,e,i){var s=this._listeners;if(s){if(t)t.off(e,"object"==typeof e?this:i,this),e||i||delete s[t._listenerId];else{"object"==typeof e&&(i=this);for(var n in s)s[n].off(e,i,this);this._listeners={}}return this}}};l.bind=l.on,l.unbind=l.off,h.extend(t,l);var d=t.Model=function(t,e){var i,s=t||{};this.cid=h.uniqueId("c"),this.attributes={},e&&e.collection&&(this.collection=e.collection),e&&e.parse&&(s=this.parse(s,e)||{}),(i=h.result(this,"defaults"))&&(s=h.defaults({},s,i)),this.set(s,e),this.changed={},this.initialize.apply(this,arguments)};h.extend(d.prototype,l,{changed:null,idAttribute:"id",initialize:function(){},toJSON:function(){return h.clone(this.attributes)},sync:function(){return t.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return h.escape(this.get(t))},has:function(t){return null!=this.get(t)},set:function(t,e,i){var s,n,r,a,o,u,c,l;if(null==t)return this;if("object"==typeof t?(n=t,i=e):(n={})[t]=e,i||(i={}),!this._validate(n,i))return!1;r=i.unset,o=i.silent,a=[],u=this._changing,this._changing=!0,u||(this._previousAttributes=h.clone(this.attributes),this.changed={}),l=this.attributes,c=this._previousAttributes,this.idAttribute in n&&(this.id=n[this.idAttribute]);for(s in n)e=n[s],h.isEqual(l[s],e)||a.push(s),h.isEqual(c[s],e)?delete this.changed[s]:this.changed[s]=e,r?delete l[s]:l[s]=e;if(!o){a.length&&(this._pending=!0);for(var d=0,f=a.length;f>d;d++)this.trigger("change:"+a[d],this,l[a[d]],i)}if(u)return this;if(!o)for(;this._pending;)this._pending=!1,this.trigger("change",this,i);return this._pending=!1,this._changing=!1,this},unset:function(t,e){return this.set(t,void 0,h.extend({},e,{unset:!0}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,h.extend({},t,{unset:!0}))},hasChanged:function(t){return null==t?!h.isEmpty(this.changed):h.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?h.clone(this.changed):!1;var e,i=!1,s=this._changing?this._previousAttributes:this.attributes;for(var n in t)h.isEqual(s[n],e=t[n])||((i||(i={}))[n]=e);return i},previous:function(t){return null!=t&&this._previousAttributes?this._previousAttributes[t]:null},previousAttributes:function(){return h.clone(this._previousAttributes)},fetch:function(t){t=t?h.clone(t):{},void 0===t.parse&&(t.parse=!0);var e=t.success;return t.success=function(t,i,s){return t.set(t.parse(i,s),s)?(e&&e(t,i,s),void 0):!1},this.sync("read",this,t)},save:function(t,e,i){var s,n,r,a,o=this.attributes;return null==t||"object"==typeof t?(s=t,i=e):(s={})[t]=e,!s||i&&i.wait||this.set(s,i)?(i=h.extend({validate:!0},i),this._validate(s,i)?(s&&i.wait&&(this.attributes=h.extend({},o,s)),void 0===i.parse&&(i.parse=!0),n=i.success,i.success=function(t,e,i){t.attributes=o;var r=t.parse(e,i);return i.wait&&(r=h.extend(s||{},r)),h.isObject(r)&&!t.set(r,i)?!1:(n&&n(t,e,i),void 0)},r=this.isNew()?"create":i.patch?"patch":"update","patch"===r&&(i.attrs=s),a=this.sync(r,this,i),s&&i.wait&&(this.attributes=o),a):!1):!1},destroy:function(t){t=t?h.clone(t):{};var e=this,i=t.success,s=function(){e.trigger("destroy",e,e.collection,t)};if(t.success=function(t,e,n){(n.wait||t.isNew())&&s(),i&&i(t,e,n)},this.isNew())return t.success(this,null,t),!1;var n=this.sync("delete",this,t);return t.wait||s(),n},url:function(){var t=h.result(this,"urlRoot")||h.result(this.collection,"url")||N();return this.isNew()?t:t+("/"===t.charAt(t.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(t){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},isValid:function(t){return!this.validate||!this.validate(this.attributes,t)},_validate:function(t,e){if(!e.validate||!this.validate)return!0;t=h.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;return i?(this.trigger("invalid",this,i,e||{}),!1):!0}});var f=t.Collection=function(t,e){e||(e={}),e.model&&(this.model=e.model),void 0!==e.comparator&&(this.comparator=e.comparator),this.models=[],this._reset(),this.initialize.apply(this,arguments),t&&this.reset(t,h.extend({silent:!0},e))};h.extend(f.prototype,l,{model:d,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return t.sync.apply(this,arguments)},add:function(t,e){t=h.isArray(t)?t.slice():[t],e||(e={});var i,s,r,o,u,c,l,d,f,p;for(l=[],d=e.at,f=this.comparator&&null==d&&0!=e.sort,p=h.isString(this.comparator)?this.comparator:null,i=0,s=t.length;s>i;i++)(r=this._prepareModel(o=t[i],e))?(u=this.get(r))?e.merge&&(u.set(o===r?r.attributes:o,e),f&&!c&&u.hasChanged(p)&&(c=!0)):(l.push(r),r.on("all",this._onModelEvent,this),this._byId[r.cid]=r,null!=r.id&&(this._byId[r.id]=r)):this.trigger("invalid",this,o,e);if(l.length&&(f&&(c=!0),this.length+=l.length,null!=d?a.apply(this.models,[d,0].concat(l)):n.apply(this.models,l)),c&&this.sort({silent:!0}),e.silent)return this;for(i=0,s=l.length;s>i;i++)(r=l[i]).trigger("add",r,this,e);return c&&this.trigger("sort",this,e),this},remove:function(t,e){t=h.isArray(t)?t.slice():[t],e||(e={});var i,s,n,r;for(i=0,s=t.length;s>i;i++)r=this.get(t[i]),r&&(delete this._byId[r.id],delete this._byId[r.cid],n=this.indexOf(r),this.models.splice(n,1),this.length--,e.silent||(e.index=n,r.trigger("remove",r,this,e)),this._removeReference(r));return this},push:function(t,e){return t=this._prepareModel(t,e),this.add(t,h.extend({at:this.length},e)),t},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t),e},unshift:function(t,e){return t=this._prepareModel(t,e),this.add(t,h.extend({at:0},e)),t},shift:function(t){var e=this.at(0);return this.remove(e,t),e},slice:function(t,e){return this.models.slice(t,e)},get:function(t){return null==t?void 0:(this._idAttr||(this._idAttr=this.model.prototype.idAttribute),this._byId[t.id||t.cid||t[this._idAttr]||t])},at:function(t){return this.models[t]},where:function(t){return h.isEmpty(t)?[]:this.filter(function(e){for(var i in t)if(t[i]!==e.get(i))return!1;return!0})},sort:function(t){if(!this.comparator)throw Error("Cannot sort a set without a comparator");return t||(t={}),h.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(h.bind(this.comparator,this)),t.silent||this.trigger("sort",this,t),this},pluck:function(t){return h.invoke(this.models,"get",t)},update:function(t,e){e=h.extend({add:!0,merge:!0,remove:!0},e),e.parse&&(t=this.parse(t,e));var i,s,n,r,a=[],o=[],u={};if(h.isArray(t)||(t=t?[t]:[]),e.add&&!e.remove)return this.add(t,e);for(s=0,n=t.length;n>s;s++)i=t[s],r=this.get(i),e.remove&&r&&(u[r.cid]=!0),(e.add&&!r||e.merge&&r)&&a.push(i);if(e.remove)for(s=0,n=this.models.length;n>s;s++)i=this.models[s],u[i.cid]||o.push(i);return o.length&&this.remove(o,e),a.length&&this.add(a,e),this},reset:function(t,e){e||(e={}),e.parse&&(t=this.parse(t,e));for(var i=0,s=this.models.length;s>i;i++)this._removeReference(this.models[i]);return e.previousModels=this.models.slice(),this._reset(),t&&this.add(t,h.extend({silent:!0},e)),e.silent||this.trigger("reset",this,e),this},fetch:function(t){t=t?h.clone(t):{},void 0===t.parse&&(t.parse=!0);var e=t.success;return t.success=function(t,i,s){var n=s.update?"update":"reset";t[n](i,s),e&&e(t,i,s)},this.sync("read",this,t)},create:function(t,e){if(e=e?h.clone(e):{},!(t=this._prepareModel(t,e)))return!1;e.wait||this.add(t,e);var i=this,s=e.success;return e.success=function(t,e,n){n.wait&&i.add(t,n),s&&s(t,e,n)},t.save(null,e),t},parse:function(t){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0,this.models.length=0,this._byId={}},_prepareModel:function(t,e){if(t instanceof d)return t.collection||(t.collection=this),t;e||(e={}),e.collection=this;var i=new this.model(t,e);return i._validate(t,e)?i:!1},_removeReference:function(t){this===t.collection&&delete t.collection,t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,s){("add"!==t&&"remove"!==t||i===this)&&("destroy"===t&&this.remove(e,s),e&&t==="change:"+e.idAttribute&&(delete this._byId[e.previous(e.idAttribute)],null!=e.id&&(this._byId[e.id]=e)),this.trigger.apply(this,arguments))},sortedIndex:function(t,e,i){e||(e=this.comparator);var s=h.isFunction(e)?e:function(t){return t.get(e)};return h.sortedIndex(this.models,t,s,i)}});var p=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","indexOf","shuffle","lastIndexOf","isEmpty","chain"];h.each(p,function(t){f.prototype[t]=function(){var e=r.call(arguments);return e.unshift(this.models),h[t].apply(h,e)}});var g=["groupBy","countBy","sortBy"];h.each(g,function(t){f.prototype[t]=function(e,i){var s=h.isFunction(e)?e:function(t){return t.get(e)};return h[t](this.models,s,i)}});var v=t.Router=function(t){t||(t={}),t.routes&&(this.routes=t.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},m=/\((.*?)\)/g,y=/(\(\?)?:\w+/g,_=/\*\w+/g,b=/[\-{}\[\]+?.,\\\^$|#\s]/g;h.extend(v.prototype,l,{initialize:function(){},route:function(e,i,s){return h.isRegExp(e)||(e=this._routeToRegExp(e)),s||(s=this[i]),t.history.route(e,h.bind(function(n){var r=this._extractParameters(e,n);s&&s.apply(this,r),this.trigger.apply(this,["route:"+i].concat(r)),this.trigger("route",i,r),t.history.trigger("route",this,i,r)},this)),this},navigate:function(e,i){return t.history.navigate(e,i),this},_bindRoutes:function(){if(this.routes)for(var t,e=h.keys(this.routes);null!=(t=e.pop());)this.route(t,this.routes[t])},_routeToRegExp:function(t){return t=t.replace(b,"\\$&").replace(m,"(?:$1)?").replace(y,function(t,e){return e?t:"([^/]+)"}).replace(_,"(.*?)"),RegExp("^"+t+"$")},_extractParameters:function(t,e){return t.exec(e).slice(1)}});var x=t.History=function(){this.handlers=[],h.bindAll(this,"checkUrl"),"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},w=/^[#\/]|\s+$/g,E=/^\/+|\/+$/g,S=/msie [\w.]+/,k=/\/$/;x.started=!1,h.extend(x.prototype,l,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(null==t)if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(k,"");t.indexOf(i)||(t=t.substr(i.length))}else t=this.getHash();return t.replace(w,"")},start:function(e){if(x.started)throw Error("Backbone.history has already been started");x.started=!0,this.options=h.extend({},{root:"/"},this.options,e),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var i=this.getFragment(),s=document.documentMode,n=S.exec(navigator.userAgent.toLowerCase())&&(!s||7>=s);this.root=("/"+this.root+"/").replace(E,"/"),n&&this._wantsHashChange&&(this.iframe=t.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(i)),this._hasPushState?t.$(window).on("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!n?t.$(window).on("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=i;var r=this.location,a=r.pathname.replace(/[^\/]$/,"$&/")===this.root;return this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!a?(this.fragment=this.getFragment(null,!0),this.location.replace(this.root+this.location.search+"#"+this.fragment),!0):(this._wantsPushState&&this._hasPushState&&a&&r.hash&&(this.fragment=this.getHash().replace(w,""),this.history.replaceState({},document.title,this.root+this.fragment+r.search)),this.options.silent?void 0:this.loadUrl())},stop:function(){t.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl),clearInterval(this._checkUrlInterval),x.started=!1},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(){var t=this.getFragment();return t===this.fragment&&this.iframe&&(t=this.getFragment(this.getHash(this.iframe))),t===this.fragment?!1:(this.iframe&&this.navigate(t),this.loadUrl()||this.loadUrl(this.getHash()),void 0)},loadUrl:function(t){var e=this.fragment=this.getFragment(t),i=h.any(this.handlers,function(t){return t.route.test(e)?(t.callback(e),!0):void 0});return i},navigate:function(t,e){if(!x.started)return!1;if(e&&e!==!0||(e={trigger:e}),t=this.getFragment(t||""),this.fragment!==t){this.fragment=t;var i=this.root+t;if(this._hasPushState)this.history[e.replace?"replaceState":"pushState"]({},document.title,i);else{if(!this._wantsHashChange)return this.location.assign(i);this._updateHash(this.location,t,e.replace),this.iframe&&t!==this.getFragment(this.getHash(this.iframe))&&(e.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,t,e.replace))}e.trigger&&this.loadUrl(t)}},_updateHash:function(t,e,i){if(i){var s=t.href.replace(/(javascript:|#).*$/,"");t.replace(s+"#"+e)}else t.hash="#"+e}}),t.history=new x;var $=t.View=function(t){this.cid=h.uniqueId("view"),this._configure(t||{}),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},A=/^(\S+)\s*(.*)$/,T=["model","collection","el","id","attributes","className","tagName","events"];h.extend($.prototype,l,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this.stopListening(),this},setElement:function(e,i){return this.$el&&this.undelegateEvents(),this.$el=e instanceof t.$?e:t.$(e),this.el=this.$el[0],i!==!1&&this.delegateEvents(),this},delegateEvents:function(t){if(t||(t=h.result(this,"events"))){this.undelegateEvents();for(var e in t){var i=t[e];if(h.isFunction(i)||(i=this[t[e]]),!i)throw Error('Method "'+t[e]+'" does not exist');var s=e.match(A),n=s[1],r=s[2];i=h.bind(i,this),n+=".delegateEvents"+this.cid,""===r?this.$el.on(n,i):this.$el.on(n,r,i)}}},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid)},_configure:function(t){this.options&&(t=h.extend({},h.result(this,"options"),t)),h.extend(this,h.pick(t,T)),this.options=t},_ensureElement:function(){if(this.el)this.setElement(h.result(this,"el"),!1);else{var e=h.extend({},h.result(this,"attributes"));this.id&&(e.id=h.result(this,"id")),this.className&&(e["class"]=h.result(this,"className"));var i=t.$("<"+h.result(this,"tagName")+">").attr(e);this.setElement(i,!1)}}});var H={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};t.sync=function(e,i,s){var n=H[e];h.defaults(s||(s={}),{emulateHTTP:t.emulateHTTP,emulateJSON:t.emulateJSON});var r={type:n,dataType:"json"};if(s.url||(r.url=h.result(i,"url")||N()),null!=s.data||!i||"create"!==e&&"update"!==e&&"patch"!==e||(r.contentType="application/json",r.data=JSON.stringify(s.attrs||i.toJSON(s))),s.emulateJSON&&(r.contentType="application/x-www-form-urlencoded",r.data=r.data?{model:r.data}:{}),s.emulateHTTP&&("PUT"===n||"DELETE"===n||"PATCH"===n)){r.type="POST",s.emulateJSON&&(r.data._method=n);var a=s.beforeSend;s.beforeSend=function(t){return t.setRequestHeader("X-HTTP-Method-Override",n),a?a.apply(this,arguments):void 0}}"GET"===r.type||s.emulateJSON||(r.processData=!1);var o=s.success;s.success=function(t){o&&o(i,t,s),i.trigger("sync",i,t,s)};var u=s.error;s.error=function(t){u&&u(i,t,s),i.trigger("error",i,t,s)};var c=s.xhr=t.ajax(h.extend(r,s));return i.trigger("request",i,c,s),c},t.ajax=function(){return t.$.ajax.apply(t.$,arguments)};var I=function(t,e){var i,s=this;i=t&&h.has(t,"constructor")?t.constructor:function(){return s.apply(this,arguments)},h.extend(i,s,e);var n=function(){this.constructor=i};return n.prototype=s.prototype,i.prototype=new n,t&&h.extend(i.prototype,t),i.__super__=s.prototype,i};d.extend=f.extend=v.extend=$.extend=x.extend=I;var N=function(){throw Error('A "url" property or function must be specified')}}).call(this);