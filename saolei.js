function Game(tr, td, mineNum) {
    this.td = td;
    this.tr = tr;
    this.mineNum = mineNum; //存储预设或设定的炸弹总数，用于后续判断是否胜利使用
    this.surplusMine = 0; //剩余雷数
    this.minecell = []; //用于接收随机生成的雷的信息
    this.tdsArr = [] //存放单元格的信息
    this.isPlay = false; //是否开始玩
    this.openClass = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    this.gameBox = document.getElementById("gameBox");
    this.table = document.createElement("table"); //生成table标签
    this.footerNum = document.getElementById("surplusMine"); //剩余炸弹数量显示框
  
   }
  
   Game.prototype.creatDom = function() { //游戏区域
    this.table.oncontextmenu = function() { return false }; //清除默认右键单机事件
    for (var i = 0; i < this.gameBox.children.length; i++) { //为防止重新开始游戏时，重复生成多个table，在添加之前先删除之前的
     var childNod = this.gameBox.children[i];
     this.gameBox.removeChild(childNod);
    }
  
    for (var i = 0; i < this.tr; i++) {
     var tr = document.createElement("tr");
     this.tdsArr[i] = []; //为每一行生成一个数组
  
     for (var j = 0; j < this.td; j++) {
      var td = document.createElement("td");
      tr.appendChild(td); //将生成的td插入到tr中
      this.tdsArr[i][j] = td;
      td.cell = { //单元格的所有信息
       type: "number", //格子类型，用于判断是否时炸弹
       x: i, //行
       y: j, //列
       value: 0, //当该格子周围有炸弹时显示该数值，生成炸弹的时候会++
       isOpen: false, //判断该单元格是否被打开
       isFlag: false //判断是否有标记flag
      }
     }
     this.table.appendChild(tr); //见tr插入到table中
    }
    this.gameBox.appendChild(this.table);
   }
  
   Game.prototype.creatMine = function(event, target) { //生成炸弹
  
    var This = this;
    for (var i = 0; true; i++) { //随机生成炸弹，生成扎当数与设定扎当书mineNum相同时终止循环
     var randomX = Math.floor(Math.random() * this.tr), //随机生成炸弹的行数
      randomY = Math.floor(Math.random() * this.td); //随机生成炸弹的列数

     if (target.cell.x != randomX || target.cell.y != randomY) { //保证第一次点击的时候不是炸弹
      if (this.tdsArr[randomX][randomY].cell.type != "mine") { //保证每次生成的雷的位置不重复
  
       this.tdsArr[randomX][randomY].cell.type = "mine"; //单元格更改属性为雷
       this.surplusMine++; //生成雷的数量+1
       this.minecell.push(this.tdsArr[randomX][randomY]); //将生成的雷的信息存放到this变量中，方便后续使用
  
      }
      if (this.surplusMine >= this.mineNum) { //当生成的炸弹数量等于设定的数量后跳出循环
       break;
      }
     }
    }
  
    //为每个炸弹周围的方格添加数字
    for (var i = 0; i < this.minecell.length; i++) {
     var around = this.getAround(this.minecell[i], This); //获取每个炸弹的周围方格
    
  
     for (var j = 0; j < around.length; j++) { //将周围每个方格的value++
      around[j].cell.value += 1;
     }
    }
  
  
   }
  
   Game.prototype.getAround = function(thisCell, This) { //获取某个方格的周围非炸弹方格，需要传递一个单元格dom元素，Game的this
    var x = thisCell.cell.x, //行
     y = thisCell.cell.y, //列
     result = [];
    // x-1,y-1  x-1,y  x-1,y+1
    // x,y-1   x,y   x,y+1
    // x+1,y-1  x+1y  x+1,y+1
    for (var j = x - 1; j <= x + 1; j++) {
     for (var k = y - 1; k <= y + 1; k++) {
      if ( //游戏区域的边界，行数x和列数y不能为负数，且不能超过设定的行数和列数
       j < 0 ||
       k < 0 ||
       j > (This.tr - 1) ||
       k > (This.td - 1) ||
       //同时跳过自身和周边是雷的方格
       This.tdsArr[j][k].cell.type == "mine" ||
       (j == x && k == y)
  
      ) {
       continue; //满足上述条件是则跳过当此循环；
      } else {
       result.push(This.tdsArr[j][k]) //将符合的单元格push到result中返回
      }
     }
    }
    return result;
   }
  
   Game.prototype.lifeMouse = function(event, target) { //左键点击事件
    var This = this; //用变量的方式将Game的this传递到函数中
    var noOpen = 0; //没有被打开的格子数量
    if (!target.cell.isFlag) { //表示该必须没有被右键标记才能鼠标左击
     if (target.cell.type == "number") { //是数字时,则可视化
  
      function getAllZero(target, This) { //递归函数
    
       if (target.cell.isFlag) { //当这个单元格之前有被标记过flag时，则将剩余炸弹数+1
        This.surplusMine += 1;
        target.cell.isFlag = false; //单元格被打开后初始化flag
       }
       if (target.cell.value == 0) { //等于格子的value等于0的时候
  
        target.className = This.openClass[target.cell.value]; //可视化
  
        target.cell.isOpen = true; //表示该单元格被打开
  
        var thisAround = This.getAround(target, This); //获取该单元格周围的格子信息
  
        for (var i = 0; i < thisAround.length; i++) {
        
         if (!thisAround[i].cell.isOpen) { //递归的条件，当格子的open为true时不执行
  
          getAllZero(thisAround[i], This) //执行递归
         }
  
        }
  
       } else {
        target.innerHTML = target.cell.value;
        target.className = This.openClass[target.cell.value]; //可视化
        target.cell.isOpen = true; //表示单元格被打开
        target.cell.isFlag = false; //单元格被打开后初始化flag
  
       }
      }
  
      getAllZero(target, This); //首次执行
  
      //每次鼠标左键点击的时候都需要检查一下没有被打开的方格数量，每有一个则noOpen++
      for (var i = 0; i < this.tr; i++) {
       for (var j = 0; j < this.tr; j++) {
        if (this.tdsArr[i][j].cell.isOpen == false) {
         noOpen++;
        }
       }
  
      }
      //当noOpen的数量与炸弹数量相同时，说明剩余的方格全是雷，游戏通过
      if (noOpen == this.mineNum) {
       console.log(noOpen)
       this.gameWin();
      }
  
     } else { //点击到了炸弹，游戏结束
      this.gameOver(target)
     }
    }
  
  
  
   }
  
   Game.prototype.rightMouse = function(target) { //鼠标右键点击执行
    if (!target.cell.isOpen) {
     if (!target.cell.isFlag) { //标记
      target.className = "targetFlag"; //显示旗帜
      target.cell.isFlag = true; //表示该方格已经被标记
      this.surplusMine -= 1; //每标记一个方格，剩余炸弹数量-=1

     } else { //取消标记
      target.className = ""; //去掉旗帜
      target.cell.isFlag = false;
      this.surplusMine += 1;
    
     }
  
     var isWin = true;
     if (this.surplusMine == 0) { //标记完所有flag时，遍历所有单元格
      // console.log(this.minecell.length)
      for (var i = 0; i < this.minecell.length; i++) {
       console.log(this.minecell[i].cell.isFlag)
       if (!this.minecell[i].cell.isFlag) { //检查每个雷的isFlag属性是否被标记，只要有一个为false则输掉游戏
        isWin = false;
        this.gameOver(target, 1);
        break;
       }
      }
      isWin ? this.gameWin(1) : 0; 
     }
    }
   }
  
   Game.prototype.gameOver = function(target, code) { //游戏结束，code为触发代码，当旗用完了时为1，点击到炸弹为0
   
    var minecellLen = this.minecell.length;
    for (var i = 0; i < minecellLen; i++) { //显示每个雷的位置
     this.minecell[i].className = "mine";
    }
    this.table.onmousedown = false; //取消鼠标事件
  
    if (code) {
     alert("旗帜用完了，没有排除所有雷，游戏结束")
     reset(time)
    } else {
     target.className = "targetMine"; //触发雷标红色
     alert("你被炸弹炸死了，寄！")
    reset(time)
    }
  
   }
  
   Game.prototype.gameWin = function(code) { //游戏胜利
    if (code) {
     alert("你成功标记所有地雷，胜利")
     reset(time)
    } else {
     alert("你找到了所有安全区域，胜利")
     reset(time)
    }
    this.table.onmousedown = false;
  
  
   }
  
   Game.prototype.play = function() {
    var This = this; //需要将this传递到事件函数中使用
    this.table.onmousedown = function(event) {
     event = event || window.event; //兼容IE
     target = event.target || event.srcElement //兼容IE
  
     if (!this.isPlay) { //首次点击初始化棋盘，随机生成炸弹
      this.isPlay = true;
      This.creatMine(event, target);
     }
  
     if (event.button == 0) { //鼠标左键点击时执行
      This.lifeMouse(event, target);
  
     } else if (event.button == 2) { //右键点击执行
      This.rightMouse(target)
     }
     This.footerNum.innerHTML = This.surplusMine; //每次点击右键，刷新页面下方的剩余雷数
    }
   }
  
   Game.prototype.tablePos = function() { //将table居中显示
    var width = this.table.offsetWidth,
     height = this.table.offsetHeight;
    
    this.table.style.width = width + "px ";
    this.table.style.height = height + "px "
  
  
   }
  
  
   function addEvent(elem, type, handle) { //添加事件函数
    if (elem.addEventListener) { //w3c标准
     elem.addEventListener(type, handle, false);
    } else if (elem.attachEvent) { //IE9及以下
     elem.attachEvent("on" + type, function() {
      handle.call(elem);
     })
    } else { //其他情况
     elem["on" + type] = handle;
    }
   }
  
   Game.prototype.setDegree = function() { //调整难度
    var button = document.getElementsByTagName("button");
  
    addEvent(button[0], "click", function() { //简单
     var game = new Game(9, 9, 10);
     game.creatDom();
     game.play();
     game.tablePos();
     reset(time)
    });
  
    addEvent(button[1], "click", function() { //一般
     var game = new Game(16, 16, 50);
     game.creatDom();
     game.play();
     game.tablePos();
     reset(time)

    });
  
    addEvent(button[2], "click", function() { //困难
     var game = new Game(25, 25, 75);
     game.creatDom();
     game.play();
     game.tablePos();
     reset(time)
    });
   }

   var time = document.getElementById('time'); //计时器
   var timer = setInterval(function () {
     let seconds = (parseFloat(time.innerHTML) + 0.1).toFixed(1); //保留一位小数
     time.innerHTML = seconds;
   }, 100) 
   window.timer=timer
   function reset(){  //重置
    clearInterval(time);
    document.getElementById('time').innerHTML="00时00分00秒0000毫秒";
  }


   // 默认棋盘
   var game = new Game(9, 9, 9);
   game.creatDom();
   game.play();
   game.tablePos();
   game.setDegree()

