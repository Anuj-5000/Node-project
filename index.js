
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
  fs.readdir('./files', (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading files');
    }
    res.render('index', { files  });
  });
});

app.get('/file/:filename', (req, res) => {
  const filePath = `./files/${req.params.filename}`;
  fs.readFile(filePath, 'utf-8', (err, fileData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading file');
    }
     res.render('show',{filename:req.params.filename,fileData:fileData}); 
  });
});

app.get('/edit/:filename', (req, res) => {
  const filePath = `./files/${req.params.filename}`;
  fs.readFile(filePath, 'utf-8', (err, fileData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading file');
    }
     res.render('edit',{filename:req.params.filename,fileData:fileData}); 
  });
});


app.post('/edit', (req, res) => {
  const { title, detail, new_title, new_detail } = req.body;
  // console.log(req.body)
  // Paths for old and new files
  const oldFileName = `./files/${title}`;
  const newFileName = `./files/${new_title}.txt`;
  // console.log(new_detail)
  // Rename the file
  fs.rename(oldFileName, newFileName, (err) => {
      fs.writeFile(newFileName, new_detail, (err) => {
        console.log('data added');
         res.redirect('/');
      });
  });
});

app.post('/create', (req, res) => {
  const fileName = req.body.title.split(' ').join('') + '.txt';
  fs.writeFile(`./files/${fileName}`, req.body.detail, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing file');
    }
    res.redirect('/');
  });
});

app.get('/delete/:filename', (req, res) => {
  // const filePath = path.join(__dirname, 'files', req.params.filename);
  const filePath = `./files/${req.params.filename}`;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`);
      return res.status(500).send('Error deleting file');
    }
    // console.log('File deleted successfully');
    res.redirect('/');
  });
});


// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
