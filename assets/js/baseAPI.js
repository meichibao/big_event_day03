// $(function () {
// $.ajaxPrefilter()可以在调用ajax调用时,拦截所有请求,对参数进行处理
// 开发环境服务器路径地址
// let baseURL = 'http://ajax.frontend.itheima.net';
let baseURL = 'http://api-breakingnews-web.itheima.net';

// // 测试环境服务器路径地址
// let baseURL = 'http://ajax.frontend.itheima.net';
// // 生产环境服务器路径地址
// let baseURL = 'http://ajax.frontend.itheima.net';

$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token1') || ''
        }

    }


    //登录拦截
    options.complete = function (res) {
        const obj = res.responseJSON;

        if (obj.status === 1 && obj.message === '身份认证失败！') {
            //清除本地储存身份验证
            localStorage.removeItem('token1');
            ///跳转到登录页面
            location.href = '/login.html';
            // console.log(111);

        }
    }

});




// })