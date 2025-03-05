import { ID, Query } from "appwrite";
import { appwriteConfig, account, databases , avatars } from "./config";
import { INewUser } from "@/types";


export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user account:", error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.error("Error saving user to database:", error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession( user.email, user.password);
    return session ;
  } catch (error) {
    console.error("Error related to session:", error);
  }
}

// // ============================== GET ACCOUNT
// export async function getAccount() {
//   try {
//     const currentAccount = await account.get();
//     return currentAccount;
//   } catch (error) {
//     console.error("Error fetching account:", error);
//   }
// }

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw  Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw  Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error("There is some issue:", error);
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}