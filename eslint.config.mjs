import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

// eslint-config-next 16 ships flat configs directly — no FlatCompat needed.
const config = [
  ...(Array.isArray(coreWebVitals) ? coreWebVitals : [coreWebVitals]),
  ...(Array.isArray(typescript) ? typescript : [typescript]),
  { ignores: ['.next/**', 'node_modules/**', 'design/**', 'scripts/**', '.data/**'] },
];

export default config;
