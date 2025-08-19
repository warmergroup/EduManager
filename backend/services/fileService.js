import { Client, Storage, Databases } from 'node-appwrite';

class FileService {
  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    this.storage = new Storage(this.client);
    this.databases = new Databases(this.client);
    this.bucketId = process.env.APPWRITE_BUCKET_ID;
  }

  // Fayl yuklash
  async uploadFile(file, folder = 'general') {
    try {
      const fileName = `${folder}/${Date.now()}_${file.originalname}`;
      
      const result = await this.storage.createFile(
        this.bucketId,
        fileName,
        file.buffer
      );

      return {
        success: true,
        fileId: result.$id,
        fileName: result.name,
        size: result.size,
        mimeType: result.mimeType,
        url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${result.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Fayl o'chirish
  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(this.bucketId, fileId);
      return { success: true };
    } catch (error) {
      console.error('File deletion error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Fayl ma'lumotlarini olish
  async getFileInfo(fileId) {
    try {
      const file = await this.storage.getFile(this.bucketId, fileId);
      return {
        success: true,
        file: {
          id: file.$id,
          name: file.name,
          size: file.size,
          mimeType: file.mimeType,
          url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
        }
      };
    } catch (error) {
      console.error('Get file info error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Fayl URL'ini olish
  getFileUrl(fileId) {
    return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
  }
}

export default new FileService();
