const Book = require('../Models/book'); // Make sure the path is correct

// Add New Book
exports.addBook = async (req, res) => {
    try {
        const { title, author, ISBN, genre , available_copies} = req.body;

        if (!(title && author && ISBN && genre && available_copies)) {
            return res.status(400).send({ message: "All fields are compulsory" });
        }

        const bookExists = await Book.findOne({ ISBN: ISBN });

        if (bookExists) {
            return res.status(400).send({ message: "Book with this ISBN already exists" });
        }

        const newBook = await Book.create({ title, author, ISBN, genre , available_copies });
        return res.status(200).send({ message: "Book added successfully", data: newBook });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

// Remove Book
exports.removeBook = async (req, res) => {
    try {
        const { ISBN } = req.body;

        if (!ISBN) {
            return res.status(400).send({ message: "ISBN is required" });
        }

        const book = await Book.findOneAndDelete({ ISBN: ISBN });

        if (!book) {
            return res.status(404).send({ message: "Book not found" });
        }

        return res.status(200).send({ message: "Book removed successfully" });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

// Update Book Information
exports.updateBook = async (req, res) => {
    try {
        const { ISBN, title, author, genre, available_copies } = req.body;

        if (!ISBN) {
            return res.status(400).send({ message: "ISBN is required" });
        }

        const updatedBook = await Book.findOneAndUpdate(
            { ISBN: ISBN },
            { title, author, genre, available_copies },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).send({ message: "Book not found" });
        }

        return res.status(200).send({ message: "Book information updated successfully", data: updatedBook });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}


exports.viewAllBooks  = async(req,res) =>{
    try {
        const books = await Book.find({})
        if(!books){
            return res.status(400).send({message :"No Book found"})
        }
        return res.status(200).send({message : "All books retrives ",data : books})
    } catch (error) {
        return res.staus(400).send({error : error.message})
    }
}

exports.viewAvailableBooks = async (req, res) => {
    try {
        const availableBooks = await Book.find({ available_copies: { $gt: 0 } });
        if (!availableBooks || availableBooks.length === 0) {
            return res.status(400).send({ message: "No available books found" });
        }
        return res.status(200).send({ message: "Available books retrieved", data: availableBooks });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
};
