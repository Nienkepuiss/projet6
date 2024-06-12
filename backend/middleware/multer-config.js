const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

// Configurer les options de stockage pour multer
const storage = multer.diskStorage({
  // Définir la destination des fichiers téléchargés
  destination: (req, file, callback) => {
      callback(null, 'images');
  },
  // Définir le nom de fichier pour les fichiers téléchargés
  filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
  }
});

// Créer le middleware de téléchargement multer avec les options de stockage spécifiées et les restrictions de fichier
const upload = multer({
  storage: storage,
  // Définir une limite de taille de fichier de 4 Mo
  limits: { fileSize: 4 * 1024 * 1024 },
  // Filtrer les fichiers en fonction de leur type MIME
  fileFilter: (req, file, callback) => {
      if (MIME_TYPES[file.mimetype]) {
          callback(null, true); 
      } else {
          callback(new Error('Type de fichier invalide'), false); 
      }
  }
});

// Middleware pour redimensionner les images avec Sharp
const resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const outputPath = path.join('images', `resized_${fileName}`);

  sharp(filePath)
    .resize({
      width: 206,
      height: 260,
      fit: 'cover'
    })
    .toFile(outputPath)
    .then(() => {
      // Remplacer le fichier original par le fichier redimensionné
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        req.file.path = outputPath;
        next();
      });
    })
    .catch(err => {
      console.log(err);
      return next(err);
    });
};

module.exports = {
  upload: upload.single('image'),
  resizeImage
};