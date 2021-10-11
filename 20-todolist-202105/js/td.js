
// origin: teaching by zouhuadong
const key = '17todo'

// 1.1读取数据方法---------------------------------
function readData() {
    // a.读取本地数据
    let data = window.localStorage.getItem(key)
    // b.将返回json字符串 转成js对象
    data = JSON.parse(data)
    // c.如果读取的内容为空 null，则设置为 空数组
    !data && (data = [])
    return data
}




// 1.2保存数据方法---------------------------------
function saveData(data) {

    data = JSON.stringify(data)
    localStorage.setItem(key,data)
}

// jq入口函数：当页面准备完毕后 执行
$(function () {
    let $todo = $('#todolist')
    let $done = $('#donelist')
    let $todoNum = $('#todocount')
    let $doneNum = $('#donecount')

    //读取本地数据
    let data = readData()

    load()

    // 2.1加载列表
    function load() {
       data.forEach(t => {
           addTask(t)
       })
       count()
    }

    //根据对象添加li标签
    function addTask(task) {
        let $li = $(`<li>
                        <input type="checkbox" data-id="${task.id}">
                        <p>${task.title}</p>
                        <a href="javascript:;" data-id="${task.id}"></a>
                    </li>`)
        if (task.done) {
            $li.children('input').prop('checked',true)
            $done.append($li)
        } else {
            $todo.append($li)
        }
    }

//     // 2.2使用委托为 复选框 添加事件...
    $('#todolist,#donelist').on('change','li>input[type = checkbox]',function() {
        let $li = $(this).parent()
        if (this.checked) $li.appendTo($done)
        else $li.appendTo($todo)

        let target = data.find(e => e.id == this.dataset.id)
        target && (target.done =!target.done)
        saveData(data)

        count()
    })


    $('#title').on('keyup',function(e) {
        if (e.key != 'Enter') return
        let newTask = {
            id:data.length === 0 ? 1 : data[data.length - 1].id + 1,
            title:this.value.trim(),
            done:false
        }

        addTask(newTask)

        data.push(newTask)
        saveData(data)

        count()
    })


    $('#todolist,#donelist').on('click','li>a',function() {
        let $li = $(this).parent()
        $li.remove()

        let i = data.findIndex(e => e.id == this.dataset.id)
        i > -1 && data.splice(i,1)
        saveData(data)

        count()
    })
    // 统计
    function count() {
        $todoNum.text(data.filter(e =>!e.done).length)
        $doneNum.text(data.filter(e => e.done).length)
    }
})