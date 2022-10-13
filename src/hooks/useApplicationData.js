import { useEffect, useReducer } from "react";
import axios from "axios";
import updateSpots from "helpers/updaters";

const SET_DAY = "SET_DAY";
const SET_DAYS = "SET_DAYS";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

/**
 * The reducer function from the 'useReducer' hook, specifies the actions (functions to execute) to update the state object
 * @param {object} state The application's current state
 * @param {object} action The action performed by the user
 * @returns the next state, OR returns an error message if the given action type isn't valid
 */

const reducer = (state, action) => {
  const reducers = {
    SET_DAY: state => ({ ...state, day: action.day }),
    SET_DAYS: state => ({ ...state, days: action.days }),
    SET_APPLICATION_DATA: state => ({
      ...state,
      days: action.days,
      appointments: action.appointments,
      interviewers: action.interviewers,
    }),
    SET_INTERVIEW: state => ({ ...state, appointments: action.appointments }),
    default: () =>
      console.log(`Error: the ${action.type} action type is not valid`),
  };

  return reducers[action.type](state) || reducers.default();
};

/**
 * Custom hook 'useApplicationData': manages the application's state
 */

const useApplicationData = () => {
  /**
   * Set useReducer hook with initial state
   */
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  /**
   * Make a connection to the WebSocket server
   */

  useEffect(() => {}, []);


  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
  }, []);

  if (state.days.length > 0) console.log("Initial state: ", state);

  const setDay = day => dispatch({ type: SET_DAY, day });

  /**
   * Books an interview when user submits the form
   * @param {integer} id the appointment id for the appointment being booked
   * @param {object} interview the interview data
   * @returns an axios put call to update appointments with new interview, then update state, then update spots
   */

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          appointments,
        });
      })
      .then(() => {
        dispatch({
          type: SET_DAYS,
          days: updateSpots(state, appointments),
        });
      });
  };

  /**
   * Cancels an interview when the user clicks the cancel button
   * @param {integer} id the appointment id for the appointment being cancelled
   * @returns an axios delete call to delete the selected interview, then update state, then update spots
   */

  const cancelInterview = id => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`/api/appointments/${id}`, {
        interview: appointment,
      })
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          appointments,
        });
      })
      .then(() => {
        dispatch({
          type: SET_DAYS,
          days: updateSpots(state, appointments),
        });
      });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
};

export default useApplicationData;
