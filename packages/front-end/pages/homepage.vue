<template>
  <div class="container">
    <h1 class="main-title text-center m-8 text-2xl font-bold">
      ONGOING INCIDENTS
    </h1>

    <div class="incident-wrap">
      <h3 class="title">Hurricane Milton</h3>
      <p class="location">Western Florida, USA · 10/09/24</p>
      <div class="right-top">
        <span class="disaster-type">NATURAL DISASTER</span>
        <div class="btn-request"><img class="icon" src="../assets/css/images/whitePlusIcon.png"/>REQUEST</div>
      </div>
      <div class="incident-card-wrap">
        <IncidentsCard />
        <IncidentsCard />
        <IncidentsCard />cd
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
}

.incident-wrap {
  background-color: white;
  padding: 15px;
  text-align: center;

  .incident-card-wrap {
    clear: right;
    display: flex;
    justify-content: space-between;
  }

  .location {
    color: #2a3952;
    font-size: 16px;
    font-weight: 500;
    padding-bottom: 20px;
  }

  .title {
    color: #2a3952;
    font-size: 24px;
    font-weight: 700;
  }

  .right-top {
    display: flex;
    float: right;
    margin-top: -70px;

    .btn-request {
      align-content: center;
      background-color: #4faf38;
      border-radius: 6px;
      color: white;
      display: flex;
      font-size: 14px;
      font-weight: 700;
      padding: 0 10px;
      place-items: center;

      .icon {
        margin-right: 5px;
        padding: 0 6px;
      }
    }

    .disaster-type {
      background-color: #535353;
      border-radius: 6px;
      color: white;
      font-size: 14px;
      font-weight: 700;
      margin-right: 10px;
      padding: 9px 11px;
    }
  }
}
.main-title {
  color: #2a3952;
  margin-top: 130px;
}
</style>
