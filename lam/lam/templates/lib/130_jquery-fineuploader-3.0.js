var qq=qq||{},qq=function(a){return{hide:function(){a.style.display="none";return this},attach:function(b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c);return function(){qq(a).detach(b,c)}},detach:function(b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.attachEvent&&a.detachEvent("on"+b,c);return this},contains:function(b){return a==b?!0:a.contains?a.contains(b):!!(b.compareDocumentPosition(a)&8)},insertBefore:function(b){b.parentNode.insertBefore(a,
b);return this},remove:function(){a.parentNode.removeChild(a);return this},css:function(b){null!=b.opacity&&("string"!=typeof a.style.opacity&&"undefined"!=typeof a.filters)&&(b.filter="alpha(opacity="+Math.round(100*b.opacity)+")");qq.extend(a.style,b);return this},hasClass:function(b){return RegExp("(^| )"+b+"( |$)").test(a.className)},addClass:function(b){qq(a).hasClass(b)||(a.className+=" "+b);return this},removeClass:function(b){a.className=a.className.replace(RegExp("(^| )"+b+"( |$)")," ").replace(/^\s+|\s+$/g,
"");return this},getByClass:function(b){if(a.querySelectorAll)return a.querySelectorAll("."+b);for(var c=[],d=a.getElementsByTagName("*"),e=d.length,f=0;f<e;f++)qq(d[f]).hasClass(b)&&c.push(d[f]);return c},children:function(){for(var b=[],c=a.firstChild;c;)1==c.nodeType&&b.push(c),c=c.nextSibling;return b},setText:function(b){a.innerText=b;a.textContent=b;return this},clearText:function(){return qq(a).setText("")}}};
qq.log=function(a,b){if(window.console)if(!b||"info"===b)window.console.log(a);else if(window.console[b])window.console[b](a);else window.console.log("<"+b+"> "+a)};qq.isObject=function(a){return null!==a&&a&&"object"===typeof a&&a.constructor===Object};qq.extend=function(a,b,c){for(var d in b)b.hasOwnProperty(d)&&(c&&qq.isObject(b[d])?(void 0===a[d]&&(a[d]={}),qq.extend(a[d],b[d],!0)):a[d]=b[d])};
qq.indexOf=function(a,b,c){if(a.indexOf)return a.indexOf(b,c);c=c||0;var d=a.length;for(0>c&&(c+=d);c<d;c++)if(c in a&&a[c]===b)return c;return-1};qq.getUniqueId=function(){var a=0;return function(){return a++}}();qq.ie=function(){return-1!=navigator.userAgent.indexOf("MSIE")};qq.ie10=function(){return-1!=navigator.userAgent.indexOf("MSIE 10")};qq.safari=function(){return void 0!=navigator.vendor&&-1!=navigator.vendor.indexOf("Apple")};qq.chrome=function(){return void 0!=navigator.vendor&&-1!=navigator.vendor.indexOf("Google")};
qq.firefox=function(){return-1!=navigator.userAgent.indexOf("Mozilla")&&void 0!=navigator.vendor&&""==navigator.vendor};qq.windows=function(){return"Win32"==navigator.platform};qq.preventDefault=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};qq.toElement=function(){var a=document.createElement("div");return function(b){a.innerHTML=b;b=a.firstChild;a.removeChild(b);return b}}();
qq.obj2url=function(a,b,c){var d=[],e="&",f=function(a,c){var e=b?/\[\]$/.test(b)?b:b+"["+c+"]":c;"undefined"!=e&&"undefined"!=c&&d.push("object"===typeof a?qq.obj2url(a,e,!0):"[object Function]"===Object.prototype.toString.call(a)?encodeURIComponent(e)+"="+encodeURIComponent(a()):encodeURIComponent(e)+"="+encodeURIComponent(a))};if(!c&&b)e=/\?/.test(b)?/\?$/.test(b)?"":"&":"?",d.push(b),d.push(qq.obj2url(a));else if("[object Array]"===Object.prototype.toString.call(a)&&"undefined"!=typeof a){var g=
0;for(c=a.length;g<c;++g)f(a[g],g)}else if("undefined"!=typeof a&&null!==a&&"object"===typeof a)for(g in a)f(a[g],g);else d.push(encodeURIComponent(b)+"="+encodeURIComponent(a));return b?d.join(e):d.join(e).replace(/^&/,"").replace(/%20/g,"+")};qq.DisposeSupport={_disposers:[],dispose:function(){for(var a;a=this._disposers.shift();)a()},addDisposer:function(a){this._disposers.push(a)},_attach:function(){this.addDisposer(qq(arguments[0]).attach.apply(this,Array.prototype.slice.call(arguments,1)))}};
qq.UploadButton=function(a){this._options={element:null,multiple:!1,acceptFiles:null,name:"file",onChange:function(a){},hoverClass:"qq-upload-button-hover",focusClass:"qq-upload-button-focus"};qq.extend(this._options,a);qq.extend(this,qq.DisposeSupport);this._element=this._options.element;qq(this._element).css({position:"relative",overflow:"hidden",direction:"ltr"});this._input=this._createInput()};
qq.UploadButton.prototype={getInput:function(){return this._input},reset:function(){this._input.parentNode&&qq(this._input).remove();qq(this._element).removeClass(this._options.focusClass);this._input=this._createInput()},_createInput:function(){var a=document.createElement("input");this._options.multiple&&a.setAttribute("multiple","multiple");this._options.acceptFiles&&a.setAttribute("accept",this._options.acceptFiles);a.setAttribute("type","file");a.setAttribute("name",this._options.name);qq(a).css({position:"absolute",
right:0,top:0,fontFamily:"Arial",fontSize:"118px",margin:0,padding:0,cursor:"pointer",opacity:0});this._element.appendChild(a);var b=this;this._attach(a,"change",function(){b._options.onChange(a)});this._attach(a,"mouseover",function(){qq(b._element).addClass(b._options.hoverClass)});this._attach(a,"mouseout",function(){qq(b._element).removeClass(b._options.hoverClass)});this._attach(a,"focus",function(){qq(b._element).addClass(b._options.focusClass)});this._attach(a,"blur",function(){qq(b._element).removeClass(b._options.focusClass)});
window.attachEvent&&a.setAttribute("tabIndex","-1");return a}};
qq.FineUploaderBasic=function(a){this._options={debug:!1,button:null,multiple:!0,maxConnections:3,disableCancelForFormUploads:!1,autoUpload:!0,request:{endpoint:"/server/upload",params:{},customHeaders:{},forceMultipart:!1,inputName:"qqfile"},validation:{allowedExtensions:[],sizeLimit:0,minSizeLimit:0,stopOnFirstInvalidFile:!0},callbacks:{onSubmit:function(a,c){},onComplete:function(a,c,d){},onCancel:function(a,c){},onUpload:function(a,c,d){},onProgress:function(a,c,d,e){},onError:function(a,c,d){},
onAutoRetry:function(a,c,d){},onManualRetry:function(a,c){},onValidate:function(a){}},messages:{typeError:"{file} has an invalid extension. Valid extension(s): {extensions}.",sizeError:"{file} is too large, maximum file size is {sizeLimit}.",minSizeError:"{file} is too small, minimum file size is {minSizeLimit}.",emptyError:"{file} is empty, please select files again without it.",noFilesError:"No files to upload.",onLeave:"The files are being uploaded, if you leave now the upload will be cancelled."},
retry:{enableAuto:!1,maxAutoAttempts:3,autoAttemptDelay:5,preventRetryResponseProperty:"preventRetry"}};qq.extend(this._options,a,!0);this._wrapCallbacks();qq.extend(this,qq.DisposeSupport);this._filesInProgress=0;this._storedFileIds=[];this._autoRetries=[];this._retryTimeouts=[];this._preventRetries=[];this._handler=this._createUploadHandler();this._options.button&&(this._button=this._createUploadButton(this._options.button));this._preventLeaveInProgress()};
qq.FineUploaderBasic.prototype={log:function(a,b){this._options.debug&&(!b||"info"===b)?qq.log("[FineUploader] "+a):b&&"info"!==b&&qq.log("[FineUploader] "+a,b)},setParams:function(a){this._options.request.params=a},getInProgress:function(){return this._filesInProgress},uploadStoredFiles:function(){for(;this._storedFileIds.length;)this._filesInProgress++,this._handler.upload(this._storedFileIds.shift(),this._options.request.params)},clearStoredFiles:function(){this._storedFileIds=[]},retry:function(a){return this._onBeforeManualRetry(a)?
(this._handler.retry(a),!0):!1},cancel:function(a){this._handler.cancel(a)},reset:function(){this.log("Resetting uploader...");this._handler.reset();this._filesInProgress=0;this._storedFileIds=[];this._autoRetries=[];this._retryTimeouts=[];this._preventRetries=[];this._button.reset()},_createUploadButton:function(a){var b=this,c=new qq.UploadButton({element:a,multiple:this._options.multiple&&qq.UploadHandlerXhr.isSupported(),acceptFiles:this._options.validation.acceptFiles,onChange:function(a){b._onInputChange(a)}});
this.addDisposer(function(){c.dispose()});return c},_createUploadHandler:function(){var a=this,b;b=qq.UploadHandlerXhr.isSupported()?"UploadHandlerXhr":"UploadHandlerForm";return new qq[b]({debug:this._options.debug,endpoint:this._options.request.endpoint,forceMultipart:this._options.request.forceMultipart,maxConnections:this._options.maxConnections,customHeaders:this._options.request.customHeaders,inputName:this._options.request.inputName,demoMode:this._options.demoMode,log:this.log,onProgress:function(b,
d,e,f){a._onProgress(b,d,e,f);a._options.callbacks.onProgress(b,d,e,f)},onComplete:function(b,d,e,f){a._onComplete(b,d,e,f);a._options.callbacks.onComplete(b,d,e)},onCancel:function(b,d){a._onCancel(b,d);a._options.callbacks.onCancel(b,d)},onUpload:function(b,d,e){a._onUpload(b,d,e);a._options.callbacks.onUpload(b,d,e)},onAutoRetry:function(b,d,e,f){a._preventRetries[b]=e[a._options.retry.preventRetryResponseProperty];return a._shouldAutoRetry(b,d,e)?(a._maybeParseAndSendUploadError(b,d,e,f),a._options.callbacks.onAutoRetry(b,
d,a._autoRetries[b]+1),a._onBeforeAutoRetry(b,d),a._retryTimeouts[b]=setTimeout(function(){a._onAutoRetry(b,d,e)},1E3*a._options.retry.autoAttemptDelay),!0):!1}})},_preventLeaveInProgress:function(){var a=this;this._attach(window,"beforeunload",function(b){if(a._filesInProgress)return b=b||window.event,b.returnValue=a._options.messages.onLeave})},_onSubmit:function(a,b){this._options.autoUpload&&this._filesInProgress++},_onProgress:function(a,b,c,d){},_onComplete:function(a,b,c,d){this._filesInProgress--;
this._maybeParseAndSendUploadError(a,b,c,d)},_onCancel:function(a,b){clearTimeout(this._retryTimeouts[a]);var c=qq.indexOf(this._storedFileIds,a);this._options.autoUpload||0>c?this._filesInProgress--:this._options.autoUpload||this._storedFileIds.splice(c,1)},_onUpload:function(a,b,c){},_onInputChange:function(a){this._handler instanceof qq.UploadHandlerXhr?this._uploadFileList(a.files):this._validateFile(a)&&this._uploadFile(a);this._button.reset()},_onBeforeAutoRetry:function(a,b){this.log("Waiting "+
this._options.retry.autoAttemptDelay+" seconds before retrying "+b+"...")},_onAutoRetry:function(a,b,c){this.log("Retrying "+b+"...");this._autoRetries[a]++;this._handler.retry(a)},_shouldAutoRetry:function(a,b,c){return!this._preventRetries[a]&&this._options.retry.enableAuto?(void 0===this._autoRetries[a]&&(this._autoRetries[a]=0),this._autoRetries[a]<this._options.retry.maxAutoAttempts):!1},_onBeforeManualRetry:function(a){if(this._preventRetries[a])return this.log("Retries are forbidden for id "+
a,"warn"),!1;if(this._handler.isValid(a)){var b=this._handler.getName(a);if(!1===this._options.callbacks.onManualRetry(a,b))return!1;this.log("Retrying upload for '"+b+"' (id: "+a+")...");this._filesInProgress++;return!0}this.log("'"+a+"' is not a valid file ID","error");return!1},_maybeParseAndSendUploadError:function(a,b,c,d){if(!c.success)if(d&&200!==d.status&&!c.error)this._options.callbacks.onError(a,b,"XHR returned response code "+d.status);else this._options.callbacks.onError(a,b,c.error?c.error:
"Upload failure reason unknown")},_uploadFileList:function(a){var b,c;b=this._getValidationDescriptors(a);1<b.length&&(c=!1===this._options.callbacks.onValidate(b));if(!c)if(0<a.length)for(b=0;b<a.length;b++)if(this._validateFile(a[b]))this._uploadFile(a[b]);else{if(this._options.validation.stopOnFirstInvalidFile)break}else this._error("noFilesError","")},_uploadFile:function(a){a=this._handler.add(a);var b=this._handler.getName(a);!1!==this._options.callbacks.onSubmit(a,b)&&(this._onSubmit(a,b),
this._options.autoUpload?this._handler.upload(a,this._options.request.params):this._storeFileForLater(a))},_storeFileForLater:function(a){this._storedFileIds.push(a)},_validateFile:function(a){var b,c;a=this._getValidationDescriptor(a);b=a.name;c=a.size;if(!1===this._options.callbacks.onValidate([a]))return!1;if(this._isAllowedExtension(b)){if(0===c)return this._error("emptyError",b),!1;if(c&&this._options.validation.sizeLimit&&c>this._options.validation.sizeLimit)return this._error("sizeError",b),
!1;if(c&&c<this._options.validation.minSizeLimit)return this._error("minSizeError",b),!1}else return this._error("typeError",b),!1;return!0},_error:function(a,b){var c=this._options.messages[a],d=this._options.validation.allowedExtensions.join(", "),e=this._formatFileName(b),c=c.replace("{file}",e),c=c.replace("{extensions}",d),d=this._formatSize(this._options.validation.sizeLimit),c=c.replace("{sizeLimit}",d),d=this._formatSize(this._options.validation.minSizeLimit),c=c.replace("{minSizeLimit}",
d);this._options.callbacks.onError(null,b,c);return c},_formatFileName:function(a){33<a.length&&(a=a.slice(0,19)+"..."+a.slice(-13));return a},_isAllowedExtension:function(a){a=-1!==a.indexOf(".")?a.replace(/.*[.]/,"").toLowerCase():"";var b=this._options.validation.allowedExtensions;if(!b.length)return!0;for(var c=0;c<b.length;c++)if(b[c].toLowerCase()==a)return!0;return!1},_formatSize:function(a){var b=-1;do a/=1024,b++;while(99<a);return Math.max(a,0.1).toFixed(1)+"kB MB GB TB PB EB".split(" ")[b]},
_wrapCallbacks:function(){var a,b;a=this;b=function(b,c,f){try{return c.apply(a,f)}catch(g){a.log("Caught exception in '"+b+"' callback - "+g,"error")}};for(var c in this._options.callbacks)(function(){var d=a._options.callbacks[c];a._options.callbacks[c]=function(){return b(c,d,arguments)}})()},_parseFileName:function(a){return a.value?a.value.replace(/.*(\/|\\)/,""):null!==a.fileName&&void 0!==a.fileName?a.fileName:a.name},_parseFileSize:function(a){var b;a.value||(b=null!==a.fileSize&&void 0!==
a.fileSize?a.fileSize:a.size);return b},_getValidationDescriptor:function(a){var b,c;c={};b=this._parseFileName(a);a=this._parseFileSize(a);c.name=b;a&&(c.size=a);return c},_getValidationDescriptors:function(a){var b,c;c=[];for(b=0;b<a.length;b++)c.push(a[b]);return c}};
qq.FineUploader=function(a){qq.FineUploaderBasic.apply(this,arguments);qq.extend(this._options,{element:null,listElement:null,dragAndDrop:{extraDropzones:[],hideDropzones:!0,disableDefaultDropzone:!1},text:{uploadButton:"Upload a file",cancelButton:"Cancel",retryButton:"Retry",failUpload:"Upload failed",dragZone:"Drop files here to upload",formatProgress:"{percent}% of {total_size}",waitingForResponse:"Processing..."},template:'<div class="qq-uploader">'+(!this._options.dragAndDrop||!this._options.dragAndDrop.disableDefaultDropzone?
'<div class="qq-upload-drop-area"><span>{dragZoneText}</span></div>':"")+(!this._options.button?'<div class="qq-upload-button"><div>{uploadButtonText}</div></div>':"")+(!this._options.listElement?'<ul class="qq-upload-list"></ul>':"")+"</div>",fileTemplate:'<li><div class="qq-progress-bar"></div><span class="qq-upload-spinner"></span><span class="qq-upload-finished"></span><span class="qq-upload-file"></span><span class="qq-upload-size"></span><a class="qq-upload-cancel" href="#">{cancelButtonText}</a><a class="qq-upload-retry" href="#">{retryButtonText}</a><span class="qq-upload-status-text">{statusText}</span></li>',
classes:{button:"qq-upload-button",drop:"qq-upload-drop-area",dropActive:"qq-upload-drop-area-active",dropDisabled:"qq-upload-drop-area-disabled",list:"qq-upload-list",progressBar:"qq-progress-bar",file:"qq-upload-file",spinner:"qq-upload-spinner",finished:"qq-upload-finished",retrying:"qq-upload-retrying",retryable:"qq-upload-retryable",size:"qq-upload-size",cancel:"qq-upload-cancel",retry:"qq-upload-retry",statusText:"qq-upload-status-text",success:"qq-upload-success",fail:"qq-upload-fail",successIcon:null,
failIcon:null},failedUploadTextDisplay:{mode:"default",maxChars:50,responseProperty:"error",enableTooltip:!0},messages:{tooManyFilesError:"You may only drop one file"},retry:{showAutoRetryNote:!0,autoRetryNote:"Retrying {retryNum}/{maxAuto}...",showButton:!1},showMessage:function(a){alert(a)}},!0);qq.extend(this._options,a,!0);this._wrapCallbacks();this._options.template=this._options.template.replace(/\{dragZoneText\}/g,this._options.text.dragZone);this._options.template=this._options.template.replace(/\{uploadButtonText\}/g,
this._options.text.uploadButton);this._options.fileTemplate=this._options.fileTemplate.replace(/\{cancelButtonText\}/g,this._options.text.cancelButton);this._options.fileTemplate=this._options.fileTemplate.replace(/\{retryButtonText\}/g,this._options.text.retryButton);this._options.fileTemplate=this._options.fileTemplate.replace(/\{statusText\}/g,"");this._element=this._options.element;this._element.innerHTML=this._options.template;this._listElement=this._options.listElement||this._find(this._element,
"list");this._classes=this._options.classes;this._button||(this._button=this._createUploadButton(this._find(this._element,"button")));this._bindCancelAndRetryEvents();this._setupDragDrop()};qq.extend(qq.FineUploader.prototype,qq.FineUploaderBasic.prototype);
qq.extend(qq.FineUploader.prototype,{clearStoredFiles:function(){qq.FineUploaderBasic.prototype.clearStoredFiles.apply(this,arguments);this._listElement.innerHTML=""},addExtraDropzone:function(a){this._setupExtraDropzone(a)},removeExtraDropzone:function(a){var b=this._options.dragAndDrop.extraDropzones,c;for(c in b)if(b[c]===a)return this._options.dragAndDrop.extraDropzones.splice(c,1)},getItemByFileId:function(a){for(var b=this._listElement.firstChild;b;){if(b.qqFileId==a)return b;b=b.nextSibling}},
reset:function(){qq.FineUploaderBasic.prototype.reset.apply(this,arguments);this._element.innerHTML=this._options.template;this._listElement=this._options.listElement||this._find(this._element,"list");this._options.button||(this._button=this._createUploadButton(this._find(this._element,"button")));this._bindCancelAndRetryEvents();this._setupDragDrop()},_leaving_document_out:function(a){return(qq.chrome()||qq.safari()&&qq.windows())&&0==a.clientX&&0==a.clientY||qq.firefox()&&!a.relatedTarget},_storeFileForLater:function(a){qq.FineUploaderBasic.prototype._storeFileForLater.apply(this,
arguments);var b=this.getItemByFileId(a);qq(this._find(b,"spinner")).hide()},_find:function(a,b){var c=qq(a).getByClass(this._options.classes[b])[0];if(!c)throw Error("element not found "+b);return c},_setupExtraDropzone:function(a){this._options.dragAndDrop.extraDropzones.push(a);this._setupDropzone(a)},_setupDropzone:function(a){var b=this,c=new qq.UploadDropZone({element:a,onEnter:function(c){qq(a).addClass(b._classes.dropActive);c.stopPropagation()},onLeave:function(a){},onLeaveNotDescendants:function(c){qq(a).removeClass(b._classes.dropActive)},
onDrop:function(c){b._options.dragAndDrop.hideDropzones&&qq(a).hide();qq(a).removeClass(b._classes.dropActive);1<c.dataTransfer.files.length&&!b._options.multiple?b._error("tooManyFilesError",""):b._uploadFileList(c.dataTransfer.files)}});this.addDisposer(function(){c.dispose()});this._options.dragAndDrop.hideDropzones&&qq(a).hide()},_setupDragDrop:function(){var a,b;a=this;this._options.dragAndDrop.disableDefaultDropzone||(b=this._find(this._element,"drop"),this._options.dragAndDrop.extraDropzones.push(b));
var c=this._options.dragAndDrop.extraDropzones,d;for(d=0;d<c.length;d++)this._setupDropzone(c[d]);!this._options.dragAndDrop.disableDefaultDropzone&&(!qq.ie()||qq.ie10())&&this._attach(document,"dragenter",function(e){if(!qq(b).hasClass(a._classes.dropDisabled)){b.style.display="block";for(d=0;d<c.length;d++)c[d].style.display="block"}});this._attach(document,"dragleave",function(b){if(a._options.dragAndDrop.hideDropzones&&qq.FineUploader.prototype._leaving_document_out(b))for(d=0;d<c.length;d++)qq(c[d]).hide()});
qq(document).attach("drop",function(b){if(a._options.dragAndDrop.hideDropzones)for(d=0;d<c.length;d++)qq(c[d]).hide();b.preventDefault()})},_onSubmit:function(a,b){qq.FineUploaderBasic.prototype._onSubmit.apply(this,arguments);this._addToList(a,b)},_onProgress:function(a,b,c,d){qq.FineUploaderBasic.prototype._onProgress.apply(this,arguments);var e,f,g,h;e=this.getItemByFileId(a);f=this._find(e,"progressBar");h=Math.round(100*(c/d));c===d?(g=this._find(e,"cancel"),qq(g).hide(),qq(f).hide(),qq(this._find(e,
"statusText")).setText(this._options.text.waitingForResponse),g=this._formatSize(d)):(g=this._formatProgress(c,d),qq(f).css({display:"block"}));qq(f).css({width:h+"%"});e=this._find(e,"size");qq(e).css({display:"inline"});qq(e).setText(g)},_onComplete:function(a,b,c,d){qq.FineUploaderBasic.prototype._onComplete.apply(this,arguments);var e=this.getItemByFileId(a);qq(this._find(e,"statusText")).clearText();qq(e).removeClass(this._classes.retrying);qq(this._find(e,"progressBar")).hide();(!this._options.disableCancelForFormUploads||
qq.UploadHandlerXhr.isSupported())&&qq(this._find(e,"cancel")).hide();qq(this._find(e,"spinner")).hide();c.success?(qq(e).addClass(this._classes.success),this._classes.successIcon&&(this._find(e,"finished").style.display="inline-block",qq(e).addClass(this._classes.successIcon))):(qq(e).addClass(this._classes.fail),this._classes.failIcon&&(this._find(e,"finished").style.display="inline-block",qq(e).addClass(this._classes.failIcon)),this._options.retry.showButton&&!this._preventRetries[a]&&qq(e).addClass(this._classes.retryable),
this._controlFailureTextDisplay(e,c))},_onUpload:function(a,b,c){qq.FineUploaderBasic.prototype._onUpload.apply(this,arguments);var d=this.getItemByFileId(a);this._showSpinner(d)},_onBeforeAutoRetry:function(a){var b,c,d,e,f;qq.FineUploaderBasic.prototype._onBeforeAutoRetry.apply(this,arguments);b=this.getItemByFileId(a);c=this._find(b,"progressBar");this._showCancelLink(b);c.style.width=0;qq(c).hide();this._options.retry.showAutoRetryNote&&(c=this._find(b,"statusText"),d=this._autoRetries[a]+1,e=
this._options.retry.maxAutoAttempts,f=this._options.retry.autoRetryNote.replace(/\{retryNum\}/g,d),f=f.replace(/\{maxAuto\}/g,e),qq(c).setText(f),1===d&&qq(b).addClass(this._classes.retrying))},_onBeforeManualRetry:function(a){if(qq.FineUploaderBasic.prototype._onBeforeManualRetry.apply(this,arguments)){var b=this.getItemByFileId(a);this._find(b,"progressBar").style.width=0;qq(b).removeClass(this._classes.fail);this._showSpinner(b);this._showCancelLink(b);return!0}return!1},_addToList:function(a,
b){var c=qq.toElement(this._options.fileTemplate);if(this._options.disableCancelForFormUploads&&!qq.UploadHandlerXhr.isSupported()){var d=this._find(c,"cancel");qq(d).remove()}c.qqFileId=a;d=this._find(c,"file");qq(d).setText(this._formatFileName(b));qq(this._find(c,"size")).hide();this._options.multiple||this._clearList();this._listElement.appendChild(c)},_clearList:function(){this._listElement.innerHTML="";this.clearStoredFiles()},_bindCancelAndRetryEvents:function(){var a=this;this._attach(this._listElement,
"click",function(b){b=b||window.event;var c=b.target||b.srcElement;if(qq(c).hasClass(a._classes.cancel)||qq(c).hasClass(a._classes.retry)){qq.preventDefault(b);for(b=c.parentNode;void 0==b.qqFileId;)b=c=c.parentNode;qq(c).hasClass(a._classes.cancel)?(a.cancel(b.qqFileId),qq(b).remove()):(qq(b).removeClass(a._classes.retryable),a.retry(b.qqFileId))}})},_formatProgress:function(a,b){var c=this._options.text.formatProgress,d=Math.round(100*(a/b)),c=c.replace("{percent}",d),d=this._formatSize(b);return c=
c.replace("{total_size}",d)},_controlFailureTextDisplay:function(a,b){var c,d,e,f;c=this._options.failedUploadTextDisplay.mode;d=this._options.failedUploadTextDisplay.maxChars;e=this._options.failedUploadTextDisplay.responseProperty;"custom"===c?((c=b[e])?c.length>d&&(f=c.substring(0,d)+"..."):(c=this._options.text.failUpload,this.log("'"+e+"' is not a valid property on the server response.","warn")),qq(this._find(a,"statusText")).setText(f||c),this._options.failedUploadTextDisplay.enableTooltip&&
this._showTooltip(a,c)):"default"===c?qq(this._find(a,"statusText")).setText(this._options.text.failUpload):"none"!==c&&this.log("failedUploadTextDisplay.mode value of '"+c+"' is not valid","warn")},_showTooltip:function(a,b){a.title=b},_showSpinner:function(a){this._find(a,"spinner").style.display="inline-block"},_showCancelLink:function(a){if(!this._options.disableCancelForFormUploads||qq.UploadHandlerXhr.isSupported())this._find(a,"cancel").style.display="inline"},_error:function(a,b){var c=qq.FineUploaderBasic.prototype._error.apply(this,
arguments);this._options.showMessage(c)}});qq.UploadDropZone=function(a){this._options={element:null,onEnter:function(a){},onLeave:function(a){},onLeaveNotDescendants:function(a){},onDrop:function(a){}};qq.extend(this._options,a);qq.extend(this,qq.DisposeSupport);this._element=this._options.element;this._disableDropOutside();this._attachEvents()};
qq.UploadDropZone.prototype={_dragover_should_be_canceled:function(){return qq.safari()||qq.firefox()&&qq.windows()},_disableDropOutside:function(a){qq.UploadDropZone.dropOutsideDisabled||(this._dragover_should_be_canceled?qq(document).attach("dragover",function(a){a.preventDefault()}):qq(document).attach("dragover",function(a){a.dataTransfer&&(a.dataTransfer.dropEffect="none",a.preventDefault())}),qq.UploadDropZone.dropOutsideDisabled=!0)},_attachEvents:function(){var a=this;a._attach(a._element,
"dragover",function(b){if(a._isValidFileDrag(b)){var c=qq.ie()?null:b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"==c||"linkMove"==c?"move":"copy";b.stopPropagation();b.preventDefault()}});a._attach(a._element,"dragenter",function(b){if(a._isValidFileDrag(b))a._options.onEnter(b)});a._attach(a._element,"dragleave",function(b){if(a._isValidFileDrag(b)){a._options.onLeave(b);var c=document.elementFromPoint(b.clientX,b.clientY);if(!qq(this).contains(c))a._options.onLeaveNotDescendants(b)}});
a._attach(a._element,"drop",function(b){a._isValidFileDrag(b)&&(b.preventDefault(),a._options.onDrop(b))})},_isValidFileDrag:function(a){if(qq.ie()&&!qq.ie10())return!1;a=a.dataTransfer;var b=qq.safari(),c=qq.ie10()?!0:"none"!=a.effectAllowed;return a&&c&&(a.files||!b&&a.types.contains&&a.types.contains("Files"))}};
qq.UploadHandlerAbstract=function(a){this._options={debug:!1,endpoint:"/upload.php",maxConnections:999,log:function(a,c){},onProgress:function(a,c,d,e){},onComplete:function(a,c,d,e){},onCancel:function(a,c){},onUpload:function(a,c,d){},onAutoRetry:function(a,c,d,e){}};qq.extend(this._options,a);this._queue=[];this._params=[];this.log=this._options.log};
qq.UploadHandlerAbstract.prototype={add:function(a){},upload:function(a,b){var c=this._queue.push(a),d={};qq.extend(d,b);this._params[a]=d;c<=this._options.maxConnections&&this._upload(a,this._params[a])},retry:function(a){0<=qq.indexOf(this._queue,a)?this._upload(a,this._params[a]):this.upload(a,this._params[a])},cancel:function(a){this.log("Cancelling "+a);this._cancel(a);this._dequeue(a)},cancelAll:function(){for(var a=0;a<this._queue.length;a++)this._cancel(this._queue[a]);this._queue=[]},getName:function(a){},
getSize:function(a){},getQueue:function(){return this._queue},reset:function(){this.log("Resetting upload handler");this._queue=[];this._params=[]},_upload:function(a){},_cancel:function(a){},_dequeue:function(a){a=qq.indexOf(this._queue,a);this._queue.splice(a,1);var b=this._options.maxConnections;this._queue.length>=b&&a<b&&(a=this._queue[b-1],this._upload(a,this._params[a]))},isValid:function(a){}};
qq.UploadHandlerForm=function(a){qq.UploadHandlerAbstract.apply(this,arguments);this._inputs={};this._detach_load_events={}};qq.extend(qq.UploadHandlerForm.prototype,qq.UploadHandlerAbstract.prototype);
qq.extend(qq.UploadHandlerForm.prototype,{add:function(a){a.setAttribute("name",this._options.inputName);var b="qq-upload-handler-iframe"+qq.getUniqueId();this._inputs[b]=a;a.parentNode&&qq(a).remove();return b},getName:function(a){return this._inputs[a].value.replace(/.*(\/|\\)/,"")},isValid:function(a){return void 0!==this._inputs[a]},reset:function(){qq.UploadHandlerAbstract.prototype.reset.apply(this,arguments);this._inputs={};this._detach_load_events={}},_cancel:function(a){this._options.onCancel(a,
this.getName(a));delete this._inputs[a];delete this._detach_load_events[a];if(a=document.getElementById(a))a.setAttribute("src","javascript:false;"),qq(a).remove()},_upload:function(a,b){this._options.onUpload(a,this.getName(a),!1);var c=this._inputs[a];if(!c)throw Error("file with passed id was not added, or already uploaded or cancelled");var d=this.getName(a);b[this._options.inputName]=d;var e=this._createIframe(a),f=this._createForm(e,b);f.appendChild(c);var g=this;this._attachLoadEvent(e,function(){g.log("iframe loaded");
var b=g._getIframeContentJSON(e);setTimeout(function(){g._detach_load_events[a]();delete g._detach_load_events[a];qq(e).remove()},1);if(b.success||!g._options.onAutoRetry(a,d,b))g._options.onComplete(a,d,b),g._dequeue(a)});this.log("Sending upload request for "+a);f.submit();qq(f).remove();return a},_attachLoadEvent:function(a,b){var c=this;this._detach_load_events[a.id]=qq(a).attach("load",function(){c.log("Received response for "+a.id);if(a.parentNode){try{if(a.contentDocument&&a.contentDocument.body&&
"false"==a.contentDocument.body.innerHTML)return}catch(d){c.log("Error when attempting to access iframe during handling of upload response ("+d+")","error")}b()}})},_getIframeContentJSON:function(a){try{var b=a.contentDocument?a.contentDocument:a.contentWindow.document,c,d=b.body.innerHTML;this.log("converting iframe's innerHTML to JSON");this.log("innerHTML = "+d);d&&d.match(/^<pre/i)&&(d=b.body.firstChild.firstChild.nodeValue);c=eval("("+d+")")}catch(e){this.log("Error when attempting to parse form upload response ("+
e+")","error"),c={success:!1}}return c},_createIframe:function(a){var b=qq.toElement('<iframe src="javascript:false;" name="'+a+'" />');b.setAttribute("id",a);b.style.display="none";document.body.appendChild(b);return b},_createForm:function(a,b){var c=qq.toElement('<form method="'+(this._options.demoMode?"GET":"POST")+'" enctype="multipart/form-data"></form>'),d=qq.obj2url(b,this._options.endpoint);c.setAttribute("action",d);c.setAttribute("target",a.name);c.style.display="none";document.body.appendChild(c);
return c}});qq.UploadHandlerXhr=function(a){qq.UploadHandlerAbstract.apply(this,arguments);this._files=[];this._xhrs=[];this._loaded=[]};qq.UploadHandlerXhr.isSupported=function(){var a=document.createElement("input");a.type="file";return"multiple"in a&&"undefined"!=typeof File&&"undefined"!=typeof FormData&&"undefined"!=typeof(new XMLHttpRequest).upload};qq.extend(qq.UploadHandlerXhr.prototype,qq.UploadHandlerAbstract.prototype);
qq.extend(qq.UploadHandlerXhr.prototype,{add:function(a){if(!(a instanceof File))throw Error("Passed obj in not a File (in qq.UploadHandlerXhr)");return this._files.push(a)-1},getName:function(a){a=this._files[a];return null!==a.fileName&&void 0!==a.fileName?a.fileName:a.name},getSize:function(a){a=this._files[a];return null!=a.fileSize?a.fileSize:a.size},getLoaded:function(a){return this._loaded[a]||0},isValid:function(a){return void 0!==this._files[a]},reset:function(){qq.UploadHandlerAbstract.prototype.reset.apply(this,
arguments);this._files=[];this._xhrs=[];this._loaded=[]},_upload:function(a,b){this._options.onUpload(a,this.getName(a),!0);var c=this._files[a],d=this.getName(a);this.getSize(a);this._loaded[a]=0;var e=this._xhrs[a]=new XMLHttpRequest,f=this;e.upload.onprogress=function(b){b.lengthComputable&&(f._loaded[a]=b.loaded,f._options.onProgress(a,d,b.loaded,b.total))};e.onreadystatechange=function(){4==e.readyState&&f._onComplete(a,e)};b=b||{};b[this._options.inputName]=d;var g=qq.obj2url(b,this._options.endpoint);
e.open(this._options.demoMode?"GET":"POST",g,!0);e.setRequestHeader("X-Requested-With","XMLHttpRequest");e.setRequestHeader("X-File-Name",encodeURIComponent(d));e.setRequestHeader("Cache-Control","no-cache");this._options.forceMultipart?(g=new FormData,g.append(this._options.inputName,c),c=g):(e.setRequestHeader("Content-Type","application/octet-stream"),e.setRequestHeader("X-Mime-Type",c.type));for(key in this._options.customHeaders)e.setRequestHeader(key,this._options.customHeaders[key]);this.log("Sending upload request for "+
a);e.send(c)},_onComplete:function(a,b){if(this._files[a]){var c=this.getName(a),d=this.getSize(a),e;this._options.onProgress(a,c,d,d);this.log("xhr - server response received for "+a);this.log("responseText = "+b.responseText);try{e="function"===typeof JSON.parse?JSON.parse(b.responseText):eval("("+b.responseText+")")}catch(f){this.log("Error when attempting to parse xhr response text ("+f+")","error"),e={}}if(200===b.status&&e.success||!this._options.onAutoRetry(a,c,e,b))this._options.onComplete(a,
c,e,b),this._xhrs[a]=null,this._dequeue(a)}},_cancel:function(a){this._options.onCancel(a,this.getName(a));this._files[a]=null;this._xhrs[a]&&(this._xhrs[a].abort(),this._xhrs[a]=null)}});
(function(a){var b,c,d,e,f,g,h,k,l,m;g=["uploaderType"];d=function(a){a&&(a=k(a),h(a),"basic"===f("uploaderType")?b(new qq.FineUploaderBasic(a)):b(new qq.FineUploader(a)));return c};e=function(a,b){var d=c.data("fineuploader");if(b)void 0===d&&(d={}),d[a]=b,c.data("fineuploader",d);else return void 0===d?null:d[a]};b=function(a){return e("uploader",a)};f=function(a,b){return e(a,b)};h=function(b){var d=b.callbacks={};a.each((new qq.FineUploaderBasic)._options.callbacks,function(a,b){var e,f;e=/^on(\w+)/.exec(a)[1];
e=e.substring(0,1).toLowerCase()+e.substring(1);f=c;d[a]=function(){var a=Array.prototype.slice.call(arguments);return f.triggerHandler(e,a)}})};k=function(b,d){var e,h;e=void 0===d?"basic"!==b.uploaderType?{element:c[0]}:{}:d;a.each(b,function(b,c){0<=a.inArray(b,g)?f(b,c):c instanceof a?e[b]=c[0]:a.isPlainObject(c)?(e[b]={},k(c,e[b])):a.isArray(c)?(h=[],a.each(c,function(b,c){c instanceof a?a.merge(h,c):h.push(c)}),e[b]=h):e[b]=c});if(void 0===d)return e};l=function(c){return"string"===a.type(c)&&
!c.match(/^_/)&&void 0!==b()[c]};m=function(a){return b()[a].apply(b(),Array.prototype.slice.call(arguments,1))};a.fn.fineUploader=function(e){c=this;if(b()&&l(e))return m.apply(this,arguments);if("object"===typeof e||!e)return d.apply(this,arguments);a.error("Method "+e+" does not exist on jQuery.fineUploader");return this}})(jQuery);

