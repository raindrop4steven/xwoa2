/*******************************************************************
 * 变量定义
 ******************************************************************/
 //第一个节点
 var FIRST_NODE_KET = 'NODE0001'
 //节点
 var NIBAN_NODE_KEY = 'NODE0002';
 var LEADER_NODE_KEY = 'NODE0004';
 var DEPT_NODE_KEY  = 'NODE0005';

/*
 * 领导意见
 */
// 领导意见表格ID
var LEADER_OPINION_CELL_ID = '#C-11-4';
// 领导意见历史表格ID
var LEADER_OPINION_CELL_HISTORY_ID = '#C-11-4 > div.cell-history';
// 领导当前意见表格ID
var LEADER_OPINION_CELL_CURRENT_ID = '#C-11-4 > div.cell-current';
// 领导个人意见表格ID
var LEADER_OPINION_LIST_BUTTON_ID = '#C-12-8';

/*
 * 部门意见
 */
// 部门意见表格ID
var DEPT_OPINION_CELL_ID = '#C-13-4';
// 部门意见历史表格ID
var DEPT_OPINION_CELL_HISTORY_ID = '#C-13-4 > div.cell-history';
// 部门当前意见表格ID
var DEPT_OPINION_CELL_CURRENT_ID = '#C-13-4 > div.cell-current';
// 部门个人意见表格ID
var DEPT_OPINION_LIST_BUTTON_ID = '#C-14-8';

function onSheetLoad() {
    // 添加全局样式
    AddCustomCss();
    
    // 覆盖默认保存草稿操作
    onSaveDraft();

    // 获取节点ID
    var nid = getQueryString("nid");
    //当没有节点Id 所以处于只读状态 初始化按钮
    var MessageID = getQueryString("mid");

    if(nid === 'NODE0001'){
        options = [
            {'content': '中共无锡市委'},
            {'content': '中共无锡市委办公室'},
            {'content': '无锡市人民政府'},
            {'content': '无锡市人民政府办公室'},
            {'content': '中共江苏省委'},
            {'content': '中共江苏省委办公厅'},
            {'content': '江苏省人民政府'},
            {'content': '江苏省人民政府办公厅'},
            {'content': '中共中央国务院'},
            {'content': '江苏省物价局 江苏调查总队'},
            {'content': '无锡市河长制工作办公室'},
            {'content': '无锡市太湖蓝藻打捞工作协调小组办公室'},
            {'content': '省大气污染防治联席会议办公室'},
            {'content': '无锡市环境保护委员会办公室'},
            {'content': '无锡市太湖水污染防治办公室'}
        ]
		// 定制显示来文单位
		ShowUnitList("unit", "165px", "362px", options, '#C-4-8', '#C-4-4');
    }

    // 领导的节点，自定义按钮
	var isWkfRunnign = IsWkfRunning();
	if(isWkfRunnign){
		if(nid === LEADER_NODE_KEY || nid === DEPT_NODE_KEY){      
		// 领导的节点，自定义按钮
        // 检查页面中是否有代理按钮
        btn_delegate_length =$("#btn-rehandle", top.document).text().length;
		console.log($("#btn-rehandle", top.document).text().length);
		if(nid === LEADER_NODE_KEY){
			// 意见表格ID
			opinion_cell_id = LEADER_OPINION_CELL_ID;
			// 意见历史表格ID
			opinion_cell_history_id = LEADER_OPINION_CELL_HISTORY_ID;
			// 当前意见表格ID
			opinion_cell_current_id = LEADER_OPINION_CELL_CURRENT_ID;
			// 个人意见表格ID
			opinion_list_button_id = LEADER_OPINION_LIST_BUTTON_ID;
            // 如果没有委托，则显示意见等按钮
            if(btn_delegate_length == 0){
                addCustomButtons(opinion_cell_id, 'NODE0003');
                AddPrivateOpinion(opinion_list_button_id);
            }
		}else{
		  // -- 部门承办
		  // 意见表格ID
		  opinion_cell_id = DEPT_OPINION_CELL_ID;
		  // 意见历史表格ID
		  opinion_cell_history_id = DEPT_OPINION_CELL_HISTORY_ID;
		  // 当前意见表格ID
		  opinion_cell_current_id = DEPT_OPINION_CELL_CURRENT_ID;
		  // 个人意见表格ID
		  opinion_list_button_id = DEPT_OPINION_LIST_BUTTON_ID;
				// 如果没有委托，则显示意见等部分
				if(btn_delegate_length == 0){
					AddPrivateOpinion(opinion_list_button_id);
				}
			}  
		}
    }
    initChangeOpinionCell(MessageID);
};

