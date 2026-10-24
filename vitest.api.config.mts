import { defineConfig } from 'vitest/config';

// API entegrasyon testleri: çalışan bir sunucu (TEST_BASE_URL, varsayılan http://localhost:3000) ve
// .env.local içindeki veritabanı gerekir. Test kendi oluşturduğu kayıtları sonunda siler.
export default defineConfig({
  test: {
    include: ['tests/api/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false
  }
});
