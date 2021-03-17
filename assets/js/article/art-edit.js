$(function () {

    let form = layui.form;
    let layer = layui.layer;
    function initForm() {
        let id = location.search.split("=")[1];
        // console.log(id);
        $.ajax({
            url: '/my/article/' + id,
            method: 'GET',
            // data: {},
            // dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //渲染到表单中
                form.val('form-edit', res.data);
                //tinyMCE 赋值
                // tinyMCE.activeEditor.setContent(res.data.content);

                //图片渲染
                // 非空校验
                console.log(res.data.cover_img);

                if (!res.data.cover_img) {

                    console.log(111);
                    return layer.msg('该用户没有上传封面');

                }
                // 图片地址
                let newImgURL = baseURL + res.data.cover_img;
                // console.log(baseURL);
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域

            }
        })
    }


    // 初始化分类
    initCate();

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            // data: {},
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // layer.msg(res.message);
                //模板引擎
                let htmlstr = template('tpl-cate', { data: res.data })
                $("[name=cate_id]").html(htmlstr);
                // 你的有些表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的。虽然我们没有双向绑定机制（因为我们叫经典模块化框架，偷笑.gif） 但没有关系，你只需要执行 form.render(type, filter); 方法即可
                // 第一个参数：type，为表单的 type 类型，可选。默认对全部类型的表单进行一次更新
                // 第二个参数：filter，为 class="layui-form" 所在元素的 lay-filter="" 的值。你可以借助该参数，对表单完成局部更新
                form.render();
                //文章分类渲染完毕再调用
                initForm();
            }
        });

    };

    // 初始化富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //选择文件
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click();
    });


    //设置图片
    $("#coverFile").change(function (e) {
        //拿到传入的图片
        let file = e.target.files[0];
        // console.dir(e.target)
        // console.log(e.target.files);
        // 非空校验
        if (file == undefined) {
            return layer.msg('您可以选择一张图片作为封面!')
        }

        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 设置状态
    let state = '已发布'   //可将status设已发布为默认值 减少事件
    // $("#btnSave1").click(function () {
    //     status = '已发布'
    // });

    $("#btnSave2").click(function () {
        state = '草稿'
    });

    //发布提交
    $("#form-pub").on('submit', function (e) {
        e.preventDefault();
        // console.log(this);
        //收集数据
        let fd = new FormData(this);
        //存入状态
        fd.append('state', state);
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // ["title", "的"]0: "title"1: "的"length: 2__proto__: Array(0) (2) ["cate_id", "2"] (2) ["content", "<p>的</p>"] (2) ["status", "已发布"] (2) ["cover_img", File]
                // console.log(...fd);
                //发布文章
                // console.log(...fd);
                publishArticle(fd);
            });

    })


    // 发布文章方法
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/edit',
            method: 'POST',
            data: fd,
            //FormData 数据 需要添加cp组合
            contentType: false,
            processData: false,
            // dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);

                //跳转到文章列表页面  设置定时器 延时跳转
                setTimeout(function () {
                    //不能用location方式跳转,因为类表处需要有被点击的样式
                    // location.href = '/article/art-list.html'
                    //手动设置文章列表点击
                    window.parent.document.querySelector("#art-list").click();
                }, 1000);

            }
        })
    }








})