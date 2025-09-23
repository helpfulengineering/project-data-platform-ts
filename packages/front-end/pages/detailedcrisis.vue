<template>
  <div class="container">
    <h1 class="main-title text-center m-8 text-2xl font-bold">
      CRISIS DETAILS
    </h1>

    <div class="crisis-wrap">
      <h3 class="title">{{ crisisDetails ? crisisDetails.title || crisisDetails.name : 'Loading crisis data...' }}</h3>
      <p class="location">{{ crisisDetails ? `${crisisDetails.location || 'Unknown location'} · ${formatDate(crisisDetails.incident_date)}` : 'Loading location data...' }}</p>
      <div v-if="crisisError" class="error-message">{{ crisisError }}</div>
      <div class="right-top">
        <span class="disaster-type">NATURAL DISASTER</span>
        <div class="btn-request">
          <img
            class="icon"
            src="../assets/css/images/whitePlusIcon.png"
            alt="Request Icon"
          />
          REQUEST AID
        </div>
      </div>

      <div class="layout-wrap">
        <!-- Left Section -->
        <div class="left-section">
          <!-- Blank Big Box (Placeholder for Map or Image) -->
          <div class="blank-box">
            <div v-if="crisisLoading" class="loading-indicator">Loading map data...</div>
            <div v-else-if="crisisError" class="error-message">{{ crisisError }}</div>
            <div v-else-if="crisisDetails">
              <p class="placeholder-text" v-if="crisisDetails.map_url">
                <img :src="crisisDetails.map_url" alt="Crisis Map" class="crisis-map">
              </p>
              <p class="placeholder-text" v-else>
                Interactive Map of Affected Areas (Coming Soon)
              </p>
            </div>
            <p v-else class="placeholder-text">
              Interactive Map of Affected Areas (Coming Soon)
            </p>
          </div>

          <!-- Two Vertical Boxes -->
          <div class="vertical-split">
            <!-- Left: Three Horizontal Boxes -->
            <div class="left-boxes">
              <div class="info-box">
                <h4 class="box-title">Definition of Crisis</h4>
                <p class="box-text" v-if="crisisLoading">Loading crisis definition...</p>
                <p class="box-text" v-else-if="crisisError">{{ crisisError }}</p>
                <p class="box-text" v-else-if="crisisDetails">
                  {{ crisisDetails.description || 'No description available for this crisis.' }}
                </p>
                <p class="box-text" v-else>
                  Loading crisis definition...
                </p>
              </div>
              <div class="info-box">
                <h4 class="box-title">Time and Location</h4>
                <p class="box-text">
                  <strong>Landfall</strong>: October 9, 2024, at 8:30 PM EDT<br />
                  <strong>Primary Areas Affected</strong>: Tampa, Sarasota, Fort
                  Myers, and surrounding counties in Western Florida, USA<br />
                  <strong>Current Status</strong>: Ongoing recovery efforts as
                  of April 19, 2025
                </p>
              </div>
              <div class="info-box">
                <h4 class="box-title">Best Practices</h4>
                <p class="box-text">
                  - <strong>Evacuation</strong>: Follow local evacuation orders;
                  use designated routes.<br />
                  - <strong>Preparation</strong>: Stock a 3-day supply of food,
                  water, and medications.<br />
                  - <strong>Safety</strong>: Avoid floodwaters and downed power
                  lines; use generators safely.<br />
                  - <strong>Stay Informed</strong>: Monitor NOAA Weather Radio
                  or local news for updates.
                </p>
              </div>
            </div>

            <!-- Right: Current Issues -->
            <div class="current-issues">
              <h4 class="box-title">Current Issues</h4>
              <div v-if="incidentsLoading" class="loading-indicator">
                Loading current issues...
              </div>
              <div v-else-if="incidentsError" class="error-message">
                {{ incidentsError }}
              </div>
              <div v-else-if="incidents && incidents.length > 0" class="incidents-list">
                <div 
                  v-for="incident in incidents" 
                  :key="incident.id" 
                  class="incident-item"
                  :class="{ 'expanded': expandedIncident === incident.id }"
                  @click="toggleIncidentExpansion(incident.id)"
                >
                  <div class="incident-header">
                    <div class="incident-main-info">
                      <div class="incident-type-badge" v-if="incident.incident_type">
                        {{ incident.incident_type.toUpperCase() }}
                      </div>
                      <h5 class="incident-title">{{ incident.title || incident.name }}</h5>
                      <div class="incident-location-primary" v-if="incident.location">
                        <i class="location-icon">📍</i>
                        {{ incident.location }}
                      </div>
                    </div>
                    <div class="expand-indicator">
                      <span class="expand-arrow" :class="{ 'rotated': expandedIncident === incident.id }">▼</span>
                    </div>
                  </div>
                  
                  <p class="incident-description">{{ incident.description }}</p>
                  
                  <div class="incident-basic-meta">
                    <span class="incident-date" v-if="incident.incident_date">
                      <strong>Date:</strong> {{ formatDate(incident.incident_date) }}
                    </span>
                    <span class="incident-status" v-if="incident.status">
                      <strong>Status:</strong> {{ incident.status }}
                    </span>
                  </div>

                  <!-- Expandable section -->
                  <div v-if="expandedIncident === incident.id" class="incident-expanded-content">
                    <div class="expanded-section">
                      <h6 class="section-title">History</h6>
                      <div class="history-content">
                        <p v-if="incident.history">{{ incident.history }}</p>
                        <p v-else-if="incident.incident_date">
                          Incident reported on {{ formatDate(incident.incident_date) }}
                          <span v-if="incident.status"> - Current status: {{ incident.status }}</span>
                        </p>
                        <p v-else>No detailed history available for this incident.</p>
                      </div>
                    </div>
                    
                    <div class="expanded-section">
                      <h6 class="section-title">Commander</h6>
                      <div class="commander-content">
                        <p v-if="incident.commander">{{ incident.commander }}</p>
                        <p v-else-if="incident.assigned_to">{{ incident.assigned_to }}</p>
                        <p v-else>No commander assigned to this incident.</p>
                      </div>
                    </div>
                    
                    <div class="expanded-section" v-if="incident.severity">
                      <h6 class="section-title">Severity</h6>
                      <div class="severity-content">
                        <span class="severity-badge" :class="getSeverityClass(incident.severity)">
                          {{ incident.severity.toUpperCase() }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-incidents">
                <p class="box-text">No current incidents found in the database.</p>
              </div>
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
            <div v-if="loading" class="loading">Loading supplies...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else class="supplies-list">
              <div
                v-for="supply in filteredSupplies"
                :key="supply.name"
                class="supply-item"
              >
                <h5 class="supply-name">{{ supply.name }}</h5>
                <p class="supply-description" v-if="supply.description"><strong>Description</strong>: {{ supply.description }}</p>
                <p class="supply-details">
                  <strong>Importance</strong>: {{ supply.importance }}<br />
                  <strong>Quantity Needed</strong>: {{ supply.quantity }}<br />
                  <strong>Where to Find</strong>: {{ supply.whereToFind }}
                </p>
                <div class="supply-image" v-if="supply.image">
                  <img :src="supply.image" alt="Supply Image" class="product-img" />
                </div>
              </div>
            </div>
          </div>
          <!-- Needed First -->
          <div class="supply-box">
            <h4 class="box-title">Needed First (High Priority)</h4>
            <p class="box-text">
              - <strong>Bottled Water</strong>: 10,000 gallons urgently needed
              for drinking and sanitation.<br />
              - <strong>Medical Supplies</strong>: Bandages, antiseptics, and
              prescription medications for 5,000+ injured.<br />
              - <strong>Generators</strong>: 500 units to power shelters and
              medical facilities.<br />
              - <strong>Tarps</strong>: 2,000 units for temporary roof repairs.
            </p>
          </div>

          <!-- Have Available -->
          <div class="supply-box">
            <h4 class="box-title">Have Available (Current Stock)</h4>
            <p class="box-text">
              - <strong>Canned Food</strong>: 1,000 cans, limited to 2-day
              supply for shelters.<br />
              - <strong>Flashlights</strong>: 200 units, distributed to priority
              areas.<br />
              - <strong>Blankets</strong>: 300 units, insufficient for displaced
              populations.<br />
              - <strong>Portable Chargers</strong>: 50 units, reserved for
              emergency personnel.
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
      supplies: [],
      searchQuery: '',
      loading: false,
      error: null,
      apiBaseUrl: 'http://localhost:7071/api',
      crisisDetails: null,
      crisisLoading: false,
      crisisError: null,
      incidents: [],
      incidentsLoading: false,
      incidentsError: null,
      expandedIncident: null
    };
  },
  computed: {
    filteredSupplies() {
      if (!this.searchQuery) return this.supplies;
      return this.supplies.filter((supply) =>
        supply.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Unknown date';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit'
        });
      } catch (e) {
        console.error('Date formatting error:', e);
        return dateString || 'Unknown date';
      }
    },
    filterSupplies(event) {
      this.searchQuery = event.target.value;
    },
    async fetchSupplies() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/incidents`);
        
        if (!response.ok) {
          throw new Error(`Error fetching supplies: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Process the data from the API
        if (data && data.productSummaries) {
          this.supplies = data.productSummaries.map(item => ({
            name: item.name || 'Unknown Product',
            importance: item.importance || 'Unknown Importance',
            quantity: item.quantity || 'Unknown Quantity',
            whereToFind: item.whereToFind || 'Check local relief organizations',
            image: item.image || '',
            description: item.description || 'No description available'
          }));
        } else {
          this.supplies = [];
        }
      } catch (err) {
        console.error('Error fetching supplies:', err);
        this.error = `Failed to load supplies: ${err.message}`;
        this.supplies = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchCrisisData() {
      this.crisisLoading = true;
      this.crisisError = null;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/incidents`);
        
        if (!response.ok) {
          throw new Error(`Error fetching crisis data: ${response.statusText}`);
        }
        
        const incidents = await response.json();
        
        if (incidents && incidents.length > 0) {
          // Use the first incident for demonstration
          this.crisisDetails = incidents[0];
          console.log('Crisis data loaded from PostgreSQL:', this.crisisDetails);
        } else {
          console.warn('No incidents found in the database');
          this.crisisError = 'No incidents found';
        }
      } catch (err) {
        console.error('Error fetching crisis data:', err);
        this.crisisError = `Failed to load crisis data: ${err.message}`;
      } finally {
        this.crisisLoading = false;
      }
    },
    async fetchIncidents() {
      this.incidentsLoading = true;
      this.incidentsError = null;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/incidents`);
        
        if (!response.ok) {
          throw new Error(`Error fetching incidents: ${response.statusText}`);
        }
        
        const incidents = await response.json();
        
        if (incidents && Array.isArray(incidents)) {
          this.incidents = incidents;
          console.log('Incidents loaded from PostgreSQL:', this.incidents);
        } else {
          console.warn('No incidents found in the database');
          this.incidents = [];
        }
      } catch (err) {
        console.error('Error fetching incidents:', err);
        this.incidentsError = `Failed to load incidents: ${err.message}`;
        this.incidents = [];
      } finally {
        this.incidentsLoading = false;
      }
    },
    toggleIncidentExpansion(incidentId) {
      if (this.expandedIncident === incidentId) {
        this.expandedIncident = null;
      } else {
        this.expandedIncident = incidentId;
      }
    },
    getSeverityClass(severity) {
      if (!severity) return 'severity-unknown';
      const severityLower = severity.toLowerCase();
      switch (severityLower) {
        case 'critical':
        case 'high':
          return 'severity-high';
        case 'medium':
        case 'moderate':
          return 'severity-medium';
        case 'low':
          return 'severity-low';
        default:
          return 'severity-unknown';
      }
    }
  },
  mounted() {
    // Fetch data when the component is mounted
    this.fetchSupplies();
    this.fetchCrisisData();
    this.fetchIncidents();
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

.error-message {
  color: #e74c3c;
  font-size: 16px;
  font-weight: 500;
  padding: 10px;
  text-align: center;
}

.loading-indicator {
  color: #3498db;
  font-size: 16px;
  font-weight: 500;
  padding: 10px;
  text-align: center;
}

.crisis-map {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
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

.supply-description {
  color: #2a3952;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
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

.product-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
}

/* Incident styles for Current Issues section */
.incidents-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.incident-item {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e74c3c;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.incident-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.incident-item.expanded {
  border-left-color: #3498db;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.incident-main-info {
  flex: 1;
}

.incident-type-badge {
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.incident-title {
  color: #2a3952;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.incident-location-primary {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

.location-icon {
  font-size: 12px;
}

.expand-indicator {
  padding: 5px;
}

.expand-arrow {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
  display: inline-block;
}

.expand-arrow.rotated {
  transform: rotate(180deg);
}

.incident-description {
  color: #2a3952;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.incident-basic-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.incident-date,
.incident-status {
  display: block;
}

.incident-expanded-content {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 10px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.expanded-section {
  margin-bottom: 15px;
}

.expanded-section:last-child {
  margin-bottom: 0;
}

.section-title {
  color: #2a3952;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-content,
.commander-content {
  color: #555;
  font-size: 13px;
  line-height: 1.4;
}

.severity-content {
  margin-top: 5px;
}

.severity-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.severity-high {
  background-color: #e74c3c;
  color: white;
}

.severity-medium {
  background-color: #f39c12;
  color: white;
}

.severity-low {
  background-color: #27ae60;
  color: white;
}

.severity-unknown {
  background-color: #95a5a6;
  color: white;
}

.no-incidents {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
