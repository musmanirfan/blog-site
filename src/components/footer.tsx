function Footer() {
    return (
      <footer className="footer footer-center bg-[#1F2937] text-white p-4 mt-5">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved{" "}
            <a
              href="https://linkedin.com/in/musmanirfan"
              className="link"
              target="_blank"
            >
              Muhammad Usman
            </a>
          </p>
        </aside>
      </footer>
    );
  }
  
  export default Footer;