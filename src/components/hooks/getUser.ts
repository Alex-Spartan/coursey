import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const getUser = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { username, id, picture } = user;
    return { user, username, id, picture};
}