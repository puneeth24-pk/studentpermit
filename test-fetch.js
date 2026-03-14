async function test() {
    const email = "24691A31J0@mits.ac.in";
    const password = "password123";

    try {
        const res = await fetch('http://localhost:3001/api/auth/student/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

test();
