<template>
  <div class="container">
    <h1 class="main-title text-center m-8 text-2xl font-bold">
      CRISIS DETAILS
    </h1>

    <div class="crisis-wrap">
      <h3 class="title">Hurricane Milton</h3>
      <p class="location">Western Florida, USA · 10/09/24</p>
      <div class="right-top">
        <span class="disaster-type">NATURAL DISASTER</span>
        <div class="btn-request">
          <img class="icon" src="../assets/css/images/whitePlusIcon.png" alt="Request Icon" />
          REQUEST AID
        </div>
      </div>

      <div class="layout-wrap">
        <!-- Left Section -->
        <div class="left-section">
          <!-- Blank Big Box (Placeholder for Map or Image) -->
          <div class="blank-box">
            <p class="placeholder-text">Interactive Map of Affected Areas (Coming Soon)</p>
          </div>

          <!-- Two Vertical Boxes -->
          <div class="vertical-split">
            <!-- Left: Three Horizontal Boxes -->
            <div class="left-boxes">
              <div class="info-box">
                <h4 class="box-title">Definition of Crisis</h4>
                <p class="box-text">
                  Hurricane Milton, a Category 3 hurricane, struck Western Florida on October 9, 2024, with winds up to 120 mph. It has caused severe flooding, extensive wind damage, and widespread power outages, displacing thousands and damaging infrastructure across Tampa, Sarasota, and Fort Myers.
                </p>
              </div>
              <div class="info-box">
                <h4 class="box-title">Time and Location</h4>
                <p class="box-text">
                  <strong>Landfall</strong>: October 9, 2024, at 8:30 PM EDT<br />
                  <strong>Primary Areas Affected</strong>: Tampa, Sarasota, Fort Myers, and surrounding counties in Western Florida, USA<br />
                  <strong>Current Status</strong>: Ongoing recovery efforts as of April 19, 2025
                </p>
              </div>
              <div class="info-box">
                <h4 class="box-title">Best Practices</h4>
                <p class="box-text">
                  - <strong>Evacuation</strong>: Follow local evacuation orders; use designated routes.<br />
                  - <strong>Preparation</strong>: Stock a 3-day supply of food, water, and medications.<br />
                  - <strong>Safety</strong>: Avoid floodwaters and downed power lines; use generators safely.<br />
                  - <strong>Stay Informed</strong>: Monitor NOAA Weather Radio or local news for updates.
                </p>
              </div>
            </div>

            <!-- Right: Current Issues -->
            <div class="current-issues">
              <h4 class="box-title">Current Issues</h4>
              <p class="box-text">
                - <strong>Power Outages</strong>: 1.2 million residents without electricity, with restoration delayed in rural areas.<br />
                - <strong>Flooding</strong>: Major roads (e.g., I-75, US-41) remain impassable in low-lying areas.<br />
                - <strong>Shelter Shortages</strong>: Sarasota reports insufficient emergency shelters, with 2,000+ people displaced.<br />
                - <strong>Supply Chain Disruptions</strong>: Damaged infrastructure delays delivery of food, water, and medical supplies.<br />
                - <strong>Health Risks</strong>: Contaminated floodwaters increase risks of waterborne diseases.
              </p>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="right-section">
          <!-- Know Critical Supplies -->
          <div class="critical-supplies">
            <h4 class="box-title">Know Critical Supplies</h4>
            <input
              v-model="searchQuery"
              type="text"
              class="search-bar"
              placeholder="Search for supplies (e.g., water, first aid)"
              @input="filterSupplies"
            />
            <div class="supplies-list">
              <div v-for="supply in filteredSupplies" :key="supply.name" class="supply-item">
                <h5 class="supply-name">{{ supply.name }}</h5>
                <p class="supply-details">
                  <strong>Importance</strong>: {{ supply.importance }}<br />
                  <strong>Quantity Needed</strong>: {{ supply.quantity }}<br />
                  <strong>Where to Find</strong>: {{ supply.whereToFind }}
                </p>
              </div>
            </div>
          </div>

          <!-- Needed First -->
          <div class="supply-box">
            <h4 class="box-title">Needed First (High Priority)</h4>
            <p class="box-text">
              - <strong>Bottled Water</strong>: 10,000 gallons urgently needed for drinking and sanitation.<br />
              - <strong>Medical Supplies</strong>: Bandages, antiseptics, and prescription medications for 5,000+ injured.<br />
              - <strong>Generators</strong>: 500 units to power shelters and medical facilities.<br />
              - <strong>Tarps</strong>: 2,000 units for temporary roof repairs.
            </p>
          </div>

          <!-- Have Available -->
          <div class="supply-box">
            <h4 class="box-title">Have Available (Current Stock)</h4>
            <p class="box-text">
              - <strong>Canned Food</strong>: 1,000 cans, limited to 2-day supply for shelters.<br />
              - <strong>Flashlights</strong>: 200 units, distributed to priority areas.<br />
              - <strong>Blankets</strong>: 300 units, insufficient for displaced populations.<br />
              - <strong>Portable Chargers</strong>: 50 units, reserved for emergency personnel.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      supplies: [
        {
          name: 'Bottled Water',
          importance: 'Critical for hydration and sanitation during outages.',
          quantity: '1 gallon/person/day for 3 days',
          whereToFind: 'FEMA distribution centers, local supermarkets (limited stock), Red Cross aid stations.'
        },
        {
          name: 'Non-perishable Food',
          importance: 'Essential to sustain affected populations without power.',
          quantity: '3-day supply per person',
          whereToFind: 'Community food banks, relief organizations, or local donation drives.'
        },
        {
          name: 'First Aid Kits',
          importance: 'Vital for treating injuries from debris and flooding.',
          quantity: '1 kit per household',
          whereToFind: 'Pharmacies, Red Cross, or online retailers (if accessible).'
        },
        {
          name: 'Flashlights and Batteries',
          importance: 'Necessary for navigation and safety during power outages.',
          quantity: '1 flashlight + 4 batteries per person',
          whereToFind: 'Hardware stores, relief distribution points.'
        },
        {
          name: 'Blankets and Clothing',
          importance: 'Protects against cold and exposure in damaged homes.',
          quantity: '1 blanket + 1 set of clothing per person',
          whereToFind: 'Donation centers, shelters, or community drives.'
        },
        {
          name: 'Generators',
          importance: 'Powers critical equipment in shelters and homes.',
          quantity: '1 per shelter or critical facility',
          whereToFind: 'Hardware stores, FEMA supply drops (limited).'
        }
      ]
    };
  },
  computed: {
    filteredSupplies() {
      if (!this.searchQuery) return this.supplies;
      return this.supplies.filter(supply =>
        supply.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  max-width: 1200px;
  padding: 20px;
}

.crisis-wrap {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.title {
  color: #2a3952;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  text-align: center;
}

.location {
  color: #2a3952;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
}

.right-top {
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 20px;
}

.disaster-type {
  background-color: #535353;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 12px;
  margin-right: 10px;
}

.btn-request {
  display: flex;
  align-items: center;
  background-color: #4faf38;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 12px;
  cursor: pointer;
}

.btn-request .icon {
  margin-right: 6px;
  width: 16px;
  height: 16px;
}

.layout-wrap {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.left-section {
  flex: 3;
}

.right-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.blank-box {
  background-color: #f0f0f0;
  height: 200px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  color: #2a3952;
  font-size: 16px;
  font-weight: 500;
}

.vertical-split {
  display: flex;
  gap: 20px;
}

.left-boxes {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.current-issues {
  flex: 0.9;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
}

.info-box,
.supply-box {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
}

.critical-supplies {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
  height: 60vh;
  overflow-y: auto;
}

.search-bar {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.supplies-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.supply-item {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.supply-name {
  color: #2a3952;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

.supply-details {
  color: #2a3952;
  font-size: 14px;
  line-height: 1.6;
}

.box-title {
  color: #2a3952;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.box-text {
  color: #2a3952;
  font-size: 14px;
  line-height: 1.6;
}

.main-title {
  color: #2a3952;
  margin: 40px 0;
}
</style>