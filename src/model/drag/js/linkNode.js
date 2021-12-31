export default class LinkNode {
  constructor(id, draggingToll, parentId) {
    this.id = id
    this.parentId = parentId
    this.type = draggingToll.type
    // 上一节点
    this.next = []
    // 下一节点
    this.prev = []
    // el元素属性
    this.attr = { ...draggingToll.attr, 'data-id': id }
    // el元素事件
    this.event = {
      ...draggingToll.event,
      mousedown: this.mousedown.bind(this),
      mousemove: this.mousemove.bind(this),
      mouseup: this.mouseup.bind(this),
      mouseout: this.mouseout.bind(this)
    }
    // 该元素对应的工作流配置
    this.workFlowConfig = JSON.parse(
      JSON.stringify(draggingToll.workFlowConfig)
    )
    // 拖拽标志
    this.dragging = false
    // 记录拖拽开始时鼠标与x,y值的偏移量，用以设置拖拽时的元素坐标
    this.deviationX = 0
    this.deviationY = 0
  }
  // 初始化位置点
  initPosition(x, y) {
    // 传入的xy为当前鼠标位置去除了tool宽度及rem的x及去除了rem的y
    switch (this.type) {
      case 'rect':
        this.setAttr('x', x - this.attr.width / 2)
        this.setAttr('y', y - this.attr.height / 2)
        break
      case 'circle':
        this.setAttr('cx', x)
        this.setAttr('cy', y)
        break
      default:
        break
    }
    return this
  }
  getPosition() {
    if (this.type === 'rect') {
      return [this.attr.x, this.attr.y]
    }
    return [this.attr.cx, this.attr.cy]
  }
  getCentrePosition() {
    if (this.type === 'rect') {
      return [
        this.attr.x + this.attr.width / 2,
        this.attr.y + this.attr.height / 2
      ]
    }
    return [this.attr.cx, this.attr.cy]
  }
  getSize() {
    if (this.type === 'rect') {
      return [this.attr.width, this.attr.height]
    }
    return [this.attr.r * 2, this.attr.r * 2]
  }
  isStart() {
    this.prev = 'start'
    return this
  }
  isEnd() {
    this.next = 'end'
    return this
  }
  setNext(val) {
    if (!this.next.includes(val)) {
      this.next.push(val)
      return this
    }
  }
  setPrev(val) {
    if (!this.prev.includes(val)) {
      this.prev.push(val)
      return this
    }
  }
  deleteNext(id) {
    let idx = this.next.indexOf(id)
    if (idx > -1) {
      this.next.splice(idx, 1)
    }
  }
  deletePrev(id) {
    let idx = this.prev.indexOf(id)
    if (idx > -1) {
      this.prev.splice(idx, 1)
    }
  }
  setAttr(key, val) {
    this.attr[key] = val
    return this
  }
  setWFConfig(key, val) {
    this.workFlowConfig[key] = val
    return this
  }
  click() {}
  mousedown(ev) {
    if (ev.button === 0) {
      this.dragging = true
      this.setDeviationData(ev)
    }
  }
  mousemove(ev) {
    this.move(ev)
  }
  mouseup() {
    this.dragging = false
  }
  mouseout(ev) {
    this.move(ev)
  }
  mouseover(ev) {
    this.move(ev)
  }
  setDeviationData(ev) {
    const p = this.getPosition()
    this.deviationX = ev.clientX - p[0]
    this.deviationY = ev.clientY - p[1]
  }
  move(ev) {
    if (!this.dragging) return
    switch (this.type) {
      case 'rect':
        this.attr.x = ev.clientX - this.deviationX
        this.attr.y = ev.clientY - this.deviationY
        break
      case 'circle':
        this.attr.cx = ev.clientX - this.deviationX
        this.attr.cy = ev.clientY - this.deviationY
        break
      default:
        break
    }
  }
}
