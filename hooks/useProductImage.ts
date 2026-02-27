
import { useState, useEffect } from 'react';
import { PRODUCT_IMAGE_DATABASE, isPlaceholderImage } from '../constants';

export const useProductImage = (productName: string, initialUrl: string) => {
    // We prioritize the database image if it exists.
    // If not, we use the initialUrl (which might be a generic placeholder or a direct link).
    // This hook is now synchronous and instant, but we keep the signature for compatibility.
    
    const [imageUrl, setImageUrl] = useState(initialUrl);
    
    useEffect(() => {
        const dbImage = PRODUCT_IMAGE_DATABASE[productName];
        
        if (dbImage) {
            setImageUrl(dbImage);
        } else {
            // If the initial URL is a placeholder and we don't have a DB image,
            // it will stay as the placeholder (which is fine, better than a broken link).
            setImageUrl(initialUrl);
        }
    }, [productName, initialUrl]);

    return { imageUrl, isLoading: false };
};
