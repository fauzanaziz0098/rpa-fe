import { Avatar, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = ({ path }) => {
  const router = useRouter();

  const handleHome = () => {
    router.push("/home");
  };
  return (
    <div
      style={{
        background: "#fff",
        height: "3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingInline: "10px",
      }}
    >
      <Text style={{ color: "blue", marginLeft: "20px", fontSize: "1.1rem" }}>
        {path.replaceAll("/", "  /  ")}
      </Text>
      <Avatar
        onClick={handleHome}
        src="/assets/images/home.png"
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default Navbar;
