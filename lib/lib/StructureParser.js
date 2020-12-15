"use strict";

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var debug = (0, _debug["default"])("monitor:structure-parser");

module.exports = /*#__PURE__*/function () {
  function StructureParser(bodies) {
    _classCallCheck(this, StructureParser);

    this.bodies = bodies;
  }

  _createClass(StructureParser, [{
    key: "doPagesMatchProfile",
    value: function doPagesMatchProfile(profile) {
      var _this = this;

      return this.bodies.every(function (b) {
        return _this.doesBodyMatchProfile(_this.findSharedStructure(b), profile.structure);
      });
    }
  }, {
    key: "doesBodyMatchProfile",
    value: function doesBodyMatchProfile(body, profile) {
      var _this2 = this;

      return Object.keys(profile).every(function (k) {
        return _this2.doesElementMatchElement(body[k], profile[k]);
      });
    }
  }, {
    key: "doesElementMatchElement",
    value: function doesElementMatchElement(be, pe) {
      var _this3 = this;

      if (be === null && pe !== null) return false;
      if (be === null && pe === null) return true;
      if (be === undefined && pe !== undefined) return false;
      if (be === undefined && pe === undefined) return true;
      if (_typeof(be) !== _typeof(pe)) return false;

      switch (_typeof(pe)) {
        case "number":
        case "string":
          return be === pe;
          break;

        case "object":
          return Object.keys(pe).every(function (k) {
            var matched = _this3.doesElementMatchElement(be[k], pe[k]); // if(!matched){
            //     debug(k)
            //     debug(be[k])
            //     debug(pe[k])
            //     process.exit(0);
            // }


            return matched;
          });
          break;

        default:
          throw new Error("doesElementMatchElement got an unexpected type! ".concat(_typeof(pe)));
          break;
      }
    }
  }, {
    key: "findSharedStructure",
    value: function findSharedStructure() {
      return this.findSharedElements(this.bodies);
    }
  }, {
    key: "findSharedElements",
    value: function findSharedElements(elements) {
      var _this4 = this;

      var commonKeys = this.getCommonKeysBetweenObjects(elements);
      var identicalStruct = {};
      commonKeys.forEach(function (c) {
        if (elements[0][c] == null || elements[0][c] == undefined) {
          identicalStruct[c] = elements[0][c];
          return;
        }

        switch (_typeof(elements[0][c])) {
          case "object":
            identicalStruct[c] = _this4.findSharedElements(elements.map(function (e) {
              return e[c];
            }));
            break;

          case "number":
          case "string":
            if (_this4.areAllValuesIdentical(elements.map(function (e) {
              return e[c];
            }))) {
              identicalStruct[c] = elements[0][c];
            }

            break;

          default:
            throw "Got unknown type in structure! ".concat(c, ":").concat(_typeof(elements[0][c]));
            break;
        }
      }); // debug(identicalStruct)

      return identicalStruct;
    }
  }, {
    key: "areAllValuesIdentical",
    value: function areAllValuesIdentical(values) {
      return values.every(function (v) {
        return v == values[0];
      });
    }
  }, {
    key: "getCommonKeysBetweenObjects",
    value: function getCommonKeysBetweenObjects(objects) {
      try {
        var commonKeys = Object.keys(objects[0]);
        objects.map(function (e) {
          commonKeys = commonKeys.filter(function (k) {
            return k in e;
          });
        }); // Return if all keys are the same type in each object

        return commonKeys.filter(function (k) {
          return objects.every(function (o) {
            return _typeof(o[k]) == _typeof(objects[0][k]);
          });
        }).filter(function (k) {
          return k != "parentNode";
        });
      } catch (e) {
        debug(objects);
        throw new Error(e);
      }
    }
  }]);

  return StructureParser;
}();