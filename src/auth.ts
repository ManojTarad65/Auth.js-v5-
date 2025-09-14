import NextAuth, { CredentialsSignin } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import connectToDB from "./lib/db";
import { User } from "@/Models/User";
import { compare } from "bcryptjs";
import Github from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [

    //Github -> it is used to get the user data from the github
 Github({
   clientId: process.env.GITHUB_CLIENT_ID,
   clientSecret: process.env.GITHUB_CLIENT_SECRET,
 }),


    Credentials({
      name: "Credentials",
// credentials -> it is used to get the user data from the form
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
// a error occur when we use authorize , so we have to need to return the user data
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        // If user doesn't provide email or password
        if (!email || !password) {
          throw new CredentialsSignin("Please Provide both email and password");
        }

        // Connect to DB
        await connectToDB();

        // Find user
        const user = await User.findOne({ email }).select("+password +role");

        // If user doesn't exist
        if (!user) {
          throw new CredentialsSignin("Invalid email or password");
        }
        // If user doesn't have password
        if(!user.password){
          throw new CredentialsSignin("Invalid email or password")
        }

        // Compare password
        const isPasswordValid = await compare(password, user.password); // It helps to compare the password with hash password
if(!isPasswordValid){
  throw new CredentialsSignin("Password doesn't match")
}

// Return user data
const userData = {
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  id: user._id,
}

return userData;


      },
    }),
  ],
pages:{
  signIn: "/login",
}

});
