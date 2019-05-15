/*******************************************************************
 * 部门下级来文表单定制
 ******************************************************************/

/*******************************************************************
 * 变量定义
 ******************************************************************/
//第一个节点
var FIRST_NODE_KEY = 'NODE0001'
// 第二个节点
var SECOND_NODE_KEY = 'NODE0002'

function onSheetLoad() {
	// 添加全局样式
    AddCustomCss();

    // 功能定制跟进
    loadScripts(["/Apps/DEP/Content/sdk/sdk.js"], function(){
        main();
    });
};

function onSheetCheck() {
};

function onAnyCellUpdate() {
};

function main() {
    var nid = getQueryString('nid');
    //当没有节点Id 所以处于只读状态 初始化按钮
    var MessageID = getQueryString("mid");

	// 针对下级来文的调整
	if(nid === FIRST_NODE_KEY){
		var $ele = $("#C-5-4");
		// 判断是否存在内容
		if($ele.text() === undefined || $ele.text().length === 0){
			$ele.text('〔〕');	
		}

		saveCell($ele);
		// 自定义控件
		ShowDeptList();
	}
	if(nid === SECOND_NODE_KEY){
		// ShowReceiveNoList();
		options = [
			{'content': '下级请示'},
			{'content': '下级其他'}
		]
		// 定制显示来文单位
		ShowUnitList("receiveNo", "672px", "269px", "161px", "72px", "178px", options, '#C-5-9', '#C-5-8');
	}

	var getBackNodeKey = $('#divGetback > input', top.document).attr('value');
	if(nid == FIRST_NODE_KEY || getBackNodeKey === FIRST_NODE_KEY){
		// 隐藏尾部
		ShowFirstPart();
	}

	// 领导的节点，自定义按钮
	var isWkfRunnign = IsWkfRunning();
	if(isWkfRunnign){
		/*
         * 动作改造
         */
        // 覆盖默认保存草稿操作
        onSaveDraft();
        // 个人意见
        GetOpinionConfig(MessageID, nid);
        // 初始化修改意见
        // initChangeOpinionCell(MessageID);
        // 初始化自定义按钮
        RenderCustomButton(MessageID);
	}
}

function ShowFirstPart(){
	// 修改对应文字(上报单位)
	$('#C-2-2').text('公文上报');
	$('#C-5-2').text('文号');
	$('#C-4-2').text("上报单位");
	$('#C-4-6').text("上报日期");

	// 收文文号长度
	$('#C-5-4').attr('colspan', 6);
	// 收文文号隐藏
	$('#C-5-6').hide();
	$('#C-5-8').hide();
	$('#C-5-9').hide();

	// 党政办拟办
	$('#tbSheet > tbody > tr:nth-child(9)').hide();
	$('#tbSheet > tbody > tr:nth-child(10)').hide();
	// 领导批示
	$('#tbSheet > tbody > tr:nth-child(11)').hide();
	$('#tbSheet > tbody > tr:nth-child(12)').hide();
	// 部门承办
	$('#tbSheet > tbody > tr:nth-child(13)').hide();
	$('#tbSheet > tbody > tr:nth-child(14)').hide();
	$('#tbSheet > tbody > tr:nth-child(15)').hide();
}

/**************************************************************************
 * 添加全局样式
 *************************************************************************/
function AddCustomCss(){
	// 修复弹出框被文件选择框挡住的问题
	var styleTag = $('<style>.DropDown { z-index: 999; }  .my-opinion a {display:inline-block; margin-right: 10px;border: 1px solid #337ab7;font-size: 13px;padding: 3px 5px;margin-bottom: 10px;margin-left:15px;} .my-opinion textarea { margin-top: 3px;margin-left: 15px;} </style>')
	$('html > head').append(styleTag);
	// 表单居中
	$("#tbSheet").css('margin-left', '-71px');
	$("#page").css('display', 'flex');
	$("#page").css('width', '100%');
	$("#page").css('height', '100%');
	$("#page").css('justify-content', 'center');
}

/******************************************************************
 * 工具方法 【必须】
 * ****************************************************************/
function loadScripts(array,callback){
    var loader = function(src,handler){
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function(){
            script.onreadystatechange = script.onload = null;
            handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild( script );
    };
    (function run(){
        if(array.length!=0){
            loader(array.shift(), run);
        }else{
            callback && callback();
        }
    })();
}
/*************************************************************************
 * 自定义输入/选择控件
 ************************************************************************/
function ShowDeptList(){
	$("#tbSheet").css('position', 'relative');
	// 添加按钮
	var showUnitButton = document.createElement('BUTTON');
	showUnitButton.id = "showUnitButton";
		showUnitButton.style = 'height:72px;position:absolute;right:483px;border:none;outline:none;padding:3px 12px;font-size:14px; background: url(/Apps/Workflow/images/drop.png) no-repeat right center;';
	showUnitButton.onclick = function(){
		$('#divChooseDept').empty().load('/Apps/People/Shared/GetDepartment.aspx?cr=0&rp=&cbx=true').dialog('open');
		return;	
	};
	$('#C-4-8').after(showUnitButton);
	
	//添加选择部门的页面
	$(document.body).append('<div id="divChooseDept" ></div>')  
	$('#divChooseDept').dialog({
		title: '选择部门', autoOpen: false, modal: true, width: 750, height: 600, resizable: false,
		beforeClose: function() { $('#divDept').empty(); },
		buttons:[{
			text: '确定', click: function () {
				try {
					var depts = getSelectedDept();
					var resultDepts = [];
					for(i=0 ;i < depts.length ;i++){
						resultDepts.push(depts[i].name);
					}
					var deptstr = resultDepts.join(',');
					$('#C-4-4').text(deptstr);
					SaveCellData(worksheet_id, getQueryString('nid'), 4, 4, deptstr, '');
					$('#divChooseDept').dialog('close');
				} catch (e) {
					alert('出错，请刷新页面。' + '\r\n' + e.message);
					location.reload();	  
				}
			}},
			{
				text: '取消', click: function () {
					$('#divChooseDept').dialog('close');
				}
			}]
	}); 
}