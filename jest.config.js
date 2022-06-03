module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  reporters: ["default", "jest-junit"],
  modulePathIgnorePatterns: ["/dist"],
  transformIgnorePatterns: [
    "/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)",
  ],
  moduleNameMapper: [
    "d3-selection",
    "d3-drag",
    "d3-dispatch",
    "d3-zoom",
    "d3-interpolate",
    "d3-color",
    "d3-transition",
    "d3-timer",
    "d3-ease",
    "d3-scale",
    "d3-array",
    "d3-format",
    "d3-time",
  ].reduce(
    (acc, e) => ({
      ...acc,
      [e]: `<rootDir>/node_modules/${e}/dist/${e}.min.js`,
    }),
    {}
  ),
  /*{
    "d3-selection":
      "<rootDir>/node_modules/d3-selection/dist/d3-selection.min.js",
    "d3-drag": "<rootDir>/node_modules/d3-drag/dist/d3-drag.min.js",
    "d3-dispatch": "<rootDir>/node_modules/d3-dispatch/dist/d3-dispatch.min.js",
    "d3-zoom": "<rootDir>/node_modules/d3-zoom/dist/d3-zoom.min.js",
    "d3-interpolate":
      "<rootDir>/node_modules/d3-interpolate/dist/d3-interpolate.min.js",
    "d3-color": "<rootDir>/node_modules/d3-color/dist/d3-color.min.js",
    "d3-transition":
      "<rootDir>/node_modules/d3-transition/dist/d3-transition.min.js",
    "d3-timer": "<rootDir>/node_modules/d3-timer/dist/d3-timer.min.js",
    "d3-ease": "<rootDir>/node_modules/d3-ease/dist/d3-ease.min.js",
    "d3-scale": "<rootDir>/node_modules/d3-scale/dist/d3-scale.min.js",
    "d3-array": "<rootDir>/node_modules/d3-array/dist/d3-array.min.js",
    "d3-format": "<rootDir>/node_modules/d3-format/dist/d3-format.min.js",
    "d3-time": "<rootDir>/node_modules/d3-time/dist/d3-time.min.js",
  },*/
};
