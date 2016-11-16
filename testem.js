/*jshint node:true*/
module.exports = {
  "framework": "ava",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launchers": {
    "Node": {
      "command": "ava",
      "output": "tap"
    }
  },
  "launch_in_ci": [
    "PhantomJS",
    "Node"
  ],
  "launch_in_dev": [
    "PhantomJS",
    "Node"
  ]
};
