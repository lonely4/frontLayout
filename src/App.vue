<template>
  <div id="app">
    <back-home></back-home>
    <router-view />
  </div>
</template>

<script>
import backHome from "./components/common/backHome.vue";
export default {
  components: {
    backHome,
  },
};
</script>

<style lang="scss" scoped>
#app {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
