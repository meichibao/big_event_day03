$(function () {
    // 文章类别列表展示
    initArtCateList();

    // 文章类别列表展示
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            // data: {},
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                let htmlstr = template('tpl-art-cate', { data: res.data })
                $("tbody").html(htmlstr);
            }
        })
    }

    // 添加文章列表
    let indexAdd = null;
    let layer = layui.layer;
    $("#btnAdd").on('click', function () {
        //利用layui框架显示提示添加文章区域
        indexAdd = layer.open({
            // 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
            type: 1,
            //头部标题
            title: '添加文章分类',
            //宽高
            area: ['500px', '250px'],
            // content可传入的值是灵活多变的，不仅可以传入普通的html内容，还可以指定DOM，更可以随着type的不同而不同
            // content: `<input type="text">` //这里content是一个普通的String
            content: $("#dialog-add").html()
            //用这个方法也是有效的但需要给form加隐藏属性,且外面需要再加一个盒子要将form一起获取到,不然会没有表单提交功能
            // content: $("#form-add").html()
        });
    });

    // 新增文章分类  事件委托
    $("body").on('submit', "#form-add", function (e) {
        // console.log(22);
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    // 失败
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg(res.message);
                //从新渲染页面
                initArtCateList();
                // 关闭弹出框
                layer.close(indexAdd);
            }
        })

    })


    // 编辑文章列表  事件委托
    let indexEdit = null;
    let form = layui.form;
    $("tbody").on('click', ".btn-edit", function () {
        indexEdit = layer.open({
            // 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-edit").html()
        });
        //获取当前被点击按钮的自定义属性data-id
        let id = $(this).attr("data-id");
        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'GET',
            // data: {},
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.messages)
                }
                //将获取到的数据渲染到弹框中
                form.val('form-edit', res.data);
                // 关闭弹框
                // layer.close(indexEdit);
            }
        })
    })

    //编辑文章  确认修改提交

    $("body").on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //重新渲染页面
                initArtCateList();
                // 关闭弹出框
                layer.close(indexEdit);
            }
        })
    })


    //删除文章分类
    $("tbody").on('click', ".btn-delete", function () {
        //先获取到当前被点击的按钮的data-id
        let id = $(this).attr("data-id");
        //框架提示框
        layer.confirm('确定要删除该分类吗?', { icon: 3, title: '提示' }, function (index) {
            // do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'GET',
                // data: {},
                // dataType: 'json',
                success: (res) => {
                    console.log(res);
                    if (res.status1 == 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 重新渲染页面
                    initArtCateList();
                }
            })
            layer.close(index);
        });
    })




})