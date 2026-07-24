import { Config } from '../config.js';

export const Auth = {
    checkSession: () => sessionStorage.getItem("logged_in") === "true",
    
    login: (u, p) => {
        if (u === Config.LOGIN_USER && p === Config.LOGIN_PASS) {
            sessionStorage.setItem("logged_in", "true");
            return true;
        }
        return false;
    },
    
    logout: () => {
        sessionStorage.removeItem("logged_in");
        window.location.reload();
    }
};