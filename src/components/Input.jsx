import { useCookies } from "react-cookie";
import { useState } from "react";

const Input = ({ type, id, placeholder, reference }) => {
  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");
  const [text, updateText] = useState("");

  return (
    <div className="flex w-full items-stretch">
      <input
        required
        ref={reference}
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        {...(
          type === "password"
            ? {
              value: password,
              onChange: (e) => {
                updatePassword(e.target.value)
              },
            }
            : type === "email"
              ? {
                value: email,
                onChange: (e) => updateEmail(e.target.value),
              }
              : type === "text"
                ? {
                  value: text,
                  onChange: (e) => updateText(e.target.value),
                }
                : {})}
        className={`
          w-full px-4 py-3 border border-gray-300/20 border-l-0
          text-black placeholder:text-gray-400 bg-white
          rounded-r-xl focus:outline-none
          caret-primary-green focus:border-primary-green/70
          transition duration-300 ease-in-out
          ${type === "tel" ? "h-[48px]" : "rounded-xl"}
        `}
      />
    </div>
  );
};

export default Input;
