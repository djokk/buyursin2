<template>
  <section class="BRSendingFinishedProduct">
    <div class="breadcrumb p-0">
      <router-link :to="{name: 'BRDashboard'}" class="breadcrumb__link"><i class="bx bx-home-alt"></i></router-link>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <p>{{ $t('Отправка') }}</p>
      </div>
    </div>
    <div class="wrapper">
      <div class="card-custom">
        <div class="table-custom">
          <div class="table-custom__header">
            <p class="w-1">{{ $t('branchName') }}</p>
            <p class="w-2">{{ $t('date') }}</p>
            <p class="w-3">{{ $t('state') }}</p>
            <p class="w-4"></p>
          </div>
          <div class="table-custom__body">
            <div v-for="item in infoSend" :key="item.id" class="table-custom__body-item">
              <p class="w-1">{{ item.sendBranchName }}</p>
              <p class="w-2">{{ item.sendDateTime | moment("DD/MM/YYYY - H:mm") }}</p>
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
    </div>
    <div @click="openModalAdd()" class="btn-add">
      <i class="fa fa-plus-circle" aria-hidden="true"></i>
    </div>
    <div v-if="modalInfo" class="modal-info">
      <div @click="closeInfoModal()" class="close-btn">
        <i class='bx bxs-x-circle'></i>
      </div>
      <div class="wrapper">
        <p>Время отправки: <span>{{ infoModal.sendDateTime | moment("DD/MM/YYYY - H:m") }}</span></p>
        <p>Откуда отправлено:	<span>{{ infoModal.sendBranchName }}</span></p>
        <p>Имя отправителя:	<span>{{ infoModal.sendUserName }}</span></p>
        <br>
        <p>Состояния:	<span>{{ infoModal.recvState == 1 ? $t('Ожидание приемки') : infoModal.recvState == 2 ? $t('Принято') : $t('Отклонено') }}</span></p>
        <p v-if="infoModal.recvState == 2">Время когда приняли:	<span>{{ infoModal.recvDateTime | moment("DD/MM/YYYY - H:m") }}</span></p>
        <p>Куда отправили:	<span>{{ infoModal.sentToBranchName }}</span></p>
        <p>Откуда отправлено:	<span>{{ infoModal.sendBranchName }}</span></p>
        <p>Имя принимателя:	<span>{{ infoModal.recvUserName }}</span></p>
        <br>
        <div class="list">
          <h1>Список:</h1>
          <div v-for="item in infoModal.items" :key="item.index" class="list__item">
            <p>{{ item.productTemplateName }}:</p>
            <p>{{ item.count }} dona</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="modalDelete" class="modal-delete">
      <form @submit.prevent="deleteItemClaim()" class="form" action="">
        <p>{{ $t('textDelete') }}</p>
        <div class="btns">
          <button class="btn btn-success" type="submit">{{ $t('yes')}}</button>
          <button @click="modalDelete = !modalDelete" class="btn btn-outline-danger" type="button">{{ $t('not')}}</button>
        </div>
      </form>
    </div>
    <div v-show="modalInfo || modalDelete" class="modal-bg"></div>
    <Loading v-show="loading"/>
  </section>
</template>

<script>
import axios from 'axios';
import Loading from '@/components/Loading.vue';
// import moment from 'moment';

export default {
  name: 'BRSendingFinishedProduct',
  data() {
    return {
      loading: false,
      modalInfo: false,
      modalDelete: false,
      infoModal: [],
      infoSend: [],
      claimId: '',
      token: '',
      api: '',
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
    this.listSendProducts();
  },
  methods: {
    listSendProducts() {
      this.loading = true;
      this.infoSend = [];
      axios.get(`${this.api}/listSendProducts/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          this.infoSend = response.data;
        })
        .catch(error => {
          // console.log(e.response);
          if(error.response.status == 401) {
            this.$toast.error(error.response.data.detail);
            sessionStorage.setItem('token', '');
            this.$router.push({ name: 'Auth' });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteItemClaim() {
      this.loading = true;
      axios.get(`${this.api}/deleteItemClaim/?id=${this.claimId}`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          console.log(response.data);
          this.listSendItems();
        })
        .catch(error => {
          this.$toast.error(error.response);
          // console.log(error.response);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openModalAdd() {
      // this.modalAdd = true;
      // this.btnChange = false;
      this.$router.push({ name: 'BRSendingAddFinishedProduct' });
    },
    openModalInfo(item) {
      this.modalInfo = true;
      this.infoModal = item;
      // console.log(item);
    },
    closeInfoModal() {
      this.modalInfo = false;
      this.infoModal = [];
    },
    openModalDel(id) {
      this.claimId = id;
      this.modalDelete = true;
    },
  },
}
</script>

<style lang="scss" scoped>
.BRSendingFinishedProduct {
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
    margin-bottom: 4.5rem;
    box-shadow: 0 0.3rem 0.8rem rgba(0,0,0,0.12);
    padding: 1rem;
    overflow: scroll hidden;
  }
  .table-custom {
    min-width: 700px;
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
  .btn-add {
    width: 60px;
    height: 60px;
    position: fixed;
    bottom: 15px;
    right: 15px;
    padding: 10px;
    cursor: pointer;
    border-radius: 50%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .fa {
      font-size: 50px;
      color: #28a745;
    }
  }
  .modal-delete {
    position: fixed;
    z-index: 11;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 0.5rem;
    padding: 12px;
    .form {
      width: 400px;
      display: flex;
      flex-direction: column;
      p {
        font-family: 'Roboto';
        font-size: 24px;
        line-height: 24px;
        font-weight: 400;
        color: #212529;
        margin-bottom: 15px;
        text-align: center;
      }
      .btns {
        display: flex;
        justify-content: space-between;
        .btn {
          width: 48%;
          font-family: 'Roboto';
          padding: 8px 30px;
          text-transform: uppercase;
        }
      }
    }
  }
  .modal-info {
    position: fixed;
    z-index: 11;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 0.5rem;
    padding: 20px 12px 12px;
    .close-btn {
      width: 46px;
      height: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -20px;
      right: -20px;
      cursor: pointer;
      .bx {
        padding: 2px;
        border-radius: 50%;
        background: red;
        color: #fff;
        font-size: 28px;
      }
    }
    .wrapper {
      width: 400px;
      max-height: 400px;
      overflow-y: auto;
      @media screen and (max-width: 575.5px) {
        width: 265px;
      }
      p {
        font-family: 'Roboto';
        font-size: 18px;
        font-weight: 600;
        color: rgba($color: #002f34, $alpha: 0.85);
        @media screen and (max-width: 575.5px) {
          font-size: 12px;
        }
        span {
          font-weight: 400;
        }
      }
      .list {
        display: flex;
        flex-direction: column;
        h1 {
          font-family: 'Roboto';
          font-size: 18px;
          font-weight: 600;
          color: rgba($color: #002f34, $alpha: 0.85);
          margin-bottom: 10px;
        }
        &__item {
          width: 100%;
          display: flex;
          border-bottom: 1px solid rgba($color: #002f34, $alpha: 0.35);
          margin-bottom: 5px;
          &:nth-last-child(1){
            border-bottom: none;
          }
          p:nth-last-child(1){
            font-weight: 400;
            margin-left: 15px;
          }
        }
      }
    }
  }
  .modal-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 210px;
    z-index: 10;
    @media screen and (max-width: 991.5px) {
      left: 0px;
    }
  }
}
</style>