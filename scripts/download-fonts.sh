#!/bin/bash

# Create fonts directory if it doesn't exist
mkdir -p public/fonts

# Download and extract Clash Display fonts
curl -L "https://api.fontshare.com/v2/fonts/download/clash-display" -o clash-display.zip
unzip -j clash-display.zip "ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Regular.woff2" "ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Medium.woff2" "ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Bold.woff2" -d public/fonts/
rm clash-display.zip

# Download and extract Satoshi fonts
curl -L "https://api.fontshare.com/v2/fonts/download/satoshi" -o satoshi.zip
unzip -l satoshi.zip | grep woff2  # First, let's see the correct paths
unzip -j satoshi.zip "*Satoshi-Regular.woff2" "*Satoshi-Medium.woff2" "*Satoshi-Bold.woff2" -d public/fonts/
rm satoshi.zip

# List the contents of the fonts directory to verify
ls -la public/fonts/ 