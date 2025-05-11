import { Component } from '@angular/core';
import { UpdateUser } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.css'],
})
export class ChangeAvatarComponent {
  selectedFile: File | null = null;

  constructor(private userService: UsersService) {}

  onFileSelect(event: Event): void {
    const file = event.target as HTMLInputElement;
    if (file.files) {
      this.selectedFile = file.files[0];
    }
  }

  uploadToAzureBlob(file: File): Promise<string> {
    const accountName = 'marketplaceapistorage';
    const containerName = 'user-avatars'; 
    const blobName = new Date().getTime() + '-' + file.name;
    const sasToken =
      'sv=2024-11-04&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2026-05-12T05:47:39Z&st=2025-05-11T21:47:39Z&spr=https&sig=BKz3TDrqmH5axLqxWT0jmFE9hAPSGrvVNqLqy7yIrA8%3D';

    const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

    return fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
      body: file,
    }).then((response) => {
      if (!response.ok) throw new Error('Upload image attempt failed.');
      return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    });
  }

  async sendAvatarChangeRequest(): Promise<void> {
    const userId = localStorage.getItem('userId');

    if (!userId || !this.selectedFile) return;

    const imageUrl = await this.uploadToAzureBlob(this.selectedFile);

    const jsonPatchDocument: UpdateUser[] = [
      {
        op: 'replace',
        path: '/ImageUrl',
        value: imageUrl,
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
