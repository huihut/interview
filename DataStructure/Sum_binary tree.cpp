/* function to calculate sum of binary tree */

long int sumBT(Node* root)
{
    if(root==NULL)
    return 0;
    
    long int data=root->key;
    long int sum=data;
    sum=sum+sumBT(root->left);
    sum=sum+sumBT(root->right);
    return sum;
    
}
© 2020 GitHub, Inc.
