import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const ProfilePictureUpload = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(user?.profile_picture ? `http://localhost:4000${user.profile_picture}` : null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files are allowed');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const response = await api.post(`/users/${user.id}/upload-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      updateUser({ ...user, profile_picture: response.data.fileUrl });
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
      setPreview(user?.profile_picture ? `http://localhost:4000${user.profile_picture}` : null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        
        <label
          htmlFor="profile-picture"
          className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
        >
          📷
        </label>
        <input
          id="profile-picture"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
      </div>
      {uploading && (
        <p className="mt-2 text-sm text-gray-600">Uploading...</p>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
