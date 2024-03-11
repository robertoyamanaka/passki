import axios from "axios";

export async function createSignInToken(clerkUserId: string): Promise<string> {
  const url = `https://api.clerk.com/v1/sign_in_tokens`;
  try {
    const response = await axios.post(
      url,
      {
        user_id: clerkUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.token;
  } catch (error) {
    throw new Error(`Failed to create Sign In Token in Clerk: ${error}`);
  }
}