function onSheetCheck() {
};

function onAnyCellUpdate() {
};


/*********************************************************************
 * 共同业务类
 *********************************************************************/
// 覆盖默认的【保存草稿】操作
function onSaveDraft() {
    $('#btn-savedraft', top.document).click(function(e){
        e.preventDefault();
        // 保存映射表数据
        updateTable();
        // 执行默认保存草稿操作
        $(this).unbind('click').click();
    });
}

// 更新映射表
function updateTable() {
    var mid = getQueryString("mid");
    var node = getQueryString("nid");

    $.ajax({
        type: 'GET',
        url: '/Apps/DEP/Workflow/MappingData?mid=' + mid + "&node=" + node,
        success:function(data){
            console.log("数据映射成功");
        },
        error:function(error){
            console.log(error);
        }
    });
}

/*************************************************************************
 * 子流程
 *************************************************************************/
// 启动子流程
function startSubflow(){
    var mid = getQueryString("mid");
    var node = getQueryString("nid");

    $.ajax({
        url: '/Apps/DEP/Workflow/StartSubflow',
        type: 'POST',
        data: {
            'mid': mid,
            'nid': node
        },
        success:function(data){
            if(data.Succeed){
                // 在新页面打开流程
                window.open(data.Data.Url, '_blank');
            }
        },
        error:function(error){
            console.log(error);
        }
    })
}

// 添加子流程启动按钮
function addSubWorkflowButton(){
    // 判断当前用户是否具有发起子流程权限
    $.ajax({
        url: '/Apps/DEP/Workflow/CheckSubflowPerm',
        type: 'GET',
        success:function(data){
            if(data.Data.havePermission){
                var title_bar = $('#titlebar > ul', top.document);
                // 创建子流程按钮
                var subWorkflow_li = document.createElement('LI');
                var subWorkflowButton = document.createElement('BUTTON');
                subWorkflowButton.setAttribute("id", "btn-custom-sub-workflow");
                subWorkflowButton.onclick = function(){
                    startSubflow();
                };
                var i = document.createElement('I');
                i.className = 'fa fa-upload';
                i.textContent = '  启动部门流程';
                subWorkflowButton.appendChild(i);
                subWorkflow_li.appendChild(subWorkflowButton);
                
                title_bar.prepend(subWorkflow_li);
            }
        },
        error:function(error){
            console.log(error);
        }
    })
}

/*********************************************************************
 * 工具类
 *********************************************************************/
// 获取url中的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
};

function IsWkfRunning(){
	var wkfStatus = $("#left-panel > p:nth-child(3) > span", top.document).text();
	if(wkfStatus === '已完成'){
		return false;
	} else {
		return true;
	}
}


/******************************************************************************************
 *              覆盖默认的提交事件
 ******************************************************************************************/
