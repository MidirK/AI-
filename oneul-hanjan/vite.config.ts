import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Codespaces·컨테이너 등 원격 환경에서도 포트 포워딩이 되도록 모든 인터페이스에서 대기
    host: true,
    port: 5173,
  },
});
