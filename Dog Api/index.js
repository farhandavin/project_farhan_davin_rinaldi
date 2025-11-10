import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import 'dotenv/config';

const app = express();
const port = 3000;

// Gunakan dotenv untuk mengambil URL API dari file .env
const dogApiUrl = process.env.DOG_API_URL;

// Middleware untuk menyajikan file statis dari folder 'public'
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Rute utama untuk menampilkan halaman
app.get("/", async (req, res) => {
    try {
        // Lakukan request GET ke Dog API untuk mendapatkan gambar acak
        const response = await axios.get(dogApiUrl);
        const imageUrl = response.data.message; // URL gambar ada di properti 'message'

        // Render halaman EJS dan kirim URL gambar
        res.render("index.ejs", {
            dog: imageUrl
        });

    } catch (error) {
        // Tangani jika terjadi error saat mengambil data dari API
        console.error("Gagal mengambil data:", error.message);
        res.status(500).send("Terjadi kesalahan saat memuat gambar.");
    }
});

// Jalankan server di port yang ditentukan
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});