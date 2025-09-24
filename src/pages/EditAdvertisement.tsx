import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdvertisementById, useRequestHandler, useUser } from '@/hooks';
import { advertisementsApi } from '@/api';
import { useAuthStore } from '@/stores';

type Params = {
  id: string;
};

export const EditAdvertisement = () => {
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { data: advertisement, refetch, isLoading: adLoading } = useAdvertisementById(id);
  const { data: owner } = useUser(advertisement?.user_id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const { isLoading, requestHandler } = useRequestHandler();

  const categories = [
    { value: 'electronics', label: 'Electronics', icon: '📱' },
    { value: 'furniture', label: 'Furniture', icon: '🪑' },
    { value: 'clothing', label: 'Clothing', icon: '👕' },
    { value: 'books', label: 'Books', icon: '📚' },
    { value: 'sports', label: 'Sports & Recreation', icon: '⚽' },
    { value: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { value: 'other', label: 'Other', icon: '📦' },
  ];

  useEffect(() => {
    if (!advertisement) return;
    setTitle(advertisement?.title || '');
    setDescription(advertisement?.description || '');
    setPrice(advertisement.price?.toString() || '');
    setCategory(advertisement.category || '');
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
      const validFiles = filesArray.filter((file) => file.type.startsWith('image/'));
      const totalPhotos = existingPhotos.length + photos.length + validFiles.length;
      if (totalPhotos <= 5) {
        setPhotos((prev) => [...prev, ...validFiles]);
      }
      e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = filesArray.filter((file) => file.type.startsWith('image/'));
      const totalPhotos = existingPhotos.length + photos.length + validFiles.length;
      if (totalPhotos <= 5) {
        setPhotos((prev) => [...prev, ...validFiles]);
      }
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

  const isFormValid = title.trim() && description.trim() && price && category;
  const selectedCategory = categories.find((cat) => cat.value === category);
  const totalPhotos = existingPhotos.length + photos.length;

  if (adLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-300 rounded-2xl mx-auto mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
            </div>
            <div className="bg-white/80 rounded-3xl p-8">
              <div className="space-y-6">
                <div className="h-12 bg-gray-300 rounded-xl"></div>
                <div className="h-32 bg-gray-300 rounded-xl"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-12 bg-gray-300 rounded-xl"></div>
                  <div className="h-12 bg-gray-300 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Edit Your Advertisement</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Update your advertisement details to keep it current and attractive to buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    placeholder="What are you selling?"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="text-xs text-gray-500">{title.length}/100 characters</div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    rows={6}
                    placeholder="Describe your item in detail..."
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                  <div className="text-xs text-gray-500">{description.length}/1000 characters</div>
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        $
                      </div>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        max="999999.99"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={isLoading}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                      >
                        <option value="">Choose a category</option>
                        {categories.map(({ value, label, icon }) => (
                          <option key={value} value={value}>
                            {icon} {label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Management */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">
                      Photos <span className="text-gray-500 font-normal">(max 5)</span>
                    </label>
                    <div className="text-xs text-gray-500">{totalPhotos}/5 photos</div>
                  </div>

                  {/* Current Photos */}
                  {existingPhotos.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Current Photos</h4>
                        <button
                          type="button"
                          onClick={() => setExistingPhotos([])}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Remove All Current
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {existingPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                              <img
                                src={photo}
                                alt={`Current ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeExistingPhoto(index)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>

                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full text-center">
                                Current #{index + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Photos Upload */}
                  {totalPhotos < 5 && (
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                        dragActive
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        id="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoChange}
                        disabled={isLoading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />

                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
                          <svg
                            className="w-8 h-8 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>

                        <div>
                          <p className="text-gray-700 font-medium">
                            Drop new photos here or click to browse
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* New Photos Preview */}
                  {photos.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">New Photos to Add</h4>
                        <button
                          type="button"
                          onClick={() => setPhotos([])}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Remove All New
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`New ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeNewPhoto(index)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>

                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full text-center">
                                New #{index + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear All Button */}
                  {(existingPhotos.length > 0 || photos.length > 0) && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={clearAllPhotos}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Clear All Photos
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => navigate(`/advertisement/${advertisement?.id}`)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Update Listing
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview
              </h3>

              <div className="space-y-3">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  {existingPhotos[0] || photos[0] ? (
                    <img
                      src={existingPhotos[0] || (photos[0] && URL.createObjectURL(photos[0]))}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">No photo</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">{title || 'Your listing title'}</h4>
                  <p className="text-lg font-bold text-amber-600">
                    {price ? `$${price}` : '$0.00'}
                  </p>
                  {selectedCategory && (
                    <div className="inline-flex items-center mt-2 px-2 py-1 bg-amber-100 rounded-full text-xs">
                      <span className="mr-1">{selectedCategory.icon}</span>
                      {selectedCategory.label}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Update Tips */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Update Tips
              </h3>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Keep photos current and add new angles if available</p>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Update condition details if they've changed</p>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Adjust price based on market feedback</p>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Refresh your listing to boost visibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
