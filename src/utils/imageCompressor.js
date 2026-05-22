/**
 * Utility to compress an image file and return its Base64 data URL.
 * Resizes the image to fit within MAX_WIDTH and MAX_HEIGHT (800x800px)
 * and compresses it using image/jpeg format at 0.7 quality.
 * 
 * @param {File} file - The image file to compress
 * @returns {Promise<string>} A promise that resolves to the compressed JPEG Base64 data URL
 */
export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal mendapatkan context canvas 2d'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with 0.7 quality for small file size (typically 30-50KB)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
