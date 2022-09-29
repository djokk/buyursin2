<template>
  <div class="row">
    <div class="col-xl-6 col-lg-6 col-md-5 col-sm-5">
      <div @click="localReChange()" class="left">
        <!-- <img class="left__logo" src="/img/mediks.svg" alt="logo"> -->
        <h1 class="left__title">buyursin</h1>
      </div>
    </div>
    <div class="col-xl-6 col-lg-6 col-md-7 col-sm-7">
      <div class="right">
        <!-- <img class="right__logo" src="/img/mediks.svg" alt="logo"> -->
        <form class="right__form form" action="#" @submit.prevent="auth()">
          <h4 class="form__title mb-1">{{ $t("entrance") }}</h4>
          <div class="form__item" :class="$v.number.$error ? 'is-invalid' : ''">
            <input v-model="number" type="text">
            <span :class="number != '' ? 'active-span' : '' ">{{ $t("telephone") }}</span>
          </div>
          <div class="form__item" :class="$v.password.$error ? 'is-invalid' : ''">
            <input v-model="password" type="text">
            <span :class="password != '' ? 'active-span' : '' ">{{ $t("password") }}</span>
          </div>
          <button class="btn btn-primary" type="submit">{{ $t("btnEntrance") }}</button>
        </form>
      </div>
    </div>
    <Loading v-show="loading"/>
  </div>
</template>

<script>
import axios from 'axios'
import { required, minLength } from 'vuelidate/lib/validators'
import Loading from '@/components/Loading.vue';

export default {
  name: 'Auth',
  data () {
    return {
      loading: false,
      number: '',
      password: '',
      api: ''
    }
  },
  components: {
    Loading
  },
  beforeMount() {
    this.api = window.MY_CONFIG_BUYURSIN.api;
    // localStorage.setItem('local', 'ru');
  },
  mounted() {
    if (localStorage.local == 'uz' || localStorage.local == 'ru' || localStorage.local == 'en') {
      this.$i18n.locale = localStorage.local;
    } else {
      this.updateLang();
    }
  },
  methods: {
    updateLang () {
      localStorage.local = 0
      if (localStorage.local == 0) {
        localStorage.local = 'ru'
        this.$i18n.locale = 'ru'
      } else {
        this.$i18n.locale = localStorage.local
      }
    },
    auth() {
      this.$v.$touch()
      if(!this.$v.number.$invalid && !this.$v.password.$invalid) {
        this.loading = true;
        axios.post(`${this.api}/login/`, {
            'username': this.number,
            'password': this.password
          })
          .then((response) => {
            // console.log(response.data);
            sessionStorage.setItem('token', response.data.token);
            if(response.data.is_superuser == true) {
              this.$router.push({ name: 'Dashboard' });
              this.loading = false;
            } else if(response.data.branchType == 3) {
              this.$router.push({ name: 'Warehouse' });
            } else {
              this.$router.push({ name: 'BRStore' });
            }
          })
          .catch(error => {
            // console.log(error);
            this.$toast.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    loadingAuth() {
      const auth = localStorage.getItem('auth');
      if(auth) {
        this.$router.push({ name: 'Panel' })
      }
    },
    localReChange() {
      const local = localStorage.getItem('local');
      if(local == 'uz') {
        localStorage.local = 'ru';
        this.$i18n.locale = 'ru'
      } else {
        localStorage.local = 'uz';
        this.$i18n.locale = 'uz'
      }
    }
  },
  validations: {
    number: {
      required,
      minLength: minLength(2)
    },
    password: {
      required,
      minLength: minLength(2)
    }
  },
  created() {
    if(localStorage.local == 'uz' || localStorage.local == 'ru'){
      this.$i18n.locale = localStorage.local
    }
  }
}
</script>

<style lang="scss" scoped>
.left {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  @media screen and (max-width: 575.5px) {
    display: none;
  }
  &__title {
    font-family: 'Roboto';
    font-size: 5em;
    font-weight: 700;
    text-transform: uppercase;
    color: #002f34;
    text-align: center;
    @media screen and (max-width: 991.5px) {
      font-size: 3em;
    }
  }
}
.right {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  &__logo {
    display: none;
    @media screen and (max-width: 575.5px) {
      display: block;
      margin-bottom: 50px;
    }
  }
  .form{
    width: 50%;
    padding: 0 15px;
    @media screen and (max-width: 991.5px) {
      width: 100%;
    }
    &__title {
      font-family: 'Roboto';
      font-size: 35px;
      font-weight: 700;
      text-transform: uppercase;
      color: #002f34;
      text-align: center;
    }
    &__item {
      position: relative;
      margin-bottom: 15px;
      span {
        font-family: 'Roboto';
        font-size: 17px;
        font-weight: 400;
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        color: rgba($color: #002f34, $alpha: 0.4);
      }
      input {
        width: 100%;
        font-family: 'Roboto';
        font-size: 17px;
        font-weight: 400;
        border: 2px solid rgba(0,0,0,.12);
        border-radius: 5px;
        padding: 0.6em;
        position: relative;
        background: transparent;
        z-index: 1;
        &:hover {
          border-color: #002f34;
          transition: 0.3s all ease-in-out;
        }
        &:focus-visible {
          border-color: #002f34;
          outline: none;
        }
      }
      input:focus-visible+span{
        top: 0%;
        font-size: 13px;
        background: #F8F8F8;
        color: #002f34 !important;
        padding: 2px 5px;
        transition: 0.3s all ease-out;
        z-index: 2;
      }
      input:hover+span{
        color: #002f34;
      }
    }
    .active-span {
      top: 0%;
      font-size: 13px;
      background: #fff;
      color: rgba(0, 0, 0, 0.4);
      padding: 2px 5px;
      z-index: 2;
    }
    .btn {
      width: 100%;
      font-family: 'Roboto';
      font-size: 18px;
      font-weight: 400;
      text-transform: uppercase;
      background: #002f34;
      border: none;
      padding: 8px 0;
      transition: 0.3s all ease-in-out;
      &:hover {
        background: rgba($color: #002f34, $alpha: 0.8);
      }
    }
  }
}
.is-invalid {
  input {
    border-color: red !important;
  }
  span {
    color: red !important;
  }
}
</style>
