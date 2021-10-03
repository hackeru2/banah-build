export default function(app) {
  app.get("/usage", async (req, res) => {
    // var os = require("os-utils");

    // os.cpuUsage(function(v) {
    //   res.json({ CPU_Usage: v });
    // });
    return Math.random() * 100;
  });

  app.get(`/test`, async (req, res) => {
    let reqQuery = JSON.stringify(req.query);
    var exec = require("child_process").exec;
    var result = "";

    var fun = function() {
      let execute = __dirname + "/../../assets/program " + reqQuery;
      //gcc -Wall -o program main.c && ./program hiii amir
      var child = exec(execute, function(err, data, stderr) {
        // console.log(data, stderr);
      });

      child.stdout.on("data", function(data) {
        result += data;
      });
      child.on("close", function() {
        console.log("done");
        console.log(result);
        res.json({ result });
      });
    };

    await fun();
  });
}
