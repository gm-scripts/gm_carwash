const fs = require("fs");

let file = JSON.parse(fs.readFileSync("./gmconfig/carwash.json"))

onNet("gm_carwash:getConfig", ( data ) => {
    emitNet("gm_carwash:callback", source, file, data.CallbackID);
});