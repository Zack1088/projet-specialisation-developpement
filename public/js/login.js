const linkAPI = ''

const login = (email, password) => {
    try {
        emailUser = email
        passwordUser = password
        return true
    } catch (error) {
        console.error('Erreur lors de la connexion', error)
    }
}