function onSheetLoad() {
};

function onSheetCheck() {
};

function onAnyCellUpdate() {
};

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
        },
        error:function(error){
            console.log(error);
        }
    })
}
/*
 * 工具类
 */
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}