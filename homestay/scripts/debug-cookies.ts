
import fetch from "node-fetch";

async function checkCookies() {
    console.log("Checking login cookies...");
    const response = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Host": "hptourism.osipl.dev",
            "X-Forwarded-Proto": "https"
        },
        body: JSON.stringify({
            mobile: "6666666610",
            password: "test123"
        }),
    });

    console.log("Status:", response.status);
    // Check different ways to get cookies
    console.log("Headers raw set-cookie:", response.headers.raw ? response.headers.raw()['set-cookie'] : "raw() not available");
    console.log("Headers get('set-cookie'):", response.headers.get('set-cookie'));
    // @ts-ignore
    if (response.headers.getSetCookie) {
        // @ts-ignore
        console.log("Headers getSetCookie():", response.headers.getSetCookie());
    }
}

checkCookies();
