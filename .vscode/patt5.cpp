#include <iostream>
using namespace std;

int main()
{   
     int n,m,count;
    cout<<"Enter the number of row : ";
    cin>>n;
    cout<<"Enter the number of column:";
    cin>>m;
     for(int row=1; row<=n ;row++)
     {  count=n;
        for(int col=1; col<=m ; col++)
        {
            cout<<count<<" ";
            count--;
        }
        cout<<endl;
     }
    }   