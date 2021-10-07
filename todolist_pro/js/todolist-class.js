
$(function () {
    //0.准备工具对象 ---------------------------------------------
    let keyName = 'cid'
    // localdata 用来协助我们 操作 LocalStoarge中的数据
    let localdata = new LocalData('todolist14', keyName)

    //0.准备常用的 jq对象
    let $todoList = $('#todolist')
    let $doneList = $('#donelist')
    let $todoCount = $('#todocount')
    let $doneCount = $('#donecount')

    //1.准备数据结构 - 用来保存 每个工作记录的数据 -------------------
    class Item {
        constructor(title, done = false) {
            // 为new出来的 空对象 添加 2个成员属性
            this.title = title;
            this.done = done;
        }
    }

    //2.添加笔记：为文本框添加 键盘事件 -----------------------------
    $('#title').on('keyup', function (e) {
        //a.判断 是否按下的为 回车键
        if (e.key === 'Enter') {
            //b.将数据封装成对象，并 保存到 本地
            //b1.创建 Item构造函数 实例：文本框里的值
            let item = new Item(this.value)
            console.log(item) // {title: "多喝热水", done: false}
            //b2.将item通过 封装好的localdata对象 保存到本地，并获取新id
            let newId = localdata.addData(item)
            item[keyName] = newId // 将生成的id设置给数据对象 {title: "多喝热水", done: false ,id:1}
            //c.根据数据创建 li 添加到 正在进行列表
            createLi(item)
            //d.统计数量
            countNum()
        }
    })
    //3.创建li标签函数 --------------------------------------------
    // 参数 itemData：笔记数据（id,title,done）
    function createLi(itemData) {
        // 判断 数据.done 的值：如果是 true，加入 doneList 如果是 false 加入 todolist
        if (itemData.done) {
            // 将 新对象 追加到 已完成列表
            $doneList.append(`<li>
                                <input data-id="${itemData[keyName]}" type="checkbox" checked/>
                                <p>${itemData.title}</p>
                                <a data-id="${itemData[keyName]}" href="javascript:;"></a>
                            </li>`)
        } else {
            // 将 新对象 追加到 未完成列表
            $todoList.append(`<li>
                                <input data-id="${itemData[keyName]}" type="checkbox"/>
                                <p>${itemData.title}</p>
                                <a data-id="${itemData[keyName]}" href="javascript:;"></a>
                            </li>`)
        }
    }
    //4.读取本地数据，生成li  --------------------------------------
    loadList()
    function loadList() {
        //4.1 读取本地 数组
        let arrList = localdata.readData()
        //4.2 遍历数组，生成li
        for (let item of arrList) {
            // 4.3 创建 li
            createLi(item)
        }
        //4.3 统计数量
        countNum()
    }

    // 【注意】按钮中 的 onclick 里 调用函数时，是去 window(全局作用域)里找
    //5.0 将 删除按钮的 click事件委托给 ul/ol
    //5.1 删除：事件处理函数 ------------------------------------------
    $('#todolist,#donelist').on('click', 'li>a', function () {
        // 将事件源 删除按钮 转成 jq对象
        let $btnDel = $(this)
        //5.1 删除 本地 id相同的 数据对象
        let id = $btnDel.data('id')
        localdata.removeDataById(id)
        //5.2 删除 当前 按钮的 父元素
        $btnDel.parent().remove()
        //5.3 统计数量
        countNum()
    })

    //6.复选框点击事件：移动列表项 -----------------------------------
    $('#todolist,#donelist').on('change', 'li>input', function () {
        //6.1 将 被点击的 checkbox 包装成jq对象
        let $chk = $(this)
        let itemId = $chk.data('id') // 取出 data-id的值
        //6.2 如果是选中状态
        if ($chk.prop('checked')) {
            //a.将 li 移动到 完成列表中
            $chk.parent().appendTo($doneList)
            //b.改变当前 数据的 完成状态 为 true
            changeDoneStatus(itemId, true)
        } else {
            //a.如果是取消状态，则将 li 移动到 未完成列表中
            $chk.parent().appendTo($todoList)
            //b.改变当前 数据的 完成状态 为 false
            changeDoneStatus(itemId, false)
        }

        //6.3 统计数量
        countNum()
    })
    //7.改变本地数据的选中状态 --------------------------------------
    // 参数：id - 要求改的数据的id
    //      isDone - 要修改成 true/false
    function changeDoneStatus(id, isDone) {
        //根据 传入的 id 到 本地数据中 找到 对象，并将done属性改成 isDone
        //a.从本地读取 数组数据
        let itemList = localdata.readData()
        //b.根据 传入的 id找数组中的对象
        itemList.forEach((ele, i) => {
            // 如果 遍历的 对象[keyName] 等于 要找的元素的id
            if (ele[keyName] === id) {
                // 修改这个元素对象的 done属性
                ele.done = isDone
                // 通知 forEach方法，停止循环
                return false
            }
        });
        //c.将 修改后的数组 重新保存到本地
        localdata.saveData(itemList)
    }

    //8.统计 两个列表的 数量，并显示 --------------------------------
    function countNum() {
        // 统计正在进行列表 的数量
        let len1 = $todoList.children().length
        $todoCount.text(len1)
        // 统计已完成列表 的数量
        let len2 = $doneList.children().length
        $doneCount.text(len2)
    }
})
