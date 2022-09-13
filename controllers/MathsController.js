const fs = require('fs');
module.exports =
    class MathsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext);
        }

        verifyOperation(params, operation) {
            let value;
            let obj = {};
            obj.op = params.op;
            if (params.op == '+' || params.op == '-' || params.op == '*' || params.op == '/' || params.op == '%') {
                obj.x = params.x;
                obj.y = params.y;
                if (!("y" in params) || !("x" in params))
                    value = "the value of x or y is undefined";
                else if (isNaN(params.x) || isNaN(params.y))
                    value = "x or y is not a number";
                else value = operation(params);
            } else {
                obj.n = params.n;
                if (!("n" in params))
                    value = "the value of n is undefined";
                else if (isNaN(params.n))
                    value = "n is not a number";
                else value = operation(params);
            }
            if (isNaN(value)) obj.error = value; else obj.value = value;
            return obj;
        }

        get() {
            let params = this.HttpContext.path.params;
            
            if (Object.keys(params).length <= 0 || (!("op" in params))) {
                let html = fs.readFileSync('wwwroot/math.html');
                this.HttpContext.response.HTML(html);
            } else {
                let obj;
                if (params.op == ' ') params.op = '+';
                switch(params.op) {
                    case '+':
                        obj = this.verifyOperation(params, function(ns) {
                            return Number(ns.x) + Number(ns.y);
                        });
                        break;
                    case '-':
                        obj = this.verifyOperation(params, function(ns) {
                            return Number(ns.x) - Number(ns.y);
                        });
                        break;
                    case '*':
                        obj = this.verifyOperation(params, function(ns) {
                            return Number(ns.x) * Number(ns.y);
                        });
                        break;
                    case '/':
                        obj = this.verifyOperation(params, function(ns) {
                            return Number(ns.x) / Number(ns.y);
                        });
                        break;
                    case '%':
                        obj = this.verifyOperation(params, function(ns) {
                            return Number(ns.x) % Number(ns.y);
                        });
                        break;
                    case '!':
                        obj = this.verifyOperation(params, function(ns) {
                            var factorielle = function(n) {
                                var i, n, f = 1;
                                for (i = 1; i <= n; i++) f = f * i;
                                return f;
                            }
                            return factorielle(Number(ns.n));
                        });
                        break;
                    case 'p':
                        obj = this.verifyOperation(params, function(ns) {
                            var estPremier = function(n) {
                                for (var i = 2; i < n; i++) if (n%i === 0) return false;
                                return n > 1;
                            }
                            return estPremier(Number(ns.n));
                        });
                        break;
                    case 'np':
                        obj = this.verifyOperation(params, function(ns) {
                            var estPremier = function(n) {
                                for (var i = 2; i < n; i++) if (n%i === 0) return false;
                                return n > 1;
                            }
                            var getPremier = function(nieme) {
                                var count = 0;
                                var i = 0;
                                while (count < nieme) {
                                    i++;
                                    if (estPremier(i)) count++;
                                }
                                return i;
                            }
                            return getPremier(Number(ns.n));
                        });
                        break;
                    default:
                        obj.error = "operator used does not exist in available operators"
                }
                this.HttpContext.response.JSON(obj);
            }
        }
    }