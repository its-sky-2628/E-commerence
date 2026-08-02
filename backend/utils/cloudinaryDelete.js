const cloudinary = require("../config/cloudinary");

const getPublicIdFromUrl = (url) => {
    try {
        const marker = "/upload/";
        const index = url.indexOf(marker);

        if (index === -1) return null;

        let publicId = url.substring(
            index + marker.length
        );

        // Remove Cloudinary transformation/version
        publicId = publicId.replace(
            /^v\d+\//,
            ""
        );

        // Remove extension
        publicId = publicId.replace(
            /\.[^/.]+$/,
            ""
        );

        return publicId;
    } catch {
        return null;
    }
};

const deleteFromCloudinary = async (url) => {
    if (
        !url ||
        !url.startsWith("http")
    ) {
        return;
    }

    const publicId =
        getPublicIdFromUrl(url);

    if (!publicId) return;

    await cloudinary.uploader.destroy(
        publicId
    );
};

module.exports = deleteFromCloudinary;
