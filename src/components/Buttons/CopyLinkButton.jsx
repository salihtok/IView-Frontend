// src/components/Buttons/CopyLinkButton.js
import React from "react";
import useLinkStore from "../../store/linkStore";
import { toast } from "react-toastify";

const CopyLinkButton = ({ interviewId }) => {
  const { generateInterviewLink } = useLinkStore();

  const handleCopyLink = async () => {
    try {
      // Generate link for the given interview
      await generateInterviewLink(interviewId);
      const updatedLink = await useLinkStore.getState().interviewLink;

      if (updatedLink) {
        await navigator.clipboard.writeText(updatedLink); // Copy link to clipboard
        toast.success("Link başarıyla kopyalandı: " + updatedLink);
      } else {
        toast.error("Link oluşturulamadı.");
      }
    } catch (error) {
      console.error("Link kopyalanamadı", error);
      toast.error("Link kopyalanırken bir hata oluştu.");
    }
  };

  return (
    <button onClick={handleCopyLink} className="text-green-500 hover:text-green-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path
          fillRule="evenodd"
          d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default CopyLinkButton;