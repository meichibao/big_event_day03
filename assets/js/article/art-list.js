$(function () {
    // 为art-template定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //第一提交参数
    let q = {
        pagenum: 1,    //是	int	页码值
        pagesize: 2,    //	是	int	每页显示多少条数据
        cate_id: '',    //否	string	文章分类的 Id
        state: '',    //否	string	文章的状态，可选值有：已发布、草稿
    }

    //初始化文章列表
    let layer = layui.layer;
    initTable();
    //封装初始化文章列表函数
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // layer.msg(res.message);
                //模板引擎
                let htmlstr = template('tpl-table', { data: res.data })
                $("tbody").html(htmlstr);

                // 调用分页
                renderPage(res.total);
            }
        })
    }


    // 初始化分类
    let form = layui.form;
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
                let htmlstr = template('tpl_cate', { data: res.data })
                $("[name=cate_id]").html(htmlstr);
                // 你的有些表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的。虽然我们没有双向绑定机制（因为我们叫经典模块化框架，偷笑.gif） 但没有关系，你只需要执行 form.render(type, filter); 方法即可
                // 第一个参数：type，为表单的 type 类型，可选。默认对全部类型的表单进行一次更新
                // 第二个参数：filter，为 class="layui-form" 所在元素的 lay-filter="" 的值。你可以借助该参数，对表单完成局部更新
                form.render();
            }
        });

        //点击筛选
        $("#form-search").on('submit', function (e) {
            e.preventDefault();
            //获取
            let cate_id = $("[name=cate_id]").val();
            let state = $("[name=state]").val();
            //赋值
            q.cate_id = cate_id;
            q.state = state;
            //渲染页面
            initTable();
        })
    }


    // 分页
    let laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,  //每页几条
            curr: q.pagenum,    //第几页
            // 分页模块设置
            layout: ['prev', 'limit', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //触发jump:分页初始化的时候,页码改变的时候
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                //obj 所有参数所在的对象  first:是否是第一次初始化分页
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行 如果不是第一次才执行初始化
                if (!first) {
                    //初始化分页列表
                    initTable();
                }
            }
        })
    }

    // 删除  事件委托
    $("tbody").on('click', '.btn-delete', function () {
        // console.log(3213);
        let id = $(this).attr("data-id");
        layer.confirm('确定要删除该文章?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'GET',
                // data: {},
                // dataType: 'json',
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    //当页面汇总删除按钮个数等于1,页码大于1
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    //刷新文章列表
                    initTable();
                }
            })

            layer.close(index);
        });


    })

})