let userList = ["user1", "user2", "user3"];

const getList = (request, response) => {
  //100 line of codes
  return response.json({
    success: true,
    data: userList,
  });
};
const addUser = (request, response) => {
  const { data } = request.body;
  userList.push(data.name);
  return response.status(201).json({
    success: true,
    message: "User created",
  });
};

const updateUser = (request, response) => {
  const { data } = request.body;
  const index = userList.findIndex((user) => user === data.oldName);
  if (index === -1) {
    return response.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  userList[index] = data.newName;
  return response.status(200).json({
    success: true,
    message: "User updated",
  });
};

const deleteUser = (request, response) => {
  userList = userList.filter((user) => user !== request.body.name);
  return response.status(200).json({
    success: true,
    message: "User deleted",
  });
};

module.exports = {
  getList,
  addUser,
  updateUser,
  deleteUser,
};
