import { BASE_URL, queryClient } from "../reactQuery";
import { useMutation, useQuery } from "react-query";
import { createUser, createUserSchema, Users, usersSchema } from "../schemas/usersSchema";

const fetchUsers = async (page = 1): Promise<Users> => {
    const response = await fetch(`${BASE_URL}/posts?page=${page}`);
    if (!response?.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const parsedData = usersSchema.safeParse(data);
    if (!parsedData.success) {
        console.error(parsedData.error);
        throw new Error('Invalid response structure');
    }

    return parsedData.data; 

}



const postUser = async (userData: createUser): Promise<createUser> => {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })

    if (!response.ok) throw new Error('Failed')

    const data = await response.json();

    const parsedData = createUserSchema.safeParse(data);
    if (!parsedData.success) {
        console.log(parsedData.data)
        throw new Error('invalid structure')
    }

    return parsedData.data
}


export const useUsers = (page: number) => {
    const usersQuery = useQuery<Users>(['users', page], () => fetchUsers(page), { keepPreviousData: true, });

    const createUserMutation = useMutation(postUser, {
        onSuccess: () => {
            queryClient.invalidateQueries("users")
        }
    })

    return {
        usersQuery,
        createUserMutation,
    }
}