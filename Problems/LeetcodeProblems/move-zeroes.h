class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int left = 0, right = 0;
        for(; left < nums.size() && nums[left] != 0; left++);
        for(right = left; right < nums.size(); right++) {
            if(nums[right] == 0) continue;
            nums[left++] = nums[right];
        }
        while(left < nums.size()) nums[left++] = 0;
    }
};