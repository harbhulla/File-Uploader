export default function Update() {
  console.log("hey");
  return (
    <>
      <fieldset className="fieldset">
        <input
          type="text"
          className="input"
          placeholder="Add a new image to existing folder"
        />
        <p className="label">You can add as many images to this folder</p>
      </fieldset>
    </>
  );
}
