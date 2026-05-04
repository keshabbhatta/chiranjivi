import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api"; // Adjust the import based on your API structure
import styled from "styled-components";
import UserForm from "./UserForm"; // Component to handle adding/editing users

const Container = styled.div`
  padding: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bg_secondary};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const UserListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        fetchUsers(); // Refresh the user list
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  return (
    <Container>
      <h2>User Management</h2>
      <UserForm user={editingUser} onFetchUsers={fetchUsers} onCancel={() => setEditingUser(null)} />
      <UserList>
        {users.map((user) => (
          <UserListItem key={user._id}>
            <span>{user.fullname}</span>
            <div>
              <button onClick={() => setEditingUser(user)}>Edit</button>
              <button onClick={() => handleDelete(user._id)}>Delete</button>
            </div>
          </UserListItem>
        ))}
      </UserList>
    </Container>
  );
};

export default UserManagement;
