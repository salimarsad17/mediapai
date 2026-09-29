/**
 * Image Utilities for Google Drive URL Conversion, Compression, and Aspect Fit
 */

/**
 * Extracts Google Drive File ID from various link formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 * - https://docs.google.com/file/d/FILE_ID/...
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // Pattern 1: /file/d/([a-zA-Z0-9_-]+)
  const matchFileD = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]{15,})/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: id=([a-zA-Z0-9_-]+)
  const matchIdParam = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]{15,})/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // Pattern 3: /d/([a-zA-Z0-9_-]+)
  const matchD = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]{15,})/);
  if (matchD && matchD[1]) return matchD[1];

  // Pattern 4: loose match for drive.google.com
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    const matchLoose = cleanUrl.match(/([a-zA-Z0-9_-]{25,})/);
    if (matchLoose && matchLoose[1]) return matchLoose[1];
  }

  return null;
}

/**
 * Checks if a string is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.toLowerCase().trim();
  return (
    clean.includes('drive.google.com') ||
    clean.includes('docs.google.com') ||
    clean.includes('drive.usercontent.google.com')
  );
}

/**
 * Converts any Google Drive link to a direct embeddable image URL.
 * Uses Google's thumbnail endpoint with sz=w1200 for crisp, high-res direct image rendering
 * which avoids 403 hotlink blocks and bypasses preview HTML wrappers.
 */
export function normalizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();

  // If it's already a data URL or blob URL, return as is
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  const driveId = extractGoogleDriveFileId(cleanUrl);
  if (driveId) {
    // sz=w1200 ensures high resolution without pixelation, works directly in <img> tags
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
  }

  return cleanUrl;
}

/**
 * Alternative Google Drive direct image URL if primary thumbnail hits rate limits
 */
export function getAlternateDriveUrl(url: string): string {
  const driveId = extractGoogleDriveFileId(url);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}=w1000`;
  }
  return normalizeImageUrl(url);
}

/**
 * Default fallback avatar if image fails to load or is empty
 */
export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80';

export const DEFAULT_STUDENT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

/**
 * Compresses an image file (e.g. from Google Drive download or camera)
 * to a lightweight Base64 string (< 100KB) to ensure fast rendering and avoid LocalStorage quota limits.
 */
export function compressImageFile(file: File, maxDimension: number = 800, quality: number = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan berkas gambar'));
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas'));
    reader.readAsDataURL(file);
  });
}
