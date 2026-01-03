// API base URL - production'da environment variable'dan gelecek
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Profile picture URL'ini oluştur
// Eğer URL zaten http ile başlıyorsa doğrudan kullan, değilse API_URL ekle
export const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture) return null;
  if (profilePicture.startsWith('http')) return profilePicture;
  return `${API_URL}${profilePicture}`;
};

// Genel dosya URL'i oluştur
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  return `${API_URL}${filePath}`;
};
