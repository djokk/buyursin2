<template>
  <section class="WRSendingAddFinishedProduct">
    <div class="breadcrumb p-0">
      <div class="breadcrumb__item">
        <router-link :to="{name: 'WRSendingFinishedProduct'}" class="breadcrumb__link">
          <i class="fa fa-angle-left"></i>
          <p>{{ $t('back') }}</p>
        </router-link>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 mb-3">
        <div class="filter-card">
          <div class="card mb-0">
            <div class="selects">
              <multiselect v-model="branchValue" deselect-label="Невозможно удалить" :allow-empty="false" label="name" track-by="id" :options="branchOption" :multiple="false" :taggable="false" :searchable="false"></multiselect>
              <span>Филиал</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="card-custom">
        <div class="table-custom">
          <div class="table-custom__header">
            <p class="w-1">{{ $t('name') }}</p>
            <p class="w-2">{{ $t('count') }}</p>
            <p class="w-3"></p>
          </div>
          <div class="table-custom__body">
            <div v-for="item in info" :key="item.id" class="table-custom__body-item">
              <p class="w-1">{{ item.sendBranchName }}</p>
              <p class="w-2">{{ item.sendDateTime | moment("DD/MM/YYYY - H:m") }}</p>
              <div class="w-3 btns">
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
    <div v-if="modalDelete" class="modal-delete">
      <form @submit.prevent="delColor()" class="form" action="">
        <p>{{ $t('textDelete') }}</p>
        <div class="btns">
          <button class="btn btn-success" type="submit">{{ $t('yes')}}</button>
          <button @click="modalDelete = !modalDelete" class="btn btn-outline-danger" type="button">{{ $t('not')}}</button>
        </div>
      </form>
    </div>
    <div v-if="modalAdd" class="modal-add">
      <form @submit.prevent="addColor()" class="form" action="">
        <div class="name">
          <input v-model="colorCode" :class="$v.colorCode.$error ? 'is-invalid': ''" class="input" type="text">
          <span>{{ $t('colorCode') }}</span>
        </div>
        <div class="name">
          <input v-model="colorName" :class="$v.colorName.$error ? 'is-invalid': ''" class="input" type="text">
          <span>{{ $t('colorName') }}</span>
        </div>
        <div class="btns">
          <button v-if="btnChange != true" class="btn btn-success" type="submit">{{ $t('add') }}</button>
          <button v-else-if="btnChange == true" @click.prevent="editColor()" class="btn btn-warning" type="button">{{ $t('change') }}</button>
          <button @click="closeModalAdd()" class="btn btn-outline-danger" type="button">{{ $t('cancel') }}</button>
        </div>
      </form>
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
    <div v-show="modalAdd || modalDelete || modalInfo" class="modal-bg"></div>
    <Loading v-show="loading"/>
  </section>
</template>

<script>
import axios from 'axios';
import { required } from 'vuelidate/lib/validators';
import Loading from '@/components/Loading.vue';
// import moment from 'moment';

export default {
  name: 'WRSendingAddFinishedProduct',
  data() {
    return {
      loading: false,
      modalDelete: false,
      btnChange: false,
      modalAdd: false,
      modalInfo: false,
      colorId: '',
      colorCode: '',
      colorName: '',
      branchValue: [],
      branchOption: [],
      info: [],
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
    this.getBranches();
  },
  methods: {
    getBranches() {
      this.loading = true;
      this.branchOption = [];
      axios.get(`${this.api}/branches/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          this.branchOption = response.data;
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
    addColor() {
      this.$v.$touch()
      if (this.$v.colorCode.$invalid || this.$v.colorName.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.post(`${this.api}/colors/`, {
            "name": this.colorName,
            "code": this.colorCode
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Добавленно');
              this.getColor();
            } else {
              this.$toast.error(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
            if(error.response.status == 401) {
              this.$toast.error(error.response.data.detail);
            }
          })
          .finally(()=> {
            this.closeModalAdd();
            this.loading = false;
          });
      }
    },
    editColor() {
      this.$v.$touch()
      if (this.$v.colorCode.$invalid || this.$v.colorName.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.put(`${this.api}/colors/${this.colorId}/`, {
            "name": this.colorName,
            "code": this.colorCode
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Изменнено');
              this.getColor();
            } else {
              this.$toast.error(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
            if(error.response.status == 401) {
              this.$toast.error(error.response.data.detail);
            }
          })
          .finally(()=> {
            this.closeModalAdd();
            this.loading = false;
          });
      }
    },
    delColor() {
      this.loading = true;
      axios.delete(`${this.api}/color-delete/${this.colorId}/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          if(response.data.code == 1) {
            this.$toast.success('Удаленно');
            this.getColor();
          } else {
            this.$toast.error(response.data.msg);
          }
        })
        .catch(error => {
            console.log(error);
            if(error.response.status == 401) {
              this.$toast.error(error.response.data.detail);
            }
          })
        .finally(() => {
            this.closeModalAdd();
          this.loading = false;
        });
    },
    openModalAdd() {
      this.modalAdd = true;
      this.btnChange = false;
    },
    closeModalAdd() {
      this.modalAdd = false;
      this.modalDelete = false;
      this.btnChange = false;
      this.colorCode = '';
      this.colorName = '';
      this.$v.$reset();
    },
    changeModalAdd(item) {
      this.modalAdd = true;
      this.btnChange = true;
      this.colorId = item.id;
      this.colorCode = item.code;
      this.colorName = item.name;
    },
    openModalDel(id) {
      this.colorId = id;
      this.modalDelete = true;
    },
    openModalInfo(item) {
      this.modalInfo = true;
      this.infoModal = item;
      // console.log(item);
    },
    closeInfoModal() {
      this.modalInfo = false;
      this.infoModal = [];
    }
  },
  validations: {
    colorCode: {
      required
    },
    colorName: {
      required
    },
  },
}
</script>

