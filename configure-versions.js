const semver = require("semver");
const fs = require("fs");
const path = require("path");

const version = process.argv[2];

if (!version) {
  console.error("No version version provided!");
  process.exit(1);
}

const { rustManifest, tauriManifest } = createManifestVersions(
  semver.parse(version)
);

// update lib
const updatedToml = ensureCargoTomlVersion(
  "./src-tauri/cargo.toml",
  rustManifest
);

// update tauri.base.conf
const updatedJson = ensureTauriConfVersion(
  "./src-tauri/betreiber/tauri.base.conf.json",
  tauriManifest
);
console.log("updatedJson", updatedJson);

// update betreiber
const betreiberDirs = getBetreiberDirNames();

betreiberDirs.forEach((betreiberDir) => {
  betreiberDir.path;
  const updatedToml = ensureCargoTomlVersion(
    `${betreiberDir.path}/cargo.toml`,
    rustManifest
  );
  const updatedJson = ensureTauriConfVersion(
    `${betreiberDir.path}/tauri.conf.json`,
    tauriManifest
  );

  console.log("updated: ", betreiberDir.name);
});

function ensureTauriConfVersion(filePath, version) {
  const tauriConf = JSON.parse(fs.readFileSync(filePath));
  tauriConf.package.version = version;
  fs.writeFileSync(filePath, JSON.stringify(tauriConf, null, 4));
  return tauriConf;
}

function ensureCargoTomlVersion(filePath, version) {
  const cargoToml = fs.readFileSync(filePath, "utf-8");
  const updatedToml = updatedTomlVersion(cargoToml, version);
  fs.writeFileSync(filePath, updatedToml);

  return updatedToml;
}

function createManifestVersions(version) {
  const isTag = version.toString().split("-").length - 1 < 2;

  if (isTag) {
    return {
      rustManifest: version.toString(),
      tauriManifest: `${version.major}.${version.minor}.${version.patch}`, // for cross-platform compatibility, no suffix
    };
  } else if (
    ["RC", "alpha", "beta"].some((v) => version.prerelease.includes(v))
  ) {
    return {
      rustManifest: `${version.major}.${version.minor}.${version.patch}-SNAPSHOT`,
      tauriManifest: `${version.major}.${version.minor}.${version.patch}`, // for cross-platform compatibility, no suffix
    };
  } else {
    const nextMinor = version.minor + 1;
    return {
      rustManifest: `${version.major}.${nextMinor}.0-SNAPSHOT`,
      tauriManifest: `${version.major}.${nextMinor}.0`, // for cross-platform compatibility, no suffix
    };
  }
}

function updatedTomlVersion(toml, version) {
  // Regex to find and replace the version in the [package] table
  const packageTableRegex = /\[package\][\s\S]*?version\s*=\s*['"].*?['"]/;
  const versionLine = `version = "${version}"`;

  return toml.replace(packageTableRegex, (match) =>
    match.replace(/version\s*=\s*['"].*?['"]/, versionLine)
  );
}

function getBetreiberDirNames() {
  const dirPath = path.resolve("src-tauri/betreiber"); // Cross-platform path resolution
  const folderPaths = [];

  // Read the directory contents
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dirPath, entry.name);
      folderPaths.push({
        name: entry.name,
        path: fullPath,
      });
    }
  }

  return folderPaths;
}
