const Borrow = require('../Models/Borrowing'); // Make sure the path is correct

const FINE_RATE_PER_DAY = 100; // Example fine rate per day

// Calculate Fine for Overdue Books
exports.calculateFines = async (req, res) => {
    try {
        const currentDate = new Date();
        const overdueBorrows = await Borrow.find({ dueDate: { $lt: currentDate }, returnDate: null });

        const updatedBorrows = await Promise.all(overdueBorrows.map(async (borrow) => {
            const overdueDays = Math.ceil((currentDate - borrow.dueDate) / (1000 * 60 * 60 * 24));
            const fine = overdueDays * FINE_RATE_PER_DAY;

            borrow.fine = fine;
            await borrow.save();

            return borrow;
        }));

        return res.status(200).send({ message: "Fines calculated and applied", data: updatedBorrows });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

exports.calculateFinesByID = async (req, res) => {
    try {
        const { bookID, memberID } = req.body;
        if (!bookID || !memberID) {
            return res.status(400).send({ error: "bookID and memberID are required" });
        }

        const currentDate = new Date();
        const borrow = await Borrow.findOne({ bookID, memberID, returnDate: null });

        if (!borrow) {
            return res.status(404).send({ message: "No active borrow record found for the given bookID and memberID" });
        }

        if (borrow.dueDate >= currentDate) {
            return res.status(200).send({ message: "No fines applicable", data: borrow });
        }

        const overdueDays = Math.ceil((currentDate - borrow.dueDate) / (1000 * 60 * 60 * 24));
        const fine = overdueDays * FINE_RATE_PER_DAY;

        borrow.fine = fine;
        await borrow.save();

        return res.status(200).send({ message: "Fine calculated and applied", data: borrow });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}


// Get Fines for a Specific Member
exports.getMemberFines = async (req, res) => {
    try {
        const { memberID } = req.params;

        if (!memberID) {
            return res.status(400).send({ message: "Member ID is required" });
        }

        const memberBorrows = await Borrow.find({ memberID: memberID, fine: { $gt: 0 } }).populate('bookID');

        return res.status(200).send({ data: memberBorrows });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

// Calculate Fine for a Specific Member and Book
exports.calculateFineForReturn = async (req, res) => {
    try {
        const { bookID, memberID } = req.body;

        if (!(bookID && memberID)) {
            return res.status(400).send({ message: "Book ID and Member ID are compulsory" });
        }

        const borrow = await Borrow.findOne({ bookID, memberID, returnDate: null });

        if (!borrow) {
            return res.status(404).send({ message: "Borrow record not found" });
        }

        const currentDate = new Date();
        let fine = 0;

        if (currentDate > borrow.dueDate) {
            const overdueDays = Math.ceil((currentDate - borrow.dueDate) / (1000 * 60 * 60 * 24));
            fine = overdueDays * FINE_RATE_PER_DAY;
        }

        borrow.fine = fine;
        await borrow.save();

        return res.status(200).send({ message: "Fine calculated", data: { fine, borrow } });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}
