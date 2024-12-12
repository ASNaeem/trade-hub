import React from "react";
import ProfileForm from "./ProfileForm";
import AccountSettings from "./AccountSettings";

export default function EditProfile() {
  return (
    <div className="space-y-8">
      <ProfileForm />
      <AccountSettings />
    </div>
  );
}
