class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> triangle;
        for(int i = 0; i < numRows; i++){
            vector<int> v;
            if(i==0){
                v.push_back(1);
            }
            else{
                v.push_back(1);
                for(int j = 0; j < triangle[i-1].size()-1; j++){
                    v.push_back(triangle[i-1][j] + triangle[i-1][j+1]);
                }
                v.push_back(1);
            }
            triangle.push_back(v);
        }
        return triangle;
    }
};