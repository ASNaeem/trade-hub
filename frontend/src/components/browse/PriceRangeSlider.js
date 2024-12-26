import React from "react";
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: "#3b82f6", // Tailwind blue-500
  height: 3,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 18,
    width: 18,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#3b82f6",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
}));

const PriceRangeSlider = ({ value, onChange, min = 0, max = 1000 }) => {
  // Format the value label to show price
  const valuetext = (value) => `$${value}`;

  // Handle slider change
  const handleChange = (event, newValue) => {
    onChange({
      minPrice: newValue[0],
      maxPrice: newValue[1],
    });
  };

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
      <StyledSlider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        valueLabelFormat={valuetext}
        min={min}
        max={max}
        disableSwap
      />
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Min</span>
        <span>Max</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
