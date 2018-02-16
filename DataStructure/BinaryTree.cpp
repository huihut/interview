#include<stdio.h>
#include<stdlib.h>

#define TRUE 1
#define FALSE 0
#define OK 1
#define ERROR 0
#define OVERFLOW -1
#define SUCCESS 1
#define UNSUCCESS 0

#define dataNum 5
int i = 0;
int dep = 0;
char data[dataNum] = { 'A', 'B', 'C', 'D', 'E' };

typedef int Status;
typedef char TElemType;

typedef struct BiTNode
{
    TElemType data;
    struct BiTNode *lchild, *rchild;
}BiTNode, *BiTree;

void InitBiTree(BiTree &T);                                //创建一颗空二叉树
BiTree MakeBiTree(TElemType e, BiTree L, BiTree R);        //创建一颗二叉树T，其中根节点的值为e，L和R分别作为左子树和右子树
void DestroyBiTree(BiTree &T);                            //销毁二叉树
Status BiTreeEmpty(BiTree T);                            //对二叉树判空。若为空返回TRUE，否则FALSE
Status BreakBiTree(BiTree &T, BiTree &L, BiTree &R);    //将一颗二叉树T分解成根、左子树、右子树三部分
Status ReplaceLeft(BiTree &T, BiTree &LT);                //替换左子树。若T非空，则用LT替换T的左子树，并用LT返回T的原有左子树
Status ReplaceRight(BiTree &T, BiTree &RT);                //替换右子树。若T非空，则用RT替换T的右子树，并用RT返回T的原有右子树

int Leaves(BiTree T);
int Depth(BiTree T);

Status visit(TElemType e);
void UnionBiTree(BiTree &Ttemp);


//InitBiTree空二叉树是只有一个BiTree指针？还是有一个结点但结点域为空？
void InitBiTree(BiTree &T)
{
    T = NULL;
}

BiTree MakeBiTree(TElemType e, BiTree L, BiTree R)
{
    BiTree t;
    t = (BiTree)malloc(sizeof(BiTNode));
    if (NULL == t) return NULL;
    t->data = e;
    t->lchild = L;
    t->rchild = R;
    return t;
}
      
Status visit(TElemType e)
{
    printf("%c", e);
    return OK;
}


int Leaves(BiTree T)   //对二叉树T求叶子结点数目
{
    int l = 0, r = 0;

    if (NULL == T) return 0;
    if (NULL == T->lchild && NULL == T->rchild) return 1;

    //问题分解，2个子问题


    //求左子树叶子数目
    l = Leaves(T->lchild);

    //求右子树叶子数目
    r = Leaves(T->rchild);

    //组合
    return r + l;
}

int depTraverse(BiTree T)    //层次遍历：dep是个全局变量,高度
{
    if (NULL == T) return ERROR;

    dep = (depTraverse(T->lchild) > depTraverse(T->rchild)) ? depTraverse(T->lchild) : depTraverse(T->rchild);

    return dep + 1;
}


void levTraverse(BiTree T, Status(*visit)(TElemType e), int lev) //高度遍历：lev是局部变量，层次
{
    if (NULL == T) return;

    visit(T->data);
    printf("的层次是%d\n", lev);

    levTraverse(T->lchild, visit, ++lev);
    levTraverse(T->rchild, visit, lev);

}

void InOrderTraverse(BiTree T, Status(*visit)(TElemType e), int &num) //num是个全局变量
{
    if (NULL == T) return;
    visit(T->data);
    if (NULL == T->lchild && NULL == T->rchild) { printf("是叶子结点"); num++; }
    else printf("不是叶子结点");
    printf("\n");
    InOrderTraverse(T->lchild, visit, num);
    InOrderTraverse(T->rchild, visit, num);
}

Status BiTreeEmpty(BiTree T)
{
    if (NULL == T) return TRUE;
    return FALSE;
}

Status BreakBiTree(BiTree &T, BiTree &L, BiTree &R)
{
    if (NULL == T) return ERROR;
    L = T->lchild;
    R = T->rchild;
    T->lchild = NULL;
    T->rchild = NULL;
    return OK;
}

Status ReplaceLeft(BiTree &T, BiTree &LT)
{
    BiTree temp;
    if (NULL == T) return ERROR;
    temp = T->lchild;
    T->lchild = LT;
    LT = temp;
    return OK;
}

Status ReplaceRight(BiTree &T, BiTree &RT)
{
    BiTree temp;
    if (NULL == T) return ERROR;
    temp = T->rchild;
    T->rchild = RT;
    RT = temp;
    return OK;
}

void UnionBiTree(BiTree &Ttemp)
{
    BiTree L = NULL, R = NULL;
    L = MakeBiTree(data[i++], NULL, NULL);
    R = MakeBiTree(data[i++], NULL, NULL);
    ReplaceLeft(Ttemp, L);
    ReplaceRight(Ttemp, R);
}


int main()
{

    BiTree T = NULL, Ttemp = NULL;

    InitBiTree(T);
    if (TRUE == BiTreeEmpty(T)) printf("初始化T为空\n");
    else printf("初始化T不为空\n");

    T = MakeBiTree(data[i++], NULL, NULL);

    Ttemp = T;
    UnionBiTree(Ttemp);

    Ttemp = T->lchild;
    UnionBiTree(Ttemp);


    Status(*visit1)(TElemType);
    visit1 = visit;
    int num = 0;
    InOrderTraverse(T, visit1, num);
    printf("叶子结点是 %d\n", num);

    printf("叶子结点是 %d\n", Leaves(T));

    int lev = 1;
    levTraverse(T, visit1, lev);

    printf("高度是 %d\n", depTraverse(T));
                          
    return 0;
}