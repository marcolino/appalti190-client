import React, { useState, createContext } from "react";

const initialState = {};

const JobContext = createContext(initialState);

const JobProvider = (props) => {
  const [job, setJob] = useState(initialState);

  return (
    <JobContext.Provider value={{ job, setJob }}>
      {props.children}
    </JobContext.Provider>
  )
};

export { JobProvider, JobContext };
