import {auth, db} from "../firebase/firebase-config.js";
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {ref, set} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const form = document.getElementById("myForm");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    // ==========================================
    // GET VALUES
    // ==========================================
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    
    // ==========================================
    // CLEAR PREVIOUS MESSAGES
    // ==========================================
    document.getElementById("usernameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmPasswordError").textContent = "";
    document.getElementById("message").textContent = "";

    // Remove previous borders
    document.getElementById("username").classList.remove("error-border", "success-border");
    document.getElementById("email").classList.remove("error-border", "success-border");
    document.getElementById("password").classList.remove("error-border", "success-border");
    document.getElementById("confirmPassword").classList.remove("error-border", "success-border");
    let valid = true;

    // ==========================================
    // USERNAME VALIDATION
    // ==========================================
    if (username === "") {
        document.getElementById("usernameError").textContent = "Username is required.";
        document.getElementById("username").classList.add("error-border");
    }

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================
    if (email === "") {
        document.getElementById("emailError").textContent = "Email is required.";
        document.getElementById("email").classList.add("error-border");
        valid = false;
    } else {
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            document.getElementById("emailError").textContent = "Invalid email format.";
            document.getElementById("email").classList.add("error-border");
            valid = false;
        }
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================
    if (password === "") {
        document.getElementById("passwordError").textContent = "Password is required.";
        document.getElementById("password").classList.add("error-border");
        valid = false;
    } else if (password.length < 8) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters.";
        document.getElementById("password").classList.add("error-border");
        valid = false;
    }

    // ==========================================
    // CONFIRM PASSWORD VALIDATION
    // ==========================================
    if (confirmPassword === "") {
        document.getElementById("confirmPasswordError").textContent = "Please confirm your password.";
        document.getElementById("confirmPassword").classList.add("error-border");
        valid = false;
    } else if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        document.getElementById("confirmPassword").classList.add("error-border");
        valid = false;
    }

    // ==========================================
    // FIREBASE REGISTRATION
    // ==========================================
    if (valid) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            await set(ref(db, "users/" + user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString()
            });

            alert("User created successfully!");
            window.location.href = "../log-in/log-in.html";
            form.reset();
        } catch (error) {
            console.error(error);

            if (error.code === "auth/email-already-in-use") {
                document.getElementById("emailError").textContent = "Email is already registered.";
            } else if (error.code === "auth/invalid-email") {
                document.getElementById("emailError").textContent = "Invalid email address.";
            } else if (error.code === "auth/weak-password") {
                document.getElementById("passwordError").textContent = "Password is too weak.";
            } else {
                alert("Registration failed. Please try again.");
            }

            return;
        }
    }

    // ==========================================
    // SHOW / HIDE PASSWORD
    // ==========================================
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");
    togglePassword.addEventListener("click", function() {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        } ;
})});