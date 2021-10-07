
/** 数据操作类 - 负责 localStorage 操作 ------------------------------------------
 *  author:JamesZou-itcast.cn
 */
class LocalData {

  // 一、构造函数 --作用：为对象 添加 各种属性--------------------------
  constructor(localStorageKey, primaryKey = 'id') {
    // 保存 存在本地的数据 的 键(Key)
    this.dataKey = localStorageKey;

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
    let dataArray = this.readData();
    if (dataArray == null) {
      dataArray = [];
    }

    // 自动生成 主键值 (id 值)
    //  如果 数组 长度 > 0，则 将 最后一个 元素的 id 值 取出 + 1 作为 新元素的 id值
    //               <= 0, 则 将 1 作为 新元素的 id 值
    newDataObj[this.primaryKey] = dataArray.length > 0 ? dataArray[dataArray.length - 1][this.primaryKey] + 1 : 1;

    // 将添加了 主键值 的 对象 追加到数组
    dataArray.push(newDataObj);

    // 将数组 保存到 localStrorage 中
    this.saveData(dataArray);

    // 返回 id
    return newDataObj[this.primaryKey];
  }

  // 2.删除数据 ---------------------------
  removeDataById(id) {
    let dataArray = this.readData();
    for (let i = 0; i < dataArray.length; i++) {

      // 判断 数组中元素的id 是否 等于 要删除的 id，如果是，则删除此元素
      if (dataArray[i][this.primaryKey] == id) {
        // 删除
        dataArray.splice(i, 1);
        // 将删除元素后的 数组 重新 保存到 localStrorage 中
        this.saveData(dataArray);

        return true; // 删除了目标元素，返回 true
      }
    }
    return false; // 未找到要删除的元素，返回 false
  }
}