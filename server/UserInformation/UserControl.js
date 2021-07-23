const users = []

const addUser = ({socketId, id, passWord, room}) =>{
    const existingUser = users.find((user) => user.id === id && user.room === room);
    if(existingUser) {
        return{ error: "이미 존재하는 아이디입니다. 아이디와 비밀번호를 확인해주세요!", newUser: existingUser}; 
    }
    const newUser = { socketId, id, passWord, room}; 
    users.push(newUser); 
    console.log(users); 

    return {newUser};
}

const removeUser = (id) => {
    const removedUsers = users.filter((user) => user.id !== id);
    users = removedUsers;

    return removedUsers;
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {addUser, removeUser, getUser, getUsersInRoom}; 
