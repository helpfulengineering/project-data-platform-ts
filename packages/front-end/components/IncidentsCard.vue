<!-- components/ProductCard.vue -->
<template>
  <div class="incident-card">
    <div class="crisis-level-section">
      <span class="name">CRITICAL</span>
    </div>
    <h3 class="incident-name">Shelter Food Request</h3>
    <div class="location">Sarasota, Florida, USA · 10/12/24</div>
    <div class="multi-collapse">
      <!-- First Collapse -->
      <div class="collapse-section">
        <button @click="toggleCollapse(1)" class="collapse-button">
          Overview
          <span
            :class="{ 'arrow-up': isOpen[1], 'arrow-down': !isOpen[1] }"
          ></span>
        </button>
        <div v-if="isOpen[1]" class="collapse-content">
          <p class="overview-details">
            SeaPort Manatee, a key part of our community’s supply line for food
            and machinery, was torn up by Hurricane Milton. We need help from
            anyone who’s available, preferably with construction experience, to
            start working on rebuilding this port. Please contact Amy at
            XXX-XXX-XXXX.
          </p>
        </div>
      </div>

      <!-- Second Collapse -->
      <div class="collapse-section">
        <button @click="toggleCollapse(2)" class="collapse-button">
          Request
          <span
            :class="{ 'arrow-up': isOpen[2], 'arrow-down': !isOpen[2] }"
          ></span>
        </button>
        <div v-if="isOpen[2]" class="collapse-content">
          <div class="request-details">
            <img src="../assets/css/images/greenPlusIcon.png" />
            <div>
              <div class="demand-bar"><div class="supply-bar"></div></div>
              <div>
                <div>Hot Meals</div>
                <div>96 of 1000 supplied</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Third Collapse -->
      <div class="collapse-section">
        <button @click="toggleCollapse(3)" class="collapse-button">
          Contact
          <span
            :class="{ 'arrow-up': isOpen[3], 'arrow-down': !isOpen[3] }"
          ></span>
        </button>
        <div v-if="isOpen[3]" class="collapse-content">
          <div class="contact-details">
            <img class="icon" src="../assets/css/images/person.png" />Ronnie
            Delanno
          </div>
          <div class="contact-details">
            <img class="icon" src="../assets/css/images/phone.png" />000-000-000
          </div>
          <div class="contact-details">
            <img
              class="icon"
              src="../assets/css/images/email.png"
            />ronny@shelter.com
          </div>
        </div>
      </div>
    </div>

    <button class="btn-primary btn-offer">OFFER HELP</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: {
        1: false, // State for collapse 1
        2: false, // State for collapse 2
        3: false, // State for collapse 3
      },
    };
  },
  methods: {
    toggleCollapse(section) {
      // Toggle the specific section's collapse
      this.isOpen[section] = !this.isOpen[section];
    },
  },
};
</script>

<style scoped>
.incident-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #ebebeb;
  padding: 0;
  width: 30%;
  margin-bottom: 15px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  .btn-primary {
    background-color: #4faf38;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 700;
    padding: 5px 15px;

    &.btn-offer {
      float: right;
      margin: 20px;
    }
  }

  .crisis-level-section {
    background-color: #c71313;
    border-radius: 12px 12px 0 0;
    padding: 7px;
    .name {
      background-color: white;
      border-radius: 17px;
      color: #2a3952;
      font-size: 16px;
      font-weight: 700;
      padding: 0 5px;
    }
  }

  .location {
    font-size: 16px;
    font-weight: 500;
  }

  .incident-name {
    color: #2a3952;
    font-size: 20px;
    font-weight: 700;
  }

  .multi-collapse {
    margin: 20px;
  }

  .collapse-section {
    margin-bottom: 15px;
  }

  .collapse-button {
    color: #2a3952;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    outline: none;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  /* .collapse-button:hover {
  background-color: #2b4a99;
} */

  /* Arrow styles */
  .collapse-button .arrow-down::before {
    content: "▼"; /* Down arrow */
    margin-left: 10px;
  }

  .collapse-button .arrow-up::before {
    content: "▲"; /* Up arrow */
    margin-left: 10px;
  }

  .collapse-content {
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
    animation: fadeIn 0.3s ease;

    .contact-details {
      align-items: center;
      display: flex;
      font-size: 12px;
      font-weight: 500;
      padding-bottom: 8px;

      .icon {
        margin-right: 6px;
      }
    }

    .overview-details {
      font-size: 12px;
    }

    .request-details {
        align-items: flex-start;
        display: flex;
        
      .demand-bar {
        background-color: #d9d9d9;
        border: 1px solid #7c7c7c;
        height: 16px;
        margin-left: 6px;

        .supply-bar {
          background-color: #4faf38;
          height: 14px;
          width: 30px;
        }
      }
    }
  }

  /* Optional: Fade-in effect */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
