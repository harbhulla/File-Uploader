import Modal from "../Modal";
import Rename from "./helperComponents/Rename";
import Delete from "./helperComponents/Delete";
import { useContext, useState } from "react";
import { StateContext } from "./StateContext";
import useLoadData from "../customHooks/useLoadData";
export default function Information() {
  useLoadData();
  const { newInformation, setPath, setSubmitButton } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalHeader, setModalHeader] = useState("");
  const openModal = (component) => {
    setModalContent(component);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalHeader("");
  };

  const handleDownload = async (e, path) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/download?path=${path}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }
      const data = await response.blob();
      const a = document.createElement("a");
      const url = URL.createObjectURL(data);
      a.href = url;
      a.download = path.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      console.log("Downloaded");
    } catch (error) {
      console.log("❌ fk it", error);
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th></th>
            <th>Folder</th>
            <th>File</th>
            <th>Size</th>
            <th>Upload Time</th>
            <th>Download</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newInformation.map((i, index) => (
            <tr key={index}>
              <th>{index}</th>
              <td>{i.path}</td>
              <td>{i.filename}</td>
              <td>{i.size + " bytes"}</td>
              <td>{i.uploadTime}</td>
              <td>
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={(e) => handleDownload(e, i.path)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </button>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    openModal(<Rename />);
                    setModalHeader("Rename your folder");
                    setSubmitButton("Rename");
                    setPath(i.path);
                  }}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 8.25.22-.22a.75.75 0 0 1 1.28.53v6.441c0 .472.214.934.64 1.137a3.75 3.75 0 0 0 4.994-1.77c.205-.428-.152-.868-.627-.868h-.507m-6-2.25h7.5M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openModal(<Delete />);
                    setModalHeader("Delete folder");
                    setSubmitButton("Delete");
                    setPath(i.path);
                  }}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        content={modalContent}
        isOpen={isModalOpen}
        onClose={closeModal}
        header={modalHeader}
      />
    </div>
  );
}
