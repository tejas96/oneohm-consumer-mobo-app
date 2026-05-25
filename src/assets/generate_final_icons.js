/* eslint-env node */
const sharp = require('/Volumes/works-space/oneohm/oneohm/node_modules/sharp');
const fs = require('fs');
const path = require('path');

// Target paths
const srcPath = path.join(__dirname, 'Earth_Grid_Logo_Design_202605250023.png');
const androidResDir = path.join(__dirname, '../../android/app/src/main/res');
const iosAppIconDir = path.join(
  __dirname,
  '../../ios/oneohm/Images.xcassets/AppIcon.appiconset',
);

const backgroundColor = { r: 2, g: 7, b: 5, alpha: 1 }; // #020705 (Obsidian Black)
const backgroundColorHex = '#020705';

async function main() {
  if (!fs.existsSync(srcPath)) {
    console.error(`Source image not found at: ${srcPath}`);
    process.exit(1);
  }

  console.log(`Processing source image: ${srcPath}`);
  const image = sharp(srcPath);

  // Get raw pixels to programmatically detect the bounding box of the active logo
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let maxX = 0;
  let minY = info.height;
  let maxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      const alpha = data[idx + 3];
      if (alpha > 5) {
        // Threshold for non-transparent pixels
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    console.error(
      'Could not detect any non-transparent pixels in the source image.',
    );
    process.exit(1);
  }

  const logoWidth = maxX - minX + 1;
  const logoHeight = maxY - minY + 1;
  console.log(
    `Detected logo bounding box: X: ${minX}..${maxX}, Y: ${minY}..${maxY} (${logoWidth}x${logoHeight})`,
  );

  // Crop the source image to the exact square/bounding box of the logo
  const croppedBuffer = await image
    .extract({ left: minX, top: minY, width: logoWidth, height: logoHeight })
    .png()
    .toBuffer();

  // Helper function to resize the cropped logo and composite it on a target canvas
  async function generateIcon({
    targetWidth,
    targetHeight,
    logoScale,
    bgShape,
    outPath,
  }) {
    // Determine the size of the logo relative to the canvas (typically 60% for safe zone)
    const targetLogoSize = Math.round(
      Math.min(targetWidth, targetHeight) * logoScale,
    );

    // Resize logo to fit inside the square container maintaining aspect ratio
    const resizedLogo = await sharp(croppedBuffer)
      .resize(targetLogoSize, targetLogoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    // Composite layers
    const compositeLayers = [];

    // Create background shape if needed
    if (bgShape === 'circle') {
      const radius = targetWidth / 2;
      const circleSvg = Buffer.from(
        `<svg width="${targetWidth}" height="${targetHeight}">
           <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${backgroundColorHex}" />
         </svg>`,
      );
      compositeLayers.push({ input: circleSvg, blend: 'over' });
    } else if (bgShape === 'roundedRect') {
      const rx = Math.round(targetWidth * 0.2); // 20% corner radius
      const rectSvg = Buffer.from(
        `<svg width="${targetWidth}" height="${targetHeight}">
           <rect x="0" y="0" width="${targetWidth}" height="${targetHeight}" rx="${rx}" ry="${rx}" fill="${backgroundColorHex}" />
         </svg>`,
      );
      compositeLayers.push({ input: rectSvg, blend: 'over' });
    }

    // Add the logo layer
    compositeLayers.push({ input: resizedLogo, blend: 'over' });

    // Create base canvas (opaque for square background, transparent for others)
    const baseBackground =
      bgShape === 'square' ? backgroundColor : { r: 0, g: 0, b: 0, alpha: 0 };

    const finalImage = sharp({
      create: {
        width: targetWidth,
        height: targetHeight,
        channels: 4,
        background: baseBackground,
      },
    });

    await finalImage.composite(compositeLayers).png().toFile(outPath);

    console.log(
      `Saved: ${outPath.replace(
        path.join(__dirname, '../../'),
        '',
      )} (${targetWidth}x${targetHeight}, shape: ${bgShape})`,
    );
  }

  // iOS AppIcon specs
  const iosIcons = [
    { name: 'icon-20x20@2x.png', size: 40 },
    { name: 'icon-20x20@3x.png', size: 60 },
    { name: 'icon-29x29@2x.png', size: 58 },
    { name: 'icon-29x29@3x.png', size: 87 },
    { name: 'icon-40x40@2x.png', size: 80 },
    { name: 'icon-40x40@3x.png', size: 120 },
    { name: 'icon-60x60@2x.png', size: 120 },
    { name: 'icon-60x60@3x.png', size: 180 },
    { name: 'icon-1024x1024.png', size: 1024 },
  ];

  console.log('\n--- Generating iOS App Icons (Opaque background #020705) ---');
  if (!fs.existsSync(iosAppIconDir)) {
    fs.mkdirSync(iosAppIconDir, { recursive: true });
  }
  for (const icon of iosIcons) {
    await generateIcon({
      targetWidth: icon.size,
      targetHeight: icon.size,
      logoScale: 0.6, // Sized to 60% of the canvas
      bgShape: 'transparent',
      outPath: path.join(iosAppIconDir, icon.name),
    });
  }

  // Android mipmap specs
  const androidMipmaps = [
    { dir: 'mipmap-mdpi', legacySize: 48, adaptiveSize: 108 },
    { dir: 'mipmap-hdpi', legacySize: 72, adaptiveSize: 162 },
    { dir: 'mipmap-xhdpi', legacySize: 96, adaptiveSize: 216 },
    { dir: 'mipmap-xxhdpi', legacySize: 144, adaptiveSize: 324 },
    { dir: 'mipmap-xxxhdpi', legacySize: 192, adaptiveSize: 432 },
  ];

  console.log('\n--- Generating Android App Icons ---');
  for (const config of androidMipmaps) {
    const dirPath = path.join(androidResDir, config.dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // 1. Legacy ic_launcher.png (Transparent background)
    await generateIcon({
      targetWidth: config.legacySize,
      targetHeight: config.legacySize,
      logoScale: 0.6,
      bgShape: 'transparent',
      outPath: path.join(dirPath, 'ic_launcher.png'),
    });

    // 2. Legacy ic_launcher_round.png (Transparent background)
    await generateIcon({
      targetWidth: config.legacySize,
      targetHeight: config.legacySize,
      logoScale: 0.6,
      bgShape: 'transparent',
      outPath: path.join(dirPath, 'ic_launcher_round.png'),
    });

    // 3. Adaptive ic_launcher_foreground.png (Transparent background)
    await generateIcon({
      targetWidth: config.adaptiveSize,
      targetHeight: config.adaptiveSize,
      logoScale: 0.6, // 60% scale fits safely inside the 66% adaptive icon safe-zone
      bgShape: 'transparent',
      outPath: path.join(dirPath, 'ic_launcher_foreground.png'),
    });
  }

  console.log('\nApp icons generated successfully!');
}

main().catch(console.error);
