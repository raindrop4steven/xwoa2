/*******************************************************************
 * 住建局发文表单
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
            ShowUnitList("unit", "636px", "231px", "323px", "54px", "55px", options, '#C-5-9', '#C-5-9', null);
        }

        if (nid !== undefined && nid !== null && nid !== 'NODE0001') {
            // 正文编辑按钮
            addEditDocButton(worksheet_id);
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
    // .DropDown ul {font-size:12px;}
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



// TODO：放到sdk.js中去
function addEditDocButton(worksheet_id) {
    // 自定义顶部按钮
    var title_bar = $('#titlebar > ul', top.document);

    // 创建已阅按钮
    var edit_li = document.createElement('LI');
    var edit_button = document.createElement('BUTTON');
    edit_button.setAttribute("id", "btn-custom-read");
    edit_button.onclick = function () {
        GetCellAttachment(worksheet_id, 9, 4, WindowsOpenDoc);
    };
    var i = document.createElement('I');
    i.className = 'fa fa-edit';
    i.textContent = ' 正文编辑';
    edit_button.appendChild(i);
    edit_li.appendChild(edit_button);

    title_bar.prepend(edit_li);
}

/*
 * 获取公文指定位置的附件列表
 */
function GetCellAttachment(sid, row, col, callback) {
    $.ajax({
        url: '/Apps/DEP/Common/CellAttachment?sid=' + sid + '&row=' + row + '&col=' + col,
        type: 'GET',
        success: function(data) {
            console.log(data)
            if (data.Succeed) {
                attachment_list = data.Data.attachments;
                if (attachment_list.length == 1) {
                    var session = getCookie('APPKIZTICKET');
                    var origin = location.origin;
                    var attachment = attachment_list[0];
                    callback && callback(origin, session, attachment, row, col);
                } else {
                    alert('附件个数不为1，无法正文编辑');
                }
            }
            else
            {
                console.log(data.Message)
            }
        },
        error: function(error) {
            console.log(error)
        }
    })
}

function WindowsOpenDoc(origin, session, attachment, row, col) {
    var att_id = attachment.AttID;

    $.ajax({
        url: 'http://127.0.0.1:5000/openDoc',
        type: 'POST',
        data: {
            'origin': origin,
            'session': session,
            'att_id': attachment.AttID,
            'extension': attachment.AttExtension,
            'row': row,
            'col': col
        },
        success: function(data) {
            console.log(data)
            // 开始轮询，是否已经编辑上传
            CheckAttachmentStatus(att_id);
        },
        error:function(error){
            console.log(error);
            alert('请确认本地文档编辑服务已打开')
        }
    })
}

function CheckAttachmentStatus(att_id) {
    var interval = window.setInterval(function(){
        $.ajax({
            url: 'http://127.0.0.1:5000/status/' + att_id,
            type: 'GET',
            success: function(data) {
                if (data.code == 200) {
                    // 附件已经上传，询问是否刷新页面
                    if (window.confirm('检测到附件更新，是否刷新页面？')) {
                        // 停止轮询，并刷新页面
                        clearInterval(interval);
                        // YES
                        top.window.location.reload();
                    } else {
                        // NO
                        // just stay
                        console.log('用户取消了刷新页面')
                    }
                } else {
                    // 附件未上传，一直询问
                    console.log(data)
                }
            },
            error: function(error) {
                console.log(error);
            }
        })
    }, 1000, att_id);
    
}
/*
 * 工具类
 */
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}