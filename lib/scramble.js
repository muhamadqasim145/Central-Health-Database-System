// Random-looking text, only used to show "how data looks once encrypted" on screen.
// This is NOT real encryption. Real encryption happens in the backend (lib/encryption.js).
const CH = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789+/";
export const scramble = (n) =>
  Array.from({ length: n }, () => CH[Math.floor(Math.random() * CH.length)]).join("");
