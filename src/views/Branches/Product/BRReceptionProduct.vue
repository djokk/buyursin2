<template>
  <div class="BRReceptionProduct">
    <div class="breadcrumb p-0">
      <router-link :to="{name: 'BRDashboard'}" class="breadcrumb__link"><i class="bx bx-home-alt"></i></router-link>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <p>{{ $t('Прием') }}</p>
      </div>
    </div>
    <div class="wrapper">
      <div v-if="infoAcceptItems.length != 0" class="card-custom">
        <div class="table-custom">
          <div class="table-custom__header">
            <p class="w-1">{{ $t('branchName') }}</p>
            <p class="w-2">{{ $t('date') }}</p>
            <p class="w-3">{{ $t('state') }}</p>
            <p class="w-4"></p>
          </div>
          <div class="table-custom__body">
            <div v-for="item in infoAcceptItems" :key="item.id" class="table-custom__body-item">
              <p class="w-1">{{ item.sendBranchName }}</p>
              <p class="w-2">{{ item.sendDateTime | moment("DD/MM/YYYY - H:m") }}</p>
              <p class="w-3">{{ item.recvState == 1 ? $t('Ожидание приемки') : item.recvState == 2 ? $t('Принято') : $t('Отклонено') }}</p>
              <div class="w-4 btns">
                <button @click="openModalInfo(item)" type="button" class="btn btn-primary"><i class='bx bx-copy-alt'></i></button>
                <!-- <button @click="changeModalAdd(item)" type="button" class="btn btn-warning"><i class='bx bx-edit'></i></button> -->
                <button @click="openModalDel(item.id)" class="btn btn-danger"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-custom">
        <div class="table-custom">
          <div class="table-custom__header">
            <p class="w-1">{{ $t('branchName') }}</p>
            <p class="w-2">{{ $t('date') }}</p>
            <p class="w-3">{{ $t('state') }}</p>
            <p class="w-4"></p>
          </div>
          <div class="table-custom__body">
            <div v-for="item in infoAcceptItemClaim" :key="item.id" class="table-custom__body-item">
              <p class="w-1">{{ item.sendBranchName }}</p>
              <p class="w-2">{{ item.sendDateTime | moment("DD/MM/YYYY - H:m") }}</p>
              <p class="w-3">{{ item.recvState == 1 ? $t('Ожидание приемки') : item.recvState == 2 ? $t('Принято') : $t('Отклонено') }}</p>
              <div class="w-4 btns">
                <button @click="openModalInfo(item)" type="button" class="btn btn-primary"><i class='bx bx-copy-alt'></i></button>
                <!-- <button @click="changeModalAdd(item)" type="button" class="btn btn-warning"><i class='bx bx-edit'></i></button> -->
                <!-- <button @click="openModalDel(item.id)" class="btn btn-danger"><i class="fa fa-trash-o" aria-hidden="true"></i></button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading v-show="loading"/>
  </div>
</template>

<script>
import axios from 'axios';
import Loading from '@/components/Loading.vue';

export default {
  name: 'BRReceptionProduct',
  data() {
    return {
      loading: false,
      modalAdd: false,
      modalDelete: false,
      btnChange: false,
      infoAcceptItems: [],
      infoAcceptItemClaim: [],
      token: '',
      api: ''
    }
  },
  components: {
    Loading
  },
  beforeMount() {
    this.api = window.MY_CONFIG_BUYURSIN.api;
    // this.token = localStorage.token;
  },
  mounted() {    
    this.token = sessionStorage.getItem('token');
    this.loading = true;
    this.listAcceptItems();
    this.acceptItemClaim();
  },
  methods: {
    listAcceptItems() {
      this.infoAcceptProducts = [];
      axios.get(`${this.api}/listAcceptItems/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          this.infoAcceptItems = response.data;
        })
        .catch(error => {
          // console.log(e.response);
          if(error.response.status == 401) {
            this.$toast.error(error.response.data.detail);
            sessionStorage.setItem('token', '');
            this.$router.push({ name: 'Auth' });
          }
        });
    },
    acceptItemClaim() {
      this.infoAcceptProducts = [];
      axios.get(`${this.api}/acceptItemClaim/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          this.infoAcceptItemClaim = response.data;
        })
        
        .catch(error => {
          // console.log(e.response);
          if(error.response.status == 401) {
            this.$toast.error(error.response.data.detail);
            sessionStorage.setItem('token', '');
            this.$router.push({ name: 'Auth' });
          }
        })
        .finally(()=> {
          this.loading = false;
        });
    },
  },
}
</script>

