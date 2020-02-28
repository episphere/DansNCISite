async function invite(formElement) {
  var token = formElement.querySelector("#bearerToken").value;
  if (token.length > 0) {
    localStorage.setItem("bearerToken", token);
  } else {
    token = localStorage.getItem("bearerToken");
    if (token == null || token.length == 0) {
      alert("please enter bearer token");
      return;
    }
    formElement.querySelector("#bearerToken").value = token;
  }
  var start = parseInt(formElement.querySelector("#startid").value);
  var length = parseInt(formElement.querySelector("#numTokens").value);
  var array = Array.from(new Array(length).keys())
    .map(x => "NCI-" + (x + start))
    .map(x => ({ studyId: x, pin: x }));
  console.log(array);
  var body = JSON.stringify({ data: JSON.stringify(array) })
    .replace(/\"\[/g, "[")
    .replace(/\]\"/g, "]")
    .replace(/\\\"/g, '"');
  var header = { "Content-Type": "application/json", Authorization: "Bearer " + token };
  const url = "https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getParticipantToken";
  console.log(header);
  console.log(body);

  var resp = document.getElementById("resp");
  const response = fetch(url, {
    method: "POST",
    headers: header,
    body: body
  })
    //    .then(res => res.text())
    .then(res => res.json())
    .then(x => {
      console.log(x);
      var txt = '<table class="table table-striped"><thead><tr><th>Study Id</th><th>Token</th><th>url</th></tr></thead>';
      x.data.forEach(token => {
        txt +=
          "<tr><td>" +
          token.pin +
          "</td><td>" +
          token.token +
          "</td><td>https://episphere.github.io/connectApp?token=" +
          token.token +
          "</td></tr>";
        //resp.innerHTML += "<pre>" + token.pin + "                 " + token.token + "</pre>";
      });
      txt += "</table>";
      resp.innerHTML = txt;
    });

  return response;
}
