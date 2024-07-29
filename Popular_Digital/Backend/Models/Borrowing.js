const mongoose = require('mongoose');

const BorrowSchema = new mongoose.Schema({
    bookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    memberID: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    fine: { type: Number, default: 0 }
});

const Borrow = mongoose.model('Borrow', BorrowSchema);

module.exports = Borrow;
