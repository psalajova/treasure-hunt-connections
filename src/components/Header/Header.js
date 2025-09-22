import React from "react";
import huntLogo from "../../../public/hunt-logo.jpeg";

import InfoModal from "../modals/InfoModal";

function Header() {
  return (
    <header className="flex items-center justify-center relative">
      <img src={huntLogo} alt="Hunt Logo" className="h-16 object-contain" />
      <div className="absolute right-4">
        <InfoModal />
      </div>
    </header>
  );
}

export default Header;
