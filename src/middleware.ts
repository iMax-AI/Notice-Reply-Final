import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: Request) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const protectedRoutes = [
    "/qnas",
    "/summon-reasons",
    "/profile",
    "/notice-response",
  ];

  const currentPath = new URL(request.url).pathname;

  if (protectedRoutes.includes(currentPath) && !token) {
    console.log("Protected route accessed without token. Redirecting to home.");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     "/chat",
//     "/notice-file-upload",
//     "/profile",
//     "/notice-response",
//     "/summon-reasons",
//     "/qnas"
//   ],
// };
