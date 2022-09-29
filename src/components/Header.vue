<template>
  <header class="header">
    <div @click="openMenu()" class="btn-burger">
      <i class='bx bx-menu'></i>
    </div>
    <div class="account">
      <div class="account__text">
        <p class="account__title">Jakhongir</p>
        <p class="account__subtitle">Admin</p>
      </div>
      <img class="account__img" src="/img/account.png" alt="">
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {

    }
  },
  methods: {
    openMenu() {
      this.$emit('openMenu');
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: right;
  align-items: center;
  background: #002f34;
  margin-left: 210px;
  padding: 5px 15px;
  @media screen and (max-width: 991.5px) {
    margin-left: 0px;
    justify-content: space-between;
  }
  .btn-burger {
    display: none;
    height: 36px;
    cursor: pointer;
    @media screen and (max-width: 991.5px) {
      display: block;
    }
    .bx {
      font-size: 36px;
      color: #fff;
    }
  }
  .account {
    display: flex;
    align-items: center;
    padding: 3px 0;
    
    &__text {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #fff;
      margin-right: 8px;
    }
    &__title {
      font-family: 'Roboto';
      font-size: 12px;
      line-height: 12px;
      font-weight: 400;
      color: #fff;
    }
    &__subtitle {
      font-family: 'Roboto';
      font-size: 10px;
      line-height: 10px;
      font-weight: 400;
      color: rgb(219, 219, 219);
    }
    &__img {
      width: 30px;
    }
  }
}
</style>