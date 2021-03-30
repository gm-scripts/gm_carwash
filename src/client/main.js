let ESX = null;
emit("esx:getSharedObject", (obj) => (ESX = obj));

let callbacks = {};
RegisterNetEvent("gm_carwash:callback");
onNet("gm_carwash:callback", (result, id) => {
  callbacks[id](result);
  delete callbacks[id];
});
function serverCallback(name, data, cb) {
  let id = Object.keys(callbacks).length++;
  callbacks[id] = cb;
  data["CallbackID"] = id;
  emitNet(name, data);
}

function helpText(text) {
  SetTextComponentFormat("STRING");
  AddTextComponentString(text);
  DisplayHelpTextFromStringLabel(0, 0, 1, -1);
}

let conf = {};

serverCallback("gm_carwash:getConfig", {}, (config) => {
  loadConf(config);
});

function loadConf(config) {
  conf = config;
  let marker = conf.marker;
  let zones = conf.zones;
  let blipC = conf.blips;
  let lang = conf.lang;
  let keys = conf.keys;
  let blips = [];
  for (let i = 0; i < zones.length; i++) {
    if (zones[i].showblip) {
      blips[i] = AddBlipForCoord(zones[i].x, zones[i].y, zones[i].z);
      SetBlipSprite(blips[i], blipC.id);
      SetBlipDisplay(blips[i], 4);
      SetBlipScale(blips[i], 1.0);
      SetBlipColour(blips[i], blipC.color);
      SetBlipAsShortRange(blips[i], true);
      BeginTextCommandSetBlipName("STRING");
      AddTextComponentString(blipC.title);
      EndTextCommandSetBlipName(blips[i]);
    }
  }
  setInterval(() => {
    let player = PlayerPedId();
    let coords = GetEntityCoords(player);
    for (let i = 0; i < zones.length; i++) {
      if (
        marker.type != -1 &&
        GetDistanceBetweenCoords(
          coords[0],
          coords[1],
          coords[2],
          zones[i].x,
          zones[i].y,
          zones[i].z,
          true
        ) < marker.distance.show &&
        IsPedSittingInAnyVehicle(player)
      ) {
        DrawMarker(
          marker.type,
          zones[i].x,
          zones[i].y,
          zones[i].z,
          marker.direction.x,
          marker.direction.y,
          marker.direction.z,
          marker.rotation.x,
          marker.rotation.y,
          marker.rotation.z,
          marker.scale.x,
          marker.scale.y,
          marker.scale.z,
          marker.color.r,
          marker.color.g,
          marker.color.b,
          marker.alpha,
          marker.bob,
          marker.face,
          2,
          false,
          false,
          false,
          false
        );
        if (
          GetDistanceBetweenCoords(
            coords[0],
            coords[1],
            coords[2],
            zones[i].x,
            zones[i].y,
            zones[i].z,
            true
          ) < marker.distance.open
        ) {
          helpText(lang.press_e);
          if (IsControlJustPressed(0, keys.startwash)) {  
            let vehicle = GetVehiclePedIsIn(player, false);
            if (GetVehicleDirtLevel(vehicle) > 2) {
              if (conf.framework === "esx") {
                console.log(ESX.GetPlayerData().accounts[1].money)
                if(ESX.GetPlayerData().accounts[1].money > conf.price) {
                  ESX.SetPlayerData("money", (ESX.GetPlayerData().accounts[1].money - conf.price))
                  console.log("wash")
                } else {
                  emit("esx:showNotification", "You have not enough Money")
                }
              }
            } else {
              if (conf.framework === "esx") {
                emit("esx:showNotification", "Hello World")
              }
            }
          }
        }
      }
    }
  }, 7);
}
