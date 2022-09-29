<template>
  <div class="branches">
    <div class="breadcrumb p-0">
      <router-link :to="{name: 'Dashboard'}" class="breadcrumb__link"><i class="bx bx-home-alt"></i></router-link>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <router-link :to="{name: 'Add'}" class="breadcrumb__link"><i class="bx bxs-layer-plus"></i></router-link>
      </div>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <p>{{ $t('branches') }}</p>
      </div>
    </div>
    <div class="wrapper">
      <div class="card-custom">
        <div class="table-custom">
          <div class="table-custom__header">
            <p class="w-1">{{ $t('name') }}</p>
            <p class="w-2">{{ $t('typeBranch') }}</p>
            <p class="w-3"></p>
          </div>
          <div class="table-custom__body">
            <div v-for="item in info" :key="item.id" class="table-custom__body-item">
              <p class="w-1">{{ item.name }}</p>
              <p class="w-2">{{ item.branchType == 1 ? 'Цех' : item.branchType == 2 ? $t('shop') : $t('store') }}</p>
              <div class="w-3 btns">
                <button @click="changeModalAdd(item)" type="button" class="btn btn-warning"><i class='bx bx-edit'></i></button>
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
      <form @submit.prevent="delBranch()" class="form" action="">
        <p>{{ $t('textDelete') }}</p>
        <div class="btns">
          <button class="btn btn-success" type="submit">{{ $t('yes')}}</button>
          <button @click="closeModalAdd()" class="btn btn-outline-danger" type="button">{{ $t('not')}}</button>
        </div>
      </form>
    </div>
    <div v-if="modalAdd" class="modal-add">
      <form class="form" action="">
        <div class="name">
          <span>{{ $t('name') }}</span>
          <input v-model="branchName" :class="$v.branchName.$error ? 'is-invalid': ''" class="input" type="text">
        </div>
        <div class="selects">
          <span>{{ $t('typeBranch') }}</span>
          <multiselect v-model="branchTypeValue" :class="$v.branchTypeValue.$error ? 'is-invalid': ''" placeholder="" label="name" track-by="code" :options="branchTypeOptions" :multiple="false" :taggable="false" :searchable="false"></multiselect>
          
          <!-- <select name="select" v-model="typeBranch">
            <option value="Цех">Цех</option>
            <option :value="$t('store')">{{ $t('store') }}</option>
            <option :value="$t('shop')">{{ $t('shop') }}</option>
          </select> -->
        </div>
        <div class="btns">
          <button v-if="btnChange != true" @click.prevent="addBranch()" class="btn btn-success" type="button">{{ $t('add') }}</button>
          <button v-else-if="btnChange == true" @click.prevent="editBranch()" class="btn btn-warning" type="button">{{ $t('change') }}</button>
          <button @click="closeModalAdd()" class="btn btn-outline-danger" type="button">{{ $t('cancel') }}</button>
        </div>
      </form>
    </div>
    <div v-show="modalAdd || modalDelete" class="modal-bg"></div>
    <Loading v-show="loading"/>
  </div>
</template>

<script>
import axios from 'axios';
import { required } from 'vuelidate/lib/validators';
import Loading from '@/components/Loading.vue';

