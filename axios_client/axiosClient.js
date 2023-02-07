/* =================================== MODULES =================================== */
import axios from 'axios';
import * as fs from 'fs';
import FormData from 'form-data';
/* ================================== INSTANCES ================================== */
const newUser = {
    name:       "Gaby",
    username:   "mailtest2@sitio.com",
    address:    "Cuauhtémoc, CDMX, México",
    age:        31,
    password:   "12345678",
    phone:      "5511223344",
}
const userImg = './img/user_test.jpg';
const userUpdate = {
    age:        28,
    address:    "Alvaro Obregón, CDMX, México",
}
const reportFile = './res/axiosClient.res.json';
/* ================================== FUNCTIONS ================================== */
async function writeAbstract(file, data){
    fs.writeFile(file, JSON.stringify(data, null, '\t'), error => {
        if (error) throw new Error(`Write error in file ${file}`);
        console.log(`Data writen succesfully in file ${file}!!`);
    })
}

async function registerUser(user, img){
    const userFormData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
        userFormData.append(`${key}`, `${value}`);
    });
    userFormData.append('userImg', fs.createReadStream(img), 'user_test.jpg');

    try {
        const res = await axios.post(`http://localhost:3000/apiV1/user/register`, userFormData, {
            headers: userFormData.getHeaders(),
        });
        return res.data;
    } catch (err) {
        return "User exist";
    }
}

async function getAllUsers(){
    const res = await axios.get(`http://localhost:3000/apiV1/user`);
    return res.data;
}

async function getbyid(userID){
    const res = await axios.get(`http://localhost:3000/apiV1/user/${userID}`);
    return res.data;
}

async function update(userID, userUpdate){
    const res = await axios.put(`http://localhost:3000/apiV1/user/${userID}`, userUpdate, {
        headers: { 'Content-Type':'application/json' }
    });
    return res.data;
}

async function deleteUser(userID){
    const res = await axios.delete(`http://localhost:3000/apiV1/user/${userID}`, {
        headers: { 'Content-Type':'application/json' }
    });
    return res.data;
}

async function deleteAllUsers(){
    const res = await axios.delete(`http://localhost:3000/apiV1/user`, {
        headers: { 'Content-Type':'application/json' }
    });
    return res.data;
}
/* =================================== CLIENT  =================================== */
async function axiosClientUserTest(newUser, userImg, userUpdate){
    let reportData = [];
    const userExist = await registerUser(newUser, userImg);
    let dataUserExist;
    if (userExist === "User exist"){
        dataUserExist = `User ${newUser.username} exist`;
    } else {
        dataUserExist = {newUser: {... newUser}};
    }
    reportData.push({
        step: 1,
        description: "User registration",
        data: dataUserExist
    })
    const allUsers = await getAllUsers();
    reportData.push({
        step: 2,
        description: "Get all users",
        data: allUsers
    })
    let userOnList;
    allUsers.users.forEach(usr => {
        if (usr.username == newUser.username){
            userOnList = usr
        }
    });
    // console.log('userOnList.id => ', userOnList.id)
    const userById = await getbyid(userOnList.id);
    reportData.push({
        step: 3,
        description: "Get new user by ID",
        data: {userID: userOnList.id, user: userById}
    })
    await update(userOnList.id, userUpdate);
    const userUpdated = await getbyid(userOnList.id);
    reportData.push({
        step: 4,
        description: "Update user",
        data: {updateData: userUpdate, userUpdated: userUpdated}
    })
    await deleteUser(userOnList.id);
    const newAllUsersList = await getAllUsers();
    reportData.push({
        step: 5,
        description: "Delete user",
        data: {userID: userOnList.id, allUsersList: newAllUsersList}
    })
    await deleteAllUsers();
    const lastAllUsersList = await getAllUsers();
    reportData.push({
        step: 6,
        description: "Delete all users",
        data: {allUsersList: lastAllUsersList}
    })

    return reportData;
}
/* ==================================== LOGIC ==================================== */
const data = await axiosClientUserTest(newUser, userImg, userUpdate);
await writeAbstract(reportFile, data);
