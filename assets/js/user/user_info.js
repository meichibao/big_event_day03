$(function () {
    let form = layui.form;
    // 自定义验证规则 昵称长度
    form.verify({
        nickname: function (value) {
            if (value.length < 2 || value.length > 6) {
                return '昵称长度为2-6位之间'
            }
        }
    });

    // 用户渲染
    initUserInfo();

    let layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'get',
            // data: {},
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(444);

                // 成功后渲染页面
                form.val('formUserInfo', res.data)
            }
        })
    }

    //表单重置
    $("#btnReset").on('click', function (e) {
        e.preventDefault();
        //重新渲染用户信息
        initUserInfo();
    });

    // 修改用户信息
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            url: '/my/userinfo',
            type: 'POST',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    //失败
                    return layer.msg(res.message);
                }
                //成功
                layer.msg(res.message);

                //调用父元素页面中跟新用户信息和头像方法
                window.parent.gitUserinfo();
            }
        })
    })



})
