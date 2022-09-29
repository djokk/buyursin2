<template>
  <section class="add">
    <div class="breadcrumb p-0">
      <router-link :to="{name: 'BRDashboard'}" class="breadcrumb__link"><i class="bx bx-home-alt"></i></router-link>
      <div class="breadcrumb__item">
        <i class="fa fa-angle-right"></i>
        <p>{{ $t('add') }}</p>
      </div>
    </div>
    <div class="wrapper">
      <div class="row">
        <div class="col-xl-3">
          <router-link :to="{name: 'BREmployes'}" class="card-custom">
            {{ $t('employes') }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'BRAdd',
  data() {
    return {
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.add {
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
    width: 100%;
    min-height: 150px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Roboto';
    font-size: 22px;
    font-weight: 500;
    color: #002f34;
    background-color: #fff;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    box-shadow: 0 0.3rem 0.8rem rgba(0,0,0,0.12);
    padding: 1rem;
    transition: 0.3s all ease-in-out;
    &:hover {
      color: #fff;
      background-color: #002f34;
    }
  }
}
</style>