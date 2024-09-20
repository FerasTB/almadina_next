// services/api.ts

// Dummy data for trips and users
const trips = [
    { id: '1', name: 'Trip to Paris', description: 'A beautiful trip to Paris', price: 1200 },
    { id: '2', name: 'Trip to New York', description: 'Explore the Big Apple', price: 1500 },
  ];
  
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];
  
  // Dummy API calls
  export const getTrips = async () => {
    return trips;
  };
  
  export const getTrip = async (id: string) => {
    return trips.find(trip => trip.id === id);
  };
  
  export const createTrip = async (tripData: any) => {
    const newTrip = { id: (trips.length + 1).toString(), ...tripData };
    trips.push(newTrip);
    return newTrip;
  };
  
  // Similarly, add dummy API calls for users
  export const getUsers = async () => {
    return users;
  };
  
  export const getUser = async (id: string) => {
    return users.find(user => user.id === id);
  };
  
  export const createUser = async (userData: any) => {
    const newUser = { id: (users.length + 1).toString(), ...userData };
    users.push(newUser);
    return newUser;
  };
  
  export const updateUser = async (id: string, userData: any) => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...userData };
      return users[userIndex];
    }
    return null;
  };
  