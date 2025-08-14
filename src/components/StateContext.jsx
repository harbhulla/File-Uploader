import { createContext, useState } from "react";

export const StateContext = createContext();

export function StateProvider({ children }) {
  const [newInformation, setNewInformation] = useState([]);
  const [input, setInput] = useState({ name: "", file: null });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [path, setPath] = useState("");
  const [submitButton, setSubmitButton] = useState("");
  return (
    <StateContext.Provider
      value={{
        newInformation,
        setNewInformation,
        input,
        setInput,
        hasLoaded,
        setHasLoaded,
        path,
        setPath,
        submitButton,
        setSubmitButton,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
