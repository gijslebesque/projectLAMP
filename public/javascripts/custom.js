var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";
recognition.continuous = true;
recognition.start();

recognition.onerror = function(event) {
  console.log(event.error);
};

console.log("hi");

recognition.onresult = function(event) {
  console.log(event);
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      if (
        event.results[i][0].transcript == "james' is a dick" ||
        event.results[i][0].transcript == "light on" ||
        event.results[i][0].transcript == "light of" ||
        event.results[i][0].transcript == "light off"
      ) {
        axios
          .post("/postMessage", {
            message: "Go"
          })
          .then(result => {
            console.log("Success");
          });
      }
      console.log(`You said : ${event.results[i][0].transcript}`);
    }
  }
};
