import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ONLY add this if your repo is NOT yourusername.github.io
  // Replace 'devops-portfolio' with your actual repository name
  base: '/portfolio/',
})