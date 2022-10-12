const updateSpots = (state, appointments) => {
  const days = state.days;
  const day = days.filter(day => day.name === state.day)[0];
  const apptIDs = day.appointments;
  let spots = apptIDs.length;

  apptIDs.forEach(id => {
    if (appointments[id].interview) spots--;
  });

  const updatedDay = { ...day, spots };

  const updatedDays = days.map((element, index) => {
    if (index === day.id - 1) return updatedDay;
    return element;
  });

  return updatedDays;
};

export default updateSpots;
