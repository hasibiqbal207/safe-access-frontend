import { useRef, useState } from "react";

/**
 * Renders a component for uploading and displaying a picture.
 *
 * @param {Object} props - The component props.
 * @param {string} props.readablePicture - The URL of the readable picture.
 * @param {function} props.setReadablePicture - The function to set the readable picture.
 * @param {function} props.setPicture - The function to set the picture.
 * @return {JSX.Element} The rendered component.
 */
const Picture = ({
  readablePicture,
  setReadablePicture,
  setPicture,
}) => {
  const [error, setError] = useState("");
  const inputRef = useRef();

  /**
   * Handles the picture upload event after making necessary validations.
   *
   * @param {Event} e - The event object containing the uploaded picture.
   * @return {void} This function does not return anything.
   */
  const hanldePicture = (e) => {
    let pic = e.target.files[0];
    if (
      pic.type !== "image/jpeg" &&
      pic.type !== "image/png" &&
      pic.type !== "image/webp"
    ) {
      setError(`${pic.name} format is not supported.`);
      return;
    } else if (pic.size > 1024 * 1024 * 5) {
      setError(`${pic.name} is too large, maximum 5mb allowed.`);
      return;
    } else {
      setError("");
      setPicture(pic);
      //reading the picture
      const reader = new FileReader();
      reader.readAsDataURL(pic);
      reader.onload = (e) => {
        setReadablePicture(e.target.result);
      };
    }
  };

/**
 * Resets the picture and readable picture state variables.
 *
 * @return {void} No return value.
 */
  const handleChangePic = () => {
    setPicture("");
    setReadablePicture("");
  };

  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
      <label htmlFor="picture" className="text-sm font-bold tracking-wide">
        Picture (Optional)
      </label>
      {readablePicture ? (
        <div>
          <img
            src={readablePicture}
            alt="Profile picture"
            className="w-20 h-20 object-cover rounded-full"
          />

          {/* change pic */}
          <div
            className="mt-2 w-20 py-1 dark:bg-dark_bg_3 rounded-md text-xs font-bold flex items-center justify-center cursor-pointer"
            onClick={() => handleChangePic()}
          >
            Remove
          </div>
        </div>
      ) : (
        <div
          className="w-full h-12 dark:bg-dark_bg_3 rounded-md font-bold flex items-center justify-center cursor-pointer
        "
          onClick={() => inputRef.current.click()}
        >
          Upload picture
        </div>
      )}
      <input
        type="file"
        name="picture"
        id="picture"
        hidden
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={hanldePicture}
      />

      {/*error*/}
      <div className="mt-2">
        <p className="text-red-400">{error}</p>
      </div>
    </div>
  );
}

export default Picture