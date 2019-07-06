/*******************************************************************
 * 新闻发布
 ******************************************************************/
function onSheetLoad(){
    AddCustomCss();
}
/**************************************************************************
 * 添加全局样式，修复弹出框被文件选择框挡住的问题
 *************************************************************************/
function AddCustomCss(){
	// 修复弹出框被文件选择框挡住的问题
  var styleTag = $('<style>.DropDown { z-index: 999; } .my-niban-opinion a, .my-opinion a {display:inline-block; margin-right: 10px;border: 1px solid #337ab7;font-size: 13px;padding: 3px 5px;margin-bottom: 10px;margin-left:15px;} .my-niban-opinion textarea, .my-opinion textarea { margin-top: 3px;margin-left: 15px;} #receiveNo > ul > li:hover,div#unit > ul > li:hover {background: rgb(207,229,239);}</style>')

	$('html > head').append(styleTag);
	// 表单居中
	$("#tbSheet").css('margin-left', '-71px');
	$("#page").css('display', 'flex');
	$("#page").css('width', '100%');
	$("#page").css('height', '100%');
	$("#page").css('justify-content', 'center');
}