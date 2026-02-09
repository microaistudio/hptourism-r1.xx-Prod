import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const directory = 'client/src/assets/scenic_places';

async function optimizeImages() {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png)$/i)) {
            const filePath = path.join(directory, file);
            const tempPath = path.join(directory, `temp_${file}`);

            const stats = fs.statSync(filePath);
            console.log(`Optimizing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

            try {
                await sharp(filePath)
                    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true }) // standard HD max
                    .jpeg({ quality: 75, mozjpeg: true }) // nice compression
                    .toFile(tempPath);

                fs.unlinkSync(filePath);
                fs.renameSync(tempPath, filePath);

                const newStats = fs.statSync(filePath);
                console.log(`  -> Done: ${(newStats.size / 1024).toFixed(2)} KB`);
            } catch (err) {
                console.error(`  -> Failed to optimize ${file}:`, err);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }
        }
    }
}

optimizeImages().catch(console.error);
