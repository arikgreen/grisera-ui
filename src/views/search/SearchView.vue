<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          :outlined="true"
          @click.prevent.stop="resetStorage"
        >
          Reset storage
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col">
        <!-- Multiselect Filters Placeholder -->
        <v-card>
          <v-card-title class="py-2">
            Datasets Filter
          </v-card-title>
          <v-card-text>
            <select
              v-model="selectedDatasets"
              multiple
              chips
              outlined
              dense
              hide-details
              style="border: 1px solid #ccc; width: 100%;"
              class="py-2 px-1"
            >
              <option
                v-for="dataset in datasets"
                :key="dataset.id"
                :value="dataset.id"
              >
                {{ dataset.name }}
              </option>
            </select>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col">
        <!-- Multiselect Filters Placeholder -->
        <v-card>
          <v-card-title class="py-2">
            Experiments Filter
          </v-card-title>
          <v-card-text>
            <select
              v-model="selectedExperiments"
              multiple
              chips
              outlined
              dense
              hide-details
              style="border: 1px solid #ccc; width: 100%;"
              class="py-2 px-1"
            >
              <option value="exp1">
                Exp 1
              </option>
              <option value="exp2">
                Exp 2
              </option>
              <option value="exp3">
                Exp 3
              </option>
            </select>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-3">
        <!-- Multiselect Filters Placeholder -->
        <v-card>
          <v-card-title class="py-2">
            Activities Filter
          </v-card-title>
          <v-card-text>
            <select
              v-model="selectedActivities"
              multiple
              chips
              outlined
              dense
              hide-details
              style="border: 1px solid #ccc; width: 100%;"
              class="py-2 px-1"
            >
              <option value="act1">
                Activity 1
              </option>
              <option value="act2">
                Activity 2
              </option>
              <option value="act3">
                Activity 3
              </option>
            </select>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-3">
        <!-- Multiselect Filters Placeholder -->
        <v-card>
          <v-card-title class="py-2">
            Participants Filter
          </v-card-title>
          <v-card-text>
            <select
              v-model="selectedParticipants"
              multiple
              chips
              outlined
              dense
              hide-details
              style="border: 1px solid #ccc; width: 100%;"
              class="py-2 px-1"
            >
              <option value="participant1">
                Participant 1
              </option>
              <option value="participant2">
                Participant 2
              </option>
              <option value="participant3">
                Participant 3
              </option>
            </select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-12">
        <v-row>
          <v-col cols="10">
            <v-text-field
              v-model="searchQuery"
              label="Search"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col
            class="d-flex align-center"
            cols="2"
          >
            <v-btn
              color="primary"
              block
              @click="search"
            >
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col 
        v-model="searchResultsText"
        class="col-12"
      >
        <!-- Search Results Placeholder -->
        {{ searchResultsText }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LocalStorageService from '@/storage/LocalStorageService';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import DatasetAPI from '@/api/DatasetAPI';

export default {
  name: 'SearchView',
  components: {
    AppBreadcrumbs,
  },
  data() {
    return { 
      selectedDatasets: [],
      selectedExperiments: [],
      selectedActivities: [],
      selectedParticipants: [],
      datasets: [],
      experiments: [],
      activities: [],
      participants: [],
      searchQuery: '',
      searchResultsText: 'Search Results will be displayed here.',
    };
  },
  async created() {
      await this.fetchDatasets();
      await this.fetchExperiments();
      await this.fetchActivities();
      await this.fetchParticipants();
  },
  methods: {
    resetStorage() {
      LocalStorageService.clear();
      LocalStorageService.init();
    },
    async fetchDatasets() {
      try {
        console.log('Loading datasets...');
        const response = await DatasetAPI.index();
        this.datasets = response.data || [];
        this.noDatasets = this.datasets.length === 0;
        console.log('Datasets count:', this.datasets.length);
      } catch (error) {
        console.error('Error loading datasets:', error);
        this.datasets = [];
        this.noDatasets = true;
      }
    },
    async fetchExperiments() {
      // Placeholder for fetching experiments
      console.log('Fetching experiments...');
    },
    async fetchActivities() {
      // Placeholder for fetching activities
      console.log('Fetching activities...');
    },
    async fetchParticipants() {
      // Placeholder for fetching participants
      console.log('Fetching participants...');
    },
    search() {
      // Placeholder for search functionality
      console.log('Performing search with filters:', {
        datasets: this.selectedDatasets,
        experiments: this.selectedExperiments,
        activities: this.selectedActivities,
        participants: this.selectedParticipants,
        searchQuery: this.searchQuery,
      });
      this.searchResultsText = `Search performed with query: "${this.searchQuery}" and selected filters.`;
    },
  },
};
</script>
