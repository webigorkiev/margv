const {expect} = require("chai");
const margv = require("../dist/index.js");

describe("margv", () => {
    describe("common", () => {
        const args = "/usr/bin/node text.spec.js ssr --no-ff -- no include".split(/\s+/);
        const result = margv(args);
        console.log(result)
        it("margv -> function", () => {
            expect(margv).to.a("function");
        });
        it("returns an object", () => {
            expect(result).to.a("object");
        });
        it("$ -> array", () => {
            expect(result["$"]).to.a("array");
        });
        it("$0 -> string", () => {
            expect(result["$0"]).to.a("string");
        });
        it("_ -> array", () => {
            expect(result["_"])
                .to.a("array")
                .that.eql(["no", "include"]);
        });
        it("ssr -> true", () => {
            expect(result.ssr)
                .to.be.a("boolean")
                .that.equal(true);
        });
        it("ff -> false", () => {
            expect(result.ff)
                .to.be.a("boolean")
                .that.equal(false);
        });
    });
    describe("kinds of parameters", () => {
        const args = "/usr/bin/node text.spec.js ssr --no-ff -param1 value1 --param2 +2 param3=value3 last".split(/\s+/);
        const result = margv(args);
        it(`-param1 -> "value1"`, () => {
            expect(result.param1)
                .to.be.a("string")
                .that.equal("value1");
        });
        it(`--param2 -> 2`, () => {
            expect(result.param2)
                .to.be.a("number")
                .that.equal(2);
        });
        it(`param3=value3 -> "value3"`, () => {
            expect(result.param3)
                .to.be.a("string")
                .that.equal("value3");
        });
        it(`last -> true`, () => {
            expect(result.last)
                .to.be.a("boolean")
                .that.equal(true);
        });
    });
    describe("array", () => {
        it(`-a 1 -a 2 -a 3`, () => {
            const args = "/usr/bin/node text.spec.js -a 1 -a 2 -a 3".split(/\s+/);
            const result = margv(args);
            expect(result.a)
                .to.be.a("array")
                .that.eql(["1", "2", "3"]);
        });

        it(`a=[1,2,3]`, () => {
            const args = "/usr/bin/node text.spec.js -a=[1,2,3]".split(/\s+/);
            const result = margv(args);
            expect(result.a)
                .to.be.a("array")
                .that.eql([1, 2, 3]);
        });
    });
    describe("object", () => {
        it(`-a.name=test --a.name=last --a.kind.type=object`, () => {
            const args = "/usr/bin/node text.spec.js -a.name=test --a.name=last --a.kind.type=object".split(/\s+/);
            const result = margv(args);
            expect(result.a)
                .to.be.a("object")
                .that.eql({name: ["test", "last"], kind:{type: "object"}});
        });

        it(`-a={p:1}`, () => {
            const args = "/usr/bin/node text.spec.js -a={p:1}".split(/\s+/);
            const result = margv(args);
            expect(result.a)
                .to.be.a("object")
                .that.eql({p:1});
        });
    });
    describe("null", () => {
        const args = "/usr/bin/node text.spec.js -first null --last=null".split(/\s+/);
        const result = margv(args);
        it(`-first null`, () => {
            expect(result.first)
                .to.be.a("null")
                .that.eql(null);
        });

        it(`--last=null`, () => {
            expect(result.last)
                .to.be.a("null")
                .that.eql(null);
        });
    });

    describe("undefined", () => {
        const args = "/usr/bin/node text.spec.js -first undefined --last=undefined".split(/\s+/);
        const result = margv(args);
        it(`-first undefined`, () => {
            expect(result.first)
                .to.be.a("undefined")
                .that.eql(undefined);
        });

        it(`--last=undefined`, () => {
            expect(result.last)
                .to.be.a("undefined")
                .that.eql(undefined);
        });
    });

    describe("Nan", () => {
        const args = "/usr/bin/node text.spec.js -first NaN --last=NaN".split(/\s+/);
        const result = margv(args);
        it(`-first NaN`, () => {
            expect(result.first)
                .to.be.NaN;
        });

        it(`--last=NaN`, () => {
            expect(result.last)
                .to.be.NaN;
        });
    });
    describe("Infinity", () => {
        const args = "/usr/bin/node text.spec.js -first Infinity --last=Infinity".split(/\s+/);
        const result = margv(args);
        it(`-first Infinity`, () => {
            expect(result.first)
                .to.equal(Infinity);
        });

        it(`--last=Infinity`, () => {
            expect(result.last)
                .to.equal(Infinity);
        });
    });
    describe("Set", () => {
        const args = "/usr/bin/node text.spec.js -first Set([1,2]) --last=Set([1,2])".split(/\s+/);
        const result = margv(args);
        it(`-first Set([1,2])`, () => {
            expect(result.first)
                .to.have.property('size', 2);
        });

        it(`--last=Set([1,2])`, () => {
            expect(result.last)
                .to.have.property('size', 2);
        });
    });
    describe("Map", () => {
        const args = "/usr/bin/node text.spec.js -first Map([[1,2]]) --last=Map([[1,2]])".split(/\s+/);
        const result = margv(args);
        it(`-first Map([[1,2]])`, () => {
            expect(result.first)
                .to.have.lengthOf(1);
        });

        it(`--last=Map([[1,2]])`, () => {
            expect(result.last)
                .to.have.lengthOf(1);
        });
    });
});