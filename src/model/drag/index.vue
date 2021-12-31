<template>
  <div class="main flex border-box p-1 full" ref="div">
    <div class="tools flex flex-col h-full" ref="tools">
      <ul class="full border-box">
        <li
          v-for="tool of tools"
          :key="tool.name"
          :draggable="tool.draggable"
          @dragstart="toolDragstart($event, tool)"
          v-on="{ ...tool.event }"
          :class="{ toolSelected: tool.name === 'transition' && lineing }"
        >
          {{ tool.name }}
        </li>
      </ul>
    </div>
    <div class="dragArea flex-1">
      <svg
        class="full"
        ref="svg"
        @drop="svgDrag"
        @dragover="svgDragover"
        @mousemove="svgMousemove"
        @click="svgClick"
        @contextmenu.prevent="svgRClick"
      >
        <template v-for="linkNode of linkNodes">
          <rect
            v-if="linkNode.type === 'rect'"
            :key="linkNode.id"
            v-bind="{ ...linkNode.attr }"
            v-on="{ ...linkNode.event }"
            :class="{
              'cursor-move': linkNode.dragging
            }"
          />
          <circle
            v-if="linkNode.type === 'circle'"
            :key="linkNode.id"
            v-bind="{ ...linkNode.attr }"
            v-on="{ ...linkNode.event }"
            :class="{
              'cursor-move': linkNode.dragging
            }"
          />
          <text
            :key="linkNode.id + 'text'"
            :x="
              linkNode.type === 'rect'
                ? linkNode.attr.x + linkNode.attr.width / 2
                : linkNode.attr.cx
            "
            :y="
              linkNode.type === 'rect'
                ? linkNode.attr.y + linkNode.attr.height / 2 + 5
                : linkNode.attr.cy + 5
            "
            :data-id="linkNode.id"
            font-size="16px"
            fill="black"
            text-anchor="middle"
            :class="{ textUnselect: linkNode.dragging }"
          >
            {{ linkNode.workFlowConfig.name }}
          </text>
        </template>
        <template v-for="line of lines">
          <line
            :key="line.lineId"
            v-bind="{ ...line }"
            stroke="black"
            style="stroke-width:2px;"
          />
          <path
            :key="line.lineId + 'arrow'"
            :d="line.d"
            fill="black"
            stroke="black"
          />
        </template>
      </svg>
    </div>
  </div>
</template>

