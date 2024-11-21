<template>
  <section class="register">
    <div class="container form">
      <h1 class="title text-2xl font-bold tracking-tight">Register</h1>
      <div class=" mb-3">
        <label for="uname" class="pr-2 font-semibold">Username :</label>
        <input
          v-model="user.username"
          type="text"
          name="uname"
          id="uname"
          class="input block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          placeholder="Enter Username"
          required
        />
      </div>

      <div class="mb-3">
        <label for="uname" class="pr-2 font-semibold">Email :</label>
        <input
          v-model="user.email"
          type="text"
          name="email"
          id="email"
          class="input block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          placeholder="Enter Email"
          required
        />
      </div>

      <div class="mb-3">
        <label for="psw" class="pr-2 font-semibold">Password :</label>
        <input
          v-model="user.password"
          type="password"
          class="input block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          placeholder="Enter Password"
          name="psw"
          required
        />
      </div>

      <div class="flex justify-self-end">
        <button
        @click.prevent="login"
        class="btn-login block rounded-md px-5 py-2 mt-4 mr-3 text-base font-medium"
      >
        Cancel
      </button>

      <button
        @click.prevent="login"
        class="btn-login block rounded-md px-5 py-2 mt-4 text-base font-medium"
      >
        Sign up
      </button>
      </div>
      <div class="link"><NuxtLink to="/login">Already have an account? </NuxtLink></div>
    </div>
  </section>
</template>


<script lang="ts" setup>
const user = ref({
  username: "",
  password: "",
  email: "",
});

const login = async () => {
  // TODO send user Data to the login endpoint and redirect if  successful
};
</script>


<style>
.register {
  margin: 150px;
  place-self: center;

  .btn-login {
    background-color: #2a3952;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 700;
  }   

  .container {
    background-color: white;
    border-radius: 6px;
    padding: 30px 20px;
    width: 450px;

    label {
      width: 120px;
    }

    .link {
      cursor: pointer;
      font-size: 14px;
    }
  }

  .title {
    color: #2a3952;
    margin-bottom: 20px;
    text-transform: uppercase;
  }
}
</style>
