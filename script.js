// File: server.js (Backend Node.js)
const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint untuk menerima kode dan memproses video
app.post('/render-video', (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).send('Kode Remotion tidak boleh kosong');
    }

    // 1. Timpa file Composition.tsx dengan kode dari HP Anda
    const componentPath = path.join(__dirname, 'src', 'Composition.tsx');
    fs.writeFileSync(componentPath, code);

    console.log('Memulai proses rendering...');

    // 2. Jalankan perintah render Remotion via terminal server
    // Ganti "MyComp" dengan nama komponen utama (ID) di Remotion Anda
    exec('npx remotion render src/index.ts MyComp out/video.mp4', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Gagal merender video.');
        }

        console.log('Render selesai!');
        
        // 3. Kirim file MP4 kembali ke pengguna
        const videoPath = path.join(__dirname, 'out', 'video.mp4');
        res.download(videoPath, 'hasil-remotion.mp4', (err) => {
            if (err) console.error("Gagal mengirim file:", err);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
