import React from "react";

interface UserContextProps {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = React.createContext<UserContextProps | undefined>(
  undefined
);
