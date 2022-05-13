// Required modules 
const express = require("express");
const app = express();
const dblib = require("./dblib.js");

const multer = require("multer");
const { render } = require("express/lib/response");
const upload = multer();



// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Setup EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Application folders
app.use(express.static("public"));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    //res.send("Root resource - Up and running!")
    res.render("index");
});

app.get("/sum", (req, res) => {
  const nums = {
    strnum:"",
    endnum: "",
    incr: ""
  }
  res.render("sum", {
    type: "get",
    nums: nums
  });
});

app.post("/sum", (req, res) => {
  nums = req.body
  if(nums.strnum > nums.endnum){
    result = "Starting number must be less than ending number"
    res.render("sum", {
      type: "post",
      nums: nums,
      message: "error",
      result: result
    });
  }else{
    const incrnum = () => {
      result = 0;
      console.log(nums);
      for (let i = Number(nums.strnum); i <=Number( nums.endnum); i += Number(nums.incr)) {
      result += i;
      console.log("inFunction:", result);
      }
      return result
    }
  sum = incrnum();
  res.render("sum", {
    type: "post",
    nums: nums,
    message: "success",
    result: sum
  })
}

})

app.get("/import", async (req, res) => {
  const totRecs = await dblib.getTotalRecords();
  message = "";
  res.render("import", {type: "get", totRecs: totRecs.totRecords, message: message});
});

app.post("/import",  upload.single('filename'), async(req, res) => {
  if(!req.file || Object.keys(req.file).length === 0) {
      message = "Error: Import file not uploaded";
      res.render("import", {type: "post", errors: message});
  }else{
      const totRecs = await dblib.getTotalRecords();
      //Read file line by line, inserting records
      const buffer = req.file.buffer; 
      const lines = buffer.toString().split(/\r?\n/);
      messages = [];
      i = 0;
      r = 0;
      for(line of lines){
       //console.log(line);
          book = line.split(",");
          console.log(line);
          const lineinsert = await dblib.insertBook(book);
          if (lineinsert.message === "success"){
              i += 1;
              console.log(lineinsert.desc, i);
          }else{
              r += 1;
              messages.push(lineinsert.desc)
              console.log(lineinsert.desc, r);
          }
      }
      const totRecs2 = await dblib.getTotalRecords();
      res.render("import", {
          type : "post",
          totRecs: totRecs.totRecords,
          totRecs2: totRecs2.totRecords, 
          inserted: i, 
          notinserted: r,
          processed: i+r, 
          errors: messages
      })
  }
  });