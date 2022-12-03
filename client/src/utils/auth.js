import decode from 'jwt-decode';

class AuthService {
    //retrieve data saved in token
    getProfile() {
        return decode(this.getToken());
    }

    //check if user is still logged in
    loggedIn() {
        //checks if there is a saved token that is still valid
        const token = this.getToken();
        //use type coersion to check if token is NOT undefined and NOT expired
        return !!token && !this.isTokenExpired(token);
    }

    //check if token has expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if(decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
            } catch (err) {
            return false;
        }
    }

    //Retrieve token from local storage
    getToken() {
        //Retrieves the user token from local storage
        return localStorage.getItem('id_token');
    }

    //Set Token to localStorage and reload page to homepage
    login(idToken) {
        //saves user token to localstorage
        localStorage.setItem('id_token', idToken);

        //reloads page to homepage
        window.location.assign('/');
    }

    //clear token from localStorage adn force logout with reload
    logout() {
        //clear user token and profile data from localStorage
        localStorage.removeItem('id-token');
        //reload the page and reset the state of the application to that of being logged out
        window.location.assign('/');
    }
}

export default new AuthService();