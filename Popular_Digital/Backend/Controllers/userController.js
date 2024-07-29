const Member = require('../Models/Member'); // Make sure the path is correct
const Admin = require('../Models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { response } = require('express');
require('dotenv').config();

// Signup Controller
exports.signup = async (req, res) => {
    try {
        const { name, email, password , address ,phone_number  } = req.body;

        if (!(name && email && password)) {
            return res.status(400).send({ message: "Name, email, and password are compulsory" });
        }

        const exist = await Member.findOne({ email: email });

        if (exist) {
            return res.status(400).send({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newMember = await Member.create({ name, email, password: hashedPassword , address , phone_number });
        return res.status(200).send({ message: "Registered Successfully" });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).send({ message: "Password is required" });
        }

        const member = await Member.findOne({ email: email });

        if (!member) {
            return res.status(400).send({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, member.password);

        if (!passwordMatch) {
            return res.status(400).send({ message: "Password Incorrect" });
        }

        const token = jwt.sign({ user_id: member._id }, process.env.secretKey, { expiresIn: 1000*60*5*1000 });
        return res.status(200).send({ message: "Login Successful", data: { token, userID: member._id, user: member } });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

// Update Member Details Controller
exports.updateMemberDetails = async (req, res) => {
    try {
        const { user_id } = req.body; // Assuming user_id is provided in the request body
        const updateData = req.body; // Assuming the request body contains the fields to be updated

        if (!user_id) {
            return res.status(400).send({ message: "User ID is required" });
        }

        const updatedMember = await Member.findByIdAndUpdate(user_id, updateData, { new: true });

        if (!updatedMember) {
            return res.status(404).send({ message: "User not found" });
        }

        return res.status(200).send({ message: "Member details updated successfully", data: updatedMember });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}


// Admin Login Controller
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).send({ message: "Password is required" });
        }

        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            return res.status(400).send({ message: "Admin not found" });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(400).send({ message: "Password Incorrect" });
        }

        const token = jwt.sign({ admin_id: admin._id }, process.env.secretKey, { expiresIn: 1000*60*5*1000 });
        return res.status(200).send({ message: "Login Successful", data: { token, adminID: admin._id, admin: admin } });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

exports.adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!(name && email && password)) {
            return res.status(400).send({ message: "Name, email, and password are compulsory" });
        }

        const exist = await Member.findOne({ email: email });

        if (exist) {
            return res.status(400).send({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newMember = await Admin.create({ name, email, password: hashedPassword });
        return res.status(200).send({ message: "Registered Successfully" });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

exports.allUsers = async (req, res) => {
    try {
        const users = await Member.find({}).select('-password');
        if (!users.length) {
            return res.status(400).send({ message: "No members found" });
        }
        res.status(200).send({ message: "Total members retrieved", data: users });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        const user = await Member.findOneAndDelete({ email: email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};