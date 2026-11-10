const { withProjectBuildGradle } = require('@expo/config-plugins');

const FIREBASE_BOM_VERSION = '34.19.0';
const MARKER = '// VCALL Firebase Android BoM compatibility override';

module.exports = function withFirebaseBomOverride(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      throw new Error('VCALL Firebase BoM override expects the Android root build.gradle to use Groovy.');
    }

    const contents = config.modResults.contents;
    if (!contents.includes(MARKER)) {
      const override = `${MARKER}
project.ext {
  set('react-native', [
    versions: [
      firebase: [
        bom: '${FIREBASE_BOM_VERSION}'
      ]
    ]
  ])
}

`;
      config.modResults.contents = override + contents;
    }
    return config;
  });
};
