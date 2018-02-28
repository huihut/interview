class Solution {
public:
    vector<int> getRow(int rowIndex) {
        vector<int> v(rowIndex + 1, 0);
        v[0] = 1;
        for (int i = 0; i < rowIndex; i++){
            for(int j = i + 1; j > 0; j--){
                v[j] += v[j - 1];
            } 
        }
        return v;
    }
};