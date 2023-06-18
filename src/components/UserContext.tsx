import React from "react";

export interface UserContextProps {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = React.createContext<UserContextProps>(
  {} as UserContextProps
);
