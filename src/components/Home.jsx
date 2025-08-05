import { useState, useRef, useEffect } from "react";
import Information from "./Information";
export default function Home() {
    const [fileDescription, setFileDescription] = useState(
        {
        name:"",
        description:""
    }
);
    const [newData, setNewData] = useState(
        {
        filename:"",
        uploadTime:"",
        path:"",
        size:0
    }
);
const fileInputRef = useRef(null);

const [newInformation,setNewInformation] = useState([]);
  useEffect(() => {
    const isEmpty = !newData ||
    Object.values(newData).every(
      (value) => value === '' || value === 0 || value === null
    );

  if (isEmpty) return;
  
    async function fetchData() {
        setNewInformation((prev) => [...prev,newData]);
      }

    fetchData();
  }, [newData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file",e.target.file.files[0]);
        formData.append("name", fileDescription.name);
        formData.append("description",fileDescription.description);
         try {
            const response = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`Server error: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        setNewData((prev) => ({...prev,
            filename:data.filename,
            uploadTime:data.uploadTime,
            path:data.path,
            size:data.size
        }))
        } catch (error) {
        console.log("❌ fk it", error);
        }
        setFileDescription({ 
            name:"",
            description:""
        })
        fileInputRef.current.value = ""
    }

    return ( 
    <>
    <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1 prose prose-lg">
    <a className="btn btn-ghost text-xl font-[Inter]">File Uploader</a>
  </div>
      <button
  className="btn"
  onClick={() => document.getElementById("my_modal_5").showModal()}> Upload</button>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://i.pinimg.com/736x/ab/8d/df/ab8ddf49da46ed16266c4165c35210de.jpg" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>

<dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box border-none mb-5 flex flex-col">
    <h3 className="font-bold text-lg mb-4">Upload your file</h3>
    <form onSubmit={handleSubmit} >
    <div className="w-full max-w-sm flex flex-col gap-4">
      <input type="text" className="input input-bordered" value={fileDescription.name} placeholder="Folder Name" onChange={(e) => setFileDescription((prev) => ({...prev, name: e.target.value}))}/>
      <input
        type="text"
        className="input input-bordered"
        value={fileDescription.description}
        placeholder="Description"
        onChange={(e) => setFileDescription((prev) => ({...prev, description: e.target.value}))}
      />
      <div>
        <input type="file" name="file" ref={fileInputRef} className="file-input file-input-bordered" />
        <p className="text-sm mt-1 text-gray-500">Max size 2MB</p>
      </div>
    </div>
    <button className="btn mt-6" onClick={() => document.getElementById("my_modal_5").close()} type="submit">Upload</button>
      </form>
    <div className="modal-action mt-6">
      <form method="dialog">
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
<Information data={newInformation} />
  </>
    )

}