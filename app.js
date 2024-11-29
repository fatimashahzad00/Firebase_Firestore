import { db, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, serverTimestamp } from "./firebaseConfig.js";


// DOM elements
const userList = document.querySelector('#userList');
const userNameInput = document.getElementById("userName");
const userAgeInput = document.getElementById("userAge");
const addUserBtn = document.getElementById("addUserBtn");

// Adding a new user with a timestamp
addUserBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = userNameInput.value;
    const age = userAgeInput.value;

    if (name && age) {
        try {
            const docRef = await addDoc(collection(db, "users"), {
                name: name,
                age: age,
                createdAt: serverTimestamp()
            });
            console.log("Document written with ID: ", docRef.id);
            userNameInput.value = "";
            userAgeInput.value = "";
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    } else {
        alert("Please enter valid name and age.");
    }
});

// Real-time data fetching
function fetchUsersRealtime() {
    const usersCollectionRef = collection(db, "users");
    onSnapshot(usersCollectionRef, (snapshot) => {
        userList.innerHTML = "";
        snapshot.docChanges().forEach((change) => {
            const userDoc = change.doc;
            if (change.type === "added") {
                renderUsers(userDoc);
            }
            if (change.type === "modified") {
                console.log("Modified user: ", userDoc.data());
                updateRenderedUser(userDoc);
            }
            if (change.type === "removed") {
                console.log("Removed user: ", userDoc.data());
                removeRenderedUser(userDoc.id);
            }
        });
    });
}

// Render user to the list
function renderUsers(doc) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const age = document.createElement('span');
    const id = document.createElement('span');
    const deleteBtn = document.createElement('button');
    const editBtn = document.createElement('button');

    deleteBtn.textContent = "Delete";
    editBtn.textContent = "Edit";
    deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
    editBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'ml-2');
    li.classList.add('list-group-item', 'd-flex', 'align-items-center');
    name.classList.add('font-weight-bold');
    age.classList.add('ml-2');
    id.classList.add('ml-2');
    deleteBtn.classList.add('ml-auto');

    li.setAttribute('user-id', doc.id);
    name.textContent = doc.data().name;
    age.textContent = doc.data().age;
    id.textContent = doc.id;

    li.appendChild(name);
    li.appendChild(age);
    li.appendChild(id);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    userList.appendChild(li);

    // Delete user
    deleteBtn.addEventListener('click', () => {
        const userId = doc.id;
        if (confirm(`Are you sure you want to delete ${doc.data().name}?`)) {
            deleteUser(userId);
        }
    });

    // Edit user
    editBtn.addEventListener('click', () => {
        const userId = doc.id;
        const newName = prompt("Enter new name:", doc.data().name);
        const newAge = prompt("Enter new age:", doc.data().age);

        if (newName && newAge) {
            updateUser(userId, { name: newName, age: newAge });
        }
    });
}

// Update rendered user
function updateRenderedUser(doc) {
    const li = document.querySelector(`[user-id="${doc.id}"]`);
    if (li) {
        li.querySelector('span.font-weight-bold').textContent = doc.data().name;
        li.querySelector('span.ml-2').textContent = doc.data().age;
    }
}

// Remove rendered user
function removeRenderedUser(userId) {
    const li = document.querySelector(`[user-id="${userId}"]`);
    if (li) {
        li.remove();
    }
}

// Update user in Firestore
async function updateUser(userId, updatedData) {
    try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            ...updatedData,
            updatedAt: serverTimestamp()
        });
        console.log("User successfully updated!");
    } catch (error) {
        console.error("Error updating user: ", error);
    }
}

// Delete user from Firestore
async function deleteUser(userId) {
    try {
        await deleteDoc(doc(db, "users", userId));
        console.log("User successfully deleted!");
    } catch (error) {
        console.error("Error deleting user: ", error);
    }
}

// Call the real-time fetch function
fetchUsersRealtime();




// // getting/fetching data from database
// async function fetchUsers() {
//     const usersCollectionRef = collection(db, "users");
//     const Snapshot = await getDocs(usersCollectionRef);
//     userList.innerHTML = "";
//     Snapshot.forEach(doc => {
//         console.log("Document data:", doc.data());
//         renderUsers(doc);
//     });
//     if (Snapshot.empty) {
//         console.log("No users found!");
//         return;
//     }
// }

