$(function () {
    //获取用户基本信息
    gitUserinfo();

    // 退出登录操作
    $("#btnLogout").on('click', function () {

        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地token
            localStorage.removeItem('tokens');
            //跳转到登录界面
            location.href = '/login.html'

            layer.close(index);
        });
    })
});


//获取用户基本信息
function gitUserinfo() {
    $.ajax({
        url: '/my/userinfo',
        type: 'get',
        // data: {},
        // dataType: 'json',
        // headers: {
        //     Authorization: localStorage.getItem('token1') || ''
        // },
        success: (res) => {
            // console.log(res);
            if (res.status !== 0) {
                //认证失败
                return layer.msg(res.message);
            }
            // 请求成功,渲染头像
            renderAvatar(res.data);
        }
    })
}

// 请求成功,渲染头像
function renderAvatar(user) {
    const name = user.nickname || user.username;
    if (user.user_pic !== null) {
        //有图片
        $(".layui-nav-img").show().attr('src', user.user_pic);
        $(".text-avatar").hide();
    } else {
        //没有图片
        $(".layui-nav-img").hide();
        //如果没有图片那就将第一个名字的字母转换成大写作为文字头像
        $(".text-avatar").show().html(name[0].toUpperCase());
        $("#welcome").html('欢迎&nbsp&nbsp;' + name)
    }


}
