// Add packages
require("dotenv").config();
const { param } = require("express/lib/request");
// Add database package and connection string
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getTotalRecords = () => {
  sql = "SELECT COUNT(*) FROM book";
  return pool.query(sql)
      .then(result => {
          return {
              msg: "success",
              totRecords: result.rows[0].count
          }
      })
      .catch(err => {
          return {
              msg: `Error: ${err.message}`
          }
      });
};

const insertBook = (book) => {
  if (book instanceof Array) {
      params = book;
  } else {
      params = Object.values(book);
  };
  // newparams = [];
  // for(i = 0; i < params.length; i++){
  //   params.rows[i].forEach(value => {
  //     if((value).toUpperCase()=== "NULL"){
  //       val = null;
  //       newparams.push(val);
  //     }else{
  //       newparams.push(value)
  //     }
  //   })
  // }
  const sql = "INSERT INTO book (book_id, title, total_pages, rating, isbn, published_date) VALUES ($1, $2, $3, $4, $5, $6)";
  return pool.query(sql, newparams)
      .then(result => {
          console.log("inserted");
          return { 
              message: "success",
              desc: `book id ${params[0]} successfully inserted`
              //result: result.rows
          }
      })
      .catch(err => {
          return {
              message: "Error",
              desc: `Error on insert of book id ${params[0]}.  ${err.message}`
              //result: `Error: ${err.message}`
          }
  });
}



module.exports.getTotalRecords = getTotalRecords;
module.exports.insertBook = insertBook;