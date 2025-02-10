import { useState } from "react";
import { useUsers } from "../../../api/queries/usersQueries";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

function UserList() {
  const [page, setPage] = useState(1);
  const { usersQuery, createUserMutation } = useUsers(page);

  const [newUser, setNewUser] = useState({ name: "", email: "", job: "" });

  const handleCreateUser = () => {
    createUserMutation.mutate({
      name: newUser.name,
      email: newUser.email,
    });

    setNewUser({ name: "", email: "", job: "" });
  };

  if (usersQuery.isLoading) return <div>Loading...</div>;
  if (usersQuery.error)
    return <div>Error: {(usersQuery.error as Error).message}</div>;

  return (
    // <PageContainer scrollable>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-4">User List</h1>
          <Link
            href={'/dashboard/employee/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
          <Table>
            <TableCaption>Users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Last Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersQuery.data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.title}
                  </TableCell>
                  <TableCell>{user.body}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  // disabled={page === 1}
                />
              </PaginationItem>

              {Array.from({ length: 4 }).map(
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={() => setPage(i + 1)}
                      // active={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) =>
                      prev < (4)
                        ? prev + 1
                        : prev
                    )
                  }
                  // disabled={page === usersQuery.data?.total_pages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="shadow-md p-4 font-semibold flex flex-col gap-4 justify-center items-center">
            <h2>Create a new user</h2>
            <input
              type="text"
              className="p-2 border-blue-600 border rounded-md w-1/4"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              className="p-2 border-blue-600 border rounded-md w-1/4"
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              className="p-2 border-blue-600 border rounded-md w-1/4"
              type="text"
              placeholder="Job"
              value={newUser.job}
              onChange={(e) => setNewUser({ ...newUser, job: e.target.value })}
            />
            <Button
              onClick={handleCreateUser}
              disabled={createUserMutation.isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {createUserMutation.isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>

          {createUserMutation.isError && (
            <p>
              Error creating user: {(createUserMutation.error as Error).message}
            </p>
          )}
          {createUserMutation.isSuccess && <p>User created successfully!</p>}
        </div>
      </div>
    // </PageContainer>
  );
}

export default UserList;
