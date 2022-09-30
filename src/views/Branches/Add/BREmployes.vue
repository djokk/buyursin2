<template>
  <div class="matter">
    <div class="breadcrumb p-0">
      <router-link :to="{name: 'BRDashboard'}" class="breadcrumb__link"><i class="bx bx-home-alt"></i></router-link>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <router-link :to="{name: 'BRAdd'}" class="breadcrumb__link"><i class="bx bxs-layer-plus"></i></router-link>
      </div>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <p>{{ 'employes' }}</p>
      </div>
    </div>
    <div class="wrapper">
      <div class="card">
        <ul class="clps-menu">
          <li v-for="item in info" :key="item.id" class="clps-menu__item clps">
            <div v-if="item.branchType == 1" class="clps__item">
              <div @click="collapseToggle(1, item.id)" class="clps__button">
                <p class="d-flex align-items-center">{{ item.name }} <i class='ml-1 bx ' :class="[collapseActive == item.id ? 'bxs-down-arrow' : 'bxs-right-arrow']"></i></p>
              </div>
              <Transition duration="350" name="nested">
              <div v-if="collapseActive == item.id" class="clps__list pt-2">
                <ul v-if="item.list.length != 0" class="clps-menu-down">
                  <li v-for="itemDown in item.list" :key="itemDown.id" class="clps-menu-down__item clps-down">
                    <div @click="collapseToggle(2, itemDown.id)" class="clps-down__button">
                      <p class="d-flex align-items-center">{{ itemDown.name }} <i class='ml-1 bx ' :class="[collapseDownActive == itemDown.id ? 'bxs-down-arrow' : 'bxs-right-arrow']"></i></p>
                    </div>
                    <Transition duration="350" name="nested">
                    <div v-if="collapseDownActive == itemDown.id" class="clps-down__list list pt-2">
                      <div class="custom-table-down">
                        <div v-if="item.list.length != 0" class="custom-table-down__header">
                          <p class="w-1">№</p>
                          <p class="w-2">ФИО</p>
                          <p class="w-3">Работа</p>
                          <p class="w-4"></p>
                        </div>
                        <div v-else class="custom-table-down__header">
                          <p>Пусто</p>
                        </div>
                        <div v-for="(itemDownItem,index) in itemDown.listItem" :key="itemDownItem.id" class="custom-table-down__body pt-2">
                          <p class="w-1">{{ index + 1 }}</p>
                          <p class="w-2">{{ itemDownItem.name }}</p>
                          <p class="w-3">{{ itemDownItem.jobTitle }}</p>
                          <div class="w-4 btns">
                            <button @click="changeModalAdd(itemDownItem)" type="button" class="btn btn-warning"><i class='bx bx-edit'></i></button>
                            <button @click="openModalDel(itemDownItem.id)" class="btn btn-danger"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </Transition>
                  </li>
                </ul>
                <div v-else-if="item.list.length == 0" class="clps-menu-down__header">
                  <p>Пусто</p>
                </div>
              </div>
              </Transition>
            </div>
            <div v-else class="clps__item">
              <div @click="collapseToggle(1, item.id)" class="clps__button">
                <p class="d-flex align-items-center">{{ item.name }} <i class='ml-1 bx ' :class="[collapseActive == item.id ? 'bxs-down-arrow' : 'bxs-right-arrow']"></i></p>
              </div>
              <Transition duration="350" name="nested">
              <div v-if="collapseActive == item.id" class="clps__list list">
                <div class="custom-table">
                  <div v-if="item.list.length != 0" class="custom-table__header">
                    <p class="w-1">№</p>
                    <p class="w-2">Название</p>
                    <p class="w-3">Работа</p>
                    <p class="w-4"></p>
                  </div>
                  <div v-else-if="item.list.length == 0" class="custom-table__header">
                    <p>Пусто</p>
                  </div>
                  <div v-for="(itemList,index) in item.list" :key="itemList.Id" class="custom-table__body">
                    <p class="w-1">{{ index + 1}}</p>
                    <p class="w-2">{{ itemList.name }}</p>
                    <p class="w-3">{{ itemList.jobTitle }}</p>
                    <div class="btns w-4">
                      <button @click="changeModalAdd(itemList)" type="button" class="btn btn-warning"><i class='bx bx-edit'></i></button>
                      <button @click="openModalDel(itemList.id)" type="button" class="btn btn-danger"><i class='bx bxs-trash'></i></button>
                    </div>
                  </div>
                </div>
              </div>
              </Transition>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div @click="openModalAdd()" class="btn-add">
      <i class="fa fa-plus-circle" aria-hidden="true"></i>
    </div>
    <div v-if="modalAdd" class="modal-add">
      <form class="form" action="">
        <div class="name">
          <span>{{ $t('name') }}</span>
          <input v-model="employesName" :class="$v.employesName.$error ? 'is-invalid': ''" class="input" type="text">
        </div>
        <div class="name">
          <span>{{ $t('job') }}</span>
          <input v-model="employesJobTitle" :class="$v.employesJobTitle.$error ? 'is-invalid': ''" class="input" type="text">
        </div>
        <div class="selects">
          <span>{{ $t('branch') }}</span>
          <multiselect v-model="branchValue" :class="$v.branchValue.$error ? 'is-invalid': ''" placeholder="" label="name" track-by="id" :options="branchOptions" :multiple="false" :taggable="false" :searchable="false"></multiselect>
        </div>
        <div v-if="department" class="selects">
          <span>{{ $t('groups') }}</span>
          <multiselect v-model="departmentValue" placeholder="" label="name" track-by="id" :options="departmentOptions" :multiple="false" :taggable="false" :searchable="false"></multiselect>
        </div>
        <div class="btns">
          <button v-if="btnChange != true" @click.prevent="addEmployes()" class="btn btn-success" type="button">{{ $t('add') }}</button>
          <button v-else-if="btnChange == true" @click.prevent="editEmployes()" class="btn btn-warning" type="button">{{ $t('change') }}</button>
          <button @click="closeModalAdd()" class="btn btn-outline-danger" type="button">{{ $t('cancel') }}</button>
        </div>
      </form>
    </div>
    <div v-if="modalDelete" class="modal-delete">
      <form @submit.prevent="delEmploye()" class="form" action="">
        <p>Вы уверенны что хотите удалить ?</p>
        <div class="btns">
          <button class="btn btn-success" type="submit">ДА</button>
          <button @click="modalDelete = !modalDelete" class="btn btn-outline-danger" type="button">НЕТ</button>
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
  name: 'Employes',
  data() {
    return {
      loading: false,
      info: [],
      collapseActive: 0,
      collapseDownActive: 0,
      modalAdd: false,
      modalDelete: false,
      madalParams: 1,
      btnChange: false,
      text: true,
      employesId: '',
      employesName: '',
      employesJobTitle: '',
      branchValue: '',
      branchOptions: [],
      branchType: [
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
      department: false,
      departmentValue: '',
      departmentOptions: [],
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
    this.getBranchesGroups();
  },
  methods: {
    getBranchesGroups() {
      this.info = [];
      this.branchOptions = [];
      axios.get(`${this.api}/branches/`, 
        {
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
            });
            this.branchOptions.push(response.data[index]);
          }
          this.getGropus();
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
    getGropus() {
      this.departmentOptions = [];
      for (let index = 0; index < this.info.length; index++) {
        if(this.info[index].branchType == 1) {
          axios.get(`${this.api}/departments/?branch=${this.info[index].id}`, 
            {
              headers: {
                'Authorization': `Token ${this.token}`
              }
            })
            .then(response => {
              // console.log(response.data);
              // const info = response.data;
              if(response.data != []) {
                for (let i = 0; i < response.data.length; i++) {
                  this.info[index].list.push({
                    id: response.data[i].id,
                    branch: response.data[i].branch,
                    name: response.data[i].name,
                    listItem: []
                  });
                  this.departmentOptions.push(response.data[i]);
                }
              }
            })
            .catch(error => {
              console.log(error);
              if(error.response.status == 401) {
                this.$toast.error(error.response.data.detail);
              }
            });
        } else {
          // console.log('1');
          axios.get(`${this.api}/employes/?branch=${this.info[index].id}`, 
            {
              headers: {
                'Authorization': `Token ${this.token}`
              }
            })
            .then(response => {
              if(response.data != []) {
                for (let i = 0; i < response.data.length; i++) {
                  this.info[index].list.push(response.data[i]);
                }
              }
            })
            .catch(error => {
              console.log(error);
              if(error.response.status == 401) {
                this.$toast.error(error.response.data.detail);
              }
            });
        }
        if(index == this.info.length - 1) {
          setTimeout(() => {
            this.getDepartment();
            
          }, 3000);
        }
      }
    },
    getDepartment() {
      for (let index = 0; index < this.info.length; index++) {
        if(this.info[index].branchType == 1) {
          for (let i = 0; i < this.info[index].list.length; i++) {
            axios.get(`${this.api}/employes/?department=${this.info[index].list[i].id}`, 
              {
                headers: {
                  'Authorization': `Token ${this.token}`
                }
              })
              .then(response => {
                // console.log(response.data);
                // const info = response.data;
                if(response.data != []) {
                  for (let t = 0; t < response.data.length; t++) {
                    // console.log('2');
                    this.info[index].list[i].listItem.push(response.data[t]);
                  }
                }
              })
              .catch(error => {
                console.log(error);
                if(error.response.status == 401) {
                  this.$toast.error(error.response.data.detail);
                }
              });
          }
        }
      }
      setTimeout(() => {
        this.loading = false;
      }, 3000);
    },
    collapseToggle(params, id) {
      switch (params) {
        case 1:
          if(this.collapseActive == id) {
            this.collapseActive = 0
          } else {
            this.collapseActive = id;
          }
          break;
        case 2:
          if(this.collapseDownActive == id) {
            this.collapseDownActive = 0
          } else {
            this.collapseDownActive = id;
          }
          break;
      }
    },
    addEmployes() {
      this.$v.$touch()
      if (this.$v.employesName.$invalid || this.$v.branchValue.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.post(`${this.api}/employes/`, {
            "name": this.employesName,
            "jobTitle": this.employesJobTitle,
            "branch": this.branchValue.id,
            // "department": this.departmentValue == '' ? this.departmentValue.id : null
            "department": this.departmentValue.id || null
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Добавленно');
              this.getBranchesGroups();
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
    editEmployes() {
      this.$v.$touch()
      if (this.$v.employesName.$invalid || this.$v.branchValue.$invalid) {
        this.$toast.open({
          message: 'Ввидите данные правильно',
          type: "error"
        })
      } else {
        this.loading = true;
        axios.put(`${this.api}/employes/${this.employesId}/`, {
            "name": this.employesName,
            "jobTitle": this.employesJobTitle,
            "branch": this.branchValue.id,
            "department": this.departmentValue.id || null
            // "department": this.departmentValue == '' ? this.departmentValue.id : null
          }, 
          {
            headers: {
              'Authorization': `Token ${this.token}`
            }
          })
          .then(response => {
            if(response.data.code == 1) {
              this.$toast.success('Изменнено');
              this.getBranchesGroups();
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
    delEmploye() {
      this.loading = true;
      axios.delete(`${this.api}/employe-delete/${this.employesId}/`, 
        {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          if(response.data.code == 1) {
            this.$toast.success('Удаленно');
            this.getBranchesGroups();
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
    openModalDel(id) {
      this.employesId = id;
      this.modalDelete = true;
    },
    openModalAdd() {
      this.modalAdd = true;
    },
    closeModalAdd() {
      this.modalAdd = false;
      this.modalDelete = false;
      this.btnChange = false;
      this.employesId = '';
      this.employesName = '';
      this.branchValue = '';
      this.employesJobTitle = '';
      this.departmentValue = [];
      this.department = false;
      this.$v.$reset();
    },
    changeModalAdd(info) {
      // console.log(item);
      this.modalAdd = true;
      this.btnChange = true;
      this.text = false;
      this.employesId = info.id;
      this.employesName = info.name;
      this.employesJobTitle = info.jobTitle;
      this.branchValue = this.branchOptions.find(items => {
        if(items.id == info.branch) {
          return items
        }
      });
      // console.log(this.branchValue);
      const departmentInfo = this.departmentOptions.find(items => {
        if(items.id == info.department) {
          return items
        }
      });
      console.log(departmentInfo);
      // for (let index = 0; index < array.length; index++) {
      //   const element = array[index];
        
      // }
      // const info = this.info.find(items => {
      //   if(items.id == item.department) {
      //     return items
      //   }
      // });
      // console.log(info);
      this.departmentValue = departmentInfo;
    },
  },
  watch: {
    branchValue() {
      setTimeout(() => {
        if(this.branchValue.branchType == 1) {
          // const info = this.info.find(items => {
          //   if(items.id == this.branchValue.id) {
          //     return items.list
          //   }
          // });
          // this.departmentOptions = info.list;
          this.department = true;
        } else {
          this.department = false;
        }
      }, 500);
    }
  },
  validations: {
    employesName: {
      required
    },
    employesJobTitle: {
      required
    },
    branchValue: {
      required
    }
  }
}
</script>

<style lang="scss" scoped>
.matter {
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
  .card {
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid transparent;
    border-radius: 0.25rem;
    box-shadow: 0 0.3rem 0.8rem rgba(0,0,0,0.12);
    padding: 1rem;
    overflow: scroll hidden;
    // position: relative;
    // display: flex;
    // flex-direction: column;
    // min-width: 0;
    // word-wrap: break-word;
    // background-color: rgba(0,0,0,0.15);
    // background-clip: border-box;
    // border: 0 solid transparent;
    // border-radius: 0.25rem;
    // margin-bottom: 4.5rem;
    // box-shadow: 0 0.3rem 0.8rem rgba(0,0,0,0.12);
    // padding: 1rem;
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
      &__list {
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
      }
      .custom-table {
        margin-left: 50px;
        margin-right: 100px;
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
        &__body-down {
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
          &-header {
            background: rgba(41, 115, 65, 0.1);
            padding: 5px 15px;
            position: relative;
            margin-bottom: 2px;
            transition: 0.3s all ease-in-out;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          }
          &-body {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(41, 115, 65, 0.1);
            margin-left: 30px;
            margin-right: 100px;
            margin-bottom: 1px;
            position: relative;
            @media screen and (max-width: 991.5px) {
              margin-left: 25px;
              margin-right: 0px;
            }
            &::before {
              content: "";
              width: 3px;
              height: 100%;
              background: rgba($color: #002f34, $alpha: 0.85);
              position: absolute;
              top: 0;
              left: -10px;
              // @media screen and (max-width: 991.5px) {
              //   left: -10px;
              // }
            }
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
          width: 50%;
        }
        .w-3 {
          width: 36%;
        }
        .w-4 {
          width: 80px;
        }
      }
    }
  }
  .clps-menu-down {
    // min-width: 500px;
    margin-left: 50px;
    margin-right: 100px;
    margin-bottom: 1px;
    // position: relative;
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
      margin-left: 50px;
      margin-right: 100px;
      margin-bottom: 1px;
      p {
        font-family: "Roboto";
        font-size: 18px;
        font-weight: 400;
        color: rgba(0, 47, 52, 0.85);
        font-weight: 600 !important;
      }
    }
    .clps-down {
      // padding: 5px;
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
        position: relative;
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
      &__list {
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
      }
      .custom-table-down {
        margin-left: 50px;
        margin-right: 100px;
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
        &__body-down {
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
          &-header {
            background: rgba(41, 115, 65, 0.1);
            padding: 5px 15px;
            position: relative;
            margin-bottom: 2px;
            transition: 0.3s all ease-in-out;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          }
          &-body {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(41, 115, 65, 0.1);
            margin-left: 30px;
            margin-right: 100px;
            margin-bottom: 1px;
            position: relative;
            @media screen and (max-width: 991.5px) {
              margin-left: 25px;
              margin-right: 0px;
            }
            &::before {
              content: "";
              width: 3px;
              height: 100%;
              background: rgba($color: #002f34, $alpha: 0.85);
              position: absolute;
              top: 0;
              left: -10px;
              // @media screen and (max-width: 991.5px) {
              //   left: -10px;
              // }
            }
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
          width: 50%;
        }
        .w-3 {
          width: 36%;
        }
        .w-4 {
          width: 80px;
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
  .number,
  .databasePassword,
  .search {
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