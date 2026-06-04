const major = Number.parseInt(process.versions.node.split(".")[0] || "0", 10);

if (major < 20 || major >= 24) {
  console.error("");
  console.error("Loan Tracker mobile requires Node.js >=20 and <24.");
  console.error(`Current Node.js version: ${process.version}`);
  console.error("");
  console.error("Recommended fix:");
  console.error("  nvm install 22");
  console.error("  nvm use");
  console.error("  npm install");
  console.error("  npx expo start --clear --android");
  console.error("");
  console.error("Node 24 currently crashes Metro/NativeWind file watching with:");
  console.error("Cannot read properties of undefined (reading 'addedFiles')");
  console.error("");
  process.exit(1);
}
