export default function Delete() {
  console.log("hey");
  return (
    <>
      <fieldset className="fieldset">
        <input type="text" className="input" placeholder="Delete folder" />
        <p className="label">Once you delete folder, it's gone</p>
      </fieldset>
    </>
  );
}
