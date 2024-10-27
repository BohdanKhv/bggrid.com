
const crypto = require('crypto');
const fs = require('fs');


const htmlToPdf = async (html) => {
}

const generateOrderNumber = () => {
    // xxx-xxxxxxx-xxxxxxx (3-7-7)
    // Chance of collision: 1 in 10,000,000
    const first = Math.floor(Math.random() * 1000);
    const second = Math.floor(Math.random() * 10000000);
    const third = Math.floor(Math.random() * 10000000);
    return `${first}${second}${third}`;
}

const generateRandomPassword = () => {
    // 8 characters (numbers, letters, symbols)
    // Chance of collision: 1 in 218,340,105,584,896
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

const generateInviteCode = () => {
    // 8 characters (numbers, letters)
    // Chance of collision: 1 in 2,821,109,907,456
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 8; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

const generate6DigitInviteCode = () => {
    // 8 characters (numbers, letters)
    const characters = '0123456789';
    let key = '';
    for (let i = 0; i < 6; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

const encryptOne = (value) => {
    const algorithm = 'aes-192-cbc';
    const password = process.env.CRYPTO_SECRET;
    const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0); // Initialization vector.

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encryptedValue = cipher.update(value.toString(), 'utf8', 'hex') + cipher.final('hex');

    return encryptedValue;
}

const decryptOne = (value) => {
    const algorithm = 'aes-192-cbc';
    const password = process.env.CRYPTO_SECRET;
    const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0); // Initialization vector.

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const decryptedValue = decipher.update(value.toString(), 'hex', 'utf8') + decipher.final('utf8');

    return decryptedValue;
}

const checkPasswordStrength = (password) => {
    // Return the strength of the password based on the following criteria:
    // 0: Password is empty
    // 1: Password is too weak (no uppercase, number, or special character)
    // 2: Password is weak (only one of the following: uppercase, number, or special character)
    // 3: Password is moderate (two of the following: uppercase, number, or special character)
    // 4: Password is strong (all of the following: uppercase, number, and special character)

    if (!password) return 0;
    if (password.length < 6) return 1; // too weak

    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(password);

    // Check if password contains only numbers
    const onlyNumbers = /^\d+$/.test(password);

    if (onlyNumbers) return 1; // too weak

    const conditionsMet = [hasUppercase, hasNumber, hasSpecialCharacter].filter(Boolean).length;

    switch (conditionsMet) {
        case 0: return 1; // too weak
        case 1: return 2; // weak
        case 2: return 3; // moderate
        case 3: return 4; // strong
        default: return 0;
    }
}

const encryptData = (data) => {
    for (const [k, value] of Object.entries(data)) {
        if (data[k] === null) continue;
        if (value === undefined || value === null) continue;

        const algorithm = 'aes-192-cbc';
        const password = process.env.CRYPTO_SECRET;
        const key = crypto.scryptSync(password, 'salt', 24);
        const iv = Buffer.alloc(16, 0); // Initialization vector.

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        const encryptedValue = cipher.update(value.toString(), 'utf8', 'hex') + cipher.final('hex');
    
        data[k] = encryptedValue;
    }

    return data;
}

const decryptData = (data) => {
    for (const [k, value] of Object.entries(data)) {
        if (data[k] === null) continue;
        if (value === undefined || value === null) continue;

        const algorithm = 'aes-192-cbc';
        const password = process.env.CRYPTO_SECRET;
        const key = crypto.scryptSync(password, 'salt', 24);
        const iv = Buffer.alloc(16, 0); // Initialization vector.

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        const decryptedValue = decipher.update(value.toString(), 'hex', 'utf8') + decipher.final('utf8');
    
        data[k] = decryptedValue;
    }

    return answers;
}

const getNestedProperty = (obj, path) => {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null
    }, obj);
}

const validateEmail = (email) => {
    if (!email) return;

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

module.exports = {
    htmlToPdf,
    generateOrderNumber,
    generateRandomPassword,
    generateInviteCode,
    generate6DigitInviteCode,
    encryptOne,
    decryptOne,
    checkPasswordStrength,
    encryptData,
    decryptData,
    getNestedProperty,
    validateEmail,
}