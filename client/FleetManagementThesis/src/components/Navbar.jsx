import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Fleet Management</h1>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/wick.jpg" alt="Profile" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
