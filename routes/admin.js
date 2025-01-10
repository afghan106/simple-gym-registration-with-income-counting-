const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Member = require('../models/member');
const Income = require('../models/income');
const fs=require('fs');
const { addListener } = require('process');





// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Rename the file
    }
});

// Initialize upload variable with storage configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype); // Check MIME type

        if (extname && mimetype) {
            return cb(null, true); // Accept the file
        } else {
            return cb(new Error('Error: File type not supported!')); // Reject the file
        }
    }
});





















// Admin dashboard
router.get('/dashboard', async (req, res) => {
const count=await Member.sum("feeAmount");
console.log(count);

    res.render('dashboard',{count});


});





const dir='./public/uploads';
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
};

// Add member page
router.get('/add-member', (req, res) => {
    res.render("add-member");
});

router.post('/add-member', upload.single("memberImage"), async (req, res) => {
    try {
      const { name, fname, feeAmount, feePaid, dateJoined } = req.body;
  
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
  
      const image = req.file.filename;
      const path = req.file.path;
  
      const member = await Member.create({
        name,
        fname,
        feeAmount,
        feePaid,
        dateJoined,
        memberImage: image,
        imagePath: path
      });
  
      console.log(member);
      res.redirect("/admin/members");
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });



// View members
router.get('/members', async (req, res) => {
    try {
        const members = await Member.findAll();
        const count=await Member.count();
        
        res.render('members', { members: members,count });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching members');
    }
});

// DELETE route for deleting a member by ID
router.get('/members/:id', async (req, res) => {
    const memberId = req.params.id;

    try {
        // Find the member first
        const member = await Member.findOne({ where: { id: memberId } });

        // Check if the member exists
        if (!member) {
            return res.status(404).send('Member not found');
        }

        // Delete the member's image file
        fs.unlink(member.imagePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                // You might want to handle this error more gracefully
            }
        });

        // Delete the member from the database
        await Member.destroy({ where: { id: memberId } });

        res.redirect("/admin/members");
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).send('Error deleting member');
    }
});

// GET route to calculate total income from all members
router.get('/total-income', async (req, res) => {
    try {
        const members = await Member.findAll();

        // Calculate total income based on feeAmount of each member
        const totalIncome = members.reduce((accumulator, member) => {
            return accumulator + (member.feePaid ? member.feeAmount : 0);
        }, 0);

        res.status(200).json({ totalIncome });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
