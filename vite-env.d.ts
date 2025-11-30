// Removed vite/client reference to fix type definition error
// Declaring process.env to support API_KEY access
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: any;
  }
};