<script>
import getRandomId from './js/util'
import LinkNode from './js/linkNode'
const interval = 5
function computeLinePosition(x, y, w, h, k, b, isLeft) {
  // 此处的w及h均为对应宽高的一半
  let xx = x + (isLeft ? w + interval : -w - interval),
    yy = k * xx + b
  // 判断与上下两边是否相交
  if (y + h + interval > yy != y - h - interval > yy) {
    // 相交
    return [xx, yy]
  } else {
    // 不相交则计算与上边或下边的交点
    yy = y + Math.sign(yy - y) * (h + interval)
    return [(yy - b) / k, yy]
  }
}
// 返回path标签的d属性值
function getArrowDAttr(x1, y1, x2, y2, k) {
  // 传入的x1,y1为to点坐标，x2，y2为from点坐标
  const sideLenght = 6,
    c1L = Math.sqrt(Math.pow(sideLenght, 2) - Math.pow(sideLenght / 2, 2)) //顶点到c点的距离
  // c点为三角形底边与直线的交点，AB两点为三角形另外两点
  // 斜率的特殊情况
  if (k === 0) {
    // 斜率为0
    let y = y1 - Math.sign(y1 - y2) * c1L
    return `M${x1} ${y1} L ${x1 - sideLenght / 2} ${y} L ${x1 +
      sideLenght / 2} ${y} Z`
  }
  if (!k) {
    // 斜率不存在，c1直线平行于x轴
    let x = x1 - Math.sign(x1 - x2) * c1L
    return `M${x1} ${y1} L ${x} ${y1 - sideLenght / 2} L ${x} ${y1 +
      sideLenght / 2} Z`
  }
  const angle1 = Math.atan(k),
    x1cL = Math.abs(c1L * Math.cos(angle1)), // 三角形顶点x1,y1到点c的x 距离
    y1cL = Math.abs(c1L * Math.sin(angle1)), // 三角形顶点x1,y1到点c的y距离
    xc = x1 - Math.sign(x1 - x2) * x1cL,
    yc = y1 - Math.sign(y1 - y2) * y1cL,
    angle2 = Math.atan(-1 / k),
    xacL = Math.abs((sideLenght / 2) * Math.cos(angle2)), // 点a到点c的x 距离
    yacL = Math.abs((sideLenght / 2) * Math.sin(angle2)), // 点a到点c的y距离
    xa = xc + xacL,
    ya = k > 0 ? yc - yacL : yc + yacL,
    xb = xc - xacL,
    yb = k > 0 ? yc + yacL : yc - yacL
  return `M${x1} ${y1} L ${xa} ${ya} L ${xb} ${yb} Z`
}
export default {
  created() {
    this.workFlowNode.id = getRandomId()
    window.addEventListener('keydown', ev => {
      console.log(this.clickLineId)
      if (ev.key === 'Delete' && this.clickLineId) {
        const ids = this.clickLineId.split(',')
        this.linkNodes[ids[0]].deleteNext(ids[1])
        this.linkNodes[ids[1]].deletePrev(ids[0])
      }
    })
  },
  data() {
    return {
      workFlowNode: { name: '新流程', id: '' },
      linkNodes: {},
      tools: [
        {
          name: 'transition',
          draggable: false,
          event: {
            click: () => {
              this.lineing = !this.lineing
              this.lineFromNodeId = null
            }
          }
        },
        {
          name: 'start',
          type: 'circle',
          draggable: true,
          attr: {
            r: 30,
            style: 'stroke-width:2;',
            fill: 'white',
            stroke: 'gray'
          },
          event: {},
          workFlowConfig: {
            name: 'start'
          }
        },
        {
          name: 'end',
          type: 'circle',
          draggable: true,
          attr: {
            r: 30,
            style: 'stroke-width:2;',
            fill: 'white',
            stroke: 'gray'
          },
          event: {},
          workFlowConfig: {
            name: 'end'
          }
        },
        {
          name: 'task',
          type: 'rect',
          draggable: true,
          attr: {
            width: 120,
            height: 50,
            rx: 10,
            ry: 10,
            style: 'stroke-width:2;',
            fill: 'white',
            stroke: 'gray'
          },
          event: {},
          workFlowConfig: {
            name: 'task'
          }
        }
      ],
      draggingTool: null,
      lineing: false,
      lineFromNodeId: null,
      clickLineId: null
    }
  },
  methods: {
    toolDragstart(ev, tool) {
      this.draggingTool = tool
    },
    svgDrag(ev) {
      ev.preventDefault()
      if (ev.target.nodeName !== 'svg') {
        return
      }
      this.createSvgEl(ev)
    },
    svgDragover(ev) {
      ev.preventDefault()
    },
    svgMousemove(ev) {
      if (ev.target.nodeName !== 'svg' || !this.dragElMoveFunc) {
        return
      }
      this.dragElMoveFunc(ev)
    },
    svgClick(ev) {
      const el = ev.target
      this.clickLineId = null
      if (el.nodeName === 'svg') {
        this.lineing = false
      }
      if (['rect', 'circle'].includes(el.nodeName)) {
        const id = el.dataset.id,
          linkNode = this.linkNodes[id]
        linkNode.click(ev)
        // 划线
        if (this.lineing) {
          if (this.lineFromNodeId) {
            if (this.lineFromNodeId === id) {
              return
            }
            this.linkNodes[this.lineFromNodeId].setNext(id)
            linkNode.setPrev(this.lineFromNodeId)
            this.lineFromNodeId = null
          } else {
            this.lineFromNodeId = id
          }
        }
      }
      console.log('ev.target.dataset.lineId', ev.target.dataset.lineId)
      if (el.nodeName === 'line') {
        console.log('ev.target.dataset.lineId', ev.target.dataset)
        this.clickLineId = ev.target.dataset.lineId
      }
    },
    svgRClick(ev) {
      console.log(ev)
      // if (ev.target.nodeName==='path') {

      // }
    },
    createSvgEl(ev) {
      const rem = 16
      if (!this.draggingTool) return
      const id = getRandomId()
      if (!this.linkNodes || this.linkNodes[id]) return
      this.$set(
        this.linkNodes,
        id,
        new LinkNode(id, this.draggingTool, this.workFlowNode.id).initPosition(
          ev.clientX - this.$refs.tools.offsetWidth - rem,
          ev.clientY - rem
        )
      )
    }
  },
  computed: {
    // 当前拖拽的元素对应的move方法
    dragElMoveFunc() {
      let func = null
      if (!this.linkNodes || Object.keys(this.linkNodes).length === 0)
        return func
      for (const key in this.linkNodes) {
        const linkNode = this.linkNodes[key]
        if (linkNode.dragging) {
          func = linkNode.event.mousemove
        }
      }
      return func
    },
    // 线段
    lines() {
      let lines = {}
      Object.keys(this.linkNodes).forEach(id => {
        const linkNode = this.linkNodes[id]
        if (linkNode.next.length > 0) {
          linkNode.next.forEach(nextId => {
            const lineId = id + ',' + nextId
            if (!lines[lineId]) {
              const nextLinkNode = this.linkNodes[nextId]
              const fromP = linkNode.getCentrePosition(),
                fromS = linkNode.getSize(),
                toP = nextLinkNode.getCentrePosition(),
                toS = nextLinkNode.getSize()
              let x1 = fromP[0],
                x2 = toP[0],
                y1 = fromP[1],
                y2 = toP[1]
              // 斜线斜率K和B
              // 斜率K的特殊情况
              // 直线垂直于x轴，斜率为0
              if (x2 - x1 === 0) {
                const sign = Math.sign(y2 - y1)
                y1 = y1 + sign * (fromS[1] / 2 + interval)
                y2 = y2 - sign * (toS[1] / 2 + interval)
                // 直线垂直于x轴，则调整Y即可
                lines[lineId] = {
                  'data-lineId': lineId,
                  x1,
                  x2,
                  y1,
                  y2,
                  d: getArrowDAttr(x2, y2, x1, y1, 0)
                }
                return
              }
              // 直线平行于x轴，斜率不存在
              if (y2 - y1 === 0) {
                const sign = Math.sign(x2 - x1)
                x1 = x1 + sign * (fromS[0] / 2 + interval)
                x2 = x2 - sign * (toS[0] / 2 + interval)
                // 直线垂直于x轴，则调整Y即可
                lines[lineId] = {
                  'data-lineId': lineId,
                  x1,
                  x2,
                  y1,
                  y2,
                  d: getArrowDAttr(x2, y2, x1, y1, null)
                }
                console.log(lines[lineId])
                return
              }
              // y=kx+b
              const k = (y2 - y1) / (x2 - x1),
                b = -k * x1 + y1
              let starP = computeLinePosition(
                x1,
                y1,
                fromS[0] / 2,
                fromS[1] / 2,
                k,
                b,
                x1 < x2
              )
              let endP = computeLinePosition(
                x2,
                y2,
                toS[0] / 2,
                toS[1] / 2,
                k,
                b,
                x1 > x2
              )
              lines[lineId] = {
                'data-lineId': lineId,
                x1: starP[0],
                x2: endP[0],
                y1: starP[1],
                y2: endP[1],
                d: getArrowDAttr(endP[0], endP[1], starP[0], starP[1], k)
              }
            }
          })
        }
      })
      return lines
    }
  }
}
</script>

<style lang="scss" scoped>
.tools {
  width: 15%;
  min-width: 100px;
  border: 1px solid gray;
}
ul {
  padding: 0.5rem;
}
li {
  border: 1px solid gray;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
.textUnselect {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.toolSelected {
  background-color: gray;
}
line:hover {
  cursor: pointer;
}
</style>
