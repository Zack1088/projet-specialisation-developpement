import bcrypt from 'bcrypt';
const saltRounds = 10;
const submitButton = document.querySelector('.btn-submit');

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Mot de passe haché avcec succès.');
        return hashedPassword;
    } catch (error) {
        console.error('Erreur lors du hachage de mot de passe : ', error);
        throw error;
    }
};

const createAccompt = (email, password) => {

}

const generateToken = (email) => {

}

const isConnected = (token) => {

}

async function sha1(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
}

async function checkPasswordCompromise(password) {
    const hashedPassword = await sha1(password);
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5).toUpperCase();

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    return data.includes(suffix);
}

submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const username = document.querySelector(".input-username").value;
    const email = document.querySelector('.input-email').value;
    const password = document.querySelector('.input-password').value;
    const confirmPassword = document.querySelector(".input-confirm-password").value;

    if (password !== confirmPassword) {
        alert("Les mots de passes doivent être identiques.");
    } else if (password.length < 8) {
        alert("Le mot de passe est trop court !")
    }
    else {
        hashPassword(password);
    }
})