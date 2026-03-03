import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { api } from '../lib/api'
import type { ProductImage } from '../types'

interface ImageUploadProps {
  productId: string
  images: ProductImage[]
  onImagesChange: (images: ProductImage[]) => void
}

export default function ImageUpload({ productId, images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      for (const file of Array.from(files) as File[]) {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('product_id', productId)
        formData.append('display_order', String(images.length))
        formData.append('is_primary', String(images.length === 0))

        const newImage = await api.post<ProductImage>('/api/admin/upload/product-image', formData)
        onImagesChange([...images, newImage])
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '上傳失敗')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (image: ProductImage) => {
    if (!confirm('確定要刪除此圖片嗎？')) return

    try {
      await api.delete(`/api/admin/upload/${image.storage_path}`)
      onImagesChange(images.filter(img => img.id !== image.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : '刪除失敗')
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">商品圖片</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            {img.is_primary && (
              <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                主圖
              </span>
            )}
            <button
              onClick={() => handleDelete(img)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !productId}
          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          ) : (
            <>
              <Upload className="h-6 w-6 mb-1" />
              <span className="text-xs">上傳圖片</span>
            </>
          )}
        </button>
      </div>

      {!productId && (
        <p className="text-sm text-amber-600 mt-2">請先儲存商品後再上傳圖片</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  )
}
