import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "<your_url_here>",
    supportFile: "cypress/support/e2e.js",
  },
  env: {
    login_email: "rrgizzcrzbwxoldzrf@cazlq.com",
    login_password: "Password123!",
  },
});
