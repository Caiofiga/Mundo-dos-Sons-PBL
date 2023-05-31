import React, { useState } from "react";
import "../css/login.css";

interface CheckboxOptionProps {
  title: string;
  classN: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({
  title,
  onChange,
  classN,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
    onChange(event);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="atividades"
          value={title}
          checked={isChecked}
          onChange={handleChange}
        />
        <span>{title}</span>
      </label>
    </div>
  );
};

export default CheckboxOption;
