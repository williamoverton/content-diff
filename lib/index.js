#!/usr/bin/env node
"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _nodeHtmlParser = require("node-html-parser");

var _StructureParser = _interopRequireDefault(require("./lib/StructureParser.js"));

var _promises = _interopRequireDefault(require("fs/promises"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _yargs = _interopRequireDefault(require("yargs/yargs"));

var _helpers = require("yargs/helpers");

var _chalk = _interopRequireDefault(require("chalk"));

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Make babel happy
var Monitor = /*#__PURE__*/function () {
  function Monitor() {
    _classCallCheck(this, Monitor);

    this.argv = (0, _yargs["default"])((0, _helpers.hideBin)(process.argv)).usage('Usage: cross-env --profile <profile> --url [URL TO TEST]').option('profile', {
      describe: 'Name of the profile to test against',
      "default": "default-profile",
      alias: "p"
    }).string("profile").option('url', {
      describe: 'URL to test. eg: https://example.com',
      alias: "u"
    }).string("url").option('initUrls', {
      describe: 'List of urls to create profile with'
    }).array('initUrls').option('profilePath', {
      describe: 'Location to store generated profiles in',
      "default": process.cwd(),
      alias: "path"
    }).string("profilePath").option('learn', {
      describe: 'Relearn profile even if it already exist',
      alias: "l"
    }).check(function (_ref) {
      var profile = _ref.profile,
          url = _ref.url,
          initUrls = _ref.initUrls,
          profilePath = _ref.profilePath;

      if (!url && !initUrls) {
        throw new Error("You must supply --profile and either --url or --initUrls");
      }

      return true;
    }).help().argv;
    this.run();
  }

  _createClass(Monitor, [{
    key: "run",
    value: function () {
      var _run = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee() {
        var profile, testPage, matched;
        return _regeneratorRuntime["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getPageProfile();

              case 2:
                profile = _context.sent;

                if (!(!profile || this.argv.learn)) {
                  _context.next = 20;
                  break;
                }

                if (!(this.argv.initUrls && this.argv.initUrls.length > 0)) {
                  _context.next = 18;
                  break;
                }

                console.log(_chalk["default"].cyan("Learning new profile for ".concat(this.argv.profile, " from ").concat(this.argv.initUrls.length, " init urls...")));
                _context.t0 = this;
                _context.next = 9;
                return this.generatePageStructure();

              case 9:
                _context.t1 = _context.sent;
                _context.next = 12;
                return _context.t0.saveProfile.call(_context.t0, _context.t1);

              case 12:
                _context.next = 14;
                return this.getPageProfile();

              case 14:
                profile = _context.sent;
                console.log(_chalk["default"].cyan("Profile created and saved to ".concat(_path["default"].join(this.argv.profilePath, "profile-".concat(this.argv.profile, ".json")))));
                _context.next = 20;
                break;

              case 18:
                console.log(_chalk["default"].red("Profile \"".concat(this.argv.profile, "\" does not exist! Pass --initUrls to generate it.")));
                process.exit(1);

              case 20:
                if (!("url" in this.argv)) {
                  _context.next = 27;
                  break;
                }

                console.log(_chalk["default"].cyan("Testing ".concat(this.argv.url, " against profile...")));
                _context.next = 24;
                return this.getContentOfPage(this.argv.url);

              case 24:
                testPage = _context.sent;
                matched = new _StructureParser["default"]([(0, _nodeHtmlParser.parse)(testPage.data)]).doPagesMatchProfile(profile);

                if (matched) {
                  console.log(_chalk["default"].greenBright("Success! ") + _chalk["default"].green("Page matches profile!"));
                } else {
                  console.log(_chalk["default"].redBright("Failure. ") + _chalk["default"].red("Page did not match against profile."));
                  process.exit(1);
                }

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run() {
        return _run.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: "saveProfile",
    value: function () {
      var _saveProfile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee2(structure) {
        var profile;
        return _regeneratorRuntime["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                profile = {
                  structure: structure
                };
                _context2.next = 3;
                return _promises["default"].writeFile(_path["default"].join(this.argv.profilePath, "profile-".concat(this.argv.profile, ".json")), JSON.stringify(profile));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function saveProfile(_x) {
        return _saveProfile.apply(this, arguments);
      }

      return saveProfile;
    }()
  }, {
    key: "getPageProfile",
    value: function () {
      var _getPageProfile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee3() {
        return _regeneratorRuntime["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.t0 = JSON;
                _context3.next = 4;
                return _promises["default"].readFile(_path["default"].join(this.argv.profilePath, "profile-".concat(this.argv.profile, ".json")).toString("ascii"));

              case 4:
                _context3.t1 = _context3.sent;
                return _context3.abrupt("return", _context3.t0.parse.call(_context3.t0, _context3.t1));

              case 8:
                _context3.prev = 8;
                _context3.t2 = _context3["catch"](0);
                return _context3.abrupt("return", null);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 8]]);
      }));

      function getPageProfile() {
        return _getPageProfile.apply(this, arguments);
      }

      return getPageProfile;
    }()
  }, {
    key: "generatePageStructure",
    value: function () {
      var _generatePageStructure = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee4() {
        var _this = this;

        var responses, bodies;
        return _regeneratorRuntime["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return Promise.all(this.argv.initUrls.map(function (url) {
                  return _this.getContentOfPage(url);
                }));

              case 2:
                responses = _context4.sent;

                if (this.areInitResponsesAlike(responses)) {
                  _context4.next = 5;
                  break;
                }

                throw new Error("Init urls for ".concat(this.argv.profile, " are not alike."));

              case 5:
                bodies = responses.map(function (res) {
                  return (0, _nodeHtmlParser.parse)(res.data);
                });
                return _context4.abrupt("return", new _StructureParser["default"](bodies).findSharedStructure());

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function generatePageStructure() {
        return _generatePageStructure.apply(this, arguments);
      }

      return generatePageStructure;
    }()
  }, {
    key: "areInitResponsesAlike",
    value: function areInitResponsesAlike(responses) {
      return responses.every(function (val) {
        return val.status == responses[0].status;
      });
    }
  }, {
    key: "getContentOfPage",
    value: function () {
      var _getContentOfPage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee5(url) {
        return _regeneratorRuntime["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                console.log(_chalk["default"].grey("\tRequesting ".concat(url, "...")));
                return _context5.abrupt("return", (0, _axios["default"])({
                  method: "get",
                  url: url,
                  headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
                    "cache-control": "no-cache"
                  },
                  validateStatus: function validateStatus() {
                    return true;
                  }
                }));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function getContentOfPage(_x2) {
        return _getContentOfPage.apply(this, arguments);
      }

      return getContentOfPage;
    }()
  }]);

  return Monitor;
}();

new Monitor();