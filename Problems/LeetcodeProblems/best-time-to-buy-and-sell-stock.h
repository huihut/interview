class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int left = 0, right = 0;
        int max = 0, temp = 0;
        for(auto i = 0; i < prices.size(); ++i) {
            right = i;
            temp = prices[right] - prices[left];
            if(temp < 0) left = i;
            if(max < temp) max = temp;
        }
        return max;
    }
};