type LocationData = {
  [state: string]: {
    [city: string]: string[];
  };
};

export const locations: LocationData = {
  'Kerala': {
    'Kochi': ['Edappally', 'Kakkanad', 'Palarivattom', 'Fort Kochi'],
    'Trivandrum': ['Kesavadasapuram', 'Pattom', 'Kazhakkoottam', 'Technopark'],
    'Kozhikode': ['Beach Road', 'Mavoor Road', 'Nadakkavu', 'Palayam']
  },
  'Tamil Nadu': {
    'Chennai': ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery'],
    'Coimbatore': ['RS Puram', 'Peelamedu', 'Saibaba Colony', 'Gandhipuram'],
    'Madurai': ['Anna Nagar', 'KK Nagar', 'Bypass Road', 'Goripalayam']
  }
}; 