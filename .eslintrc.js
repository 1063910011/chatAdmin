module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  globals: {
    page: false,
    REACT_APP_ENV: false,
  },
};
