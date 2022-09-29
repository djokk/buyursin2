<template>
  <nav class="nav" :class="[menuActive ? 'd-block' : '']">
    <ul class="nav__menu menu">
      <li class="menu__logo">
        <!-- <router-link :to="{name: 'Dashboard'}" class="menu__link-logo" href=""><img src="/img/mediks.svg" alt="logop"></router-link> -->
        <router-link :to="{name: 'Dashboard'}" class="menu__link-logo-title" href="">BUYURSIN</router-link>
        <div class="menu__close-menu">
          <i class='bx bx-x'></i>
        </div>
      </li>
      <li class="menu__item" @click.prevent="isSidebar(1)" :class="[isActiveItem == 1 ? 'active': '']">
        <router-link :to="{name: 'Dashboard'}" class="menu__link" href=""><i class='bx bxs-home'></i>Bosh sahifa</router-link>
      </li>
      <li class="menu__item">
        <button class="menu__btn" @click="removeLogout()">CHIQISH</button>
      </li>
    </ul>
    <Logout :activeLogout="logout" @closeLogout="removeLogout()"/>
    <div v-show="logout" @click="removeLogout()" class="logout-bg"></div>
  </nav>
</template>

<script>
import Logout from '@/components/Logout.vue'

export default {
  data() {
    return {
      isActiveItem: 1,
      isItem: 0,
      isActiveDown: 0,
      logout: false,
      menuActive: false
    }
  },
  beforeMount() {
    this.loadPath();
  },
  components: {
    Logout
  },
  methods: {
    isSidebar(id) {
      // if(this.isActiveItem == 4 && this.isActiveItem != id && this.isItem == id) {
      if(this.isActiveItem == 4) {
        this.isActiveItem = 0
      } else {
        this.isActiveItem = id
        // this.isItem = id
      }
    },
    loadPath() {
      switch (this.$route.name) {
        case "Dashboard":
          this.isActiveItem = 1;
          break;
      }
    },
    isActiveClientsBg() {
      this.$refs.callClients.click();
    },
    removeLogout() {
      this.logout = !this.logout;
      // this.logout = false;
      // this.bgLogout = !this.bgLogout;
    },
    openMenu() {
      this.menuActive = !this.menuActive;
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  width: 210px;
  height: 100vh;
  position: fixed;
  @media screen and (max-width: 991.5px) {
    display: none;
  }
  .menu {
    width: 100%;
    height: 100%;
    background: #fbfaff;
    padding: 0;
    margin: 0;
    &__item {
      margin-bottom: 2px;
    }
    &__item.active > .menu__link {
      color: #002f34;
      font-weight: 500;
      background: rgba($color: #002f34, $alpha: 0.1);
      // background: rgba($color: #545a6d, $alpha: 0.1);
      &::before {
        background: #E02512;
      }
    }
    &__logo {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.5rem;
      padding: 5px;
      @media screen and (max-width: 991.5px) {
        justify-content: space-between;
      }
    }
    &__link-logo-title {
      // display: inline-block;
      // width: 100%;
      font-family: 'Roboto';
      font-size: 30px;
      line-height: 30px;
      font-weight: 700;
      color: #002f34;
      text-align: center;
      outline: none;
    }
    &__close-menu {
      cursor: pointer;
      display: none;
      height: 30px;
      // padding: 5px;
      
      @media screen and (max-width: 991.5px) {
        display: block;
      }
      .bx {
        font-weight: 900;
        font-size: 30px;
        color: red;
      }
    }
    &__link {
      display: flex;
      align-items: center;
      font-family: 'Roboto';
      font-size: 20px;
      line-height: 20px;
      font-weight: 400;
      color: #545a6d;
      text-decoration: none;
      padding: 0.75rem 0.75rem 0.75rem 1.5rem;
      // padding: 1rem 0.75rem 1rem 1.5rem;
      transition: 0.1s all ease-in-out;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: transparent;
        width: 5px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &:hover {
        color: #fff;
        background: #E02512;
        // background: rgba($color: #386979, $alpha: 0.5);
        font-weight: 500;
      }
      .bx, .fa {
        font-size: 20px;
        margin-right: 10px;
      }
      .bx-chevron-down {
        font-size: 30px;
        top: 50%;
        right: 0.75rem;
        position: absolute;
        margin: 0;
        transform: translateY(-50%);
      }
    }
    .list {
      // height: 0;
      // opacity: 0;
      height: 100%;
      &__item {
        margin-bottom: 2px;
        padding-left: 20px;
      }
      &__link {
        display: flex;
        align-items: center;
        font-family: 'Roboto';
        font-size: 20px;
        line-height: 20px;
        font-weight: 400;
        color: #545a6d;
        text-decoration: none;
        padding: 1rem 0.75rem 1rem 1.5rem;
        transition: 0.1s all ease-in-out;
      }
      // &__active {
        
      // }
    }
    &__btn {
      cursor: pointer;
      width: 100%;
      font-family: 'Roboto';
      font-size: 15px;
      font-weight: 500;
      color: #fff;
      background: #002f34;
      padding: 0.75rem;
      border: none;
      transition: all .3s ease-out;
      margin-top: 25px;
      &:hover {
        // color: #fff;
        background: red;
        text-decoration: none;
      }
      &:focus {
        outline: none;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  height: 0;
}
</style>