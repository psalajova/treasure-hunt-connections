import React from "react";
import { Info } from "lucide-react";
import BaseModal from "../BaseModal";

function InfoModal() {
  return (
    <BaseModal
      title=""
      trigger={<Info className="mr-4" />}
      initiallyOpen={false}
      actionButtonText="OK!"
    >
      <div className="text-center">
        <p className="text-lg">
          You will get no hints here ;) Also this was all made with AI so sorry if there are any bugs :D.
        </p>
      </div>
    </BaseModal>
  );
}

export default InfoModal;
