#define MIN_INT -2147483648
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int max = MIN_INT, temp = 0;
        for(auto i = 0; i < nums.size(); ++i) {
            temp += nums[i];
            if(temp > max) max = temp;
            if(temp < 0) temp = 0;
        }
        return max;
    }
};