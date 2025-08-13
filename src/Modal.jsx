import { useState, useContext } from "react";
import { StateContext } from "./components/StateContext";

export default function Modal({ content, isOpen, onClose, header }) {
  const actions = {
    Rename: { path: "renameFolder", method: "PUT" },
    Delete: { path: "deleteFolder", method: "POST" },
    Update: { path: "updateFolder", method: "POST" },
  };
  const {
    submitButton,
    input,
    setInput,
    path,
    setNewInformation,
    newInformation,
  } = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", input.file);
    formData.append("name", input.name);
    formData.append("path", path);
    const action = actions[submitButton];
    if (!action) return;
    try {
      setLoading(true);
      setError(null);
      const url = `http://localhost:3000/api/${action.path}`;

      const opts = {
        method: action.method,
        credentials: "include",
        body: formData,
      };
      const res = await fetch(url, opts);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      const newArray = newInformation.filter((item) => item.path !== path);
      setNewInformation(() => [
        ...newArray,
        {
          filename: data.files[0].name,
          uploadTime: data.files[0].updatedAt,
          path: data.files[0].path,
          size: data.files[0].size,
        },
      ]);
      onClose();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
      setInput({ name: "", file: null });
    }
  };
  return (
    <dialog
      id="global_modal"
      open={isOpen}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">{header}</h3>

        <div>{content}</div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        <button
          className="btn mt-6"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Working..." : submitButton}
        </button>

        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
