#include <iostream>
using namespace std;

int main()
{

    int n,m,Numb;
    cout<<"Enter the number you want to print:";
    cin>>Numb;
    cout<<"Enter the number of row:";
    cin>>n;
    cout<<"Enter the number of column:";
    cin>>m;
    for(int row=1; row<=n ;row++)
     {
        for(int col=1; col<=m ; col++)
        {
            cout<<Numb<<" ";
        }
        cout<<endl;
     }
}