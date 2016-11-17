/*jshint node:true*/
module.exports = {
  "framework": "ava",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launchers": {
    "Node": {
      "command": "npm test",
      "output": "tap"
    }
  },
  "launch_in_ci": [
    "Node"
  ],
  "launch_in_dev": [
    "Node"
  ]
};
