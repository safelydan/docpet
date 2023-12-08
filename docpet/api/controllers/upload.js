import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/rede/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const uploadController = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ error: 'Nenhum arquivo enviado ou o campo do formulário está incorreto.' });
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'sua_pasta_no_cloudinary',
      allowedFormats: ['jpg', 'png', 'jpeg'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });


    const imageUrl = result.secure_url;
    // console.log('Image URL:', imageUrl);

    if (!imageUrl) {
      console.error('URL da imagem não encontrada após upload para o Cloudinary.');
      res.status(500).json({ error: 'Erro ao obter a URL da imagem.' });
    } else {
      res.status(200).json(imageUrl);
    }
    
  } catch (error) {
    console.error('Erro ao fazer upload para o Cloudinary:', error);
    res.status(500).json({ error: 'Erro ao fazer upload para o Cloudinary.' });
  }
};