function OverrideSubmit(IsRead, CellID, NodeKey){
	// Fix: 领导意见为空，不能提交
	// 领导意见第一个人提交和后续人提交对应的位置不同
	var currentOpinion = "";
	if($(".cell-current").length > 0){ // 后续领导提交
		currentOpinion = $(".cell-current").text();
	} else {
		// 首位领导提交
		currentOpinion = $(CellID).text();
	}
	if(IsRead || currentOpinion != undefined && currentOpinion.length > 0){
		// TODO： 判断是否需要覆盖默认的提交操作
		// 流程ID
		var MessageID = getQueryString("mid");
		// 节点ID
		var FromNodeKey = getQueryString("nid");
		// 前一个节点
		var NodeKey = NodeKey;
		
		// 获取下一个提交人
		$.ajax({
			   type: 'GET',
			   url: '/Apps/Tiger/Workflow/MessageHandle?MessageID='+MessageID+'&NodeKey='+NodeKey+'&FromNodeKey='+FromNodeKey,
			   success: function(result){
                console.log(result);
                Send(MessageID, NodeKey, FromNodeKey, result.Data.empl);
			   }
			   });
	} else {
		alert("请输入审批意见");
	}
}

function Send(MessageID, NodeKey, FromNodeKey, empl){
    $.ajax({
        type: 'POST',
        url: '/Apps/Workflow/Running/Send',
        data: {
			'mid':MessageID,
			'nid':FromNodeKey,
			'targets':'[{"node":"{0}","empl":"{1}","mode":"","memo":""}]'.format(NodeKey, empl),
			'memo':'',
			'memoAtts':[],
			'digitCertData':'',
			'digitSourceData':'',
			'digitSignedData':''
        },
        success: function(result){
			// 发送通知，使用无效nodekey，略过设置提醒节点
			var pdata = {}
			pdata.nlist = $.json2str('[]')
			pdata.nodekey = FromNodeKey;
			pdata.mid = MessageID	

			$.ajax({
				url: '/Apps/Tiger/Workflow/AddNotifyRecord',
				type: 'POST',
				data:pdata,
				async: false,
				dataType: 'json',
				success: function(r) {
					console.log(r)
				}
			});
			console.log(result);
			// 刷新网页
           top.location.href = '/Apps/Workflow/Running/Open?mid={0}&sendsucc=1'.format(MessageID);
        },
        error: function(error){
           console.log(error);
        }
    })
}

