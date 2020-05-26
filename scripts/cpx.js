class Cpx {
    constructor(a, b) {
        this.real = a;
        this.imag = b;
        this.squaredModule = a * a + b * b;
    }
    static mult(cpx1, cpx2) {
        return new Cpx(cpx1.real * cpx2.real - cpx1.imag * cpx2.imag, cpx1.imag * cpx2.real + cpx1.real * cpx2.imag);
    }
    static add(cpx1, cpx2) {
        return new Cpx(cpx1.real + cpx2.real, cpx1.imag + cpx2.imag);
    }
    static substract(cpx1, cpx2) {
        return new Cpx(cpx1.real - cpx2.real, cpx1.imag - cpx2.imag);
    }
    static divide(cpx1, cpx2) {
        let num = this.mult(cpx1, this.conjugate(cpx2));
        let den = cpx2.real ** 2 + cpx2.imag ** 2;
        return new Cpx(num.real / den, num.imag / den);
    }
    static conjugate(cpx) {
        return new Cpx(cpx.real, -cpx.imag);
    }
    static pow(cpx, n) {
        let z = cpx; // n = 1
        for (let i = 2; i <= n; i++) {
            z = this.mult(z, cpx);
        }
        return z;
    }
    static squaredDistance(cpx1, cpx2) {
        return (cpx1.real - cpx2.real) ** 2 + (cpx1.imag - cpx2.imag) ** 2;
    }
}