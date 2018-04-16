/*
二叉搜索树的查找算法:

在二叉搜索树b中查找x的过程为：

1. 若b是空树，则搜索失败，否则：
2. 若x等于b的根节点的数据域之值，则查找成功；否则：
3. 若x小于b的根节点的数据域之值，则搜索左子树；否则：
4. 查找右子树。 

*/

// 在根指针T所指二叉查找树中递归地查找其关键字等于key的数据元素，若查找成功，
// 则指针p指向該数据元素节点，并返回TRUE，否则指针指向查找路径上访问的最终
// 一个节点并返回FALSE，指针f指向T的双亲，其初始调用值为NULL
Status SearchBST(BiTree T, KeyType key, BiTree f, BiTree &p){

  if(!T) { //查找不成功
    p=f;
    return false;
  }
  else if (key == T->data.key) { //查找成功
    p=T;
    return true;
  }
  else if (key < T->data.key) //在左子树中继续查找
    return SearchBST(T->lchild, key, T, p);
  else //在右子树中继续查找
    return SearchBST(T->rchild, key, T, p);
}