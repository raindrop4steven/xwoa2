/*******************************************************************
 * 住建局公文流转表单
 ******************************************************************/

function onSheetLoad() {
    // 样式先载入
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

// 每个表单的定制入口
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

    if(isWkfRunnign){
        /*
         * 动作改造
         */
        // 覆盖默认保存草稿操作
        onSaveDraft();
        // 个人意见修改
        GetOpinionConfig(MessageID, nid);
        // 初始化修改意见
        // initChangeOpinionCell(MessageID, function(mid, nid, type){
        //     console.log(mid);
        //     console.log(nid);
        //     console.log(type);
        // });
        // 初始化自定义按钮
        RenderCustomButton(MessageID);
        // 显示原流程按钮
        ShowOriginWorkflow(MessageID);

        if(nid === 'NODE0001'){
            var options = [
                {'content': '新吴区党政办'},
                {'content': '无锡市住建局'},
                {'content': '省政府'},
                {'content': '市委市政府'},
                {'content': '新吴区住建局'},
                {'content': '无锡市人民办'},
                {'content': '江苏省人防办'},
                {'content': '新吴区扫黑除恶专项斗争领导小组'},
                {'content': '高新区（新吴区）打好污染防治攻坚战指挥部办公室'},
                {'content': '无锡市交通运输局'},
                {'content': '无锡市交通运输管理处'},
                {'content': '新区发展建设集团'},
                {'content': '其他'}
            ]
            // 定制显示来文单位
            ShowUnitList("unit", "165px", "200px", "362px", "72px", "483px", options, '#C-4-8', '#C-4-4', null);

            var DocumentNoOptions = [
                {'content': '锡建质安'},
                {'content': '锡建房管'},
                {'content': '锡新办发'},
                {'content': '锡新政办发'},
                {'content': '锡新污防攻坚办'},
                {'content': '锡防发'},
                {'content': '苏防'},
                {'content': '锡建发'},
                {'content': '锡新专会纪'},
                {'content': '锡新扫黑办'},
                {'content': '锡新政发'},
                {'content': '锡交发'},
                {'content': '锡交运管发'}
            ]
            // 定制显示来文单位
            ShowUnitList("receiveNo", "672px", "269px", "161px", "72px", "178px", DocumentNoOptions, '#C-5-9', '#C-5-8', null);
        }
    }
    $("#tbSheet").show();
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

// 通用样式修改
function AddCustomCss() {
    // 修复弹出框被文件选择框挡住的问题
    var styleTag = $('<style>.DropDown { z-index: 999; } .my-niban-opinion a, .my-opinion a {display:inline-block; margin-right: 10px;border: 1px solid #337ab7;font-size: 13px;padding: 3px 5px;margin-bottom: 10px;margin-left:15px;} .my-niban-opinion textarea, .my-opinion textarea { margin-top: 3px;margin-left: 15px;} #receiveNo > ul > li:hover,div#unit > ul > li:hover {background: rgb(207,229,239);}</style>')

    $('html > head').append(styleTag);
    // 表单居中
    $("#tbSheet").hide();
    $("#tbSheet").css('margin-left', '-71px');
    $("#page").css('display', 'flex');
    $("#page").css('width', '100%');
    $("#page").css('height', '100%');
    $("#page").css('justify-content', 'center');
}