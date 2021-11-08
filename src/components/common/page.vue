<template>
  <div class="main">
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background-color: rgb(243, 234, 234);
}
.content {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: auto;
  padding: 1rem;
  box-sizing: border-box;
  box-shadow: 1px 1px 5px 0 gray;
}
</style>
