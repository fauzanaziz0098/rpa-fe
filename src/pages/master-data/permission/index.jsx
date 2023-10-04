import { Avatar, Button, Table, Text, TextInput } from "@mantine/core";
import { IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";

export default function PermissionPageIndex() {
  const router = useRouter();
  const icon = (
    <IconSearch style={{ color: "gray", width: "1rem", height: "1rem" }} />
  );
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "2rem",
        }}
      ></div>
      <Table verticalSpacing={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>role-edit</td>
            <td>
              <ul>
                <li>super-admin</li>
                <li>admin</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>role-show</td>
            <td>
              <ul>
                <li>super-admin</li>
                <li>admin</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>role-delete</td>
            <td>
              <ul>
                <li>super-admin</li>
                <li>admin</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>permission-access</td>
            <td>
              <ul>
                <li>super-admin</li>
                <li>admin</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

PermissionPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
