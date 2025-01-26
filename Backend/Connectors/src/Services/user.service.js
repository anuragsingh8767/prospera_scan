import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../Schemas/user.schema.js';
import { loginSchema } from '../Schemas/loginSchema.js';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.secretKey; // Replace with your actual secret key

async function createUser(username, password, email, res) {
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Generate a unique ID for the user
        const userId = uuidv4();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a time-limited token (e.g., expires in 1 hour)
        const token = jwt.sign({ userId, username, email }, secretKey, { expiresIn: '3h' });

        // Create the user object
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            id: userId,
            token
        });

        // Save the user to the database
        await newUser.save();

        res.json({ id: userId, username, email, token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send(`Error creating user: ${error.message}`);
    }
}

async function loginUser(email, password, res) {

    // Validate the request body
    const { error } = loginSchema.validate({ email, password });
    if (error) {
        return res.status(400).send(`Validation error: ${error.details[0].message}`);
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid password');
        }

        // Create a time-limited token (e.g., expires in 1 hour)
        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });

        // Update the user's token in the database
        user.token = token;
        await user.save();

        res.json({ id: user.id, username: user.username, email: user.email, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send(`Error logging in user: ${error.message}`);
    }
}

async function testtoken(res) {
    res.json({ message: 'Welcome' });
}

export { createUser, loginUser, testtoken };