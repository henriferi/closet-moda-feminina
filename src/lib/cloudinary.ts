export const uploadToCloudinary = async (file: File): Promise<string> => {

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const uploadUrl = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset); 

    const res = await fetch(
        uploadUrl,
        { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!data.secure_url) {
        throw new Error("Erro ao enviar imagem.");
    }

    return data.secure_url; // URL final da imagem
};
