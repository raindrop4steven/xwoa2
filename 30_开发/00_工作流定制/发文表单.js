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
            ShowUnitList("unit", "718px", "231px", "306px", "54px", "55px", options, '#C-5-9', '#C-5-9');
        }
    }
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
    $("#tbSheet").css('margin-left', '-71px');
    $("#page").css('display', 'flex');
    $("#page").css('width', '100%');
    $("#page").css('height', '100%');
    $("#page").css('justify-content', 'center');
}