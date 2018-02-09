class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size()-1;
        int max = 0, temp = 0;
        while(left < right) {
            temp = (right - left) * (height[left] < height[right] ? height[left] : height[right]);
            if(max < temp) max = temp;
            if(height[left] < height[right]) {
                do{
                    left++;
                } while(left < right && height[left-1] >= height[left]);
            }
            else {
                do{
                    right--;
                } while(left < right && height[right] <= height[right+1]);
            }
        }
        return max;
    }
};