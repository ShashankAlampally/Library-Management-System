const express = require('express');
const router = express.Router();
const {updateMemberDetails} = require('../Controllers/userController')
const {addBook,removeBook,updateBook,viewAllBooks,viewAvailableBooks} = require('../Controllers/bookController')
const {borrowBook,returnBook,getAllBorrowedBooks,getAllOverdueBooks,getAllReturnedBooks,getBorrowedBooks,getReturnedBooks} = require('../Controllers/borrowReturnController')
const {calculateFines,getMemberFines,calculateFineForReturn,calculateFinesByID} = require('../Controllers/fineController');
const {allUsers,deleteUser} = require('../Controllers/userController')


router.delete('/deleteUser',deleteUser);
router.get('/allUsers',allUsers);
router.get('/viewBooks',viewAllBooks)
router.get('/availableBooks',viewAvailableBooks);
router.put('/updateUser',updateMemberDetails)
router.post('/addBook',addBook)
router.delete('/deleteBook',removeBook)
router.put('/updateBook',updateBook)
router.post('/borrowBook',borrowBook)
router.post('/returnBook',returnBook)
router.post('/borrowedBooks',getBorrowedBooks)
router.post('/returnedBooks',getReturnedBooks)
router.get('/borrowedBooks',getAllBorrowedBooks)
router.get('/returnedBooks',getAllReturnedBooks)
router.get('/overdueBooks',getAllOverdueBooks)
router.post('/calculateFineByID',calculateFinesByID)
router.post('/calculateFines',calculateFines)
router.get('/memberFines',getMemberFines)
router.post('/calculateFineForReturn',calculateFineForReturn)

module.exports = router