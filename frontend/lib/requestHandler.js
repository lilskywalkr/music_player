async function helloExpressServer() {
    try {
        const res = await fetch("/backend/hello", {
            method: "GET",
            headers: {
                "Content-Type": "text/plain",
            },
        });

        if (!res || res.status !== 200) {
        throw new Error("Something went wrong");
        }

        console.log(await res.text());
    } catch(e) {
        console.log("Error message: ", e);
    }
}

async function helloKoaServer() {
    try {
        const res = await fetch("/api/hello", {
            method: "GET",
            headers: {
                "Content-Type": "text/plain",
            },
        });

        if (!res || res.status !== 200) {
            throw new Error("Something went wrong");
        }

        console.log(await res.text());
    } catch(e) {
        console.log("Error message: ", e);
    }
}

async function callWeather(lan, lon) {
    try {
        const res = await fetch(`/api/weather/${lan},${lon}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!res || res.status !== 200) {
            throw new Error("Something went wrong");
        }

        return await res.json();
    } catch (e) {
        console.log("Error message: ", e)
    }
}

async function getMusic() {
    try {
        const res = await fetch(`/backend/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res || res.status !== 200) {
            throw new Error("Something went wrong");
        }

        return await res.json();
    } catch (e) {
        console.log("Error message: ", e)
    }
}

export {
    helloExpressServer,
    helloKoaServer,
    callWeather,
    getMusic
}