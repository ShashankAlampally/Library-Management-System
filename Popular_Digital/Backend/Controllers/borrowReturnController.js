const Borrow = require('../Models/Borrowing'); // Make sure the path is correct
const Book = require('../Models/book'); // Make sure the path is correct
const Member = require('../Models/Member'); // Make sure the path is correct
const { response } = require('express');

// Borrow Book
exports.borrowBook = async (req, res) => {
    try {
        const { bookID, memberID, dueDate } = req.body;

        if (!(bookID && memberID && dueDate)) {
            return res.status(400).send({ message: "Book ID, Member ID, and Due Date are compulsory" });
        }

        const book = await Book.findById(bookID);
        const member = await Member.findById(memberID);

        if (!book) {
            return res.status(404).send({ message: "Book not found" });
        }

        if (!member) {
            return res.status(404).send({ message: "Member not found" });
        }

        if (book.available_copies <= 0) {
            return res.status(400).send({ message: "No copies available for borrowing" });
        }

        const borrow = await Borrow.create({ bookID, memberID, dueDate });
        book.available_copies -= 1;
        await book.save();

        return res.status(200).send({ message: "Book borrowed successfully", data: borrow });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

// Return Book
exports.returnBook = async (req, res) => {
    try {
        const { bookID, memberID } = req.body;

        if (!(bookID && memberID)) {
            return res.status(400).send({ message: "Book ID and Member ID are compulsory" });
        }

        const borrow = await Borrow.findOne({ bookID, memberID, returnDate: null });

        if (!borrow) {
            return res.status(404).send({ message: "Borrow record not found" });
        }

        // Calculate fine if overdue
        const dueDate = borrow.dueDate;
        const returnDate = new Date();
        borrow.returnDate = returnDate;

        let fine = 0;
        const daysOverdue = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        const finePerDay = 100; // Define the fine amount per day

        if (daysOverdue > 0) {
            fine = daysOverdue * finePerDay;
        }

        borrow.finePaid = fine; // Assuming `finePaid` is a field in the `Borrow` schema
        await borrow.save();

        const book = await Book.findById(bookID);
        book.available_copies += 1;
        await book.save();

        return res.status(200).send({ message: "Book returned successfully", data: borrow, fine });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}



// Get All Borrowed Books
exports.getAllBorrowedBooks = async (req, res) => {
    try {
        const borrowedBooks = await Borrow.find({ returnDate: null }).populate('bookID').populate('memberID');
        return res.status(200).send({ data: borrowedBooks });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}
exports.getAllReturnedBooks = async (req, res) => {
    try {
        const returnedBooks = await Borrow.find({ returnDate: { $ne: null } }).populate('bookID').populate('memberID');
        return res.status(200).send({ data: returnedBooks });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}
// Get All Overdue Books
exports.getAllOverdueBooks = async (req, res) => {
    try {
        const overdueBooks = await Borrow.find({ dueDate: { $lt: new Date() }, returnDate: null }).populate('bookID').populate('memberID');
        return res.status(200).send({ data: overdueBooks });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

exports.getBorrowedBooks = async (req, res) => {
    try {
        const { memberID } = req.body;
        const borrowedBooks = await Borrow.find({ memberID: memberID, returnDate: null }).populate('bookID').populate('memberID');
        return res.status(200).send({ data: borrowedBooks });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

exports.getReturnedBooks = async (req, res) => {
    try {
        const { memberID } = req.body;
        const returnedBooks = await Borrow.find({ memberID: memberID, returnDate: { $ne: null } })
                                          .populate('bookID')
                                          .populate('memberID');
        return res.status(200).send({ data: returnedBooks });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}



