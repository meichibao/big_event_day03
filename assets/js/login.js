$(function () {
    //点击跳转登录注册界面
    $("#link_reg").on('click', function () {
        $(".login_box").hide();
        $(".reg_box").show();
    });

    $("#link_login").on('click', function () {
        $(".login_box").show();
        $(".reg_box").hide();
    });

    // 密码验证
    let form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],

        //自定义表单验证--两次密码是否一致  value：表单的值、item：表单的DOM对象
        pwss: function (value, item) {
            // 获取第一次 输入的密码
            const frist = $(".reg_box input[name=password]").val();
            // console.log(frist);
            if (value !== frist) {
                return '两次输入密码不一致!'
            };

            // 注册成功后的操作
            //跳转到登录界面
        }
    });

    // 用户注册
    $("#form-reg").on('submit', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        // console.log(12);
        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: {
                username: $(".reg_box input[ name=username]").val(),
                password: $(".reg_box input[ name=password]").val()
            },
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    //失败状态
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功操作
                layer.msg(res.message, { icon: 6 });
                //跳转到登录界面
                $("#link_login").click();
                //清空表单
                $("#form-reg")[0].reset();
            }
        });
    });

    // 用户登录
    $("#form-login").on('submit', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        // console.log(11);
        $.ajax({
            url: '/api/login',
            type: 'post',
            data: $("#form-login").serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    // 登录失败
                    return layer.msg(res.message, { icon: 5 });
                };
                // 登录成功
                // 跳转到后台主页
                location.href = '/index.html';
                //将返回的token身份验证码保存到本地
                localStorage.setItem('token1', res.token);
            }
        });

    });

});