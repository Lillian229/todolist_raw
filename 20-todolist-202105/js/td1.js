const key = '17todo'
function readData() {
    let data =window.localStorage.getItem(key)
    data = JSON.parse(data)
    !data && (data = [])
    return data
}

function saveData(data) {
    data = JSON.stringify(data)
    localStorage.setItem(key,data)
}

$(function () {
    let $todo = $('#todolist')
    let $done = $('#donelist')
    let $todoNum = $('#todocount')
    let $doneNum = $('#donecount')
    let data = readData()

    load()

    function load() {
        data.forEach(t => {
            addTask(t)
        })
        count()
    }

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

    $('#todolist,#donelist').on('change','li>input[type=checkout]', function () {
        let $li = $(this).parent()
        if (this.checked)  $li.appendTo($done)
        else $li.appendTo($todo)

        let target = data.find(e => e.id == this.dataset.id)
        target && (target.done = !target.done)
        saveData(data)
        count()
    })

    $('#title').on('keyup',function (e) {
        if(e.key != 'Enter') return 
        let newTask = {
            id: data.length === 0 ? 1 : data[data.length - 1].id + 1,
            title:this.value.trim(),
            done:falses
        }

        addTask(newTask)

        
        data.push(newTask)
        saveData(data)

        count()
    })


    $('#todolist,#donelist').on('click','li>a',function () {
        let $li = $(this).parent()
        $li.remove()


        let i = data.findIndex(e => e.id == this.dataset.id)
        i > -1 && data.splice(i,1)
        savaData(data)

        count()
    })


    function count() {
        $todoNum.text(data.filter(e => !e.done).length)
        $doneNum.text(data.filter(e => e.done).length)
    }
})