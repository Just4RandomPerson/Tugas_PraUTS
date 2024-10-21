import { idartistPromise } from "./tes.js";

idartistPromise.then((idartist) => {
    console.log(idartist) // Should now return the correct data
    let p_p = document.getElementById("halo")
    p_p.innerHTML = idartist['Foo Fighters']
}).catch((error) => {
    console.error("Failed to fetch data:", error);
});

