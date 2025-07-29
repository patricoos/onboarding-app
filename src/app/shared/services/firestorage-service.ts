import { inject, Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class FirestorageService {
    private storage = inject(Storage);

    async uploadFile(id: string, file: File): Promise<string> {
        const fileRef = ref(this.storage, `uploads/${id}-${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        return url;
    }

    async deleteFile(filePath: string) {
        const fileRef = ref(this.storage, filePath);
        return deleteObject(fileRef);
    }
}
