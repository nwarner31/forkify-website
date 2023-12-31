import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};


// export const getJSON = async function(url) {
//     try {
//         const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//         const data = await res.json();
//
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data;
//     } catch (err) {
//         throw err;
//     }
//
// }

export const ajax = async function(url, uploadData = undefined) {
    try {
        const ajax = uploadData
            ? fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uploadData)
        })
            : fetch(url);

        const res = await Promise.race([ajax, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch(err) {
        throw err;
    }
}

// export const sendJSON = async function (url, data) {
//     try {
//         const post = fetch(url, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(data)
//         });
//
//         const res = await Promise.race([post, timeout(TIMEOUT_SEC)]);
//         const data = await res.json();
//
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data;
//     } catch(err) {
//         throw err;
//     }
// }