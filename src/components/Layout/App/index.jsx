import Navbar from "../Navbar/index";

const Layout = ({ children, path }) => {
  return (
    <div style={{ background: "#fff", paddingInline: "20px" }}>
      <div style={{ background: "#e8eaed", minHeight: "100vh" }}>
        <Navbar path={path} />
        <main
          style={{
            margin: "1rem",
            padding: "1rem",
            borderRadius: "3px",
            background: "#f0fcf1",
            // background: "#f0fcf5",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
