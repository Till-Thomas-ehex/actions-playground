const semver = require("semver");
const createManifestVersions = require("./create-manifest-versions");

const testCases = [
  {
    case: "real release tag",
    gitVersion: "1.2.3",
    expectedRust: "1.2.3",
    expectedTauri: "1.2.3",
  },
  {
    case: "modified workspace",
    gitVersion: "1.0.3-6-gb272186-modified",
    expectedRust: "1.1.0-SNAPSHOT",
    expectedTauri: "1.1.0",
  },
  {
    case: "after release tag",
    gitVersion: "0.111.3-1-gd37e4b2",
    expectedRust: "0.112.0-SNAPSHOT",
    expectedTauri: "0.112.0",
  },
  {
    case: "after pre-release tag",
    gitVersion: "1.0.3-RC3-6-gb272186-modified",
    expectedRust: "1.0.3-SNAPSHOT",
    expectedTauri: "1.0.3",
  },
  {
    case: "after invalid pre-release tag",
    gitVersion: "1.0.3-INVALID2-6-gb272186-modified",
    expectedRust: "1.1.0-SNAPSHOT",
    expectedTauri: "1.1.0",
  },
  {
    case: "on alpha tag",
    gitVersion: "2.0.0-alpha.1",
    expectedRust: "2.0.0-alpha.1",
    expectedTauri: "2.0.0",
  },
  {
    case: "after alpha tag",
    gitVersion: "2.0.0-alpha.16-gb272186-modified",
    expectedRust: "2.0.0-SNAPSHOT",
    expectedTauri: "2.0.0",
  },
];

testCases.forEach(
  ({ case: testCase, gitVersion, expectedRust, expectedTauri }) => {
    const version = semver.parse(gitVersion, {});

    const versions = createManifestVersions(version);

    if (versions.rustManifest !== expectedRust) {
      throw new Error(
        `Failed Rust version for ${testCase}: expected ${expectedRust}, got ${versions.rustManifest}`
      );
    }

    if (versions.tauriManifest !== expectedTauri) {
      throw new Error(
        `Failed Tauri version for ${testCase}: expected ${expectedTauri}, got ${versions.tauriManifest}`
      );
    }
  }
);

console.log("All tests passed!");
