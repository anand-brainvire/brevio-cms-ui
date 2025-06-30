// src/framework/rest/uploadCoverImage.ts
import axios from 'axios';

type UploadCoverImageParams = {
    file: File | string;
    bookUuid: string;
    token: string | null;
};

export const uploadCoverImage = async ({
    file,
    bookUuid,
    token,
}: UploadCoverImageParams) => {
    if (!file || !token) {
        throw new Error('Missing file or token');
    }

    const formData = new FormData();
    formData.append('coverImage', file);
    const response = await axios.post(
        `https://leadtechadminapi.node.brainvire.dev/api/upload/cover-image?bookUuid=${bookUuid}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                // DO NOT set 'Content-Type': multipart/form-data manually!
                // Let the browser handle it (axios auto-sets it with boundary)
            },
        }
    );

    return response.data;
};
