<template>
  <div class="main flex border-box p-1 full" ref="div">
    <div class="tools flex flex-col h-full" ref="tools">
      <ul class="full border-box">
        <li
          v-for="tool of tools"
          :key="tool.name"
          draggable
          @dragstart="toolDragstart($event, tool)"
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
      >
        <template v-for="linkNode of linkNodes">
          <rect
            v-if="linkNode.type === 'rect'"
            :key="linkNode.id"
            v-bind="{ ...linkNode.attr }"
            v-on="{ ...linkNode.event }"
            :class="{
              move: linkNode.dragging
            }"
          />
          <circle
            v-if="linkNode.type === 'circle'"
            :key="linkNode.id"
            v-bind="{ ...linkNode.attr }"
            v-on="{ ...linkNode.event }"
            :class="{
              move: linkNode.dragging
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
      </svg>
    </div>
  </div>
</template>

<script>
import getRandomId from './js/util'
import LinkNode from './js/linkNode'
export default {
  created() {
    this.workFlowNode.id = getRandomId()
  },
  data() {
    return {
      workFlowNode: { name: '新流程', id: '' },
      linkNodes: {},
      tools: [
        {
          name: 'start',
          type: 'circle',
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
      draggingTool: null
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
      // ev.clientX -
      //   this.$refs.tools.offsetWidth -
      //   16 -
      //   this.draggingTool.attr.width / 2,
      // ev.clientY - 16 - this.draggingTool.attr.height / 2
    },
    svgDragover(ev) {
      ev.preventDefault()
    },
    svgMousemove(ev) {
      // const el = ev.target
      // if (el.nodeName !== 'svg') {
      //   const linkNode = this.linkNodes[el.dataset.id]
      //   const moveFunc = linkNode.dragging ? linkNode.event.mousemove : null
      //   moveFunc && moveFunc()
      // }
      if (ev.target.nodeName !== 'svg' || !this.dragElMoveFunc) {
        return
      }
      this.dragElMoveFunc(ev)
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
    },
    nodeClick() {}
  },
  computed: {
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
.move {
  cursor: move;
}
.textUnselect {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
