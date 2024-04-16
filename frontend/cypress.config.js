import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://main.dmcvp4nfj9t9x.amplifyapp.com/",
    supportFile: "cypress/support/e2e.js",
  },
  env: {
    login_email: "rrgizzcrzbwxoldzrf@cazlq.com",
    login_password: "Password123!",
  },
});
