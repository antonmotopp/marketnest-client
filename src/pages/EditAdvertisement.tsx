import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdvertisementDetail, useRequestHandler, useUser } from '@/hooks';
import { advertisementsApi } from '@/api';
import { useAuthStore } from '@/stores';

type Params = {
  id: string;
};

export const EditAdvertisement = () => {
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { data: advertisement, refetch } = useAdvertisementDetail(id);
  const { data: owner } = useUser(advertisement?.user_id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  const { isLoading, requestHandler } = useRequestHandler();

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (!advertisement) return;
    setTitle(advertisement?.title);
    setDescription(advertisement?.description);
    setPrice(advertisement.price.toString());
    setCategory(advertisement.category);
    setExistingPhotos(advertisement.photos || []);
  }, [advertisement]);

  useEffect(() => {
    if (owner && currentUser) {
      if (currentUser?.id !== owner?.id) {
        navigate('/');
      }
    }
  }, [currentUser, owner, navigate]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...filesArray].slice(0, 5));

      e.target.value = '';
    }
  };

  const removeNewPhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllPhotos = () => {
    setPhotos([]);
    setExistingPhotos([]);
  };

  const base64ToFile = async (base64String: string, fileName: string): Promise<File> => {
    const response = await fetch(base64String);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);

    const existingFiles = await Promise.all(
      existingPhotos.map((base64, index) => base64ToFile(base64, `existing_photo_${index}.jpg`))
    );

    const allFiles = [...existingFiles, ...photos];
    allFiles.forEach((photo) => {
      formData.append('photos', photo);
    });

    await requestHandler(() => advertisementsApi.update(advertisement?.id, formData), {
      successMessage: 'Advertisement updated successfully!',
      onSuccess: () => {
        navigate(`/advertisement/${advertisement?.id}`);
        refetch();
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Advertisement</h1>
        <p className="text-gray-600">Fill out the form below to update your listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a descriptive title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your item in detail..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isLoading}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Секція для керування фото */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos Management</label>

          {/* Поточні фото */}
          {existingPhotos.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Current Photos:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                {existingPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Current ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 focus:outline-none"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Current #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Додавання нових фото */}
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <label
                htmlFor="photos"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Photos
              </label>

              {(existingPhotos.length > 0 || photos.length > 0) && (
                <button
                  type="button"
                  onClick={clearAllPhotos}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Clear All Photos
                </button>
              )}
            </div>

            <input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={isLoading || photos.length >= 5}
              className="hidden"
            />
          </div>

          {/* Превью нових фото */}
          {photos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">New Photos to Upload:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 focus:outline-none"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      New #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Click × to remove individual photos. New photos will be added to remaining photos.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => navigate(`/advertisement/${advertisement?.id}`)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Advertisement'}
          </button>
        </div>
      </form>
    </div>
  );
};
