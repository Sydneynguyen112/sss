export async function downscaleImage(file: File, maxBytes = 200_000): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("downscaleImage runs in browser only");
  }
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);

  // Already small enough
  if (file.size <= maxBytes) return dataUrl;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  let scale = 1;
  let result = dataUrl;
  for (let i = 0; i < 6; i++) {
    scale *= 0.75;
    canvas.width = Math.max(1, Math.floor(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.floor(img.naturalHeight * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    result = canvas.toDataURL("image/jpeg", 0.82);
    if (result.length * 0.75 <= maxBytes) break;
    if (canvas.width < 320) break;
  }
  return result;
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function readVideoAsDataURL(file: File, maxBytes = 2_000_000): Promise<string | null> {
  if (file.size > maxBytes) return null;
  return readAsDataURL(file);
}
