<template>
  <div
    class="container flex h-full"
    :style="{ width: this.showForm ? '30%' : '25px' }"
  >
    <div class="buttomContainer h-full flex align-center">
      <div class="buttom" @click.stop="() => (showForm = !showForm)">
        <div class="semicircle"></div>
        <i
          :class="{
            'el-icon-caret-left': !showForm,
            'el-icon-caret-right': showForm
          }"
        ></i>
      </div>
    </div>
    <div class="form  h-full flex-1 flex flex-col">
      <div class="formHead">属性</div>
      <div class="formContent flex">
        <div class="labels">
          <div class="label" v-for="(data, key) of labels" :key="key + 'label'">
            <span>{{ data + ' :' }}</span>
          </div>
        </div>
        <div class="values flex-1">
          <div class="value" v-for="(data, key) of labels" :key="key + 'value'">
            <input type="text" v-model="formData[key]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'formData',
    event: 'changeFormData'
  },
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showForm: true,
      formLabel: { name: '名称', id: '流程ID' }
    }
  },
  computed: {
    labels() {
      let obj = {}
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formLabel, key)) {
          obj[key] = this.formLabel[key]
        }
      }
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 325px;
  position: fixed;
  right: 0px;
  top: 0px;
  overflow: hidden;
}
.buttom {
  position: relative;
  overflow: hidden;
  width: 25px;
  height: 50px;
  i {
    position: absolute;
    top: 16px;
    left: 8px;
    transform: scale(1.5);
  }
}
.semicircle {
  margin: 5px;
  width: 40px;
  height: 40px;
  border-radius: 40px 0 0 40px;
  background-color: white;
  box-shadow: 0 0 5px 2px gray;
}
.form {
  border: 1px solid gray;
  padding: 5px;
}
.formHead {
  width: 100%;
  height: 1.5rem;
  font-size: 1.5rem;
  line-height: 1.5rem;
  padding: 10px;
}
.labels {
  margin-right: 10px;
}
.label {
  height: 1.5rem;
  margin-bottom: 10px;
  span {
    line-height: 1.5rem;
  }
}
.value {
  margin-bottom: 10px;
  input {
    box-sizing: border-box;
    width: 100%;
    padding-left: 2px;
  }
}
</style>
