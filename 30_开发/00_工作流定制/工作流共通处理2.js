/*******************************************************************
 * 变量定义
 ******************************************************************/
 var editFlagDict = {};

function onSheetLoad() {
    loadScripts(["/Apps/DEP/Content/sdk/sdk.js"], function(){
        main();
    });
};

function onSheetCheck() {
};

function onAnyCellUpdate() {
};

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

function main() {
    /*
     * 参数获取
     */
    // 获取节点ID
    var nid = getQueryString("nid");
    //当没有节点Id 所以处于只读状态 初始化按钮
    var MessageID = getQueryString("mid");
    // 领导的节点，自定义按钮
    var isWkfRunnign = IsWkfRunning();
    
    /*
     * 样式改造
     */
    // 添加全局样式
    AddCustomCss();

    /*
     * 动作改造
     */
    // 覆盖默认保存草稿操作
    onSaveDraft();

    if(isWkfRunnign){
		GetOpinionConfig(MessageID, nid);
    }
    // 初始化修改意见
    initChangeOpinionCell(MessageID);

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
}

/******************************************************************************************
 *              个人意见部分
 ******************************************************************************************/

function GetOpinionConfig(mid, nid) {
    $.ajax({
        url: "/Apps/DEP/Workflow/GetPrivateOpinionConfig",
        type: "POST",
        data: {
            mid: mid
        },
        success: function(data){
            var opinionConfig = null;
            var i = 0;
            for (i = 0; i < data.Data.opinions.length; i++) {
                var item = data.Data.opinions[i];
                if (nid == item.key) {
                    opinionConfig = item.value;
                    break;
                }
                else
                {
                    continue;
                }
            }
            if (opinionConfig == null) {
                console.log("目前节点无个人意见配置");
            } else {
                RenderPrivateOpinion(mid, nid, opinionConfig);
            }
        },
        error:function(error){
            console.log(error);
        }
    })
}
// 渲染个人意见
function RenderPrivateOpinion(mid, nid, config) {
    // 意见表格ID
    opinion_cell_id = config.valueCellId;
    // 意见历史表格ID
    opinion_cell_history_id = opinion_cell_id + ' > div.cell-history';;
    // 当前意见表格ID
    opinion_cell_current_id = opinion_cell_id + ' > div.cell-current';;
    // 个人意见表格ID
    opinion_list_button_id = config.optionCellId;

    // 添加个人意见列表
    AddPrivateOpinion(opinion_list_button_id);
    ShowPrivateOpinion(opinion_list_button_id);
}

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
    SaveCellData(worksheet_id, getQueryString('nid'), opinion_cell_id.split('-')[1], opinion_cell_id.split('-')[2], opinion, '');
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
// 插入个人意见列表
function AddPrivateOpinion(opinion_button_id){
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