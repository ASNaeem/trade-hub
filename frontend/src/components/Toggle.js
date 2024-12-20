// import React from "react";

// export default function Toggle({ label, description, enabled, onChange }) {
//   return (
//     <div className="flex items-center justify-between">
//       <div>
//         <h4 className="text-sm font-medium text-gray-900">{label}</h4>
//         <p className="text-sm text-gray-500">{description}</p>
//       </div>
//       <button
//         type="button"
//         className={`${
//           enabled ? "bg-blue-600" : "bg-gray-200"
//         } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//         role="switch"
//         aria-checked={enabled}
//         onClick={onChange}
//       >
//         <span
//           aria-hidden="true"
//           className={`${
//             enabled ? "translate-x-5" : "translate-x-0"
//           } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
//         />
//       </button>
//     </div>
//   );
// }
