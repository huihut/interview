class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int n = nums.size(), pos = 0;
        if(n <= 1) 
            return n;
        for(int i = 0; i < n-1; ++i) {
            if(nums[i] != nums[i+1]) {
                nums[++pos] = nums[i+1];
            }
        }
        return pos+1;
    }
};