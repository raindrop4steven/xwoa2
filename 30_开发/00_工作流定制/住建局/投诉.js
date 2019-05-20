/*******************************************************************
 * 住建局投诉表单
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