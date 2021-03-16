$(function () {
    let form = layui.form;
    // 自定义验证规则 昵称长度
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //新旧密码不重复
        samepwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return '西密码不能与原密码相同!'
            }
        },
        // 新密码与确认密码要一致
        repwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次输入的密码不一致,请从新输入'
            }
        }

    });


    // 表单提交
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'POST',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    // 失败
                    return layui.layer.msg(res.message);
                }
                // 成功
                layui.layer.msg(res.message);

                //清空表单
                $(".layui-form")[0].reset()
            }
        })
    })




})
