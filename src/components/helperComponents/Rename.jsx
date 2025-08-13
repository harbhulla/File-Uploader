import { useContext } from "react";
import { StateContext } from "../StateContext";
export default function Rename() {
  const { input, setInput } = useContext(StateContext);

  return (
    <>
      <fieldset className="fieldset">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <input
            type="text"
            className="input input-bordered"
            value={input.name}
            placeholder="Folder Name"
            onChange={(e) => setInput({ name: e.target.value, file: null })}
          />
          <p className="label">
            You can rename your folder as many times as you want
          </p>
        </div>
      </fieldset>
    </>
  );
}
