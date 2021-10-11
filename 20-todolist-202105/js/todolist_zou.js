const key = '17todo'
// 1.1 读取数据方法------------------
function readData() {
    // a.读取本地数据
    let data = window.localStorage.getItem(key)
    // b.将返回的 json字符串 转成 js对象
    data = JSON.parse(data)
    // c.如果读取的内容为 空 null，则设置为 空数组
    !data && (data = [])


    return data
}


// 1.2 保存数据方法------------------
function saveData(data) {
    // a.将 传入的 数据 转成 json字符串
    data = JSON.stringify(data)
    // b.将它保存到本地
    localStorage.setItem(key, data)
}


// jq入口函数：当页面准备完毕后 执行
$(function () {
    let $todo = $('#todolist')
    let $done = $('#donelist')
    let $todoNum = $('#todocount')
    let $doneNum = $('#donecount')
    // 读取本地数据
    let data = readData()


    load()


    // 2.1 加载列表 ---------------------
    function load() {
        // b.循环数组生成列表（未完成/已完成）
        data.forEach(t => {
            addTask(t)
        })
        // c.统计数量
        count()
    }


    // 根据对象 添加 li标签
    function addTask(task) {
        // b0.创建 li标签 jq对象
        let $li = $(`<li>
                        <input type="checkbox" data-id="${task.id}">
                        <p>${task.title}</p>
                        <a href="javascript:;" data-id="${task.id}"></a>
                    </li>`)
        // b1.如果 已完成，添加到下面列表
        if (task.done) {
            // 将 li标签中 复选框 设置为选中状态
            $li.children('input').prop('checked', true)
            // 将 li标签 添加到 已完成列表中
            $done.append($li)
        } else {
            // b2.如果 未完成，添加到上面列表
            $todo.append($li)
        }
    }


    // 2.2 使用委托 为 复选框 添加事件----
    $('#todolist,#donelist').on('change', 'li>input[type=checkbox]', function () {
        let $li = $(this).parent()
        // a.如果选中，则 移动到 已完成列表
        if (this.checked) $li.appendTo($done)
        // b.如果未选中，则 移动到 未完成列表
        else $li.appendTo($todo)


        // 将 状态 更新 到 本地
        // a.到数组中 查找 id 相同的 元素对象
        let target = data.find(e => e.id == this.dataset.id)
        // b.如果找到了 数组中的 元素，则 修改它的 done属性值
        target && (target.done = !target.done)
        // c.重新覆盖到本地
        saveData(data)


        // d.统计数量
        count()
    })


    // 2.3 添加任务 ----------------------
    $('#title').on('keyup', function (e) {
        // a.如果不是按回车，则 退出函数执行
        if (e.key != "Enter") return
        // b.创建 对象
        let newTask = {
            id: data.length === 0 ? 1 : data[data.length - 1].id + 1,
            title: this.value.trim(),
            done: falses
        }


        // c.将对象 添加到 列表中
        addTask(newTask)


        // d.保存到数组再覆盖到本地
        data.push(newTask)
        saveData(data)


        // e.统计数量
        count()
    })


    // 2.4 使用委托 为 删除按钮 添加事件----
    $('#todolist,#donelist').on('click', 'li>a', function () {
        // a.获取 按钮 所在的 li 的 jq对象
        let $li = $(this).parent()
        // b.删除 li
        $li.remove()


        // 将 状态 更新 到 本地
        // a.到数组中 查找 id 相同的 元素对象
        let i = data.findIndex(e => e.id == this.dataset.id)
        // b.如果找到了 数组中的 元素，则 修改它的 done属性值
        i > -1 && data.splice(i, 1)
        // c.重新覆盖到本地
        saveData(data)


        // d.统计数量
        count()
    })


    // 2.5统计 两个 列表的数量并显示
    function count() {
        $todoNum.text(data.filter(e => !e.done).length)
        $doneNum.text(data.filter(e => e.done).length)
    }
})