<style lang="scss" scoped>
.BRReceptionProduct {
  @media screen and (max-width: 991.5px) {
    margin-left: 0;
    padding: 0px 10px;
  }
  .breadcrumb {
    display: flex;
    align-items: center;
    background-color: transparent;
    margin: 0px 0 25px;
    &__item {
      display: flex;
      align-items: center;
      .fa {
        color: #002f34;
        font-size: 25px;
        margin: 0 10px;
      }
      p {
        font-family: 'Roboto';
        font-size: 18px;
        line-height: 18px;
        font-weight: 500;
        color: #002f34;
      }
    }
    &__link {
      display: flex;
      align-items: center;
      .bx {
        color: #002f34;
        font-size: 26px;
      }
    }
  }
  .wrapper {
    margin-bottom: 90px;
  }
  .card-custom {
    // position: relative;
    // display: flex;
    // flex-direction: column;
    // min-width: 0;
    // word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid transparent;
    border-radius: 0.25rem;
    box-shadow: 0 0.3rem 0.8rem rgba(0,0,0,0.12);
    padding: 1rem;
    margin-bottom: 4.5rem;
    overflow: scroll hidden;
  }
  .table-custom {
    min-width: 500px;
    // overflow: scroll hidden;
    &__header {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      // padding: 0 0.5rem 1rem 0.5rem;
      p {
        font-size: 20px !important;
        font-weight: 600 !important;
        text-align: center;
        padding: 1rem;
      }
    }
    &__body {
      &-item {
        display: flex;
        transition: 0.3s all ease-in-out;
        min-height: 64px;
        padding: 0 0.5rem 0 0;
        &:hover {
          background: rgba($color: #002f34, $alpha: 1) !important;
          p {
            color: #fff;
          }
        }
        &:nth-child(odd) {
          background: rgba($color: #002f34, $alpha: 0.12);
        }
        &:not(:last-child){
          border-bottom: 1px solid rgba($color: #002f34, $alpha: 0.15);
        }
        p {
          display: flex;
          justify-content: center;
          align-items: center;
          // padding: 0.5rem 0.5rem;
        }
        .btns {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 0.5rem;
          .btn {
            display: block;
            padding: 0.375rem 0.75rem;
          }
        }
        .w-2 {
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          border-right: 1px solid rgba(255, 255, 255, 0.15);
        }
        .w-4 {
          border-left: 1px solid rgba(255, 255, 255, 0.15);
        }
      }
    }
    p {
      font-family: 'Roboto';
      font-size: 16px;
      line-height: 16px;
      font-weight: 400;
      color: rgba($color: #002f34, $alpha: 0.85);
      word-break: break-all;
      white-space: pre-wrap;
    }
    .w-1 {
      width: calc(100%/3);
      // @media screen and (max-width: 767.5px) {
      //   width: 30%;
      // }
    }
    .w-2 {
      width: calc(100%/3);
      // @media screen and (max-width: 575.5px) {
      //   width: 50%;
      // }
      // @media screen and (max-width: 767.5px) {
      //   width: 60%;
      // }
    }
    .w-3 {
      width: calc(100%/3);
    }
    .w-4 {
      width: 180px;
    }
  }
}

.nested-enter-active, .nested-leave-active {
	transition: all 0.2s ease-in-out;
}
/* delay leave of parent element */
.nested-leave-active {
  transition-delay: 0s;
}
.nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
  font-style: italic;
}

</style>