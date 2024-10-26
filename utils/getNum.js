export default function getNum(str) {
    let isFloat = false;
    let ans = [];
    for (let i = 0; i < str.length; i++) {
        if (!isNaN(str[i])) {
            ans.push(str[i]);
        }
        else if (str[i] == ".") {
            if (!isFloat) {
                ans.push(str[i]);
                isFloat = true;
            } else {
                return NaN;
            }
        }
    }
    return Number(ans.join(""));
}