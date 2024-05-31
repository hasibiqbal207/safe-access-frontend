import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Only un-comment when you are using npm run preview
  // preview: {
  //   host: true,
  //   port: 8080
  // }
})
