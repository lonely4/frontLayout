<template>
  <a href="#/index" class="back flex justify-center align-center"
    ><i class="el-icon-s-home"></i
  ></a>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.back {
  top: calc(50% - 40px);
  right: 20px;
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 0 10px 1px rgb(223, 221, 221);
}
a {
  text-decoration: none;
  color: #409eff;
  :active {
    color: #409eff;
  }
  :hover {
    color: #409eff;
  }
}
</style>