export default {
  name: 'Branches',
  data() {
    return {
      loading: false,
      info: [],
      branchId: '',
      branchName: '',
      branchTypeValue: '',
      branchTypeOptions: [
        {
          code: 1,
          name: 'Цех'
        },
        {
          code: 2,
          name: this.$t('shop')
        },
        {
          code: 3,
          name: this.$t('store')
        }
      ],
      modalDelete: false,
      btnChange: false,
      modalAdd: false,
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
    this.getBranches();
    // this.getUsers();
  },
  methods: {
    openModalAdd() {
      this.modalAdd = true;
      this.btnChange = false;
    },
    closeModalAdd() {
      this.modalAdd = false;
      this.modalDelete = false;
      this.branchName = '';
      this.branchTypeValue = '';
      this.$v.$reset();
    },
    clear() {
      this.branchName = '';
      this.typeBranch = '';
    },
    changeModalAdd(item) {
      this.modalAdd = true;
      this.btnChange = true;
      this.branchId = item.id;
      this.branchName = item.name;
      this.branchTypeValue = this.branchTypeOptions.find(items => {
        return items.code == item.branchType
      });
    },
    openModalDel(id) {
      // console.log(id);
      this.modalDelete = true;
      this.branchId = id;
    },
    getBranches() {
      this.info = [];
      axios.get(`${this.api}/branches/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          // this.info = response.data;
          for (let index = 0; index < response.data.length; index++) {
            this.info.push({
              id: response.data[index].id,
              name: response.data[index].name,
              branchType: response.data[index].branchType,
              list: []
            })
            axios.get(`${this.api}/departments/?branch=${response.data[index].id}`, {
                headers: {
                  'Authorization': `Token ${this.token}`
                }
              })
              .then(response => {
                // console.log(response.data);
                this.info[index].list = response.data;
                  // this.$toast.error(response.data.detail);
              })
              .catch(error => {
                console.log(error);
                if(error.response.status == 401) {
                  this.$toast.error(error.response.data.detail);
                }
              });
          }
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
    addBranch() {
      this.$v.$touch()
      if (this.$v.branchName.$invalid || this.$v.branchTypeValue.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.post(`${this.api}/branches/`, {
            "name": this.branchName,
            "branchType" : this.branchTypeValue.code
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Добавленно');
              this.getBranches();
            } else {
              this.$toast.error(response.data.msg);
            }
          })
          .catch(error => {
            // console.log(e.response);
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
    editBranch() {
      this.$v.$touch()
      if (this.$v.branchName.$invalid || this.$v.branchTypeValue.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.put(`${this.api}/branches/${this.branchId}/`, {
            "name": this.branchName,
            "branchType" : this.branchTypeValue.code
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Изменнено');
              this.getBranches();
            } else {
              this.$toast.error(response.data.msg);
            }
          })
          .catch(error => {
            // console.log(e.response);
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
    delBranch() {
      this.loading = true;
      axios.delete(`${this.api}/branch-delete/${this.branchId}/`, 
        {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          if(response.data.code == 1) {
            this.$toast.success('Удаленно');
            this.getBranches();
          } else {
            this.$toast.error(response.data.msg);
          }
        })
        .catch(error => {
          // console.log(e.response);
          if(error.response.status == 401) {
            this.$toast.error(error.response.data.detail);
          }
        })
        .finally(()=> {
          this.closeModalAdd();
          this.loading = false;
        });
    },
  },
  validations: {
    branchName: {
      required
    },
    branchTypeValue: {
      required
    }
  },
}
</script>

<style lang="scss" scoped>
.branches {
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
        // &:not(:last-child){
        //   border-bottom: 1px solid rgba($color: #002f34, $alpha: 0.15);
        // }
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
      @media screen and (max-width: 767.5px) {
        width: 30%;
      }
    }
    .w-2 {
      width: 50%;
      @media screen and (max-width: 575.5px) {
        width: 50%;
      }
      @media screen and (max-width: 767.5px) {
        width: 60%;
      }
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
      .selects {
        position: relative;
        width: 100%;
        select {
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
          margin-bottom: 12px;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          cursor: pointer;
          &:hover {
            border-color: rgba(255, 255, 255, 0.2);
            transition: 0.3s all ease-in-out;
          }
          &:focus-visible {
            border-color: rgba(255, 255, 255, 0.2);
            outline: none;
          }
        }
        .fa {
          position: absolute;
          top: 7px;
          right: 14px;
          font-size: 30px;
          color: #5A5A5A;
        }
        select:hover + span + .fa,
        select:focus-visible + span + .fa {
          transition: 0.3s all ease-in-out;
          color: rgb(175, 175, 175);
        }
        select:hover + span,
        select:focus-visible + span {
          transition: 0.3s all ease-in-out;
          color: rgb(175, 175, 175) !important;
        }
        .multiselect {
          cursor: pointer;
          border: 2px solid rgba(0,0,0,.12);
          border-radius: 5px;
          margin-bottom: 12px;
          padding: 2px 0;
          font-family: 'Roboto';
          &:hover {
            border-color: rgb(175, 175, 175);
            transition: 0.3s all ease-in-out;
          }
        }
        .multiselect__single {
          font-family: 'Roboto';
        }
        span {
          padding: 2px 5px 0 5px !important;
          margin-bottom: 2px;
          z-index: 49;
        }
        .multiselect:hover+span {
          color: rgb(175, 175, 175);
          transition: 0.3s all ease-in-out;
        }
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
  .name,
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
  .input, select {
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