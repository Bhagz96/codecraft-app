import '@testing-library/jest-dom';

// Reset localStorage between every test so tests are isolated
beforeEach(() => {
  localStorage.clear();
});
