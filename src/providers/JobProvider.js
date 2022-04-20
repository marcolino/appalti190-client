import React, { /*useState,*/ createContext } from "react";
import { usePersistedUserState } from "../hooks/usePersistedUserState";

const initialState = {};

const JobContext = createContext(initialState);

const JobProvider = (props) => {
  //console.log("JobProvider: calling usePersistedState with initialstate =", initialState);
  const [job, setJob] = usePersistedUserState("job", initialState);
  //const [job, setJob] = useState(initialState);

  return (
    <JobContext.Provider value={{ job, setJob }}>
      {props.children}
    </JobContext.Provider>
  )
};

export { JobProvider, JobContext };
