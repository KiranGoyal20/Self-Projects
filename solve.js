const BASE = "https://workwithus.lucioai.com";
const AUTH = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS2lyYW4iLCJlbWFpbCI6ImtpcmFuZ295YWwxOTk4QGdtYWlsLmNvbSIsImRhdGUiOiIyMDI2LTAxLTMxIDEzOjM3OjU0In0.plRzvLcFmiTKE0J8WGn8IJIfFuAPsh0rkNP3KIl6VGo";

(async () => {
  // 1 fetch quiz

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS2lyYW4iLCJlbWFpbCI6ImtpcmFuZ295YWwxOTk4QGdtYWlsLmNvbSIsImRhdGUiOiIyMDI2LTAxLTMxIDEzOjM3OjU0In0.plRzvLcFmiTKE0J8WGn8IJIfFuAPsh0rkNP3KIl6VGo");
  myHeaders.append("Cookie", "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS2lyYW4iLCJlbWFpbCI6ImtpcmFuZ295YWwxOTk4QGdtYWlsLmNvbSIsImRhdGUiOiIyMDI2LTAxLTMxIDEzOjM3OjU0In0.plRzvLcFmiTKE0J8WGn8IJIfFuAPsh0rkNP3KIl6VGo");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch("https://workwithus.lucioai.com/logic-it-out", requestOptions)
    .then((response) => response.text())
    .then((res) => {
      console.log("Result: ", res);
      const data = JSON.parse(res);
      const token = data.token;

      console.log("token:: ", token);
      const payload = JSON.parse(
        Buffer.from(token.split(".")[0], "base64").toString()
      );
      console.log("payload",payload);
      const answers = payload.answers;


      const raw = JSON.stringify({ token, answers }) //"{\n    \"token\":  \"eyJhbnN3ZXJzIjpbIkxpZ2h0IHllYXIiLDksIlNwYW5pc2giXX0.aX4xFA.v57RRFZzA_OumYwNLokqYi48uPw\",\n    \"answers\": [\n    \"Light year\",\n    9,\n    \"Spanish\"\n  ]\n}";

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("https://workwithus.lucioai.com/fastest-fingers-first", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    })
    .catch((error) => console.error(error));

  // const res = await fetch(`${BASE}/logic-it-out`, {
  //   headers: {
  //     Authorization: `${AUTH}`
  //   }
  // });

  // console.log(res);

  // const data = await res.json();
  // const token = data.token;

  // // 2 decode JWT
  // const payload = JSON.parse(
  //   Buffer.from(token.split(".")[1], "base64").toString()
  // );

  // const answers = payload.answers;

  // // 3 submit
  // const submit = await fetch(`${BASE}/fastest-fingers-first`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${AUTH}`,
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({ token, answers })
  // });

  // console.log(await submit.json());
})();