<style lang="scss" scoped>
.WRSendingAddFinishedProduct {
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
  .filter-card {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    background-color: #fff;
    transition: all .5s ease-in-out;
    position: relative;
    border: 0rem solid transparent;
    border-radius: 1.25rem;
    box-shadow: 0rem 0.3125rem 0.3125rem 0rem rgba(43, 37, 51, 0.05);
    padding: 15px;
    .selects {
      // background: #fff;
      .multiselect {
        cursor: pointer;
        border-radius: 5px;
        padding: 2px 0;
        font-family: 'Roboto';
      }
      .multiselect__single {
        font-family: 'Roboto';
      }
      span {
        padding: 2px 5px 0 5px !important;
        margin-bottom: 2px;
        z-index: 10;
      }
      .multiselect:hover+span {
        color: rgb(175, 175, 175);
        transition: 0.3s all ease-in-out;
      }
      .multiselect .multiselect__tags {
        background: transparent !important;
      }
    }
  }
  
  .selects {
    position: relative;
    span {
      position: absolute;
      z-index: 2;
      top: 0%;
      left: 10px;
      transform: translateY(-50%);
      font-family: 'Roboto';
      font-size: 12px;
      font-weight: 400;
      color: rgba(0,0,0,.4);
      background: #fff;
      padding: 2px 5px;
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
      width: 50%;
    }
    .w-2 {
      width: 50%;
    }
    .w-3 {
      width: 100px;
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
  .modal-add {
    position: fixed;
    z-index: 11;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 0.5rem;
    padding: 12px;
    .text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #212529;
      p {
        font-family: 'Roboto';
        font-size: 20px;
        font-weight: 400;
        cursor: pointer;
        padding: 5px 16px;
        color: rgb(129, 129, 129);
        transition: 0.3s all ease-in-out;
        &:hover {
          color: #000;
          background: rgb(230, 230, 230);
        }
      }
      .active {
        color: #fff;
        background: #212529;
        &:hover {
          color: #fff;
          background: #212529;
        }
      }
    }
    .form {
      width: 400px;
      display: flex;
      flex-direction: column;
      @media screen and (max-width: 575.5px) {
        width: 290px;
      }
      .input {
        width: 100%;
        margin-bottom: 12px;
      }
      .btns {
        display: flex;
        justify-content: space-between;
        .btn {
          width: 48%;
          font-family: 'Roboto';
          padding: 8px 30px;
          text-transform: uppercase;
          @media screen and (max-width: 575.5px) {
            padding: 8px 16px;
          }
        }
      }
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
  .name {
    position: relative;
    span {
      position: absolute;
      z-index: 2;
      top: 0%;
      left: 10px;
      transform: translateY(-50%);
      font-family: 'Roboto';
      font-size: 12px;
      font-weight: 400;
      color: rgba(0,0,0,.4);
      background: #fff;
      padding: 2px 5px;
    }
  }
  .input {
    width: 100%;
    font-family: 'Roboto';
    font-size: 18px;
    font-weight: 400;
    color: #5A5A5A;
    border: 2px solid rgba(0,0,0,.12);
    border-radius: 5px;
    padding: 0.5em 0.7em;
    position: relative;
    background: transparent;
    z-index: 1;
    margin: 0;
    &:hover {
      border-color: rgb(175, 175, 175);
      transition: 0.3s all ease-in-out;
    }
    &:focus-visible {
      border-color: rgb(175, 175, 175);
      outline: none;
    }
  }
  input:focus-visible+span{
    transition: 0.3s all ease-in-out;
    color: rgb(175, 175, 175) !important;
  }
  input:hover+span{
    transition: 0.3s all ease-in-out;
    color: rgb(175, 175, 175);
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
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
  .is-invalid {
    border-color: red !important;
  }
  .is-invalid + span {
    color: red !important;
  }
  .is-invalid + span + .fa{
    color: red !important;
  }
}
</style>