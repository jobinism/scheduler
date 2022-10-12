import updateSpots from "helpers/updaters";

describe("Update Spots Tests for bookInterview (create)", function () {
  const oldState = require("./testState.json");
  const state = JSON.parse(JSON.stringify(oldState));

  const id = 1;
  const interview = { student: "Test Student", interviewer: 99 };
  const appointment = {
    ...state.appointments[id],
    interview: { ...interview },
  };
  const appointments = { ...state.appointments, [id]: appointment };
  const days = updateSpots(state, appointments, id);

  it("should update spots to 1 ", function () {
    expect(days[0]).toBeDefined();
    expect(days[0].spots).toEqual(1);
  });

  it("should update spots and not change original days array", function () {
    expect(days[0]).toBeDefined();
    expect(days[0].spots).toEqual(1);
    expect(state.days).toEqual(oldState.days);
  });
});

describe("Update Spots Tests for bookInterview (update)", function () {
  const oldState = require("./testState.json");
  const state = JSON.parse(JSON.stringify(oldState));

  const id = 3;
  const interview = { student: "Test Student", interviewer: 99 };
  const appointment = {
    ...state.appointments[id],
    interview: { ...interview },
  };
  const appointments = { ...state.appointments, [id]: appointment };
  const days = updateSpots(state, appointments, id);

  it("should keep spots at 2 ", function () {
    expect(days[0]).toBeDefined();
    expect(days[0].spots).toEqual(2);
  });

  it("should update spots and not change original days array", function () {
    expect(days[0]).toBeDefined();
    expect(days[0].spots).toEqual(2);
    expect(state.days).toEqual(oldState.days);
  });
});

describe("Update Spots Tests for cancelInterview (delete)", function () {
  const oldState = require("./testState.json");
  const state = JSON.parse(JSON.stringify(oldState));

  const id = 3;
  const interview = null;
  const appointment = { ...state.appointments[id], interview };
  const appointments = { ...state.appointments, [id]: appointment };
  const days = updateSpots(state, appointments, id);

  it("should update spots to 3 ", function () {
    expect(days[0]).toBeDefined();
    expect(days[0].spots).toEqual(3);
  });

  it("should update spots and not change original days array", function () {
    expect(days[0]).toBeDefined();
    expect(days[0].spots).toEqual(3);
    expect(state.days).toEqual(oldState.days);
  });
});
