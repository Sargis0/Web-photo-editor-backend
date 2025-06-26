// server/routes/photos.js
const router = require('express').Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ filename: req.file.filename });
});

router.post('/edit', async (req, res) => {
    const { filename, action } = req.body;
    const filepath = path.join(__dirname, '../uploads', filename);

    const outputName = `edited-${action}-${filename}`;
    const output = path.join(__dirname, '../uploads', outputName);

    try {
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        let img = sharp(filepath);
        switch (action) {
            case 'crop':
                const metadata = await img.metadata();
                if (metadata.width < 200 || metadata.height < 200) {
                    return res.status(400).json({ error: 'Image too small to crop' });
                }
                img = img.extract({ left: 0, top: 0, width: 200, height: 200 });
                break;
            case 'resize':
                img = img.resize(300, 300);
                break;
            case 'bw':
                img = img.grayscale();
                break;
            case 'pixelate':
                img = img.resize(10, 10).resize(300, 300, { kernel: sharp.kernel.nearest });
                break;
            default:
                return res.status(400).json({ error: 'Unknown action' });
        }

        await img.toFile(output);
        res.json({ filename: outputName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Editing failed' });
    }
});

module.exports = router;
