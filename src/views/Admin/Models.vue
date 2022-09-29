<template>
  <section class="models">
    <div class="breadcrumb p-0">
      <router-link :to="{name: 'Dashboard'}" class="breadcrumb__link"><i class="bx bx-home-alt"></i></router-link>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <p>{{ 'Model' }}</p>
      </div>
    </div>
    <div class="wrapper">
      <div class="card">
        <ul class="clps-menu">
          <li v-for="item in info" :key="item.id" class="clps-menu__item clps">
            <div @click="collapseToggle(item.id)" class="clps__button">
              <p class="d-flex align-items-center">{{ item.name }} <i class='ml-1 bx ' :class="[collapseActive == item.id ? 'bxs-down-arrow' : 'bxs-right-arrow']"></i></p>
              <div class="btns">
                <button @click="changeModalAdd(1, item)" type="button" class="btn btn-warning"><i class='bx bx-edit'></i></button>
                <button @click="openModalDeleteGroup(item.id)" type="button" class="btn btn-danger"><i class='bx bxs-trash'></i></button>
              </div>
            </div>
            <Transition duration="350" name="nested">
              <div v-if="collapseActive == item.id" class="clps__list list">
                <div class="custom-table">
                  <div v-if="item.list.length != 0" class="custom-table__header">
                    <p class="w-1">№</p>
                    <p class="w-2">Код</p>
                    <p class="w-3">Название</p>
                    <p class="w-4">Цвет</p>
                    <p class="w-5"></p>
                  </div>
                  <div v-else class="custom-table__header">
                    <p>Пусто</p>
                  </div>
                  <div v-for="(itemList,index) in item.list" :key="itemList.Id" class="custom-table__body">
                    <p class="w-1">{{ index + 1}}</p>
                    <p class="w-2">{{ itemList.code }}</p>
                    <p class="w-3">{{ itemList.name }}</p>
                    <p class="w-4">{{ itemList.colorName }}</p>
                    <div class="btns w-5">
                      <button @click="openNexPage(itemList)" type="button" class="btn btn-primary">Открыть</button>
                      <button @click="changeModalAdd(2, itemList)" type="button" class="btn btn-warning"><i class='bx bx-edit'></i></button>
                      <button @click="openModalDelete(itemList.id)" type="button" class="btn btn-danger"><i class='bx bxs-trash'></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </li>
        </ul>
      </div>
    </div>
    <div @click="openModalAdd()" class="btn-add">
      <i class="fa fa-plus-circle" aria-hidden="true"></i>
    </div>
    <div v-show="modalAdd" class="modal-add">
      <div v-if="text" class="text">
        <p @click="madalParams = 1" class="" :class="[madalParams == 1 ? 'active' : '']">Группа моделей</p>
        <p @click="madalParams = 2" class="" :class="[madalParams == 2 ? 'active' : '']">Модель</p>
      </div>
      <form v-if="madalParams == 1" class="form" action="">
        <div class="name">
          <input v-model="productGroupName" class="input" :class="$v.productGroupName.$error ? 'input is-invalid': 'input'" type="text">
          <span>Название моделя</span>
        </div>
        <div class="btns">
          <button v-if="btnChange != true" @click.prevent="addProductGroup()" class="btn btn-success">Добавить</button>
          <button v-else-if="btnChange == true" @click.prevent="editProductGroup()" class="btn btn-warning" type="button">Изменить</button>
          <button @click="closeModalAdd()" class="btn btn-outline-danger" type="button">Отмена</button>
        </div>
      </form>
      <form v-if="madalParams == 2" class="form" action="">
        <div class="selects">
          <multiselect v-model="productGroupValue" :class="$v.productGroupValue.$error ? 'is-invalid': ''" placeholder="" label="name" track-by="code" :options="productGroupOption" :multiple="false" :taggable="false" :searchable="false"></multiselect>
          <span>Группа</span>
        </div>
        <div class="name">
          <input v-model="productTemplatesCode" class="input" :class="$v.productTemplatesCode.$error ? 'input is-invalid': 'input'" type="text">
          <span>Код</span>
        </div>
        <div class="name">
          <input v-model="productTemplatesName" class="input" :class="$v.productTemplatesName.$error ? 'input is-invalid': 'input'" type="text">
          <span>Название</span>
        </div>
        <div class="selects">
          <multiselect v-model="productTemplatesColorValue" :class="$v.productTemplatesColorValue.$error ? 'is-invalid': ''" placeholder="" label="name" track-by="code" :options="productTemplatesColorOption" :multiple="false" :taggable="false" :searchable="false"></multiselect>
          <span>Цвет</span>
        </div>
        <div class="btns">
          <button v-if="btnChange != true" @click.prevent="addProductTemplates()" class="btn btn-success">Добавить</button>
          <button v-else-if="btnChange == true" @click.prevent="editProductTemplates()" class="btn btn-warning" type="button">Изменить</button>
          <button @click="closeModalAdd()" class="btn btn-outline-danger" type="button">Отмена</button>
        </div>
      </form>
    </div>
    <div v-if="modalDeleteGroup" class="modal-delete">
      <form @submit.prevent="delProductGroup()" class="form" action="">
        <p>Вы уверенны что хотите удалить ?</p>
        <div class="btns">
          <button class="btn btn-success" type="submit">ДА</button>
          <button @click="modalDelete = !modalDelete" class="btn btn-outline-danger" type="button">НЕТ</button>
        </div>
      </form>
    </div>
    <div v-if="modalDelete" class="modal-delete">
      <form @submit.prevent="delProductTemplates()" class="form" action="">
        <p>Вы уверенны что хотите удалить ?</p>
        <div class="btns">
          <button class="btn btn-success" type="submit">ДА</button>
          <button @click="modalDelete = !modalDelete" class="btn btn-outline-danger" type="button">НЕТ</button>
        </div>
      </form>
    </div>
    <div v-show="modalAdd || modalDelete" class="modal-bg"></div>
    <Loading v-show="loading"/>
  </section>
