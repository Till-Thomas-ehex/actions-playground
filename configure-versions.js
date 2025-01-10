const spawn = require("cross-spawn");
const semver = require("semver");

const result = spawn.sync("git describe --exact-match --tags");
console.error(result.stderr?.toString("utf8"));

const version = result.stdout?.toString("utf8");
console.log(version);

console.log(semver.parse(version));
console.log(createManifestVersions(semver.parse(version)), "string");

function createManifestVersions(version) {
  const isTag = version.toString().split("-").length - 1 < 2;

  if (isTag) {
    console.log("isTag");

    return {
      rustManifest: version.toString(),
      tauriManifest: `${version.major}.${version.minor}.${version.patch}`, // for cross-platform compatibility, no suffix
    };
  } else if (
    ["RC", "alpha", "beta"].some((v) => version.prerelease.includes(v))
  ) {
    console.log("RC alpha beta");

    return {
      rustManifest: `${version.major}.${version.minor}.${version.patch}-SNAPSHOT`,
      tauriManifest: `${version.major}.${version.minor}.${version.patch}`, // for cross-platform compatibility, no suffix
    };
  } else {
    console.log("else");

    const nextMinor = version.minor + 1;
    return {
      rustManifest: `${version.major}.${nextMinor}.0-SNAPSHOT`,
      tauriManifest: `${version.major}.${nextMinor}.0`, // for cross-platform compatibility, no suffix
    };
  }
}
