<template>
  <section class="brPay">
    <div class="breadcrumb p-0">
      <router-link :to="{name: 'Dashboard'}" class="breadcrumb__link"><i class="bx bx-home-alt"></i></router-link>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <p>{{ $t('Зарплата') }}</p>
      </div>
    </div>
    <div class="wrapper">
      <div class="card">
        <ul class="clps-menu">
          <li v-for="item in info" :key="item.employeId" class="clps-menu__item clps">
            <div @click="collapseToggle(item.employeId)" class="clps__button">
              <p class="d-flex align-items-center"><i class='ml-1 bx ' :class="[collapseActive == item.employeId ? 'bxs-down-arrow' : 'bxs-right-arrow']"></i> {{ item.employeName }}</p>
              <div class="btns">
                <!-- <button @click="changeModalAdd(1, item)" type="button" class="btn btn-warning"><i class='bx bx-edit'></i></button> -->
              </div>
            </div>
            <Transition duration="350" name="nested">
              <div v-if="collapseActive == item.employeId" class="clps__list list">
                <div class="custom-table">
                  <div v-if="item.works.length != 0" class="custom-table__body-head">
                    <p>{{ $t('Зар. плата') }}</p>
                  </div>
                  <div v-if="item.works.length != 0" class="custom-table__header">
                    <p class="w-1">№</p>
                    <p class="w-2">{{ $t('Дата') }}</p>
                    <p class="w-3">{{ $t('Наз. Работ.') }}</p>
                    <p class="w-4">{{ $t('Количество') }}</p>
                    <p class="w-5">{{ $t('Ст. за ед.') }}</p>
                    <p class="w-6">{{ $t('ЗП') }}</p>
                  </div>
                  <div v-else class="custom-table__header">
                    <p>Пусто</p>
                  </div>
                  <div v-for="(itemList,index) in item.works" :key="itemList.index" class="custom-table__body">
                    <p class="w-1">{{ index + 1}}</p>
                    <p class="w-2">{{ itemList.date }}</p>
                    <p class="w-3">{{ itemList.work_name }}</p>
                    <p class="w-4">{{ itemList.count }}</p>
                    <p class="w-5">{{ itemList.pricePerOne }}</p>
                    <p class="w-6">{{ itemList.price }}</p>
                  </div>
                  <div v-if="item.penalties.length != 0" class="custom-table__body-head">
                    <p>Штрафы</p>
                  </div>
                  <div v-for="(itemPenalties,index) in item.penalties" :key="itemPenalties.index" class="custom-table__body">
                    <p class="w-1">{{ index + 1}}</p>
                    <p class="w-2">{{ itemPenalties.date }}</p>
                    <p class="w-3">{{ itemPenalties.penaltyName }}</p>
                    <p class="w-4"></p>
                    <p class="w-5"></p>
                    <p class="w-6">-{{ itemPenalties.price }}</p>
                  </div>
                  <div v-if="item.to_paid != 0" class="custom-table__body-total">
                    <p>{{ $t('Общий ЗП') }}: </p>
                    <p class="w-6">{{ item.to_paid }}</p>
                  </div>
                  <div v-if="item.to_subtract != 0" class="custom-table__body-total">
                    <p>{{ $t('Общий Штраф') }}: </p>
                    <p class="w-6">-{{ item.to_subtract }}</p>
                  </div>
                  <div v-if="item.total_to_paid != 0" class="custom-table__body-total">
                    <p>{{ $t('ИТОГО') }}: </p>
                    <p class="w-6">{{ item.total_to_paid }}</p>
                  </div>
                  <div v-if="item.total_to_paid != 0" class="custom-table__body-total">
                    <button @click="openModalDeleteGroup(item.employeId)" type="button" class="w-6 btn btn-success">{{ $t('Оплатить') }}</button>
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
    <div v-if="modalDelete" class="modal-delete">
      <form @submit.prevent="delDesignPage()" class="form" action="">
        <p>{{ $t('textDelete') }}</p>
        <div class="btns">
          <button class="btn btn-success" type="submit">{{ $t('yes')}}</button>
          <button @click="modalDelete = !modalDelete" class="btn btn-outline-danger" type="button">{{ $t('not')}}</button>
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
  name: 'BRPay',
  data() {
    return {
      colorId: '',
      loading: false,
      modalDelete: false,
      modalAdd: false,
      collapseActive: 0,
      info: [],
      api: '',
      token: ''
    }
  },
  components: {
    Loading
  },
  beforeMount() {
    this.api = window.MY_CONFIG_BUYURSIN.api;
  },
  mounted() {
    this.token = sessionStorage.getItem('token');
    this.loading = true;
    this.salary();
    // this.getProductGroups();
  },
  methods: {    
    openModalDel(id) {
      this.colorId = id;
      this.modalDelete = true;
    },
    salary() {
      this.productTemplatesColorOption = [];
      axios.get(`${this.api}/salary/`, {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        })
        .then(response => {
          this.info = response.data;
        })
        .catch(e => console.log(e))
        .finally(() => {
          this.loading = false;
        });
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
.brPay {
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
    margin-bottom: 100px;
  }
  .clps-menu {
    min-width: 1000px;
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
          // width: 100px;
          display: flex;
          justify-content: space-between;
          .btn {
            display: flex;
            align-items: center;
            .bx {
              margin-right: 5px;
            }
          }
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
            &-head {
              padding: 5px 15px;
              p {
                justify-content: flex-start !important;
              }
            }
            &-total {
              display: flex;
              justify-content: flex-end;
              align-items: flex-end;
              padding: 5px 15px;
              background: rgba($color: #002f34, $alpha: 0.2);
              // .w-6 {
              //   // justify-content: flex-end !important;
              //   // align-items: flex-end !important;
              //   // color: green;
              //   width: 20% !important;
              // }
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
              // display: flex;
              padding: 0.2rem 0.5rem;
            }
          }
          .w-1 {
            width: 5%;
          }
          .w-2 {
            width: 15%;
          }
          .w-3 {
            width: 30%;
          }
          .w-4 {
            width: 8%;
          }
          .w-5 {
            width: 15%;
          }
          .w-6 {
            width: 15%;
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
      // margin-top: 15px;
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