</template>

<script>
import axios from 'axios';
import Loading from '@/components/Loading.vue';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'Models',
  data() {
    return {
      loading: false,
      modalAdd: false,
      modalDeleteGroup: false,
      modalDelete: false,
      btnChange: false,
      collapseActive: 0,
      text: true,
      madalParams: 1,
      info: [],
      productGroupId: '',
      productGroupName: '',
      productGroupValue: '',
      productGroupOption: [],
      productTemplatesId: '',
      productTemplatesCode: '',
      productTemplatesName: '',
      productTemplatesColorValue: '',
      productTemplatesColorOption: [],
      api: '',
      token: ''
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
    this.getColor();
    this.getProductGroups();
  },
  methods: {
    openNexPage(item) {
      this.$router.push({ name: 'ModelsItem', params: { productName: item.name , id: item.id } });
    },
    getColor() {
      this.productTemplatesColorOption = [];
      axios.get(`${this.api}/colors/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          for (let index = 0; index < response.data.length; index++) {
            this.productTemplatesColorOption.push({
              code: response.data[index].code,
              id: response.data[index].id,
              name: response.data[index].code + ' ' + response.data[index].name,
            });
          }
        })
        .catch(e => console.log(e));
    },
    getProductGroups() {
      this.info = [];
      axios.get(`${this.api}/productGroups/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          for (let index = 0; index < response.data.length; index++) {
            this.info.push({
              id: response.data[index].id,
              name: response.data[index].name,
              list: []
            });
          }
          this.productGroupOption = response.data;
          this.getProductTemplates();
        })
        .catch(e => console.log(e))
        .finally(() => { this.loading = false; });
    },
    getProductTemplates() {
      axios.get(`${this.api}/productTemplates/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          for (let index = 0; index < response.data.length; index++) {
            this.info.find(item => {
              if(item.id == response.data[index].group) {
                item.list.push(response.data[index]);
              }
            });
          }
          for (let i = 0; i < this.info.length; i++) {
            for (let t = 0; t < this.info[i].list.length; t++) {
              this.productTemplatesColorOption.find(item => {
                if(item.id == this.info[i].list[t].color) {
                  this.info[i].list[t].colorName = item.name;
                }
              });
            }
          }
          // this.info = response.data;
        })
        .catch(e => console.log(e))
        .finally(()=> {
          this.loading = false;
        });
    },
    addProductGroup() {
      this.$v.$touch()
      if (this.$v.productGroupName.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.post(`${this.api}/productGroups/`, {
            "name": this.productGroupName
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Добавленно');
              this.getProductGroups();
            } else {
              this.$toast.error(response.data.msg);
            }
          })
          .catch(e => console.log(e))
          .finally(()=> {
            this.closeModalAdd();
            this.loading = false;
          });
      }
    },
    addProductTemplates() {
      this.$v.$touch()
      if (this.$v.productTemplatesCode.$invalid || this.$v.productTemplatesName.$invalid || this.$v.productGroupValue.$invalid || this.$v.productTemplatesColorValue.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.post(`${this.api}/productTemplates/`, {
            "code": this.productTemplatesCode,
            "name": this.productTemplatesName,
            "group": this.productGroupValue.id,
            "color": this.productTemplatesColorValue.id
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Добавленно');
              this.getProductGroups();
            } else {
              this.$toast.error(response.data.msg);
            }
          })
          .catch(e => console.log(e))
          .finally(()=> {
            this.closeModalAdd();
            this.loading = false;
          });
      }
    },
    editProductGroup() {
      this.$v.$touch()
      if (this.$v.productGroupName.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.put(`${this.api}/productGroups/${this.productGroupId}/`, {
            "name": this.productGroupName
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Изменено');
              this.getProductGroups();
            } else {
              this.$toast.error(response.data.msg);
            }
          })
          .catch(e => console.log(e))
          .finally(()=> {
            this.closeModalAdd();
            this.loading = false;
          });
      }
    },
    editProductTemplates() {
      this.$v.$touch()
      if (this.$v.productTemplatesCode.$invalid || this.$v.productTemplatesName.$invalid || this.$v.productGroupValue.$invalid || this.$v.productTemplatesColorValue.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.put(`${this.api}/productTemplates/${this.productTemplatesId}/`, {
            "code": this.productTemplatesCode,
            "name": this.productTemplatesName,
            "group": this.productGroupValue.id,
            "color": this.productTemplatesColorValue.id
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Добавленно');
              this.getProductGroups();
            } else {
              this.$toast.error(response.data.msg);
            }
          })
          .catch(e => console.log(e))
          .finally(()=> {
            this.closeModalAdd();
            this.loading = false;
          });
      }
    },
    delProductGroup() {
      this.loading = true;
      axios.delete(`${this.api}/productGroup-delete/${this.productGroupId}/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          if(response.data.code == 1) {
            this.$toast.success('Удаленно');
            this.getProductGroups();
          } else {
            this.$toast.error(response.data.msg);
          }
        })
        .catch(e => console.log(e))
        .finally(()=> {
          this.closeModalAdd();
          this.loading = false;
        });
    },
    delProductTemplates() {
      this.loading = true;
      axios.delete(`${this.api}/productTemplate-delete/${this.productTemplatesId}/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          if(response.data.code == 1) {
            this.$toast.success('Удаленно');
            this.getProductGroups();
          } else {
            this.$toast.error(response.data.msg);
          }
        })
        .catch(e => console.log(e))
        .finally(()=> {
          this.closeModalAdd();
          this.loading = false;
        });
    },
    openModalAdd() {
      this.modalAdd = true;
    },
    openModalDeleteGroup(id) {
      this.productGroupId = id;
      this.modalDeleteGroup = true;
    },
    openModalDelete(id) {
      this.productTemplatesId = id;
      this.modalDelete = true;
    },
    closeModalAdd() {
      this.modalAdd = false;
      this.modalDeleteGroup = false;
      this.modalDelete = false;
      this.btnChange = false;
      this.text = true;
      this.madalParams = 1;
      this.productGroupId = '';
      this.productGroupName = '';
      this.productTemplatesCode = '';
      this.productTemplatesName = '';
      this.productGroupValue = '';
      this.productTemplatesColorValue = '';
      this.$v.$reset();
    },
    changeModalAdd(param, item) {
      // console.log(item);
      this.modalAdd = true;
      this.btnChange = true;
      this.text = false;
      if(param == 1) {
        this.madalParams = 1;
        this.productGroupId = item.id;
        this.productGroupName = item.name;
      } else {
        this.madalParams = 2;
        this.productTemplatesId = item.id;
        this.productTemplatesCode = item.code;
        this.productTemplatesName = item.name;
        this.productGroupValue = this.productGroupOption.find(i => {
          if(i.id == item.group) {
            return i
          }
        });
        this.productTemplatesColorValue = this.productTemplatesColorOption.find(i => {
          if(i.id == item.color) {
            return i
          }
        });
      }
    },
    collapseToggle(id) {
      if(this.collapseActive == id) {
        this.collapseActive = 0
      } else {
        this.collapseActive = id;
      }
    },
  },
  validations: {
    productGroupName: {
      required
    },
    productTemplatesName: {
      required
    },
    productGroupValue: {
      required
    },
    productTemplatesCode: {
      required
    },
    productTemplatesColorValue: {
      required
    },
  }
}
</script>

<style lang="scss" scoped>
.models {
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
  .card {
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid transparent;
    border-radius: 0.25rem;
    box-shadow: 0 0.3rem 0.8rem rgba(0,0,0,0.12);
    padding: 1rem;
    overflow: scroll hidden;
  }
  .clps-menu {
    min-width: 500px;
    .clps {
      padding: 5px;
      &__button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: "Roboto";
        font-size: 20px;
        font-weight: 400;
        background: rgba($color: #002f34, $alpha: 0.3);
        padding: 5px 20px;
        cursor: pointer;
        .btns {
          width: 100px;
          display: flex;
          justify-content: space-between;
        }
        p {
          font-family: "Roboto";
          font-size: 20px;
          font-weight: 400;
          color: #002f34;
        }
      }
      .list {
        // height: 0;
        position: relative;
        &::before {
          content: "";
          width: 3px;
          height: 100%;
          background: rgba($color: #002f34, $alpha: 0.85);
          position: absolute;
          top: 0;
          left: 20px;
          @media screen and (max-width: 991.5px) {
            left: 10px;
          }
        }
        .custom-table {
          margin-left: 50px;
          margin-right: 200px;
          margin-bottom: 1px;
          @media screen and (max-width: 991.5px) {
            margin-left: 25px;
            margin-right: 0px;
          }
          &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.12);
            padding: 5px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            p {
              font-weight: 600 !important;
            }
          }
          &__body {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(41, 115, 65, 0.1);
            padding: 5px 15px;
            position: relative;
            margin-bottom: 2px;
            transition: 0.3s all ease-in-out;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            &::before {
              content: "";
              width: 28px;
              height: 3px;
              background: rgba($color: #002f34, $alpha: 0.85);
              position: absolute;
              top: 50%;
              left: -28px;
              transform: translateY(-50%);
              @media screen and (max-width: 991.5px) {
                width: 15px;
                top: 50%;
                left: -15px;
              }
            }
            &:hover {
              background: rgba($color: #002f34, $alpha: 0.04);
            }
          }
          p {
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: "Roboto";
            font-size: 18px;
            font-weight: 400;
            color: rgba($color: #002f34, $alpha: 0.85);
          }
          .btns {
            display: flex;
            justify-content: space-between;
            .btn {
              padding: 0.2rem 0.5rem;
            }
          }
          .w-1 {
            width: 5%;
          }
          .w-2 {
            width: 25%;
          }
          .w-3 {
            width: 36%;
          }
          .w-4 {
            width: 25%;
          }
          .w-5 {
            width: 200px;
          }
        }
      }
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
      color: #1d9d74;
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
      border-bottom: 2px solid #002f34;
      p {
        width: 60%;
        font-family: 'Roboto';
        font-size: 20px;
        font-weight: 400;
        padding: 5px 16px;
        color: rgb(129, 129, 129);
        text-align: center;
        transition: 0.3s all ease-in-out;
        cursor: pointer;
        @media screen and (max-width: 575.5px) {
          font-size: 18px;
        }
        &:hover {
          color: #000;
          background: rgb(230, 230, 230);
        }
        &:nth-child(2) {
          width: 40%;
        }
      }
      .active {
        color: #fff;
        background: #002f34;
        &:hover {
          color: #fff;
          background: #002f34;
        }
      }
    }
    .form {
      width: 400px;
      display: flex;
      flex-direction: column;
      margin-top: 15px;
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
      @media screen and (max-width: 575.5px) {
        width: 290px;
      }
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
  .selects,
  .number {
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