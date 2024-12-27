import React from "react";
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: "var(--iconColor)",
  height: 4,
  "& .MuiSlider-track": {
    border: "none",
    borderRadius: 4,
  },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "var(--foreGroundColor)",
    border: "2px solid var(--iconColor)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0 0 0 0.2rem rgba(45, 212, 191, 0.5)",
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
    width: 40,
    height: 40,
    borderRadius: "50%",
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
      <div className="w-3/4 mx-auto">
        <StyledSlider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={valuetext}
          min={min}
          max={max}
          disableSwap
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Min</span>
        <span>Max</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
