class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int max=0, begin=0, end=0;
        bool up=false, down=false;
        for (int i=1; i<prices.size(); i++) {
            if (prices[i] > prices[i-1] && up==false){ // goes up
                begin = i-1;
                up = true;
                down = false;
            }
            if (prices[i] < prices[i-1] && down==false) { // goes down
                end = i-1;
                down = true;
                up = false;
                max += (prices[end] - prices[begin]);
            }
        }
        // edge case 
        if (begin < prices.size() && up==true){
            end = prices.size() - 1;
            max += (prices[end] - prices[begin]);
        }
        return max;
    }
};