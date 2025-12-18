function random(max, not) {
  let int = Math.floor(Math.random() * max);
  if (int == not) {
    random(max, not)
  }
  return int;
}
function get(id) {
  return document.getElementById(id);
}
let teachers = [];
let data = [];
let clicks = -1;
get("content").style.display = "none";
get("password").style.display = "flex";
let lastcombination = [0, 0];
let api;
let one = get("one");
let two = get("two");
let lengtth = 0;
let array = [0, 0];
function dothisagain() {
  if (array[1] == (teachers.length - 1)) {
    array[1] = 0
    array[0] = parseInt(array[0]) + 1;
  } else {
    array[1] = parseInt(array[1]) + 1;
  }
  if (array[0] == array[1]) {
    array[1] = parseInt(array[1]) + 1;
  }
  if (array[0] > array[1]) {
    array[1] += 1;
    dothisagain();
    return;
  }
  if (array[0] > teachers.length - 2) {
    return;
  }
  lengtth++;
  dothisagain();
}
function sendtotalrequest() {
  let string = JSON.stringify(data).replaceAll(" ", "+").replaceAll('"', "");
  let code = -1
  fetch(api + "/sendtotal?total=" + string)
    .then((response) => {
      code = response.status;
    })
    .then(() => {
      get("finish").innerHTML = "Skończone! Nie wiesz co robić? Zagraj w coś na <button class='textbutton' onclick='mchredirect()'>maciej hub!</button>";
    })
    .catch(() => {
      get("finish").innerHTML = " <button class='textbutton' onclick='newpassword()'>Coś nie poszło.. Error " + code + ". Kliknij aby wpisać nowe hasło</button>";
    });
}
async function passwordcheck() {
  let condition = get("input").value.length > 7 && get("input").value.length < 13 && get("input").value.includes(".") && get("input").value.includes(":") || get("input").value.includes("c-");
  if (api != undefined) {
    if (condition) {
      if (get("input").value.includes("c-")) {
        api = get("input").value.replace("c-", "");
      } else {
        api = "http://192.168." + get("input").value;
      }
      get("password").style.display = "none";
      get("finish").style.display = "inline";
      get("content").style.display = "none";
      sendtotalrequest();
      return;
    } else {
      get("passwordtext").innerText = "Nie możliwe hasło";
      await new Promise(r => setTimeout(r, 1000));
      get("passwordtext").innerText = "Wpisz hasło";
    }
  }
  if (condition) {
    if (get("input").value.includes("c-")) {
      api = "http://" + get("input").value.replace("c-", "");
    } else {
      api = "http://192.168." + get("input").value;
    }
    get("finish").style.display = "inline";
    get("password").style.display = "none";
    get("finish").innerHTML = "<img src='loading.png' size='200'>";
    fetch(api + "/getthings", {
      cache: 'no-cache'
    })
    .then(response => response.text())
    .then(other => {
      console.log(other)
      console.log(JSON.parse(other.replaceAll("[l]", "ł").replaceAll("[o]", "ó").replaceAll("[z]", "ż")))
      teachers = JSON.parse(other.replaceAll("[l]", "ł").replaceAll("[o]", "ó").replaceAll("[z]", "ż"));
      get("finish").style.display = "none";
      get("content").style.display = "flex";
      get("password").style.display = "none";
      for (i = 0; i < teachers.length; i++) {
        data.push("[0, 0, 0]");
      }
      dothisagain();
      newteachers();
    })
    .catch((error) => {
      api = undefined;
      get("content").style.display = "none";
      get("password").style.display = "flex";
      get("finish").style.display = "none";
      console.log(error)
      get("passwordtext").innerText = "Złe hasło, wpisz nowe";
    });
  } else {
    get("passwordtext").innerText = "Nie możliwe hasło";
    await new Promise(r => setTimeout(r, 1000));
    get("passwordtext").innerText = "Wpisz hasło";
  }
}
function mchredirect() {
  let a = document.createElement("a");
  a.href = "https://maciejhub.github.io?teachersurvey";
  a.target = "_blank";
  a.click();
  fetch(api + "/sendvisit")
}
function newpassword() {
  api = undefined;
  get("finish").style.display = "none";
  get("password").style.display = "flex";
}
get("input").addEventListener("keydown", function(e) {
  if (e.key == "Enter" && api == undefined) {
    passwordcheck();
  }
});
function newteachers() {
  if (lastcombination[1] == (teachers.length - 1)) {
    lastcombination[1] = 0
    lastcombination[0] = parseInt(lastcombination[0]) + 1;
  } else {
    lastcombination[1] = parseInt(lastcombination[1]) + 1;
  }
  if (lastcombination[0] == lastcombination[1]) {
    lastcombination[1] = parseInt(lastcombination[1]) + 1;
  }
  if (lastcombination[0] > lastcombination[1]) {
    lastcombination[1] += 1;
    newteachers();
    return;
  }
  clicks += 1;
  get("counter").innerText = clicks.toString() + "/" + lengtth;
  if (lastcombination[0] > teachers.length - 2) { // ???
    get("finish").style.display = "inline";
    get("content").style.display = "none";
    get("finish").innerHTML = "<img src='loading.png' size='200'>";
    sendtotalrequest();
    return;
  }
  one.innerText = teachers[parseInt(lastcombination[0])];
  two.innerText = teachers[parseInt(lastcombination[1])];
}
function choose(which) {
  if (which != "x") {
    let chosendata = JSON.parse(data[teachers.indexOf(get(which).innerText)]);
    chosendata[0] = parseInt(chosendata[0]) + 1;
    let notchosendata;
    data[teachers.indexOf(get(which).innerText)] = JSON.stringify(chosendata);
    if (which == "one") {
      notchosendata = JSON.parse(data[teachers.indexOf(two.innerText)]);
      notchosendata[1] = parseInt(notchosendata[1]) + 1;
      data[teachers.indexOf(two.innerText)] = JSON.stringify(notchosendata);
    } else {
      notchosendata = JSON.parse(data[teachers.indexOf(one.innerText)]);
      notchosendata[1] = parseInt(notchosendata[1]) + 1;
      data[teachers.indexOf(one.innerText)] = JSON.stringify(notchosendata);
    }
  } else {
    let chosendata = JSON.parse(data[teachers.indexOf(one.innerText)]);
    chosendata[2] = parseInt(chosendata[2]) + 1;
    data[teachers.indexOf(one.innerText)] = JSON.stringify(chosendata);
    chosendata = JSON.parse(data[teachers.indexOf(two.innerText)]);
    chosendata[2] = parseInt(chosendata[2]) + 1;
    data[teachers.indexOf(two.innerText)] = JSON.stringify(chosendata);
  }
  newteachers();
}
