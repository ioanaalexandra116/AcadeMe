import { getAllUsers } from "@/firebase/firestore";
import { useEffect, useState } from "react";
import { AvatarProperties, UserData } from "../interfaces";
import Avatar from "./Avatar";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

const SearchUser = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        // Update users state with fetched data
        setUsers(users);

        // Now that users state is updated, change avatar dimensions
        changeAvatarDimensions(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const changeAvatarDimensions = (users: UserData[]) => {
      const usersWithAvatarProps = users.map((user) => {
        user.avatarProps.dimensions = "40px";
        return user;
      });
      setUsers(usersWithAvatarProps);
    };

    fetchUsers();
  }, []); // Empty dependency array means this will run once after initial render

  useEffect(() => {
    if (!usernameInput) {
      return;
    }
    const filteredUsersList = users.filter((user) =>
      user.username.toLowerCase().startsWith(usernameInput.toLowerCase())
    );
    setFilteredUsers(filteredUsersList);
    console.log(filteredUsers);
  }, [usernameInput, users]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1
        className="text-4xl font-bold text-black mt-4 mb-6 contoured-text"
        style={{
          color: "#f987af",
          textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
        }}
      >
        Search for a user
      </h1>
      <Input
        placeholder="Search user by username"
        type="text"
        id="search"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
        style={{
          width: "380px",
          backgroundColor: "#FFFFFF",
          border: "0.5px solid gray",
          marginBottom: "1rem",
        }}
      />
      {usernameInput &&
        (filteredUsers.length === 0 ? (
          <h1
            className="text-4xl font-bold text-black contoured-text"
            style={{
              color: "#f987af",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "calc(100vh - 20rem)",
            }}
          >
            There are no users that match your search
          </h1>
        ) : (
          <Card style={{ width: "380px" }}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-row items-center space-x-4 p-2 cursor-pointer"
                onClick={() =>
                  window.location.assign(`/profile?userId=${user.id}`)
                }
              >
                <Avatar {...(user.avatarProps as AvatarProperties)} />
                <p>{user.username}</p>
              </div>
            ))}
          </Card>
        ))}
    </div>
  );
};

export default SearchUser;
