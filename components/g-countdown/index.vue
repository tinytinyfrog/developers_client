<template>
  <canvas id="g-countdown">
    您的浏览器不自持canvas
  </canvas>
</template>

<script>
let digit = null
export default {
  name: 'GCountDown',
  mounted () {
    this.initTemplate()
    this.countdown()
  },
  methods: {
    initTemplate () {
      digit =
        [
          [
            [0, 0, 1, 1, 1, 0, 0],
            [0, 1, 1, 0, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 0, 1, 1, 0],
            [0, 0, 1, 1, 1, 0, 0]
          ], // 0
          [
            [0, 0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1]
          ], // 1
          [
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
          ], // 2
          [
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0]
          ], // 3
          [
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 1, 0],
            [0, 1, 1, 0, 1, 1, 0],
            [1, 1, 0, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1]
          ], // 4
          [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0]
          ], // 5
          [
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0]
          ], // 6
          [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0]
          ], // 7
          [
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0]
          ], // 8
          [
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 1, 1, 0, 0, 0, 0]
          ], // 9
          [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ]// :
        ]
    },
    countdown () {
      const WINDOW_WIDTH = 286
      const WINDOW_HEIGHT = 76
      const RADIUS = 1
      const MARGIN_LEFT = 35
      const MARGIN_TOP = 18

      const endTime = new Date()
      endTime.setTime(endTime.getTime() + 2700 * 1000) // 倒计时截止时间是当前时间之后的一个小时。
      let curShowTimeSeconds = 0 // 用于显示当前距离截止时间的毫秒数。

      let balls = []// 用于存放小球，将新增加的小球添加进去。
      // 预设小球的颜色值，生成的小球来随机取其中的某一个值。
      // const colors = ['#33B545', '#009CC', '#AA66CC', '#9933CC', '#99CC00', '#669900', '#FFBB33', '#FF8800', '#FF4444', '#CC0000']
      const colors = ['#2d6d2d', '#c0d6c0', '#dedede']
      // 当页面尺寸大小改变时，进行页面刷新。
      window.onresize = function () {
        location.reload()
      }
      // 页面加载函数
      window.onload = function () {
        // WINDOW_HEIGHT = document.body.clientHeight
        // WINDOW_WIDTH = document.body.clientWidth
        // MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10) // 除去时钟显示部分的五分之四，剩下的五分之一再左右进行两等分。
        // RADIUS = Math.round(WINDOW_WIDTH * (4 / 5) / 108) - 1// 时钟的显示部分占据整个网页可视区域的（4/5），时钟的第一个数字是从x=0开始的，根据每一个数字的宽度进行计算得到是108，
        // MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5)

        const canvas = document.querySelector('#g-countdown')
        const context = canvas.getContext('2d')
        canvas.width = WINDOW_WIDTH
        canvas.height = WINDOW_HEIGHT

        curShowTimeSeconds = getCurrentShowTimeSeconds()
        setInterval(() => {
          render(context)
          update()
        }, 50)
      }

      // 通过这个函数得到当前距离截止时间显示的毫秒数。
      function getCurrentShowTimeSeconds () {
        const curTime = new Date()
        let ret = endTime.getTime() - curTime.getTime() // 截止时间减去当前时间得到的毫秒数。
        ret = Math.round(ret / 1000)// 将毫秒数转换为秒数。
        return ret >= 0 ? ret : 0
      }

      // 更新函数：1.更新时间；2.更新动画，3.生成小球
      function update () {
        // 得到下一次距离截止时间的秒数。
        const nextShowTimeSeconds = getCurrentShowTimeSeconds()// 注意getCurrentShowTimeSeconds这里掉了括号“（）”也就是说没有执行函数。
        const nextHours = parseInt(nextShowTimeSeconds / 3600)
        const nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60)
        const nextSeconds = parseInt(nextShowTimeSeconds % 60)

        const curHours = parseInt(curShowTimeSeconds / 3600)
        const curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60)
        const curSeconds = parseInt(curShowTimeSeconds % 60)
        // 如果时间发生改变，将改变后的时间赋予给当前时间；根据改变的是哪个数字，来给该数字添加小球。
        if (nextSeconds !== curSeconds) {
          curShowTimeSeconds = nextShowTimeSeconds
          // 时针的十位数改变时，在相应数字的位置处添加小球。
          if (parseInt(curHours / 10) !== parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10))
          }
          if (parseInt(curHours % 10) !== parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10))
          }

          if (parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10))
          }
          if (parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10))
          }

          if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10))
          }
          if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds % 10))
          }
        }
        updateBalls()// 更新每个小球的运动状态。
      }

      // 小球运动状态的更新设置。
      function updateBalls () {
        for (let i = 0; i < balls.length; i++) {
          balls[i].x += balls[i].vx
          balls[i].y += balls[i].vy
          balls[i].vy += balls[i].g

          // 碰撞检测
          if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS// 小球落到底部的位置
            balls[i].vy = -balls[i].vy * 0.75 // 速度反向，进行反弹,0.5表示摩擦系数，每次反弹速度都减半。
          }
        }
        // 将滚出画布的小球进行删除处理。
        balls = balls.filter((item) => {
          return item.x + RADIUS > 0 && item.x - RADIUS < WINDOW_WIDTH
        })

        // 将滚出画布的小球进行删除处理。
        // let cnt=0;
        // for(let i=0;i<balls.length;i++){
        //     if(balls[i].x+RADIUS>0&&balls[i].x - RADIUS < WINDOW_WIDTH){ //小球的右边缘只要大于0，左边缘小于画布宽度就就符合，可以用左右临近或出去一半画布的小球进行分析。
        //         balls[cnt++]=balls[i];//遍历整个balls数组，将符合要求的小球放在以cnt计数的数组中
        //     }
        // }
        // //经过上面的上面的这一组循环之后，可以知道cnt之前包括cnt的数据项都是符合的小球，后面的便是不符的，进行一项一项删除。
        // while(balls.length>cnt){
        //     balls.pop();
        // }
      }

      // 遍历循环每一个数的点阵屏，在点阵屏上数字为“1”处生成小球函数，将生成的小球放到数组ball中。
      function addBalls (x, y, num) {
        for (let i = 0; i < digit[num].length; i++) {
          for (let j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
              const aball = {
                x: x + (RADIUS + 1) + j * 2 * (RADIUS + 1), // 定义生成小球球心x点的坐标
                y: y + (RADIUS + 1) + i * 2 * (RADIUS + 1), // 定义生成小球球心y点的坐标
                vx: Math.pow(-1, Math.ceil(Math.random() * 10)) * 6, // 用0-1之间的随机数乘以10,然后向上取整得到奇数或偶数，在由-1的奇偶次幂得到正负4.
                vy: -6,
                g: 1.5 + Math.random(),
                color: colors[Math.floor(Math.random() * colors.length)]
              }
              balls.push(aball)// 每产生一个小球就放到全局容器balls中。
            }
          }
        }
      }

      // 将上下文环境进行渲染
      function render (cxt) {
        cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT) // 绘图之前进行刷新操作
        // 会根据curShowTimeSeconds计算出时分秒进行更新数字。
        const hours = parseInt(curShowTimeSeconds / 3600) // 求有多少个小时
        const minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60) // 求有多少分钟
        const seconds = parseInt(curShowTimeSeconds % 60) // 所有的秒数对分钟求余得到秒数

        renderdigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt) // 时钟的十位数
        renderdigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt) // 时钟的个位数
        renderdigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt) // 冒号":"的粒子化
        renderdigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt) // 分钟十位数粒子化
        renderdigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt) // 分钟个位数粒子化
        renderdigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt) // 冒号粒子化
        renderdigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt) // 秒针十位数粒子化
        renderdigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt) // 秒针个位数粒子化

        // 绘制balls容器中的每一个小球。
        for (let i = 0; i < balls.length; i++) {
          cxt.fillStyle = balls[i].color
          cxt.beginPath()
          cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI)
          cxt.closePath()
          cxt.fill()
        }
      }

      // 将每一位数字进行粒子化
      function renderdigit (x, y, num, cxt) {
        // cxt.fillStyle = 'rgb(45,109,45)'
        cxt.fillStyle = 'rgb(10,156,115)'
        for (let i = 0; i < digit[num].length; i++) {
          for (let j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
              cxt.beginPath()
              cxt.arc(x + (RADIUS + 1) + j * 2 * (RADIUS + 1), y + (RADIUS + 1) + i * 2 * (RADIUS + 1), RADIUS, 0, 2 * Math.PI)
              cxt.closePath()
              cxt.fill()
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
