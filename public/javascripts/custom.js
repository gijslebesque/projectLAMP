var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";
recognition.continuous = true;
recognition.start();

console.log("hi");

recognition.onresult = function(event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      if (
        event.results[i][0].transcript == "james' is a dick" ||
        event.results[i][0].transcript == "light on"
      ) {
        axios
          .post("/postMessage", {
            message: "Go"
          })
          .then(result => {
            debugger;
            document.write("I agree");
          });
      }
      console.log(`You said : ${event.results[i][0].transcript}`);
    }
  }
};
