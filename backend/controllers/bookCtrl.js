const Book = require('../models/Book');
const fs = require('fs');

// GET ALL BOOKS
exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// GET ONE BOOK
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error: error }));
};

// POST CREATE BOOK
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`,
      averageRating: bookObject.ratings[0].grade
  });

   book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

// DELETE BOOK
exports.deleteBook = (req, res, next) => {
   Book.findOne({_id: req.params.id})
   .then(book => {
    if(book.userId != req.auth.userId) {
      res.status(401).json({message: 'Non-autorise'});
    } else{
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({_id: req.params.id})
        .then(() => { res.status(200).json({message: 'Objet supprime !'})})
        .catch(error => res.status(401).json({error}));

      });
    }
   })
   .catch(error => {
    res.status(500).json({error});
   });
};

// PUT MODIFY BOOK
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;

  // Cherche le livre dans la base de données par son ID
  Book.findOne({_id: req.params.id})
      .then((book) => {
          // Vérifie si l'utilisateur authentifié est bien celui qui a créé le livre
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message: 'Not authorized' });
          } else {
              // Si une nouvelle image est téléchargée, supprime l'ancienne image du serveur
              const filename = book.imageUrl.split('/images/')[1];
              req.file && fs.unlink(`images/${filename}`, (err => {
                  if (err) console.log(err);
              }));

              // Met à jour le livre avec les nouvelles données
              Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                  .catch(error => res.status(400).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// POST CREATE RATING
exports.createRating = (req, res, next) => {
  const { rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5' });
  }
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
       // Vérifie si l'utilisateur a déjà noté ce livre
       const userHasRated = book.ratings.some(rating => rating.userId === req.auth.userId);
       if (userHasRated) {
         // Si l'utilisateur a déjà noté ce livre, renvoie une réponse avec un code d'erreur 403
         return res.status(403).json({ message: 'Vous avez déjà noté ce livre' });
       }
 
       // Ajoute la nouvelle note à la liste des notes du livre
       const newRating = { userId: req.auth.userId, grade: rating };
       book.ratings.push(newRating);
 
       // Calcule la nouvelle note moyenne du livre
       const totalRatings = book.ratings.length;
       const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
       book.averageRating = sumRatings / totalRatings;
 
       // Sauvegarde le livre mis à jour dans la base de données
      book.save()
        .then(() => res.status(201).json(book))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// GET 3 BEST BOOKS
exports.bestRating = (req, res, next) => {
    Book.find().sort({averageRating: -1}).limit(3)
    .then((books)=>res.status(200).json(books))
    .catch((error)=>res.status(404).json({ error }));
};
  