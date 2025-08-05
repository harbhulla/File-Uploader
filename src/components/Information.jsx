import React, { useState } from "react"
export default function Information({data}) {

    const handleDownload = async (e) => {
        e.preventDefault();
         try {
            const response = await fetch("http://localhost:3000/api/download", {
            method: "GET",
            body: data.filename
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`Server error: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        console.log(data);
        } catch (error) {
        console.log("❌ fk it", error);
        }
    }
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
    {data.map((i,index) => (
      <tr key={index}>
        <th>{index}</th>
        <td>{i.path}</td>
        <td>{i.filename}</td>
        <td>{i.size + " byte"}</td>
        <td>{i.uploadTime}</td>
        <td><button type="button" className="cursor-pointer 2 border-2" onClick={(e) => handleDownload(e)}>Click</button></td>
        <td>Blue</td>
      </tr>
    ))}
    </tbody>
  </table>
</div>
    )
}