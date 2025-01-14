const semver = require("semver");

function createManifestVersions(version) {
  version = semver.parse(version);
  const isTag = version.toString().split("-").length - 1 < 2;

  console.log("version", version);

  if (isTag) {
    return {
      rustManifest: version.toString(),
      tauriManifest: `${version.major}.${version.minor}.${version.patch}`, // for cross-platform compatibility, no suffix
    };
  } else if (
    ["RC", "alpha", "beta"].some((v) =>
      version.prerelease.some((prereleaseString) =>
        prereleaseString.includes(v)
      )
    )
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

module.exports = createManifestVersions;
