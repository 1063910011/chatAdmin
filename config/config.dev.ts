// https://umijs.org/config/
import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    'process.env': {
      API_HOST_URL: 'http://127.0.0.1:8000/',
    },
  },
});
