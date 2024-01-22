import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import exceljs from 'exceljs';
import bodyParser from "body-parser";
const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

const contactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
})
const Contact = mongoose.model('Contact', contactSchema);
app.use(cors())
app.use(bodyParser.json());

app.get('/api/contacts', async (req, res) => {
    const { page, limit,...filters } = req.query;
    const skip = (page - 1) * limit;
    console.log(filters)
    const filterObject = {};

    if (filters.name) {
      // Case-insensitive regex match for name
      filterObject.name = { $regex: new RegExp(filters.name, 'i') };
    }

    if (filters.mobileNumber) {
      // Exact match for mobileNumber
      filterObject.phoneNumber = filters.mobileNumber;
    }

    if (filters.email) {
      // Case-insensitive regex match for email
      filterObject.email = { $regex: new RegExp(filters.email, 'i') };
    }
    const contacts = await Contact.find(filterObject).skip(skip).limit(Number(limit));
    res.json(contacts);
  });
  app.get('/api/contacts/download', async (req, res) => {
    try {
      const selectedContactIds = req.query.selectedContacts.split(','); // Split the comma-separated string
      console.log(selectedContactIds);
  
      const contacts = await Contact.find({ _id: { $in: selectedContactIds } });
      console.log(contacts);
  
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Contacts');
  
      // Add headers
      worksheet.addRow(['Name', 'Phone Number', 'Email']);
  
      // Add contact data
      contacts.forEach(contact => {
        const { name, phoneNumber, email } = contact;
        worksheet.addRow([name, phoneNumber, email]);
      });
  
      // Set response headers for Excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=selected_contacts.xlsx');
  
      // Pipe the Excel file to the response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/contacts', async (req, res) => {
    try {
      const { name, phoneNumber, email } = req.body;
  
      // Create a new contact instance
      const newContact = new Contact({
        name,
        phoneNumber,
        email,
      });
  
      // Save the contact to the database
      await newContact.save();
  
      res.status(201).json({ message: 'Contact added successfully', contact: newContact });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares



app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});