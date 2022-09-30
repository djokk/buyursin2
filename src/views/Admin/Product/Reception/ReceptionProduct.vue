<template>
  <div class="modelsItem">
    <div class="breadcrumb p-0">
      <router-link :to="{name: 'Dashboard'}" class="breadcrumb__link"><i class="bx bx-home-alt"></i></router-link>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <router-link :to="{name: 'Models'}" class="breadcrumb__link"><i class='bx bx-folder'></i></router-link>
      </div>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <p>{{ $route.params.productName }}</p>
      </div>
    </div>
    <div class="wrapper">
      <div class="card-custom">
        <div class="table-custom">
          <div class="table-custom__header">
            <p class="w-1">№</p>
            <p class="w-2">{{ $t('name') }}</p>
            <p class="w-3">{{ $t('count') }}</p>
            <p class="w-4"></p>
          </div>
          <div class="table-custom__body">
            <div v-for="(item,index) in info" :key="item.id" class="table-custom__body-item">
              <p class="w-1">{{ index + 1 }}</p>
              <p class="w-2">{{ item.itemName }}</p>
              <p class="w-3">{{ item.count }} {{ item.itemUnit }}</p>
              <div class="w-4 btns">
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
      <form @submit.prevent="delComponent()" class="form" action="">
        <p>{{ $t('textDelete') }}</p>
        <div class="btns">
          <button class="btn btn-success" type="submit">{{ $t('yes')}}</button>
          <button @click="closeModalAdd()" class="btn btn-outline-danger" type="button">{{ $t('not')}}</button>
        </div>
      </form>
    </div>
    <div v-if="modalAdd" class="modal-add">
      <form class="form" action="">
        <div class="selects">
          <multiselect v-model="metterGroupValue" :class="$v.metterGroupValue.$error ? 'is-invalid': ''" placeholder="" label="name" track-by="code" :options="metterGroupOption" :multiple="false" :taggable="false" :searchable="false"></multiselect>
          <span>{{ $t('groupMatter') }}</span>
        </div>
        <div class="selects">
          <multiselect v-model="metterValue" :class="$v.metterValue.$error ? 'is-invalid': ''" placeholder="" label="name" track-by="code" :options="metterOption" :multiple="false" :taggable="false" :searchable="false"></multiselect>
          <span>{{ $t('matter') }}</span>
        </div>
        <div class="name count">
          <div class="position-relative">
            <input id="count" v-model="count" :class="$v.count.$error ? 'is-invalid': ''" class="input" type="number" autocomplete="off">
            <p>{{ unit != '' ? unit.name : '' }}</p>
          </div>
          <span>{{ $t('count') }}</span>
        </div>
        <div class="btns">
          <button v-if="btnChange != true" @click.prevent="addComponents()" class="btn btn-success" type="button">{{ $t('add') }}</button>
          <button v-else-if="btnChange == true" @click.prevent="editComponents()" class="btn btn-warning" type="button">{{ $t('change') }}</button>
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
  name: 'ModelsItem',
  data() {
    return {
      loading: false,
      modalAdd: false,
      modalDelete: false,
      btnChange: false,
      info: [],
      metter: [],
      units: [],
      unit: '',
      metterGroupValue: '',
      metterGroupOption: [],
      metterValue: '',
      metterOption: [],
      metterAll: [],
      count: '',
      castelmetterValue: false,
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
    this.getComponents();
    this.getMetterGroups();
  },
  methods: {
    getComponents() {
      this.info = [];
      axios.get(`${this.api}/components/?productTemplate=${this.$route.params.id}`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          this.info = response.data;
        })
        .catch(e => console.log(e))
        .finally(()=> {
          this.loading = false;
        });
    },
    getMetterGroups() {
      // this.info = [];
      this.metterGroupOption = [];
      axios.get(`${this.api}/itemgroups/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          // this.userGroup = response.data;
          for(let i = 0; i < response.data.length; i++) {
            const list = {
              'id': response.data[i].id,
              'name': response.data[i].name,
              'list': []
            }
            this.metter.push(list);
          }
          for (let index = 0; index < response.data.length; index++) {
            const element = {
              code: response.data[index].id,
              name: response.data[index].name
            }
            this.metterGroupOption.push(element)
          }
          this.getMetter();
        })
        .catch(e => console.log(e))
        .finally(() => { this.loading = false; });
    },
    getMetter() {
      axios.get(`${this.api}/itemTemplates/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          // console.log(response.data);
          for (let i = 0; i < this.metter.length; i++) {
            for(let t = 0; t < response.data.length; t++) {
              if(this.metter[i].id == response.data[t].group) {
                this.metter[i].list.push(response.data[t]);
              }
            }
          }
          this.metterAll = response.data;
          this.getUnits();
        })
        .catch(e => console.log(e));
    },
    getUnits() {
      axios.get(`${this.api}/units/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(responce => {
          this.units = responce.data;
        })
        .catch(e => console.log(e));
    },
    addComponents() {
      this.$v.$touch()
      if(this.$v.metterGroupValue.$invalid || this.$v.metterValue.$invalid || this.$v.count.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.post(`${this.api}/components/`, {
            "productTemplate": this.metterGroupValue.code,
            "itemTemplate": this.metterValue.id,
            "count": this.count
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Добавленно');
              this.getComponents();
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
    editComponents() {
      this.$v.$touch()
      if(this.$v.metterGroupValue.$invalid || this.$v.metterValue.$invalid || this.$v.count.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.put(`${this.api}/components/${this.componentId}/`, {
            "productTemplate": this.$route.params.id,
            "itemTemplate": this.metterValue.id,
            "count": this.count
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Изменнено');
              this.getComponents();
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
    delComponent() {
      this.loading = true;
      axios.delete(`${this.api}/component-delete/${this.componentId}/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          if(response.data.code == 1) {
            this.$toast.success('Удаленно');
            this.getComponents();
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
    openModalDel(id) {
      this.componentId = id;
      this.modalDelete = true;
    },
    openModalAdd() {
      this.modalAdd = true;
    },
    closeModalAdd() {
      this.modalAdd = false;
      this.modalDelete = false;
      this.btnChange = false;
      this.componentId = '';
      this.metterGroupValue = '';
      this.metterValue = '';
      this.count = '';
      this.unit = '';
      this.$v.$reset();
    },
    changeModalAdd(info) {
      // console.log(info);
      this.modalAdd = true;
      this.btnChange = true;
      this.text = false;
      this.componentId = info.id;
      this.count = info.count;
      this.castelmetterValue = true;
      this.metterValue = this.metterAll.find(items => {
        if(items.id == info.itemTemplate) {
          return items
        }
      });
      this.metterGroupValue = this.metterGroupOption.find(items => {
        if(items.code == this.metterValue.group) {
          return items
        }
      });
    },
  },
  watch: {
    metterGroupValue() {
      this.metterOption = [];
      // if(this.btnChange == false) {
        // }
      if(this.metterGroupValue != '') {
        const metter = this.metter.find(item => {
          if(item.id == this.metterGroupValue.code) {
            return item
          }
        });
        this.metterOption = metter.list;
        if(this.castelmetterValue == false) {
          this.metterValue = '';
        } else {
          this.castelmetterValue = false;
        }
        // setTimeout(() => {
        //   this.metterOption.find(item => {
        //     if(item.id != this.metterValue.id) {
        //       this.metterValue = '';
        //     }
        //   });
          
        // }, 1000);
      }
    },
    metterValue() {
      if(this.metterValue != '') {
        this.unit = this.units.find(item => {
          if(item.id == this.metterValue.unit) {
            return item
          }
        });
      }
    },
    // count() {
    //   const x = document.getElementById('count').value + ' ' + this.unit.name
    //   console.log(x);
    // }
  },
  validations: {
    metterGroupValue: {
      required
    },
    metterValue: {
      required
    },
    count: {
      required
    },
  },
}
</script>

<style lang="scss" scoped>
.modelsItem {
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
      width: 10%;
      // @media screen and (max-width: 767.5px) {
      //   width: 30%;
      // }
    }
    .w-2 {
      width: 50%;
      @media screen and (max-width: 575.5px) {
        width: 40%;
      }
      // @media screen and (max-width: 767.5px) {
      //   width: 60%;
      // }
    }
    .w-3 {
      width: 40%;
      @media screen and (max-width: 575.5px) {
        width: 30%;
      }
    }
    .w-4 {
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
      .count {
        margin-bottom: 12px;
        .input {
          padding-right: 4em;
          margin-bottom: 0;
        }
        p {
          font-family: 'Roboto';
          font-size: 20px;
          font-weight: 400;
          color: #5A5A5A;
          position: absolute;
          right: 18px;
          top: calc(50% - 16px);
          transform: translateY(calc(50% - 16px));
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
}

</style>