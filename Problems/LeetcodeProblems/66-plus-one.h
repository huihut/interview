class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        int carry = 1;
        for(int i = digits.size() - 1; i >= 0; --i) {
            int add = digits[i] + carry;
            digits[i] = add % 10;
            carry = add / 10;
        }
        if(carry > 0) {
            digits.insert(digits.begin(), carry);
        }
        return digits;
    }
};