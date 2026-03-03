import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const nextVitalsArr = Array.isArray(nextVitals) ? nextVitals : [nextVitals];
const nextTsArr = Array.isArray(nextTs) ? nextTs : [nextTs];

export default [...nextVitalsArr, ...nextTsArr];
