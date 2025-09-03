import { Client, Storage, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';

class FileService {
  constructor() {
    // Validate required environment variables
    if (!process.env.APPWRITE_ENDPOINT) {
      throw new Error('APPWRITE_ENDPOINT environment variable is required');
    }
    if (!process.env.APPWRITE_PROJECT_ID) {
      throw new Error('APPWRITE_PROJECT_ID environment variable is required');
    }
    if (!process.env.APPWRITE_API_KEY) {
      throw new Error('APPWRITE_API_KEY environment variable is required');
    }
    if (!process.env.APPWRITE_BUCKET_ID) {
      throw new Error('APPWRITE_BUCKET_ID environment variable is required');
    }

    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID);

    this.storage = new Storage(this.client);
    this.bucketId = process.env.APPWRITE_BUCKET_ID;
    
    console.log('✅ FileService initialized with:', {
      endpoint: process.env.APPWRITE_ENDPOINT,
      projectId: process.env.APPWRITE_PROJECT_ID,
      bucketId: this.bucketId
    });
  }

  // Fayl yuklash - MEVN app'dagi usul bilan
  async uploadFile(file, folder = 'general') {
    try {
      if (!file || !file.buffer) {
        throw new Error('Fayl tanlanmadi yoki noto\'g\'ri formatda');
      }

      const filename = `${Date.now()}_${file.originalname}`;
      const uploadsDir = path.join(process.cwd(), 'uploads');

      // Uploads papkasini yaratish
      if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, filename);
      
      // Faylni vaqtincha saqlash
      await fs.promises.writeFile(filePath, file.buffer);

      // FormData yaratish
      const form = new FormData();
      form.append('fileId', ID.unique());
      form.append('file', fs.createReadStream(filePath));

      // Appwrite'ga yuklash
      const { data } = await axios.post(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
          },
        }
      );

      if (!data.$id) {
        throw new Error(`Fayl yuklash muvaffaqiyatsiz: ${data.message}`);
      }

      // Vaqtincha faylni o'chirish
      await fs.promises.unlink(filePath);

      console.log('✅ File uploaded successfully:', {
        fileId: data.$id,
        fileName: file.originalname,
        size: file.size
      });

      return {
        success: true,
        fileId: data.$id,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileUrl: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${data.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
      };
    } catch (error) {
      console.error('❌ File upload error:', error);
      console.error('File object:', {
        originalname: file?.originalname,
        mimetype: file?.mimetype,
        size: file?.size,
        hasBuffer: !!file?.buffer
      });
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Fayl o'chirish
  async deleteFile(fileId) {
    try {
      const { data } = await axios.delete(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}`,
        {
          headers: {
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
          },
        }
      );

      console.log('✅ File deleted successfully:', fileId);
      return { success: true, data };
    } catch (error) {
      console.error('❌ File deletion error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Fayl ma'lumotlarini olish
  async getFileInfo(fileId) {
    try {
      const { data } = await axios.get(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}`,
        {
          headers: {
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
          },
        }
      );

      return {
        success: true,
        file: {
          id: data.$id,
          name: data.name,
          size: data.size,
          mimeType: data.mimeType,
          url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${data.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
        }
      };
    } catch (error) {
      console.error('❌ Get file info error:', error);
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
