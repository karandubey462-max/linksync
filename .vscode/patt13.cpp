#include <iostream>
using namespace std;

int main()
{   
     int n,count;
    cout<<"Enter the number of  : ";
    cin>>n;
    
     for(int row=1; row<=n ;row++)
     {  count=row;
        for(int col=row; col>=1 ; col--)
        {
            cout<<count<<" " ;
            count--;
            
        }
        cout<<endl;
     }
    }   