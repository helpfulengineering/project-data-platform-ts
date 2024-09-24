<template>
  <header>
    <nav>
      <Disclosure as="nav" class="nav" v-slot="{ open }">
        <ul class="nav-link-wrap flex container">
          <div class="left">
            <div class="logo-wrap">
              <img src="/assets/css/images/Helpful_logo.png" />
            </div>
            <DisclosureButton
              class="website-name text-white uppercase [item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
              ><NuxtLink to="/">HELPFUL</NuxtLink></DisclosureButton
            >

            <div class="relative text-gray-600">
              <input
                type="search"
                name="search"
                v-model="query"
                placeholder="Search for a product"
                class="search-bar bg-gray-100 h-10 px-5 pr-10 text-sm focus:outline-none"
              />
              <button
                type="submit"
                class="btn-search absolute right-0 top-0"
                @click="handleSearch"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 text-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="right">
            <li
              class="nav-link text-white uppercase [item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
            >
              <NuxtLink to="/about">About</NuxtLink>
            </li>
            <li
              class="nav-link text-white uppercase [item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
            >
              <NuxtLink to="/contact">Contact</NuxtLink>
            </li>
            <li
              class="nav-link text-white uppercase [item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
            >
              <NuxtLink to="/login">Sign IN</NuxtLink>
            </li>
            <li
              class="btn-register text-white uppercase [item.current ? 'bg-gray-900 text-white' : 'text-gray-300', 'block rounded-md px-3 py-2 text-base font-medium']"
            >
              <NuxtLink to="/register">Register</NuxtLink>
            </li>
          </div>
        </ul>
      </Disclosure>
    </nav>
  </header>
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
</script>

<style>
.btn-register {
  background-color: #a6f671;
  border-radius: 6px;
  color: #000000;
  font-size: 14px;
  font-weight: 700;
}

.btn-search {
  background-color: #4ea641;
  border-radius: 11px;
  margin: 5px 5px 0 0;
  padding: 8px;
}

.container {
  margin: 0 auto;
  max-width: 1400px;
}

.nav {
  background-color: #2a3952;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}

.nav-link-wrap {
  justify-content: space-between;
  padding: 20px 0;
}

.nav-link {
  font-size: 14px;
  font-weight: 700;
  margin: 5px 8px;
}

.left {
  display: flex;
}

.logo-wrap {
  align-items: center;
  display: flex;
}

.search-bar {
  border-radius: 11px;
  height: 50px;
  width: 600px;
}

.right {
  display: flex;
  place-items: center;
}

.website-name {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 3px;
}
</style>
