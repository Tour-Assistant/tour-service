module.exports = {
  preset: "jest-dynalite",
  verbose: true,
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "json", "ts"],
  roots: ["src"],
  testRegex: ".test.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
  },
};
