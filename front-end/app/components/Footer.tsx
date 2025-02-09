import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaDribbble,
} from "react-icons/fa";

function Footer() {
  return (
    <>
      <div className="flex max-sm:flex-col justify-between items-center p-2 py-1 mb-auto font-semibold text-center bg-gradient-to-b from-gray-100 to-purple-300 dark:from-gray-300 dark:to-purple-400">
        <span>
          <a href="/">
            <div className="p-2">
              <Image
                className="border border-transparent"
                src="/logo.png"
                alt="logo"
                width={180}
                height={180}
              />
            </div>
          </a>
        </span>
        <div className="text-base text-blue-900 px-7">
          © 2025-2026 BaseAgentX™. All Rights Reserved.
        </div>
        <div className="flex justify-center items-center gap-4">
          <a href="https://x.com" target="_blank" rel="noreferrer">
            <FaTwitter className="text-xl cursor-pointer text-blue-900 hover:text-blue-500 transition duration-300" />
          </a>
          <a href="https://dribbble.com" target="_blank" rel="noreferrer">
            <FaDribbble className="text-xl cursor-pointer text-blue-900 hover:text-blue-500 transition duration-300" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook className="text-xl cursor-pointer text-blue-900 hover:text-blue-500 transition duration-300" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram className="text-xl cursor-pointer text-blue-900 hover:text-purple-500 transition duration-300" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <FaLinkedin className="text-xl cursor-pointer text-blue-900 hover:text-blue-500 transition duration-300" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <FaYoutube className="text-xl cursor-pointer text-blue-900 hover:text-red-500 transition duration-300" />
          </a>
        </div>
      </div>
    </>
  );
}

export default Footer;