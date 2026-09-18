import { auth, db } from "../firebase/firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
const form = document.getElementById("myForm");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    // validation...
    // Get values
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    
    //Clear previous message
    document.getElementById("usernameError").textContent = "";
    //Remove previous borders
    document.getElementById("username").classList.remove("error-border", "success-border");
    document.getElementById("email").classList.remove("error-border", "success-border");
    document.getElementById("password").classList.remove("error-border", "success-border");
    document.getElementById("confirmPassword").classList.remove("error-border", "success-border");
    let valid = true;

    //Username validation
    if (username === "") {
        document.getElementById("usernameError").textContent = "Username is required.";
        valid = false;
    
        document.getElementById("username").classList.add("error-border");

        valid = false;
    }

    //Email validation
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

    //Password validation
    if (password === "") {
        document.getElementById("passwordError").textContent = "Password is required.";
        document.getElementById("password").classList.add("error-border");
        valid = false;
    } else if (password.length < 8) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters.";
        document.getElementById("password").classList.add("error-border");
        valid = false;
    }

    //Confirm Password validation
    if (confirmPassword === "") {
        document.getElementById("confirmPasswordError").textContent = "Please confirm your password.";
        document.getElementById("confirmPassword").classList.add("error-border");
        valid = false;
    } else if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        document.getElementById("confirmPassword").classList.add("error-border");
        valid = false;
    }

    //Success
    if (valid) {
        try {
            // Create firebase acccount
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Get firebase user
            const user = userCredential.user;
            // Store user information
            await set(ref(db, 'users/' + user.uid), 
            {
                username: username,
                email: email,
                createdAt: new Date().toISOString()
            });
            // Success
            alert("User created successfully!");
        } catch (error) {
            console.error(error);
            // Firebase error
            if (error.code === "auth/email-already-in-use") {
                document.getElementById("emailError").textContent = "Email is already registered.";
            } else if (error.code === "auth/invalid-email") {
                document.getElementById("emailError").textContent = "Invalid email address.";
            } else if (error.code === "auth/weak-password") {
                document.getElementById("passwordError").textContent = "Password is too weak.";
            } else {
            alert("Registration failed. Please try again.");
            }
        }
        // Form is valid, you can submit it or perform further actions
        alert("Registration successful!");
        window.location.href = "../log-in/log-in.html"; // Redirect to login page
        form.reset();    
    }

    // Show/Hide Password
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