ace.define("ace/theme/odymaterialy",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
exports.isDark = false;
exports.cssClass = "ace-odymaterialy";
exports.cssText = ".ace-odymaterialy .ace_gutter {\
background: #e8e8e8;\
color: #333;\
}\
.ace-odymaterialy .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-odymaterialy {\
background-color: #FFFFFF;\
color: black;\
}\
.ace-odymaterialy .ace_fold {\
background-color: #757AD8;\
}\
.ace-odymaterialy .ace_cursor {\
color: black;\
}\
.ace-odymaterialy .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-odymaterialy .ace_storage,\
.ace-odymaterialy .ace_keyword {\
color: blue;\
}\
.ace-odymaterialy .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-odymaterialy .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-odymaterialy .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-odymaterialy .ace_invalid {\
background-color: rgb(153, 0, 0);\
color: white;\
}\
.ace-odymaterialy .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-odymaterialy .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-odymaterialy .ace_support.ace_type,\
.ace-odymaterialy .ace_support.ace_class {\
color: #009;\
}\
.ace-odymaterialy .ace_support.ace_php_tag {\
color: #f00;\
}\
.ace-odymaterialy .ace_keyword.ace_operator {\
color: rgb(104, 118, 135);\
}\
.ace-odymaterialy .ace_string {\
color: #3A0D7B\
}\
.ace-odymaterialy .ace_comment {\
color: rgb(76, 136, 107);\
}\
.ace-odymaterialy .ace_comment.ace_doc {\
color: rgb(0, 102, 255);\
}\
.ace-odymaterialy .ace_comment.ace_doc.ace_tag {\
color: rgb(128, 159, 191);\
}\
.ace-odymaterialy .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-odymaterialy .ace_variable {\
color: #06F\
}\
.ace-odymaterialy .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-odymaterialy .ace_entity.ace_name.ace_function {\
color: #14197E\
}\
.ace-odymaterialy .ace_heading {\
color: #14197E\
}\
.ace-odymaterialy .ace_list {\
color: #92089C;\
}\
.ace-odymaterialy .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-odymaterialy .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-odymaterialy .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-odymaterialy .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-odymaterialy .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.07);\
}\
.ace-odymaterialy .ace_gutter-active-line {\
background-color : #DCDCDC;\
}\
.ace-odymaterialy .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-odymaterialy .ace_meta.ace_tag {\
color:#009;\
}\
.ace-odymaterialy .ace_meta.ace_tag.ace_anchor {\
color:#060;\
}\
.ace-odymaterialy .ace_meta.ace_tag.ace_form {\
color:#F90;\
}\
.ace-odymaterialy .ace_meta.ace_tag.ace_image {\
color:#909;\
}\
.ace-odymaterialy .ace_meta.ace_tag.ace_script {\
color:#900;\
}\
.ace-odymaterialy .ace_meta.ace_tag.ace_style {\
color:#909;\
}\
.ace-odymaterialy .ace_meta.ace_tag.ace_table {\
color:#099;\
}\
.ace-odymaterialy .ace_string.ace_regex {\
color: rgb(255, 0, 0)\
}\
.ace-odymaterialy .ace_string.ace_emphasis {\
font-style: italic;\
}\
.ace-odymaterialy .ace_string.ace_strong {\
font-weight: bold;\
}\
.ace-odymaterialy .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
