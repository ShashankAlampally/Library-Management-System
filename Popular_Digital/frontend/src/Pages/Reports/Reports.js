import React from 'react'
import Header from '../../Components/Header/Header'
import BorrowedBooks from '../../Components/Borrowed/Borrowed'
import OverdueBooks from '../../Components/OverDueBooks/OverDue'
import ReturnedBooks from '../../Components/ReturnedBooks/ReturnedBooks'

const Reports = () => {
  return (
    <div>
        <Header/>
        <OverdueBooks/>
        <ReturnedBooks/>
    </div>
  )
}

export default Reports