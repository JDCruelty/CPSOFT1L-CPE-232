import {auth, db} from "../firebase/firebase-config.js";
import {onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {ref, get, update} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const form = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");
const loginPath = "../log-in/log-in.html";

const fields = [
    "givenName", "middleName", "surname", "birthdate", "mobileNumber",
    "alternativeContact", "emergencyContactName", "emergencyContactNumber",
    "blockLot", "barangay", "city", "province", "postalCode", "country"
];

function valueOf(id) {
    return document.getElementById(id).value.trim();
}

function showError(inputId, errorId, message) {
    document.getElementById(errorId).textContent = message;
    document.getElementById(inputId).classList.add("error-border");
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(function(element) {
        element.textContent = "";
    });
    document.querySelectorAll("input").forEach(function(input) {
        input.classList.remove("error-border");
    });
    profileMessage.textContent = "";
    profileMessage.className = "profile-message";
}

function numbersOnly(id) {
    document.getElementById(id).addEventListener("input", function(event) {
        event.target.value = event.target.value.replace(/\D/g, "");
    });
}

function validateMobile(value) {
    return /^09\d{9}$/.test(value);
}

function validatePostalCode(value) {
    return /^\d{4}$/.test(value);
}

function loadProfile(user) {
    document.getElementById("email").value = user.email || "";
    return get(ref(db, `users/${user.uid}`)).then(function(snapshot) {
        const profile = snapshot.val()?.profile;
        if (!profile) {
            return;
        }
        fields.forEach(function(id) {
            if (id in profile && id !== "blockLot" && id !== "barangay" && id !== "city" && id !== "province" && id !== "postalCode" && id !== "country") {
                document.getElementById(id).value = profile[id] || "";
            }
        });
        const address = profile.address || {};
        ["blockLot", "barangay", "city", "province", "postalCode", "country"].forEach(function(id) {
            document.getElementById(id).value = address[id] || (id === "country" ? "Philippines" : "");
        });
    });
}

onAuthStateChanged(auth, function(user) {
    if (!user) {
        window.location.href = loginPath;
        return;
    }
    loadProfile(user).catch(function(error) {
        console.error("Error loading profile:", error);
    });
});

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    clearErrors();
    let valid = true;
    const profile = {
        givenName: valueOf("givenName"),
        middleName: valueOf("middleName"),
        surname: valueOf("surname"),
        birthdate: valueOf("birthdate"),
        mobileNumber: valueOf("mobileNumber"),
        alternativeContact: valueOf("alternativeContact"),
        emergencyContactName: valueOf("emergencyContactName"),
        emergencyContactNumber: valueOf("emergencyContactNumber"),
        address: {
            blockLot: valueOf("blockLot"),
            barangay: valueOf("barangay"),
            city: valueOf("city"),
            province: valueOf("province"),
            postalCode: valueOf("postalCode"),
            country: valueOf("country")
        }
    };

    if (!profile.givenName) {
        showError("givenName", "givenNameError", "Given Name is required.");
        valid = false;
    }
    if (!profile.surname) {
        showError("surname", "surnameError", "Surname is required.");
        valid = false;
    }
    if (!profile.birthdate) {
        showError("birthdate", "birthdateError", "Birthdate is required.");
        valid = false;
    } else if (new Date(profile.birthdate) > new Date()) {
        showError("birthdate", "birthdateError", "Birthdate cannot be a future date.");
        valid = false;
    }
    if (!validateMobile(profile.mobileNumber)) {
        showError("mobileNumber", "mobileNumberError", "Enter a valid 11-digit Philippine mobile number.");
        valid = false;
    }
    if (profile.alternativeContact && !validateMobile(profile.alternativeContact)) {
        showError("alternativeContact", "alternativeContactError", "Enter a valid 11-digit mobile number.");
        valid = false;
    }
    if (profile.emergencyContactNumber && !validateMobile(profile.emergencyContactNumber)) {
        showError("emergencyContactNumber", "emergencyContactNumberError", "Enter a valid 11-digit mobile number.");
        valid = false;
    }
    ["blockLot", "barangay", "city", "province", "country"].forEach(function(id) {
        if (!profile.address[id]) {
            showError(id, `${id}Error`, `${id} is required.`);
            valid = false;
        }
    });
    if (!validatePostalCode(profile.address.postalCode)) {
        showError("postalCode", "postalCodeError", "ZIP / Postal Code must contain exactly 4 digits.");
        valid = false;
    }
    if (!valid) {
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        window.location.href = loginPath;
        return;
    }
    try {
        await update(ref(db, `users/${user.uid}`), {profile});
        profileMessage.textContent = "Profile saved successfully.";
        profileMessage.className = "profile-message profile-success";
    } catch (error) {
        console.error("Error saving profile:", error);
        profileMessage.textContent = "Unable to save profile. Please try again.";
        profileMessage.className = "profile-message profile-error";
    }
});

["mobileNumber", "alternativeContact", "emergencyContactNumber", "postalCode"].forEach(numbersOnly);

document.getElementById("logoutButton").addEventListener("click", async function() {
    try {
        await signOut(auth);
        window.location.href = loginPath;
    } catch (error) {
        console.error("Logout error:", error);
    }
});
