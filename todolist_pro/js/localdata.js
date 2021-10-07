
/** 数据操作类 - 负责 localStorage 操作 ------------------------------------------
 *  author:JamesZou-itcast.cn
 */
class LocalData {

  // 一、构造函数 --作用：为对象 添加 各种属性--------------------------
  constructor(localStorageKey, primaryKey = 'id') {
    // 保存 存在本地的数据 的 键(Key)
    this.dataKey = localStorageKey; // 'todolist14'

    // 保存 数据对象的 主键名称（默认为 id）
    this.primaryKey = primaryKey;
  }

  // 二、类的各种自定义函数 --作用：为 对象 准备 方法 -------------------

  // 0.1 读取本地数据，返回字符串 ---------
  saveData(dataArray) {
    // 保存到 localStrorage 中
    let dataStr = JSON.stringify(dataArray);
    localStorage.setItem(this.dataKey, dataStr);
  }

  // 0.2 读取全部数据，返回数组------------
  readData() {
    let dataStr = localStorage.getItem(this.dataKey); // 读取出来的 数据字符串
    let data = []; // 数据对象

    if (dataStr != null) {
      data = JSON.parse(dataStr); // 将字符串转成 对象/数组
    }

    return data; // 返回 对象/ 数组
  }

  // 1.新增数据---------------------------
  addData(newDataObj) {
    // 读取本地数据
    let dataArray = this.readData();
    if (dataArray == null) {
      dataArray = [];
    }

    // 自动生成 主键值 (id 值)
    //  如果 数组 长度 > 0，则 将 最后一个 元素的 id 值 取出 + 1 作为 新元素的 id值
    //               <= 0, 则 将 1 作为 新元素的 id 值
    //newDataObj.id =  新的id值
    newDataObj[this.primaryKey] = dataArray.length > 0 ? dataArray[dataArray.length - 1][this.primaryKey] + 1 : 1;

    // 将添加了 主键值 的 对象 追加到数组
    dataArray.push(newDataObj);

    // 将数组 保存到 localStrorage 中
    this.saveData(dataArray);

    // 返回 本次 新增时 自动生成的 id 值
    return newDataObj[this.primaryKey];
  }

  // 2.删除数据 ---------------------------
  removeDataById(id) {
    // 2.1 从本地 读取 数组
    let dataArray = this.readData();
    // 2.2 如果数组存在 
    if (dataArray && dataArray.length > 0) {
      // 2.3 去数组中 找出 要删除元素的 下标
      let delIndex = dataArray.findIndex((ele, i) => {
        return ele[this.primaryKey] === id
      })
      // 2.4 如果 没有找到要删除的 元素，则返回 false
      if (delIndex === -1) return false
      // 2.5 如果找到了，根据 下标 删除元素
      dataArray.splice(delIndex, 1)
      // 2.6 将删除后的 数组 重新保存到 本地
      this.saveData(dataArray)
      // 2.7 删除后 返回 结果 true
      return true
    }
    return false; // 未找到要删除的元素，返回 false
  }
}