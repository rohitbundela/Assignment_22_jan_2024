const express = require('express');
const router = express.Router();
const {Contact, sequelize} = require('/home/kumar/Desktop/contactGla/backend/models');
const {Op} = require("sequelize");
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const upload = multer({
  dest: '/home/kumar/Desktop/contactGla/backend/uploads', 
  allowedFileTypes: ['text/csv'],
});




//get list of all the contacts 
router.get('/contacts',async(req,res)=>{
    try{
        const contacts = await Contact.findAll();
    console.log(contacts);
    res.json(contacts);
}catch(error){
    console.error('Error fetching contacts',error);
    res.status(500).send('Internal Server Error');
}
});

//insert the single contact
router.post('/contactsAdd',async(req,res)=>{
    try {
        const{name,email,phone,address} = req.body;
        if(!name||!phone){
            return res.status(400).send('Name and email are required');
        }
        const newContact = await Contact.create({
            name,
            email,
            phone,
            address,
        });
        res.status(201).json(newContact);
    } catch (error) {
        console.error('Error inserting contact',error);
        res.status(500).send('Internal Server Error');
    }
});

//delete the contact based on the name
router.delete('/contactsDeleteByName',async(req,res)=>{
    try {
        const{name}=req.body;

        if(!name){
            return res.status(400).send('Name parameter is required');
        }
        const deletedContact = await Contact.destroy({
            where:{
                name,
            }
        });
        if(deletedContact){
            res.status(200).send('Contact deleted successfully');
        }else {
            res.status(404).send('Contact not found');
        }
    } catch (error) {
        console.error('Error deleting contact:',error);
        res.status(500).send('Internal Server Error');
    }
});

//delete the contact based on the phone
router.delete('/contactsDeleteByPhone',async(req,res)=>{
    try {
        const{phone}=req.body;

        if(!phone){
            return res.status(400).send('Phone parameter is required');
        }
        const deletedContact = await Contact.destroy({
            where:{
                phone,
            }
        });
        if(deletedContact){
            res.status(200).send('Contact deleted successfully');
        }else {
            res.status(404).send('Contact not found');
        }
    } catch (error) {
        console.error('Error deleting contact:',error);
        res.status(500).send('Internal Server Error');
    }
});

//delete the contact based on the email
router.delete('/contactsDeleteByEmail',async(req,res)=>{
    try {
        const{email}=req.body;

        if(!email){
            return res.status(400).send('Email parameter is required');
        }
        const deletedContact = await Contact.destroy({
            where:{
                email,
            }
        });
        if(deletedContact){
            res.status(200).send('Contact deleted successfully');
        }else {
            res.status(404).send('Contact not found');
        }
    } catch (error) {
        console.error('Error deleting contact:',error);
        res.status(500).send('Internal Server Error');
    }
});


//search for contacts based on name,address,phone and email
router.get('/contactsSearch',async(req,res)=>{
    try {
        const{query} = req.query;
        if(!query){
            return res.status(400).send('Search query parameter is required');
        }
        const searchResults = await Contact.findAll({
            where:{
                [Op.or]:[
                    {name:{[Op.like]:`%${query}%`}},
                    {email:{[Op.like]:`%${query}%`}},
                    {phone:{[Op.like]:`%${query}%`}},
                    {address:{[Op.like]:`%${query}%`}},
                ],
            },
        });
        res.json(searchResults);
    } catch (error) {
        console.error('Error searching contacts:',error);
        res.status(500).send('Internal Server Error');
    }
});

//import the csv file
router.post('/contacts/import', upload.single('file'), async (req, res) => {
    try {
      const uploadedFile = req.file.path;
  
      fs.createReadStream(uploadedFile)
        .pipe(csvParser())
        .on('data', async (row) => {
          const { name, email, phone, address } = row;
  
          await Contact.create({
            name,
            email,
            phone,
            address,
          });
        })
        .on('end', async () => {
          try {
            await fs.unlinkSync(uploadedFile);
            res.send('Contacts imported successfully!');
          } catch (error) {
            console.error('Error deleting uploaded file:', error);
            res.status(500).send('Internal Server Error');
          }
        })
        .on('error', (error) => {
          console.error('Error parsing CSV file:', error);
          res.status(500).send('Internal Server Error');
        });
    } catch (error) {
      console.error('Error importing contacts:', error);
      res.status(500).send('Internal Server Error');
    }
  });


//download all in csv file
router.get('/contacts/download-csv', async (req, res) => {
    try {
      // 1. Fetch all contacts
      const contacts = await Contact.findAll();
  
      // 2. Prepare CSV data string
      let csvData = 'name,email,phone,address\n'; // Header row
      for (const contact of contacts) {
        csvData += `${contact.name},${contact.email},${contact.phone},${contact.address}\n`;
      }
  
      // 3. Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
  
      // 4. Send CSV data in response
      res.send(csvData);
    } catch (error) {
      console.error('Error downloading contacts:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;