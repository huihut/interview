class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        vector<int> sum;
        for(auto i = 0;  i < nums.size(); i++)
        {
            for(auto j = i+1; j < nums.size(); j++)
            {
                if(i == j) continue;
                if(nums[i] + nums[j] != target) continue;
                sum.push_back(i);
                sum.push_back(j);
                return sum;
            }
        }
        return sum;
    }
};