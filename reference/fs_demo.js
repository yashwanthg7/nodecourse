const fs = require('fs');
const path = require('path');

// //Creating a folder in our system
// fs.mkdir(path.join(__dirname,'test'),{},err=>{
//     if(err) throw err;
//     console.log("Folder created");
// })//By default it is asynchronous


//Creating and writing to file
// fs.writeFile(path.join(__dirname,'test','hello.txt'),"Hello World",err=>{
//     if(err) throw err;
//     console.log("File created and written to");


//     //File append
//     fs.appendFile(path.join(__dirname,'test','hello.txt'),"  Yashwanth",err=>{
//         if(err) throw err;
//         console.log("File created and written to");
//     })
// })


//Readfile

// fs.readFile(path.join(__dirname, 'test', 'hello.txt'), "utf8", (err, data) => {
//     if (err) throw err;
//     console.log("File created and written to");
//     console.log(data);
// })


//Rename file

fs.rename(path.join(__dirname, 'test', 'hello.txt'), path.join(__dirname, 'test', 'helloworld.txt'), err => {
    if (err) throw err;
    console.log("File renamed");
})