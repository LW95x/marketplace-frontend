import { Component } from '@angular/core';
import { UpdateUser } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.css'],
})
export class ChangeAvatarComponent {
  selectedFile: File | null = null;
  imagePreviews: string[] = [];
  imageUrl: string = '';

  private blobClient: HttpClient;

  constructor(private userService: UsersService, handler: HttpBackend) {
    this.blobClient = new HttpClient(handler);
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  onFileSelect(event: Event): void {
    const file = event.target as HTMLInputElement;
    if (file.files) {
      this.selectedFile = file.files[0];
    }
  }

  onImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          this.imagePreviews.push(result);

          this.uploadImage(file);
        };

        reader.readAsDataURL(file);
      });
    }
  }

  uploadImage(file: File): void {
      const fileName = `${Date.now()}-${file.name}`;
      const sasToken =
        'sv=2024-11-04&ss=b&srt=o&sp=wc&se=2027-07-28T18:13:04Z&st=2025-07-28T09:58:04Z&spr=https,http&sig=uB8VbdTVfTMTxklGHPIhoWZxypBPo2PXY8Y5u7q1B%2F8%3D';
      const blobUrl = `https://marketplaceapistorage.blob.core.windows.net/user-avatars/${fileName}?${sasToken}`;
  
      const headers = new HttpHeaders({
        'x-ms-blob-type': 'BlockBlob',
        'x-ms-version': '2024-11-04',
        'Content-Type': file.type,
      });
  
      this.blobClient.put(blobUrl, file, { headers }).subscribe({
        next: () => {
          console.log('Image was uploaded to storage successfully.');
          const publicUrl = `https://marketplaceapistorage.blob.core.windows.net/user-avatars/${fileName}`;
          this.imageUrl = publicUrl;
        },
        error: (err: Error) => {
          console.error('Image upload failed,', err);
        },
      });
    }

  sendAvatarChangeRequest(): void {
    const userId = localStorage.getItem('userId');

    if (!userId || !this.imageUrl) return;

    const jsonPatchDocument: UpdateUser[] = [
      {
        op: 'replace',
        path: '/ImageUrl',
        value: this.imageUrl,
      },
    ];

    if (userId) {
      this.userService.updateUser(userId, jsonPatchDocument).subscribe({
        next: () => {
          console.log('User Avatar was succesfully updated.');
        },
        error: (err) => {
          console.error('Failed to update user Avatar.', err);
        },
      });
    }
  }
}
