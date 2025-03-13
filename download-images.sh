#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p public/images

# Download images with proper error handling
download_image() {
    local url=$1
    local output=$2
    
    echo "Downloading $output..."
    if curl -L --fail "$url" -o "$output"; then
        echo "Successfully downloaded $output"
        chmod 644 "$output"
    else
        echo "Failed to download $output"
        return 1
    fi
}

# Download logo
download_image "https://media.licdn.com/dms/image/v2/C4E0BAQHcYbdgkNRleg/company-logo_200_200/0/1630936057141" "public/images/ailaaj-logo.png"

# Download cover
download_image "https://media.licdn.com/dms/image/v2/C4D1BAQGt7eXQy2gdtQ/company-background_10000/company-background_10000/0/1631194569014/ailaaj_cover" "public/images/ailaaj-cover.png"

echo "Verifying images..."
ls -l public/images/
