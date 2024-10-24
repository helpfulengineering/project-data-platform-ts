// OKH type
// example OKH from here:
// https://github.com/helpfulengineering/library/blob/main/alpha/okh/okh-chococolate-chip.yml

import {} from "./general.type";

enum CRISIS {
  ARMED_CONFLICT = "Armed Conflict",
  CLIMATE_CHANTE = "Climate Change",
  HUNGER_CRISES = "Hunger Crises",
  HUMANITARIAN_CRISES = "Humanitarian Crises",
  ECONOMIC_INEQUALITY = "Economic Inequality",
  POLITICAL_INSTABILITY = "Political Instability",
  PUBLIC_HEALTH_THREATS = "Public Health Threats",
  FORCED_DISPLACEMENT = "Forced Displacement",
  CYBERSECURITY_THREATS = "Cybersecurity Threats",
  ENVIRONMENTAL_DEGRADATION = "Environmental Degradation",
  INFECTIOUS_DISEASE = "Infectious Disease",
  WEATHER_RELATE_CRISIS = "Weather Relate Crisis",
}

export type INCIDENT_TYPE = {
  startTime: Date;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    postalCode?: number;
    zipCode?: number;
    country?: string;
  };
  dangerOngoing: boolean;
  crisisOngoing: boolean;
  crisisTypes: CRISIS[];
  totalPopulation: number;
  effectedPopulation: number;
};
