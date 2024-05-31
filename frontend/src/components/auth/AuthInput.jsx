import React from 'react'

/**
 * Renders a custom input field with a label and error message.
 *
 * @param {Object} props - The props object containing the following properties:
 *   - name {string} - The name of the input field.
 *   - type {string} - The type of the input field.
 *   - placeholder {string} - The placeholder text for the input field.
 *   - register {function} - The register function from the useForm hook.
 *   - error {string} - The error message to display if there is an error.
 * @return {JSX.Element} The rendered input field component.
 */
const AuthInput = ({
  name,
  type,
  placeholder,
  register,
  error,
}) => {
  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
      <label htmlFor={name} className="text-sm font-bold tracking-wide">
        {placeholder}
      </label>
      <input
        className="w-full dark:bg-dark_bg_3 text-base py-2 px-4 rounded-lg outline-none"
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      {error && <p className="text-red-400">{error}</p>}
    </div>
  )
}

export default AuthInput