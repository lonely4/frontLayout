<template>
  <div class="flex justify-center align-center h100 ">
    <div class="flex flex-col justify-center text-center">
      <h1 class="my-4">假装有个logo</h1>
      <div class="flex justify-between mt100px">
        <router-link class="mx-6" to="/elementuiDemo"
          >ElementUI Demo</router-link
        >
        <router-link class="mx-6" to="/echartsDemo">Echarts Demo</router-link>
        <router-link class="mx-6" to="/drag">Drag Demo</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.mt100px {
  margin-top: 100px;
}
</style>
