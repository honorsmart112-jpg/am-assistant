/**
 * Processes an image URL/Base64 to generate 1:1 and 9:16 crops.
 */
export const processImage = async (imageUrl: string): Promise<{ square: string, story: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const square = cropImage(img, 1, 1080, 1080);
      const story = cropImage(img, 9 / 16, 1080, 1920);
      resolve({ square, story });
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
};

const cropImage = (img: HTMLImageElement, aspectRatio: number, targetW: number, targetH: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // White background (in case of transparency or padding)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetW, targetH);

  const imgAspect = img.width / img.height;
  
  let drawX = 0, drawY = 0, drawW = 0, drawH = 0;

  if (imgAspect > aspectRatio) {
    // Image is wider than target
    drawH = targetH;
    drawW = targetH * imgAspect;
    drawX = (targetW - drawW) / 2; // Center horizontally
  } else {
    // Image is taller than target
    drawW = targetW;
    drawH = targetW / imgAspect;
    drawY = (targetH - drawH) / 2; // Center vertically
  }

  // Draw image to fit/cover
  // Strategy: "Cover" logic usually looks better for ads
  // If we want "Contain", we swap logic. Let's do a smart "Cover" focused on center.
  
  // Re-calculating for "Cover" style (Zoom to fill)
  if (imgAspect > aspectRatio) {
      // Image is wider, fit height, crop sides
      const scale = targetH / img.height;
      const scaledW = img.width * scale;
      const offsetX = (scaledW - targetW) / 2;
      ctx.drawImage(img, -offsetX, 0, scaledW, targetH);
  } else {
      // Image is taller, fit width, crop top/bottom
      const scale = targetW / img.width;
      const scaledH = img.height * scale;
      const offsetY = (scaledH - targetH) / 2;
      ctx.drawImage(img, 0, -offsetY, targetW, scaledH);
  }

  return canvas.toDataURL('image/jpeg', 0.9);
};
