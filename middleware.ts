import { createServerClient } from "@supabase/ssr/dist/main/createServerClient"
import { NextResponse, NextRequest } from "next/server"

//This function runs before every request (for routes where middleware is enabled).
export const middleware = async (request: NextRequest) => {

    //NextResponse.next() → tells Next.js: “continue to the next step (render page or API)
    let supabaseResponse = NextResponse.next({ request })
    //supabaseResponse → will be the response object that you can modify (like attaching cookies).


    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
                }

            }
        }
    )

    const {data: {user}, error } = await supabase.auth.getUser()


    const protectedRoutes = [
        /^\/create$/
    ]

    if (!user && protectedRoutes.some(route => request.nextUrl.pathname.match(route))) {
        const newUrl = request.nextUrl.clone()
        newUrl.pathname = "/auth/login"
        return NextResponse.redirect(newUrl)
    }


}

//middleware handles security and routing logic.
//Connect to Supabase using server-side auth (via cookies).
//Check if the user is logged in.
//Redirect to /auth/login if someone tries to open a protected page without being logged in.