// 设置Cell值
function SaveCellData(sid, nid, row, col, val, ival){
    $.ajax({
           type: 'POST',
           url: '/Apps/Workflow/Worksheet/SaveCell',
           data: {
           'sid': sid,
           'nid': nid,
           'row': row,
           'col': col,
           'val': val,
           'ival': ival
           },
           success: function(result){
           console.log(result);
           },
           error: function(error){
           console.log(error);
           }
           });
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

/*************************************************************************
 * 自定义输入/选择控件
 ************************************************************************/
// 来文单位列表
function ShowUnitList(divId, left, width, options, posCellId, targetValueId){
	$("#tbSheet").css('position', 'relative');
	var div = document.createElement('DIV');
	div.id = divId;
	div.style = 'cursor: pointer;overflow: visible;position: absolute;left: '+left+';top: 200px;display: none;z-index:999;';
	var ul = document.createElement('UL');
	ul.style = ' list-style: none; margin: 0px; padding: 0px; border: 1px solid #000; background-color: #fff; position: absolute; max-height: 160px; overflow: auto; text-align: left; width:' + width +';';
	
	options.forEach(function(item){
		// item
		var li = document.createElement('LI');
		li.style = 'padding: 4px 16px 4px 4px; white-space: nowrap; border-bottom: 1px solid #888;hover:red;';
		li.textContent = item.content;
		ul.append(li);
	});
	div.append(ul);
	$(posCellId).after(div);
	
	var showUnitButton = document.createElement('BUTTON');
	showUnitButton.id = "showUnitButton";
	showUnitButton.onclick = function(){
		// $('#unit').toggle();
		var display = $('#'+divId).css('display');
		if(display === 'none'){
			$('#'+divId).css('display', 'block');
		} else {
			$('#'+divId).css('display', 'none');
		}
	};
	showUnitButton.style = 'height:72px;position:absolute;right:483px;border:none;outline:none;padding:3px 12px;font-size:14px; background: url(/Apps/Workflow/images/drop.png) no-repeat right center;';

	$(posCellId).after(showUnitButton);
	
	// 设置li点击事件
	$(document).on('click', "#"+divId +"> ul > li", function(event){
		console.log(event.target);
		console.log($(this).text());
		if(event.target.id !== 'deleteMe'){
			var opinion = $(this).contents().filter(function(){return this.nodeType==3;})[0].nodeValue;
			$(targetValueId).text(opinion);
			SaveCellData(worksheet_id, getQueryString('nid'), targetValueId.split('-')[1], targetValueId.split('-')[2], opinion, '');
			$("#"+divId).css('display', 'none');
		}
	});
	$("#tbSheet td").delegate('.EditBox', 'focusout', function () {
		$("#"+divId).css('display', 'none');
	});
	$("#tbSheet td").click(function () {
		$("#"+divId).css('display', 'none');
	});
}

/******************************************************************************************
 *              个人意见部分
 ******************************************************************************************/
// 插入【添加】按钮
function addInsertSelfButton(){
    // 获得表单
    $("#tbSheet").css('position', 'relative');
    $(opinion_cell_id).after('<button onClick="AddPrivateOpinionToDB()" style="position:absolute;right:55px;border-radius:4px;border:1px solid #28a4c9;padding:3px 12px;font-size:14px;color:#fff;background-color:#5bc0de;">添加个人意见</button>');
}
// 意见插入
function opinionChanged(id){
    var opinion = $(id).text();
    InsertMultiOpinion(opinion);
    ResetPublicOpinion(id);
}

// 插入多人意见方法
function InsertMultiOpinion(opinion){
    var selector = opinion_cell_history_id;
    if($(selector).text() == ""){
        selector = opinion_cell_id;
    } else {
        selector = opinion_cell_current_id;
    }
    $(selector).html(opinion);
    nid = getQueryString("nid");
    if(nid === LEADER_NODE_KEY){
        SaveCellData(worksheet_id, getQueryString('nid'), 11, 4, opinion, '');
    }else if(nid === DEPT_NODE_KEY){
        SaveCellData(worksheet_id, getQueryString('nid'), 13, 4, opinion, '');
    }
    
}
// 插入个人意见列表
function AddPrivateOpinion(opinion_button_id){
    ShowPrivateOpinion(opinion_button_id);
    $(opinion_button_id).attr('class', 'a-c b-l b-r b-t b-b drop control1');
    // 设置点击事件
    $(opinion_button_id).click(function(event){
                                    console.log(event.target);
                                    var privateOpinion = $("#privateOpinion");
                                    privateOpinion.toggle();
                                    });
    // 设置li点击事件
    $(document).on('click', "#privateOpinion > ul > li", function(event){
                   console.log(event.target);
                   console.log($(this).text());
                   if(event.target.id !== 'deleteMe'){
                   var opinion = $(this).contents().filter(function(){return this.nodeType==3;})[0].nodeValue;
                   $("#selectedPrivateOpinion").html(opinion);
                   InsertMultiOpinion(opinion);
                   }
                   });
    // 添加【添加个人意见按钮]
    addInsertSelfButton();
    // 个人意见删除按钮
    $(document).on('click','#deleteMe',function(event){
                   event.stopPropagation();
                   event.preventDefault();
                   console.log($(this).attr('opinionid'));
				   // 判断是否需要删除
					var selectedOpinionText = $('{0} > span'.format(opinion_button_id)).text();
					var parentClone = $(this).parent('li').clone();
					parentClone.find('button').remove();
					var deleteOpinionText = parentClone.text();
					if(deleteOpinionText === selectedOpinionText)
					{
						$(opinion_button_id).text("");
					}
                   DeletePrivateOpinionFromDB($(this).attr('opinionid'));
                   });
}

// 插入个人意见列表
function ShowPrivateOpinion(opinion_button_id){
    $.get('/Apps/Tiger/Opinion/GetPrivateOpinion', function(result){
          // 首先移除旧的意见列表
          if($("#privateOpinion").length > 0){
          $("#privateOpinion").remove();
          }
          var div = document.createElement('DIV');
          div.id = 'privateOpinion';
          div.style = 'cursor: pointer;overflow: visible;position: relative;left: -4px;top: 15px; display: none;z-index:999;';
          var ul = document.createElement('UL');
          ul.style = ' list-style: none; margin: 0px; padding: 0px; border: 1px solid #000; background-color: #fff; position: absolute; max-height: 160px; overflow: auto; text-align: left;';
          result.Data.opinions.forEach(function(item){
                                       // item
                                       var li = document.createElement('LI');
                                       li.style = 'padding: 4px 16px 4px 4px; white-space: nowrap; border-bottom: 1px solid #888;';
                                       li.textContent = item.content;
                                       // 删除按钮
                                       var deleteButton = document.createElement('BUTTON');
                                       deleteButton.id = "deleteMe";
                                       deleteButton.textContent = "删除";
                                       deleteButton.setAttribute("opinionId", item.id);
                                       deleteButton.setAttribute('style', 'margin-right:5px;border-radius:4px;border: 1px solid #28a4c9;padding:5px 12px;font-size:14px;color:#fff;background-color:#5bc0de;');
                                       li.prepend(deleteButton);
                                       ul.append(li);
                                       });
          div.append(ul);
          $(opinion_button_id).append(div);
          // Span元素，显示选中的值
          var span = document.createElement('SPAN');
          span.id = 'selectedPrivateOpinion';
          $(opinion_button_id).append(span);
          });
}
// 添加内容到个人意见
function AddPrivateOpinionToDB(){
    var selector = opinion_cell_history_id;
    if($(selector).text() == ""){
        selector = opinion_cell_id;
    } else {
        selector = opinion_cell_current_id;
    }
    var privateOpinion = $(selector).html();
    // 调用接口
    $.ajax({
           type: 'POST',
           url: '/Apps/Tiger/Opinion/AddPrivateOpinion',
           data: {'content': privateOpinion},
           success: function(result){
           ShowPrivateOpinion(opinion_list_button_id);
           alert("个人意见添加成功");
           },
           error: function(error){
           console.log(error);
           }
           });
    
}
// 从DB中删除个人意见
function DeletePrivateOpinionFromDB(id){
    $.ajax({
           type: 'POST',
           url: '/Apps/Tiger/Opinion/RemovePrivateOpinion',
           data: {'id': id},
           success: function(result){
           ShowPrivateOpinion(opinion_list_button_id);
           alert("删除成功");
           },
           error: function(error){
           console.log("删除失败");
           }
           });
}
// 重置选择后的表格
function ResetPublicOpinion(id){
    splitArray = id.split('-');
    SaveCellData(worksheet_id, getQueryString('nid'), splitArray[1], splitArray[2], '', '');
}

// 领导按钮
function addCustomButtons(cell_id, nodekey) {
    // 自定义顶部按钮
    var btn_submit = $('#btn-submit', top.document);
    var title_bar = $('#titlebar > ul', top.document);
    
    var row = cell_id.split('-')[1]
    var col = cell_id.split('-')[2]
    // 隐藏原先的提交按钮
    btn_submit.hide();
    // 创建已阅按钮
    var read_li = document.createElement('LI');
    var read_button = document.createElement('BUTTON');
    read_button.setAttribute("id", "btn-custom-read");
    read_button.onclick = function(){
        SaveCellData(worksheet_id, getQueryString('nid'), row, col, '已阅', '');
        OverrideSubmit(true, cell_id, nodekey);
    };
    var i = document.createElement('I');
    i.className = 'fa fa-send';
    i.textContent = ' 已阅';
    read_button.appendChild(i);
    read_li.appendChild(read_button);
    // 创建提交按钮
    var submit_li = document.createElement('LI');
    var submit_button = document.createElement('BUTTON');
    submit_button.setAttribute("id", "btn-custom-send");
    submit_button.onclick = function(){OverrideSubmit(false, cell_id, nodekey)};
    var i = document.createElement('I');
    i.className = 'fa fa-send';
    i.textContent = ' 提交';
    submit_button.appendChild(i);
    submit_li.appendChild(submit_button);
    title_bar.prepend(submit_li);
    title_bar.prepend(read_li);
}

/*************************************领导意见修改************************************** */
// 通用修改Cell
function initChangeOpinionCell(MessageID){
    $.ajax({
		url: "/Apps/DEP/Test/GeneralOpinion?mid=" + MessageID,
		type: 'GET',
		async: false,
		success: function(r) {
            if(r.Succeed == true)
            {
                r.Data.forEach(function(item){
                    var cellID = item.cellId;
                    var type = item.type;
                    var history = item.history;
                    
                    if (type == 0){ // 多人审批意见
                        $(cellID).html("");
                        $(cellID).html(history);
                    } else {
                        var historyCellID = cellID + ' > div.cell-history';
                        if($(historyCellID).text() != ""){ // 当前用户正在处理
                            cellID = historyCellID;
                        }
                        $(cellID).html("");
                        $(cellID).html(history);
                        // Todo: 前用户可签批时，应隐藏签批按钮
                        // if(cellID === historyCellID){
                        //     $(".fa.fa-edit").hide();
                        // }
                    }
                });
            }
            else
            {
                console.log(r.Message);
            }
		}
	});
}

//初始化拟办意见cell
function initNibanCell(MessageID){
	var nibanSelector = '#C-8-4';

	$.ajax({
		url: "/Apps/DEP/Test/GeneralOpinion?MessageID=" + MessageID,
		type: 'GET',
		async: false,
		dataType:'json',
		success: function(r) {
			// 检查是否有最新意见
			if(r.Opinion != undefined && r.Opinion.length > 0){
				$(nibanSelector).html("");
				$(nibanSelector).html(r.Opinion);
			}
		}
	});
}


 //初始化领导意见cell
 function initLeaderCell(MessageID){    
  var leaderSelector = LEADER_OPINION_CELL_HISTORY_ID;
  if($(leaderSelector).text() == ""){
    leaderSelector = LEADER_OPINION_CELL_ID;
  }
    $(leaderSelector).html("");
    
    $.ajax({
		url: "/Apps/DEP/Test/GeneralOpinion?MessageID=" + MessageID,
        type: 'GET',
        async: false,
        dataType:'json',
        success: function(r) {
            $(leaderSelector).html(r.history);
			// 当前用户可签批时，应隐藏签批按钮
			if(leaderSelector === LEADER_OPINION_CELL_HISTORY_ID){
				$(".fa.fa-edit").hide();
			}
        }
    });
    
  }

//初始化 可以编辑的区域
function initModify(){
    //当存在领导节点的时候，让领导意见部分可以再次修改
    if($.inArray(LEADER_NODE_KEY,read_only_node_ids) >=0 ){

        $(".my-opinion").on('click',function(){
            addModifyTextArea(this)
        })
    }

}

//转换编辑区域
function addModifyTextArea(opinionObj){
    if(editFlag)
    {
        //首先清空该td的点击事件
        var opinionVal = $(opinionObj).find('span').text();
        $(opinionObj).find('span').hide();

        //插入textarea 编辑框
        var tarea = $("<textarea />").width('95%').addClass("modify-leader");
        tarea.val(opinionVal)
        tarea.css({
            'resize':'none',
            'outline':'none',
            'height':'100%'
        })
        $(opinionObj).append(tarea)
        //添加提交按钮
        $(opinionObj).append(addModifyButton())
        $(opinionObj).append(addCancelButton())
		// 隐藏编辑图标
		$(".fa.fa-edit").hide();
        $('.my-opinion').unbind('click');
    }
    else
    {
        editFlag = true;
		// 显示编辑图标
		$(".fa.fa-edit").show();
    }
}

//添加修改的保存按钮
function  addModifyButton(){
   //创建保存按钮
    var modify_button = document.createElement('A');
    modify_button.textContent = "保存修改"
    modify_button.setAttribute("id","btn-read-only-modify");
    modify_button.onclick = function(){
        // 流程ID
        var MessageID = getQueryString("mid");
		// 排序
		var order = $('.my-opinion').attr("order");
		if(order === undefined)
		{
			order = "";
		}
        // 获取
        var opinion = $(".modify-leader").val();
        $.ajax({
            url: '/Apps/DEP/Test/AddNewOpinion',
            type: 'POST',
            data: { mid: MessageID ,nid:LEADER_NODE_KEY,opinion:opinion, order:order},
            async: false,
            dataType:'json',
            success: function(r) {
                if(r.Succeed){
                    top.location.href = '/Apps/Workflow/Running/Open?mid={0}'.format(MessageID); 
                }
            }
        });


    }
  return modify_button
}

//添加修改的取消按钮
function addCancelButton(){
 
    var c_button = document.createElement('A');
    c_button.textContent = "取消"
    c_button.setAttribute("id","btn-modify-cancel");
    c_button.onclick = function(){
        editFlag = false;
        $('.my-opinion').find('textarea').remove();
        $('.my-opinion').find('a').remove();
        $('.my-opinion').find('span').show(); 
        $(".my-opinion").on('click',function(){
            addModifyTextArea(this)
        });
    }
    return c_button
}

/************************** 拟办意见修改 *********************************/
//初始化 可以编辑的区域
function initNibanModify(){
    //当存在领导节点的时候，让领导意见部分可以再次修改
    if($.inArray(NIBAN_NODE_KEY,read_only_node_ids) >=0 ){
        $(".my-niban-opinion").on('click',function(){
            addNibanModifyTextArea(this)
        })
    }
}

//转换编辑区域
function addNibanModifyTextArea(opinionObj){
    if(nibanEditFlag)
    {
        //首先清空该td的点击事件
        var opinionVal = $(opinionObj).find('span').text();
        $(opinionObj).find('span').hide();

        //插入textarea 编辑框
        var tarea = $("<textarea />").width('95%').addClass("modify-niban");
        tarea.val(opinionVal)
        tarea.css({
            'resize':'none',
            'outline':'none',
            'height':'100%'
        })
        $(opinionObj).append(tarea)
        //添加提交按钮
        $(opinionObj).append(addNibanModifyButton())
        $(opinionObj).append(addNibanCancelButton())
		// 隐藏编辑图标
		$(".fa.fa-edit").hide();
        $('.my-niban-opinion').unbind('click');
    }
    else
    {
        nibanEditFlag = true;
		// 显示编辑图标
		$(".fa.fa-edit").show();
    }
}

//添加修改的保存按钮
function  addNibanModifyButton(){
   //创建保存按钮
    var niban_modify_button = document.createElement('A');
    niban_modify_button.textContent = "保存修改"
    niban_modify_button.setAttribute("id","btn-read-only-modify");
    niban_modify_button.onclick = function(){
        // 流程ID
        var MessageID = getQueryString("mid");
        // 获取
        var opinion = $(".modify-niban").val();
        $.ajax({
            url: '/Apps/DEP/Test/AddNewOpinion',
            type: 'POST',
            data: { mid: MessageID, opinion:opinion},
            async: false,
            dataType:'json',
            success: function(r) {
                if(r.Succeed){
                    top.location.href = '/Apps/Workflow/Running/Open?mid={0}'.format(MessageID); 
                }
            }
        });


    }
	return niban_modify_button
}

//添加修改的取消按钮
function addNibanCancelButton(){
 
    var niban_c_button = document.createElement('A');
    niban_c_button.textContent = "取消"
    niban_c_button.setAttribute("id","btn-modify-cancel");
    niban_c_button.onclick = function(){
        nibanEditFlag = false;
        $('.my-niban-opinion').find('textarea').remove();
        $('.my-niban-opinion').find('a').remove();
        $('.my-niban-opinion').find('span').show(); 
        $(".my-niban-opinion").on('click',function(){
            addNibanModifyTextArea(this)
        });
    }
    return niban_c_button
}