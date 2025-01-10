const semver = require("semver");

const version = process.argv[2];

if (!version) {
  console.error("No version version provided!");
  process.exit(1);
}

console.log(`The provided version version is: ${version}`);

// Your script logic here

console.log(semver.parse(version));
console.log(createManifestVersions(semver.parse(version)), "string");

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
